/**
 * scripts/seed-builders.ts
 *
 * Seeds sample builders and links cases to them.
 * Run with: npx tsx scripts/seed-builders.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

import { getPayload } from 'payload'
import config from '../payload.config'

const SAMPLE_BUILDERS = [
  {
    name: 'Sophie van den Berg',
    slug: 'sophie-van-den-berg',
    bio: 'AI product designer. Specialisatie in het vertalen van complexe AI concepten naar intuïtieve interfaces.',
    plan: 'pro',
    visible: true,
    featured: true,
    links: {
      xHandle: 'sophievdb',
      linkedinUrl: 'https://linkedin.com/in/sophievdb',
    },
    socialStats: {
      xFollowers: 8200,
      xFollowing: 340,
      xPosts: 1890,
      fetchStatus: 'ok',
      lastFetched: new Date().toISOString(),
    },
  },
  {
    name: 'Marcus de Vries',
    slug: 'marcus-de-vries',
    bio: 'Startup founder en vibecoder. Bouwt no-code tools met AI integraties.',
    plan: 'pro',
    visible: true,
    featured: false,
    links: {
      xHandle: 'marcusdevries',
      websiteUrl: 'https://marcusdevries.nl',
    },
    socialStats: {
      xFollowers: 3400,
      xFollowing: 560,
      xPosts: 780,
      fetchStatus: 'ok',
      lastFetched: new Date().toISOString(),
    },
  },
  {
    name: 'Emma Jansen',
    slug: 'emma-jansen',
    bio: 'Backend engineer die graag experimenteert met LLMs en RAG systemen.',
    plan: 'free',
    visible: true,
    featured: false,
    links: {
      githubUrl: 'https://github.com/emmajansen',
    },
  },
  {
    name: 'Thomas Bakker',
    slug: 'thomas-bakker',
    bio: 'DevOps engineer met focus op AI-ops en automatisering van development workflows.',
    plan: 'free',
    visible: true,
    featured: false,
    links: {
      xHandle: 'thomasbakker',
      linkedinUrl: 'https://linkedin.com/in/thomasbakker',
    },
    socialStats: {
      xFollowers: 1200,
      xFollowing: 230,
      xPosts: 450,
      fetchStatus: 'ok',
      lastFetched: new Date().toISOString(),
    },
  },
]

async function seedBuilders() {
  console.log('🏗️  Seeding builders...\n')
  const payload = await getPayload({ config })

  // Get existing builder (David) if exists
  const existingBuilders = await payload.find({
    collection: 'builders',
    limit: 100,
  })

  const builderIds: number[] = existingBuilders.docs.map(b => Number(b.id))

  if (existingBuilders.docs.length > 0) {
    console.log(`   Found ${existingBuilders.docs.length} existing builder(s)`)
    existingBuilders.docs.forEach(b => console.log(`   - ${b.name} (ID: ${b.id})`))
  }

  // Create additional sample builders
  for (const builder of SAMPLE_BUILDERS) {
    const existing = await payload.find({
      collection: 'builders',
      where: { slug: { equals: builder.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`   ○ Builder exists: ${builder.name}`)
      builderIds.push(Number(existing.docs[0].id))
      continue
    }

    const created = await payload.create({
      collection: 'builders',
      locale: 'nl',
      data: builder,
    })
    builderIds.push(Number(created.id))
    console.log(`   ✓ Created builder: ${builder.name}`)
  }

  // Get all cases
  console.log('\n📦 Linking cases to builders...')
  const cases = await payload.find({
    collection: 'cases',
    limit: 100,
  })

  // Assign cases to builders (distribute among all builders)
  for (let i = 0; i < cases.docs.length; i++) {
    const caseDoc = cases.docs[i]
    const builderId = builderIds[i % builderIds.length]

    if (caseDoc.ownerBuilder) {
      console.log(`   ○ ${caseDoc.title} already has owner`)
      continue
    }

    await payload.update({
      collection: 'cases',
      id: caseDoc.id,
      data: {
        ownerBuilder: builderId,
      },
    })
    console.log(`   ✓ Linked ${caseDoc.title} to builder ID ${builderId}`)
  }

  // Update case counts for each builder
  console.log('\n📊 Updating case counts...')
  for (const builderId of [...new Set(builderIds)]) {
    const builderCases = await payload.find({
      collection: 'cases',
      where: { ownerBuilder: { equals: builderId } },
    })

    await payload.update({
      collection: 'builders',
      id: builderId,
      data: {
        caseCount: builderCases.docs.length,
      },
    })
    console.log(`   ✓ Builder ${builderId}: ${builderCases.docs.length} cases`)
  }

  console.log('\n✅ Builders seeded and cases linked!')
  console.log('\n🌐 View builders at:')
  console.log('   - http://localhost:3000/nl/builders')

  process.exit(0)
}

seedBuilders().catch(err => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
