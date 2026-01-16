/**
 * scripts/seed-tools.ts
 *
 * Seeds AI tools and tool categories into the database.
 * Creates categories first, then tools with proper relationships.
 * Run with: npx tsx scripts/seed-tools.ts
 */

// CRITICAL: Load env vars BEFORE any other imports
import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

// Verify DATABASE_URL is loaded (should connect to PostgreSQL, not SQLite)
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set! Script would use local SQLite instead of PostgreSQL.')
  console.error('   Make sure .env.local contains DATABASE_URL')
  process.exit(1)
}
console.log('✓ DATABASE_URL loaded:', process.env.DATABASE_URL.substring(0, 50) + '...')

import { getPayload } from 'payload'
import config from '../payload.config'

// Tool categories to create
const CATEGORIES = [
  {
    slug: 'ai-coding',
    title: 'AI Coding & Development',
    description: 'AI-powered tools for writing, reviewing, and debugging code',
    megaMenuGroup: 'build-code' as const,
    icon: 'code',
    order: 1,
  },
  {
    slug: 'ai-design',
    title: 'AI Design & UI',
    description: 'AI tools for creating interfaces, prototypes, and design systems',
    megaMenuGroup: 'create-media' as const,
    icon: 'palette',
    order: 2,
  },
  {
    slug: 'ai-automation',
    title: 'AI Automation & Workflows',
    description: 'No-code/low-code platforms for automating tasks with AI',
    megaMenuGroup: 'automate' as const,
    icon: 'workflow',
    order: 3,
  },
  {
    slug: 'ai-writing',
    title: 'AI Writing & Content',
    description: 'AI-powered copywriting, content generation, and editing tools',
    megaMenuGroup: 'create-media' as const,
    icon: 'pencil',
    order: 4,
  },
  {
    slug: 'ai-image',
    title: 'AI Image Generation',
    description: 'Tools for generating, editing, and enhancing images with AI',
    megaMenuGroup: 'create-media' as const,
    icon: 'image',
    order: 5,
  },
  {
    slug: 'ai-video',
    title: 'AI Video Generation',
    description: 'AI tools for creating and editing video content',
    megaMenuGroup: 'create-media' as const,
    icon: 'video',
    order: 6,
  },
  {
    slug: 'ai-models',
    title: 'AI Models & APIs',
    description: 'Foundation models and AI API providers',
    megaMenuGroup: 'models-providers' as const,
    icon: 'brain',
    order: 7,
  },
]

