/**
 * scripts/seed-mega-menu.ts
 *
 * Seeds tool categories, sample tools, and navigation mega menu config.
 * Run with: npx tsx scripts/seed-mega-menu.ts
 *
 * Related:
 * - payload/collections/ToolCategories.ts
 * - payload/collections/Tools.ts
 * - payload/globals/Navigation.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

import { getPayload } from 'payload'
import config from '../payload.config'

// === Tool Categories Data ===
const TOOL_CATEGORIES = [
  // Build & Code group
  {
    title: 'AI Assistenten',
    slug: 'ai-assistants',
    description: 'AI-gestuurde code assistenten en chat interfaces.',
    megaMenuGroup: 'build-code',
    megaMenuColumn: 'core',
    order: 1,
    icon: 'bot',
  },
  {
    title: 'Code Editors',
    slug: 'code-editors',
    description: 'IDE\'s en editors met AI-integratie.',
    megaMenuGroup: 'build-code',
    megaMenuColumn: 'core',
    order: 2,
    icon: 'code',
  },
  {
    title: 'Terminal Tools',
    slug: 'terminal-tools',
    description: 'Command-line tools met AI-mogelijkheden.',
    megaMenuGroup: 'build-code',
    megaMenuColumn: 'core',
    order: 3,
    icon: 'terminal',
  },
  // Models & Providers group
  {
    title: 'LLM Providers',
    slug: 'llm-providers',
    description: 'Aanbieders van large language models.',
    megaMenuGroup: 'models-providers',
    megaMenuColumn: 'core',
    order: 4,
    icon: 'brain',
  },
  {
    title: 'AI Models',
    slug: 'ai-models',
    description: 'Specifieke AI modellen en versies.',
    megaMenuGroup: 'models-providers',
    megaMenuColumn: 'core',
    order: 5,
    icon: 'sparkles',
  },
  // Create & Media group
  {
    title: 'AI Studios',
    slug: 'ai-studios',
    description: 'Video en media generatie platforms.',
    megaMenuGroup: 'create-media',
    megaMenuColumn: 'core',
    order: 6,
    icon: 'video',
  },
  {
    title: 'Image Tools',
    slug: 'image-tools',
    description: 'AI-gestuurde afbeelding generatie en bewerking.',
    megaMenuGroup: 'create-media',
    megaMenuColumn: 'core',
    order: 7,
    icon: 'image',
  },
  {
    title: 'Voice & Audio',
    slug: 'voice-audio',
    description: 'Spraak-naar-tekst en audio tools.',
    megaMenuGroup: 'create-media',
    megaMenuColumn: 'core',
    order: 8,
    icon: 'mic',
  },
  // Automate group
  {
    title: 'Automation',
    slug: 'automation',
    description: 'Workflow automatisering tools.',
    megaMenuGroup: 'automate',
    megaMenuColumn: 'core',
    order: 9,
    icon: 'zap',
  },
  {
    title: 'Integrations',
    slug: 'integrations',
    description: 'API\'s en connectoren.',
    megaMenuGroup: 'automate',
    megaMenuColumn: 'core',
    order: 10,
    icon: 'workflow',
  },
]

// === Sample Tools Data ===
const SAMPLE_TOOLS = [
  // AI Assistants
  {
    name: 'Claude',
    slug: 'claude',
    shortOneLiner: 'AI assistent van Anthropic voor complexe taken en code.',
    description: 'Claude is een AI assistent ontwikkeld door Anthropic, bekend om zijn sterke reasoning en code-generatie mogelijkheden.',
    websiteUrl: 'https://claude.ai',
    categorySlug: 'ai-assistants',
    status: 'published',
    featuredInMenu: true,
  },
  {
    name: 'ChatGPT',
    slug: 'chatgpt',
    shortOneLiner: 'OpenAI\'s conversationele AI voor diverse taken.',
    description: 'ChatGPT is de populaire AI chatbot van OpenAI, geschikt voor conversaties, code en creatieve taken.',
    websiteUrl: 'https://chat.openai.com',
    categorySlug: 'ai-assistants',
    status: 'published',
  },
  {
    name: 'Gemini',
    slug: 'gemini',
    shortOneLiner: 'Google\'s multimodale AI assistent.',
    websiteUrl: 'https://gemini.google.com',
    categorySlug: 'ai-assistants',
    status: 'published',
  },
  // Code Editors
  {
    name: 'Cursor',
    slug: 'cursor',
    shortOneLiner: 'AI-first code editor gebouwd op VS Code.',
    description: 'Cursor is een code editor met diepgaande AI-integratie voor code completion, refactoring en chat.',
    websiteUrl: 'https://cursor.com',
    categorySlug: 'code-editors',
    status: 'published',
    featuredInMenu: true,
  },
  {
    name: 'Windsurf',
    slug: 'windsurf',
    shortOneLiner: 'Codeium\'s AI-gestuurde development environment.',
    websiteUrl: 'https://codeium.com/windsurf',
    categorySlug: 'code-editors',
    status: 'published',
  },
  // Terminal Tools
  {
    name: 'Claude Code',
    slug: 'claude-code',
    shortOneLiner: 'Anthropic\'s officiële CLI voor Claude.',
    websiteUrl: 'https://claude.ai/code',
    categorySlug: 'terminal-tools',
    status: 'published',
  },
  // LLM Providers
  {
    name: 'Anthropic',
    slug: 'anthropic',
    shortOneLiner: 'Maker van Claude, focus op AI safety.',
    websiteUrl: 'https://anthropic.com',
    categorySlug: 'llm-providers',
    status: 'published',
  },
  {
    name: 'OpenAI',
    slug: 'openai',
    shortOneLiner: 'Pionier in AI research en GPT modellen.',
    websiteUrl: 'https://openai.com',
    categorySlug: 'llm-providers',
    status: 'published',
  },
  {
    name: 'Google',
    slug: 'google-ai',
    shortOneLiner: 'Gemini en Vertex AI platforms.',
    websiteUrl: 'https://ai.google',
    categorySlug: 'llm-providers',
    status: 'published',
  },
  // AI Studios
  {
    name: 'Runway',
    slug: 'runway',
    shortOneLiner: 'AI video generatie en editing platform.',
    websiteUrl: 'https://runwayml.com',
    categorySlug: 'ai-studios',
    status: 'published',
  },
  {
    name: 'Pika',
    slug: 'pika',
    shortOneLiner: 'AI-gestuurde video creatie.',
    websiteUrl: 'https://pika.art',
    categorySlug: 'ai-studios',
    status: 'published',
  },
  // Automation
  {
    name: 'n8n',
    slug: 'n8n',
    shortOneLiner: 'Open-source workflow automatisering.',
    websiteUrl: 'https://n8n.io',
    categorySlug: 'automation',
    status: 'published',
  },
  {
    name: 'Zapier',
    slug: 'zapier',
    shortOneLiner: 'No-code automatisering tussen apps.',
    websiteUrl: 'https://zapier.com',
    categorySlug: 'automation',
    status: 'published',
  },
  {
    name: 'Make',
    slug: 'make',
    shortOneLiner: 'Visuele workflow automatisering.',
    websiteUrl: 'https://make.com',
    categorySlug: 'automation',
    status: 'published',
  },
]

// === Navigation Mega Menu Config ===
async function seedMegaMenu() {
  console.log('🚀 Seeding mega menu data...\n')
  const payload = await getPayload({ config })

  // 1. Seed Tool Categories
  console.log('📁 Creating tool categories...')
  const categoryMap = new Map<string, number | string>()

  for (const cat of TOOL_CATEGORIES) {
    const existing = await payload.find({
      collection: 'tool-categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`   ○ Category exists: ${cat.title}`)
      categoryMap.set(cat.slug, existing.docs[0].id)
      continue
    }

    const created = await payload.create({
      collection: 'tool-categories',
      locale: 'nl',
      data: {
        title: cat.title,
        slug: cat.slug,
        description: cat.description,
        megaMenuGroup: cat.megaMenuGroup,
        megaMenuColumn: cat.megaMenuColumn,
        order: cat.order,
        icon: cat.icon,
        showInMegaMenu: true,
      },
    })
    categoryMap.set(cat.slug, created.id)
    console.log(`   ✓ Created category: ${cat.title}`)
  }

  // 2. Seed Sample Tools
  console.log('\n🔧 Creating sample tools...')
  const toolMap = new Map<string, number | string>()

  for (const tool of SAMPLE_TOOLS) {
    const existing = await payload.find({
      collection: 'tools',
      where: { slug: { equals: tool.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`   ○ Tool exists: ${tool.name}`)
      toolMap.set(tool.slug, existing.docs[0].id)
      continue
    }

    const categoryId = categoryMap.get(tool.categorySlug)

    const created = await payload.create({
      collection: 'tools',
      locale: 'nl',
      data: {
        name: tool.name,
        slug: tool.slug,
        shortOneLiner: tool.shortOneLiner,
        description: tool.description || '',
        websiteUrl: tool.websiteUrl,
        category: categoryId,
        status: tool.status as 'draft' | 'review' | 'published',
        featuredInMenu: tool.featuredInMenu || false,
      },
    })
    toolMap.set(tool.slug, created.id)
    console.log(`   ✓ Created tool: ${tool.name}`)
  }

  // 3. Configure Navigation Global
  console.log('\n🗺️  Configuring navigation mega menu...')

  // Get category IDs for sections
  const buildCodeCategories = [
    categoryMap.get('ai-assistants'),
    categoryMap.get('code-editors'),
    categoryMap.get('terminal-tools'),
  ].filter(Boolean)

  const modelsCategories = [
    categoryMap.get('llm-providers'),
    categoryMap.get('ai-models'),
  ].filter(Boolean)

  const mediaCategories = [
    categoryMap.get('ai-studios'),
    categoryMap.get('image-tools'),
    categoryMap.get('voice-audio'),
  ].filter(Boolean)

  const automateCategories = [
    categoryMap.get('automation'),
    categoryMap.get('integrations'),
  ].filter(Boolean)

  // Featured tool (Cursor)
  const featuredToolId = toolMap.get('cursor')

  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'nl',
    data: {
      toolsMegaMenu: {
        enabled: true,
        coreSections: [
          {
            heading: 'Build & Code',
            categories: buildCodeCategories,
            order: 1,
          },
          {
            heading: 'Models & Providers',
            categories: modelsCategories,
            order: 2,
          },
          {
            heading: 'Create & Media',
            categories: mediaCategories,
            order: 3,
          },
          {
            heading: 'Automate',
            categories: automateCategories,
            order: 4,
          },
        ],
        useCasesHeading: 'Gebruik dit als je…',
        useCaseLinks: [
          {
            label: 'snel een MVP wilt bouwen',
            filterCategory: categoryMap.get('ai-assistants'),
            icon: 'zap',
          },
          {
            label: 'video content wilt maken',
            filterCategory: categoryMap.get('ai-studios'),
            icon: 'video',
          },
          {
            label: 'workflows wilt automatiseren',
            filterCategory: categoryMap.get('automation'),
            icon: 'workflow',
          },
          {
            label: 'code sneller wilt schrijven',
            filterCategory: categoryMap.get('code-editors'),
            icon: 'code',
          },
        ],
        compareHeading: 'Vergelijk & Begrijp',
        compareLinks: [
          {
            label: 'Claude vs GPT vs Gemini',
            href: '/compare/llm',
            badge: 'Populair',
          },
          {
            label: 'AI Code Editors vergeleken',
            href: '/compare/code-editors',
          },
          {
            label: 'AI Studios vergeleken',
            href: '/compare/ai-studios',
            badge: 'Nieuw',
          },
        ],
        showFeatured: true,
        featuredLabel: 'Tool van de week',
        featuredTool: featuredToolId,
        featuredDescription: 'De populairste AI-first code editor voor vibecoding projecten.',
        featuredCtaLabel: 'Bekijk Cursor',
        footerLinks: [
          {
            label: 'Tool aanmelden',
            href: '/submit-tool',
            icon: 'plus',
          },
        ],
      },
    },
  })

  console.log('   ✓ Navigation mega menu configured')

  // 4. Add English translations
  console.log('\n🌐 Adding English translations...')

  // Update category titles in English
  for (const cat of TOOL_CATEGORIES) {
    const catId = categoryMap.get(cat.slug)
    if (catId) {
      const enTitles: Record<string, string> = {
        'ai-assistants': 'AI Assistants',
        'code-editors': 'Code Editors',
        'terminal-tools': 'Terminal Tools',
        'llm-providers': 'LLM Providers',
        'ai-models': 'AI Models',
        'ai-studios': 'AI Studios',
        'image-tools': 'Image Tools',
        'voice-audio': 'Voice & Audio',
        'automation': 'Automation',
        'integrations': 'Integrations',
      }
      const enDescriptions: Record<string, string> = {
        'ai-assistants': 'AI-powered code assistants and chat interfaces.',
        'code-editors': 'IDEs and editors with AI integration.',
        'terminal-tools': 'Command-line tools with AI capabilities.',
        'llm-providers': 'Large language model providers.',
        'ai-models': 'Specific AI models and versions.',
        'ai-studios': 'Video and media generation platforms.',
        'image-tools': 'AI-powered image generation and editing.',
        'voice-audio': 'Speech-to-text and audio tools.',
        'automation': 'Workflow automation tools.',
        'integrations': 'APIs and connectors.',
      }

      await payload.update({
        collection: 'tool-categories',
        id: catId,
        locale: 'en',
        data: {
          title: enTitles[cat.slug] || cat.title,
          description: enDescriptions[cat.slug] || cat.description,
        },
      })
    }
  }

  // Update navigation in English
  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'en',
    data: {
      toolsMegaMenu: {
        useCasesHeading: 'Use this when you…',
        useCaseLinks: [
          { label: 'want to build an MVP quickly', filterCategory: categoryMap.get('ai-assistants'), icon: 'zap' },
          { label: 'want to create video content', filterCategory: categoryMap.get('ai-studios'), icon: 'video' },
          { label: 'want to automate workflows', filterCategory: categoryMap.get('automation'), icon: 'workflow' },
          { label: 'want to write code faster', filterCategory: categoryMap.get('code-editors'), icon: 'code' },
        ],
        compareHeading: 'Compare & Learn',
        compareLinks: [
          { label: 'Claude vs GPT vs Gemini', href: '/compare/llm', badge: 'Popular' },
          { label: 'AI Code Editors compared', href: '/compare/code-editors' },
          { label: 'AI Studios compared', href: '/compare/ai-studios', badge: 'New' },
        ],
        featuredLabel: 'Tool of the week',
        featuredDescription: 'The most popular AI-first code editor for vibecoding projects.',
        featuredCtaLabel: 'View Cursor',
        footerLinks: [{ label: 'Submit a tool', href: '/submit-tool', icon: 'plus' }],
      },
    },
  })

  console.log('   ✓ English translations added')

  console.log('\n✅ Mega menu seeding complete!')
  console.log('\n🌐 View the mega menu at:')
  console.log('   - http://localhost:3000/nl (hover over Tools)')
  console.log('   - http://localhost:3000/nl/tools')

  process.exit(0)
}

seedMegaMenu().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
