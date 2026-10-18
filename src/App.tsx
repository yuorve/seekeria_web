/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Send,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  MapPin,
  Cpu,
  Layers,
  Database,
  Search,
  Filter,
  Shield,
  Zap,
  Globe,
  GitBranch,
  Terminal,
  Code2,
  SlidersHorizontal,
  Radar,
  ArrowRight,
  Sparkles,
  FileText,
  Workflow,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';
import SeekerIALogo from './components/SeekerIALogo.tsx';

interface CommandItem {
  cmd: string;
  desc: string;
  example: string;
  output: string;
}

const COMMANDS: CommandItem[] = [
  {
    cmd: '/start',
    desc: 'Initialize the agent session and view active configuration',
    example: '/start',
    output:
      '🤖 SeekerIA Agent active.\nConfig: Location: 3400 Hillerød | Radius: 30km | Active profile: Backend Python / Cloud.\nMonitoring 5 Danish tech channels.',
  },
  {
    cmd: '/address <postcode>',
    desc: 'Set your geographic anchor point by Danish postal code',
    example: '/address 3400',
    output:
      '📍 Geographic anchor updated: 3400 Hillerød (Region Hovedstaden).\nCommute calculations calibrated to this center point.',
  },
  {
    cmd: '/radius <km>',
    desc: 'Configure maximum commute distance in kilometers',
    example: '/radius 25',
    output:
      '📏 Search radius set to 25 km from 3400 Hillerød. Listings outside this perimeter will be down-weighted or filtered out.',
  },
  {
    cmd: '/keywords <terms>',
    desc: 'Define target technologies, frameworks, and job titles',
    example: '/keywords python, fastapi, docker, postgresql',
    output:
      '🎯 Core technical criteria stored: [python, fastapi, docker, postgresql]. Semantic embeddings updated for similarity scoring.',
  },
  {
    cmd: '/hunt',
    desc: 'Trigger an immediate on-demand sweep across configured Danish sources',
    example: '/hunt',
    output:
      '⚡ Initiating targeted sweep across Danish sources...\nFound 18 raw postings. 12 after deduplication. 3 top candidates match your threshold (score ≥ 75). Delivering stream...',
  },
  {
    cmd: '/exclude <terms>',
    desc: 'Exclude non-relevant frameworks, legacy stacks, or roles',
    example: '/exclude php, wordpress, legacy',
    output:
      '🚫 Negative filter applied: Excluded terms [php, wordpress, legacy]. Any job with predominant legacy stack will be suppressed.',
  },
  {
    cmd: '/stop',
    desc: 'Pause automated periodic ingestion notifications',
    example: '/stop',
    output:
      '⏸️ Automated stream paused. Configured preferences preserved. Send /resume anytime to restart background notifications.',
  },
  {
    cmd: '/resume',
    desc: 'Re-enable automated stream and scheduled alert triggers',
    example: '/resume',
    output:
      '▶️ Monitoring resumed. You will receive prioritized opportunities as newly processed listings pass your match threshold.',
  },
];

interface JobExample {
  id: string;
  role: string;
  company: string;
  location: string;
  postcode: string;
  source: string;
  score: number;
  published: string;
  fitSummary: string;
  skills: string[];
  reasoning: string;
  commuteKm: number;
  outreachDraftPreview: string;
}

const SAMPLE_JOBS: JobExample[] = [
  {
    id: 'job-1',
    role: 'Backend Developer (Python / APIs)',
    company: 'Nordic HealthTech ApS (Simulated Entity)',
    location: '3400 Hillerød · Greater Copenhagen',
    postcode: '3400',
    source: 'Jobindex / Direct ATS',
    score: 92,
    published: '3h ago',
    fitSummary: 'High technical overlap & zero commute friction',
    skills: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'REST APIs'],
    commuteKm: 4,
    reasoning:
      'Strong alignment with Python API and containerization preferences. Office located in Hillerød, well within the 25km radius. English-speaking engineering team with modern continuous deployment pipeline.',
    outreachDraftPreview:
      '[SIMULATED OUTREACH DRAFT]\n\nHej [Hiring Manager],\n\nJeg så jeres opslag vedrørende Backend Developer hos Nordic HealthTech. Med min erfaring inden for Python (FastAPI), Docker og cloud-baserede databaser, passer min profil stærkt til jeres backend-arkitektur. Jeg er baseret lokalt i Hillerød og vil med glæde høre mere om jeres nuværende udfordringer...',
  },
  {
    id: 'job-2',
    role: 'DevOps & Cloud Engineer',
    company: 'Fintech Velocity A/S (Simulated Entity)',
    location: '2800 Kgs. Lyngby · Greater Copenhagen',
    postcode: '2800',
    source: 'The Hub',
    score: 85,
    published: '6h ago',
    fitSummary: 'Strong infrastructure fit · Hybrid setup',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Python', 'CI/CD'],
    commuteKm: 19,
    reasoning:
      'Significant match for automation and cloud infrastructure. Hybrid policy allows 3 days remote. Located in Lyngby near DTU Science Park, within the 25km radius from 3400.',
    outreachDraftPreview:
      '[SIMULATED OUTREACH DRAFT]\n\nHi [Engineering Team],\n\nI noticed your opening for a DevOps & Cloud Engineer at Fintech Velocity. Given your emphasis on automated Terraform workflows and container orchestration, I believe my background in reproducible infrastructure and Python automation could add immediate value...',
  },
  {
    id: 'job-3',
    role: 'Software Engineer (Data & Automation)',
    company: 'GreenEnergy Analytics (Simulated Entity)',
    location: '2750 Ballerup · Greater Copenhagen',
    postcode: '2750',
    source: 'Jobnet',
    score: 79,
    published: 'Yesterday',
    fitSummary: 'Data engineering & ETL pipeline focus',
    skills: ['Python', 'SQL', 'Airflow', 'Data Modeling', 'DuckDB'],
    commuteKm: 22,
    reasoning:
      'Job description prioritizes automated data ingestion and telemetry processing. Meets core Python and database requirements. Commute is 22km via motorway.',
    outreachDraftPreview:
      'Hej [Team],\n\nJeg følger GreenEnergy Analytics og lagde mærke til jeres stilling som Software Engineer med fokus på data og automation. Da jeg har specialiseret mig i at bygge robuste data pipelines og ETL-processer i Python og SQL...',
  },
];

