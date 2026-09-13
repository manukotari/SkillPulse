import { Task, LearningEntry, UpskillGap, ScreenEvidence } from '../types';

const today = new Date().toISOString().split('T')[0];

const getPastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Implement React Server Actions & Optimistic UI',
    description: 'Build responsive mutations using useOptimistic and Next.js / React 19 server actions.',
    category: 'Frontend',
    priority: 'high',
    status: 'completed',
    date: today,
    estimatedMinutes: 90,
    actualMinutes: 75,
    evidenceIds: ['evid-1'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Profile and Fix Heavy Component Re-renders',
    description: 'Use React DevTools Profiler to identify unneeded cascades in the data grid.',
    category: 'Frontend',
    priority: 'medium',
    status: 'in-progress',
    date: today,
    estimatedMinutes: 60,
    actualMinutes: 45,
    evidenceIds: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Design Rate Limiting Architecture with Redis Token Bucket',
    description: 'Draft API gateway throttling schema with sliding window and token bucket algorithm.',
    category: 'System Design',
    priority: 'high',
    status: 'todo',
    date: today,
    estimatedMinutes: 120,
    actualMinutes: 0,
    evidenceIds: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'PostgreSQL Index Tuning & EXPLAIN ANALYZE',
    description: 'Investigate slow join queries on transactions table and add partial composite indexes.',
    category: 'Backend',
    priority: 'high',
    status: 'completed',
    date: getPastDate(1),
    estimatedMinutes: 90,
    actualMinutes: 105,
    evidenceIds: ['evid-2'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Implement Docker Multi-Stage Build & Security Scan',
    description: 'Shrink container images from 850MB to 65MB using Alpine and Trivy scanner.',
    category: 'DevOps',
    priority: 'medium',
    status: 'completed',
    date: getPastDate(2),
    estimatedMinutes: 75,
    actualMinutes: 60,
    evidenceIds: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Solve 2 LeetCode Dynamic Programming problems (Knapsack variation)',
    description: 'Partition Equal Subset Sum and Target Sum with memoization & space optimization.',
    category: 'Algorithms',
    priority: 'medium',
    status: 'completed',
    date: getPastDate(3),
    estimatedMinutes: 60,
    actualMinutes: 70,
    evidenceIds: [],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'task-7',
    title: 'Write Technical Design Document for Event-Driven Notification Service',
    description: 'Outline Kafka topic layout, dead-letter queues, and idempotency keys.',
    category: 'Architecture',
    priority: 'high',
    status: 'completed',
    date: getPastDate(4),
    estimatedMinutes: 120,
    actualMinutes: 110,
    evidenceIds: [],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  }
];

export const INITIAL_LEARNING_ENTRIES: LearningEntry[] = [
  {
    id: 'learn-1',
    date: today,
    topic: 'React 19 Actions & Transition Handling',
    category: 'Frontend',
    summary: 'Discovered how useTransition and useActionState automatically manage pending states and error boundaries without manual boolean flags.',
    ahaMoment: 'Transitions prevent blocking inputs; wrapping state updates inside startTransition preserves UI responsiveness during heavy DOM recalculations.',
    challengeFaced: 'Form fields were flickering when server action returned validation errors.',
    howSolved: 'Used useOptimistic with a fallback roll-back reducer to smoothly retain user inputs until server confirmations arrive.',
    masteryScore: 8,
    hoursSpent: 2.5,
    tags: ['React19', 'OptimisticUI', 'AsyncState'],
    evidenceIds: ['evid-1']
  },
  {
    id: 'learn-2',
    date: getPastDate(1),
    topic: 'PostgreSQL Execution Plans & B-Tree vs BRIN Indexes',
    category: 'Backend',
    summary: 'Mastered reading EXPLAIN (ANALYZE, BUFFERS) trees and recognizing index scans vs sequential filter scans.',
    ahaMoment: 'BRIN indexes are dramatically smaller for naturally append-only chronological timestamps than standard B-Trees (10MB vs 400MB)!',
    challengeFaced: 'Query planner was ignoring index on multi-column filter.',
    howSolved: 'Column order in compound index did not match query predicate order (leading column rule). Reordered composite index correctly.',
    masteryScore: 9,
    hoursSpent: 3.0,
    tags: ['PostgreSQL', 'Performance', 'Database'],
    evidenceIds: ['evid-2']
  },
  {
    id: 'learn-3',
    date: getPastDate(2),
    topic: 'Container Security & Layer Caching in Multi-Stage Dockerfiles',
    category: 'DevOps',
    summary: 'Separated build dependencies and production artifacts into lean runners.',
    ahaMoment: 'Ordering Docker commands so package.json / lockfiles are copied before source code drastically speeds up daily CI cache hits.',
    challengeFaced: 'Non-root user in Alpine lacked permission to write into temp log directory.',
    howSolved: 'Configured explicit chown and created dedicated /app/tmp directory before USER node directive.',
    masteryScore: 7,
    hoursSpent: 2.0,
    tags: ['Docker', 'DevOps', 'Security'],
    evidenceIds: []
  },
  {
    id: 'learn-4',
    date: getPastDate(3),
    topic: 'Dynamic Programming State Reduction & Bitmasking',
    category: 'Algorithms',
    summary: 'Reduced 2D table space complexity to 1D sliding array for 0/1 knapsack problems.',
    ahaMoment: 'Iterating backwards in 1D array prevents using the same item multiple times without needing a 2nd row.',
    challengeFaced: 'Off-by-one errors with base case initialization.',
    howSolved: 'Drew out 3x3 small grid manually on paper before coding the transition relation.',
    masteryScore: 8,
    hoursSpent: 2.5,
    tags: ['Algorithms', 'DP', 'ProblemSolving'],
    evidenceIds: []
  },
  {
    id: 'learn-5',
    date: getPastDate(4),
    topic: 'Idempotency Keys & Distributed Event Deduplication',
    category: 'Architecture',
    summary: 'Designing at-least-once message processing without double-billing or duplicate notifications.',
    ahaMoment: 'Use Redis SET key token NX EX 86400 as an atomic lock with database transaction wrapping.',
    challengeFaced: 'Race conditions when network retry sends identical request within milliseconds.',
    howSolved: 'Enforced unique constraint in SQL transaction combined with Redis pre-flight atomic gate.',
    masteryScore: 9,
    hoursSpent: 3.5,
    tags: ['SystemDesign', 'Kafka', 'DistributedSystems'],
    evidenceIds: []
  },
  {
    id: 'learn-6',
    date: getPastDate(5),
    topic: 'Web Accessibility (a11y) & Focus Trapping in Modals',
    category: 'Frontend',
    summary: 'Implemented WAI-ARIA dialog patterns with inert attribute and keyboard focus restoration.',
    ahaMoment: 'Modern browsers support the `inert` attribute natively, making background backdrop shielding simple and accessible.',
    challengeFaced: 'Screen reader announced hidden background content behind open dialog.',
    howSolved: 'Toggled inert on the main page wrapper when modal opened.',
    masteryScore: 8,
    hoursSpent: 1.5,
    tags: ['a11y', 'Accessibility', 'DOM'],
    evidenceIds: []
  }
];

