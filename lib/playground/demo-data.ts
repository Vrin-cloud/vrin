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

export const DEMO_QUERIES: DemoQuery[] = [
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
];

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
