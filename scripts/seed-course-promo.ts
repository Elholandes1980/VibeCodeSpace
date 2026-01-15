/**
 * scripts/seed-course-promo.ts
 *
 * Seeds the VibeCoding Madness course promotion content.
 * Run with: npx tsx scripts/seed-course-promo.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

import { getPayload } from 'payload'
import config from '../payload.config'

const COURSE_PROMO_NL = {
  settings: {
    enabled: true,
    showOnHomepage: true,
    showOnCases: true,
    showOnTools: false,
    showOnBuilders: false,
  },
  author: {
    name: 'Mitchel van Duuren',
    description: 'Vibecoding pioneer & builder',
  },
  hero: {
    eyebrow: 'De eerste premium vibecoding cursus',
    headline: 'AI heeft alles veranderd. Software is de nieuwe leverage.',
    subheadline:
      'VibeCoding Madness is de eerste premium vibecoding cursus in het Nederlands en Engels, ontworpen voor mensen die ideeën willen omzetten in werkende software — snel.',
    bullets: [
      { text: 'Van idee naar live software in 21 dagen' },
      { text: 'Bouw zonder je idee weg te geven' },
      { text: 'Leer vibecoding zoals builders echt werken' },
    ],
    buttonLabel: 'Start met VibeCoding Madness',
    buttonUrl: 'https://www.vibecodemadness.nl/',
  },
  compact: {
    headline: 'Serieus over vibecoding?',
    description:
      'Leer het van Mitchel van Duuren — creator van de eerste premium vibecoding cursus in NL & EN.',
    buttonLabel: 'Bekijk de cursus',
    buttonUrl: 'https://www.vibecodemadness.nl/',
  },
}

const COURSE_PROMO_EN = {
  author: {
    description: 'Vibecoding pioneer & builder',
  },
  hero: {
    eyebrow: 'The first premium vibecoding course',
    headline: 'AI has changed everything. Software is the new leverage.',
    subheadline:
      'VibeCoding Madness is the first premium vibecoding course in Dutch and English, designed for people who want to turn ideas into working software — fast.',
    bullets: [
      { text: 'From idea to live software in 21 days' },
      { text: 'Build without giving your idea away' },
      { text: 'Learn vibecoding the way builders actually work' },
    ],
    buttonLabel: 'Start VibeCoding Madness',
  },
  compact: {
    headline: 'Serious about vibecoding?',
    description:
      'Learn it from Mitchel van Duuren — creator of the first premium vibecoding course in NL & EN.',
    buttonLabel: 'View the course',
  },
}

async function seedCoursePromo() {
  console.log('🎓 Seeding course promo...\n')
  const payload = await getPayload({ config })

  try {
    // Update Dutch content (default locale)
    await payload.updateGlobal({
      slug: 'course-promo',
      locale: 'nl',
      data: COURSE_PROMO_NL,
    })
    console.log('   ✓ Dutch course promo content saved')

    // Update English content
    await payload.updateGlobal({
      slug: 'course-promo',
      locale: 'en',
      data: COURSE_PROMO_EN,
    })
    console.log('   ✓ English course promo content saved')

    console.log('\n✅ Course promo seeded successfully!')
    console.log('\n📝 Edit in Payload Admin:')
    console.log('   http://localhost:3001/admin/globals/course-promo')
  } catch (error) {
    console.error('❌ Failed to seed course promo:', error)
  }

  process.exit(0)
}

seedCoursePromo()
