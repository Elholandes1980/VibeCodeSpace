/**
 * lib/services/pulse-ai.ts
 *
 * AI-powered content analysis for Pulse feature.
 * Uses Claude API to score relevance and generate Dutch summaries.
 * Filters content for the indie hacker/vibecoding audience.
 *
 * Related:
 * - scripts/pulse-ingest.ts
 * - payload/collections/PulseItems.ts
 */

export interface PulseAIAnalysis {
  relevanceScore: number
  category: 'tool-launch' | 'success-story' | 'tips-tutorial'
  titleNL: string
  summaryNL: string
  reasoning: string
}

export interface PulseItemInput {
  source: string
  title: string
  url: string
  content?: string
  author?: string
}

const SYSTEM_PROMPT = `Je bent een content curator voor VibeCodeSpace, een platform voor indie hackers, solo founders en vibecoding enthousiastelingen.

Je analyseert content van Hacker News, Product Hunt, Dev.to en Indie Hackers om te bepalen of het relevant is voor onze doelgroep.

DOELGROEP:
- Indie hackers en solo founders
- Developers die AI-tools gebruiken om sneller te bouwen (vibecoding)
- Mensen geinteresseerd in "building in public"
- Nederlandse en internationale bouwers

RELEVANTIE CRITERIA (score 0-100):
90-100: Direct relevant - AI coding tools, vibecoding, solo founder success, building in public updates
70-89: Zeer relevant - Developer tools, startup tips, side project inspiration, AI productiviteit
50-69: Enigszins relevant - General tech news met leerwaarde voor builders
0-49: Niet relevant - Enterprise news, grote corporates, irrelevant tech, drama/controversy

CATEGORIEEN:
- tool-launch: Nieuwe AI tools, updates aan bestaande tools, product launches relevant voor developers
- success-story: MRR updates, exit verhalen, build in public milestones, indie hacker wins
- tips-tutorial: How-to guides, development tips, workflow optimizations, AI prompting tips

RICHTLIJNEN VOOR OUTPUT:
- titleNL: Kort, actief, informatief (geen clickbait). Max 80 karakters.
- summaryNL: 1-2 zinnen die de kernboodschap samenvatten voor onze doelgroep. Focus op wat relevant is voor indie hackers/developers.
- reasoning: Korte uitleg (1 zin) waarom dit wel/niet relevant is.

OUTPUT FORMAT (alleen JSON, geen andere tekst):
{
  "relevanceScore": number,
  "category": "tool-launch" | "success-story" | "tips-tutorial",
  "titleNL": "Nederlandse titel",
  "summaryNL": "Nederlandse samenvatting",
  "reasoning": "Korte uitleg"
}`

const USER_PROMPT_TEMPLATE = `Analyseer dit item:

BRON: {source}
TITEL: {title}
URL: {url}
INHOUD: {content}
AUTEUR: {author}

Geef je analyse als JSON (alleen de JSON, geen andere tekst).`

/**
 * Analyze a pulse item using Claude API.
 * Returns null if the item should be skipped (API error or parsing failure).
 */
export async function analyzePulseItem(item: PulseItemInput): Promise<PulseAIAnalysis | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('[pulse-ai] ANTHROPIC_API_KEY not set')
    return null
  }

  try {
    const userPrompt = USER_PROMPT_TEMPLATE.replace('{source}', item.source)
      .replace('{title}', item.title)
      .replace('{url}', item.url)
      .replace('{content}', item.content || '(geen content beschikbaar)')
      .replace('{author}', item.author || 'Onbekend')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`[pulse-ai] Claude API error: ${response.status} - ${error}`)
      return null
    }

    const data = await response.json()
    const text = data.content[0]?.text || ''

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[pulse-ai] No JSON found in response:', text.substring(0, 200))
      return null
    }

    const parsed = JSON.parse(jsonMatch[0])

    // Validate and normalize the response
    const validCategories = ['tool-launch', 'success-story', 'tips-tutorial']
    const category = validCategories.includes(parsed.category) ? parsed.category : 'tips-tutorial'

    return {
      relevanceScore: Math.min(100, Math.max(0, Number(parsed.relevanceScore) || 0)),
      category,
      titleNL: String(parsed.titleNL || item.title).substring(0, 200),
      summaryNL: String(parsed.summaryNL || '').substring(0, 500),
      reasoning: String(parsed.reasoning || '').substring(0, 300),
    }
  } catch (error) {
    console.error('[pulse-ai] Analysis failed:', error)
    return null
  }
}

/**
 * Batch analyze multiple items with rate limiting.
 * Waits 500ms between requests to avoid API rate limits.
 */
export async function analyzePulseItemsBatch(
  items: PulseItemInput[]
): Promise<Map<string, PulseAIAnalysis>> {
  const results = new Map<string, PulseAIAnalysis>()

  for (const item of items) {
    const analysis = await analyzePulseItem(item)
    if (analysis) {
      results.set(item.url, analysis)
    }

    // Rate limiting - wait between API calls
    await new Promise((r) => setTimeout(r, 500))
  }

  return results
}
