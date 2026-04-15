export interface DemoQuery {
  id: string;
  question: string;
  description: string;
  hopCount: number;
  /** Why standard RAG fails on this query */
  whyRagFails: string;
  /** The document chain Vrin follows */
  documentChain: string[];
}

export interface PatientProfile {
  id: string;
  name: string;
  /** Brief clinical context shown above the queries */
  context: string;
  queries: DemoQuery[];
}

export interface KnowledgeDocument {
  title: string;
  authors?: string;
  type: 'paper' | 'blog';
  year: number;
  /** Optional link to the paper/blog */
  url?: string;
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  queries: DemoQuery[];
  /** Optional patient profiles — when present, UI shows patient sub-tabs */
  patients?: PatientProfile[];
  /** Optional knowledge corpus — when present, UI shows a toggle listing ingested documents */
  corpus?: KnowledgeDocument[];
}

export const SCENARIOS: DemoScenario[] = [
  {
    id: 'enterprise-ops',
    name: 'Enterprise Operations',
    description: 'Cross-department analysis across leadership changes, infrastructure migrations, customer escalations, and financials.',
    queries: [
      {
        id: 'leadership-transition',
        question: 'What changed after the leadership transition at Meridian Corp?',
        description: 'Traces CEO change through pricing negotiations, vendor partnerships, board approvals, financial outcomes, and policy implementation.',
        hopCount: 6,
        whyRagFails: 'Vector search retrieves documents mentioning "leadership transition" but misses the customer advisory board pricing compromise, AWS partnership, and board approval chain that explain HOW the transition changed the company.',
        documentChain: [
          'CEO Transition Memo',
          'Customer Advisory Board Minutes',
          'AWS Strategic Partnership',
          'Board Meeting Minutes',
          'Q3 Financial Report',
          'Flexible First Policy',
        ],
      },
      {
        id: 'infrastructure-migration',
        question: 'Which teams were affected by the Q3 infrastructure migration, and what was the outcome?',
        description: 'Follows the migration plan through DBA assessment, outage incident, support team response, Phase 3 resolution, and vendor credit recovery.',
        hopCount: 6,
        whyRagFails: 'Vector search finds documents about "infrastructure migration" but misses the DBA pre-assessment that prevented Phase 3 issues, the AWS TAM involvement, and the SLA credits that offset migration costs.',
        documentChain: [
          'Infrastructure Migration Plan',
          'DBA Pre-Migration Assessment',
          'DevOps Incident Report',
          'Customer Support Migration Memo',
          'Phase 3 After-Action Report',
          'AWS SLA Credit Review',
        ],
      },
      {
        id: 'thornton-financial-impact',
        question: 'What was the total financial impact of the Thornton Industries escalation, and how did it affect our Q3 revenue?',
        description: 'Traces a customer escalation through warranty claims, legal review, contra-revenue treatment, and its effect on quarterly financials.',
        hopCount: 6,
        whyRagFails: 'Vector search finds the Thornton escalation document but cannot connect it to the Make-Whole credits, the ASC 606 contra-revenue treatment in the finance memo, or the Q3 subscription revenue that was reduced by $312K when combined with the loyalty discount.',
        documentChain: [
          'Thornton Industries Escalation',
          'Enterprise Warranty Terms',
          'Legal Memo: Returns-Warranty',
          'Finance: Make-Whole Revenue Impact',
          'Q3 Financial Report',
          'Customer Advisory Board Minutes',
        ],
      },
      {
        id: 'customer-issues-ceo-strategy',
        question: 'How did our enterprise customer issues in Q3 connect to the changes Sarah Chen made after becoming CEO?',
        description: 'Connects customer escalations and warranty costs to subscription revenue, pricing negotiations, and the CEO strategic pivot.',
        hopCount: 6,
        whyRagFails: 'Vector search retrieves documents about "customer issues" and "Sarah Chen" separately, but cannot trace the chain from Thornton/Cascade escalations through Make-Whole costs to subscription revenue impact to the CAB pricing compromise that Sarah initiated.',
        documentChain: [
          'Thornton Industries Escalation',
          'Finance: Make-Whole Revenue Impact',
          'Q3 Financial Report',
          'Customer Advisory Board Minutes',
          'CEO Transition Memo',
          'Board Meeting Minutes',
        ],
      },
      {
        id: 'diamond-tier-q3-problems',
        question: 'What went wrong with our Diamond tier customers in Q3, and what are we doing about it?',
        description: 'Connects Diamond tier incidents across customer escalations, infrastructure outages, legal reviews, financial impact, and proposed policy changes.',
        hopCount: 6,
        whyRagFails: 'Vector search returns the Diamond tier definition document, but misses the actual incidents: Thornton and Cascade escalations, ZenConnect outage affecting Diamond batch jobs, $94K in Make-Whole credits, and Lisa Patel\'s proposed 15% ACV cap to limit future exposure.',
        documentChain: [
          'Enterprise Tier Definitions',
          'Thornton Industries Escalation',
          'DBA Pre-Migration Assessment',
          'DevOps Incident Report',
          'Finance: Make-Whole Revenue Impact',
          'Legal Memo: Returns-Warranty',
        ],
      },
    ],
  },
  {
    id: 'banking-compliance',
    name: 'Banking Compliance',
    description: 'BSA/AML compliance, regulatory guidance, customer risk assessments, and AI governance for community banks.',
    queries: [
      {
        id: 'acme-edd-risk-rating',
        question: 'Acme Manufacturing\'s transaction volume increased 40% after their ownership change last quarter. Based on our BSA policy and FFIEC guidance, does this require enhanced due diligence and should we update their risk rating?',
        description: 'Connects a customer risk assessment to the internal BSA policy EDD triggers and FFIEC regulatory requirements for ownership changes.',
        hopCount: 3,
        whyRagFails: 'Vector search finds the Acme risk assessment but misses that the internal BSA policy has a specific 30% threshold trigger for EDD, and that FFIEC requires beneficial ownership reverification when ownership changes exceed 25%.',
        documentChain: [
          'Acme Manufacturing Risk Assessment',
          'PNWCB BSA/AML Policy',
          'FFIEC BSA/AML Manual',
        ],
      },
      {
        id: 'ai-model-compliance-gaps',
        question: 'Given the OCC\'s model risk management guidance and the findings from our last board report, are our current AI tools compliant with regulatory expectations? What gaps exist?',
        description: 'Cross-references the AI governance board report findings against OCC SR 11-7, FFIEC technology risk, and CFPB lending guidance.',
        hopCount: 4,
        whyRagFails: 'Vector search finds the board report OR the OCC guidance, but cannot cross-reference to identify that LendAssist\'s overdue validation violates SR 11-7 Section 4, BankBot should be classified as a model, and the adverse action codes may violate CFPB requirements.',
        documentChain: [
          'PNWCB AI Governance Board Report',
          'OCC Model Risk Management SR 11-7',
          'CFPB AI in Lending Guidance',
          'FFIEC BSA/AML Manual',
        ],
      },
      {
        id: 'acme-sar-filing-decision',
        question: 'If Acme Manufacturing\'s recent transaction pattern matches the structuring typology from our previous SAR filing on Global Trade Dynamics, do we need to file a new SAR? What evidence supports this decision?',
        description: 'Compares a current customer profile against a previous SAR typology, then applies internal policy, FFIEC guidance, and FinCEN filing requirements.',
        hopCount: 5,
        whyRagFails: 'Vector search retrieves the Acme profile but cannot connect it to the Global Trade Dynamics SAR typology (structured deposits followed by international wires), then cross-reference the internal BSA policy SAR triggers, FFIEC structuring indicators, and FinCEN filing deadlines to build a complete recommendation.',
        documentChain: [
          'Acme Manufacturing Risk Assessment',
          'Previous SAR Filing (Global Trade Dynamics)',
          'PNWCB BSA/AML Policy',
          'FFIEC BSA/AML Manual',
          'FinCEN SAR Filing Instructions',
        ],
      },
    ],
  },
  {
    id: 'congressional-intelligence',
    name: 'Congressional Intelligence',
    description: 'Congressional hearings, member positions, and legislative intelligence across committees and sessions.',
    queries: [
      {
        id: 'cross-hearing-insulin',
        question: 'Which senators discussed insulin pricing across both Finance and HELP committee hearings this session, and how did their positions compare?',
        description: 'Cross-committee, cross-hearing position synthesis',
        hopCount: 4,
        whyRagFails: 'Vector search retrieves fragments from individual hearings but cannot track the same senator\'s statements across committees or synthesize evolving positions into a coherent picture.',
        documentChain: [
          'Finance Hearing Mar 2026',
          'HELP Hearing Jan 2026',
          'Member Profile — Whitfield',
          'HELP Markup Mar 2026',
        ],
      },
      {
        id: 'nakamura-position-evolution',
        question: 'How has Senator Nakamura\'s position on drug pricing regulation evolved from June 2025 to March 2026, and what factors may have influenced the shift?',
        description: 'Temporal position tracking + influence analysis',
        hopCount: 5,
        whyRagFails: 'Standard search returns Nakamura\'s most recent statements but misses the arc from opposition to softening. It cannot connect lobbying disclosures to the timeline of position changes.',
        documentChain: [
          'Finance Hearing Jun 2025',
          'Finance Hearing Nov 2025',
          'Finance Hearing Mar 2026',
          'PhRMA Lobbying Disclosure',
          'Member Profile — Nakamura',
        ],
      },
      {
        id: 'insulin-cap-landscape',
        question: 'What is the current legislative landscape for the Insulin Price Cap Act, including committee support, CBO scoring, and potential opposition from industry stakeholders?',
        description: 'Full legislative intelligence briefing across document types',
        hopCount: 5,
        whyRagFails: 'Each document type (bill text, CBO report, hearing testimony, lobbying filings) lives in a separate silo. Vector search returns the bill summary but misses the CBO scoring context, committee vote signals, and industry opposition dynamics.',
        documentChain: [
          'Bill Summary S.1847',
          'CBO Cost Estimate',
          'HELP Markup Mar 2026',
          'PhRMA Lobbying Disclosure',
          'Client Memo Q1 2026',
        ],
      },
      {
        id: 'whitfield-legislative-strategy',
        question: 'What is Senator Whitfield\'s legislative strategy for getting the Insulin Price Cap Act passed, and how is she building support across both chambers?',
        description: 'Cross-chamber strategy mapping + coalition building analysis',
        hopCount: 5,
        whyRagFails: 'Vector search returns Whitfield\'s statements from whichever hearing scores highest, but cannot piece together her coordinated two-bill approach (S.1847 + S.892), her cross-chamber alliance with Rep. Okafor, or how the HELP markup compromise was designed to win Finance Committee votes.',
        documentChain: [
          'Member Profile — Whitfield',
          'Finance Hearing Mar 2026',
          'HELP Hearing Jan 2026',
          'HELP Markup Mar 2026',
          'Energy & Commerce PBM Hearing',
        ],
      },
      {
        id: 'pharma-lobbying-effectiveness',
        question: 'How effective has PhRMA\'s lobbying campaign been at maintaining opposition to the Insulin Price Cap Act among Senate Finance Committee members?',
        description: 'Lobbying spend vs. actual vote movement analysis',
        hopCount: 5,
        whyRagFails: 'Vector search returns the lobbying disclosure amounts but cannot cross-reference them against each senator\'s actual hearing statements over time. The gap between lobbying intent ("maintain Nakamura\'s opposition") and reality (his position softened anyway) is invisible without graph traversal.',
        documentChain: [
          'PhRMA Lobbying Disclosure',
          'Finance Hearing Jun 2025',
          'Finance Hearing Nov 2025',
          'Finance Hearing Mar 2026',
          'Client Memo Q1 2026',
        ],
      },
      {
        id: 'bipartisan-compromise-path',
        question: 'What bipartisan compromise framework is emerging for insulin pricing legislation, and which members from both parties are driving it?',
        description: 'Cross-party coalition mapping across committees and chambers',
        hopCount: 4,
        whyRagFails: 'Standard search finds "bipartisan" as a keyword but cannot map the actual coalition: Delgado\'s three-pillar framework in HELP, Okafor\'s Republican support in Energy & Commerce, and Nakamura\'s evolving openness in Finance. The compromise path spans three committees in two chambers.',
        documentChain: [
          'HELP Markup Mar 2026',
          'HELP Hearing Jan 2026',
          'Energy & Commerce PBM Hearing',
          'Member Profile — Nakamura',
        ],
      },
    ],
  },
  {
    id: 'healthcare-cdi',
    name: 'Healthcare CDI',
    description: 'Clinical documentation integrity — connecting evidence across patient visits to identify which medical codes are temporally relevant and which specific code variations the clinical evidence supports.',
    queries: [], // queries live inside patient profiles
    patients: [
      {
        id: 'elena-vasquez',
        name: 'Elena Vasquez',
        context: '47F — Breast cancer Stage IIA on chemotherapy (doxorubicin/cyclophosphamide, cycle 5). History of iron-deficiency anaemia (now resolved — iron studies normalized), anaemia reclassified as treatment-related. Neutropenic (ANC 900). History of DVT (resolved, anticoagulation completed Sep 2025). Type 2 diabetes, hypertension. Currently admitted for community-acquired pneumonia.',
        queries: [
          {
            id: 'vasquez-coding-context',
            question: 'For Elena Vasquez\'s current pneumonia admission (April 2026), review her complete medical history across all prior visits and determine: (1) which conditions are ACTIVE and should be coded for THIS admission, (2) which prior diagnoses have RESOLVED or CHANGED and must NOT be carried forward, and (3) for any condition that has changed in type or classification across visits, state what it was before, what it is now, and the clinical evidence that triggered the change.',
            description: 'The foundational CDI query: curate temporally-aware clinical context. Forces the system to make explicit verdicts on each condition — active, resolved, or changed — rather than listing everything.',
            hopCount: 5,
            whyRagFails: 'Vector search returns chunks mentioning conditions from across all 4 visits without temporal structure. A coding agent receiving this context would see "iron-deficiency anaemia," "DVT," "neutropenia," and "breast cancer" all presented equally, with no indication of which are active for THIS admission, which resolved, or which changed classification.',
            documentChain: [
              'Chemo Cycle 4 (Jan 2026)',
              'Chemo Cycle 5 (Mar 2026)',
              'Admission H&P — Pneumonia (Apr 2026)',
              'Lab Results — Admission (Apr 2026)',
              'Oncology Consult (Apr 2026)',
            ],
          },
          {
            id: 'vasquez-temporal-codes',
            question: 'Which conditions from Elena Vasquez\'s history are still active for this pneumonia admission, and which have resolved? Provide the clinical evidence supporting each determination.',
            description: 'Tests temporal reasoning: cancer code always present, DVT resolved, neutropenia active, anaemia type changed across visits.',
            hopCount: 5,
            whyRagFails: 'Keyword search sees "DVT" mentioned in 3 documents and "iron-deficiency anaemia" in 2 documents. It cannot determine that DVT was resolved in September 2025 or that iron-deficiency anaemia was reclassified to treatment-related anaemia in March 2026. It returns all historical codes as potentially relevant.',
            documentChain: [
              'Chemo Cycle 4 (Jan 2026)',
              'ER Visit — Chest Pain (Feb 2026)',
              'Chemo Cycle 5 (Mar 2026)',
              'Admission H&P — Pneumonia (Apr 2026)',
              'Oncology Consult (Apr 2026)',
            ],
          },
          {
            id: 'vasquez-anaemia-variation',
            question: 'Elena Vasquez has a history of anaemia across multiple visits. Which specific anaemia variation applies to this current admission and what clinical evidence supports it?',
            description: 'Tests code specificity: iron-deficiency anaemia in January → treatment-related anaemia by March. Iron studies tell the story.',
            hopCount: 4,
            whyRagFails: 'Vector search retrieves every document mentioning "anaemia" — cycle 4 notes (iron-deficiency), cycle 5 notes (treatment-related), and current labs. It presents all anaemia-related context without distinguishing which variation is current. A keyword-matching system returns all anaemia codes (D50.9, D64.81, D63.0, etc.) because the word "anaemia" appears everywhere.',
            documentChain: [
              'Lab Results (Jan 2026) — low ferritin, microcytic',
              'Lab Results (Mar 2026) — normal ferritin, normocytic',
              'Oncology Consult (Apr 2026) — "treatment-related"',
              'Lab Results (Apr 2026) — iron studies normal',
            ],
          },
          {
            id: 'vasquez-neutropenia-pneumonia',
            question: 'What is the clinical connection between Elena Vasquez\'s neutropenia and her current pneumonia, and how should this relationship be documented for coding?',
            description: 'Multi-hop: chemo causes neutropenia → neutropenia causes immunocompromise → immunocompromise leads to pneumonia. Each fact is in a different document.',
            hopCount: 4,
            whyRagFails: 'Standard search finds documents mentioning "neutropenia" and documents mentioning "pneumonia" but cannot establish the causal chain: chemotherapy → myelosuppression → neutropenia → immunocompromised state → susceptibility to pneumonia. This chain spans 4 documents across 2 visits.',
            documentChain: [
              'Chemo Cycle 5 (Mar 2026) — WBC 2.4, ANC 1100',
              'Lab Results (Mar 2026) — low reticulocyte count',
              'Admission H&P (Apr 2026) — ANC 900, pneumonia',
              'Oncology Consult (Apr 2026) — "neutropenia contributing"',
            ],
          },
          {
            id: 'vasquez-dvt-relevance',
            question: 'Should Elena Vasquez\'s DVT history affect coding or treatment decisions for this pneumonia admission?',
            description: 'Tests temporal exclusion: DVT is resolved but prophylactic anticoagulation is recommended due to cancer + immobility. Subtle distinction.',
            hopCount: 4,
            whyRagFails: 'Vector search returns all DVT mentions (chemo cycle 4, ER visit doppler, oncology consult). It cannot differentiate between "history of DVT — resolved, no active treatment" and "DVT prophylaxis recommended for this admission." The first means don\'t code active DVT; the second means code VTE prophylaxis.',
            documentChain: [
              'Chemo Cycle 4 (Jan 2026) — DVT resolved',
              'ER Visit (Feb 2026) — doppler negative',
              'Oncology Consult (Apr 2026) — prophylaxis recommended',
              'Admission H&P (Apr 2026) — PMH notes resolved DVT',
            ],
          },
          {
            id: 'vasquez-complete-code-set',
            question: 'Generate the complete context summary for Elena Vasquez\'s current pneumonia admission, clearly distinguishing active conditions from resolved historical diagnoses.',
            description: 'The full CDI review: curate ALL relevant clinical context across 8 documents, organized by what\'s active NOW vs. what\'s historical.',
            hopCount: 6,
            whyRagFails: 'This requires synthesizing 8 documents across 4 visits into a temporally organized summary. Vector search returns chunks from across all visits weighted by keyword similarity, mixing current findings with historical ones. There is no temporal structure — January\'s iron-deficiency diagnosis appears alongside April\'s treatment-related reclassification with no indication that one supersedes the other.',
            documentChain: [
              'Chemo Cycle 4 (Jan 2026)',
              'Lab Results (Jan 2026)',
              'ER Visit (Feb 2026)',
              'Chemo Cycle 5 (Mar 2026)',
              'Admission H&P (Apr 2026)',
              'Oncology Consult (Apr 2026)',
            ],
          },
        ],
      },
      {
        id: 'richard-okafor',
        name: 'Richard Okafor',
        context: '68M — HFrEF (EF 28%), Type 2 diabetes on insulin, CKD Stage 3, atrial fibrillation on warfarin. Three admissions in 3 months: #1 acute HF exacerbation with AKI + hyponatremia (both resolved), #2 DKA (resolved, switched to insulin), #3 current — community-acquired pneumonia. Heart failure is stable. No active AKI or hyponatremia.',
        queries: [
          {
            id: 'okafor-coding-context',
            question: 'For Richard Okafor\'s current pneumonia admission (April 2026), review his complete medical history across all 3 prior admissions and outpatient visits. Determine: (1) which conditions are ACTIVE and should be coded for THIS admission, (2) which acute diagnoses from prior admissions (such as AKI, hyponatremia, DKA) have RESOLVED and must NOT be carried forward — cite the specific clinical evidence proving resolution, and (3) which chronic conditions are stable versus actively decompensating during this admission.',
            description: 'The foundational CDI query: curate temporally-aware context across 3 admissions. Forces explicit verdicts — especially on AKI and hyponatremia that resolved in January but a keyword-matching AI would still flag.',
            hopCount: 5,
            whyRagFails: 'Vector search retrieves chunks from all 3 admissions and the outpatient visit. "Acute kidney injury," "hyponatremia," and "diabetic ketoacidosis" appear in the history but are all resolved. A coding agent receiving this flat context would flag them as potentially relevant to the current visit.',
            documentChain: [
              'Discharge Summary #1 (Jan 2026)',
              'Discharge Summary #2 (Feb 2026)',
              'Cardiology Follow-Up (Mar 2026)',
              'Admission #3 H&P (Apr 2026)',
              'Day 2 Progress Note (Apr 2026)',
            ],
          },
          {
            id: 'okafor-resolved-codes',
            question: 'Richard Okafor had acute kidney injury and hyponatremia during his January admission. Should either diagnosis be included in the coding for his current April pneumonia admission?',
            description: 'Tests temporal exclusion of resolved acute conditions. AKI resolved (creatinine back to baseline 1.9), hyponatremia resolved (sodium normal). Neither is present now.',
            hopCount: 4,
            whyRagFails: 'Keyword search finds "acute kidney injury" in the January discharge summary and "creatinine" mentioned in every admission. It cannot determine that creatinine 2.6→3.1→1.9 in January represents a resolved AKI, while creatinine 1.9 in April is the patient\'s stable baseline. Similarly, sodium 128 in January vs. 135 in April — the hyponatremia resolved but the word "hyponatremia" still appears in historical notes.',
            documentChain: [
              'Admission #1 (Jan 2026) — AKI, creatinine 2.6',
              'Discharge Summary #1 — "AKI resolved, creatinine 1.9"',
              'Admission #3 (Apr 2026) — creatinine 1.9 at baseline',
              'Day 2 Progress Note — "No AKI, no hyponatremia"',
            ],
          },
          {
            id: 'okafor-principal-diagnosis',
            question: 'Richard Okafor has heart failure, diabetes, and CKD. For this April admission, which should be the principal diagnosis and why?',
            description: 'Tests principal diagnosis determination: this admission is for pneumonia — not HF, not DKA, not CKD. The AI must reason about WHY he was admitted THIS time.',
            hopCount: 4,
            whyRagFails: 'All three chronic conditions appear extensively across the patient\'s history. Heart failure appears in the most documents (all 7). Keyword relevance scoring would rank HF highest. But the current admission is for pneumonia — a new acute condition. Vector search cannot determine admission reason from document frequency.',
            documentChain: [
              'Admission #3 H&P (Apr 2026) — "CC: fever, cough"',
              'Day 2 Progress Note — "HF stable, pneumonia improving"',
              'Admission #1 (Jan 2026) — HF was principal then',
              'Admission #2 (Feb 2026) — DKA was principal then',
            ],
          },
          {
            id: 'okafor-medication-changes',
            question: 'What medication changes has Richard Okafor had across his three admissions, and what is his current medication regimen?',
            description: 'Tests temporal tracking of medication changes: metformin discontinued, insulin started, lisinopril replaced by Entresto. Each change is in a different document.',
            hopCount: 5,
            whyRagFails: 'Medication lists appear in every discharge summary and progress note. Vector search returns all of them without temporal ordering. It cannot determine that metformin was discontinued in February, lisinopril was replaced by Entresto in March, or that the current regimen reflects cumulative changes across 4 months.',
            documentChain: [
              'Discharge Summary #1 (Jan 2026) — metformin, lisinopril',
              'Discharge Summary #2 (Feb 2026) — metformin discontinued, insulin started',
              'Cardiology Follow-Up (Mar 2026) — lisinopril → Entresto',
              'Admission #3 H&P (Apr 2026) — current medications',
              'Day 2 Progress Note — warfarin INR therapeutic',
            ],
          },
          {
            id: 'okafor-hf-trajectory',
            question: 'How has Richard Okafor\'s heart failure status changed across all visits, and is it contributing to his current pneumonia admission?',
            description: 'Temporal trajectory tracking: EF 30%→25%→28%, BNP levels across visits, volume status assessments. Requires connecting cardiology data across 4 months.',
            hopCount: 5,
            whyRagFails: 'Vector search returns heart failure mentions from every document but cannot construct the trajectory: decompensated in January (BNP 1840, EF 25%), stable in February (BNP 620, euvolemic), improved in March (EF 28% on Entresto), and currently slightly elevated BNP (890) but clinically stable. The trajectory matters — BNP 890 with pneumonia doesn\'t mean HF decompensation.',
            documentChain: [
              'Admission #1 (Jan 2026) — EF 25%, BNP 1840',
              'Admission #2 (Feb 2026) — BNP 620, euvolemic',
              'Cardiology Follow-Up (Mar 2026) — EF 28%, BNP 580',
              'Admission #3 (Apr 2026) — BNP 890',
              'Day 2 Progress Note — "HF stable, BNP trending down"',
            ],
          },
          {
            id: 'okafor-complete-context',
            question: 'Generate the complete context summary for Richard Okafor\'s current pneumonia admission, distinguishing active conditions from resolved ones and correctly identifying what has changed since each prior admission.',
            description: 'Full CDI review across 7 documents and 3 admissions. Must separate current active problems from historical resolved conditions.',
            hopCount: 6,
            whyRagFails: 'Requires synthesizing 7 documents across 3 admissions and 1 outpatient visit into a temporally accurate clinical picture. The patient\'s problem list has evolved: conditions that were acute in January are now resolved, medications changed twice, principal diagnosis was different each admission. No vector similarity approach can construct this temporal narrative.',
            documentChain: [
              'Admission #1 (Jan 2026)',
              'Discharge Summary #1',
              'Admission #2 (Feb 2026)',
              'Discharge Summary #2',
              'Cardiology Follow-Up (Mar 2026)',
              'Admission #3 (Apr 2026)',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ai-research',
    name: 'AI Research',
    description: 'Cross-paper synthesis across 20+ AI research papers — connecting findings, identifying gaps, and surfacing research directions that no single paper contains.',
    corpus: [
      { title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', authors: 'Lewis et al.', type: 'paper', year: 2020 },
      { title: 'Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection', authors: 'Asai et al.', type: 'paper', year: 2023 },
      { title: 'Corrective RAG (CRAG)', authors: 'Yan et al.', type: 'paper', year: 2024 },
      { title: 'Adaptive-RAG: Learning to Adapt Retrieval-Augmented Large Language Models', authors: 'Jeong et al.', type: 'paper', year: 2024 },
      { title: 'CO-RAG: Chain-of-Retrieval Augmented Generation', authors: 'Zhu et al.', type: 'paper', year: 2024 },
      { title: 'RAPTOR: Recursive Abstractive Processing for Tree-Organized Retrieval', authors: 'Sarthi et al.', type: 'paper', year: 2024 },
      { title: 'Graph RAG: A Comprehensive Survey', authors: 'Peng et al.', type: 'paper', year: 2024 },
      { title: 'GraphRAG: Unlocking LLM Discovery on Narrative Private Data', authors: 'Microsoft Research', type: 'paper', year: 2024 },
      { title: 'HippoRAG 2: Knowledge Graph-Augmented Retrieval', authors: 'Gutiérrez et al.', type: 'paper', year: 2024 },
      { title: 'LightRAG: Simple and Fast Retrieval-Augmented Generation', authors: 'Guo et al.', type: 'paper', year: 2024 },
      { title: 'Modular RAG: Transforming RAG Systems into LEGO-like Modules', authors: 'Gao et al.', type: 'paper', year: 2024 },
      { title: 'Agentic RAG: A Survey on Agentic Retrieval-Augmented Generation', authors: 'Singh et al.', type: 'paper', year: 2024 },
      { title: 'Agent-as-a-Judge: Evaluate Agents with Agents', authors: 'Zhuge et al. (Meta AI + KAUST)', type: 'paper', year: 2024 },
      { title: 'Mixture-of-Agents Enhances Large Language Model Capabilities', authors: 'Wang et al.', type: 'paper', year: 2024 },
      { title: 'The AI Scientist: Towards Fully Automated Scientific Discovery', authors: 'Lu et al.', type: 'paper', year: 2024 },
      { title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL', authors: 'DeepSeek-AI', type: 'paper', year: 2025 },
      { title: 'Scaling LLM Test-Time Compute Optimally', authors: 'Snell et al.', type: 'paper', year: 2024 },
      { title: 'CRAG Benchmark: Comprehensive RAG Benchmark', authors: 'Yang et al. (Meta)', type: 'paper', year: 2024 },
      { title: 'Infinite Attention: Extending Context Length', authors: 'Munkhdalai et al.', type: 'paper', year: 2024 },
      { title: 'The Prompt Report: A Systematic Survey of Prompting Techniques', authors: 'Schulhoff et al.', type: 'paper', year: 2024 },
      { title: 'Building Effective Agents', authors: 'Anthropic (Schluntz & Zhang)', type: 'blog', year: 2024 },
      { title: 'The Shift from Models to Compound AI Systems', authors: 'BAIR (Zaharia et al.)', type: 'blog', year: 2024 },
      { title: 'Contextual Retrieval', authors: 'Anthropic', type: 'blog', year: 2024 },
      { title: 'The Claude Model Spec', authors: 'Anthropic', type: 'blog', year: 2024 },
    ],
    queries: [
      {
        id: 'research-blind-spot',
        question: 'Looking across all of these papers, each one identifies limitations in current retrieval and reasoning systems. What unsolved problem or missing capability appears as a recurring theme across multiple papers, something that no single paper fully addresses but multiple papers would benefit from? What would a new research direction look like that tackles this shared blind spot?',
        description: 'Forces cross-paper synthesis: identify patterns in limitations across independent research, then propose a direction none of them explicitly suggest.',
        hopCount: 6,
        whyRagFails: 'Vector search retrieves chunks from individual papers that mention "limitations" but cannot synthesize a shared pattern across papers or connect approaches from unrelated domains (e.g., vector search engines and reasoning bootstrappers) to the same blind spot.',
        documentChain: [
          'Adaptive-RAG (routing strategies)',
          'CRAG (retrieval correction)',
          'Self-RAG (retrieval triggering)',
          'Graph RAG Survey (structural retrieval)',
          'Test-Time Compute (reasoning scaling)',
          'Compound AI Systems (BAIR)',
        ],
      },
    ],
  },
];

/** Backward compat — default to first scenario */
export const DEMO_QUERIES = SCENARIOS[0].queries;

/** Progress stage labels for the Vrin reasoning chain */
export const VRIN_STAGES = [
  { stage: 'analyzing', label: 'Analyzing query' },
  { stage: 'extracting_entities', label: 'Extracting entities' },
  { stage: 'graph_traversal', label: 'Traversing knowledge graph' },
  { stage: 'vector_search', label: 'Searching documents' },
  { stage: 'scoring', label: 'Evaluating relevance' },
  { stage: 'reasoning', label: 'Reasoning over evidence' },
  { stage: 'generating', label: 'Generating answer' },
] as const;

/** Simplified stages for the Standard RAG side */
export const RAG_STAGES = [
  { stage: 'embedding', label: 'Embedding query' },
  { stage: 'vector_search', label: 'Searching by similarity' },
  { stage: 'generating', label: 'Generating answer' },
] as const;