// Tools to seed
const TOOLS: Array<{
  slug: string
  name: string
  shortOneLiner: string
  description: string
  websiteUrl: string
  category: string
  pricingModel: 'free' | 'freemium' | 'paid' | 'enterprise'
  pricingFrom?: string
  trialAvailable?: boolean
  primaryUseCase?: string
  bestFor?: string[]
}> = [
  // AI Coding Tools
  {
    slug: 'github-copilot',
    name: 'GitHub Copilot',
    shortOneLiner: 'AI pair programmer van GitHub die code suggesties geeft in je editor',
    description: 'GitHub Copilot is een AI-gestuurde code assistent die direct in je IDE werkt. Het suggereert hele functies, helpt bij het schrijven van tests, en leert van miljoenen open source repositories. Werkt met VS Code, JetBrains, en andere populaire editors.',
    websiteUrl: 'https://github.com/features/copilot',
    category: 'ai-coding',
    pricingModel: 'freemium',
    pricingFrom: '$10/maand',
    trialAvailable: true,
    primaryUseCase: 'Code completion',
    bestFor: ['Dagelijkse code completion', 'Boilerplate generatie', 'Test schrijven', 'Documentatie'],
  },
  {
    slug: 'cursor',
    name: 'Cursor',
    shortOneLiner: 'AI-first code editor gebouwd op VS Code met native AI integratie',
    description: 'Cursor is een fork van VS Code specifiek gebouwd voor AI-assisted development. Met Cmd+K kun je code genereren, refactoren, en vragen stellen over je codebase. Ondersteunt Claude, GPT-4, en lokale modellen.',
    websiteUrl: 'https://cursor.sh',
    category: 'ai-coding',
    pricingModel: 'freemium',
    pricingFrom: '$20/maand',
    trialAvailable: true,
    primaryUseCase: 'AI-native IDE',
    bestFor: ['Full-context code editing', 'Codebase-aware vragen', 'Multi-file refactoring', 'Vibecoding'],
  },
  {
    slug: 'windsurf',
    name: 'Windsurf',
    shortOneLiner: 'Codeium\'s AI IDE met Cascade voor agentic coding',
    description: 'Windsurf is de AI IDE van Codeium met hun Cascade feature voor autonome coding taken. Het kan hele features implementeren, bugs fixen, en refactoring uitvoeren met minimale input. Gratis tier beschikbaar.',
    websiteUrl: 'https://codeium.com/windsurf',
    category: 'ai-coding',
    pricingModel: 'freemium',
    pricingFrom: 'Gratis',
    trialAvailable: false,
    primaryUseCase: 'Agentic coding',
    bestFor: ['Autonome feature development', 'Bug fixing', 'Gratis AI coding'],
  },
  {
    slug: 'tabnine',
    name: 'Tabnine',
    shortOneLiner: 'Privacy-first AI code completion die lokaal draait',
    description: 'Tabnine biedt AI code completion met focus op privacy en security. Het kan volledig on-premise draaien voor enterprise klanten. Leert van je eigen codebase zonder data naar de cloud te sturen.',
    websiteUrl: 'https://www.tabnine.com',
    category: 'ai-coding',
    pricingModel: 'freemium',
    pricingFrom: '$12/maand',
    trialAvailable: true,
    primaryUseCase: 'Private code completion',
    bestFor: ['Enterprise security', 'On-premise deployment', 'Privacy-gevoelige projecten'],
  },
  {
    slug: 'amazon-q',
    name: 'Amazon Q Developer',
    shortOneLiner: 'AWS\'s AI assistent voor code en cloud development',
    description: 'Amazon Q Developer is AWS\'s AI-powered developer tool. Het helpt bij het schrijven van code, debugging, en specifiek bij AWS services integratie. Inclusief security scanning en code transformatie.',
    websiteUrl: 'https://aws.amazon.com/q/developer/',
    category: 'ai-coding',
    pricingModel: 'freemium',
    pricingFrom: '$19/maand',
    primaryUseCase: 'AWS development',
    bestFor: ['AWS integraties', 'Cloud architecture', 'Security scanning'],
  },
  {
    slug: 'aider',
    name: 'Aider',
    shortOneLiner: 'Open source AI pair programmer voor de terminal',
    description: 'Aider is een open source command-line tool die AI pair programming naar je terminal brengt. Het kan meerdere bestanden tegelijk bewerken, werkt met git, en ondersteunt verschillende LLM providers.',
    websiteUrl: 'https://aider.chat',
    category: 'ai-coding',
    pricingModel: 'free',
    pricingFrom: 'Gratis (BYOK)',
    primaryUseCase: 'Terminal-based AI coding',
    bestFor: ['Open source development', 'Terminal workflows', 'Git-integrated coding'],
  },
  {
    slug: 'continue',
    name: 'Continue',
    shortOneLiner: 'Open source AI code assistent voor VS Code en JetBrains',
    description: 'Continue is een open source VS Code en JetBrains extensie voor AI-assisted development. Je kunt elke LLM gebruiken (OpenAI, Anthropic, lokale modellen) en het is volledig customizable.',
    websiteUrl: 'https://continue.dev',
    category: 'ai-coding',
    pricingModel: 'free',
    pricingFrom: 'Gratis (BYOK)',
    primaryUseCase: 'Customizable AI assistant',
    bestFor: ['Custom LLM configuratie', 'Open source', 'Privacy control'],
  },
  {
    slug: 'cline',
    name: 'Cline',
    shortOneLiner: 'Autonomous AI coding agent als VS Code extensie',
    description: 'Cline (voorheen Claude Dev) is een VS Code extensie die Claude als een autonome coding agent inzet. Het kan terminal commands uitvoeren, bestanden aanmaken, en complexe taken voltooien met human-in-the-loop approval.',
    websiteUrl: 'https://github.com/cline/cline',
    category: 'ai-coding',
    pricingModel: 'free',
    pricingFrom: 'Gratis (BYOK)',
    primaryUseCase: 'Autonomous coding agent',
    bestFor: ['Complexe taken', 'Agentic workflows', 'Human-in-the-loop development'],
  },

  // AI Design Tools
  {
    slug: 'uizard',
    name: 'Uizard',
    shortOneLiner: 'AI-powered UI design tool voor snelle prototyping',
    description: 'Uizard laat je UI designs maken door te beschrijven wat je wilt, of door screenshots te uploaden die het converteert naar bewerkbare designs. Ideaal voor snelle prototypes zonder design skills.',
    websiteUrl: 'https://uizard.io',
    category: 'ai-design',
    pricingModel: 'freemium',
    pricingFrom: '$12/maand',
    trialAvailable: true,
    primaryUseCase: 'AI UI prototyping',
    bestFor: ['Snelle prototypes', 'Screenshot naar design', 'Non-designers'],
  },
  {
    slug: 'galileo-ai',
    name: 'Galileo AI',
    shortOneLiner: 'Genereer UI designs van tekst beschrijvingen',
    description: 'Galileo AI genereert complete UI designs van natuurlijke taal beschrijvingen. Het creëert professionele interfaces met echte content, niet placeholder tekst, en exporteert naar Figma.',
    websiteUrl: 'https://www.usegalileo.ai',
    category: 'ai-design',
    pricingModel: 'freemium',
    pricingFrom: '$19/maand',
    primaryUseCase: 'Text-to-UI generation',
    bestFor: ['UI mockups', 'Design inspiratie', 'Snelle iteraties'],
  },
  {
    slug: 'magician',
    name: 'Magician for Figma',
    shortOneLiner: 'AI-powered Figma plugin voor design automation',
    description: 'Magician is een Figma plugin die AI integraties brengt: genereer copy, maak iconen, en pas designs aan met AI. Direct binnen je bestaande Figma workflow.',
    websiteUrl: 'https://magician.design',
    category: 'ai-design',
    pricingModel: 'freemium',
    pricingFrom: '$5/maand',
    primaryUseCase: 'Figma AI assistant',
    bestFor: ['Figma users', 'Copy generatie', 'Icon design'],
  },
  {
    slug: 'v0',
    name: 'v0 by Vercel',
    shortOneLiner: 'Genereer React UI componenten met AI',
    description: 'v0 is Vercel\'s AI tool die React componenten genereert van tekst of afbeeldingen. Het produceert productie-ready code met Tailwind CSS en shadcn/ui componenten.',
    websiteUrl: 'https://v0.dev',
    category: 'ai-design',
    pricingModel: 'freemium',
    pricingFrom: '$20/maand',
    primaryUseCase: 'React component generation',
    bestFor: ['React developers', 'UI component prototyping', 'Tailwind CSS'],
  },

  // AI Automation Tools
  {
    slug: 'zapier',
    name: 'Zapier',
    shortOneLiner: 'Automatiseer workflows tussen 6000+ apps',
    description: 'Zapier is de meest populaire no-code automatisering tool. Verbind duizenden apps en automatiseer repetitieve taken. Nu met AI features voor slimmere workflows en natural language automation.',
    websiteUrl: 'https://zapier.com',
    category: 'ai-automation',
    pricingModel: 'freemium',
    pricingFrom: '$19.99/maand',
    trialAvailable: true,
    primaryUseCase: 'App automation',
    bestFor: ['Multi-app workflows', 'No-code automation', 'Business process automation'],
  },
  {
    slug: 'make',
    name: 'Make (Integromat)',
    shortOneLiner: 'Visuele automation platform voor complexe workflows',
    description: 'Make is een krachtige visual automation tool met meer flexibiliteit dan Zapier. Bouw complexe workflows met branches, loops, en data transformaties. Populair bij power users.',
    websiteUrl: 'https://www.make.com',
    category: 'ai-automation',
    pricingModel: 'freemium',
    pricingFrom: '$9/maand',
    trialAvailable: true,
    primaryUseCase: 'Complex automation',
    bestFor: ['Complexe logic', 'Data transformatie', 'Visual workflow building'],
  },
  {
    slug: 'n8n',
    name: 'n8n',
    shortOneLiner: 'Open source workflow automation met AI capabilities',
    description: 'n8n is een open source, self-hostable workflow automation tool. Met native AI nodes voor LLM integraties en een actieve community. Ideaal voor developers die controle willen.',
    websiteUrl: 'https://n8n.io',
    category: 'ai-automation',
    pricingModel: 'freemium',
    pricingFrom: 'Gratis (self-hosted)',
    trialAvailable: true,
    primaryUseCase: 'Developer-friendly automation',
    bestFor: ['Self-hosting', 'AI workflows', 'Developer control'],
  },
  {
    slug: 'lindy',
    name: 'Lindy',
    shortOneLiner: 'AI agents die taken voor je uitvoeren',
    description: 'Lindy laat je AI agents bouwen die autonome taken uitvoeren: email management, meeting scheduling, research, en meer. Combineer meerdere "Lindies" voor complexe workflows.',
    websiteUrl: 'https://www.lindy.ai',
    category: 'ai-automation',
    pricingModel: 'freemium',
    pricingFrom: '$49/maand',
    primaryUseCase: 'AI agents',
    bestFor: ['Email automation', 'Meeting scheduling', 'Persoonlijke AI assistenten'],
  },
  {
    slug: 'activepieces',
    name: 'Activepieces',
    shortOneLiner: 'Open source Zapier alternatief',
    description: 'Activepieces is een modern, open source automation platform. Self-host het gratis of gebruik hun cloud versie. Clean interface en groeiende connector library.',
    websiteUrl: 'https://www.activepieces.com',
    category: 'ai-automation',
    pricingModel: 'freemium',
    pricingFrom: 'Gratis (self-hosted)',
    primaryUseCase: 'Open source automation',
    bestFor: ['Open source fans', 'Self-hosting', 'Budget-friendly automation'],
  },

  // AI Writing Tools
  {
    slug: 'jasper',
    name: 'Jasper',
    shortOneLiner: 'Enterprise AI content platform voor marketing teams',
    description: 'Jasper is een AI content platform gericht op enterprise marketing teams. Het leert je brand voice, integreert met je marketing stack, en produceert content op schaal. Inclusief template library.',
    websiteUrl: 'https://www.jasper.ai',
    category: 'ai-writing',
    pricingModel: 'paid',
    pricingFrom: '$49/maand',
    trialAvailable: true,
    primaryUseCase: 'Marketing content',
    bestFor: ['Marketing teams', 'Brand voice consistency', 'Content op schaal'],
  },
  {
    slug: 'copy-ai',
    name: 'Copy.ai',
    shortOneLiner: 'AI copywriting voor marketing en sales',
    description: 'Copy.ai helpt bij het schrijven van marketing copy, social media posts, emails, en meer. Met workflows voor sales outreach en een genereuze gratis tier voor starters.',
    websiteUrl: 'https://www.copy.ai',
    category: 'ai-writing',
    pricingModel: 'freemium',
    pricingFrom: '$36/maand',
    trialAvailable: true,
    primaryUseCase: 'Marketing copy',
    bestFor: ['Sales outreach', 'Social media copy', 'Email marketing'],
  },
  {
    slug: 'writesonic',
    name: 'Writesonic',
    shortOneLiner: 'AI writing platform voor artikelen en marketing content',
    description: 'Writesonic combineert artikel schrijven met marketing copy generatie. Inclusief Chatsonic (ChatGPT alternatief) en Photosonic voor beelden. Goede prijs-kwaliteit verhouding.',
    websiteUrl: 'https://writesonic.com',
    category: 'ai-writing',
    pricingModel: 'freemium',
    pricingFrom: '$12/maand',
    trialAvailable: true,
    primaryUseCase: 'Long-form content',
    bestFor: ['Blog artikelen', 'SEO content', 'Budget-friendly AI writing'],
  },

  // AI Image Generation
  {
    slug: 'midjourney',
    name: 'Midjourney',
    shortOneLiner: 'De meest artistieke AI image generator',
    description: 'Midjourney is bekend om zijn unieke, artistieke stijl en hoge kwaliteit output. Toegankelijk via Discord, het produceert beelden die vaak niet te onderscheiden zijn van menselijk artwork.',
    websiteUrl: 'https://www.midjourney.com',
    category: 'ai-image',
    pricingModel: 'paid',
    pricingFrom: '$10/maand',
    primaryUseCase: 'Artistic image generation',
    bestFor: ['Kunstzinnige beelden', 'Marketing visuals', 'Conceptueel design'],
  },
  {
    slug: 'dall-e',
    name: 'DALL-E 3',
    shortOneLiner: 'OpenAI\'s image generator met uitstekend tekstbegrip',
    description: 'DALL-E 3 excelleert in het begrijpen van complexe prompts en het genereren van beelden die exact overeenkomen met je beschrijving. Geïntegreerd in ChatGPT en Microsoft tools.',
    websiteUrl: 'https://openai.com/dall-e-3',
    category: 'ai-image',
    pricingModel: 'freemium',
    pricingFrom: '$20/maand (via ChatGPT Plus)',
    primaryUseCase: 'Accurate image generation',
    bestFor: ['Precise prompts', 'Tekst in beelden', 'ChatGPT integratie'],
  },
  {
    slug: 'stable-diffusion',
    name: 'Stable Diffusion',
    shortOneLiner: 'Open source image generation model',
    description: 'Stable Diffusion is het populairste open source image model. Draai het lokaal of via cloud services. Enorm customizable met fine-tuning, LoRAs, en community models.',
    websiteUrl: 'https://stability.ai',
    category: 'ai-image',
    pricingModel: 'free',
    pricingFrom: 'Gratis (open source)',
    primaryUseCase: 'Open source image AI',
    bestFor: ['Lokaal draaien', 'Customization', 'Fine-tuning'],
  },
  {
    slug: 'leonardo-ai',
    name: 'Leonardo.ai',
    shortOneLiner: 'AI image platform voor game assets en creative content',
    description: 'Leonardo.ai is populair voor game development en creative content. Uitstekende tools voor consistente karakters, texturen, en stylized art. Genereus gratis plan.',
    websiteUrl: 'https://leonardo.ai',
    category: 'ai-image',
    pricingModel: 'freemium',
    pricingFrom: '$12/maand',
    trialAvailable: false,
    primaryUseCase: 'Game & creative assets',
    bestFor: ['Game development', 'Consistente karakters', 'Texture generation'],
  },
  {
    slug: 'ideogram',
    name: 'Ideogram',
    shortOneLiner: 'AI image generator gespecialiseerd in tekst rendering',
    description: 'Ideogram is de beste AI voor het genereren van beelden met tekst. Waar andere tools falen bij het renderen van woorden, produceert Ideogram accurate, leesbare tekst in beelden.',
    websiteUrl: 'https://ideogram.ai',
    category: 'ai-image',
    pricingModel: 'freemium',
    pricingFrom: '$7/maand',
    primaryUseCase: 'Text in images',
    bestFor: ['Logo ontwerp', 'Posters', 'Tekst-heavy visuals'],
  },
  {
    slug: 'flux',
    name: 'Flux',
    shortOneLiner: 'State-of-the-art open source image model van Black Forest Labs',
    description: 'Flux is het nieuwste krachtige image model van Black Forest Labs. Open weights, uitstekende kwaliteit, en snelle generatie. Beschikbaar in verschillende sizes voor verschillende use cases.',
    websiteUrl: 'https://blackforestlabs.ai',
    category: 'ai-image',
    pricingModel: 'free',
    pricingFrom: 'Gratis (open source)',
    primaryUseCase: 'High-quality open source',
    bestFor: ['Open source development', 'Snelle generatie', 'Hoge kwaliteit'],
  },

  // AI Video Generation
  {
    slug: 'runway',
    name: 'Runway Gen-3',
    shortOneLiner: 'Professionele AI video generatie en editing',
    description: 'Runway is de industriestandaard voor AI video tools. Gen-3 Alpha produceert hoogwaardige video van tekst of beelden. Gebruikt door Hollywood studios en content creators.',
    websiteUrl: 'https://runwayml.com',
    category: 'ai-video',
    pricingModel: 'freemium',
    pricingFrom: '$12/maand',
    trialAvailable: true,
    primaryUseCase: 'Professional video generation',
    bestFor: ['Professionele video', 'Film production', 'Creative agencies'],
  },
  {
    slug: 'pika',
    name: 'Pika Labs',
    shortOneLiner: 'Toegankelijke AI video generator voor iedereen',
    description: 'Pika maakt AI video generatie toegankelijk met een simpele interface. Genereer video van tekst of beelden, met speciale effecten en lip sync features.',
    websiteUrl: 'https://pika.art',
    category: 'ai-video',
    pricingModel: 'freemium',
    pricingFrom: '$8/maand',
    primaryUseCase: 'Accessible video AI',
    bestFor: ['Beginners', 'Social media content', 'Quick video clips'],
  },
  {
    slug: 'kling',
    name: 'Kling AI',
    shortOneLiner: 'Chinese AI video generator met lange clips',
    description: 'Kling AI van Kuaishou genereert langere video clips dan veel concurrenten. Bekend om realistische menselijke bewegingen en high-fidelity output. Toegankelijk via web interface.',
    websiteUrl: 'https://klingai.com',
    category: 'ai-video',
    pricingModel: 'freemium',
    pricingFrom: '$5/maand',
    primaryUseCase: 'Long-form video generation',
    bestFor: ['Langere video clips', 'Realistische beweging', 'Budget-friendly'],
  },
  {
    slug: 'luma-dream-machine',
    name: 'Luma Dream Machine',
    shortOneLiner: 'Snelle AI video generatie met fysica-begrip',
    description: 'Luma\'s Dream Machine is opvallend snel en produceert video met overtuigende fysica. Goed voor snelle iteraties en het genereren van realistische bewegende beelden.',
    websiteUrl: 'https://lumalabs.ai/dream-machine',
    category: 'ai-video',
    pricingModel: 'freemium',
    pricingFrom: '$23.99/maand',
    primaryUseCase: 'Fast video generation',
    bestFor: ['Snelle generatie', 'Realistische fysica', 'Product video'],
  },

  // AI Models & APIs
  {
    slug: 'claude',
    name: 'Claude',
    shortOneLiner: 'Anthropic\'s AI assistent bekend om veiligheid en nuance',
    description: 'Claude is Anthropic\'s flagship AI model, bekend om thoughtful responses, sterke coding abilities, en lange context windows (200K tokens). Beschikbaar via API en claude.ai.',
    websiteUrl: 'https://claude.ai',
    category: 'ai-models',
    pricingModel: 'freemium',
    pricingFrom: '$20/maand (Pro)',
    primaryUseCase: 'General AI assistant',
    bestFor: ['Coding taken', 'Lange documenten', 'Nuanced antwoorden'],
  },
  {
    slug: 'chatgpt',
    name: 'ChatGPT',
    shortOneLiner: 'OpenAI\'s populairste AI chatbot met GPT-4',
    description: 'ChatGPT is de meest gebruikte AI chatbot ter wereld. Met GPT-4 Turbo, DALL-E, browsing, en plugins. De standaard waartegen andere AI\'s worden gemeten.',
    websiteUrl: 'https://chat.openai.com',
    category: 'ai-models',
    pricingModel: 'freemium',
    pricingFrom: '$20/maand (Plus)',
    primaryUseCase: 'General AI assistant',
    bestFor: ['Brede taken', 'Plugin ecosystem', 'Mainstream adoptie'],
  },
  {
    slug: 'gemini',
    name: 'Google Gemini',
    shortOneLiner: 'Google\'s multimodale AI met deep Google integratie',
    description: 'Gemini is Google\'s antwoord op GPT-4. Sterk in multimodale taken (tekst, beeld, video) en geïntegreerd met Google Workspace. Beschikbaar via Gemini Advanced.',
    websiteUrl: 'https://gemini.google.com',
    category: 'ai-models',
    pricingModel: 'freemium',
    pricingFrom: '$19.99/maand (Advanced)',
    primaryUseCase: 'Multimodal AI',
    bestFor: ['Google Workspace', 'Multimodale taken', 'Research'],
  },
  {
    slug: 'perplexity',
    name: 'Perplexity',
    shortOneLiner: 'AI-powered search engine met bronvermelding',
    description: 'Perplexity combineert AI met real-time web search. Het geeft antwoorden met bronvermeldingen, ideaal voor research en fact-checking. Pro versie ondersteunt meerdere AI models.',
    websiteUrl: 'https://www.perplexity.ai',
    category: 'ai-models',
    pricingModel: 'freemium',
    pricingFrom: '$20/maand (Pro)',
    primaryUseCase: 'AI-powered search',
    bestFor: ['Research', 'Fact-checking', 'Actuele informatie'],
  },
  {
    slug: 'groq',
    name: 'Groq',
    shortOneLiner: 'Extreem snelle LLM inference met custom hardware',
    description: 'Groq biedt de snelste LLM inference ter wereld dankzij hun custom LPU chips. Ideaal voor real-time applicaties waar latency kritiek is. Gratis tier beschikbaar.',
    websiteUrl: 'https://groq.com',
    category: 'ai-models',
    pricingModel: 'freemium',
    pricingFrom: 'Gratis tier beschikbaar',
    primaryUseCase: 'Fast inference',
    bestFor: ['Lage latency', 'Real-time apps', 'Open source models'],
  },
]

