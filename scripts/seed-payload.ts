/**
 * scripts/seed-payload.ts
 *
 * Seeds Payload CMS with sample data for testing.
 * Creates tags, tools, and 10 cases with images.
 *
 * Security:
 * - No hardcoded credentials
 * - Local images by default (no external downloads)
 * - External downloads require SEED_ALLOW_EXTERNAL=1
 *
 * Run with: npx tsx scripts/seed-payload.ts
 *
 * Related:
 * - payload/collections/Cases.ts
 * - payload/collections/Media.ts
 * - payload/hooks/autoTranslate.ts
 */

// Load environment variables from .env.local
import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'
import https from 'https'

// === Configuration ===
const ALLOW_EXTERNAL = process.env.SEED_ALLOW_EXTERNAL === '1'
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD

// Local demo images directory
const LOCAL_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'demo')

const SAMPLE_TAGS = [
  { slug: 'saas', name: 'SaaS' },
  { slug: 'ai-tool', name: 'AI Tool' },
  { slug: 'productivity', name: 'Productiviteit' },
  { slug: 'automation', name: 'Automatisering' },
  { slug: 'dashboard', name: 'Dashboard' },
]

const SAMPLE_TOOLS = [
  { slug: 'claude', name: 'Claude' },
  { slug: 'cursor', name: 'Cursor' },
  { slug: 'v0', name: 'v0' },
  { slug: 'chatgpt', name: 'ChatGPT' },
  { slug: 'copilot', name: 'GitHub Copilot' },
]

