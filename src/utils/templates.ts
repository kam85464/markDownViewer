import { 
  FileText, Bug, Calendar, Book, Code2, StickyNote, LucideIcon, 
  CheckSquare, GitPullRequest, User, Cpu, AlertTriangle, Target, 
  TrendingUp, Users, Globe, ShoppingCart, Megaphone, Newspaper, 
  BookOpen, GraduationCap, FlaskConical, Clapperboard, Map, 
  Utensils, Dumbbell, Wallet, ListTodo, ClipboardList, FileSpreadsheet, 
  Lightbulb, Rocket, Shield, Coffee, Music, Camera, Server, Box, Briefcase, PieChart, Gift,
  Database, Mail, PenTool, Wrench, Truck, Video
} from 'lucide-react';

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  content: string;
  isCustom?: boolean;
  category?: string;
}

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank Document',
    description: 'Start from a clean slate',
    icon: StickyNote,
    content: '',
    category: 'General',
  },
  {
    id: 'readme',
    name: 'Project README',
    description: 'Standard documentation structure',
    icon: FileText,
    content: `# Project Title

> A short description of the project.

[!License](LICENSE)

## 📖 Table of Contents
- Installation
- Usage
- Features
- Contributing
- License

## 🚀 Installation

\`\`\`bash
npm install my-project
\`\`\`

## 💻 Usage

\`\`\`javascript
import { hello } from 'my-project';

hello('world');
\`\`\`

## ✨ Features
- Feature 1
- Feature 2

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT
`,
    category: 'Software Engineering',
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Agenda, attendees, and action items',
    icon: Calendar,
    content: `# 📅 Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Time:** 10:00 AM
**Location:** [Room/Link]
**Facilitator:** [Name]

**Attendees:** 
- [ ] [Name 1]
- [ ] [Name 2]

## 📝 Agenda
1. Review previous action items
2. Project updates
3. Roadblocks
4. Next steps

## 💡 Discussion
- Point 1
- Point 2

## ✅ Action Items
- [ ] Task 1 (Assignee: [Name], Due: [Date])
- [ ] Task 2
`,
    category: 'Product & Business',
  },
  {
    id: 'bug_report',
    name: 'Bug Report',
    description: 'Track issues and reproduction steps',
    icon: Bug,
    content: `# 🐛 Bug Report

## Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- **OS:** [e.g. macOS]
- **Browser:** [e.g. Chrome, Safari]
- **Version:** [e.g. 22]

## Additional Context
Add any other context about the problem here.
`,
    category: 'Software Engineering',
  },
  {
    id: 'journal',
    name: 'Daily Journal',
    description: 'Reflections and tasks for the day',
    icon: Book,
    content: `# 📔 Daily Journal - ${new Date().toLocaleDateString()}

## 💭 Mood
[Emoji or short description]

## 🎯 Focus for Today
- [ ] Priority 1
- [ ] Priority 2

## 📝 Notes & Reflections
- What happened today?
- What did I learn?

## 🌟 Highlights
- Best part of the day

## ⏭️ For Tomorrow
- [ ] Task to carry over
`,
    category: 'Personal',
  },
  {
    id: 'snippet',
    name: 'Code Snippet',
    description: 'Share code with explanation',
    icon: Code2,
    content: `# Code Snippet Title

Description of what this code does.

\`\`\`typescript
const example = () => {
  console.log('Hello World');
};
\`\`\`

## Explanation
- Line 1: ...
- Line 2: ...
`,
    category: 'Software Engineering',
  },
  // Software Engineering
  { 
    id: 'feature_request', 
    name: 'Feature Request', 
    description: 'Propose new features', 
    icon: Lightbulb, 
    category: 'Software Engineering', 
    content: '# 💡 Feature Request\n\n## Problem Statement\nIs your feature request related to a problem? Please describe.\n> A clear and concise description of what the problem is. Ex. I\'m always frustrated when [...]\n\n## Proposed Solution\nDescribe the solution you\'d like.\n> A clear and concise description of what you want to happen.\n\n## Alternatives Considered\nDescribe alternatives you\'ve considered.\n> A clear and concise description of any alternative solutions or features you\'ve considered.\n\n## Additional Context\nAdd any other context or screenshots about the feature request here.\n' 
  },
  { 
    id: 'api_docs', 
    name: 'API Documentation', 
    description: 'Endpoint details and examples', 
    icon: Server, 
    category: 'Software Engineering', 
    content: '# 🔌 API Documentation\n\n## Base URL\n`https://api.example.com/v1`\n\n## Authentication\nBearer Token required in header: `Authorization: Bearer <token>`\n\n## Endpoints\n\n### GET /users\nGet a list of users.\n\n- **Params:**\n  - `page` (optional): Page number\n  - `limit` (optional): Items per page\n\n- **Response:**\n```json\n{\n  "data": [\n    { "id": 1, "name": "John Doe" }\n  ]\n}\n```\n\n### POST /users\nCreate a new user.\n\n- **Body:**\n```json\n{ "name": "Jane Doe", "email": "jane@example.com" }\n```\n' 
  },
  { 
    id: 'changelog', 
    name: 'Changelog', 
    description: 'Record of changes', 
    icon: FileSpreadsheet, 
    category: 'Software Engineering', 
    content: '# 📋 Changelog\n\nAll notable changes to this project will be documented in this file.\n\n## [Unreleased]\n\n### Added\n- New feature X\n\n## [1.0.0] - 2023-10-27\n\n### Added\n- Initial release\n- Feature Y\n\n### Fixed\n- Bug Z\n\n### Changed\n- Updated dependency A\n' 
  },
  { 
    id: 'contributing', 
    name: 'Contributing Guide', 
    description: 'Guidelines for contributors', 
    icon: Users, 
    category: 'Software Engineering', 
    content: '# 🤝 Contributing\n\nThank you for considering contributing! We welcome all contributions.\n\n## Getting Started\n\n1. Fork the repository\n2. Clone your fork: `git clone ...`\n3. Install dependencies: `npm install`\n\n## Development Workflow\n\n1. Create a new branch: `git checkout -b feature/my-feature`\n2. Make your changes\n3. Run tests: `npm test`\n\n## Pull Request Process\n\n1. Push to your fork\n2. Open a Pull Request against the `main` branch\n3. Describe your changes in detail\n' 
  },
  { 
    id: 'pull_request', 
    name: 'Pull Request', 
    description: 'PR template', 
    icon: GitPullRequest, 
    category: 'Software Engineering', 
    content: '# 🔀 Pull Request\n\n## Description\nPlease include a summary of the change and which issue is fixed.\n\n## Related Issue\nFixes # (issue)\n\n## Type of Change\n- [ ] 🐛 Bug fix\n- [ ] ✨ New feature\n- [ ] 💥 Breaking change\n- [ ] 📝 Documentation update\n\n## Checklist\n- [ ] My code follows the style guidelines\n- [ ] I have performed a self-review\n- [ ] I have added tests that prove my fix is effective\n- [ ] New and existing tests pass locally\n' 
  },
  { 
    id: 'tech_design', 
    name: 'Technical Design', 
    description: 'System architecture doc', 
    icon: Cpu, 
    category: 'Software Engineering', 
    content: '# 🏗️ Technical Design: [Feature Name]\n\n**Author:** [Name]\n**Status:** Draft / Review / Approved\n**Date:** [Date]\n\n## 1. Overview\nHigh-level summary of the feature and its goals.\n\n## 2. Background\nContext on why we are building this.\n\n## 3. Architecture\n### 3.1 Diagram\n[Insert Mermaid or PlantUML diagram]\n\n### 3.2 Components\n- **Frontend:** ...\n- **Backend:** ...\n- **Database:** ...\n\n## 4. Data Model\nSchema changes or new tables.\n\n## 5. API Design\nNew or modified endpoints.\n\n## 6. Security Considerations\n\n## 7. Migration Strategy\n' 
  },
  { 
    id: 'incident_postmortem', 
    name: 'Incident Postmortem', 
    description: 'Root cause analysis', 
    icon: AlertTriangle, 
    category: 'Software Engineering', 
    content: '# 🚨 Incident Postmortem\n\n**Date:** [Date]\n**Authors:** [Names]\n**Status:** Complete\n\n## Summary\nA brief description of the incident, impact, and resolution.\n\n## Impact\n- **Duration:** [Time start] to [Time end]\n- **Users Affected:** [Number/Percentage]\n- **Services Affected:** [List]\n\n## Timeline\n- **10:00 UTC:** Alert fired for high latency.\n- **10:05 UTC:** Engineer A acknowledged.\n- **10:15 UTC:** Root cause identified.\n- **10:30 UTC:** Fix deployed.\n\n## Root Cause\nDetailed technical explanation of what went wrong.\n\n## Resolution\nHow was the issue fixed?\n\n## Lessons Learned\n### What went well?\n- ...\n\n### What went wrong?\n- ...\n\n## Action Items\n- [ ] Fix bug in X (Owner: A)\n- [ ] Add alert for Y (Owner: B)\n' 
  },
  { 
    id: 'adr', 
    name: 'Architecture Decision', 
    description: 'ADR template', 
    icon: Map, 
    category: 'Software Engineering', 
    content: '# 🏛️ ADR: [Title]\n\n**Status:** Proposed / Accepted / Deprecated\n**Date:** [Date]\n**Deciders:** [Names]\n\n## Context\nWhat is the issue that we are seeing that is motivating this decision or change?\n\n## Decision\nWe will [describe decision] because [justification].\n\n## Consequences\n### Positive\n- ...\n\n### Negative\n- ...\n\n## Alternatives Considered\n- Option A: ...\n- Option B: ...\n' 
  },
  
  // Product & Business
  { 
    id: 'user_story', 
    name: 'User Story', 
    description: 'Agile user story', 
    icon: User, 
    category: 'Product & Business', 
    content: '# 👤 User Story: [Title]\n\n**As a** [role]\n**I want** [feature/capability]\n**So that** [benefit/value]\n\n## Acceptance Criteria\n- [ ] Scenario 1: [Description]\n- [ ] Scenario 2: [Description]\n- [ ] Error handling is implemented\n\n## Notes\n- Design link: ...\n- Tech constraints: ...\n' 
  },
  { 
    id: 'prd', 
    name: 'Product Requirements', 
    description: 'PRD template', 
    icon: ClipboardList, 
    category: 'Product & Business', 
    content: '# 📑 Product Requirements Document (PRD)\n\n**Feature:** [Name]\n**Status:** Draft\n**Owner:** [Name]\n\n## 1. Background & Strategic Fit\nWhy are we doing this? How does it fit into the roadmap?\n\n## 2. Goals & Success Metrics\n- Goal 1: ...\n- Metric: Increase X by Y%\n\n## 3. User Stories\n| User | Wants to... | So that... |\n| --- | --- | --- |\n| Admin | ... | ... |\n\n## 4. Functional Requirements\n- [ ] Requirement 1\n- [ ] Requirement 2\n\n## 5. Non-Functional Requirements\n- Performance: ...\n- Security: ...\n\n## 6. UI/UX\n[Link to Figma/Mockups]\n' 
  },
  { 
    id: 'sprint_plan', 
    name: 'Sprint Planning', 
    description: 'Sprint goals and backlog', 
    icon: Target, 
    category: 'Product & Business', 
    content: '# 🏃 Sprint Planning: Sprint [Number]\n\n**Date:** [Date]\n**Goal:** [Sprint Goal]\n\n## Capacity\n- Dev 1: 5 days\n- Dev 2: 4 days\n\n## Committed Items\n| Ticket | Assignee | Estimate |\n| --- | --- | --- |\n| T-101 | Alice | 3 |\n| T-102 | Bob | 5 |\n\n## Risks\n- Dependency on Team X\n' 
  },
  { 
    id: 'retrospective', 
    name: 'Sprint Retrospective', 
    description: 'What went well/wrong', 
    icon: TrendingUp, 
    category: 'Product & Business', 
    content: '# 🔄 Sprint Retrospective: Sprint [Number]\n\n**Date:** [Date]\n\n## 🟢 What went well?\n- ...\n- ...\n\n## 🔴 What didn\'t go well?\n- ...\n- ...\n\n## 🟡 What can we improve?\n- ...\n\n## 📝 Action Items\n- [ ] Action 1 (Owner: [Name])\n- [ ] Action 2\n' 
  },
  { 
    id: 'okrs', 
    name: 'OKRs', 
    description: 'Objectives and Key Results', 
    icon: Target, 
    category: 'Product & Business', 
    content: '# 🎯 OKRs: [Quarter/Year]\n\n## Objective 1: [Inspirational Goal]\n\n### Key Results\n- [ ] **KR 1:** Increase metric A from X to Y.\n  - *Status:* 20%\n- [ ] **KR 2:** Launch feature B.\n  - *Status:* Not started\n\n## Objective 2: [Inspirational Goal]\n\n### Key Results\n- [ ] **KR 1:** ...\n' 
  },
  { 
    id: 'swot', 
    name: 'SWOT Analysis', 
    description: 'Strengths, Weaknesses, etc.', 
    icon: PieChart, 
    category: 'Product & Business', 
    content: '# 📊 SWOT Analysis: [Subject]\n\n| **Strengths** (Internal) | **Weaknesses** (Internal) |\n| :--- | :--- |\n| - Strength 1<br>- Strength 2 | - Weakness 1<br>- Weakness 2 |\n\n| **Opportunities** (External) | **Threats** (External) |\n| :--- | :--- |\n| - Opportunity 1<br>- Opportunity 2 | - Threat 1<br>- Threat 2 |\n\n## Analysis & Strategy\n- How to use strengths to take advantage of opportunities?\n- ...\n' 
  },
  
  // Marketing & Content
  { 
    id: 'blog_post', 
    name: 'Blog Post', 
    description: 'Article structure', 
    icon: Newspaper, 
    category: 'Marketing & Content', 
    content: '# 📝 Blog Post: [Title]\n\n**Target Audience:** [Persona]\n**Keywords:** [List]\n**Slug:** /blog/[slug]\n\n## Introduction\nHook the reader. State the problem and the promise of a solution.\n\n## Key Point 1\nDetails, examples, and data.\n\n## Key Point 2\nDetails, examples, and data.\n\n## Conclusion\nSummarize key takeaways. Call to Action (CTA).\n' 
  },
  { 
    id: 'content_calendar', 
    name: 'Content Calendar', 
    description: 'Schedule for posts', 
    icon: Calendar, 
    category: 'Marketing & Content', 
    content: '# 📅 Content Calendar: [Month]\n\n| Date | Topic | Channel | Status | Owner |\n| --- | --- | --- | --- | --- |\n| 01/01 | New Year Post | Blog | Published | Alice |\n| 01/05 | Feature Launch | Twitter | Draft | Bob |\n| 01/10 | Tutorial Video | YouTube | Planned | Charlie |\n' 
  },
  { 
    id: 'newsletter', 
    name: 'Newsletter', 
    description: 'Email update format', 
    icon: Megaphone, 
    category: 'Marketing & Content', 
    content: '# 📰 Newsletter: [Subject Line]\n\n**Pre-header:** [Short summary]\n\n## 👋 Intro\nHi [Name],\n\nWelcome to this week\'s edition...\n\n## 🚀 Featured Content\n### Article Title\nDescription of the article.\n\n## 🛠️ Product Updates\n- Update 1\n- Update 2\n\n## 🔗 Interesting Links\n- [Link 1]\n- [Link 2]\n\nCheers,\n[Your Name]\n' 
  },
  { 
    id: 'persona', 
    name: 'User Persona', 
    description: 'Target audience profile', 
    icon: User, 
    category: 'Marketing & Content', 
    content: '# 🧑 User Persona: [Name]\n\n!Photo\n\n**Role:** [Job Title]\n**Age:** [Age Range]\n**Location:** [Location]\n\n## 🎯 Goals\n- Goal 1\n- Goal 2\n\n## 😫 Frustrations\n- Pain point 1\n- Pain point 2\n\n## 📝 Bio\nShort biography describing their background and daily life.\n\n## 💬 Quote\n"..."\n' 
  },
  
  // Personal
  { 
    id: 'resume', 
    name: 'Resume / CV', 
    description: 'Professional experience', 
    icon: Briefcase, 
    category: 'Personal', 
    content: '# 📄 [Your Name]\n\n[Email] | [Phone] | [LinkedIn] | [Portfolio]\n\n## 💼 Professional Experience\n\n### **[Job Title]** at [Company]\n*[Date Range]*\n- Achievement 1\n- Achievement 2\n\n### **[Job Title]** at [Company]\n*[Date Range]*\n- Achievement 1\n\n## 🎓 Education\n\n### **[Degree]** in [Field]\n*[University], [Year]*\n\n## 🛠️ Skills\n- **Languages:** JavaScript, Python...\n- **Tools:** Git, Docker...\n' 
  },
  { 
    id: 'cover_letter', 
    name: 'Cover Letter', 
    description: 'Job application letter', 
    icon: FileText, 
    category: 'Personal', 
    content: '# ✉️ Cover Letter\n\n[Your Name]\n[Your Address]\n[Your Email]\n\n[Date]\n\n[Hiring Manager Name]\n[Company Name]\n[Company Address]\n\nDear [Hiring Manager Name],\n\nI am writing to express my interest in the [Job Title] position at [Company Name]. With my background in [Field] and experience in [Skill], I am confident in my ability to contribute to your team.\n\n[Paragraph about specific relevant experience]\n\n[Paragraph about why you want to work for this specific company]\n\nThank you for your time and consideration. I look forward to the possibility of discussing my application with you.\n\nSincerely,\n\n[Your Name]\n' 
  },
  { 
    id: 'goals', 
    name: 'Personal Goals', 
    description: 'Short and long term goals', 
    icon: Target, 
    category: 'Personal', 
    content: '# 🥅 Personal Goals\n\n## 📅 Short Term (1-3 months)\n- [ ] Goal 1\n- [ ] Goal 2\n\n## 🗓️ Medium Term (3-12 months)\n- [ ] Goal 3\n\n## 🔭 Long Term (1 year+)\n- [ ] Goal 4\n\n## 🧠 Skills to Learn\n- Skill 1\n- Skill 2\n' 
  },
  { 
    id: 'habit_tracker', 
    name: 'Habit Tracker', 
    description: 'Daily habit checklist', 
    icon: CheckSquare, 
    category: 'Personal', 
    content: '# ✅ Habit Tracker: [Month]\n\n| Habit | Mon | Tue | Wed | Thu | Fri | Sat | Sun |\n| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |\n| 💧 Drink Water | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |\n| 📖 Read 30m | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |\n| 🏃 Exercise | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |\n| 🧘 Meditate | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |\n' 
  },
  { 
    id: 'reading_list', 
    name: 'Reading List', 
    description: 'Books to read', 
    icon: BookOpen, 
    category: 'Personal', 
    content: '# 📚 Reading List\n\n## 📖 Currently Reading\n- [ ] **[Title]** by [Author] (Page 50/300)\n\n## ⏭️ To Read\n- [ ] **[Title]** by [Author]\n- [ ] **[Title]** by [Author]\n\n## ✅ Finished\n- [x] **[Title]** by [Author] - ⭐⭐⭐⭐⭐\n' 
  },
  { 
    id: 'travel', 
    name: 'Travel Itinerary', 
    description: 'Trip planning', 
    icon: Globe, 
    category: 'Personal', 
    content: '# ✈️ Travel Itinerary: [Destination]\n\n**Dates:** [Start Date] - [End Date]\n**Accommodation:** [Hotel/Airbnb Name]\n\n## 🗓️ Day 1: [Date]\n- **Morning:** Arrive, Check-in\n- **Afternoon:** Visit [Place]\n- **Evening:** Dinner at [Restaurant]\n\n## 🗓️ Day 2: [Date]\n- **Morning:** ...\n\n## 🎒 Packing List\n- [ ] Passport\n- [ ] Charger\n- [ ] ...\n' 
  },
  { 
    id: 'recipe', 
    name: 'Recipe', 
    description: 'Cooking instructions', 
    icon: Utensils, 
    category: 'Personal', 
    content: '# 🍳 [Recipe Name]\n\n**Prep Time:** 15m\n**Cook Time:** 30m\n**Servings:** 4\n\n## 🥕 Ingredients\n- [ ] 1 cup ...\n- [ ] 2 tbsp ...\n\n## 👨‍🍳 Instructions\n1. Preheat oven to ...\n2. Mix ingredients ...\n3. Bake for ...\n\n## 📝 Notes\n- Optional: Add ...\n' 
  },
  { 
    id: 'workout', 
    name: 'Workout Log', 
    description: 'Exercise tracking', 
    icon: Dumbbell, 
    category: 'Personal', 
    content: '# 💪 Workout Log\n\n**Date:** [Date]\n**Focus:** Upper Body / Lower Body / Cardio\n\n| Exercise | Sets | Reps | Weight | Notes |\n| --- | --- | --- | --- | --- |\n| Bench Press | 3 | 10 | 135lbs | ... |\n| Squats | 3 | 8 | 185lbs | ... |\n\n## 🏃 Cardio\n- **Type:** Running\n- **Duration:** 20m\n- **Distance:** 2 miles\n' 
  },
  { 
    id: 'budget', 
    name: 'Budget Planner', 
    description: 'Income and expenses', 
    icon: Wallet, 
    category: 'Personal', 
    content: '# 💰 Budget Planner: [Month]\n\n## 💵 Income\n| Source | Amount |\n| --- | --- |\n| Salary | .00 |\n| Other | .00 |\n| **Total** | **.00** |\n\n## 💸 Expenses\n| Category | Budget | Actual | Diff |\n| --- | --- | --- | --- |\n| Rent | .00 | .00 | .00 |\n| Groceries | .00 | .00 | .00 |\n| **Total** | **.00** | **.00** | **.00** |\n\n## 🏦 Savings Goals\n- [ ] Emergency Fund: /\n' 
  },
  
  // Academic
  { 
    id: 'lesson_plan', 
    name: 'Lesson Plan', 
    description: 'Teaching outline', 
    icon: BookOpen, 
    category: 'Academic', 
    content: '# 🍎 Lesson Plan: [Topic]\n\n**Date:** [Date]\n**Grade Level:** [Grade]\n**Subject:** [Subject]\n**Duration:** [Time]\n\n## 🎯 Objectives\nStudents will be able to:\n1. ...\n2. ...\n\n## 🛠️ Materials Needed\n- ...\n\n## 📝 Procedure\n1. **Introduction (5m):** Hook/Warm-up\n2. **Direct Instruction (15m):** ...\n3. **Guided Practice (15m):** ...\n4. **Independent Practice (15m):** ...\n5. **Closure (5m):** Exit ticket\n\n## 📊 Assessment\n- ...\n' 
  },
  { 
    id: 'syllabus', 
    name: 'Course Syllabus', 
    description: 'Course overview', 
    icon: GraduationCap, 
    category: 'Academic', 
    content: '# 🎓 Course Syllabus: [Course Name]\n\n**Instructor:** [Name]\n**Email:** [Email]\n**Office Hours:** [Time/Location]\n\n## 📖 Course Description\nBrief overview of the course content and goals.\n\n## 📚 Required Materials\n- Textbook: ...\n\n## 🗓️ Schedule\n| Week | Topic | Reading | Assignment |\n| --- | --- | --- | --- |\n| 1 | Intro | Ch 1 | ... |\n| 2 | ... | ... | ... |\n\n## ⚖️ Grading Policy\n- Exams: 40%\n- Homework: 30%\n- Projects: 30%\n' 
  },
  { 
    id: 'lab_report', 
    name: 'Lab Report', 
    description: 'Scientific experiment', 
    icon: FlaskConical, 
    category: 'Academic', 
    content: '# 🧪 Lab Report: [Title]\n\n**Name:** [Name]\n**Date:** [Date]\n\n## Abstract\nBrief summary of the experiment and findings.\n\n## Introduction\nBackground information and hypothesis.\n\n## Methodology\nMaterials and procedure used.\n\n## Results\nData collected (tables, graphs, observations).\n\n## Discussion\nAnalysis of results, sources of error, and conclusion.\n' 
  },
  { 
    id: 'thesis', 
    name: 'Thesis Proposal', 
    description: 'Research proposal', 
    icon: FileText, 
    category: 'Academic', 
    content: '# 📜 Thesis Proposal\n\n**Title:** [Working Title]\n**Student:** [Name]\n**Advisor:** [Name]\n\n## 1. Introduction\nContext and background of the study.\n\n## 2. Problem Statement\nWhat is the specific problem being addressed?\n\n## 3. Research Questions\n1. ...\n2. ...\n\n## 4. Literature Review\nSummary of existing research.\n\n## 5. Methodology\nHow will the research be conducted?\n\n## 6. Significance\nWhy does this research matter?\n' 
  },
  
  // Creative
  { 
    id: 'screenplay', 
    name: 'Screenplay', 
    description: 'Script format', 
    icon: Clapperboard, 
    category: 'Creative', 
    content: '# 🎬 Screenplay: [Title]\n\n**INT. COFFEE SHOP - DAY**\n\nThe shop is buzzing. JOHN (30s) sits alone, staring at a laptop.\n\nSARAH (30s) enters, shaking off an umbrella.\n\n<center>SARAH</center>\n<center>(breathless)</center>\n<center>You wouldn\'t believe the traffic.</center>\n\nJohn looks up, smiling.\n\n<center>JOHN</center>\n<center>I ordered you a latte.</center>\n' 
  },
  { 
    id: 'novel_outline', 
    name: 'Novel Outline', 
    description: 'Story structure', 
    icon: Book, 
    category: 'Creative', 
    content: '# 📖 Novel Outline: [Title]\n\n**Genre:** [Genre]\n**Theme:** [Theme]\n\n## 🎭 Characters\n- **Protagonist:** ...\n- **Antagonist:** ...\n\n## 🏔️ Plot Structure\n### Act I: The Setup\n- **Inciting Incident:** ...\n- **Plot Point 1:** ...\n\n### Act II: The Confrontation\n- **Midpoint:** ...\n- **Plot Point 2:** ...\n\n### Act III: The Resolution\n- **Climax:** ...\n- **Resolution:** ...\n' 
  },
  { 
    id: 'character', 
    name: 'Character Sheet', 
    description: 'Character details', 
    icon: User, 
    category: 'Creative', 
    content: '# 🎭 Character Sheet: [Name]\n\n**Role:** Protagonist / Antagonist\n**Age:** ...\n**Occupation:** ...\n\n## 🖼️ Appearance\n- **Height/Build:** ...\n- **Hair/Eyes:** ...\n- **Distinguishing Marks:** ...\n\n## 🧠 Personality\n- **Traits:** ...\n- **Flaws:** ...\n- **Fears:** ...\n\n## 📜 Backstory\nKey events that shaped them.\n\n## 🎯 Motivation\nWhat do they want most?\n' 
  },
  { 
    id: 'world_building', 
    name: 'World Building', 
    description: 'Setting details', 
    icon: Globe, 
    category: 'Creative', 
    content: '# 🌍 World Building: [World Name]\n\n## 🗺️ Geography\n- **Climate:** ...\n- **Major Locations:** ...\n\n## 🏛️ Society & Culture\n- **Government:** ...\n- **Religion:** ...\n- **Customs:** ...\n\n## 🔮 Magic / Technology\n- **Rules:** ...\n- **Limitations:** ...\n\n## 📜 History\n- **Key Events:** ...\n' 
  },
  
  // Misc
  { 
    id: 'shopping_list', 
    name: 'Shopping List', 
    description: 'Items to buy', 
    icon: ShoppingCart, 
    category: 'Misc', 
    content: '# 🛒 Shopping List\n\n## 🥦 Produce\n- [ ] ...\n\n## 🥩 Meat & Dairy\n- [ ] ...\n\n## 🥫 Pantry\n- [ ] ...\n\n## 🏠 Household\n- [ ] ...\n' 
  },
  { 
    id: 'todo', 
    name: 'To-Do List', 
    description: 'Simple task list', 
    icon: ListTodo, 
    category: 'Misc', 
    content: '# ☑️ To-Do List\n\n## 🔥 High Priority\n- [ ] Task 1\n\n## 📅 Today\n- [ ] Task 2\n- [ ] Task 3\n\n## 🔜 Upcoming\n- [ ] Task 4\n' 
  },
  { 
    id: 'gift_ideas', 
    name: 'Gift Ideas', 
    description: 'Presents for others', 
    icon: Gift, 
    category: 'Misc', 
    content: '# 🎁 Gift Ideas\n\n| Person | Idea | Price | Link | Status |\n| --- | --- | --- | --- | --- |\n| Mom | Scarf |  | [Link] | Bought |\n| Dad | Book |  | [Link] | Idea |\n' 
  },
  { 
    id: 'music_playlist', 
    name: 'Playlist', 
    description: 'Song list', 
    icon: Music, 
    category: 'Misc', 
    content: '# 🎵 Playlist: [Name]\n\n**Vibe:** Chill / Workout / Party\n\n1. **Song Title** - Artist\n2. **Song Title** - Artist\n3. ...\n' 
  },
  { 
    id: 'movie_list', 
    name: 'Watch List', 
    description: 'Movies/TV to watch', 
    icon: Clapperboard, 
    category: 'Misc', 
    content: '# 🍿 Watch List\n\n## 🎬 Movies\n- [ ] **Title** (Year) - Genre\n\n## 📺 TV Shows\n- [ ] **Title** (Season X)\n\n## ⭐ Favorites\n- Title\n' 
  },
  { 
    id: 'bucket_list', 
    name: 'Bucket List', 
    description: 'Life goals', 
    icon: Rocket, 
    category: 'Misc', 
    content: '# 🌠 Bucket List\n\n## ✈️ Travel\n- [ ] Visit Japan\n- [ ] See Northern Lights\n\n## 🎨 Skills\n- [ ] Learn to play guitar\n\n## 🏃 Adventure\n- [ ] Go skydiving\n' 
  },
  { 
    id: 'password_log', 
    name: 'Password Hint', 
    description: 'Hints (not passwords)', 
    icon: Shield, 
    category: 'Misc', 
    content: '# 🔐 Password Hints\n\n> **Note:** Never store actual passwords here. Use a password manager.\n\n| Site | Username | Email Used | Hint |\n| --- | --- | --- | --- |\n| Google | user123 | ... | First pet name |\n| Amazon | ... | ... | ... |\n' 
  },
  { 
    id: 'coffee_log', 
    name: 'Coffee Log', 
    description: 'Tasting notes', 
    icon: Coffee, 
    category: 'Misc', 
    content: '# ☕ Coffee Log\n\n**Date:** [Date]\n**Bean:** [Name/Origin]\n**Roaster:** [Roaster Name]\n**Roast Level:** Light / Medium / Dark\n\n## ⚗️ Brew Method\n- **Method:** V60 / French Press / Espresso\n- **Ratio:** 1:16\n- **Grind:** ...\n\n## 👅 Tasting Notes\n- Aroma: ...\n- Flavor: ...\n- Acidity: ...\n- Body: ...\n\n**Rating:** ⭐⭐⭐⭐\n' 
  },
  { 
    id: 'photo_log', 
    name: 'Photography Log', 
    description: 'Shot settings', 
    icon: Camera, 
    category: 'Misc', 
    content: '# 📷 Photo Log\n\n**Date:** [Date]\n**Location:** [Location]\n**Gear:** [Camera + Lens]\n\n| Subject | ISO | Aperture | Shutter | Notes |\n| --- | --- | --- | --- | --- |\n| Sunset | 100 | f/8 | 1/125 | Tripod used |\n| Portrait | 400 | f/1.8 | 1/500 | ... |\n' 
  },
  { 
    id: 'inventory', 
    name: 'Home Inventory', 
    description: 'Valuables list', 
    icon: Box, 
    category: 'Misc', 
    content: '# 📦 Home Inventory\n\n| Item | Room | Serial # | Value | Purchase Date | Warranty |\n| --- | --- | --- | --- | --- | --- |\n| Laptop | Office | XYZ123 |  | 2023-01-01 | Yes |\n| TV | Living | ... | ... | ... | ... |\n' 
  },
  {
    id: 'memo',
    name: 'Internal Memo',
    description: 'Official internal communication',
    icon: StickyNote,
    category: 'General',
    content: '# 📝 Internal Memo\n\n**To:** [Recipients]\n**From:** [Sender]\n**Date:** [Date]\n**Subject:** [Subject]\n\n---\n\n## 📢 Announcement\n[Opening statement stating the purpose of the memo]\n\n## 🔍 Details\n[Detailed explanation of the situation, policy change, or news]\n\n## 👣 Next Steps\n[What needs to happen next, or what action is required from recipients]\n\n## 📞 Contact\nIf you have any questions, please contact [Name/Department].\n'
  },
  {
    id: 'database_schema',
    name: 'Database Schema',
    description: 'Table definitions and relationships',
    icon: Database,
    category: 'Software Engineering',
    content: '# 🗄️ Database Schema: [Database Name]\n\n## 📋 Overview\nDescription of the database purpose and scope.\n\n## 📊 Tables\n\n### `users`\nStores user account information.\n\n| Column | Type | Constraints | Description |\n| --- | --- | --- | --- |\n| `id` | UUID | PK | Unique identifier |\n| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email address |\n| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |\n\n### `posts`\nStores user generated posts.\n\n| Column | Type | Constraints | Description |\n| --- | --- | --- | --- |\n| `id` | UUID | PK | Unique identifier |\n| `user_id` | UUID | FK -> users.id | Author of the post |\n| `content` | TEXT | | Post body |\n\n## 🔗 Relationships\n- `users.id` 1:N `posts.user_id`\n'
  },
  {
    id: 'deployment_checklist',
    name: 'Deployment Checklist',
    description: 'Steps for production release',
    icon: Rocket,
    category: 'Software Engineering',
    content: '# 🚀 Deployment Checklist: [Release Version]\n\n**Date:** [Date]\n**Owner:** [Name]\n\n## 🛑 Pre-Deployment\n- [ ] Code freeze enforced\n- [ ] All tests passed (Unit, Integration, E2E)\n- [ ] Database migrations reviewed\n- [ ] Backups created\n\n## 🚢 Deployment\n- [ ] Deploy to Staging\n- [ ] Verify Staging\n- [ ] Deploy to Production\n- [ ] Run smoke tests\n\n## ✅ Post-Deployment\n- [ ] Monitor error logs (Sentry/Datadog)\n- [ ] Monitor performance metrics\n- [ ] Notify stakeholders\n\n## 🔙 Rollback Plan\nIn case of failure:\n1. Revert to version [Previous Version]\n2. Restore database if necessary\n'
  },
  {
    id: 'lean_canvas',
    name: 'Lean Canvas',
    description: '1-page business plan',
    icon: FileSpreadsheet,
    category: 'Product & Business',
    content: '# 📊 Lean Canvas: [Product Name]\n\n| Problem | Solution | Unique Value Prop | Unfair Advantage | Customer Segments |\n| :--- | :--- | :--- | :--- | :--- |\n| Top 3 problems | Top 3 features | Single clear message | Can\'t be easily copied | Target customers |\n| 1. ... | 1. ... | ... | ... | 1. ... |\n| 2. ... | 2. ... | | | 2. ... |\n| 3. ... | 3. ... | | | |\n\n| **Key Metrics** | **Channels** |\n| :--- | :--- |\n| Key activities to measure | Path to customers |\n| - ... | - ... |\n\n| **Cost Structure** | **Revenue Streams** |\n| :--- | :--- |\n| Customer acquisition, distribution, hosting... | Revenue model, life time value... |\n| - ... | - ... |\n'
  },
  {
    id: 'competitor_analysis',
    name: 'Competitor Analysis',
    description: 'Compare against market rivals',
    icon: Target,
    category: 'Product & Business',
    content: '# 🆚 Competitor Analysis\n\n## 🏢 Competitor A\n**Name:** [Name]\n**Website:** [Link]\n\n### Strengths\n- ...\n\n### Weaknesses\n- ...\n\n### Pricing\n- ...\n\n## 🏢 Competitor B\n**Name:** [Name]\n**Website:** [Link]\n\n### Strengths\n- ...\n\n### Weaknesses\n- ...\n\n### Pricing\n- ...\n\n## 📉 Comparison Matrix\n| Feature | Us | Comp A | Comp B |\n| --- | :-: | :-: | :-: |\n| Feature 1 | ✅ | ❌ | ✅ |\n| Feature 2 | ✅ | ✅ | ❌ |\n| Price | $$ | $$$ | $ |\n'
  },
  {
    id: 'email_campaign',
    name: 'Email Campaign',
    description: 'Drip sequence draft',
    icon: Mail,
    category: 'Marketing & Content',
    content: '# 📧 Email Campaign: [Campaign Name]\n\n**Goal:** [e.g. Onboarding, Sales]\n**Audience:** [Segment]\n\n## 📨 Email 1: Welcome / Intro\n**Subject:** Welcome to [Product]!\n**Send Time:** Immediately\n\nHi [Name],\n\nThanks for signing up...\n\n[CTA]\n\n## 📨 Email 2: Value Add\n**Subject:** Did you know you can...?\n**Send Time:** Day 3\n\nHi [Name],\n\nHere is a tip to get the most out of...\n\n[CTA]\n\n## 📨 Email 3: Soft Sell\n**Subject:** Ready to upgrade?\n**Send Time:** Day 7\n\nHi [Name],\n\nUnlock premium features...\n\n[CTA]\n'
  },
  {
    id: 'social_media_plan',
    name: 'Social Media Plan',
    description: 'Weekly social content',
    icon: Megaphone,
    category: 'Marketing & Content',
    content: '# 📱 Social Media Plan: [Week of Date]\n\n## 🗓️ Monday\n- **Platform:** Twitter/X\n- **Topic:** Industry News\n- **Copy:** Did you hear about... #tech #news\n- **Image/Link:** [Link]\n\n## 🗓️ Wednesday\n- **Platform:** LinkedIn\n- **Topic:** Thought Leadership\n- **Copy:** I\'ve been thinking about...\n- **Image/Link:** [Link]\n\n## 🗓️ Friday\n- **Platform:** Instagram\n- **Topic:** Behind the Scenes\n- **Copy:** Happy Friday from the team!\n- **Image/Link:** [Photo]\n'
  },
  {
    id: 'meal_plan',
    name: 'Meal Plan',
    description: 'Weekly food preparation',
    icon: Utensils,
    category: 'Personal',
    content: '# 🥗 Weekly Meal Plan\n\n| Day | Breakfast | Lunch | Dinner | Snacks |\n| --- | --- | --- | --- | --- |\n| **Mon** | Oatmeal | Salad | Pasta | Fruit |\n| **Tue** | Eggs | Sandwich | Stir Fry | Yogurt |\n| **Wed** | ... | ... | ... | ... |\n| **Thu** | ... | ... | ... | ... |\n| **Fri** | ... | ... | ... | ... |\n| **Sat** | ... | ... | ... | ... |\n| **Sun** | ... | ... | ... | ... |\n\n## 🛒 Grocery List\n- [ ] ...\n- [ ] ...\n'
  },
  {
    id: 'finance_tracker',
    name: 'Finance Tracker',
    description: 'Monthly income & expenses',
    icon: Wallet,
    category: 'Personal',
    content: '# 💵 Finance Tracker: [Month]\n\n## 💰 Income\n- Salary: $0.00\n- Freelance: $0.00\n- **Total:** $0.00\n\n## 📉 Fixed Expenses\n- Rent/Mortgage: $0.00\n- Utilities: $0.00\n- Internet: $0.00\n\n## 💳 Variable Expenses\n- Groceries: $0.00\n- Entertainment: $0.00\n- Dining Out: $0.00\n\n## 🏦 Savings\n- Emergency Fund: $0.00\n- Investments: $0.00\n\n**Net Total:** $0.00\n'
  },
  {
    id: 'bibliography',
    name: 'Bibliography',
    description: 'References list',
    icon: Book,
    category: 'Academic',
    content: '# 📚 Bibliography\n\n## 📖 Books\n- Author, A. A. (Year). *Title of work*. Publisher.\n- ...\n\n## 📰 Articles\n- Author, B. B. (Year). Title of article. *Title of Periodical*, volume number(issue number), pages.\n- ...\n\n## 🌐 Websites\n- Author, C. C. (Year, Month Date). Title of page. Site Name. URL\n- ...\n'
  },
  {
    id: 'lecture_notes',
    name: 'Lecture Notes',
    description: 'Class notes structure',
    icon: BookOpen,
    category: 'Academic',
    content: '# 🎓 Lecture Notes: [Subject]\n\n**Topic:** [Topic Name]\n**Date:** [Date]\n**Professor:** [Name]\n\n## 🔑 Key Concepts\n- Concept 1\n- Concept 2\n\n## 📝 Detailed Notes\n### Subtopic 1\nNotes here...\n\n### Subtopic 2\nNotes here...\n\n## ❓ Questions / Confusion\n- What did the professor mean by...?\n\n## 📚 Summary\nBrief summary of the lecture.\n'
  },
  {
    id: 'poem',
    name: 'Poem',
    description: 'Poetry format',
    icon: PenTool,
    category: 'Creative',
    content: '# 🖋️ [Poem Title]\n\n(Stanza 1)\nLine 1\nLine 2\nLine 3\nLine 4\n\n(Stanza 2)\nLine 1\nLine 2\nLine 3\nLine 4\n\n...\n'
  },
  {
    id: 'song_lyrics',
    name: 'Song Lyrics',
    description: 'Verse-chorus structure',
    icon: Music,
    category: 'Creative',
    content: '# 🎵 [Song Title]\n\n**Tempo:** [BPM]\n**Key:** [Key]\n\n## [Verse 1]\nLyrics here...\n\n## [Chorus]\nLyrics here...\n\n## [Verse 2]\nLyrics here...\n\n## [Chorus]\nLyrics here...\n\n## [Bridge]\nLyrics here...\n\n## [Chorus]\nLyrics here...\n\n## [Outro]\nLyrics here...\n'
  },
  {
    id: 'video_script',
    name: 'Video Script',
    description: 'YouTube/Video content',
    icon: Video,
    category: 'Creative',
    content: '# 📹 Video Script: [Title]\n\n**Concept:** [Brief description]\n**Target Duration:** 10 min\n\n## 🎬 Intro (0:00 - 1:00)\n- **Visual:** Face to camera\n- **Audio:** Hook the viewer. "In this video, we\'re going to..."\n\n## 🥩 Body Paragraph 1 (1:00 - 4:00)\n- **Visual:** B-roll of product\n- **Audio:** Explain point 1...\n\n## 🥩 Body Paragraph 2 (4:00 - 8:00)\n- **Visual:** Screen recording\n- **Audio:** Walkthrough...\n\n## 🏁 Outro (8:00 - 10:00)\n- **Visual:** Face to camera\n- **Audio:** Summary and CTA. "Don\'t forget to like and subscribe!"\n'
  },
  {
    id: 'vehicle_log',
    name: 'Vehicle Maintenance',
    description: 'Service history',
    icon: Wrench,
    category: 'Misc',
    content: '# 🚗 Vehicle Maintenance Log\n\n**Vehicle:** [Year Make Model]\n**VIN:** [VIN Number]\n\n| Date | Mileage | Service Performed | Shop/Mechanic | Cost | Notes |\n| --- | --- | --- | --- | --- | --- |\n| 2023-01-01 | 50,000 | Oil Change | Jiffy Lube | $50 | Synthetic |\n| 2023-06-01 | 55,000 | Tire Rotation | Discount Tire | $0 | Free rotation |\n'
  },
  {
    id: 'shipping_log',
    name: 'Shipping Log',
    description: 'Track packages',
    icon: Truck,
    category: 'Misc',
    content: '# 📦 Shipping Log\n\n| Item | Carrier | Tracking Number | Expected Delivery | Status |\n| --- | --- | --- | --- | --- |\n| Laptop | UPS | 1Z999... | 2023-10-30 | In Transit |\n| Books | USPS | 9400... | 2023-11-01 | Delivered |\n'
  },
];

