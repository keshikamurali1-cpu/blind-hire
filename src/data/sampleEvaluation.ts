import { Evaluation } from '../types';

export const SAMPLE_EVALUATION: Evaluation = {
  id: 'eval-sample-001',
  jobTitle: 'Junior Software Engineer',
  department: 'Core Platform Engineering',
  locationType: 'Hybrid',
  status: 'in_progress',
  createdAt: '2026-09-18T10:30:00Z',
  jobDescription: `Role: Junior Software Engineer
Location: Hybrid (San Francisco, CA)
Experience: 0-2 years

About the Role:
We are seeking a Junior Software Engineer to join our backend platform team. In this role, you will build and maintain high-throughput REST APIs, write robust backend microservices, query and optimize relational databases, and collaborate with cross-functional teams to solve challenging technical problems.

Key Requirements:
- Hands-on proficiency in Java or Python for backend service development.
- Solid understanding of SQL, relational schema design, and query optimization.
- Practical experience designing and consuming RESTful APIs with clean error handling.
- Foundational knowledge of Spring Boot or FastAPI frameworks.
- Strong analytical problem-solving skills and clean code practices with unit testing.
- Comfort with version control (Git) and automated testing environments.`,
  blueprint: {
    summary: 'Backend platform role requiring solid language fundamentals (Java/Python), relational database queries (SQL), API architecture (REST), and methodical problem-solving.',
    technicalSkills: [
      {
        id: 'skill-java',
        name: 'Java',
        category: 'technical',
        required: true,
        level: 'Intermediate',
        explanation: 'The primary language for core platform backend services and high-concurrency microservices.'
      },
      {
        id: 'skill-sql',
        name: 'SQL',
        category: 'technical',
        required: true,
        level: 'Intermediate',
        explanation: 'Required because the role involves database schema queries, joins, aggregations, and transaction handling.'
      },
      {
        id: 'skill-python',
        name: 'Python',
        category: 'technical',
        required: false,
        level: 'Foundational',
        explanation: 'Used for automation scripts, data ETL pipelines, and auxiliary developer tooling.'
      },
      {
        id: 'skill-rest',
        name: 'REST APIs',
        category: 'technical',
        required: true,
        level: 'Intermediate',
        explanation: 'Core responsibility to build well-formed HTTP endpoints following standard status codes and payload models.'
      },
      {
        id: 'skill-springboot',
        name: 'Spring Boot',
        category: 'technical',
        required: false,
        level: 'Foundational',
        explanation: 'The microservice framework standard used in production infrastructure.'
      }
    ],
    coreCapabilities: [
      {
        id: 'cap-problem-solving',
        name: 'Problem Solving & Edge Cases',
        category: 'core_capability',
        required: true,
        level: 'Intermediate',
        explanation: 'Ability to isolate boundary conditions, prevent null pointer exceptions, and optimize time complexity.'
      },
      {
        id: 'cap-api-design',
        name: 'API Error Handling',
        category: 'core_capability',
        required: true,
        level: 'Intermediate',
        explanation: 'Disciplined approach to returning predictable error contracts rather than unhandled server failures.'
      },
      {
        id: 'cap-data-aggregation',
        name: 'Data Aggregation & Grouping',
        category: 'core_capability',
        required: true,
        level: 'Intermediate',
        explanation: 'Structuring complex multi-table joins and windowing queries for reporting endpoints.'
      }
    ],
    experienceSignals: [
      {
        id: 'exp-projects',
        name: 'Full-Stack or Backend Projects',
        category: 'experience_signal',
        required: true,
        explanation: 'Evidence of running code beyond textbook exercises (e.g. personal projects, internships, open source).'
      },
      {
        id: 'exp-database',
        name: 'Relational Database Usage',
        category: 'experience_signal',
        required: true,
        explanation: 'Direct experience interfacing application code with PostgreSQL, MySQL, or SQLite.'
      },
      {
        id: 'exp-team-collab',
        name: 'Version Control & Code Reviews',
        category: 'experience_signal',
        required: false,
        explanation: 'Familiarity with git branching, pull request workflows, and collaborative software lifecycles.'
      }
    ]
  },
  assessments: [
    {
      id: 'challenge-java-01',
      skill: 'Java',
      title: 'Find Duplicate Transactions',
      taskType: 'practical_coding',
      timeLimitMinutes: 5,
      difficulty: 'Intermediate',
      description: 'Given a list of financial transactions, write a method `findDuplicates(List<Transaction> transactions)` that returns the IDs of transactions that appear more than once within the dataset. Pay attention to efficiency and null handling.',
      language: 'java',
      starterCode: `import java.util.*;

public class TransactionAuditor {
    public static class Transaction {
        public String id;
        public double amount;
        public long timestamp;
        public Transaction(String id, double amount, long timestamp) {
            this.id = id;
            this.amount = amount;
            this.timestamp = timestamp;
        }
    }

    // Return set of transaction IDs that appear multiple times
    public static Set<String> findDuplicates(List<Transaction> list) {
        // TODO: Implement solution
        return Collections.emptySet();
    }
}`,
      evaluationCriteria: [
        'Correctness of duplicate detection logic',
        'O(N) time complexity using HashSet or Frequency Map',
        'Defensive null check for input collection and transaction IDs',
        'Clean code structure and idiomatic Java collections usage'
      ]
    },
    {
      id: 'challenge-sql-01',
      skill: 'SQL',
      title: 'Top 3 Customers by Total Order Value',
      taskType: 'system_query',
      timeLimitMinutes: 5,
      difficulty: 'Intermediate',
      description: 'Write an SQL query to retrieve the top 3 customers who have spent the highest total amount across all completed orders in 2026. Return `customer_id`, `customer_name`, and `total_spent` formatted to 2 decimal places, sorted descending.',
      language: 'sql',
      starterCode: `-- Tables schema:
-- customers(customer_id, customer_name, signup_date)
-- orders(order_id, customer_id, order_date, status, total_amount)

SELECT 
    c.customer_id,
    c.customer_name,
    SUM(o.total_amount) AS total_spent
FROM customers c
-- Complete query here:

LIMIT 3;`,
      evaluationCriteria: [
        'Correct INNER or LEFT JOIN between customers and orders',
        'Filter for order status = "completed" and order_date year 2026',
        'Proper GROUP BY aggregation with SUM',
        'Correct ORDER BY total_spent DESC and LIMIT 3'
      ]
    },
    {
      id: 'challenge-python-01',
      skill: 'Python',
      title: 'Batch Retry Rate Limiter',
      taskType: 'practical_coding',
      timeLimitMinutes: 5,
      difficulty: 'Intermediate',
      description: 'Write a Python utility function `batch_process(items, max_batch_size, retry_limit)` that chunks an iterable into batches and returns successfully processed item IDs and any failures after max retries.',
      language: 'python',
      starterCode: `def batch_process(items: list, max_batch_size: int = 50, retry_limit: int = 3):
    """
    Process items in batches with retry limits.
    Returns: dict with 'success_count', 'failed_items', and 'batches_processed'
    """
    # Write implementation here
    pass`,
      evaluationCriteria: [
        'Chunking logic correctly segments large lists without truncation',
        'Handles empty input gracefully',
        'Tracks retries and accumulates failure state properly'
      ]
    },
    {
      id: 'challenge-rest-01',
      skill: 'REST APIs',
      title: 'Idempotent Payment Endpoint Design',
      taskType: 'api_logic',
      timeLimitMinutes: 5,
      difficulty: 'Intermediate',
      description: 'Describe or outline an Express / Spring endpoint handling `POST /api/v1/payments`. Specify headers (Idempotency-Key), status codes for successful creation (201), duplicate attempts (200 with cached response), and validation failure (422/400).',
      language: 'json',
      starterCode: `// Define route handler structure or OpenAPI schema snippet:
POST /api/v1/payments
Headers:
  Idempotency-Key: "uuid-v4"
Body:
  { "amount": 149.00, "currency": "USD", "recipient_id": "usr_8821" }

Expected Behaviors:
1. First attempt:
2. Duplicate replay with same key:
3. Invalid payload:`,
      evaluationCriteria: [
        'Understands 201 Created vs 200 OK for idempotency cache hits',
        'Proper header verification for Idempotency-Key',
        'Appropriate 4xx error codes for validation vs missing headers'
      ]
    }
  ],
  candidates: [
    {
      id: 'cand-014',
      anonymousLabel: 'Candidate 014',
      appliedDate: '2026-09-19T14:20:00Z',
      anonymizedProfile: {
        headline: 'Software Engineer with Backend Project Portfolio',
        educationLevel: 'B.Tech Information Technology',
        relevantExperience: [
          'Backend Engineering Intern — Built microservices handling 45k requests/min',
          'Academic Lead Project — Distributed ledger ledger auditing system with Java & SQL',
          'Open Source Contributor — Fixed issue with PostgreSQL connection pool leak'
        ],
        programmingExperience: '3 years practical programming (Java, Python, SQL, C++)',
        domainExposure: ['FinTech APIs', 'Relational Databases', 'Docker & CI/CD Pipelines']
      },
      extractedSkills: [
        {
          skill: 'Java',
          status: 'supported',
          evidenceSnippet: 'Implemented high-concurrency order ledger backend using Java 17; benchmarked garbage collection.',
          category: 'technical'
        },
        {
          skill: 'SQL',
          status: 'supported',
          evidenceSnippet: 'Authored complex multi-table SQL queries and indexed order history tables in PostgreSQL.',
          category: 'technical'
        },
        {
          skill: 'Python',
          status: 'supported',
          evidenceSnippet: 'Wrote automated integration test suite in Python using pytest and requests.',
          category: 'technical'
        },
        {
          skill: 'REST APIs',
          status: 'supported',
          evidenceSnippet: 'Architected 12 REST endpoints with OpenAPI specs, JWT authentication, and standardized error schemas.',
          category: 'technical'
        },
        {
          skill: 'Spring Boot',
          status: 'unverified',
          evidenceSnippet: 'Spring Boot listed in skills bullet point without specific production usage metrics or architecture details.',
          category: 'technical'
        },
        {
          skill: 'Problem Solving & Edge Cases',
          status: 'supported',
          evidenceSnippet: 'Refactored duplicate transaction race condition in student billing platform.',
          category: 'core_capability'
        }
      ],
      personalSignalsHidden: {
        namesSuppressed: ['Full Legal Name', 'Preferred Name'],
        genderAndDemographicsSuppressed: ['Pronouns', 'Gender identity', 'Ethnicity marker'],
        photosSuppressed: true,
        institutionsAnonymized: ['Undergraduate Tier 1 University Name replaced with "B.Tech Information Technology"'],
        contactInfoSuppressed: ['Email Address', 'Phone Number', 'Personal Street Address', 'Social Links'],
        locationsSuppressed: ['Metro Area / City replaced with generic timezone/region'],
        totalSignalsSuppressed: 9,
        auditLog: [
          'Redacted candidate photo from header',
          'Replaced University of Technology with standardized degree level',
          'Masked personal email and phone number',
          'Removed gendered salutations and social links'
        ]
      },
      submissions: {
        'challenge-java-01': {
          challengeId: 'challenge-java-01',
          skill: 'Java',
          codeOrAnswer: `public static Set<String> findDuplicates(List<Transaction> list) {
    if (list == null || list.isEmpty()) {
        return Collections.emptySet();
    }
    Set<String> seen = new HashSet<>();
    Set<String> duplicates = new HashSet<>();
    for (Transaction tx : list) {
        if (tx != null && tx.id != null) {
            if (!seen.add(tx.id)) {
                duplicates.add(tx.id);
            }
        }
    }
    return duplicates;
}`,
          submittedAt: '2026-09-20T11:05:00Z',
          status: 'demonstrated',
          aiExplanation: 'The submitted Java method demonstrates strong practical competency. It utilizes a HashSet for linear O(N) execution, handles null collections and transaction elements defensively, and correctly isolates duplicate IDs without redundant scanning.',
          executionOutput: 'PASS: 5/5 test suites passed. Execution time: 14ms. Memory allocated: 2.1MB.'
        },
        'challenge-sql-01': {
          challengeId: 'challenge-sql-01',
          skill: 'SQL',
          codeOrAnswer: `SELECT 
    c.customer_id,
    c.customer_name,
    ROUND(SUM(o.total_amount), 2) AS total_spent
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'completed'
  AND o.order_date >= '2026-01-01' 
  AND o.order_date <= '2026-12-31'
GROUP BY c.customer_id, c.customer_name
ORDER BY total_spent DESC
LIMIT 3;`,
          submittedAt: '2026-09-20T11:18:00Z',
          status: 'demonstrated',
          aiExplanation: 'The submitted SQL query demonstrates solid database proficiency. It correctly joins customer and order tables, applies defensive filters for status and date range, aggregates order values accurately, and sorts descending with the requested limit of 3.',
          executionOutput: 'PASS: Query plan validated. Cost index: 0.04. Result returned: 3 records matching ground truth.'
        },
        'challenge-python-01': {
          challengeId: 'challenge-python-01',
          skill: 'Python',
          codeOrAnswer: `def batch_process(items: list, max_batch_size: int = 50, retry_limit: int = 3):
    if not items:
        return {"success_count": 0, "failed_items": [], "batches_processed": 0}
    
    batches = [items[i:i + max_batch_size] for i in range(0, len(items), max_batch_size)]
    # Simulated processing loop
    success = len(items)
    return {"success_count": success, "failed_items": [], "batches_processed": len(batches)}`,
          submittedAt: '2026-09-20T11:32:00Z',
          status: 'partial',
          aiExplanation: 'The Python submission correctly handles array slicing and chunks the input list into valid batch sizes with empty input checks. However, it lacks dynamic retry loop logic for simulated failing items, resulting in a partial evidence rating.',
          executionOutput: 'PARTIAL: Chunking verified (Pass). Retry loop simulation (Unfinished). Score: 70/100.'
        }
      }
    },
    {
      id: 'cand-027',
      anonymousLabel: 'Candidate 027',
      appliedDate: '2026-09-19T16:45:00Z',
      anonymizedProfile: {
        headline: 'Junior Backend & Data Engineer',
        educationLevel: 'B.S. Computer Science',
        relevantExperience: [
          'Software Developer Co-Op — Maintained Python ETL data feeds into MySQL',
          'University Research Assistant — Built API clients and cached query layers',
          'Hackathon Winner — Real-time sensor dashboard with WebSockets and Java'
        ],
        programmingExperience: '2.5 years experience (Python, SQL, Java, Node.js)',
        domainExposure: ['ETL Pipelines', 'Relational Databases', 'API Integration']
      },
      extractedSkills: [
        {
          skill: 'Python',
          status: 'supported',
          evidenceSnippet: 'Authored data ingestion pipelines handling 100k daily records using Python and Pandas.',
          category: 'technical'
        },
        {
          skill: 'SQL',
          status: 'supported',
          evidenceSnippet: 'Wrote complex indexing and views in MySQL to speed up analytical dashboard queries.',
          category: 'technical'
        },
        {
          skill: 'Java',
          status: 'supported',
          evidenceSnippet: 'Developed multithreaded sensor event receiver in Java during 48-hour hackathon project.',
          category: 'technical'
        },
        {
          skill: 'REST APIs',
          status: 'unverified',
          evidenceSnippet: 'REST APIs listed under tools but no specific server-side route creation described in work details.',
          category: 'technical'
        },
        {
          skill: 'Problem Solving & Edge Cases',
          status: 'supported',
          evidenceSnippet: 'Identified and fixed memory bottleneck in batch data consumer.',
          category: 'core_capability'
        }
      ],
      personalSignalsHidden: {
        namesSuppressed: ['Legal First & Last Name'],
        genderAndDemographicsSuppressed: ['Gender demographic survey information'],
        photosSuppressed: true,
        institutionsAnonymized: ['Regional State University replaced with "B.S. Computer Science"'],
        contactInfoSuppressed: ['Phone', 'Email', 'GitHub Profile handle with real name'],
        locationsSuppressed: ['Zip Code and City'],
        totalSignalsSuppressed: 7,
        auditLog: [
          'Redacted personal contact header',
          'Anonymized academic institution to formal degree classification',
          'Removed candidate portrait and extracurricular club demographics'
        ]
      },
      submissions: {
        'challenge-python-01': {
          challengeId: 'challenge-python-01',
          skill: 'Python',
          codeOrAnswer: `def batch_process(items: list, max_batch_size: int = 50, retry_limit: int = 3):
    if not items:
        return {"success_count": 0, "failed_items": [], "batches_processed": 0}
    
    batches = [items[i:i + max_batch_size] for i in range(0, len(items), max_batch_size)]
    failed = []
    success_count = 0
    
    for batch in batches:
        for item in batch:
            attempts = 0
            processed = False
            while attempts < retry_limit and not processed:
                try:
                    # Simulated item processing
                    processed = True
                    success_count += 1
                except Exception:
                    attempts += 1
            if not processed:
                failed.append(item)
                
    return {
        "success_count": success_count,
        "failed_items": failed,
        "batches_processed": len(batches)
    }`,
          submittedAt: '2026-09-20T14:10:00Z',
          status: 'demonstrated',
          aiExplanation: 'The Python submission demonstrates thorough implementation. It properly chunks lists, executes item-level retry attempts bounded by retry_limit, collects failed items, and outputs the structured response dictionary as requested.',
          executionOutput: 'PASS: 4/4 test scenarios passed. Retry boundary conditions validated.'
        },
        'challenge-sql-01': {
          challengeId: 'challenge-sql-01',
          skill: 'SQL',
          codeOrAnswer: `SELECT customer_id, customer_name, SUM(total_amount) as total_spent
FROM customers
JOIN orders USING (customer_id)
GROUP BY customer_id
ORDER BY total_spent DESC;`,
          submittedAt: '2026-09-20T14:25:00Z',
          status: 'partial',
          aiExplanation: 'The candidate correctly joins customers with orders and aggregates total_spent. However, the query omitted the order completion status filter, the 2026 date constraint, and the LIMIT 3 requirement, leading to partial evidence.',
          executionOutput: 'PARTIAL: Basic join and sum passed. Missing year filter and LIMIT 3.'
        }
      }
    },
    {
      id: 'cand-031',
      anonymousLabel: 'Candidate 031',
      appliedDate: '2026-09-20T09:15:00Z',
      anonymizedProfile: {
        headline: 'Entry-Level Full Stack & API Developer',
        educationLevel: 'B.S. Software Engineering',
        relevantExperience: [
          'Full-Stack Developer Bootcamp Capstone — Built e-commerce platform with REST endpoints',
          'Freelance Web Developer — Built responsive web applications and database integrations'
        ],
        programmingExperience: '1.5 years active development (JavaScript, Python, Java, SQL)',
        domainExposure: ['RESTful Web Services', 'Web Application Development', 'Git Versioning']
      },
      extractedSkills: [
        {
          skill: 'REST APIs',
          status: 'supported',
          evidenceSnippet: 'Created authenticated RESTful endpoints for cart checkout and catalog search.',
          category: 'technical'
        },
        {
          skill: 'Python',
          status: 'supported',
          evidenceSnippet: 'Built Flask API for product inventory management.',
          category: 'technical'
        },
        {
          skill: 'Java',
          status: 'claimed',
          evidenceSnippet: 'Java listed under technical skills; no coursework or project repo referenced.',
          category: 'technical'
        },
        {
          skill: 'SQL',
          status: 'claimed',
          evidenceSnippet: 'SQL mentioned in summary; no explicit schemas or queries documented.',
          category: 'technical'
        }
      ],
      personalSignalsHidden: {
        namesSuppressed: ['Candidate Full Name'],
        genderAndDemographicsSuppressed: ['Demographic survey headers'],
        photosSuppressed: true,
        institutionsAnonymized: ['Private Polytechnic College replaced with "B.S. Software Engineering"'],
        contactInfoSuppressed: ['Email', 'Cell Number', 'LinkedIn URL'],
        locationsSuppressed: ['City / State address'],
        totalSignalsSuppressed: 8,
        auditLog: [
          'Removed personal identifying profile links',
          'Sanitized college credentials into standardized degree',
          'Stripped demographic markers and contact vectors'
        ]
      },
      submissions: {
        'challenge-rest-01': {
          challengeId: 'challenge-rest-01',
          skill: 'REST APIs',
          codeOrAnswer: `POST /api/v1/payments
1. First attempt:
   Check if Idempotency-Key header is present. If missing, return 400 Bad Request.
   Check if key exists in Redis/cache. If not, validate body {amount > 0, currency, recipient_id}.
   Process transaction, save result under key with 24h TTL, return 201 Created with transaction details.

2. Duplicate replay with same key:
   If key exists in cache and previous status was successful, return 200 OK with cached response payload.
   Include 'X-Cache-Replay: true' header so caller knows payment was not double-charged.

3. Invalid payload:
   If amount <= 0 or missing recipient_id, return 422 Unprocessable Entity with JSON error object describing fields.`,
          submittedAt: '2026-09-20T16:05:00Z',
          status: 'demonstrated',
          aiExplanation: 'The response demonstrates thorough architectural understanding of API idempotency. It correctly identifies 201 vs 200 semantics for duplicate prevention, specifies the header contract, uses TTL caching, and applies 422/400 for payload validation.',
          executionOutput: 'PASS: Architecture criteria fully satisfied. Error codes & caching strategy aligned with production standards.'
        }
      }
    }
  ]
};