export const INITIAL_UPSKILL_GAPS: UpskillGap[] = [
  {
    id: 'gap-1',
    skillName: 'Distributed Systems & Microservice Resilience',
    category: 'System Design',
    currentProficiency: 6,
    targetProficiency: 9,
    reasonForGap: 'Transitioning from monolithic apps to high-scale fault-tolerant services requires deeper grasp of consensus, circuit breakers, and distributed tracing.',
    changesRequired: [
      'Implement Circuit Breaker pattern with fallback mechanisms in Node/Go',
      'Deploy and configure OpenTelemetry distributed tracing across 3 services',
      'Study Raft consensus protocol and leader election failure recovery'
    ],
    actionItems: [
      { id: 'act-1', text: 'Build a mock payment service with resilience4j/brakes circuit breaker', completed: true },
      { id: 'act-2', text: 'Instrument NestJS/Express microservices with OpenTelemetry collector', completed: false },
      { id: 'act-3', text: 'Simulate network partitions using Chaos Engineering (Pumba / Toxiproxy)', completed: false }
    ],
    priority: 'high',
    status: 'in-progress',
    targetDate: getPastDate(-21)
  },
  {
    id: 'gap-2',
    skillName: 'Database Internals & Advanced Query Optimization',
    category: 'Backend',
    currentProficiency: 6,
    targetProficiency: 9,
    reasonForGap: 'Need to diagnose P99 latency spikes and architect sharded/partitioned schemas under heavy concurrent write loads.',
    changesRequired: [
      'Master PostgreSQL WAL (Write-Ahead Logging) and checkpointing tuning',
      'Implement declarative table partitioning on large transactional tables',
      'Replace naive full scans with targeted GIN and GiST indexes for JSON and geo data'
    ],
    actionItems: [
      { id: 'act-4', text: 'Benchmark 5M row table queries before/after composite indexing', completed: true },
      { id: 'act-5', text: 'Implement hash-based table partitioning on user_events table', completed: false },
      { id: 'act-6', text: 'Configure connection pooling with PgBouncer to eliminate connection churn', completed: false }
    ],
    priority: 'high',
    status: 'in-progress',
    targetDate: getPastDate(-14)
  },
  {
    id: 'gap-3',
    skillName: 'Advanced React Architecture & Performance Profiling',
    category: 'Frontend',
    currentProficiency: 7,
    targetProficiency: 10,
    reasonForGap: 'Leading enterprise frontend architecture requires mastering rendering internals, memory leak detection, and micro-frontend federation.',
    changesRequired: [
      'Audit bundle size and eliminate unused heavy dependencies using Module Federation & tree shaking',
      'Master Chrome DevTools Memory Heap Snapshot comparison to eliminate detached DOM nodes',
      'Establish strict Web Vitals monitoring (INP, LCP, CLS) in CI pipeline'
    ],
    actionItems: [
      { id: 'act-7', text: 'Resolve memory leak caused by uncleaned event listeners in custom hooks', completed: true },
      { id: 'act-8', text: 'Implement virtualized scrolling for large data tables (tanstack-virtual)', completed: true },
      { id: 'act-9', text: 'Achieve sub-50ms Interaction to Next Paint (INP) across dashboard', completed: false }
    ],
    priority: 'medium',
    status: 'in-progress',
    targetDate: getPastDate(-10)
  },
  {
    id: 'gap-4',
    skillName: 'Cloud-Native Kubernetes & GitOps Pipelines',
    category: 'DevOps',
    currentProficiency: 5,
    targetProficiency: 8,
    reasonForGap: 'Bridging developer operations to run self-healing staging and production clusters with automated canary rollouts.',
    changesRequired: [
      'Write production Helm charts with ConfigMaps, Secrets, and Ingress routing',
      'Set up ArgoCD for declarative GitOps continuous delivery',
      'Configure Horizontal Pod Autoscaling (HPA) based on custom Prometheus metrics'
    ],
    actionItems: [
      { id: 'act-10', text: 'Set up local k8s cluster with Minikube / k3s', completed: true },
      { id: 'act-11', text: 'Deploy multi-tier app via ArgoCD synced with Git repository', completed: false },
      { id: 'act-12', text: 'Configure canary deployments with Argo Rollouts and Prometheus metrics analysis', completed: false }
    ],
    priority: 'medium',
    status: 'in-progress',
    targetDate: getPastDate(-30)
  }
];