const CUSTOM_TEMPLATES_KEY = 'custom_templates';
const RECENT_TEMPLATES_KEY = 'recent_templates';
const FAVORITE_TEMPLATES_KEY = 'favorite_templates';

export const getRecentTemplates = (): Template[] => {
  try {
    const recentIds = JSON.parse(localStorage.getItem(RECENT_TEMPLATES_KEY) || '[]');
    const allTemplates = getAllTemplates();
    return recentIds
      .map((id: string) => allTemplates.find((t) => t.id === id))
      .filter((t: Template | undefined): t is Template => !!t);
  } catch (error) {
    console.error('Failed to load recent templates', error);
    return [];
  }
};

export const addToRecentTemplates = (id: string) => {
  try {
    let recentIds = JSON.parse(localStorage.getItem(RECENT_TEMPLATES_KEY) || '[]');
    recentIds = [id, ...recentIds.filter((existingId: string) => existingId !== id)].slice(0, 3);
    localStorage.setItem(RECENT_TEMPLATES_KEY, JSON.stringify(recentIds));
  } catch (error) {
    console.error('Failed to save recent template', error);
  }
};

export const getCustomTemplates = (): Template[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Re-attach a default icon for custom templates since functions can't be serialized
    return parsed.map((t: any) => ({ ...t, icon: FileText, isCustom: true }));
  } catch (error) {
    console.error('Failed to load custom templates', error);
    return [];
  }
};