const PIPELINE_STAGES = [
  {
    id: 'sources',
    name: '01 · Job Sources',
    tech: 'Scraping & ATS Feeds',
    desc: 'Continuously queries selected Danish job boards, startup portals, and public company directories.',
    details: [
      'Jobindex (Danish market leader)',
      'The Hub (Nordic startup ecosystem)',
      'Jobnet (Official Danish registry)',
      'Direct company ATS & careers endpoints',
    ],
  },
  {
    id: 'ingestion',
    name: '02 · Ingestion & Extraction',
    tech: 'Python / BeautifulSoup / Headless',
    desc: 'Fetches raw HTML and structured payloads, filtering out irrelevant non-technical employment notices.',
    details: [
      'Extracts posting title, body text, publication date',
      'Detects posting language (Danish / English)',
      'Isolates company identifiers and contact handles',
    ],
  },
  {
    id: 'normalization',
    name: '03 · Normalization',
    tech: 'Regex & Schema Canonicalization',
    desc: 'Harmonizes chaotic formatting into a standardized data model with consistent skill and salary fields.',
    details: [
      'Maps synonyms (e.g., "JS/TS" → TypeScript, "Postgres" → PostgreSQL)',
      'Standardizes seniority indicators (Junior / Mid / Senior / Lead)',
      'Parses Danish postal codes (e.g., "DK-3400", "3400 Hillerød")',
    ],
  },
  {
    id: 'dedup',
    name: '04 · Deduplication',
    tech: 'Fuzzy Matching & Content Hashing',
    desc: 'Recognizes cross-posted listings across multiple portals to prevent alert duplication.',
    details: [
      'Cosine similarity on cleaned job description text',
      'Normalized company + title token matching',
      'Suppresses duplicate agency republishings',
    ],
  },
  {
    id: 'semantic',
    name: '05 · Semantic Matching',
    tech: 'Embedding Vector Distance',
    desc: 'Evaluates deeper architectural overlap instead of naive keyword occurrences.',
    details: [
      'Weights context (e.g., "uses Python" vs "integrates with legacy Python")',
      'Calculates semantic vector similarity to configured user profile',
      'Scores technology stack familiarity and domain overlap',
    ],
  },
  {
    id: 'geo',
    name: '06 · Geo Filtering',
    tech: 'Haversine & Postcode DB',
    desc: 'Filters opportunities based on real geographic radius from your specified Danish postal code.',
    details: [
      'Internal Danish postal code centroid coordinate registry',
      'Strict radius boundary or soft distance penalty',
      'Evaluates transit hub proximity (e.g., S-train access)',
    ],
  },
  {
    id: 'reasoning',
    name: '07 · AI Reasoning & Scoring',
    tech: 'Local LLM Inference',
    desc: 'Synthesizes qualitative fit reasons, generates an actionable score (0–100), and creates Danish outreach drafts.',
    details: [
      'Summarizes why the opportunity matches your configuration',
      'Generates context-aware "uopfordret ansøgning" drafts',
      'Highlights any red flags or conflicting requirements',
    ],
  },
  {
    id: 'delivery',
    name: '08 · Telegram Bot Delivery',
    tech: 'Telegram Bot API / Webhooks',
    desc: 'Dispatches real-time structured cards directly into your private chat with quick action links.',
    details: [
      'Clean Markdown-formatted opportunity card',
      'Inline keyboard buttons for direct application links',
      'Zero dashboard requirement for everyday monitoring',
    ],
  },
];

