/**
 * scripts/update-cases-content.ts
 *
 * Updates cases with rich, detailed content and triggers translations.
 * Run with: npx tsx scripts/update-cases-content.ts
 */

import { config as dotenvConfig } from 'dotenv'
dotenvConfig({ path: '.env.local' })

import { getPayload } from 'payload'
import config from '../payload.config'

// Rich content for each case
const CASE_CONTENT: Record<string, {
  title: string
  oneLiner: string
  problem: string
  solution: string
  learnings: string
  stack: string
}> = {
  'factuurflow': {
    title: 'FactuurFlow',
    oneLiner: 'Slimme facturatie met AI-gestuurde automatisering voor ZZP\'ers en kleine bedrijven',
    problem: `Het Nederlandse MKB verliest gemiddeld 14 uur per maand aan handmatige facturatie. ZZP'ers worstelen met inconsistente factuurformats, gemiste betalingstermijnen en het bijhouden van BTW-administratie. Bestaande oplossingen zoals Exact Online of Moneybird zijn vaak te complex of te duur voor kleine ondernemers.

De kernproblemen die we identificeerden:
• Handmatig overtikken van projectgegevens naar facturen kost gemiddeld 20 minuten per factuur
• 23% van de facturen bevat fouten in BTW-berekeningen of bedragen
• Gemiddeld 34 dagen wachttijd op betalingen door onduidelijke of verlate facturen
• Geen inzicht in cashflow voorspellingen`,
    solution: `FactuurFlow combineert AI-gestuurde automatisering met een intuïtieve interface specifiek ontworpen voor de Nederlandse markt. De applicatie integreert direct met populaire tijdregistratie-tools en banken.

**Slimme Factuur Generatie**
Onze AI analyseert projectbeschrijvingen, tijdsregistraties en eerdere facturen om automatisch professionele facturen op te stellen. Machine learning herkent patronen in je facturatiegedrag en stelt proactief nieuwe facturen voor.

**Automatische BTW-verwerking**
Het systeem detecteert automatisch het juiste BTW-tarief (0%, 9% of 21%) op basis van de dienst of product. Bij grensoverschrijdende transacties wordt automatisch de juiste BTW-regeling (ICP, verlegde BTW) toegepast.

**Intelligente Betalingsherinneringen**
AI analyseert betalingsgedrag van klanten en optimaliseert het moment en de toon van herinneringen. Klanten met goede betalingshistorie krijgen vriendelijke reminders, terwijl chronische laatbetalers strenger worden benaderd.

**Cashflow Voorspelling**
Machine learning voorspelt op basis van historische data en openstaande facturen je verwachte cashflow voor de komende 90 dagen.`,
    learnings: `**Technische Inzichten**
• Lokale LLM's (Llama 3) zijn voldoende voor gestructureerde taken zoals factuuranalyse, wat API-kosten met 94% reduceert
• PDF-generatie met Puppeteer is betrouwbaarder dan dedicated PDF-libraries voor complexe layouts
• Stripe Connect vereenvoudigt multi-currency betalingen aanzienlijk

**Product Lessen**
• Nederlandse ondernemers hechten enorm aan BTW-compliance - dit moet foutloos werken
• Integratie met bestaande boekhoudsoftware is belangrijker dan standalone features
• Een "export naar accountant" functie was onverwacht populair

**AI/Vibecoding Ervaring**
• Claude's code generation is uitstekend voor backend logica, maar frontend componenten vereisen meer handmatige refinement
• Cursor's multi-file editing bespaarde 60% tijd bij refactoring
• Test-driven development met AI is een game-changer: beschrijf eerst de test, laat AI de implementatie genereren`,
    stack: 'Next.js 14, Prisma, PostgreSQL, Stripe, Puppeteer, Llama 3, Tailwind CSS, Vercel'
  },

  'codebuddy': {
    title: 'CodeBuddy',
    oneLiner: 'AI pair programming assistent die je codebase begrijpt en contextbewuste suggesties geeft',
    problem: `Bestaande AI coding assistants zoals GitHub Copilot genereren code in isolatie - ze begrijpen niet de architectuur, conventies en business logica van je specifieke project. Dit leidt tot:

• Inconsistente code stijl binnen hetzelfde project
• Suggesties die bestaande utilities negeren en duplicatie creëren
• Geen begrip van project-specifieke patterns of domain terminology
• Security vulnerabilities door gebrek aan context over auth/permissions

Ontwikkelaars besteden gemiddeld 30% van hun review-tijd aan het corrigeren van AI-gegenereerde code die niet past binnen hun codebase.`,
    solution: `CodeBuddy is een VS Code extensie die je volledige codebase indexeert en begrijpt voordat het suggesties doet.

**Codebase Indexering**
Bij installatie analyseert CodeBuddy je hele repository: architectuur patterns, naming conventions, bestaande utilities, en zelfs comments en documentatie. Dit wordt opgeslagen in een lokale vector database.

**Context-Aware Completion**
Elke suggestie houdt rekening met:
- Bestaande helper functions en utilities in je project
- Je team's coding standards (afgeleid uit bestaande code)
- Domain-specifieke terminologie uit je codebase
- Import patterns en module structuur

**Architectuur Bewustzijn**
CodeBuddy begrijpt de rol van elk bestand: is het een controller, service, repository, of util? Suggesties respecteren deze boundaries en separation of concerns.

**Security Context**
De extensie herkent auth patterns in je codebase en waarschuwt wanneer gegenereerde code security checks mist die elders wel aanwezig zijn.`,
    learnings: `**Vector Database Keuzes**
• Chroma bleek sneller dan Pinecone voor lokale use cases
• Chunk size van 512 tokens geeft beste balance tussen context en precisie
• Incrementele indexering is essentieel - volledige re-index bij elke save is onwerkbaar

**LLM Fine-tuning**
• Een lichtgewicht model getraind op 10K code snippets uit je eigen codebase presteert beter dan GPT-4 voor project-specifieke suggesties
• Embedding models hebben moeite met sterk geabbrevieerde code

**Developer Experience**
• Latency boven 200ms voelt storend - optimalisatie is kritiek
• "Explain this code" feature werd verrassend populair
• Developers willen controle over wanneer AI wel/niet actief is

**Vibecoding Workflow**
• Cursor + Claude werkte perfect voor de VS Code extensie ontwikkeling
• AI-gegenereerde tests waren 80% bruikbaar direct out of the box`,
    stack: 'TypeScript, VS Code Extension API, Chroma, LangChain, OpenAI, Electron, SQLite'
  },

  'meetingmind': {
    title: 'MeetingMind',
    oneLiner: 'AI-gestuurde meeting assistent die automatisch samenvat, actiepunten extraheert en opvolging tracked',
    problem: `Kenniswerkers besteden gemiddeld 23 uur per week in meetings. Na afloop is 47% van de besproken informatie binnen 24 uur vergeten. De huidige situatie:

• Handmatige notulen zijn tijdrovend en vaak incompleet
• Actiepunten verdwijnen in lange meeting notes die niemand herleest
• Geen koppeling tussen meeting beslissingen en daadwerkelijke opvolging
• Context van beslissingen raakt verloren ("waarom hadden we dit ook alweer besloten?")
• Meeting recordings worden zelden teruggekeken door de tijdsinvestering`,
    solution: `MeetingMind transformeert elke meeting in gestructureerde, doorzoekbare kennis met automatische opvolging.

**Real-time Transcriptie & Sprekerherkenning**
Whisper-gebaseerde transcriptie met 98% accuracy voor Nederlands en Engels. Automatische sprekeridentificatie door stemprofielen, gekoppeld aan je team directory.

**Intelligente Samenvatting**
Geen generieke samenvatting, maar gestructureerde output:
- Belangrijkste beslissingen met context en rationale
- Actiepunten met automatisch gedetecteerde owners en deadlines
- Openstaande vragen en parkeerplaats items
- Key quotes en belangrijke cijfers

**Kennisbank Integratie**
Meetings worden automatisch gelinkt aan relevante projecten, klanten of topics. Zoek door maanden aan meetings met natural language queries: "Wat hebben we besloten over de pricing strategie voor enterprise klanten?"

**Actiepunt Tracking**
Gedetecteerde actiepunten worden automatisch aangemaakt in Jira, Linear, of Notion. Twee dagen voor de deadline volgt een automatische reminder met context uit de oorspronkelijke meeting.

**Async Meeting Support**
Voor teams in verschillende tijdzones: neem een video memo op, MeetingMind genereert een interactieve samenvatting waar teamleden async op kunnen reageren.`,
    learnings: `**Audio Processing**
• Whisper large-v3 is de sweet spot tussen accuracy en snelheid
• Diarization (sprekerherkenning) blijft uitdagend bij meer dan 5 sprekers
• Achtergrondgeluid filtering met RNNoise verbetert transcriptie significant

**NLP Challenges**
• Nederlandse meeting taal bevat veel Engelse termen - hybrid language models werken het best
• Actiepunt detectie vereist fine-tuning op Nederlandse vergadercultuur ("zou je kunnen..." = actie)
• Sarcasme en humor in meetings verwarren sentiment analysis

**Integration Lessons**
• Calendar API's (Google, Microsoft) hebben verrassend verschillende permissie modellen
• Webhooks voor real-time Jira updates zijn betrouwbaarder dan polling
• SSO integratie is table stakes voor enterprise adoptie

**Vibecoding Reflecties**
• Audio processing pipelines zijn complex - hier was handmatige expertise nodig
• AI hielp enorm bij het bouwen van de NLP pipelines en prompt engineering`,
    stack: 'Python, FastAPI, Whisper, GPT-4, Pinecone, React, PostgreSQL, Redis, AWS Lambda'
  },

  'pitchdeck': {
    title: 'PitchDeck AI',
    oneLiner: 'Van idee naar investor-ready pitch deck in minuten met AI-gestuurde storytelling',
    problem: `Startups falen niet door slechte ideeën, maar door slechte communicatie. Het maken van een overtuigende pitch deck is een kunst die de meeste founders niet beheersen:

• Gemiddeld 40+ uur werk voor een eerste versie pitch deck
• 73% van de pitch decks wordt binnen 2 minuten weggegooid door investors
• Founders focussen op features in plaats van het probleem en de markt
• Inconsistente visuele kwaliteit ondermijnt geloofwaardigheid
• Geen feedback loop - founders weten niet welke slides niet werken

De paradox: je hebt funding nodig om experts in te huren, maar je hebt een goede pitch nodig om funding te krijgen.`,
    solution: `PitchDeck AI democratiseert toegang tot startup storytelling expertise door AI te combineren met best practices van top VCs.

**Guided Story Development**
In plaats van een leeg canvas, begeleidt een conversationele AI je door de kernvragen:
- Welk probleem los je op en voor wie?
- Waarom is dit nu het juiste moment?
- Wat is je unfair advantage?
- Hoe verdien je geld en hoe schaal je?

**Automatische Slide Generatie**
Op basis van je antwoorden genereert AI slides die investor-proven structuren volgen (Problem → Solution → Traction → Market → Team → Ask). Elk element is geoptimaliseerd voor de 3-seconde scan die investors doen.

**Design System**
Professionele templates geïnspireerd op succesvolle decks van Airbnb, Uber, en Dropbox. Automatische kleur- en font-suggesties gebaseerd op je brand, of genereer een complete brand identity.

**Investor Intelligence**
- Deck analytics: welke slides krijgen de meeste aandacht?
- A/B test verschillende versies van je value proposition
- Benchmark je metrics tegen vergelijkbare startups
- Suggesties voor verbetering gebaseerd op investor feedback patterns`,
    learnings: `**Storytelling Framework**
• De "Problem → Solution" flow is universeel, maar de volgorde van overige slides hangt af van je stage
• Traction slides maken of breken een deck - AI kan helpen metrics impactvol te presenteren
• "Team" slides worden overschat door founders, onderschat door investeerders in seed stage

**Design Automation**
• Figma API is krachtig maar complex - we kozen uiteindelijk voor canvas-based rendering
• AI-gegenereerde graphics zijn nog niet consistent genoeg voor professionele decks
• Whitespace is belangrijker dan content - AI moest leren "less is more"

**User Psychology**
• Founders willen validatie, niet alleen een tool - we voegden "deck score" toe
• Export naar PowerPoint blijft essentieel - investors willen hun eigen notities toevoegen
• Anonieme sharing voor feedback verlaagt drempel significant

**AI Storytelling**
• GPT-4 is uitstekend in het herformuleren van jargon naar begrijpelijke taal
• Few-shot learning met succesvolle pitch decks verbetert output dramatisch`,
    stack: 'Next.js, tRPC, Prisma, OpenAI GPT-4, Fabric.js, Cloudflare R2, Stripe, Vercel'
  },

  'supportbot': {
    title: 'SupportBot',
    oneLiner: 'AI-klantenservice die je product écht begrijpt en 80% van vragen zelfstandig oplost',
    problem: `Klantenservice is een bottleneck voor groeiende bedrijven:

• Support teams kunnen niet lineair meeschalen met klantgroei
• 65% van support tickets zijn repetitieve vragen die in documentatie staan
• Eerste reactietijd is kritiek voor klanttevredenheid, maar 24/7 bemanning is duur
• Kennisoverdracht bij nieuwe support medewerkers kost 3-6 maanden
• Bestaande chatbots zijn frustrerend en escaleren te snel of te laat naar mensen

De kosten van slechte support zijn verborgen maar significant: churn, negatieve reviews, en verloren upsell mogelijkheden.`,
    solution: `SupportBot is een AI support agent die je product, documentatie en klantenhistorie diepgaand begrijpt.

**Kennisbank Synchronisatie**
Automatische integratie met:
- Product documentatie (Notion, GitBook, Confluence)
- Help center artikelen
- Historische support tickets en oplossingen
- Product changelogs en known issues
- Interne knowledge bases

**Context-Bewuste Conversaties**
De AI kent de klant: eerdere tickets, subscription tier, feature usage, en account status. "Ik zie dat je vorige week ook een vraag had over exports - is dat inmiddels opgelost?"

**Intelligente Escalatie**
Machine learning bepaalt wanneer menselijke hulp nodig is:
- Emotionele klanten (sentiment detectie)
- Complexe technische issues
- Churn-risico situaties
- Billing en refund verzoeken

**Proactieve Support**
Detecteer patronen in vragen om problemen voor te zijn:
- Stuur targeted in-app berichten bij verwarrende features
- Genereer automatisch FAQ updates bij terugkerende vragen
- Alert product team bij feature requests die vaak voorkomen`,
    learnings: `**RAG Architecture**
• Hybrid search (keyword + semantic) presteert 23% beter dan pure vector search
• Chunk overlap van 20% verbetert context begrip significant
• Metadata filtering (bijv. alleen zoeken in relevante product area) is essentieel

**Conversational AI**
• Function calling maakt de AI veel capabeler dan pure text generation
• Conversation memory management is kritiek - te veel context = verwarring
• Nederlandse taal vereist specifieke fine-tuning voor informele support gesprekken

**Integration Challenges**
• Elk help desk systeem (Zendesk, Intercom, Freshdesk) heeft eigen quirks
• Real-time sync is complex - we kozen voor near-real-time met webhooks
• GDPR compliance bij het trainen op klantdata vereist zorgvuldige architectuur

**Support Operations**
• Human-in-the-loop feedback verbetert AI sneller dan verwacht
• "AI-assisted" mode (suggesties voor menselijke agents) had snellere adoptie dan full automation`,
    stack: 'Node.js, LangChain, Pinecone, OpenAI, PostgreSQL, Redis, WebSockets, React'
  },

  'dashforge': {
    title: 'DashForge',
    oneLiner: 'Genereer interactieve dashboards door natuurlijke taal queries op je data',
    problem: `Data-gedreven beslissingen zijn cruciaal, maar de tools zijn niet democratisch:

• Business users zijn afhankelijk van data teams voor elke nieuwe visualisatie
• SQL kennis is vereist voor ad-hoc analyses - een bottleneck
• Dashboard tools (Tableau, PowerBI) hebben een steile leercurve
• Wachttijd voor een nieuw dashboard: gemiddeld 2-4 weken
• Data teams besteden 60% van hun tijd aan "eenvoudige" visualisatie requests

Het resultaat: beslissingen worden genomen op onderbuikgevoel in plaats van data.`,
    solution: `DashForge laat iedereen dashboards bouwen door gewoon te vragen wat ze willen zien.

**Natural Language to SQL**
Vraag in gewone taal: "Toon me de omzet per productcategorie van de afgelopen 6 maanden, vergeleken met vorig jaar"

De AI:
1. Begrijpt je data schema automatisch
2. Genereert geoptimaliseerde SQL
3. Kiest de beste visualisatie
4. Maakt het dashboard interactief

**Schema Understanding**
Bij connectie met je database analyseert DashForge:
- Tabel relaties en foreign keys
- Kolom semantiek (is "created_at" een timestamp? is "amount" revenue?)
- Business terminologie mapping ("klanten" = users tabel waar type='customer')

**Iteratieve Refinement**
"Kun je dit opsplitsen per regio?" - de AI past de query en visualisatie aan. Bouw complexe dashboards in een conversatie.

**Governance & Security**
- Row-level security: users zien alleen data waar ze toegang toe hebben
- Query auditing: wie heeft wat gevraagd en wanneer
- Optionele SQL review workflow voor gevoelige data`,
    learnings: `**Text-to-SQL**
• Fine-tuning op je eigen schema verbetert accuracy van 67% naar 94%
• Chain-of-thought prompting helpt bij complexe JOINs
• Error messages van de database zijn waardevolle feedback voor self-correction

**Visualization Selection**
• Rule-based selectie (line chart voor tijd, bar voor categorieën) werkt beter dan ML
• "Show me" impliceert visualisatie, "Give me" impliceert tabel - subtiele maar belangrijke hints
• Users willen visualisaties aanpassen - we moesten UI toevoegen naast natural language

**Performance**
• Query caching is essentieel - dezelfde vraag wordt vaak gesteld door verschillende users
• Materialized views voor veelvoorkomende aggregaties
• Query timeout van 30 seconden met progressive loading

**Enterprise Reality**
• Data governance is table stakes - security features verkopen beter dan AI features
• Integration met bestaande BI tools (niet vervanging) is de adoptie strategie`,
    stack: 'Python, FastAPI, LangChain, DuckDB, Apache Arrow, React, D3.js, PostgreSQL'
  },

  'contentcraft': {
    title: 'ContentCraft',
    oneLiner: 'AI-content studio die je brand voice leert en consistent toepast over alle kanalen',
    problem: `Content marketing is een never-ending treadmill:

• Bedrijven moeten 10-20 content pieces per week produceren voor zichtbaarheid
• Freelance schrijvers begrijpen vaak de brand voice niet
• Content kwaliteit varieert enorm tussen verschillende creators
• Repurposing (blog → social → newsletter) is tijdrovend maar noodzakelijk
• SEO-optimalisatie vereist expertise die niet elke content creator heeft

Het resultaat: inconsistente brand presence, of torenhoge content productie kosten.`,
    solution: `ContentCraft is je AI content team dat je brand voice leert en consistent toepast.

**Brand Voice Training**
Upload 10+ voorbeelden van content die je brand goed representeert. De AI analyseert:
- Tone of voice (formeel/informeel, expert/toegankelijk)
- Vocabulaire en jargon gebruik
- Zinsstructuur en -lengte
- Humor en emoji gebruik
- Formatting voorkeuren

**Multi-Format Generation**
Eén input, meerdere outputs:
- Blog post (long-form, SEO-geoptimaliseerd)
- LinkedIn posts (3 varianten voor A/B testing)
- Twitter thread
- Newsletter sectie
- Video script

**SEO Intelligence**
- Keyword research geïntegreerd in de schrijfflow
- Real-time SEO scoring tijdens het schrijven
- Competitor content analyse
- Internal linking suggesties

**Collaborative Workflow**
- Brief templates voor consistente input
- Review en approval flows
- Content kalender met AI-suggested topics
- Performance tracking per content piece`,
    learnings: `**Brand Voice Cloning**
• 10-15 voorbeelden zijn minimaal nodig voor betrouwbare voice replicatie
• Negative examples ("schrijf NIET zo") zijn even waardevol als positieve
• Voice drift over tijd is een probleem - periodieke recalibratie nodig

**Content Quality**
• AI-generated content scoort 15% lager op engagement dan human-written
• Human editing van AI drafts is de sweet spot: 80% tijdsbesparing, 100% kwaliteit
• Fact-checking blijft essentieel - AI hallucineert statistieken

**SEO Learnings**
• AI is excellent in natuurlijke keyword integratie
• Meta descriptions door AI converteren vaak beter dan menselijke
• Schema markup generatie is een onverwacht populaire feature

**Platform-Specifieke Nuances**
• LinkedIn algorithm verandert vaak - AI moet regelmatig geüpdatet
• Twitter character limits vereisen specifieke prompt engineering
• Instagram captions hebben compleet andere dynamics`,
    stack: 'Next.js, OpenAI GPT-4, Anthropic Claude, Ahrefs API, PostgreSQL, Redis, Vercel'
  },

  'bugsniper': {
    title: 'BugSniper',
    oneLiner: 'AI-gestuurde bug detectie die issues vindt voordat je gebruikers ze melden',
    problem: `Bugs in productie zijn duur en beschadigen vertrouwen:

• Gemiddelde kost van een productie bug: €5.600 (downtime + fix + reputatie)
• 85% van bugs wordt gemeld door gebruikers, niet door monitoring
• Error logs zijn overweldigend - belangrijke signalen verdrinken in noise
• Correlatie tussen errors en root causes is tijdrovend handwerk
• Regressies na deployments worden te laat ontdekt

Traditional monitoring (Datadog, New Relic) is reactief en alert fatigue is een serieus probleem.`,
    solution: `BugSniper gebruikt AI om proactief issues te detecteren en te diagnosticeren.

**Anomaly Detection**
Machine learning modellen leren het normale gedrag van je applicatie:
- Response time distributions per endpoint
- Error rate baselines
- User flow completion rates
- Resource utilization patterns

Afwijkingen worden automatisch gedetecteerd voordat ze kritiek worden.

**Intelligent Error Grouping**
Niet elke error is even belangrijk. BugSniper groepeert errors op:
- Root cause (niet symptoom)
- User impact (hoeveel users, welke acties)
- Revenue impact (checkout errors > 404 errors)
- Trend (groeiend probleem vs. incidenteel)

**Automated Root Cause Analysis**
Bij een gedetecteerd issue analyseert de AI:
- Recent deployments en code changes
- Infrastructure changes
- Third-party service status
- Correlatie met andere errors

Output: "Error spike in checkout flow correlates 94% with deployment v2.3.4 which changed PaymentService.process()"

**Smart Alerting**
- Contextuele alerts met diagnose en suggested fix
- Intelligent routing naar de juiste developer
- Escalatie paden gebaseerd op severity en tijd`,
    learnings: `**Anomaly Detection**
• Isolation Forest werkt beter dan statistical methods voor onze use case
• Seasonality (dag/nacht, weekdays) moet expliciet gemodelleerd
• False positive rate moet onder 5% blijven - anders verlies je vertrouwen

**Log Analysis**
• Embedding-based search vindt gerelateerde errors die string matching mist
• Log parsing is 80% van het werk - elk framework logt anders
• Sampling strategieën zijn kritiek voor cost management

**Incident Response**
• Playbook suggesties gebaseerd op historische resoluties zijn zeer gewaardeerd
• Integration met PagerDuty/OpsGenie is essentieel
• Post-mortem generatie is een killer feature

**AI Debugging**
• Claude is beter dan GPT-4 in het begrijpen van stack traces
• Context window limiet is een probleem bij grote log volumes
• Humans vertrouwen AI diagnose meer als ze de reasoning zien`,
    stack: 'Go, ClickHouse, Apache Kafka, Python, scikit-learn, React, Grafana, Kubernetes'
  },

  'databridge': {
    title: 'DataBridge',
    oneLiner: 'No-code data integratie platform dat elke API verbindt met je database',
    problem: `Moderne bedrijven gebruiken 100+ SaaS tools, maar data zit in silo's:

• Marketing data in HubSpot, sales in Salesforce, support in Zendesk - geen unified view
• Custom integraties kosten €10K-50K per connectie
• ETL tools (Fivetran, Airbyte) zijn complex en duur
• API's veranderen regelmatig, waardoor integraties breken
• Data engineers zijn schaars en duur

Het resultaat: beslissingen op incomplete data, of dure consultant projecten.`,
    solution: `DataBridge maakt enterprise data integratie toegankelijk voor iedereen.

**Visual Integration Builder**
Drag-and-drop interface om data flows te bouwen:
1. Selecteer bron (400+ pre-built connectors)
2. Map velden visueel
3. Definieer transformaties in natural language
4. Kies bestemming (warehouse, database, andere SaaS)

**AI-Powered Mapping**
De AI suggereert automatisch veld mappings:
- "customer_email" in Stripe → "email" in je database
- Data type conversies
- Deduplicatie logica
- Custom transformaties in plain English

**Schema Evolution**
Wanneer source API's veranderen:
- Automatische detectie van schema changes
- Impact analyse: welke downstream processen worden geraakt?
- Suggested fixes die met één klik geactiveerd kunnen worden

**Data Quality**
- Automatische validatie regels
- Anomaly detectie in data volumes
- Freshness monitoring
- Lineage tracking: waar komt elk datapunt vandaan?`,
    learnings: `**Connector Maintenance**
• API versioning is een nachtmerrie - abstractie layer is essentieel
• OAuth flow variaties per platform vereisen veel edge case handling
• Rate limiting strategieën verschillen enorm per API

**Transformation Engine**
• Natural language naar transformatie code werkt verrassend goed
• dbt-compatible output verhoogt adoptie bij data teams
• Type inference is moeilijker dan verwacht bij inconsistente source data

**Scale Challenges**
• Incremental sync is 100x efficiënter dan full sync - detectie is complex
• Parallelisatie per connector vereist zorgvuldig resource management
• Exactly-once delivery is moeilijk maar kritiek

**Product-Market Fit**
• SMB wil simplicity, enterprise wil control - moeilijk om beide te bedienen
• Self-serve onboarding is kritiek - geen product dat demos vereist
• Pricing per connector vs. per row is een constante discussie`,
    stack: 'TypeScript, Temporal, PostgreSQL, Apache Arrow, Redis, React, Docker, AWS'
  },

  'learnloop': {
    title: 'LearnLoop',
    oneLiner: 'Gepersonaliseerd leerplatform dat zich aanpast aan jouw kennis, tempo en leerstijl',
    problem: `Online educatie is fundamenteel gebroken:

• One-size-fits-all cursussen negeren dat iedereen anders leert
• 87% van online cursussen wordt niet afgemaakt
• Geen adaptatie aan voorkennis - beginners verdrinken, experts vervelen zich
• Passief video kijken leidt tot slechte kennisretentie (10-20%)
• Geen feedback loop: je weet niet wat je niet weet

De belofte van "leren op je eigen tempo" betekent meestal gewoon "geen begeleiding".`,
    solution: `LearnLoop creëert voor elke student een uniek, adaptief leerpad.

**Kennisassessment**
Voordat je begint, test LearnLoop je bestaande kennis:
- Adaptive testing: vragen worden moeilijker/makkelijker op basis van antwoorden
- Misconceptie detectie: niet alleen wat je niet weet, maar wat je fout weet
- Skill mapping naar learning objectives

**Gepersonaliseerd Curriculum**
Op basis van je assessment bouwt de AI een curriculum:
- Skip content dat je al beheerst
- Extra uitleg bij concepten waar je moeite mee hebt
- Keuze in content format (video, tekst, interactief)
- Realistische tijdsplanning gebaseerd op je beschikbaarheid

**Active Learning**
Passief consumeren wordt actief oefenen:
- AI-gegenereerde oefenvragen na elk concept
- Practical assignments met automated feedback
- Spaced repetition voor lange-termijn retentie
- Socratic dialogue: de AI stelt vragen in plaats van antwoorden te geven

**Progress Intelligence**
- Predictive analytics: wanneer ben je klaar voor het examen?
- Knowledge decay detection: "Je hebt module 3 een maand geleden gedaan, tijd voor een refresh"
- Learning analytics voor educators`,
    learnings: `**Adaptive Learning**
• Item Response Theory (IRT) is beter dan simpele percentage scores
• Bayesian Knowledge Tracing modelleert kennis state accurate
• Misconceptie-aware assessment is een research area met veel potentie

**Content Generation**
• AI-gegenereerde vragen zijn 80% bruikbaar na light editing
• Distractor generation (foute antwoordopties) is verrassend moeilijk
• Personalized explanations vereisen kennis van student's mental model

**Engagement**
• Streaks en gamification werken, maar kunnen ook toxic worden
• Social features (study groups, leaderboards) polariseren users
• Mobile-first is essentieel - 70% van leren gebeurt op telefoon

**Pedagogical Insights**
• Spaced repetition scheduling is personaliseerbaar met ML
• Interleaving (mix van topics) is beter dan blocked practice
• Immediate feedback is niet altijd beter - soms is delayed feedback effectiever`,
    stack: 'SvelteKit, PlanetScale, Mux Video, OpenAI, Python, FastAPI, Redis, Vercel'
  }
}

