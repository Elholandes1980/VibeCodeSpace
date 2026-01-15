/**
 * scripts/seed-tools-settings.ts
 *
 * Seeds the ToolsSettings global with default values for all locales.
 * Safe to run multiple times (upserts only).
 * Does NOT reset DB or delete existing data.
 *
 * Run with: npx tsx scripts/seed-tools-settings.ts
 *
 * Related:
 * - payload/globals/ToolsSettings.ts
 * - lib/cms/tools-settings.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

import { getPayload } from 'payload'
import config from '../payload.config'

// NL content (source)
const NL_SETTINGS = {
  indexPage: {
    title: 'Tools',
    intro: 'Vind de beste tools voor vibecoding. Van AI-assistenten tot automatisering — alles wat je nodig hebt om sneller te bouwen.',
    filterAllLabel: 'Alle',
    filterPricingLabel: 'Pricing',
    searchPlaceholder: 'Zoek tools...',
    cardCtaLabel: 'Bekijk',
  },
  emptyStates: {
    noToolsTitle: 'Nog geen tools',
    noToolsBody: 'We zijn bezig met het toevoegen van tools. Kom snel terug!',
    noResultsTitle: 'Geen resultaten',
    noResultsBody: 'Probeer een andere zoekopdracht of filter.',
  },
  submitCta: {
    enabled: true,
    label: 'Tool toevoegen',
    href: '/submit-tool',
  },
  detailPage: {
    visitToolLabel: 'Bezoek tool',
    makerLabel: 'Website maker',
    pricingLabel: 'Pricing',
    freeLabel: 'Gratis',
    freemiumLabel: 'Freemium',
    paidLabel: 'Betaald',
    enterpriseLabel: 'Enterprise',
    unknownPricingLabel: 'Prijs onbekend',
    trialLabel: 'Proefperiode beschikbaar',
    startingFromLabel: 'Vanaf',
  },
  detailSections: {
    bestForLabel: 'Ideaal voor',
    notForLabel: 'Minder geschikt voor',
    featuresLabel: 'Belangrijkste features',
    usedInCasesLabel: 'Gebruikt in cases',
    alternativesLabel: 'Alternatieven',
    backLabel: 'Terug naar tools',
  },
  badges: {
    newBadge: 'Nieuw',
    popularBadge: 'Populair',
    featuredBadge: 'Uitgelicht',
  },
}

// EN content
const EN_SETTINGS = {
  indexPage: {
    title: 'Tools',
    intro: 'Find the best tools for vibecoding. From AI assistants to automation — everything you need to build faster.',
    filterAllLabel: 'All',
    filterPricingLabel: 'Pricing',
    searchPlaceholder: 'Search tools...',
    cardCtaLabel: 'View',
  },
  emptyStates: {
    noToolsTitle: 'No tools yet',
    noToolsBody: 'We are adding tools. Check back soon!',
    noResultsTitle: 'No results',
    noResultsBody: 'Try a different search or filter.',
  },
  submitCta: {
    enabled: true,
    label: 'Submit a tool',
    href: '/submit-tool',
  },
  detailPage: {
    visitToolLabel: 'Visit tool',
    makerLabel: 'Maker website',
    pricingLabel: 'Pricing',
    freeLabel: 'Free',
    freemiumLabel: 'Freemium',
    paidLabel: 'Paid',
    enterpriseLabel: 'Enterprise',
    unknownPricingLabel: 'Price unknown',
    trialLabel: 'Trial available',
    startingFromLabel: 'From',
  },
  detailSections: {
    bestForLabel: 'Best for',
    notForLabel: 'Not ideal for',
    featuresLabel: 'Key features',
    usedInCasesLabel: 'Used in cases',
    alternativesLabel: 'Alternatives',
    backLabel: 'Back to tools',
  },
  badges: {
    newBadge: 'New',
    popularBadge: 'Popular',
    featuredBadge: 'Featured',
  },
}

// ES content
const ES_SETTINGS = {
  indexPage: {
    title: 'Herramientas',
    intro: 'Encuentra las mejores herramientas para vibecoding. Desde asistentes de IA hasta automatización — todo lo que necesitas para construir más rápido.',
    filterAllLabel: 'Todas',
    filterPricingLabel: 'Precios',
    searchPlaceholder: 'Buscar herramientas...',
    cardCtaLabel: 'Ver',
  },
  emptyStates: {
    noToolsTitle: 'Sin herramientas aún',
    noToolsBody: 'Estamos agregando herramientas. ¡Vuelve pronto!',
    noResultsTitle: 'Sin resultados',
    noResultsBody: 'Prueba una búsqueda o filtro diferente.',
  },
  submitCta: {
    enabled: true,
    label: 'Agregar herramienta',
    href: '/submit-tool',
  },
  detailPage: {
    visitToolLabel: 'Visitar herramienta',
    makerLabel: 'Sitio del creador',
    pricingLabel: 'Precios',
    freeLabel: 'Gratis',
    freemiumLabel: 'Freemium',
    paidLabel: 'De pago',
    enterpriseLabel: 'Empresarial',
    unknownPricingLabel: 'Precio desconocido',
    trialLabel: 'Prueba disponible',
    startingFromLabel: 'Desde',
  },
  detailSections: {
    bestForLabel: 'Ideal para',
    notForLabel: 'No ideal para',
    featuresLabel: 'Características principales',
    usedInCasesLabel: 'Usado en casos',
    alternativesLabel: 'Alternativas',
    backLabel: 'Volver a herramientas',
  },
  badges: {
    newBadge: 'Nuevo',
    popularBadge: 'Popular',
    featuredBadge: 'Destacado',
  },
}

async function seedToolsSettings() {
  console.log('🔧 Seeding ToolsSettings global...\n')
  const payload = await getPayload({ config })

  // Seed NL (source locale)
  console.log('📝 Setting NL content...')
  await payload.updateGlobal({
    slug: 'tools-settings',
    locale: 'nl',
    data: NL_SETTINGS,
  })
  console.log('   ✓ NL content set')

  // Seed EN
  console.log('📝 Setting EN content...')
  await payload.updateGlobal({
    slug: 'tools-settings',
    locale: 'en',
    data: EN_SETTINGS,
  })
  console.log('   ✓ EN content set')

  // Seed ES
  console.log('📝 Setting ES content...')
  await payload.updateGlobal({
    slug: 'tools-settings',
    locale: 'es',
    data: ES_SETTINGS,
  })
  console.log('   ✓ ES content set')

  console.log('\n✅ ToolsSettings seeding complete!')
  console.log('\n🌐 View in admin:')
  console.log('   http://localhost:3000/admin/globals/tools-settings')
  console.log('\n📄 View tools pages:')
  console.log('   http://localhost:3000/nl/tools')
  console.log('   http://localhost:3000/en/tools')
  console.log('   http://localhost:3000/es/tools')

  process.exit(0)
}

seedToolsSettings().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