export const SECONDARY_SAMPLE_EVALUATION: Evaluation = {
  id: 'eval-fullstack-02',
  jobTitle: 'Data Platform Engineer',
  department: 'Data Infrastructure',
  locationType: 'Remote',
  createdAt: '2026-09-15T11:00:00Z',
  status: 'completed',
  jobDescription: `Data Platform Engineer responsible for streaming ETL pipelines, SQL warehouses, and Python data services. Strong understanding of distributed databases and pipeline resilience required.`,
  blueprint: {
    summary: 'Data engineering position focusing on high-volume pipelines, SQL transformations, and Python distributed processing.',
    technicalSkills: [
      { id: 'dp-1', name: 'SQL', category: 'technical', required: true, level: 'Advanced', explanation: 'Essential for analytical queries and warehouse transformations.' },
      { id: 'dp-2', name: 'Python', category: 'technical', required: true, level: 'Intermediate', explanation: 'Used for pipeline processing and workflow orchestrators.' },
      { id: 'dp-3', name: 'Docker', category: 'technical', required: false, level: 'Foundational', explanation: 'Containerized deployment for worker microservices.' },
    ],
    coreCapabilities: [
      { id: 'dpc-1', name: 'Data Pipeline Reliability', category: 'core_capability', required: true, explanation: 'Handling partial data ingestion and idempotent retries.' }
    ],
    experienceSignals: [
      { id: 'dpe-1', name: 'Production ETL Deployment', category: 'experience_signal', required: true, explanation: 'Track record running data jobs on production data.' }
    ]
  },
  assessments: [
    {
      id: 'dp-sql-01',
      skill: 'SQL',
      title: 'Monthly Active User Retention Cohorts',
      taskType: 'system_query',
      timeLimitMinutes: 5,
      difficulty: 'Advanced',
      description: 'Write an analytical SQL query computing 30-day retention rates across user signup cohorts.',
      language: 'sql',
      starterCode: `WITH cohorts AS (\n  SELECT user_id, DATE_TRUNC('month', created_at) AS signup_month\n  FROM users\n)\n-- complete query:\n`,
      evaluationCriteria: ['Window functions', 'Cohort group joins', 'Retention rate computation']
    }
  ],
  candidates: [
    {
      id: 'cand-088',
      anonymousLabel: 'Candidate 088',
      appliedDate: '2026-09-17T09:12:00Z',
      anonymizedProfile: {
        headline: 'Data Engineer with Streaming Pipeline Experience',
        educationLevel: 'B.S. Computer Engineering',
        relevantExperience: [
          'Engineered Spark and Python pipelines processing 2TB daily log telemetry',
          'Optimized Snowflake SQL models, cutting run costs by 40%'
        ],
        programmingExperience: '4 years data engineering',
        domainExposure: ['Cloud Warehouses', 'Data Lakes', 'Airflow Orchestration']
      },
      extractedSkills: [
        { skill: 'SQL', status: 'supported', evidenceSnippet: 'Snowflake models and analytical partitioning queries.' },
        { skill: 'Python', status: 'supported', evidenceSnippet: 'PySpark transformations and Airflow DAGs.' }
      ],
      personalSignalsHidden: {
        namesSuppressed: ['Name Redacted'],
        genderAndDemographicsSuppressed: ['Demographics Masked'],
        photosSuppressed: true,
        institutionsAnonymized: ['University replaced with B.S. Computer Engineering'],
        contactInfoSuppressed: ['Phone and Email hidden'],
        locationsSuppressed: ['Address hidden'],
        totalSignalsSuppressed: 7,
        auditLog: ['Masked personal demographics', 'Normalized university']
      },
      submissions: {
        'dp-sql-01': {
          challengeId: 'dp-sql-01',
          skill: 'SQL',
          codeOrAnswer: `WITH cohorts AS (
  SELECT user_id, DATE_TRUNC('month', created_at) AS signup_month
  FROM users
),
activity AS (
  SELECT a.user_id, DATE_TRUNC('month', a.event_time) AS active_month
  FROM user_actions a
)
SELECT 
  c.signup_month,
  COUNT(DISTINCT c.user_id) AS total_users,
  COUNT(DISTINCT a.user_id) AS retained_users,
  ROUND(COUNT(DISTINCT a.user_id)::numeric / COUNT(DISTINCT c.user_id), 2) AS retention_rate
FROM cohorts c
LEFT JOIN activity a ON c.user_id = a.user_id 
  AND a.active_month = c.signup_month + INTERVAL '1 month'
GROUP BY c.signup_month
ORDER BY c.signup_month DESC;`,
          submittedAt: '2026-09-18T10:00:00Z',
          status: 'demonstrated',
          aiExplanation: 'Query accurately builds cohorts and calculates the 30-day retention metric using clean left joins and interval math.',
          executionOutput: 'PASS: Verified query execution against PostgreSQL analytical dialect.'
        }
      }
    }
  ]
};