// Sample cases - NL only, translations via API
const SAMPLE_CASES = [
  {
    slug: 'factuurflow',
    title: 'FactuurFlow',
    oneLiner: 'Geautomatiseerde facturatie voor freelancers',
    problem: 'Freelancers besteden uren aan handmatige facturen maken en versturen. Dit kost tijd en leidt tot fouten.',
    solution: 'Een AI-gestuurde app die automatisch facturen genereert op basis van projecturen en direct verstuurt naar klanten.',
    stack: 'Next.js, Prisma, Stripe, Resend',
    learnings: 'AI kan repetitieve taken zoals facturatie volledig automatiseren, maar menselijke controle blijft belangrijk voor edge cases.',
    tags: ['saas', 'automation'],
    tools: ['claude', 'cursor'],
  },
  {
    slug: 'codebuddy',
    title: 'CodeBuddy',
    oneLiner: 'AI pair programming assistent',
    problem: 'Junior developers hebben vaak hulp nodig maar seniors zijn niet altijd beschikbaar.',
    solution: 'Een VS Code extensie die real-time code suggesties geeft en uitleg biedt bij complexe patronen.',
    stack: 'TypeScript, VS Code API, OpenAI',
    learnings: 'Context is alles - de AI presteert veel beter wanneer het de volledige codebase kan analyseren.',
    tags: ['ai-tool', 'productivity'],
    tools: ['chatgpt', 'copilot'],
  },
  {
    slug: 'meetingmind',
    title: 'MeetingMind',
    oneLiner: 'Slimme meeting notities en actiepunten',
    problem: 'Na meetings vergeten teams vaak wat er besproken is en welke acties er moeten gebeuren.',
    solution: 'Een app die meetings transcribeert, samenvat en automatisch actiepunten extraheert naar je projectmanagement tool.',
    stack: 'React, Whisper API, Notion API, Supabase',
    learnings: 'Audio transcriptie is nu goedkoop genoeg voor consumer apps. De echte waarde zit in de post-processing.',
    tags: ['productivity', 'automation'],
    tools: ['claude', 'v0'],
  },
  {
    slug: 'dashforge',
    title: 'DashForge',
    oneLiner: 'No-code dashboard builder met AI',
    problem: 'Business users willen dashboards maar zijn afhankelijk van developers voor elke aanpassing.',
    solution: 'Een drag-and-drop dashboard builder waar je in natuurlijke taal kunt beschrijven wat je wilt zien.',
    stack: 'Next.js, Tremor, PostgreSQL, LangChain',
    learnings: 'Natural language interfaces werken verrassend goed voor data queries wanneer je goede voorbeelden geeft.',
    tags: ['dashboard', 'ai-tool'],
    tools: ['claude', 'cursor'],
  },
  {
    slug: 'contentcraft',
    title: 'ContentCraft',
    oneLiner: 'AI-gestuurde content kalender',
    problem: 'Content teams worstelen met consistente output en ideegeneratie voor social media.',
    solution: 'Een platform dat content ideeën genereert, optimaliseert voor elk platform en automatisch inplant.',
    stack: 'Remix, Drizzle, Cloudflare Workers, Buffer API',
    learnings: 'AI-gegenereerde content heeft altijd menselijke editing nodig, maar het versnelt het proces enorm.',
    tags: ['saas', 'productivity'],
    tools: ['chatgpt', 'v0'],
  },
  {
    slug: 'bugsniper',
    title: 'BugSniper',
    oneLiner: 'Automatische bug detectie en fixes',
    problem: 'Developers besteden 30% van hun tijd aan het vinden en fixen van bugs.',
    solution: 'Een GitHub Action die automatisch potentiële bugs detecteert en fix-suggesties als PR comments plaatst.',
    stack: 'Node.js, GitHub Actions, Tree-sitter, Claude API',
    learnings: 'Static analysis gecombineerd met LLMs vindt bugs die traditionele linters missen.',
    tags: ['ai-tool', 'automation'],
    tools: ['claude', 'copilot'],
  },
  {
    slug: 'learnloop',
    title: 'LearnLoop',
    oneLiner: 'Gepersonaliseerd leerplatform',
    problem: 'Online cursussen zijn one-size-fits-all en houden geen rekening met voorkennis.',
    solution: 'Een adaptief leerplatform dat je kennis test en content aanpast aan jouw niveau en leerstijl.',
    stack: 'SvelteKit, PlanetScale, Mux, OpenAI',
    learnings: 'Spaced repetition gecombineerd met AI-gegenereerde oefeningen verhoogt retentie significant.',
    tags: ['saas', 'ai-tool'],
    tools: ['chatgpt', 'cursor'],
  },
  {
    slug: 'databridge',
    title: 'DataBridge',
    oneLiner: 'No-code data integraties',
    problem: 'Teams gebruiken tientallen tools maar data zit in silo\'s en synchronisatie is handmatig.',
    solution: 'Een visuele tool om data flows te bouwen tussen apps, met AI die transformaties suggereert.',
    stack: 'Next.js, Temporal, Redis, Nango',
    learnings: 'De moeilijkste integraties zijn niet technisch maar begrijpen wat de gebruiker eigenlijk wil bereiken.',
    tags: ['automation', 'dashboard'],
    tools: ['claude', 'v0'],
  },
  {
    slug: 'pitchdeck',
    title: 'PitchDeck AI',
    oneLiner: 'Genereer investor-ready presentaties',
    problem: 'Startups besteden weken aan het maken van pitch decks zonder te weten wat investors willen zien.',
    solution: 'Een app die op basis van je business info een professionele pitch deck genereert met bewezen templates.',
    stack: 'Next.js, Puppeteer, Replicate, Stripe',
    learnings: 'Design generation met AI is nu goed genoeg voor eerste drafts, maar fine-tuning blijft mensenwerk.',
    tags: ['saas', 'productivity'],
    tools: ['claude', 'chatgpt'],
  },
  {
    slug: 'supportbot',
    title: 'SupportBot Pro',
    oneLiner: 'AI klantenservice die écht werkt',
    problem: 'Chatbots geven vaak irrelevante antwoorden en frustreren klanten meer dan ze helpen.',
    solution: 'Een support bot die je documentatie leert, context onthoudt en weet wanneer hij moet escaleren naar een mens.',
    stack: 'Python, FastAPI, Pinecone, Anthropic SDK',
    learnings: 'RAG met goede chunking en re-ranking maakt het verschil tussen een nutteloze en nuttige chatbot.',
    tags: ['ai-tool', 'saas'],
    tools: ['claude', 'cursor'],
  },
]

