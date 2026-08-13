# AI Resume Analyzer

An AI-powered resume analysis and job discovery platform that helps users understand their resumes, manage multiple resumes, discover relevant jobs, and receive personalized job recommendations based on the skills extracted from their active resume.

---

## ✨ Overview

AI Resume Analyzer combines resume parsing, AI-based analysis, authenticated user accounts, resume management, and live job-search capabilities in a single web application.

The application supports:

- Secure authentication with Clerk
- Resume upload and management
- Multiple resumes per user
- Active-resume selection
- AI-powered resume analysis
- Skill extraction with confidence scores
- Resume skill visualization and analysis
- Live job search through the Adzuna API
- Resume-based personalized job matching
- Job recommendations ranked according to resume relevance
- Job search and filtering
- External job application links
- MySQL persistence through Spring Data JPA
- Protected backend APIs using Spring Security and JWT/OAuth2 resource-server support

---

## 🔄 Application Workflow

```text
Register / Login
       ↓
Upload Resume
       ↓
AI Resume Analysis
       ↓
Extract Resume Skills
       ↓
Select Active Resume
       ↓
       ├───────────────────┐
       ↓                   ↓
  Job Matches        Recommendations
       ↓                   ↓
  Live Adzuna          Live Adzuna
       ↓                   ↓
       └─────────┬─────────┘
                 ↓
          View Job Details
                 ↓
       External Job Application

The active resume acts as the central input for personalized job discovery.

The skills extracted from the active resume are used to search for relevant live jobs and calculate recommendation scores.

🏗️ Architecture
                    ┌──────────────────────┐
                    │      React + Vite    │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                         REST / JSON
                               │
                    ┌──────────▼───────────┐
                    │ Spring Boot Backend  │
                    │ REST Controllers     │
                    │ Services             │
                    │ Spring Security      │
                    └───────┬───────┬──────┘
                            │       │
                 ┌──────────▼──┐  ┌─▼────────────────┐
                 │    MySQL    │  │ External Services │
                 │   Database  │  │                  │
                 └─────────────┘  │ Google Gemini    │
                                  │ Adzuna Jobs      │
                                  │ Clerk Auth       │
                                  └──────────────────┘
🛠️ Technology Stack
Frontend
React 19
Vite
React Router
Material UI (MUI)
Clerk React SDK
Axios
Fetch API
Backend
Java 21
Spring Boot
Spring Web MVC
Spring Data JPA
Spring Security
OAuth2 Resource Server / JWT
Spring Validation
Spring Actuator
MySQL Connector/J
Google GenAI SDK
Apache PDFBox
External Services
Clerk — authentication and user identity
Google Gemini / Google GenAI — AI-assisted resume analysis
Adzuna — live job search and job listings
MySQL — application data persistence
📁 Project Structure
AI-Resume-Analyzer/
│
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/resumeanalyzer/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── repo/
│   │   │   │   └── service/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── package.json
│   └── vite.config.*
│
├── .env.example
├── .gitignore
└── README.md
🚀 Main Features
1. Authentication

Users authenticate through Clerk.

Protected frontend routes send the authenticated token to the Spring Boot backend, where secured APIs validate the request.

The application supports authenticated user-specific operations such as:

Resume management
Resume analysis
Active resume selection
Personalized job matching
Job recommendations
2. Resume Management

Users can:

Upload resumes
View uploaded resumes
Download resumes
Delete resumes
Manage multiple resumes
Select one resume as the active resume
Clearly identify which resume is currently active

The active resume is important because it is used as the source for personalized job matching and recommendations.

3. AI Resume Analysis

Uploaded resumes can be processed and analyzed to extract useful information such as:

Skills
Skill confidence scores
Resume-related insights
Structured resume information

PDF resume processing is supported through Apache PDFBox.

The backend also integrates Google Gemini / Google GenAI for AI-assisted resume analysis.

4. Live Job Matches

The Job Matches page uses the user's active resume to identify strong skills and searches the Adzuna API for live jobs.

The current flow is:

Active Resume
      ↓
Resume Skills + Confidence
      ↓
Select Strongest Skills
      ↓
Search Adzuna for Each Skill
      ↓
Remove Duplicate Jobs
      ↓
Display Live Job Matches

The personalized job results are generated dynamically from the Adzuna API.

They do not depend on pre-populated database jobs.

5. Job Recommendations

The Job Recommendations feature uses the user's active resume and searches for live jobs through the Adzuna API.

The returned jobs are then ranked according to how closely their job title and description match the candidate's resume skills.

The flow is:

Active Resume
      ↓
Candidate Skills
      ↓
Live Adzuna Jobs
      ↓
Skill / Text Matching
      ↓
Match Score
      ↓
Ranked Recommendations

Recommendation results include information such as:

Job title
Company
Location
Salary when available
Job type
Match score
Match level
Number of matched skills
Recommendation Levels

Jobs can be classified into different match levels based on their calculated score:

80% - 100%  → Excellent Match
60% - 79%   → Good Match
40% - 59%   → Moderate Match
Below 40%   → Low Match

Unlike manually imported jobs stored in the database, personalized recommendation results are generated dynamically from live job-search results.

6. Job Search and Filtering

The job listing interface allows users to search and filter available job opportunities.

This provides an alternative when users want to explore opportunities beyond the automatically matched results.

Users can use the job listing interface to discover additional opportunities based on their preferred search criteria.

7. External Job Applications

Jobs returned by Adzuna contain an external redirect URL.

Users can:

View Job
   ↓
View Job Details
   ↓
Open External Job Listing
   ↓
Continue Application on External Website

The application does not process the external company's job application itself.

🗄️ Database

The backend uses MySQL with Spring Data JPA.

Core application concepts include:

Users
Resumes
Skills
Resume-skill relationships
Jobs
Job-skill relationships

Resume skills are stored with confidence information.

This allows the application to prioritize stronger skills when searching for personalized jobs.

Recommendations and Database

Job recommendations are calculated dynamically from:

Active Resume
      ↓
Resume Skills
      ↓
Live Adzuna Jobs
      ↓
Matching Algorithm
      ↓
Recommendation Score

A separate recommendation table is not required for the live recommendation results.

🔄 Job Data: Database vs Live API

The project uses two different job-data flows.

Live Personalized Jobs

Personalized Job Matches and Job Recommendations use the Adzuna API.

These jobs are fetched dynamically according to the active resume's skills.

Active Resume
      ↓
Resume Skills
      ↓
Adzuna API
      ↓
Live Jobs

These personalized results are not dependent on the application's jobs table.

Imported Database Jobs

The backend also contains functionality for importing Adzuna jobs into the application's jobs table.

Imported jobs can therefore exist persistently in MySQL.

Adzuna API
     ↓
Import Process
     ↓
MySQL jobs table

This means the project supports both:

Live external job discovery
Persistent application job data
🔐 Environment Configuration

The project uses environment variables for sensitive configuration such as database credentials and third-party API keys.

A .env.example file is provided in the repository as a reference for the required variables.

Setup

After cloning the repository, create your local environment configuration from the example file:

cp .env.example .env

Then replace the placeholder values with your own credentials.

The application requires configuration for services such as:

MySQL
Clerk authentication
Google Gemini / Google GenAI
Adzuna

For example:

ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

Use your own local credentials.

Important

Never commit your real .env file or API keys to GitHub.

The .env.example file should contain only placeholder values.

▶️ Running the Project Locally
Prerequisites

Install the following:

Java 21
Maven (optional because the repository includes the Maven wrapper)
Node.js
npm
MySQL
A Clerk application
A Google Gemini / GenAI API key
An Adzuna API account and credentials
1. Clone the Repository
git clone https://github.com/dipankar2002/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
2. Configure Environment Variables

Create your local environment configuration:

cp .env.example .env

Update the values in .env with your own credentials.

Do not commit .env.

3. Configure MySQL

Create the database used by the backend.

Example:

CREATE DATABASE ai_resume_analyzer;

Then configure the Spring datasource with your local MySQL credentials.

Use the database name and configuration expected by the backend configuration.

4. Start the Backend
cd Backend
./mvnw spring-boot:run

The backend runs on the configured Spring Boot port.

The current local development setup uses:

http://localhost:8080
5. Start the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Vite will display the local frontend URL in the terminal.

🧪 Build Verification
Frontend

From the frontend directory:

npm run build
Backend

From the Backend directory:

./mvnw clean compile

These commands verify that the frontend and backend compile successfully.

🔌 Important API Areas

The backend exposes REST APIs for major application features, including:

/api/resumes
/api/jobs
/api/recommendations

Examples include:

GET  /api/resumes/me
PUT  /api/resumes/me/active/{resumeId}
GET  /api/resumes/{resumeId}/skills

GET  /api/jobs/live
GET  /api/jobs/live/personalized

GET  /api/recommendations/me

Most user-specific endpoints require authentication.

🔒 Security Notes

The project uses authentication and protected backend APIs.

Important security practices:

Keep Clerk secrets private.
Keep Gemini / GenAI API keys private.
Keep Adzuna credentials private.
Keep MySQL credentials private.
Do not commit .env files containing secrets.
Do not expose backend API credentials in frontend source code.
Use .env.example only for placeholder configuration.
Do not commit production credentials to the repository.
📌 Current Project Status

The current main branch contains the implemented core application flow for:

Authentication
Resume upload and management
Multiple resume support
Active resume selection
AI resume analysis
Resume skill extraction
Skill confidence scoring
Live Adzuna job matching
Resume-based job recommendations
Job search and filtering
Job details
External job application redirection
MySQL persistence
Protected backend APIs
👥 Contributors

Developed as a Computer Science project by the project team.

📄 License

This project is currently maintained as an academic/project repository.

An explicit open-source license can be added if the project is later released under an open-source license.