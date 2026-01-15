/**
 * convex/seed.ts
 *
 * Seed mutation to populate database with sample data.
 * Creates 5 tags, 5 tools, and 5 published cases (nl locale).
 * Run via: npx convex run seed:run
 *
 * Related:
 * - convex/schema.ts
 * - convex/cases.ts
 */

import { mutation } from './_generated/server'

// Sample tags for vibecoding showcase
const SEED_TAGS = [
  { slug: 'ai-native', name: 'AI-Native' },
  { slug: 'rapid-prototype', name: 'Rapid Prototype' },
  { slug: 'saas', name: 'SaaS' },
  { slug: 'developer-tools', name: 'Developer Tools' },
  { slug: 'automation', name: 'Automation' },
]

// Sample tools used in vibecoding
const SEED_TOOLS = [
  { slug: 'claude', name: 'Claude', websiteUrl: 'https://claude.ai' },
  { slug: 'cursor', name: 'Cursor', websiteUrl: 'https://cursor.sh' },
  { slug: 'v0', name: 'v0', websiteUrl: 'https://v0.dev' },
  { slug: 'bolt', name: 'Bolt', websiteUrl: 'https://bolt.new' },
  { slug: 'copilot', name: 'GitHub Copilot', websiteUrl: 'https://github.com/features/copilot' },
]

// Sample cases showcasing vibecoding builds
const SEED_CASES = [
  {
    slug: 'factuurflow',
    title: 'FactuurFlow',
    oneLiner: 'Van idee naar werkende facturatie-app in één weekend met AI-pair programming',
    stack: ['Next.js', 'Prisma', 'Stripe', 'Tailwind'],
    tagSlugs: ['saas', 'rapid-prototype'],
    toolSlugs: ['claude', 'cursor'],
    problem: 'Freelancers en kleine bedrijven worstelen met het bijhouden van facturen. Bestaande oplossingen zijn te complex of te duur voor hun behoeften.',
    solution: 'Een minimalistische facturatie-app gebouwd met AI-pair programming. In één weekend van concept naar MVP met automatische BTW-berekening en PDF-export.',
    learnings: 'AI-assistentie maakte het mogelijk om complexe Stripe-integratie in uren te realiseren in plaats van dagen. De sleutel was het opdelen in kleine, testbare stappen.',
  },
  {
    slug: 'code-review-bot',
    title: 'Code Review Bot',
    oneLiner: 'Slack-bot die automatisch PR reviews samenvat en prioriteert',
    stack: ['Node.js', 'Slack API', 'OpenAI', 'PostgreSQL'],
    tagSlugs: ['developer-tools', 'automation'],
    toolSlugs: ['copilot', 'claude'],
    problem: 'Development teams missen belangrijke PR reviews door de hoeveelheid notificaties. Code blijft te lang liggen en de context gaat verloren.',
    solution: 'Een Slack-bot die PR\'s analyseert, samenvat en prioriteert op basis van impact en urgentie. Dagelijkse digests houden het team gefocust.',
    learnings: 'Het combineren van GitHub Copilot voor boilerplate en Claude voor complexe logica versnelde de ontwikkeling enorm.',
  },
  {
    slug: 'portfolio-generator',
    title: 'Portfolio Generator',
    oneLiner: 'AI-gestuurd portfolio dat zich aanpast aan de bezoeker',
    stack: ['React', 'Vercel', 'Tailwind', 'Framer Motion'],
    tagSlugs: ['ai-native', 'rapid-prototype'],
    toolSlugs: ['v0', 'cursor'],
    problem: 'Developers hebben moeite om hun werk effectief te presenteren aan verschillende doelgroepen - recruiters willen andere dingen zien dan technische leads.',
    solution: 'Een portfolio dat de bezoeker vraagt naar hun rol en interesse, en vervolgens de presentatie daarop aanpast met relevante projecten en details.',
    learnings: 'v0 was perfect voor het snel itereren op de UI. Cursor hielp bij het implementeren van de personalisatielogica.',
  },
  {
    slug: 'meetingmind',
    title: 'MeetingMind',
    oneLiner: 'Transcribeert vergaderingen en genereert actiepunten automatisch',
    stack: ['Python', 'Whisper', 'FastAPI', 'React'],
    tagSlugs: ['ai-native', 'automation', 'saas'],
    toolSlugs: ['claude', 'bolt'],
    problem: 'Vergaderingen leiden zelden tot concrete acties. Notulen worden niet gemaakt of niet gelezen, en afspraken verdwijnen.',
    solution: 'Real-time transcriptie met automatische extractie van actiepunten, deadlines en verantwoordelijken. Directe integratie met projectmanagement tools.',
    learnings: 'Bolt was ideaal voor de snelle frontend setup. Het combineren van Whisper voor transcriptie en Claude voor analyse gaf verrassend goede resultaten.',
  },
  {
    slug: 'component-library',
    title: 'VibeCraft UI',
    oneLiner: 'Open-source component library gebouwd in 3 dagen met AI-assistentie',
    stack: ['React', 'TypeScript', 'Storybook', 'Radix'],
    tagSlugs: ['developer-tools', 'rapid-prototype'],
    toolSlugs: ['v0', 'copilot', 'cursor'],
    problem: 'Teams bouwen steeds dezelfde UI-componenten. Bestaande libraries zijn te groot of matchen niet met de gewenste design tokens.',
    solution: 'Een lichtgewicht, volledig toegankelijke component library met focus op composability. Gebouwd bovenop Radix primitives met custom styling.',
    learnings: 'AI-tools maakten het mogelijk om in 3 dagen een productie-waardige library te bouwen die normaal weken zou kosten.',
  },
]

