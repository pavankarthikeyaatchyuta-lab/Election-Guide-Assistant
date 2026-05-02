export const STAGES = [
    {
      id: "announcement",
      label: "Announcement",
      emoji: "📢",
      day: "Day 0",
      summary: "The election authority publishes the official schedule and rules.",
      simple: "This is the public start signal for the election.",
      deep: "It sets the legal calendar for nominations, campaigning, voting, and counting.",
      example: "Polling dates are announced for each region.",
      question: "What usually needs to happen right after the schedule is announced?",
      whatHappens: [
        "The election body publishes the official calendar for nomination, campaigning, voting, and counting.",
        "Political parties, candidates, officials, and voters all start preparing around the same dates.",
        "Administrative rules such as polling logistics, monitoring, and code enforcement usually begin from here."
      ],
      whyItMatters: "A public schedule creates predictability and fairness because everyone works under one official timetable.",
      keyChecks: [
        "Official dates are publicly available",
        "Rules are clearly notified",
        "Election staff begin operational planning"
      ],
      simpleTakeaway: "It is like announcing the full exam schedule before tests begin.",
      advancedNote: "This stage establishes administrative certainty, because later decisions and disputes are judged against the published calendar."
    },
    {
      id: "nomination",
      label: "Nomination",
      emoji: "📝",
      day: "Day 2",
      summary: "Candidates submit forms and documents to officially enter the race.",
      simple: "People who want to contest must sign up correctly.",
      deep: "Election officials review eligibility, paperwork, and deadlines before finalizing valid candidates.",
      example: "A candidate files nomination papers before the last date.",
      question: "Why is checking forms important during nomination?",
      whatHappens: [
        "Candidates submit nomination forms, declarations, and any required supporting documents.",
        "Officials check whether the candidate meets legal and procedural requirements.",
        "A final candidate list is prepared after scrutiny and any withdrawal period."
      ],
      whyItMatters: "Nomination determines who can legally appear on the ballot, so accuracy here directly affects the contest.",
      keyChecks: [
        "Submission before deadline",
        "Eligibility verification",
        "Complete and valid paperwork"
      ],
      simpleTakeaway: "This is the official sign-up step for people who want to compete.",
      advancedNote: "Nomination scrutiny is a high-impact filter because acceptance or rejection directly shapes the candidate field."
    },
    {
      id: "campaigning",
      label: "Campaigning",
      emoji: "📣",
      day: "Day 6",
      summary: "Candidates explain their plans and ask voters for support.",
      simple: "This is when candidates talk to people and share ideas.",
      deep: "Campaigning can include speeches, manifestos, outreach, and debates within election rules.",
      example: "A candidate holds a public meeting to explain policy promises.",
      question: "How does campaigning help voters make a choice?",
      whatHappens: [
        "Candidates and parties explain ideas, promises, and records through public outreach and media.",
        "Voters compare alternatives and begin deciding which candidate or party better matches their expectations.",
        "Campaign rules usually restrict unfair practices such as bribery, intimidation, or hidden spending."
      ],
      whyItMatters: "Campaigning informs voters, but it must also be regulated so influence is lawful and reasonably fair.",
      keyChecks: [
        "Spending oversight",
        "Monitoring for rule violations",
        "Equal opportunity for lawful outreach"
      ],
      simpleTakeaway: "This is when candidates explain why people should vote for them.",
      advancedNote: "A healthy campaign phase balances political expression with enforceable limits that protect fairness and public order."
    },
    {
      id: "silence-period",
      label: "Silence Period",
      emoji: "🤫",
      day: "Day 18",
      summary: "Campaigning stops shortly before voting so voters can think calmly.",
      simple: "This is a quiet time before the vote.",
      deep: "The silence period reduces last-minute influence and protects a fair decision environment.",
      example: "No rallies or campaign messages are allowed in the final hours.",
      question: "Why might a quiet period help voters?",
      whatHappens: [
        "Campaign events and many forms of promotional messaging must stop before polling starts.",
        "Election workers focus on final polling arrangements rather than political activity.",
        "Voters get time to think without strong last-minute pressure."
      ],
      whyItMatters: "The silence period reduces the impact of emotional, manipulative, or hurried last-minute campaigning.",
      keyChecks: [
        "No fresh campaign events",
        "Monitoring of media or digital outreach",
        "Polling areas stay free from campaign activity"
      ],
      simpleTakeaway: "It is a quiet pause before the real decision day.",
      advancedNote: "This stage protects the decision environment, especially where misinformation or pressure could spike just before polling."
    },
    {
      id: "voting",
      label: "Voting",
      emoji: "🗳️",
      day: "Day 20",
      summary: "Eligible voters cast their ballots at polling stations or approved channels.",
      simple: "This is the day people choose by voting.",
      deep: "Voting usually follows identity checks, ballot secrecy, and supervised procedures.",
      example: "A voter verifies identity and casts a secret ballot.",
      question: "What makes voting both secure and fair?",
      whatHappens: [
        "Voters are identified, checked against the electoral roll, and allowed to cast their ballot in secret.",
        "Polling staff handle queues, voter assistance, ballot procedures, and incident reporting.",
        "Observers or party agents may watch the process without interfering with secrecy."
      ],
      whyItMatters: "Voting is the core democratic act, so access, secrecy, accuracy, and public trust all matter here.",
      keyChecks: [
        "Voter identity verification",
        "Secret ballot protection",
        "Secure handling of ballots or machines"
      ],
      simpleTakeaway: "This is the moment when each voter makes the actual choice.",
      advancedNote: "Polling design must balance speed, accessibility, fraud prevention, and verifiable procedure under real-world conditions."
    },
    {
      id: "counting",
      label: "Counting",
      emoji: "📦",
      day: "Day 21",
      summary: "Officials count votes and verify totals under supervision.",
      simple: "Votes are opened and counted carefully.",
      deep: "Counting includes reconciliation, observation, and result verification before declaration.",
      example: "Ballots are tallied in front of authorized observers.",
      question: "Why does counting need supervision?",
      whatHappens: [
        "Votes are counted according to formal procedure after polling ends.",
        "Officials reconcile totals with polling records and resolve doubtful or disputed cases.",
        "Observers monitor the process so the declared result can be trusted."
      ],
      whyItMatters: "Even a strong voting process can lose trust if the count is opaque, rushed, or poorly documented.",
      keyChecks: [
        "Reconciliation of totals",
        "Transparent counting steps",
        "Clear recording of disputes and results"
      ],
      simpleTakeaway: "This is where every valid vote gets added carefully.",
      advancedNote: "Counting is not just arithmetic; it is a verification and chain-of-custody process that must produce a defensible result."
    },
    {
      id: "government-formation",
      label: "Government Formation",
      emoji: "🏛️",
      day: "Day 24",
      summary: "The winning majority or coalition forms the government after results.",
      simple: "The group with enough support starts governing.",
      deep: "If no single group has enough seats, coalition negotiations may decide who governs.",
      example: "Parties with a majority of seats form the new government.",
      question: "What happens if no party wins enough seats alone?",
      whatHappens: [
        "Election results are translated into seats, and the side with enough support moves toward forming government.",
        "If no party has a majority, alliances or coalitions may be negotiated.",
        "Leadership, cabinet roles, and governing support are finalized in this phase."
      ],
      whyItMatters: "Winning votes is not the final step; the result must still become a stable and workable government.",
      keyChecks: [
        "Majority support in the legislature",
        "Coalition agreements if needed",
        "Orderly transfer or continuation of executive authority"
      ],
      simpleTakeaway: "After the election, the winners still have to organize a government that can actually run.",
      advancedNote: "Government formation tests whether an electoral result can be converted into governability, especially in coalition-heavy systems."
    }
  ];

