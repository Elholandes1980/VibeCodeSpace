/**
 * scripts/regenerate-tool-content.ts
 *
 * Regenerates content for all tools using AI (Claude API).
 * Run with: DATABASE_URL="..." npx tsx scripts/regenerate-tool-content.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set!')
  process.exit(1)
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY not set!')
  process.exit(1)
}

import { getPayload } from 'payload'
import config from '../payload.config'

interface GeneratedContent {
  shortOneLiner: string
  description: string
  bestFor: Array<{ point: string }>
  notFor: Array<{ point: string }>
  keyFeatures: Array<{ title: string; detail: string }>
}

async function generateWithClaude(
  toolName: string,
  websiteUrl: string,
  metaDescription: string | null,
  category: string | null,
  pricingModel: string | null
): Promise<GeneratedContent> {
  const apiKey = process.env.ANTHROPIC_API_KEY!

  const prompt = `Je bent een expert tech writer voor een Nederlandse website over AI tools voor developers en creators.

Genereer uitgebreide, informatieve content voor de tool "${toolName}" (${websiteUrl}).

Beschikbare informatie:
- Naam: ${toolName}
- Website: ${websiteUrl}
- Beschrijving van website: ${metaDescription || 'Niet beschikbaar'}
- Categorie: ${category || 'AI Tool'}
- Prijsmodel: ${pricingModel || 'Onbekend'}

BELANGRIJK: Doe onderzoek gebaseerd op je kennis over deze tool. Wees specifiek en informatief.

Genereer in het NEDERLANDS:

1. SHORT_ONE_LINER: Een korte, pakkende zin (max 100 tekens) die de kernwaarde van de tool samenvat. Geen marketing-taal, maar concrete waarde.

2. DESCRIPTION: Een informatieve paragraaf (3-4 zinnen) die uitlegt:
   - Wat de tool doet en voor wie
   - Wat het uniek maakt t.o.v. alternatieven
   - Concrete voordelen voor de gebruiker

3. BEST_FOR: Exact 4 bullets met SPECIFIEKE use cases. Elk bullet moet:
   - Beginnen met een concrete doelgroep of situatie
   - Uitleggen WAAROM deze tool daarvoor geschikt is
   - Minimaal 15 woorden per bullet

4. NOT_FOR: Exact 3 bullets met EERLIJKE beperkingen. Elk bullet moet:
   - Een specifieke situatie of doelgroep noemen
   - Uitleggen waarom de tool daar niet optimaal voor is
   - Een alternatief suggereren indien mogelijk
   - Minimaal 15 woorden per bullet

5. KEY_FEATURES: Exact 3 belangrijke features met:
   - Titel (max 3 woorden, concreet)
   - Detail (max 15 woorden, wat het doet en waarom het waardevol is)

Formatteer je antwoord EXACT zo (geen extra tekst):
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

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const content = data.content[0].text

  return parseResponse(content)
}

function parseResponse(response: string): GeneratedContent {
  const extract = (key: string): string => {
    const regex = new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`, 's')
    const match = response.match(regex)
    return match ? match[1].trim() : ''
  }

  const shortOneLiner = extract('SHORT_ONE_LINER')
  const description = extract('DESCRIPTION')

  const bestFor: Array<{ point: string }> = []
  for (let i = 1; i <= 4; i++) {
    const point = extract(`BEST_FOR_${i}`)
    if (point) bestFor.push({ point })
  }

  const notFor: Array<{ point: string }> = []
  for (let i = 1; i <= 3; i++) {
    const point = extract(`NOT_FOR_${i}`)
    if (point) notFor.push({ point })
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

async function regenerateContent() {
  console.log('🤖 Regenerating tool content with Claude AI...\n')

  const payload = await getPayload({ config })

  const tools = await payload.find({
    collection: 'tools',
    limit: 100,
    locale: 'nl',
    depth: 1,
  })

  console.log(`Found ${tools.docs.length} tools\n`)

  let updated = 0
  let failed = 0

  for (const tool of tools.docs) {
    const name = tool.name as string
    const slug = tool.slug as string
    const websiteUrl = tool.websiteUrl as string | undefined

    if (!websiteUrl) {
      console.log(`⏭ ${name} (no website URL)`)
      continue
    }

    console.log(`🤖 Generating content for: ${name}...`)

    try {
      // Get category name
      let categoryName: string | null = null
      if (tool.category && typeof tool.category === 'object' && 'title' in tool.category) {
        categoryName = tool.category.title as string
      }

      const content = await generateWithClaude(
        name,
        websiteUrl,
        (tool.metaDescription as string) || null,
        categoryName,
        (tool.pricingModel as string) || null
      )

      // Update tool
      await payload.update({
        collection: 'tools',
        id: tool.id,
        locale: 'nl',
        data: {
          shortOneLiner: content.shortOneLiner,
          description: content.description,
          bestFor: content.bestFor,
          notFor: content.notFor,
          keyFeatures: content.keyFeatures,
        },
        context: { skipTranslation: false }, // Allow auto-translation
      })

      console.log(`✓ ${name}`)
      updated++

      // Rate limiting - wait between API calls
      await new Promise((r) => setTimeout(r, 1000))
    } catch (error) {
      console.error(`❌ ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      failed++
    }
  }

  console.log(`\n✅ Done!`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Failed: ${failed}`)

  process.exit(0)
}

regenerateContent().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