/**
 * Run seed to populate database.
 * Idempotent: checks for existing data before inserting.
 */
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingTags = await ctx.db.query('tags').collect()
    if (existingTags.length > 0) {
      return { message: 'Database already seeded', skipped: true }
    }

    const now = Date.now()

    // Insert tags
    const tagMap = new Map<string, typeof SEED_TAGS[0] & { _id: string }>()
    for (const tag of SEED_TAGS) {
      const id = await ctx.db.insert('tags', { ...tag, createdAt: now })
      tagMap.set(tag.slug, { ...tag, _id: id })
    }

    // Insert tools
    const toolMap = new Map<string, typeof SEED_TOOLS[0] & { _id: string }>()
    for (const tool of SEED_TOOLS) {
      const id = await ctx.db.insert('tools', { ...tool, createdAt: now })
      toolMap.set(tool.slug, { ...tool, _id: id })
    }

    // Insert cases
    for (const caseData of SEED_CASES) {
      const tagIds = caseData.tagSlugs
        .map((slug) => tagMap.get(slug)?._id)
        .filter(Boolean) as string[]
      const toolIds = caseData.toolSlugs
        .map((slug) => toolMap.get(slug)?._id)
        .filter(Boolean) as string[]

      /* eslint-disable @typescript-eslint/no-explicit-any -- IDs typed after codegen */
      await ctx.db.insert('cases', {
        slug: caseData.slug,
        title: caseData.title,
        oneLiner: caseData.oneLiner,
        locale: 'nl',
        status: 'published',
        tagIds: tagIds as any,
        toolIds: toolIds as any,
        stack: caseData.stack,
        problem: caseData.problem,
        solution: caseData.solution,
        learnings: caseData.learnings,
        createdAt: now,
      })
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }

    return {
      message: 'Seed completed',
      tags: SEED_TAGS.length,
      tools: SEED_TOOLS.length,
      cases: SEED_CASES.length,
    }
  },
})

/**
 * Update existing cases with content fields.
 * Use when cases exist but need content added.
 */
export const updateCaseContent = mutation({
  args: {},
  handler: async (ctx) => {
    let updated = 0

    for (const caseData of SEED_CASES) {
      const existing = await ctx.db
        .query('cases')
        .withIndex('by_slug_locale', (q) =>
          q.eq('slug', caseData.slug).eq('locale', 'nl')
        )
        .first()

      if (existing && !existing.problem) {
        await ctx.db.patch(existing._id, {
          problem: caseData.problem,
          solution: caseData.solution,
          learnings: caseData.learnings,
        })
        updated++
      }
    }

    return { message: 'Content updated', updated }
  },
})