export const saveCustomTemplate = (template: Omit<Template, 'icon' | 'isCustom'>): Template[] => {
  const current = getCustomTemplates();
  // We don't store the icon component in localStorage
  const newTemplate = { ...template, isCustom: true, icon: FileText };
  const updated = [...current, newTemplate];
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteCustomTemplate = (id: string): Template[] => {
  const current = getCustomTemplates();
  const updated = current.filter((t) => t.id !== id);
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
  return updated;
};

export const getFavoriteIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_TEMPLATES_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getFavoriteTemplates = (): Template[] => {
  const favoriteIds = getFavoriteIds();
  const allTemplates = getAllTemplates();
  return favoriteIds
    .map((id) => allTemplates.find((t) => t.id === id))
    .filter((t): t is Template => !!t);
};

export const toggleFavoriteTemplate = (id: string) => {
  try {
    const favoriteIds = getFavoriteIds();
    const index = favoriteIds.indexOf(id);
    let newFavorites;
    if (index === -1) {
      newFavorites = [...favoriteIds, id];
    } else {
      newFavorites = favoriteIds.filter((favId) => favId !== id);
    }
    localStorage.setItem(FAVORITE_TEMPLATES_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error('Failed to toggle favorite template', error);
  }
};

export const getAllTemplates = (): Template[] => [...DEFAULT_TEMPLATES, ...getCustomTemplates()];