// Sample SVG screenshot data for initial evidence visualization
export const INITIAL_EVIDENCE: ScreenEvidence[] = [
  {
    id: 'evid-1',
    timestamp: new Date().toISOString(),
    title: 'React 19 Server Action & Optimistic UI Benchmark',
    notes: 'Captured snapshot of Network waterfall showing instant optimistic DOM update followed by 80ms background sync.',
    imageData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340"><rect width="100%" height="100%" fill="%230f172a"/><rect x="20" y="20" width="560" height="40" rx="8" fill="%231e293b"/><text x="40" y="45" fill="%23a5b4fc" font-family="monospace" font-size="14">React DevTools / Profiler - Task Form Action</text><rect x="20" y="80" width="260" height="240" rx="8" fill="%231e293b"/><text x="35" y="110" fill="%2338bdf8" font-family="sans-serif" font-size="13" font-weight="bold">Optimistic Update Stage</text><rect x="35" y="130" width="230" height="30" rx="4" fill="%2310b981" fill-opacity="0.2"/><text x="45" y="150" fill="%2334d399" font-family="monospace" font-size="12">Render UI: 4.2ms (Instant)</text><rect x="35" y="170" width="230" height="30" rx="4" fill="%236366f1" fill-opacity="0.2"/><text x="45" y="190" fill="%23818cf8" font-family="monospace" font-size="12">Server Action POST: 82ms</text><rect x="300" y="80" width="280" height="240" rx="8" fill="%231e293b"/><text x="315" y="110" fill="%23c084fc" font-family="sans-serif" font-size="13" font-weight="bold">Network Waterfall Proof</text><path d="M 320 140 L 520 140" stroke="%2338bdf8" stroke-width="6" stroke-linecap="round"/><path d="M 320 180 L 410 180" stroke="%2310b981" stroke-width="6" stroke-linecap="round"/><text x="320" y="230" fill="%2394a3b8" font-family="sans-serif" font-size="12">Zero layout shift (CLS: 0.00)</text><text x="320" y="260" fill="%2310b981" font-family="sans-serif" font-size="12">â Verification Passed</text></svg>',
    taskId: 'task-1',
    category: 'Frontend'
  },
  {
    id: 'evid-2',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    title: 'PostgreSQL EXPLAIN ANALYZE Execution Plan',
    notes: 'Execution plan after adding compound index (account_id, created_at DESC). Query cost dropped from 14,200 to 12.8.',
    imageData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="340" viewBox="0 0 600 340"><rect width="100%" height="100%" fill="%230f172a"/><rect x="20" y="20" width="560" height="40" rx="8" fill="%231e293b"/><text x="40" y="45" fill="%2334d399" font-family="monospace" font-size="14">pgAdmin Query Plan: SELECT * FROM transactions</text><rect x="20" y="80" width="560" height="240" rx="8" fill="%231e293b"/><text x="40" y="120" fill="%23fbbf24" font-family="monospace" font-size="13">Index Scan using idx_tx_account_date on transactions</text><text x="40" y="150" fill="%2394a3b8" font-family="monospace" font-size="12">Cost: 0.43..12.82 rows=45 width=128 (actual time=0.042..0.088)</text><text x="40" y="180" fill="%2338bdf8" font-family="monospace" font-size="12">Buffers: shared hit=4 read=0</text><rect x="40" y="210" width="520" height="40" rx="6" fill="%2310b981" fill-opacity="0.15"/><text x="55" y="235" fill="%2334d399" font-family="sans-serif" font-size="13" font-weight="bold">Speedup: 99.1% latency reduction (480ms -> 3.2ms)</text></svg>',
    taskId: 'task-4',
    category: 'Backend'
  }
];
