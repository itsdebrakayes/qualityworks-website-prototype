---
title: "03 · Page map, personas and journeys"
summary: "Sitemap aligned to the QM-112 categories, per-page persona/CTA/data table and buyer journeys."
---

# Page map, personas and journeys

> **QM-41 could not be accessed.** (QM-112 v0.5 was read on 18 Nov 2026 and confirms the 7 categories.) The map below uses the 7 QM-112 categories quoted in the brief and the **live header structure** as the closest available evidence. Every route not in today's navigation is marked **(proposed)** and needs QM-41 confirmation. No competing top-level structure has been introduced.

## 1. Page map

```
Home  /
+ Solutions  /services/                         (label "Solutions", URL kept)
|  + Improve Software Quality
|  |  + Test Automation                /services/test-automation/
|  |  + Full-Stack Testing             /services/full-stack-testing/
|  |  + Web & Mobile App Testing       /services/web-mobile-application-testing/
|  |  + Non-Functional Testing         /services/non-functional-testing/
|  |  |   + Performance · Security · Accessibility · UX   (orphans, URLs kept)
|  |  + API & Cloud Services Testing   /services/api-cloud-services-testing/
|  |  + Managed AI Test Squad          /services/ai-test-squad/          (in nav: proposed)
|  |  + Maturity Assessments           /maturity-assessments/
|  + Build or Modernize a Digital Product
|  |  + Custom Software Development    /services/custom-software-development/
|  |  + Tech Advisory / Fractional CTO /services/technology-advisory-partnership/
|  |  + Digital & Agile Transformation /services/digital-agile-transformation/ (in nav: proposed)
|  |  + Engagement models              /engagement-models/  (+ dedicated-teams, staff-augmentation, consulting-training)
|  |  + Innovation Tourism             /innovation-tourism/
|  + Deploy, Integrate, or Govern AI
|     + AI & Agentic Business Solutions /services/ai-service/
|     + Data Quality                    /services/data-quality/
|     + AI Governance                   /services/ai-governance/           (in nav: proposed)
+ Products & Innovations  /products/                                        (proposed overview)
|  + QualityWatcher AI  /qualitywatcher-ai-tools/
|  + QualityWatcher Test Management  (external)  qualitywatcher.com
|  + Agents as a Service      /products/agents-as-a-service/  (external)  agents.qualityworkscg.com  (proposed)
|  + PRISM™                   /products/prism/                                              (proposed)
|  + Cyber Risk Management    (external)  postured.io
+ Who We Help  /industries/
|  + Finance & Banking · Insurance · Healthcare · Logistics · Media & Entertainment · Retail · Technology · Social Impact
|  + Public Sector & Utilities  /industries/public-sector/    (proposed — Persona C)
|  + Small & Mid-Size Businesses /industries/small-business/  (proposed — Personas D/E)
+ Results  /case-studies/   ›  /case-studies/{slug}/  (17; legacy /case-study/ needs 301s)
+ Resources  /resources/                                    (proposed hub)
|  + Blog  /blog/   ›  /{post-slug}/  (99)
|  + Events & Speaking  /events/  ›  /events/{slug}/        (proposed)
+ Company  /about-us/
   + Careers   /careers/   (external)  BambooHR
   + Contact   /contact-us/
Utility: /privacy-policy/ · /terms-conditions/ · /thank-you/ (noindex) · 404
Prototype only: /prototype/ (review hub, docs) · /design-system/
```

## 2. Persona × page table

| Page | Primary persona | Secondary persona | Core question | Proof required | Primary CTA | Required data |
|---|---|---|---|---|---|---|
| Home | A Enterprise CTO; D SMB Founder | B QA Director; C Public sector | What does QualityWorks do, and which part is for me? | Approved stats (C01–C04), awards (C10–C12), 3 case studies | Talk to an expert to `/contact-us/`; secondary: Explore solutions | Pathways, services, products, case studies, articles, events, claims |
| Solutions overview | A | B, D | Which service fits my problem? | Links to case studies | Talk to an expert | Services (grouped), problem-to-service guide |
| Service detail | B (testing) / D (build, AI) / A | varies (record `personas`) | Can they solve this problem, and how? | Related case studies, claims | Service-specific (e.g. Talk to an automation expert) | Service record, case studies, products, FAQ |
| QualityWatcher AI | B QA Director | Automation engineer, A | What does it automate, how do I access it, where do humans review? | C07–C09, WSSC case study | Open QualityWatcher AI (external) | QW tools + observed status, FAQ |
| Agents as a Service | D SMB Founder | E Ops/Marketing | Is a ready-made agent right for us? How do I buy one? | Marketplace catalog snapshot | Browse the marketplace (external) | Agent catalog API (fields in doc 04) |
| PRISM™ | A / AI lead | B, C | How do we know AI outputs are good enough? | Whitepaper, sample scorecard (missing) | Ask about PRISM | Product-owner content (missing) |
| Products overview | B, D | A | Which product is which and where does it live? | — | Product links | Products |
| Industry pages | A (sector buyer) | B | Why is QualityWorks relevant to my sector? | Sector case studies | Talk to an industry expert | Industry record, services, case studies |
| Public Sector (proposed) | C Procurement/tech lead | A | Can they deliver in a regulated environment, with evidence? | WSSC, IEHP; certifications (C13) **unverified** | Make a procurement inquiry (`?topic=procurement`) | Capability statement, NAICS, vehicles (missing) |
| Small Business (proposed) | D Founder/COO | E | Where should we begin, and do we need to buy anything? | Shared Harvest, Knowledge Architects | Help me choose (`?topic=smb-ai`) | Services, AaaS product |
| Case studies | A, C | B | Have they solved this before? | Metrics with source/context | Discuss a similar challenge | Case-study schema |
| Resources / Blog / Article | B, E | A | What can I learn before talking to sales? | Author, dates, references | Talk to an expert (end of article) | Articles (WordPress), events |
| Events | All | — | Where can I see the team, and is it upcoming? | Dates verified with organiser | Register (upcoming only) | Event schema |
| Contact | All | — | How do I reach the right person; what happens next? | — | Send message | Form endpoint (not connected) |
| Careers | F Job applicant | — | Are there roles I fit and how do I apply? | — | Apply on BambooHR | BambooHR job list |
| About | C, A | F | Who are they; are they credible and stable? | C13–C15, leadership | Work with us | Leadership, values, certifications |

## 3. Journeys (each is clickable in the prototype)

| Persona | Path |
|---|---|
| A Enterprise CTO | Home, then **Pathway 01**, then Full-Stack Testing (capabilities, process), then CMN case study (15× coverage), then **Talk to an expert** |
| B QA Director | Home or nav **Products**, then QualityWatcher AI Tools (tools, status, human review), then the WSSC case study, then **Open QualityWatcher AI** (external) or **Talk to an automation expert** |
| C Public sector | Nav **Who We Help**, then Public Sector & Utilities (procurement notice), then the WSSC case study, then **Make a procurement inquiry** (contact form pre-tagged) |
| D SMB Founder | Home, then **Pathway 03** or *Small & Mid-Size Businesses*, then Agents as a Service (comparison table), then **Browse the marketplace** (external) *or* AI & Agentic Solutions, then **Help me choose** |
| E Marketing/Ops | Home, then *Small & Mid-Size Businesses*, then Agents as a Service catalog (filter: PR & Marketing), then Talk to us first |
| F Job applicant | Footer or Company menu, then Careers, then Open roles (no roles today; fixture states via control), then **Apply on BambooHR** (external) |