export const MODE_LABELS = {
  quick: "Quick Overview",
  guided: "Guided Journey",
  timeline: "Timeline View",
  quiz: "Quiz Mode"
};

export const ACTIONS = [
  { id: "next", label: "Next" },
  { id: "simple", label: "Explain Simple" },
  { id: "deep", label: "Deep Dive" },
  { id: "quiz", label: "Quiz" }
];

export const QUIZ_QUESTIONS = [
  {
    prompt: "Who usually announces the election schedule?",
    options: [
      "The election authority",
      "Any candidate",
      "Only the media",
      "Only voters"
    ],
    answer: 0,
    success: "Correct. The election authority releases the official schedule.",
    failure: "Not quite. The official schedule is announced by the election authority."
  },
  {
    prompt: "What happens during nomination?",
    options: [
      "Votes are counted",
      "Candidates file forms",
      "Government is formed",
      "Campaigning is banned"
    ],
    answer: 1,
    success: "Correct. Nomination is when candidates submit their papers.",
    failure: "Not quite. Nomination is the stage for filing candidate papers."
  },
  {
    prompt: "Which stage comes right before voting?",
    options: [
      "Campaigning",
      "Announcement",
      "Silence Period",
      "Counting"
    ],
    answer: 2,
    success: "Correct. The silence period happens just before voting.",
    failure: "Not quite. The silence period is the step right before voting."
  },
  {
    prompt: "What is the main event on voting day?",
    options: [
      "Candidates submit forms",
      "Voters cast secret ballots",
      "Results are declared",
      "Parties form a coalition"
    ],
    answer: 1,
    success: "Correct. Voting day is when eligible voters cast ballots.",
    failure: "Not quite. Voting day is for casting ballots, not counting or forming government."
  },
  {
    prompt: "What follows counting in the election flow?",
    options: [
      "Another nomination round",
      "Silence Period",
      "Government Formation",
      "Announcement"
    ],
    answer: 2,
    success: "Correct. Government formation happens after the results are known.",
    failure: "Not quite. Government formation comes after counting and results."
  }
];