const FAQS = [
  {
    q: 'What is SeekerIA?',
    a: 'SeekerIA is a specialized AI agent and automated data engineering workflow built for technical professionals in the Danish job market. It continuously collects technical listings from selected Danish sources, normalizes unstructured information, evaluates semantic fit against your configured tech stack, and delivers prioritized opportunities directly to Telegram.',
  },
  {
    q: 'Which Danish job sources does it monitor?',
    a: 'The system is architected around the Danish employment ecosystem, monitoring selected public portals including Jobindex, The Hub, Jobnet, and direct company career endpoints. Sources are regularly normalized into a unified schema.',
  },
  {
    q: 'How does the matching score work?',
    a: 'The match score (0–100) is an internal engineering prioritization heuristic. It combines semantic vector similarity with your target technologies, geographic proximity to your configured Danish postal code, and negative term exclusions. It is not an algorithmic prediction of hiring success, but a filter to surface high-signal opportunities first.',
  },
  {
    q: 'Does it replace normal job applications?',
    a: 'No. SeekerIA automates discovery, filtering, and evaluation. When an opportunity is delivered, you can review the AI reasoning and use the optional outreach drafts to compose your application or reach out directly to hiring managers.',
  },
  {
    q: 'Do I need to speak Danish?',
    a: 'No. SeekerIA processes listings published in both Danish and English. The agent can evaluate whether Danish proficiency is listed as a hard requirement in the description and generate outreach drafts in either Danish or English depending on company language.',
  },
  {
    q: 'Why Telegram instead of a web dashboard?',
    a: 'A dedicated dashboard creates another inbox you need to check manually. Telegram allows asynchronous, push-based delivery: new high-relevance signals arrive right where you already communicate, with commands to adjust search radius, stack keywords, or pause alerts on the fly.',
  },
  {
    q: 'Can I change my search criteria dynamically?',
    a: 'Yes. You can issue commands like /keywords, /radius, /address, or /exclude directly in the Telegram chat at any time. Changes take effect on the very next ingestion cycle.',
  },
  {
    q: 'How does the geographic filtering work?',
    a: 'You set your location by postal code (e.g., 3400 for Hillerød, 2100 for Copenhagen Ø) along with a maximum kilometer radius. The agent computes haversine distance against Danish geographic coordinates and penalizes or excludes positions beyond your threshold.',
  },
  {
    q: 'Does SeekerIA use AI?',
    a: 'Yes. Beyond basic scraping and rule-based normalization, SeekerIA uses semantic embeddings to assess conceptual fit between tech stacks and local LLM inference to summarize match rationale and draft outreach text.',
  },
  {
    q: 'Where is the AI inference performed?',
    a: 'Where practical, inferences are performed using lightweight local or private models on dedicated infrastructure to minimize external data sharing, control operating costs, and maintain deterministic execution.',
  },
];