// External Unsplash images (only used with SEED_ALLOW_EXTERNAL=1)
const EXTERNAL_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop', credit: 'Arnold Francisca', unsplashId: 'photo-1555066931-4365d14bab8c' },
  { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=675&fit=crop', credit: 'Ilya Pavlov', unsplashId: 'photo-1461749280684-dccba630e2f6' },
  { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=675&fit=crop', credit: 'Christopher Gower', unsplashId: 'photo-1498050108023-c5249f4df085' },
  { url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=675&fit=crop', credit: 'Kevin Ku', unsplashId: 'photo-1504639725590-34d0984388bd' },
  { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=675&fit=crop', credit: 'Clement H', unsplashId: 'photo-1517694712202-14dd9538aa97' },
  { url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=675&fit=crop', credit: 'Jantine Doornbos', unsplashId: 'photo-1516116216624-53e697fedbea' },
  { url: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=1200&h=675&fit=crop', credit: 'Sai Kiran Anagani', unsplashId: 'photo-1537432376769-00f5c2f4c8d2' },
  { url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=675&fit=crop', credit: 'Florian Olivo', unsplashId: 'photo-1542831371-29b0f74f9713' },
  { url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1200&h=675&fit=crop', credit: 'Raagesh C', unsplashId: 'photo-1605379399642-870262d3d051' },
  { url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&h=675&fit=crop', credit: 'Mohammad Rahmani', unsplashId: 'photo-1607799279861-4dd421887fb3' },
]

// Download image to temp file (only used when SEED_ALLOW_EXTERNAL=1)
async function downloadImage(url: string, filename: string): Promise<string> {
  const tempDir = path.join(process.cwd(), '.temp-images')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  const filePath = path.join(tempDir, filename)

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath)

    const request = (urlStr: string) => {
      https.get(urlStr, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location
          if (redirectUrl) {
            request(redirectUrl)
            return
          }
        }

        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve(filePath)
        })
      }).on('error', (err) => {
        fs.unlink(filePath, () => {})
        reject(err)
      })
    }

    request(url)
  })
}

// Check if local demo images exist
function checkLocalImages(): boolean {
  if (!fs.existsSync(LOCAL_IMAGES_DIR)) {
    return false
  }

  for (let i = 0; i < SAMPLE_CASES.length; i++) {
    const imagePath = path.join(LOCAL_IMAGES_DIR, `${SAMPLE_CASES[i].slug}.jpg`)
    if (!fs.existsSync(imagePath)) {
      return false
    }
  }

  return true
}

// Get local image path
function getLocalImagePath(slug: string): string | null {
  const imagePath = path.join(LOCAL_IMAGES_DIR, `${slug}.jpg`)
  if (fs.existsSync(imagePath)) {
    return imagePath
  }
  // Also try .png
  const pngPath = path.join(LOCAL_IMAGES_DIR, `${slug}.png`)
  if (fs.existsSync(pngPath)) {
    return pngPath
  }
  return null
}

async function seed() {
  console.log('🌱 Starting Payload CMS seed...\n')

  // === Security warnings ===
  if (ALLOW_EXTERNAL) {
    console.log('⚠️  WARNING: SEED_ALLOW_EXTERNAL=1 is set')
    console.log('   External images will be downloaded from Unsplash.')
    console.log('   This is only recommended for development/demo purposes.\n')
  }

  const hasLocalImages = checkLocalImages()
  if (!hasLocalImages && !ALLOW_EXTERNAL) {
    console.log('📁 Local demo images not found.')
    console.log(`   Expected location: ${LOCAL_IMAGES_DIR}`)
    console.log('   Expected files: factuurflow.jpg, codebuddy.jpg, etc.\n')
    console.log('   Options:')
    console.log('   1. Add local images to /public/images/demo/')
    console.log('   2. Set SEED_ALLOW_EXTERNAL=1 to download from Unsplash\n')
    console.log('   Continuing without images...\n')
  }

  const payload = await getPayload({ config })

  // === Admin User ===
  console.log('👤 Checking admin user...')
  const existingUsers = await payload.find({ collection: 'users', limit: 1 })

  if (existingUsers.docs.length === 0) {
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      await payload.create({
        collection: 'users',
        data: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: 'Admin',
          role: 'admin',
        },
      })
      console.log(`   ✓ Created admin user (${ADMIN_EMAIL})`)
    } else {
      console.log('   ℹ No admin credentials provided.')
      console.log('   Create admin user via /admin first-run flow.')
      console.log('   Or set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD env vars.')
    }
  } else {
    console.log('   ✓ Admin user exists')
  }

  // === Create Tags ===
  console.log('\n🏷️  Creating tags...')
  const tagMap = new Map<string, string | number>()
  for (const tag of SAMPLE_TAGS) {
    const existing = await payload.find({
      collection: 'tags',
      where: { slug: { equals: tag.slug } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'tags',
        locale: 'nl',
        data: tag,
      })
      tagMap.set(tag.slug, created.id)
      console.log(`   ✓ Created tag: ${tag.name}`)
    } else {
      tagMap.set(tag.slug, existing.docs[0].id)
      console.log(`   ○ Tag exists: ${tag.name}`)
    }
  }

  // === Create Tools ===
  console.log('\n🔧 Creating tools...')
  const toolMap = new Map<string, string | number>()
  for (const tool of SAMPLE_TOOLS) {
    const existing = await payload.find({
      collection: 'tools',
      where: { slug: { equals: tool.slug } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      const created = await payload.create({
        collection: 'tools',
        locale: 'nl',
        data: tool,
      })
      toolMap.set(tool.slug, created.id)
      console.log(`   ✓ Created tool: ${tool.name}`)
    } else {
      toolMap.set(tool.slug, existing.docs[0].id)
      console.log(`   ○ Tool exists: ${tool.name}`)
    }
  }

  // === Create Cases ===
  console.log('\n📦 Creating cases...')
  for (let i = 0; i < SAMPLE_CASES.length; i++) {
    const caseData = SAMPLE_CASES[i]

    const existing = await payload.find({
      collection: 'cases',
      where: { slug: { equals: caseData.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`   ○ Case exists: ${caseData.title}`)
      continue
    }

    let mediaId: string | number | undefined

    // Try local image first
    const localImagePath = getLocalImagePath(caseData.slug)
    if (localImagePath) {
      console.log(`   📷 Using local image for ${caseData.title}`)
      const media = await payload.create({
        collection: 'media',
        locale: 'nl',
        data: {
          alt: `Featured image for ${caseData.title}`,
          source: 'upload',
        },
        filePath: localImagePath,
      })
      mediaId = media.id
    } else if (ALLOW_EXTERNAL && EXTERNAL_IMAGES[i]) {
      // Download from Unsplash if allowed
      const externalImage = EXTERNAL_IMAGES[i]
      console.log(`   ↓ Downloading image for ${caseData.title}...`)

      try {
        const imagePath = await downloadImage(externalImage.url, `${caseData.slug}.jpg`)
        const media = await payload.create({
          collection: 'media',
          locale: 'nl',
          data: {
            alt: `Featured image for ${caseData.title}`,
            source: 'unsplash',
            sourceUrl: `https://unsplash.com/photos/${externalImage.unsplashId}`,
            credit: externalImage.credit,
            license: 'Unsplash License',
            licenseNotes: 'Free to use under Unsplash License. See https://unsplash.com/license',
          },
          filePath: imagePath,
        })
        mediaId = media.id
      } catch (error) {
        console.log(`   ⚠ Failed to download image: ${error}`)
      }
    } else {
      console.log(`   ⚠ No image available for ${caseData.title}`)
    }

    // Map tag/tool slugs to IDs
    const tagIds = caseData.tags.map((slug) => tagMap.get(slug)!).filter(Boolean)
    const toolIds = caseData.tools.map((slug) => toolMap.get(slug)!).filter(Boolean)

    // Create case in NL only - translations via API when hook is enabled
    await payload.create({
      collection: 'cases',
      locale: 'nl',
      overrideAccess: true,
      data: {
        slug: caseData.slug,
        status: 'published',
        visibility: i < 3 ? 'featured' : 'public',
        source: 'editorial',
        title: caseData.title,
        oneLiner: caseData.oneLiner,
        featuredImage: mediaId,
        tags: tagIds,
        tools: toolIds,
        problem: caseData.problem,
        solution: caseData.solution,
        stack: caseData.stack,
        learnings: caseData.learnings,
        publishedAt: new Date().toISOString(),
      },
    })

    console.log(`   ✓ Created case: ${caseData.title}`)
  }

  // Cleanup temp images
  const tempDir = path.join(process.cwd(), '.temp-images')
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true })
    console.log('\n🧹 Cleaned up temp images')
  }

  console.log('\n✅ Seed complete!')
  console.log('\n📝 Auto-translation setup:')
  console.log('   1. Set TRANSLATION_PROVIDER in .env.local (openai or deepl)')
  console.log('   2. Add API key (OPENAI_API_KEY or DEEPL_API_KEY)')
  console.log('   3. New/updated NL content will auto-translate to EN/ES')
  console.log('\n🔑 Admin login:')
  console.log('   - URL: http://localhost:3000/admin')
  if (ADMIN_EMAIL) {
    console.log(`   - Email: ${ADMIN_EMAIL}`)
  } else {
    console.log('   - Use /admin first-run flow to create admin')
  }
  console.log('\n🌐 View cases at:')
  console.log('   - http://localhost:3000/nl/explore')
  console.log('   - http://localhost:3000/en/explore')
  console.log('   - http://localhost:3000/es/explore')

  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