async function updateCases() {
  console.log('📝 Updating cases with rich content...\n')

  const payload = await getPayload({ config })

  // Get all cases
  const cases = await payload.find({
    collection: 'cases',
    limit: 100,
    locale: 'nl',
  })

  console.log(`Found ${cases.docs.length} cases\n`)

  for (const caseDoc of cases.docs) {
    const slug = caseDoc.slug as string
    const content = CASE_CONTENT[slug]

    if (!content) {
      console.log(`⚠ No content defined for: ${slug}`)
      continue
    }

    try {
      // Update with rich content in NL (source locale)
      // This will trigger the autoTranslate hook
      await payload.update({
        collection: 'cases',
        id: caseDoc.id,
        locale: 'nl',
        data: {
          title: content.title,
          oneLiner: content.oneLiner,
          problem: content.problem,
          solution: content.solution,
          learnings: content.learnings,
          stack: content.stack,
          status: 'published', // CRITICAL: Must be published to show in frontend
        },
      })

      console.log(`✓ Updated: ${slug}`)
    } catch (error) {
      console.error(`❌ Failed to update ${slug}:`, error)
    }
  }

  console.log('\n✅ Cases update complete!')
  console.log('Translations should be triggered automatically by the afterChange hook.')

  process.exit(0)
}

updateCases().catch((err) => {
  console.error('❌ Failed:', err)
  process.exit(1)
})