export default function App() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobExample>(SAMPLE_JOBS[0]);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(4);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [simInput, setSimInput] = useState<string>('/hunt');
  const [simOutput, setSimOutput] = useState<string>(
    '⚡ Initiating targeted sweep across Danish sources...\nFound 18 raw postings. 12 after deduplication. 3 top candidates match your threshold (score ≥ 75). Delivering stream...'
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => {
      setCopiedCmd(null);
    }, 2000);
  };

  const handleRunCommand = (cmdText: string) => {
    setIsSimulating(true);
    setSimInput(cmdText);

    const found = COMMANDS.find((c) =>
      c.cmd.split(' ')[0].toLowerCase() === cmdText.split(' ')[0].toLowerCase()
    );

    setTimeout(() => {
      if (found) {
        setSimOutput(found.output);
      } else {
        setSimOutput(
          `Command recognized: "${cmdText}". In the live agent, this updates your session parameters. Run real bot on Telegram: @SeekerIA_bot`
        );
      }
      setIsSimulating(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Toast Notification for Copy */}
      {copiedCmd && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
        >
          <Check className="h-4 w-4" />
          <span>Copied to clipboard: {copiedCmd}</span>
        </div>
      )}

      {/* Top Demonstrative Disclaimer Bar */}
      <div className="border-b border-amber-500/30 bg-amber-950/60 px-4 py-2 text-center text-xs font-mono text-amber-200 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400 mr-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          Demonstrative Preview:
        </span>
        <span>
          All data, job listings, company names, match scores, and telemetry on this website are illustrative simulations and do not represent real-time vacancies or real companies.
        </span>
      </div>

      {/* TOP BAR CONTRACT: Zone 1 (Brand single text), Zone 2 (4-6 nav links), Zone 3 (Action button) */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single text element wordmark with official logo */}
          <a
            href="#"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <SeekerIALogo
              size={34}
              showWordmark={true}
              wordmarkClassName="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors"
            />
          </a>

          {/* Zone 2: Clean nav links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wide uppercase text-slate-400">
            <a href="#problem" className="hover:text-white transition-colors">
              The Problem
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              Mechanism
            </a>
            <a href="#pipeline" className="hover:text-white transition-colors">
              Under the Hood
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#simulator" className="hover:text-white transition-colors">
              Commands
            </a>
            <a href="#market" className="hover:text-white transition-colors">
              Denmark Market
            </a>
            <a href="#why" className="hover:text-white transition-colors">
              Architecture
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://t.me/SeekerIA_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition-colors whitespace-nowrap"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Open on Telegram</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-slate-800/90 bg-slate-950/95 px-4 pt-3 pb-5 space-y-2.5 text-xs font-medium uppercase tracking-wider text-slate-300">
            {[
              { href: '#problem', label: 'The Problem' },
              { href: '#how-it-works', label: 'Mechanism' },
              { href: '#pipeline', label: 'Under the Hood' },
              { href: '#features', label: 'Capabilities' },
              { href: '#simulator', label: 'Commands' },
              { href: '#market', label: 'Denmark Market' },
              { href: '#why', label: 'Architecture' },
              { href: '#faq', label: 'FAQ' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="block py-2 text-slate-300 hover:text-emerald-400 transition-colors border-b border-slate-900"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800/60">
        {/* Subtle background ambient gradients */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-40 right-10 h-72 w-72 rounded-full bg-sky-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Proposition */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-4">
                <span>AI</span>
                <span className="text-slate-600">×</span>
                <span>AUTOMATION</span>
                <span className="text-slate-600">×</span>
                <span>DATA</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance mb-6">
                Turn the Danish Tech Job Market Into Your Personal AI Signal
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-4">
                SeekerIA continuously monitors selected Danish job sources, evaluates technical
                relevance and delivers prioritized opportunities directly to Telegram.
              </p>

              {/* Technical context line */}
              <p className="text-xs sm:text-sm text-slate-400 leading-normal max-w-2xl mb-8">
                Built as a practical experiment in AI agents, automation, data collection and
                semantic job matching.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-6">
                <a
                  href="https://t.me/SeekerIA_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
                >
                  <Send className="h-4 w-4" />
                  <span>Open SeekerIA on Telegram</span>
                </a>
                <a
                  href="#how-it-works"
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-5 py-3 text-sm font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all whitespace-nowrap"
                >
                  <span>Explore How It Works</span>
                  <ArrowRight className="h-4 w-4 text-slate-500" />
                </a>
              </div>

              {/* Trust Line */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium tracking-wide">
                <span>Denmark-first</span>
                <span className="text-slate-600" aria-hidden="true">
                  ·
                </span>
                <span>Telegram-native</span>
                <span className="text-slate-600" aria-hidden="true">
                  ·
                </span>
                <span>AI-powered</span>
                <span className="text-slate-600" aria-hidden="true">
                  ·
                </span>
                <span className="text-slate-400">Zero dashboard fatigue</span>
              </div>
            </div>

            {/* Right Column: Hero Visual - High Fidelity Telegram Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl">
                {/* Mockup Top Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <SeekerIALogo size={42} className="drop-shadow-md" />
                      <span className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white">SeekerIA Agent</span>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-sky-500/10 text-[10px] font-mono text-sky-400 border border-sky-500/20">bot</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Monitoring Danish Tech Market</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                    Demo Data · Not Real
                  </span>
                </div>

                {/* Telegram Message Bubble */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3.5">
                  {/* Score & Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400">
                      <Zap className="h-3.5 w-3.5" />
                      <span>MATCH 92/100</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">11:42 AM</span>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-0.5">
                      [Demonstrative Simulation]
                    </div>
                    <h2 className="text-base font-bold text-white">Backend Developer</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>Example Company (Simulated Entity)</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="h-3 w-3 text-sky-400" />
                        3400 Hillerød
                      </span>
                    </div>
                  </div>

                  {/* Technical Fit Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-400">Technical fit</span>
                      <span className="text-emerald-400 font-semibold">92%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: '92%' }}
                      />
                    </div>
                  </div>

                  {/* Skills (Unboxed clean text with typographic separators) */}
                  <div className="border-t border-slate-800/80 pt-2.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                      Detected Skills
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-200">
                      <span>Python</span>
                      <span className="text-slate-600">·</span>
                      <span>Docker</span>
                      <span className="text-slate-600">·</span>
                      <span>SQL</span>
                      <span className="text-slate-600">·</span>
                      <span>REST APIs</span>
                      <span className="text-slate-600">·</span>
                      <span>FastAPI</span>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-3 text-xs leading-relaxed text-slate-300">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 mb-1 font-mono uppercase">
                      <Sparkles className="h-3 w-3" />
                      <span>Why it matches</span>
                    </div>
                    <p className="text-slate-300">
                      Strong overlap with your configured technical profile and location. Matches
                      your backend stack preferences and sits within your 30km commute perimeter.
                    </p>
                  </div>

                  {/* Action Buttons in Telegram */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(SAMPLE_JOBS[0])}
                      className="flex items-center justify-center gap-1 rounded-md bg-slate-800 hover:bg-slate-700 py-2 text-xs font-medium text-slate-200 transition-colors"
                    >
                      <span>View opportunity</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(SAMPLE_JOBS[0].outreachDraftPreview)}
                      className="flex items-center justify-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 py-2 text-xs font-medium text-emerald-300 transition-colors"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Copy draft</span>
                    </button>
                  </div>
                </div>

                {/* Footer simulation hint */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Source: Jobindex / ATS (Simulated model)</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="h-3 w-3 text-emerald-400" />
                    Commute: ~4 km
                  </span>
                </div>
                <div className="mt-2 text-center text-[10px] font-mono text-amber-300/80 bg-amber-950/40 rounded py-1 px-2 border border-amber-500/20">
                  * Demonstrative simulation. Fictional company & synthetic fit score.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section id="problem" className="py-20 border-b border-slate-800/60 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Root Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-4">
              Job Search Is a Data Problem
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Technical opportunities are scattered across platforms, company websites and local
              business directories. Finding the right signal requires collecting, cleaning,
              comparing and interpreting large amounts of information.
            </p>
          </div>

          {/* Visual Bottleneck Pipeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-6">
              The Manual Search Bottleneck vs. The Automated Signal
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
              {[
                { title: 'Multiple Sources', desc: 'Jobindex, Hub, ATS' },
                { title: 'Different Formats', desc: 'Unstructured text' },
                { title: 'Inconsistent Terms', desc: 'Jargon & buzzwords' },
                { title: 'Duplicates', desc: 'Agency spam reposts' },
                { title: 'Location Limits', desc: 'Danish postcodes' },
                { title: 'Language Rules', desc: 'DK vs English teams' },
                { title: 'Manual Review', desc: 'Hours spent skimming' },
                { title: 'Info Overload', desc: 'Burnout & fatigue' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 flex flex-col justify-between"
                >
                  <div className="text-[11px] font-mono text-slate-400 mb-2">Step 0{idx + 1}</div>
                  <div className="text-xs font-semibold text-slate-200 mb-1">{step.title}</div>
                  <div className="text-[11px] text-slate-400">{step.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm text-slate-300">
                Instead of conducting repetitive manual research every morning:
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-400 font-mono">
                <Check className="h-4 w-4" />
                <span>SeekerIA automates that pipeline.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (4 STEPS) */}
      <section id="how-it-works" className="py-20 border-b border-slate-800/60 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-4">
              From Job Listings to Actionable Signals
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              A four-step autonomous flow that converts messy market noise into structured,
              prioritized alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                number: '01',
                title: 'COLLECT',
                label: 'Data Extraction',
                icon: Database,
                body: 'Monitor selected job sources and local company data.',
                technical: 'Cron jobs & endpoint polling',
              },
              {
                number: '02',
                title: 'NORMALIZE',
                label: 'Schema Harmonization',
                icon: Layers,
                body: 'Extract and standardize titles, technologies, locations, language requirements and other signals.',
                technical: 'Schema canonicalization & Regex',
              },
              {
                number: '03',
                title: 'EVALUATE',
                label: 'Semantic Matching',
                icon: Cpu,
                body: 'Use semantic matching and local AI inference to assess relevance against configured criteria.',
                technical: 'Vector similarity & Local LLM',
              },
              {
                number: '04',
                title: 'DELIVER',
                label: 'Stream Dispatch',
                icon: Send,
                body: 'Send prioritized opportunities and optional outreach drafts directly to Telegram.',
                technical: 'Telegram Bot API webhook',
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black font-mono text-emerald-400/80">
                        {step.number}
                      </span>
                      <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                      {step.label}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {step.body}
                    </p>
                  </div>
                  <div className="border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-400">
                    {step.technical}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DATA / AI PIPELINE ("UNDER THE HOOD") */}
      <section id="pipeline" className="py-20 border-b border-slate-800/60 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-3">
                Under the Hood
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
                Not a simple scraper. A multi-stage data engineering and semantic evaluation
                pipeline designed to turn raw Danish web listings into verified signal.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Python
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                APIs
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Web extraction
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Local LLM
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Geospatial filtering
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Telegram Bot API
              </span>
            </div>
          </div>

          {/* Interactive Pipeline Stage Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
            {PIPELINE_STAGES.map((stg, idx) => (
              <button
                key={stg.id}
                type="button"
                onClick={() => setActiveStageIndex(idx)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeStageIndex === idx
                    ? 'border-emerald-500/60 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-400">Stage 0{idx + 1}</div>
                <div className="text-xs font-semibold truncate mt-0.5">{stg.name.split('·')[1]}</div>
              </button>
            ))}
          </div>

          {/* Selected Stage Detail Display */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                    Active Stage Inspector
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-mono text-sky-400">
                    {PIPELINE_STAGES[activeStageIndex].tech}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {PIPELINE_STAGES[activeStageIndex].name}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                  {PIPELINE_STAGES[activeStageIndex].desc}
                </p>

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Key Operations & Protocols
                  </div>
                  <ul className="space-y-2">
                    {PIPELINE_STAGES[activeStageIndex].details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Architecture Data Flow Representation */}
              <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-[11px] text-slate-400">
                  <span>pipeline_telemetry.json</span>
                  <span className="text-emerald-400">stage_0{activeStageIndex + 1}_active</span>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto text-[11px]">
{`{
  "stage": "${PIPELINE_STAGES[activeStageIndex].id}",
  "executor": "${PIPELINE_STAGES[activeStageIndex].tech}",
  "status": "deterministic",
  "danish_market_ready": true,
  "invariants": {
    "zero_hallucinations": true,
    "privacy_bounded": true,
    "geo_anchor": "DK_POSTCODES"
  }
}`}
                </pre>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Pipeline Latency: ~180ms</span>
                  <span>Batch interval: Configurable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCES SECTION */}
      <section id="sources" className="py-20 border-b border-slate-800/60 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-3">
              Built for the Danish Tech Ecosystem
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-2">
              Configured and selected sources reflect the real distribution of software, AI, and
              infrastructure positions in Denmark.
            </p>
            <p className="text-xs text-slate-400">
              Architecture designed to support additional sources as the project evolves.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                name: 'Jobindex',
                tag: 'Primary Market',
                notes: 'Deepest coverage of broad Danish corporate & consultancy positions.',
                type: 'Selected Source',
              },
              {
                name: 'The Hub',
                tag: 'Startup & Scaleup',
                notes: 'Nordic innovation ecosystem, tech startups, English-first teams.',
                type: 'Selected Source',
              },
              {
                name: 'Jobnet',
                tag: 'Public Registry',
                notes: 'Official Danish employment listings, public sector tech projects.',
                type: 'Configured Source',
              },
              {
                name: 'Jobdanmark',
                tag: 'Regional Portals',
                notes: 'Regional company recruitment outside metropolitan Copenhagen.',
                type: 'Supported Source',
              },
              {
                name: 'Company ATS',
                tag: 'Direct Career Endpoints',
                notes: 'Crawls direct career sites of established tech employers in DK.',
                type: 'Modular Ingestion',
              },
            ].map((src, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mb-2">
                    <span>{src.type}</span>
                    <Globe className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{src.name}</h3>
                  <div className="text-xs text-slate-400 font-medium mb-3">{src.tag}</div>
                  <p className="text-xs text-slate-300 leading-normal">{src.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES ("SIGNAL OVER NOISE") */}
      <section id="features" className="py-20 border-b border-slate-800/60 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-3">
              Signal Over Noise
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Engineered to replace chaotic keyword scraping with nuanced engineering evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Multi-Source Discovery',
                desc: 'Aggregate technical opportunities from multiple Danish sources into a unified, clean feed.',
                icon: Search,
              },
              {
                title: 'Semantic Matching',
                desc: 'Evaluate technical relevance beyond simple keyword matching, recognizing architectural overlaps.',
                icon: Cpu,
              },
              {
                title: 'Geo-Aware Search',
                desc: 'Use postal codes and configurable radius to prioritize realistic Danish commuting opportunities.',
                icon: MapPin,
              },
              {
                title: 'Smart Deduplication',
                desc: 'Reduce repeated listings and noisy recruiter duplicates across cross-posted portals.',
                icon: Filter,
              },
              {
                title: 'AI Outreach Drafts',
                desc: 'Generate tailored Danish outreach drafts when appropriate for uopfordret ansøgning or direct contact.',
                icon: FileText,
              },
              {
                title: 'Telegram-Native',
                desc: 'No separate dashboard required for the core workflow. Control everything from chat.',
                icon: Send,
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TELEGRAM COMMANDS & INTERACTIVE SIMULATOR */}
      <section id="simulator" className="py-20 border-b border-slate-800/60 bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Interactive Control
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-3">
              Control the Agent From Telegram
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Configure your search radius, target technologies, and trigger immediate sweeps
              without leaving Telegram. Test the simulated commands below or click to copy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Command List */}
            <div className="lg:col-span-7 space-y-3">
              {COMMANDS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-emerald-400">{item.cmd}</span>
                      <button
                        type="button"
                        onClick={() => handleRunCommand(item.example)}
                        className="text-[11px] font-mono text-slate-400 hover:text-white underline decoration-slate-700 underline-offset-2 ml-2"
                      >
                        [Run in demo]
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.example)}
                      className="inline-flex items-center gap-1 rounded bg-slate-800/80 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedCmd === item.example ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 mb-1">{item.desc}</p>
                  <div className="text-[11px] font-mono text-slate-400">
                    Example: <span className="text-slate-300">{item.example}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Interactive Terminal Simulator */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    <div className="ml-2 flex items-center gap-1.5 font-mono text-xs text-slate-300">
                      <SeekerIALogo size={18} />
                      <span>SeekerIA Terminal Simulator</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/90 uppercase tracking-wider">
                    Interactive Demo
                  </span>
                </div>

                {/* Terminal Content */}
                <div className="p-4 font-mono text-xs space-y-4 min-h-[300px]">
                  <div className="text-slate-400 text-[11px]">
                    # Welcome to SeekerIA Telegram command preview
                    <br /># Click any command on the left or test below:
                  </div>

                  {/* Input line */}
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="text-slate-400">user@telegram:~$</span>
                    <span className="text-white font-bold">{simInput}</span>
                  </div>

                  {/* Output block */}
                  <div className="rounded-lg bg-slate-900/80 border border-slate-800/80 p-3 text-slate-200 whitespace-pre-wrap leading-relaxed text-[11px]">
                    {isSimulating ? (
                      <span className="animate-pulse text-emerald-400">
                        Evaluating request against Danish market models...
                      </span>
                    ) : (
                      simOutput
                    )}
                  </div>

                  {/* Interactive Quick buttons inside terminal */}
                  <div className="pt-2">
                    <div className="text-[11px] text-slate-400 mb-2">
                      Try quick actions in simulation:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['/hunt', '/address 3400', '/radius 25', '/keywords python, fastapi'].map(
                        (c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleRunCommand(c)}
                            className="rounded bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 px-2 py-1 text-[11px] text-slate-300 transition-colors"
                          >
                            {c}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Simulator Footer disclaimer */}
                <div className="border-t border-slate-800 bg-slate-900/40 p-3 text-center text-[11px] text-slate-400">
                  <span className="text-amber-300 font-medium">Demonstrative Simulation:</span> All queries return synthetic mock data for architecture demonstration.
                  <a
                    href="https://t.me/SeekerIA_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-semibold ml-1.5"
                  >
                    Open real bot @SeekerIA_bot →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DEMO: AGENT'S OUTPUT CARDS */}
      <section id="demo" className="py-20 border-b border-slate-800/60 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Signal Inspection
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-3">
                See the Agent's Output
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Representative examples illustrating how opportunities are analyzed, scored, and
                contextualized. All job listings, metrics, and company entities below are{' '}
                <strong className="text-amber-300 font-medium">strictly demonstrative simulations</strong>{' '}
                and do not represent real-world active vacancies.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-300 font-medium whitespace-nowrap">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Demonstrative Data Only · Not Real Vacancies</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_JOBS.map((job) => (
              <div
                key={job.id}
                className={`rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                  selectedJob.id === job.id
                    ? 'border-emerald-500/60 bg-slate-900/90 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Score & Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                      <Zap className="h-3.5 w-3.5" />
                      <span>MATCH {job.score}/100</span>
                    </div>
                    <span className="text-[10px] font-mono font-medium text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Simulated
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{job.role}</h3>
                  <div className="text-xs text-slate-300 font-medium mb-1">{job.company}</div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                    <MapPin className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span>{job.location}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-400">~{job.commuteKm} km</span>
                  </div>

                  {/* Skills (Unboxed clean text) */}
                  <div className="border-t border-slate-800/80 pt-3 mb-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      Matched Stacks
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                      {job.skills.map((sk, idx) => (
                        <React.Fragment key={sk}>
                          {idx > 0 && <span className="text-slate-600">·</span>}
                          <span>{sk}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  <div className="rounded-lg bg-slate-950/80 border border-slate-800/80 p-3 text-xs leading-relaxed text-slate-300 mb-4">
                    <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold mb-1">
                      Reasoning
                    </div>
                    <p>{job.reasoning}</p>
                  </div>
                </div>

                {/* Inspect Action */}
                <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>View outreach draft</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">{job.source}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Outreach Draft Inspector */}
          {selectedJob && (
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-2">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                    Drafted Outreach Preview · {selectedJob.role}
                  </div>
                  <div className="text-sm text-slate-300 mt-0.5">
                    Contextual Danish outreach draft for {selectedJob.company}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(selectedJob.outreachDraftPreview)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy draft to clipboard</span>
                </button>
              </div>

              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedJob.outreachDraftPreview}
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                * Note: Outreach drafts are starting points. Always review and adapt tone to your
                authentic background before sending.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* DANISH MARKET & ROADMAP */}
      <section id="market" className="py-20 border-b border-slate-800/60 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Geographic Focus
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-4">
                Denmark First. International by Design.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed mb-6">
                SeekerIA is currently optimized around the Danish technology market, its job
                sources, geographic structure and the realities of technical recruitment in
                Denmark.
              </p>

              {/* Danish Tech Centroids */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 mb-6">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Supported Geographic Anchors & Hubs
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-300">
                  {[
                    'Greater Copenhagen',
                    '3400 Hillerød',
                    '2800 Lyngby',
                    '2750 Ballerup',
                    'Copenhagen Center',
                    'Aarhus',
                    'Odense',
                    'Aalborg',
                  ].map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-1 rounded bg-slate-950 border border-slate-800 px-2.5 py-1"
                    >
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      <span>{city}</span>
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                The architecture is intentionally modular so additional countries and sources can
                be introduced over time without rewriting normalization and matching logic.
              </p>
            </div>

            {/* Modular Roadmap */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  Expansion Trajectory
                </div>

                {/* NOW */}
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400 mb-1">
                    <span>NOW</span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <div className="text-base font-bold text-white mb-1">Denmark Tech Market</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Danish job boards, postcode-based radius calculation, Danish company directory
                    lookups, and bilingual Danish/English parsing.
                  </p>
                </div>

                {/* NEXT */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-400 mb-1">
                    <span>NEXT</span>
                    <span>Roadmap</span>
                  </div>
                  <div className="text-base font-bold text-white mb-1">Nordics (Sweden & Norway)</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Extending to Stockholm, Gothenburg, Oslo ecosystems with shared Scandinavian
                    ATS integration patterns.
                  </p>
                </div>

                {/* LATER */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 mb-1">
                    <span>LATER</span>
                    <span>Planned</span>
                  </div>
                  <div className="text-base font-bold text-white mb-1">EU / International Hubs</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Broader European technical hubs (Germany, Netherlands) with multi-currency and
                    cross-border remote evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY I BUILT IT & ENGINEERING PRINCIPLES */}
      <section id="why" className="py-20 border-b border-slate-800/60 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Why I Built It */}
            <div className="lg:col-span-6">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Origin & Portfolio Context
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-6">
                Why I Built SeekerIA
              </h2>
              <div className="space-y-4 text-base text-slate-300 leading-relaxed">
                <p>
                  I wanted to explore what happens when a traditional job search is treated as an
                  engineering problem.
                </p>
                <p>
                  Instead of manually opening multiple job boards every day, I built an autonomous
                  workflow that collects information, filters noise, evaluates relevance and
                  delivers the resulting signal through Telegram.
                </p>
                <p className="text-emerald-400 font-medium">
                  The project sits at the intersection of AI agents, automation, data engineering
                  and practical software development.
                </p>
              </div>

              {/* Subtle Portfolio Indicator */}
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <Code2 className="h-4 w-4 text-emerald-400" />
                  <span>
                    Built as an independent experiment in AI, automation, data engineering and
                    software development.
                  </span>
                </div>
              </div>
            </div>

            {/* Engineering Principles */}
            <div className="lg:col-span-6">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Foundations
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-2 mb-6">
                Engineering Principles
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: 'LOCAL-FIRST AI',
                    desc: 'Where practical, inference is performed on private infrastructure to avoid unpredictable latency and external data reliance.',
                  },
                  {
                    title: 'AUTOMATION FIRST',
                    desc: 'Repeated manual work should become a pipeline. If a query is executed twice, it belongs in an autonomous cron.',
                  },
                  {
                    title: 'SIGNAL OVER VOLUME',
                    desc: 'More job listings do not necessarily mean better results. A precise stream of 3 high-affinity matches beats 80 noisy postings.',
                  },
                  {
                    title: 'MODULAR ARCHITECTURE',
                    desc: 'Sources, evaluation and delivery layers remain strictly decoupled and easily replaceable.',
                  },
                  {
                    title: 'HUMAN IN THE LOOP',
                    desc: 'AI prioritizes and drafts; the final decision and authentic communication remain strictly with the user.',
                  },
                ].map((principle, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:border-slate-700"
                  >
                    <div className="text-xs font-mono font-bold text-emerald-400 mb-1">
                      {principle.title}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {principle.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY BY DESIGN */}
      <section className="py-16 border-b border-slate-800/60 bg-slate-950/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 mb-2">
              <Shield className="h-4 w-4" />
              <span>Data Ethics & Integrity</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Privacy by Design</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              SeekerIA is designed to minimize unnecessary personal data collection. Search
              preferences (such as target postal code, radius, and stack keywords) are used solely
              to evaluate opportunities, while the system avoids unnecessary external sharing of
              candidate information.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 border-b border-slate-800/60 bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Questions & Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Clear answers regarding capabilities, technical mechanics, and scope.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left font-semibold text-white hover:text-emerald-400 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-slate-950 border-b border-slate-800">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Stop Searching. Start Monitoring.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Let an AI agent turn fragmented Danish tech job listings into a focused stream of
            opportunities.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://t.me/SeekerIA_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap"
            >
              <Send className="h-4 w-4" />
              <span>Open SeekerIA on Telegram</span>
            </a>
            <a
              href="#pipeline"
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all whitespace-nowrap"
            >
              <Workflow className="h-4 w-4 text-slate-400" />
              <span>Explore the Architecture</span>
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <span>Direct Telegram bot handle:</span>
            <a
              href="https://t.me/SeekerIA_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              @SeekerIA_bot
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SeekerIALogo
                  size={32}
                  showWordmark={true}
                  wordmarkClassName="text-base font-bold text-white tracking-tight"
                />
              </div>
              <p className="text-slate-400">
                AI Job Discovery Agent for the Danish Tech Market
              </p>
              <div className="text-slate-400 font-mono mt-1">
                <a
                  href="https://t.me/SeekerIA_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  @SeekerIA_bot
                </a>
                <span className="mx-2">·</span>
                <a
                  href="https://seekeria.yuryoropeza.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  seekeria.yuryoropeza.com
                </a>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-6 font-medium text-slate-400">
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How it works
              </a>
              <a href="#pipeline" className="hover:text-white transition-colors">
                Pipeline
              </a>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#simulator" className="hover:text-white transition-colors">
                Commands
              </a>
              <a href="#demo" className="hover:text-white transition-colors">
                Output Demo
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
              <a
                href="https://t.me/SeekerIA_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Telegram
              </a>
            </nav>
          </div>

          {/* Explicit Demonstrative Data Notice */}
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-[11px] text-slate-300 leading-relaxed font-mono">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1.5 uppercase tracking-wider text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Explicit Demonstrative Disclaimer</span>
            </div>
            <p className="text-slate-400">
              All data, job titles, technical specifications, match scores (0–100), commute estimations, company names, and outreach text presented on this website are strictly demonstrative simulations engineered for software architecture and portfolio showcase. They do not constitute actual employment advertisements, live scraped listings, or real hiring vacancies.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
            <div>© 2026 SeekerIA. All rights reserved.</div>
            <div className="text-center sm:text-right font-mono text-[11px] text-slate-400">
              An independent AI / automation project. Built as an experiment in AI, automation,
              data engineering and software development.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
