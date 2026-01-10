import { BlogPost } from './types'

// Blog posts data - add new posts here
export const blogPosts: BlogPost[] = [
  {
    slug: 'benchmark-results-ragbench-multihop',
    title: 'How We Achieved 97.5% Accuracy on Financial QA - 22% Better Than Oracle Baselines',
    description: 'A transparent look at VRIN\'s performance on industry-standard RAG benchmarks with Oracle context. We break down our methodology, share what worked, and honestly discuss our limitations.',
    date: '2026-01-05',
    author: {
      name: 'Vedant Patel',
      role: 'Founder & CEO',
      avatar: '/blogs/Profile Photo.JPEG',
      linkedin: 'https://www.linkedin.com/in/vedant1033/',
    },
    category: 'research',
    tags: ['benchmarks', 'RAG', 'performance', 'FinQA', 'MultiHop-RAG', 'hybrid-rag'],
    readingTime: '12 min read',
    featured: true,
    image: '/blog/benchmark-results-hero.png',
    content: `
When we first tested VRIN against industry-standard RAG benchmarks, we were skeptical of our own results. **97.5% accuracy on financial question answering** seemed too good. So we tested again. And again. The numbers held.

This post is our attempt to be completely transparent about what we found, how we tested, and what it means for teams building AI applications that need to actually work.

---

## The Results at a Glance

<div class="benchmark-highlight">

| Benchmark | Metric | VRIN | Oracle Baseline | Improvement |
|-----------|--------|------|-----------------|-------------|
| **RAGBench FinQA** | Number Match | **97.5% ±3.2%** | 79.4% (LLaMA 3.3-70B Oracle) | **+22.8%** |
| **MultiHop-RAG** | Semantic Accuracy | **82.6% ±3.2%** | 63.0% (Multi-Meta RAG + GPT-4) | **+31%** |

</div>

*Results at 95% confidence (±3.2% margin) using 28% of each test dataset with Oracle context methodology. Full methodology, raw data, and reproduction scripts available on [GitHub](https://github.com/Programmer7129/vrin-benchmarks).*

**Important Note on Methodology:** These benchmarks use "Oracle + Noise" context—each question receives a curated set of 2-5 documents that includes the relevant information plus some distractors. This measures **reasoning quality** (can the system extract and compute the correct answer?) rather than **retrieval capability** (can the system find the right documents from thousands?). We compare against other systems using the same Oracle context methodology for a fair comparison.

These aren't cherry-picked results. They're from statistically rigorous tests against public benchmarks with published Oracle baselines. Let us show you exactly how we got here.

---

## Why These Benchmarks Matter

We chose these two benchmarks specifically because they test the hardest problems in enterprise RAG:

### T²-RAGBench FinQA: The Table + Text Challenge

Financial documents are the ultimate stress test for RAG systems. They combine:

- **Dense tables** with numerical data that must be precisely retrieved
- **Narrative text** that provides context for those numbers
- **Multi-step reasoning** to compute ratios, percentages, and comparisons

The benchmark contains **32,908 question-answer pairs** from 9,095 real-world financial reports. When a financial analyst asks "What was the percentage change in goodwill from 2016 to 2017?", the system needs to find the right table, extract the correct cells, and compute the answer.

Most systems struggle here even with Oracle context. The T²-RAGBench leaderboard shows LLaMA 3.3-70B achieves **79.4%** with Oracle context (where relevant documents are pre-provided). Retrieval-based systems drop to ~47% when they must find documents from a larger corpus.

### MultiHop-RAG: The Cross-Document Reasoning Challenge

Real questions rarely have answers in a single document. MultiHop-RAG tests this with **2,556 queries** that require synthesizing information across 2-4 documents.

Example query: *"Which company, discussed by both TechCrunch and The Verge for its antitrust issues, paid billions to be the default search engine?"*

Answering this requires:
1. Finding TechCrunch articles about antitrust
2. Finding Verge articles about antitrust
3. Identifying the common entity (Google)
4. Confirming the search engine default payment detail

The best published result is **63.0%** using Multi-Meta RAG with GPT-4.

---

## Our Testing Methodology

We followed rigorous statistical protocols to ensure our results are meaningful and reproducible.

### Sample Design

\`\`\`
Sample Coverage:  28% of each test dataset (~670 questions)
Confidence:       95% with ±3.2% margin of error
Sampling:         Random selection, reproducible seed (42)
Context Type:     Oracle + Noise (2-5 documents per question)
\`\`\`

This sample size follows BetterBench statistical guidelines. Results plateaued across multiple test runs, indicating stable performance.

### Test Protocol (Oracle Context)

For each benchmark question:

1. **Ingest**: Insert the provided documents for that question into VRIN (Oracle context)
2. **Extract**: Let VRIN's entity-centric pipeline process the content
3. **Query**: Submit the benchmark question
4. **Evaluate**: Compare VRIN's response against the expected answer

**Note**: This methodology matches how the T²-RAGBench leaderboard evaluates Oracle context performance. Each question receives its designated document set (2-5 documents, some relevant, some distractors). This tests reasoning capability, not retrieval from a large corpus.

### Evaluation Criteria

**FinQA (Number Match)**: Does VRIN's response contain the correct numerical values? This is a strict metric—partial credit isn't given.

**MultiHop-RAG (Semantic Accuracy)**: Is the answer semantically correct? This accounts for VRIN providing verbose, contextual answers rather than one-word responses.

---

## What's Actually Happening Under the Hood

The performance gap comes from architectural decisions, not just better prompts.

### 1. Entity-Centric Fact Extraction

Traditional RAG chunks documents and embeds them. VRIN does something different.

When VRIN ingests a financial report, it extracts structured facts:

\`\`\`
Microsoft Corporation → revenue_q4_2024 → $69.6 billion
Microsoft Corporation → ceo → Satya Nadella
Satya Nadella → role → CEO of Microsoft
\`\`\`

These facts form a knowledge graph that preserves relationships. When you ask about Microsoft's revenue, VRIN doesn't search through text chunks—it traverses relationships.

### 2. Hybrid Retrieval (Graph + Vector)

For any query, VRIN runs two retrieval paths in parallel:

- **Graph traversal**: Finds facts directly connected to query entities
- **Vector search**: Finds semantically similar content

The results are fused, giving you both precision (from the graph) and recall (from vectors).

### 3. Table-Aware Processing

Financial documents are full of tables. VRIN's extraction pipeline:

- Detects table structures in documents
- Preserves row/column relationships
- Extracts cell values as discrete facts
- Links table data to document context

This means "What was goodwill in 2017?" actually finds the table cell, not just text that mentions goodwill.

### 4. Entity Discovery from Documents

Here's a subtle but powerful capability: VRIN doesn't just match entities in your query—it discovers entities in retrieved documents and performs secondary graph traversals.

If you ask about "the choppy website issue" and the retrieved documents mention "Sarah Chen reported the problem," VRIN will discover Sarah Chen and find additional facts about her involvement.

---

## Honest Assessment: What We Don't Do Well

We believe transparency builds trust. Here's where VRIN has room to improve:

### Table Extraction Gaps

Our markdown table detection handles standard formats well, but complex nested tables or unusual layouts can trip it up. We're actively improving this with a dedicated development track.

### Multi-Constraint Intersection

Queries with 3+ simultaneous constraints sometimes miss edge cases. "Find all Q4 2023 revenue figures for tech companies mentioned in both WSJ and Bloomberg" can get complex.

### Very Large Tables

Tables with 50+ rows can exceed optimal chunk sizes. We're working on hierarchical table processing.

### Statistical Rigor

Our tests sample 28% of each benchmark dataset (~670 questions), providing ±3.2% margin of error at 95% confidence following BetterBench guidelines. Results plateaued across multiple runs with reproducible seed (42).

---

## What This Means for Your Team

These benchmark results translate to real capabilities for reasoning over provided documents:

### If You're Building Financial Applications

97.5% accuracy on FinQA (Oracle context) means VRIN can reason accurately over financial reports when you provide the relevant documents. Due diligence, earnings analysis, regulatory compliance—tasks where numerical precision matters.

### If You Have Knowledge Across Many Documents

82.6% on MultiHop-RAG means your AI can synthesize information across related documents the way a research analyst would. Legal discovery, competitive intelligence, technical documentation—anywhere answers span multiple sources you've ingested.

### Understanding Oracle Context

These results use "Oracle context"—the relevant documents are provided for each question. In production, you'd ingest your document corpus and VRIN retrieves relevant content. The benchmark measures reasoning capability; production performance also depends on retrieval quality from your specific corpus.

---

## Reproduce Our Results

Our benchmark scripts, raw results, and evaluation logs are fully open source:

\`\`\`bash
# Clone the benchmark repository
git clone https://github.com/Programmer7129/vrin-benchmarks
cd vrin-benchmarks

# Install dependencies
pip install -r requirements.txt

# Run FinQA benchmark (requires VRIN API key)
python run_finqa_benchmark.py --sample 100

# Run MultiHop-RAG benchmark
python run_multihop_benchmark.py --sample 100

# View our actual results
ls results/  # Contains raw JSON logs from our runs
\`\`\`

**What's in the repo:**
- \`run_finqa_benchmark.py\` - FinQA evaluation script
- \`run_multihop_benchmark.py\` - MultiHop-RAG evaluation script
- \`README.md\` - Detailed methodology documentation

The evaluation logic is straightforward—no hidden post-processing or result filtering. Every answer is logged with the expected response for full transparency.

---

## Try It With Your Own Documents

Benchmarks are useful, but your documents are what matter. We encourage you to:

1. **Sign up** at [vrin.cloud](https://vrin.cloud)
2. **Ingest** a few of your challenging documents
3. **Ask** the questions that current solutions can't answer well
4. **Compare** the results

If VRIN doesn't work for your use case, we'd rather know that than have you waste time.

---

## What's Next

We're continuing to push on several fronts:

- **Full dataset validation** on FinQA and MultiHop-RAG
- **Table extraction improvements** for complex document layouts
- **Additional benchmarks** including RAGTruth (hallucination detection)
- **Enterprise-specific benchmarks** for legal, healthcare, and compliance domains

---

## The Bottom Line

VRIN's performance on RAGBench FinQA (97.5%) and MultiHop-RAG (82.6%) demonstrates that the hybrid approach—knowledge graphs plus vector search—delivers superior reasoning capability on Oracle context benchmarks:

- **+22.8%** better than LLaMA 3.3-70B Oracle baseline on FinQA
- **+31%** better than Multi-Meta RAG + GPT-4 on MultiHop-RAG

This isn't about having a better language model. It's about smarter extraction, structured knowledge, and systems that reason across documents the way humans do. Our entity-centric extraction and temporal disambiguation enable accurate numerical reasoning that even 70B parameter models struggle with.

**What these results mean**: When given the right documents, VRIN extracts and reasons over financial data more accurately than leading LLMs. The next frontier is combining this reasoning capability with robust retrieval for real-world deployments.

The code is open. The methodology is documented. The results are reproducible. We're betting that transparency about what works (and what doesn't yet) is more valuable than marketing claims.

---

*Questions about methodology or want to discuss results? [Open an issue on GitHub](https://github.com/Programmer7129/vrin-benchmarks/issues) or contact us at [vrin.cloud](https://vrin.cloud)*
`,
  },
  {
    slug: 'controlled-creativity-brainstorming-mode',
    title: 'Why Enterprise AI Plays It Safe (And How We Built Controlled Creativity)',
    description: 'Enterprise AI tools suppress creativity to avoid hallucinations. We took a different approach: controlled creativity validated against your knowledge graph. The result? 11-25% better strategic ideas than Gemini 3 Pro and ChatGPT 5.2.',
    date: '2026-01-05',
    author: {
      name: 'Vedant Patel',
      role: 'Founder & CEO',
      avatar: '/blogs/Profile Photo.JPEG',
      linkedin: 'https://www.linkedin.com/in/vedant1033/',
    },
    category: 'research',
    tags: ['brainstorming', 'creativity', 'LLM', 'enterprise-ai', 'knowledge-graph'],
    readingTime: '10 min read',
    featured: true,
    image: '/blog/brainstorming-mode-hero.png',
    content: `
Enterprise AI tools face a fundamental tension: **creativity versus reliability**.

Most vendors—Glean, Microsoft Copilot, Google Vertex—have chosen to minimize LLM creativity to prevent hallucinations. It's a reasonable approach for accuracy, but it comes with a tradeoff. These tools excel at retrieving what's in your documents, but they struggle to help you think differently about your business.

We took a different approach. When we tested it against Gemini 3 Pro on a real strategic problem, our method scored **93/100 vs. 74/100**—a 25% improvement in idea quality.

This post explains why we built "controlled creativity" and how it works.

---

## The Hallucination Dilemma

Every enterprise AI team faces the same tradeoff:

\`\`\`
High Creativity (High Entropy)
    ↓
More Hallucinations
    ↓
Unsafe for Enterprise
    ↓
Must Minimize Creativity
\`\`\`

The result? Enterprise AI tools that answer **"What does the data say?"** but can't answer **"What new approaches are we missing?"**

This is a real limitation. When you ask your current AI assistant for marketing strategy ideas, you get:
- Summaries of what's already in your documents
- Industry-standard best practices
- Generic frameworks from training data

You don't get novel, company-specific insights that leverage your unique constraints and opportunities. The AI has been optimized for safety over creativity.

---

## Our Contrarian Bet: Controlled Creativity

We asked a different question: **What if hallucinations aren't always bad?**

Consider history's greatest innovations:
- **Flight** seemed impossible until the Wright Brothers proved otherwise
- **Electricity** was considered dangerous magic before we understood it
- **Fire** was uncontrollable until humans learned to harness it

The boldest ideas often seem "impossible" before step-by-step progress makes them real. An AI that discards all "unlikely" ideas is also discarding potential breakthroughs.

**Our approach:**

\`\`\`
Controlled Creativity (Managed Entropy)
    ↓
Novel Ideas Generated
    ↓
Validate Against Knowledge Graph
    ↓
Tag by Feasibility (Grounded / Plausible / Impossible)
    ↓
Safe AND Creative for Enterprise
\`\`\`

Instead of suppressing creativity, we validate it. The knowledge graph becomes a reality check, not a creativity filter.

---

## The Test: VRIN vs. Gemini 3 Pro

We wanted to know if this approach actually produces better strategic thinking. So we ran a head-to-head test.

### The Challenge

A founder with a specific background (AI memory management, TinyML/edge experience) needed startup ideas that leveraged their actual skills and network. Both systems received identical context:

- Founder's CV and technical background
- Current tech stack and capabilities
- Network and partnership opportunities
- Market constraints and timeline

### The Evaluation Framework

We used a **Strategic Fit & Viability Index (SFVI)** with four weighted dimensions:

| Dimension | Weight | What It Measures |
|-----------|--------|------------------|
| Founder-Market Fit | 35% | How well ideas leverage actual background, skills, and relationships |
| Technical Specificity | 25% | Concreteness of architecture, infrastructure, and implementation details |
| Commercial Viability | 25% | Clarity on buyers, budgets, POC structure, and GTM motion |
| Market Timing | 15% | Alignment with current spending trends and infrastructure priorities |

### The Results

<div class="benchmark-highlight">

| System | Overall Score |
|--------|---------------|
| **VRIN (Brainstorm Mode)** | **93/100** |
| Gemini 3 Pro | 74/100 |
| **Improvement** | **+25%** |

</div>

**Dimension-by-Dimension Breakdown:**

| Dimension | Gemini 3 Pro | VRIN | Gap |
|-----------|--------------|------|-----|
| Founder-Market Fit (35%) | 8.0 | **9.5** | +1.5 |
| Technical Specificity (25%) | 7.5 | **9.5** | +2.0 |
| Commercial Viability (25%) | 6.5 | **9.0** | +2.5 |
| Market Timing (15%) | 7.5 | **9.0** | +1.5 |

The biggest gap was in **Commercial Viability**—VRIN understood how to turn ideas into revenue, while Gemini stayed theoretical.

### Cross-Validation: VRIN vs. ChatGPT 5.2 (Thinking)

To ensure our results weren't evaluator-dependent, we ran the same test against OpenAI's latest reasoning model using Gemini 3 Pro as an independent judge.

<div class="benchmark-highlight">

| System | Overall Score |
|--------|---------------|
| **VRIN (Brainstorm Mode)** | **90.15/100** |
| ChatGPT 5.2 (Thinking) | 81.45/100 |
| **Improvement** | **+11%** |

</div>

**Dimension-by-Dimension:**

| Dimension | ChatGPT 5.2 | VRIN | Winner |
|-----------|-------------|------|--------|
| Founder-Market Fit (35%) | 82 | **94** | VRIN |
| Technical Specificity (25%) | 75 | **92** | VRIN |
| Commercial Viability (25%) | **88** | 85 | ChatGPT |
| Market Timing (15%) | 80 | **90** | VRIN |

**The independent judge's verdict was telling:**

> "VRIN is the superior **Technical Co-founder** (Architectural depth). ChatGPT 5.2 is the superior **Startup Coach** (Execution clarity)."

ChatGPT 5.2 provided a pragmatic 30-day execution plan—great for immediate action. But VRIN went deeper: it identified **KV-cache orchestration** and **MemoryGuard for agent security** as emerging budget lines that most LLMs aren't yet prioritizing.

**Consistency across evaluators:**
- vs. Gemini 3 Pro: VRIN +25%
- vs. ChatGPT 5.2: VRIN +11%

VRIN consistently outperforms on technical depth and founder-market fit—the dimensions that matter most for building defensible businesses.

---

## What Made the Difference

### Gemini's Response: Technically Sound, Strategically Generic

Gemini proposed three ideas anchored in the founder's TinyML/edge background:

1. **Hybrid-edge context manager** for on-device LLMs
2. **Stateful agent memory** ("Redis for Agents")
3. **Privacy-first forgetting infrastructure**

These ideas were technically sound. They matched the founder's skills. But they had a critical flaw: **unclear buyer access and longer-term markets**.

The founder would need to educate the market, build credibility in new spaces, and wait for adoption curves. That's a 3-5 year play for someone who needs traction in 12-24 months.

### VRIN's Response: Concrete, Actionable, Connected

VRIN delivered **ten concrete startup directions** with:

- **MVP sketches** (4-8 week build estimates)
- **Specific KPIs** for each direction
- **90-day action plans**
- **Ideal Customer Profiles** with named segments
- **Partner motion strategies** leveraging existing relationships

Three standout ideas:

1. **MemoryGuard for Agents**: Governance layer for agentic AI memory—immediate buyer need, clear compliance angle
2. **Lakehouse Memory OS**: Databricks-native solution leveraging the founder's existing enterprise relationships
3. **KV-Cache Orchestrator**: Infrastructure play with clear technical differentiation

Each idea came with a path to revenue that used the founder's **actual network and partnerships**, not theoretical market entry.

---

## How Controlled Creativity Works

VRIN's brainstorming mode uses a four-stage workflow:

### Stage 1: Research (Low Entropy)

First, we gather facts from your knowledge graph with a conservative, no-hallucination model:

- What resources do you have? (budget, team, tools)
- What constraints exist? (timeline, compliance, technical)
- What's worked before? (past initiatives, outcomes)
- What relationships can you leverage? (partners, customers, network)

This creates a foundation of evidence-backed context.

### Stage 2: Ideation (High Entropy)

Next, we switch to a high-creativity model with elevated temperature:

- Generate 10-20 novel ideas
- Include conventional AND unconventional approaches
- Don't filter—preserve all possibilities

The LLM is explicitly told to think beyond the documents, suggest new approaches, and be bold.

### Stage 3: Validation (Knowledge Graph)

Here's where it gets interesting. Each idea is validated against your knowledge graph:

**For each idea, we check:**
- Does historical data support this? (similar initiatives, outcomes)
- Are required resources available? (budget, team, expertise)
- Do any constraints block it? (compliance, strategy, capacity)
- What evidence supports or contradicts feasibility?

**Ideas are categorized:**

- **Grounded**: Supported by company data, ready for implementation planning
- **Plausible**: Potentially feasible, needs more research to confirm
- **Likely Impossible**: Contradicts known constraints (but preserved for future re-evaluation)

### Stage 4: Deep Dive (Evidence-Backed Plans)

For Grounded and Plausible ideas, we generate detailed implementation plans:

- Budget breakdown with historical justification
- Timeline with milestones
- Team allocation based on actual capacity
- Expected ROI with conservative and optimistic scenarios
- Risk mitigation strategies
- Concrete next steps

---

## Why "Likely Impossible" Ideas Still Matter

Here's a philosophical point that differentiates our approach: **we don't discard "impossible" ideas**.

An idea marked "Likely Impossible" today might become Plausible tomorrow when:
- Budget constraints change
- New team members are hired
- Strategy pivots
- Market conditions shift

VRIN preserves these ideas and re-evaluates them as your knowledge graph evolves. An unconventional idea flagged in Q1 might surface as actionable in Q3 when constraints change.

This is closer to how successful entrepreneurs actually think. They don't permanently discard bold ideas—they wait for the right moment.

---

## The Competitive Moat

Why can't competitors easily replicate this?

### 1. Requires a Knowledge Graph Foundation

Controlled creativity depends on validating ideas against structured knowledge. Competitors using document-based RAG can't perform multi-hop constraint checking. They'd need to rebuild their architecture.

### 2. Dual-Mode LLM Orchestration

This isn't prompt engineering. It requires:
- Sophisticated switching between research (low entropy) and ideation (high entropy) modes
- Complex validation logic with graph traversal
- Categorization rules that balance creativity and feasibility

### 3. Philosophical Differentiation

Most competitors are philosophically opposed to "controlled hallucinations." The enterprise AI market prioritizes safety over creativity. Our approach is contrarian—and that's precisely why it's differentiated.

---

## Real Use Cases

### Marketing Strategy

**Query**: "What new marketing strategies could we pursue for our SaaS product?"

**Traditional AI**: Lists strategies mentioned in your documents + generic best practices

**VRIN Brainstorm Mode**:
- Retrieves current budget, team capacity, past campaign performance
- Generates 20 ideas ranging from conventional to bold
- Validates each against constraints (budget, team, past success rates)
- Delivers: "Partner with Industry Analyst C" (Grounded—warm relationship exists, budget available, 3.5x historical ROI) with full implementation plan

### Product Roadmap

**Query**: "What features should we build next?"

**Traditional AI**: Summarizes feature requests from customer feedback

**VRIN Brainstorm Mode**:
- Analyzes support tickets, competitive landscape, engineering capacity
- Generates 15 feature ideas including "bold bets"
- Validates against roadmap, team expertise, strategic priorities
- Delivers prioritized list: 5 Grounded (ready to build), 4 Plausible (need research), 6 Likely Impossible (preserved for later)

### Cost Optimization

**Query**: "How can we reduce infrastructure costs?"

**Traditional AI**: Generic cloud optimization tips

**VRIN Brainstorm Mode**:
- Analyzes actual cloud spend patterns, usage data, team capacity
- Generates 12 cost reduction strategies
- Validates against performance requirements, migration risks, team expertise
- Delivers: "Switch to reserved instances for stable workloads" (Grounded—90% of compute is stable, projected savings $15K/month) with migration plan

---

## Try It Yourself

Brainstorm Mode is available in VRIN today. To use it:

1. **Sign up** at [vrin.cloud](https://vrin.cloud)
2. **Ingest your company documents** (the more context, the better validation)
3. **Select "Brainstorm" mode** when asking strategic questions
4. **Get ideas categorized** by feasibility with evidence-backed reasoning

The best results come when you have rich context in your knowledge graph—past initiatives, team information, budget data, and strategic priorities. The more VRIN knows about your constraints, the better it can validate creative ideas.

---

## The Bottom Line

Enterprise AI has been playing it safe for too long. By suppressing creativity to avoid hallucinations, these tools have capped their strategic value.

VRIN takes a different approach: **generate bold ideas, then validate them against your reality**. The knowledge graph becomes a creative partner, not a creativity filter.

When tested head-to-head against frontier models on a real strategic problem:

| Comparison | VRIN | Competitor | Advantage |
|------------|------|------------|-----------|
| vs. Gemini 3 Pro | 93/100 | 74/100 | **+25%** |
| vs. ChatGPT 5.2 (Thinking) | 90/100 | 81/100 | **+11%** |

The difference wasn't marginal. VRIN delivered actionable, founder-specific ideas with implementation plans. The frontier models delivered technically sound but strategically generic suggestions. As one independent judge put it: "VRIN is the superior Technical Co-founder."

If your AI assistant prioritizes caution over creativity, it's working as designed. But there's room for tools that help you think differently—not just recall what you already know.

---

*Want to see how brainstorming mode works with your company's knowledge? Try VRIN at [vrin.cloud](https://vrin.cloud)*
`,
  },
]

// Utility functions
export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured)
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category)
}

export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag))
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)))
  return Array.from(tags).sort()
}
