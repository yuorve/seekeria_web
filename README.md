# SeekerIA Web

SeekerIA is a personal AI project exploring autonomous job discovery, semantic matching and automation for the Danish tech market.

Official website for **SeekerIA**, an AI-powered job discovery and matching system focused on the Danish technology market.

This repository contains the public presentation layer of the project.

The agent, data ingestion, matching logic and automation infrastructure are maintained separately.

The website presents the project's architecture, workflow, features and technical approach.

## ⚙️ Technology

SeekerIA is built as a modular AI-powered automation system.

The public website represents only the presentation layer. The underlying agent and automation infrastructure are maintained separately.

### Agent Pipeline

```text
Job Sources
    ↓
Ingestion & Extraction
    ↓
Normalization
    ↓
Deduplication
    ↓
Semantic Matching
    ↓
Geographic Filtering
    ↓
AI Analysis & Scoring
    ↓
Telegram Delivery
```

### Core Technologies

- Python — data ingestion, processing and automation
- Web scraping & APIs — collecting job opportunities from multiple sources
- Semantic matching — comparing job requirements with candidate profiles
- AI / LLMs — analysing opportunities and generating personalized insights
- Geospatial filtering — location and radius-based opportunity matching
- Telegram Bot API — delivering prioritized opportunities and notifications
- Docker — reproducible deployment and isolated services
- Automation — scheduled monitoring and processing workflows

### Engineering Approach

SeekerIA follows a modular architecture designed to separate:

- data collection
- data processing
- matching and scoring
- AI reasoning
- notification and user interaction

The production implementation is not included in this repository.
Only the public presentation layer is maintained here.

## Related project

The AI agent, data ingestion and matching engine will be maintained separately:  
→ yuorve/seekeria

## Note

This repository contains the SeekerIA web interface and presentation layer.  
All job postings, scores, and company examples displayed in the demo are strictly demonstrative simulations.  
It does not contain the production bot infrastructure, credentials, private data or deployment configuration.
