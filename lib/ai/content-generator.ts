/**
 * lib/ai/content-generator.ts
 *
 * AI-powered content generation for tools.
 * Uses Anthropic Claude API when available, falls back to template-based content.
 * Generates descriptions, bestFor, notFor, and keyFeatures automatically.
 *
 * Related:
 * - payload/hooks/toolsUrlIngest.ts
 * - payload/hooks/toolsAutoTranslate.ts
 */

interface ToolMetadata {
  name: string
  websiteUrl: string
  metaTitle?: string
  metaDescription?: string
  ogDescription?: string
  pricingModel?: string
  category?: string
}

interface GeneratedContent {
  shortOneLiner: string
  description: string
  bestFor: Array<{ point: string }>
  notFor: Array<{ point: string }>
  keyFeatures: Array<{ title: string; detail: string }>
}

/**
 * Generate tool content using AI or templates.
 * Falls back to template-based content if no AI API key is configured.
 */
export async function generateToolContent(metadata: ToolMetadata): Promise<GeneratedContent> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY

  if (apiKey && process.env.ANTHROPIC_API_KEY) {
    try {
      return await generateWithClaude(metadata, apiKey)
    } catch (error) {
      console.error('[content-generator] Claude API failed, using templates:', error)
      return generateFromTemplate(metadata)
    }
  }

  if (apiKey && process.env.OPENAI_API_KEY) {
    try {
      return await generateWithOpenAI(metadata, apiKey)
    } catch (error) {
      console.error('[content-generator] OpenAI API failed, using templates:', error)
      return generateFromTemplate(metadata)
    }
  }

  // No API key configured - use templates
  return generateFromTemplate(metadata)
}

/**
 * Generate content using Anthropic Claude API.
 */
async function generateWithClaude(metadata: ToolMetadata, apiKey: string): Promise<GeneratedContent> {
  const prompt = buildPrompt(metadata)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307', // Fast and cheap for content generation
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.content[0].text

  return parseAIResponse(content, metadata)
}

/**
 * Generate content using OpenAI API.
 */
async function generateWithOpenAI(metadata: ToolMetadata, apiKey: string): Promise<GeneratedContent> {
  const prompt = buildPrompt(metadata)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  return parseAIResponse(content, metadata)
}

/**
 * Build the prompt for AI content generation.
 */
function buildPrompt(metadata: ToolMetadata): string {
  const sourceDesc = metadata.ogDescription || metadata.metaDescription || ''
  const pricingInfo = metadata.pricingModel ? `Pricing: ${metadata.pricingModel}` : ''
  const categoryInfo = metadata.category ? `Category: ${metadata.category}` : ''

  return `Je bent een expert tech writer voor een Nederlandse website over AI tools voor developers.

Genereer content voor de tool "${metadata.name}" (${metadata.websiteUrl}).

Beschikbare informatie:
- Titel: ${metadata.metaTitle || metadata.name}
- Beschrijving: ${sourceDesc}
${pricingInfo}
${categoryInfo}

Genereer in het NEDERLANDS:

1. SHORT_ONE_LINER: Een korte, pakkende zin (max 100 tekens) die de tool samenvat.

2. DESCRIPTION: Een informatieve paragraaf (2-4 zinnen) die uitlegt wat de tool doet, voor wie het is, en wat het uniek maakt.

3. BEST_FOR: Exact 4 bullets met specifieke use cases waar deze tool uitblinkt. Begin elke bullet met een actief werkwoord of duidelijke doelgroep.

4. NOT_FOR: Exact 3 bullets met situaties waar deze tool NIET de beste keuze is. Wees eerlijk en specifiek.

5. KEY_FEATURES: Exact 3 features met titel (max 3 woorden) en korte beschrijving (max 10 woorden).

Formatteer je antwoord EXACT zo:
SHORT_ONE_LINER: [jouw tekst]
DESCRIPTION: [jouw tekst]
BEST_FOR_1: [bullet 1]
BEST_FOR_2: [bullet 2]
BEST_FOR_3: [bullet 3]
BEST_FOR_4: [bullet 4]
NOT_FOR_1: [bullet 1]
NOT_FOR_2: [bullet 2]
NOT_FOR_3: [bullet 3]
FEATURE_1_TITLE: [titel]
FEATURE_1_DETAIL: [beschrijving]
FEATURE_2_TITLE: [titel]
FEATURE_2_DETAIL: [beschrijving]
FEATURE_3_TITLE: [titel]
FEATURE_3_DETAIL: [beschrijving]`
}

