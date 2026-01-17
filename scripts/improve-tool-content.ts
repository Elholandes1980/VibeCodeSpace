/**
 * scripts/improve-tool-content.ts
 *
 * Updates tool content with improved, research-backed descriptions.
 * Run with: DATABASE_URL="..." npx tsx scripts/improve-tool-content.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not set!')
  process.exit(1)
}

import { getPayload } from 'payload'
import config from '../payload.config'

// Improved tool content based on research
const toolImprovements: Record<string, {
  description?: string
  bestFor?: Array<{ point: string }>
  notFor?: Array<{ point: string }>
  keyFeatures?: Array<{ title: string; detail: string }>
}> = {
  // AI Coding Assistants
  cursor: {
    description: `Cursor is een AI-first code editor gebaseerd op VS Code met diep geïntegreerde AI-functies. Het begrijpt je volledige codebase context, niet alleen het huidige bestand, wat resulteert in veel nauwkeurigere suggesties. De Composer-functie maakt multi-file code generatie mogelijk met een intuïtieve diff-viewer UX. Veel developers rapporteren een 2-3x productiviteitsverhoging.`,
    bestFor: [
      { point: 'Developers die al bekend zijn met VS Code - migratie is naadloos met al je settings en extensions' },
      { point: 'Grote projecten waar volledige codebase context cruciaal is voor accurate AI-suggesties' },
      { point: 'Teams die multi-file refactoring nodig hebben met de krachtige Composer-functie' },
      { point: 'Power users die directe controle willen over welke bestanden worden meegenomen in de context' },
    ],
    notFor: [
      { point: 'Developers die een simpelere interface prefereren - Cursor kan cluttered aanvoelen' },
      { point: 'Werken met zeer grote bestanden - kan soms laggen vergeleken met vanilla VS Code' },
      { point: 'Teams met beperkt budget die geen $20/maand willen investeren' },
    ],
    keyFeatures: [
      { title: 'Composer', detail: 'Multi-file code generatie met visuele diff-preview' },
      { title: 'Full Codebase Context', detail: 'Begrijpt je hele project, niet alleen het huidige bestand' },
      { title: 'Chat & Edit', detail: 'Inline editing met AI of conversational interface' },
    ],
  },
  aider: {
    description: `Aider is een open-source AI pair programming tool die volledig in je terminal leeft. In plaats van inline suggesties beschrijf je wat je wilt wijzigen, waarna Aider Git-style diffs genereert die je kunt reviewen en toepassen. Zeer kostenefficiënt omdat het geen agentic tool is en geoptimaliseerd is voor context fetching.`,
    bestFor: [
      { point: 'Terminal-first developers die van de command line houden en geen GUI nodig hebben' },
      { point: 'Developers die granulaire controle willen over Git commits en code changes' },
      { point: 'Budget-bewuste teams - Aider gebruikt veel minder tokens dan agentic tools' },
      { point: 'Test-driven development workflows met stepwise verbeteringen' },
    ],
    notFor: [
      { point: 'Wie inline autocomplete suggesties verwacht - Aider werkt via describe-review-apply workflow' },
      { point: 'Beginners die liever een visuele interface hebben' },
      { point: 'Complexe multi-file refactoring taken - accuraatheid rond 60-65%' },
    ],
    keyFeatures: [
      { title: 'Git-Native', detail: 'Genereert diffs die direct integreren met je version control' },
      { title: 'Model Flexibiliteit', detail: 'Werkt met Claude, GPT-4, DeepSeek en lokale modellen' },
      { title: 'Kostenefficiënt', detail: 'Geoptimaliseerd voor minimaal token gebruik' },
    ],
  },
  'github-copilot': {
    description: `GitHub Copilot is de meest gebruikte AI coding assistant met diepe IDE-integratie. Het blinkt uit in het genereren van boilerplate code en bespaart tijd op simpelere taken. De code review functie is recent verbeterd om grotere pull requests te kunnen analyseren. Werkt het best met populaire programmeertalen.`,
    bestFor: [
      { point: 'Dagelijks programmeren met veel boilerplate en repetitieve taken' },
      { point: 'Teams die al in het GitHub ecosysteem werken met naadloze integratie' },
      { point: 'Mainstream programmeertalen (JavaScript, Python, Java) waar training data uitgebreid is' },
      { point: 'Enterprise omgevingen met compliance en security requirements' },
    ],
    notFor: [
      { point: 'Complexe logica of edge cases - suggesties kunnen suboptimaal zijn' },
      { point: 'Niche of minder gebruikte programmeertalen met beperkte training data' },
      { point: 'Projecten met 300+ bestanden waar context limitations merkbaar zijn' },
    ],
    keyFeatures: [
      { title: 'Code Review', detail: 'AI-powered PR reviews (premium feature)' },
      { title: 'IDE Integratie', detail: 'VS Code, JetBrains, Neovim support' },
      { title: 'Enterprise Ready', detail: 'Copilot Business en Enterprise plans beschikbaar' },
    ],
  },
  // Image Generation
  midjourney: {
    description: `Midjourney is de gouden standaard voor artistieke AI-beelden met een unieke, herkenbare stijl. V7 (april 2025) bracht een complete rebuild met 40% minder anatomische fouten en 35% betere prompt-interpretatie. Video generatie is nu ook beschikbaar. Toegankelijk via Discord, wat zowel een community-voordeel als een UI-nadeel is.`,
    bestFor: [
      { point: 'Kunstzinnige visuals met cinematic lighting, texturen en sfeer' },
      { point: 'Marketing en branding materiaal waar esthetiek belangrijker is dan realisme' },
      { point: 'Concept art en storyboarding voor creative teams' },
      { point: 'Designers die willen leren van een actieve community via Discord' },
    ],
    notFor: [
      { point: 'Teams die privacy nodig hebben - alle beelden zijn default publiek (Stealth Mode is $60+/maand)' },
      { point: 'Wie nauwkeurige tekst in beelden nodig heeft - text rendering blijft een zwak punt' },
      { point: 'Developers of non-designers die de Discord interface verwarrend vinden' },
      { point: 'Wie specifieke delen wil aanpassen - regeneratie is altijd volledig' },
    ],
    keyFeatures: [
      { title: 'V7 Engine', detail: '40% minder anatomie-fouten, betere hands en gezichten' },
      { title: 'Video Generatie', detail: 'Statische beelden omzetten naar 5-21 seconde clips' },
      { title: 'Community', detail: 'Leer van prompts en resultaten van andere gebruikers' },
    ],
  },
  'dall-e': {
    description: `DALL-E 3 van OpenAI excelleert in het begrijpen van complexe, gedetailleerde prompts en het genereren van beelden die exact overeenkomen met je beschrijving. Geïntegreerd in ChatGPT en Microsoft tools, wat het zeer toegankelijk maakt. Sterke text rendering vergeleken met concurrenten.`,
    bestFor: [
      { point: 'Nauwkeurige prompt-matching wanneer je heel specifieke beelden nodig hebt' },
      { point: 'Beelden met leesbare tekst - significant beter dan Midjourney' },
      { point: 'Casual gebruikers die al ChatGPT gebruiken - geen extra tool nodig' },
      { point: 'Microsoft 365 gebruikers met naadloze integratie' },
    ],
    notFor: [
      { point: 'Wie de unieke artistieke stijl van Midjourney zoekt' },
      { point: 'High-volume productie waar kosten per beeld oplopen' },
      { point: 'Developers die API-toegang zoeken zonder ChatGPT Plus' },
    ],
    keyFeatures: [
      { title: 'Prompt Begrip', detail: 'Uitstekend in complexe, multi-element beschrijvingen' },
      { title: 'Text in Images', detail: 'Accurate rendering van tekst in gegenereerde beelden' },
      { title: 'ChatGPT Integratie', detail: 'Direct genereren vanuit ChatGPT conversaties' },
    ],
  },
  'stable-diffusion': {
    description: `Stable Diffusion is het populairste open source image model. Draai het volledig lokaal voor maximale privacy, of gebruik cloud services. Enorm customizable met fine-tuning, LoRAs, en duizenden community models. De ultieme tool voor wie volledige controle wil over AI image generation.`,
    bestFor: [
      { point: 'Privacy-gevoelige projecten die lokale verwerking vereisen' },
      { point: 'Developers en tinkerers die willen fine-tunen en customizen' },
      { point: 'High-volume generatie zonder per-beeld kosten' },
      { point: 'Specifieke stijlen met LoRAs en community models' },
    ],
    notFor: [
      { point: 'Wie geen GPU heeft of niet technisch aangelegd is voor setup' },
      { point: 'Beginners die een simpele interface zoeken' },
      { point: 'Teams die out-of-the-box kwaliteit verwachten zonder tweaking' },
    ],
    keyFeatures: [
      { title: 'Open Source', detail: 'Volledige toegang tot model weights en code' },
      { title: 'LoRA Support', detail: 'Fine-tune voor specifieke stijlen of onderwerpen' },
      { title: 'Lokaal Draaien', detail: 'Geen cloud kosten, volledige privacy' },
    ],
  },
  // UI/Code Generation
  v0: {
    description: `Vercel v0 is een AI-powered frontend UI generator die React componenten maakt van tekst of design mockups. Het genereert schone, goed gestructureerde code die naadloos integreert met Next.js, Tailwind CSS en shadcn/ui. Uniek is de design-to-code functie waarbij je Figma screenshots kunt uploaden.`,
    bestFor: [
      { point: 'Frontend developers die al werken met Next.js + Tailwind + shadcn/ui stack' },
      { point: 'Snelle prototyping van dashboards, landing pages en marketing sites' },
      { point: 'Designers die design mockups willen omzetten naar werkende React code' },
      { point: 'Solo builders die UI scaffolding willen versnellen' },
    ],
    notFor: [
      { point: 'Backend development - v0 genereert geen server logica of database integratie' },
      { point: 'Beginners zonder React/Next.js kennis - het is geen no-code tool' },
      { point: 'Teams met custom design systems die niet op shadcn/ui zijn gebaseerd' },
      { point: 'Lange conversaties - context verlies kan leiden tot inconsistente output' },
    ],
    keyFeatures: [
      { title: 'Design-to-Code', detail: 'Upload Figma screenshots en krijg React componenten' },
      { title: 'Agentic Features', detail: 'Plant stappen, haalt data op, fixt dependencies automatisch' },
      { title: 'Vercel Integratie', detail: 'Direct deployen naar Vercel vanuit v0' },
    ],
  },
  // AI Chat/Research
  claude: {
    description: `Claude van Anthropic is de AI-keuze voor serieuze developers. Met een enorm context window van 200K tokens begrijpt het grote codebases volledig. Claude wint consistente in coding vergelijkingen met ChatGPT door betere developer experience en aandacht voor best practices. Claude Code biedt terminal-integratie voor direct code editing.`,
    bestFor: [
      { point: 'Complexe coding taken waar nuance en best practices belangrijk zijn' },
      { point: 'Grote codebases die het 200K token context window benutten' },
      { point: 'Multi-file projecten waar consistent reasoning cruciaal is' },
      { point: 'In-depth uitleg en educatieve conversaties over code' },
    ],
    notFor: [
      { point: 'Simpele, snelle scripts waar ChatGPT efficiënter is' },
      { point: 'Teams die al diep in het OpenAI ecosysteem zitten' },
      { point: 'Wie vooral code optimization suggesties zoekt' },
    ],
    keyFeatures: [
      { title: '200K Context', detail: 'Begrijpt enorme codebases in één conversatie' },
      { title: 'Claude Code', detail: 'Terminal tool die direct code kan editen en tests kan runnen' },
      { title: 'Artifacts', detail: 'Interactieve code preview en visualisaties' },
    ],
  },
  chatgpt: {
    description: `ChatGPT van OpenAI is de meest gebruikte AI assistant met 800 miljoen wekelijkse gebruikers. Effectief voor prototyping, kleine scripts en snelle debugging. Excelleert in code optimization suggesties. Brede integratie met IDE's en third-party tools maakt het zeer toegankelijk.`,
    bestFor: [
      { point: 'Snelle prototyping en proof-of-concept development' },
      { point: 'Code optimization en performance suggesties' },
      { point: 'Debugging en troubleshooting van specifieke problemen' },
      { point: 'Developers die veel verschillende AI-taken combineren (writing, analysis, coding)' },
    ],
    notFor: [
      { point: 'Grote, complexe multi-file projecten - Claude is sterker voor context' },
      { point: 'Wie de beste code kwaliteit zoekt - Claude wint in directe vergelijkingen' },
      { point: 'Privacy-gevoelige code die niet naar cloud mag' },
    ],
    keyFeatures: [
      { title: 'GPT-4o', detail: 'Snelle, multimodale responses met vision' },
      { title: 'Plugins & GPTs', detail: 'Uitbreidbaar ecosysteem van integraties' },
      { title: 'Code Interpreter', detail: 'Python code uitvoeren en data analyseren' },
    ],
  },
  perplexity: {
    description: `Perplexity combineert AI met real-time web search. Het geeft antwoorden met bronvermeldingen en inline citations, ideaal voor research en fact-checking. De Pro versie ondersteunt meerdere AI models (GPT-4, Claude) en biedt diepere research capabilities.`,
    bestFor: [
      { point: 'Research taken waar actuele informatie en bronvermelding essentieel is' },
      { point: 'Fact-checking en het verifiëren van claims met bronnen' },
      { point: 'Technische documentatie research met links naar officiële docs' },
      { point: 'Developers die willen weten "wat zegt het internet over X"' },
    ],
    notFor: [
      { point: 'Code generatie - daar zijn gespecialiseerde tools beter in' },
      { point: 'Offline gebruik - het is afhankelijk van live web search' },
      { point: 'Wie geen bronvermelding nodig heeft - ChatGPT is dan directer' },
    ],
    keyFeatures: [
      { title: 'Live Search', detail: 'Real-time web search geïntegreerd in antwoorden' },
      { title: 'Citations', detail: 'Inline bronvermelding voor verifieerbare informatie' },
      { title: 'Multi-Model', detail: 'Kies tussen GPT-4, Claude en andere modellen (Pro)' },
    ],
  },
  groq: {
    description: `Groq biedt de snelste LLM inference ter wereld dankzij hun custom LPU (Language Processing Unit) chips. Waar andere providers honderden tokens per seconde halen, levert Groq duizenden. Ideaal voor real-time applicaties waar latency kritiek is. Genereus gratis tier beschikbaar.`,
    bestFor: [
      { point: 'Real-time applicaties waar sub-second response times cruciaal zijn' },
      { point: 'Developers die open source models willen draaien met maximale snelheid' },
      { point: 'Prototyping en experimenten met het genereuze gratis tier' },
      { point: 'Chatbots en conversational AI waar snelheid de UX bepaalt' },
    ],
    notFor: [
      { point: 'Wie de allernieuwste proprietary models nodig heeft (geen GPT-4, Claude)' },
      { point: 'Complexe taken waar model kwaliteit belangrijker is dan snelheid' },
      { point: 'Enterprise use cases die SLA guarantees vereisen' },
    ],
    keyFeatures: [
      { title: 'LPU Chips', detail: 'Custom hardware voor 10x snellere inference' },
      { title: 'Open Models', detail: 'Llama 3, Mixtral en andere open source modellen' },
      { title: 'Gratis Tier', detail: 'Genereuze gratis API calls voor development' },
    ],
  },
  // Video Generation
  'luma-dream-machine': {
    description: `Luma's Dream Machine is opvallend snel en produceert video met overtuigende fysica. Goed voor snelle iteraties en het genereren van realistische bewegende beelden. De AI begrijpt hoe objecten zich gedragen in de echte wereld.`,
    bestFor: [
      { point: 'Product video\'s met realistische objectinteractie en fysica' },
      { point: 'Snelle video prototypes waar iteratiesnelheid belangrijk is' },
      { point: 'Marketing content met bewegende 3D-achtige visuals' },
      { point: 'Developers die video API-integratie willen' },
    ],
    notFor: [
      { point: 'Langere video clips - andere tools zoals Kling zijn daar sterker' },
      { point: 'Wie volledige controle wil over elk frame' },
      { point: 'Budget-beperkte projecten zonder video generatie budget' },
    ],
    keyFeatures: [
      { title: 'Snelle Generatie', detail: 'Krijg video resultaten in seconden' },
      { title: 'Physics Engine', detail: 'Realistische object beweging en interactie' },
      { title: 'API Access', detail: 'Integreer video generatie in je apps' },
    ],
  },
  kling: {
    description: `Kling AI van Kuaishou genereert langere video clips dan veel concurrenten. Bekend om realistische menselijke bewegingen en high-fidelity output. Toegankelijk via een simpele web interface, wat de drempel laag houdt.`,
    bestFor: [
      { point: 'Langere video clips waar andere tools te kort schieten' },
      { point: 'Realistische menselijke bewegingen en karakteranimatie' },
      { point: 'Budget-friendly video generatie voor kleine teams' },
      { point: 'Non-technische gebruikers dankzij simpele web interface' },
    ],
    notFor: [
      { point: 'Westerse markt-specifieke content - Kling is primair Chinees' },
      { point: 'Enterprise integraties met strikte compliance requirements' },
      { point: 'Wie volledige API controle nodig heeft' },
    ],
    keyFeatures: [
      { title: 'Lange Video', detail: 'Genereert clips langer dan concurrenten' },
      { title: 'Menselijke Beweging', detail: 'Uitstekend in realistische character animation' },
      { title: 'Web Interface', detail: 'Geen technische setup nodig' },
    ],
  },
}

async function improveToolContent() {
  console.log('📝 Improving tool content with research-backed descriptions...\n')

  const payload = await getPayload({ config })

  const tools = await payload.find({
    collection: 'tools',
    limit: 100,
    locale: 'nl',
  })

  console.log(`Found ${tools.docs.length} tools\n`)

  let updated = 0
  let skipped = 0

  for (const tool of tools.docs) {
    const slug = tool.slug as string
    const name = tool.name as string
    const improvement = toolImprovements[slug]

    if (!improvement) {
      console.log(`⏭ ${name} (no improvement data)`)
      skipped++
      continue
    }

    console.log(`📝 Updating: ${name}...`)

    try {
      // Build update data
      const updateData: Record<string, unknown> = {}

      if (improvement.description) {
        updateData.description = improvement.description
      }
      if (improvement.bestFor) {
        updateData.bestFor = improvement.bestFor
      }
      if (improvement.notFor) {
        updateData.notFor = improvement.notFor
      }
      if (improvement.keyFeatures) {
        updateData.keyFeatures = improvement.keyFeatures
      }

      await payload.update({
        collection: 'tools',
        id: tool.id,
        locale: 'nl',
        data: updateData,
        context: { skipTranslation: false }, // Allow auto-translation to run
      })

      console.log(`✓ ${name}`)
      updated++
    } catch (error) {
      console.error(`❌ ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  console.log(`\n✅ Done!`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)

  process.exit(0)
}

improveToolContent().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