async function seedTools() {
  console.log('🌱 Seeding tools and categories...\n')

  const payload = await getPayload({ config })

  // Step 1: Create or update categories
  console.log('📁 Creating categories...\n')
  const categoryMap: Record<string, string> = {}

  for (const cat of CATEGORIES) {
    try {
      // Check if category exists
      const existing = await payload.find({
        collection: 'tool-categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        // Update existing
        await payload.update({
          collection: 'tool-categories',
          id: existing.docs[0].id,
          locale: 'nl',
          data: {
            title: cat.title,
            description: cat.description,
            megaMenuGroup: cat.megaMenuGroup,
            icon: cat.icon,
            order: cat.order,
            showInMegaMenu: true,
          },
          context: { skipTranslation: true }, // Skip auto-translate to avoid Neon timeout
        })
        categoryMap[cat.slug] = existing.docs[0].id as string
        console.log(`✓ Updated category: ${cat.title}`)
      } else {
        // Create new
        const newCat = await payload.create({
          collection: 'tool-categories',
          locale: 'nl',
          data: {
            slug: cat.slug,
            title: cat.title,
            description: cat.description,
            megaMenuGroup: cat.megaMenuGroup,
            icon: cat.icon,
            order: cat.order,
            showInMegaMenu: true,
          },
          context: { skipTranslation: true }, // Skip auto-translate to avoid Neon timeout
        })
        categoryMap[cat.slug] = newCat.id as string
        console.log(`✓ Created category: ${cat.title}`)
      }
    } catch (error) {
      console.error(`❌ Failed to create category ${cat.slug}:`, error)
    }
  }

  console.log('\n🔧 Creating tools...\n')

  // Step 2: Create or update tools
  for (const tool of TOOLS) {
    try {
      // Check if tool exists
      const existing = await payload.find({
        collection: 'tools',
        where: { slug: { equals: tool.slug } },
        limit: 1,
      })

      const categoryId = categoryMap[tool.category]
      if (!categoryId) {
        console.warn(`⚠ Category not found for tool ${tool.slug}: ${tool.category}`)
        continue
      }

      const toolData = {
        slug: tool.slug,
        name: tool.name,
        shortOneLiner: tool.shortOneLiner,
        description: tool.description,
        websiteUrl: tool.websiteUrl,
        category: categoryId,
        pricingModel: tool.pricingModel,
        pricingFrom: tool.pricingFrom,
        trialAvailable: tool.trialAvailable || false,
        primaryUseCase: tool.primaryUseCase,
        bestFor: tool.bestFor?.map(point => ({ point })),
        status: 'published' as const,
        ingestSource: 'manual' as const,
        syncTranslationsFromNL: true,
      }

      if (existing.docs.length > 0) {
        // Update existing
        await payload.update({
          collection: 'tools',
          id: existing.docs[0].id,
          locale: 'nl',
          data: toolData,
          context: { skipTranslation: true }, // Skip auto-translate to avoid Neon timeout
        })
        console.log(`✓ Updated: ${tool.name}`)
      } else {
        // Create new
        await payload.create({
          collection: 'tools',
          locale: 'nl',
          data: toolData,
          context: { skipTranslation: true }, // Skip auto-translate to avoid Neon timeout
        })
        console.log(`✓ Created: ${tool.name}`)
      }
    } catch (error) {
      console.error(`❌ Failed to create tool ${tool.slug}:`, error)
    }
  }

  console.log('\n✅ Tools seeding complete!')
  console.log(`Created/updated ${CATEGORIES.length} categories and ${TOOLS.length} tools.`)
  console.log('Translations should be triggered automatically by the afterChange hook.')

  process.exit(0)
}

seedTools().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