/**
 * Parse AI response into structured content.
 */
function parseAIResponse(response: string, metadata: ToolMetadata): GeneratedContent {
  const extract = (key: string): string => {
    const regex = new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`, 's')
    const match = response.match(regex)
    return match ? match[1].trim() : ''
  }

  const shortOneLiner = extract('SHORT_ONE_LINER') || generateShortOneLiner(metadata)
  const description = extract('DESCRIPTION') || generateDescription(metadata)

  const bestFor: Array<{ point: string }> = []
  for (let i = 1; i <= 4; i++) {
    const point = extract(`BEST_FOR_${i}`)
    if (point) bestFor.push({ point })
  }
  if (bestFor.length === 0) {
    bestFor.push(...generateBestFor(metadata))
  }

  const notFor: Array<{ point: string }> = []
  for (let i = 1; i <= 3; i++) {
    const point = extract(`NOT_FOR_${i}`)
    if (point) notFor.push({ point })
  }
  if (notFor.length === 0) {
    notFor.push(...generateNotFor(metadata))
  }

  const keyFeatures: Array<{ title: string; detail: string }> = []
  for (let i = 1; i <= 3; i++) {
    const title = extract(`FEATURE_${i}_TITLE`)
    const detail = extract(`FEATURE_${i}_DETAIL`)
    if (title && detail) {
      keyFeatures.push({ title, detail })
    }
  }

  return {
    shortOneLiner,
    description,
    bestFor,
    notFor,
    keyFeatures,
  }
}

/**
 * Generate content from templates when no AI API is available.
 */
function generateFromTemplate(metadata: ToolMetadata): GeneratedContent {
  return {
    shortOneLiner: generateShortOneLiner(metadata),
    description: generateDescription(metadata),
    bestFor: generateBestFor(metadata),
    notFor: generateNotFor(metadata),
    keyFeatures: [],
  }
}

function generateShortOneLiner(metadata: ToolMetadata): string {
  const sourceDesc = metadata.ogDescription || metadata.metaDescription
  if (sourceDesc) {
    const firstSentence = sourceDesc.split(/[.!?]/)[0]
    return firstSentence.length > 100 ? firstSentence.substring(0, 97) + '...' : firstSentence
  }
  return metadata.metaTitle || `${metadata.name} - AI-powered tool`
}

function generateDescription(metadata: ToolMetadata): string {
  const sourceDesc = metadata.ogDescription || metadata.metaDescription

  if (sourceDesc) {
    return `${metadata.name} is een tool voor ${sourceDesc.toLowerCase().replace(/^[a-z]/, (c) => c.toLowerCase())}

[Deze beschrijving wordt automatisch gegenereerd. Voeg een ANTHROPIC_API_KEY toe aan je .env.local voor AI-gegenereerde content, of pas handmatig aan.]`
  }

  return `${metadata.name} is een AI-powered tool die je workflow kan verbeteren.

[Voeg een ANTHROPIC_API_KEY toe aan je .env.local voor automatische AI-gegenereerde beschrijvingen, of pas deze tekst handmatig aan.]`
}

function generateBestFor(metadata: ToolMetadata): Array<{ point: string }> {
  const pricingPoints: Record<string, string> = {
    free: 'Teams met een beperkt budget die gratis tools zoeken',
    freemium: 'Starters die eerst willen uitproberen voordat ze upgraden',
    paid: 'Professionals die investeren in premium tooling',
    enterprise: 'Grote organisaties met enterprise-level requirements',
  }

  const points: Array<{ point: string }> = [
    { point: 'Developers die hun productiviteit willen verhogen' },
    { point: 'Teams die moderne AI-tools willen integreren in hun workflow' },
  ]

  if (metadata.pricingModel && pricingPoints[metadata.pricingModel]) {
    points.push({ point: pricingPoints[metadata.pricingModel] })
  }

  points.push({ point: '[Voeg specifieke use cases toe na handmatige review]' })

  return points
}

function generateNotFor(_metadata: ToolMetadata): Array<{ point: string }> {
  return [
    { point: '[Specificeer wanneer deze tool niet de beste keuze is]' },
    { point: '[Voeg alternatieven toe voor specifieke scenario\'s]' },
    { point: '[Pas aan na handmatige review]' },
  ]
}
