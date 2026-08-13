# AI Resume Analyzer

An AI-powered resume analysis and job discovery platform that helps users understand their resume, manage multiple resumes, discover relevant jobs, and receive personalized job recommendations based on the skills extracted from their active resume.

## ✨ Overview

AI Resume Analyzer combines resume parsing, AI-based analysis, authenticated user accounts, resume management, and live job-search capabilities in a single web application.

The application supports:

- Secure authentication with Clerk
- Resume upload and management
- Multiple resumes per user
- Active-resume selection
- AI-powered resume analysis
- Extracted skills with confidence scores
- Resume skill visualization and analysis
- Live job search through the Adzuna API
- Resume-based personalized job matching
- Job recommendations ranked by resume relevance
- Job filtering/search on the job listing pages
- External job application links
- MySQL persistence through Spring Data JPA
- Protected backend APIs using Spring Security and JWT/OAuth2 resource-server support

## 🏗️ Architecture

```text
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
                 │   MySQL     │  │ External Services │
                 │  Database   │  │                  │
                 └─────────────┘  │ Gemini / AI      │
                                  │ Adzuna Jobs      │
                                  │ Clerk Auth       │
                                  └──────────────────┘
```

## 🛠️ Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Material UI (MUI)
- Clerk React SDK
- Axios / Fetch API

### Backend

- Java 21
- Spring Boot 4.1
- Spring Web MVC
- Spring Data JPA
- Spring Security
- OAuth2 Resource Server / JWT
- Spring Validation
- Spring Actuator
- MySQL Connector/J
- Google GenAI SDK
- Apache PDFBox

### External Services

- **Clerk** — authentication and user identity
- **Google Gemini** — AI-assisted resume analysis
- **Adzuna** — live job search and job listings
- **MySQL** — application data persistence

## 📁 Project Structure

```text
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
└── README.md
```

## 🚀 Main Features

### 1. Authentication

Users authenticate through Clerk. Protected frontend routes send the authenticated token to the Spring Boot backend, where secured APIs validate the request.

### 2. Resume Management

Users can:

- Upload resumes
- View uploaded resumes
- Download resumes
- Delete resumes
- Select one resume as the active resume
- See clearly which resume is currently active

The active resume is important because it is used as the source for personalized job matching and recommendations.

### 3. AI Resume Analysis

Uploaded resumes can be processed and analyzed to extract useful information such as:

- Skills
- Skill confidence
- Resume-related insights
- Structured resume information used by other application features

PDF processing is supported through Apache PDFBox, while the backend includes the Google GenAI SDK for AI functionality.

### 4. Live Job Matches

The Job Matches page uses the active resume to identify strong skills and searches the **Adzuna API** for live jobs.

The current flow is:

```text
Active Resume
      ↓
Resume Skills + Confidence
      ↓
Select strongest skills
      ↓
Search Adzuna for each skill
      ↓
Remove duplicate jobs
      ↓
Display live job matches
```

The personalized Adzuna jobs are constructed from the external API response and are not dependent on pre-populated database jobs.

### 5. Job Recommendations

The recommendation feature uses the user's active resume and ranks live jobs according to how closely their job title and description match the candidate's resume skills.

A simplified flow is:

```text
Active Resume
      ↓
Candidate Skills
      ↓
Live Adzuna Jobs
      ↓
Skill/Text Matching
      ↓
Match Score
      ↓
Ranked Recommendations
```

The recommendation result includes information such as:

- Job title
- Company
- Location
- Salary when available
- Job type
- Match score
- Match level
- Number of matched skills

### 6. Job Search and Filtering

The job listing interface allows users to search/filter jobs when they want to explore opportunities beyond the automatically matched results.

### 7. External Applications

Jobs returned by Adzuna contain an external redirect URL. Users can use the application to view the job and continue to the external job/application page.

## 🗄️ Database

The backend uses MySQL with Spring Data JPA.

Core application concepts include:

- Users
- Resumes
- Skills
- Resume-skill relationships
- Jobs
- Job-skill relationships
- Recommendations/job matching data

Resume skills are stored with confidence information, allowing the application to prioritize stronger skills when searching for personalized jobs.

## 🔐 Environment Configuration

Do **not** commit API keys, secrets, database passwords, or Clerk credentials to GitHub.

The application requires environment/configuration values for services such as:

- MySQL connection
- Clerk authentication
- Google Gemini / GenAI
- Adzuna application ID
- Adzuna application key

For example, the Adzuna configuration reads:

```text
ADZUNA_APP_ID
ADZUNA_APP_KEY
```

Use your own local environment/configuration values when running the project.

## ▶️ Running the Project Locally

### Prerequisites

Install:

- Java 21
- Maven (optional because the repository includes the Maven wrapper)
- Node.js and npm
- MySQL
- A Clerk application
- A Google Gemini/GenAI API key
- An Adzuna API account and credentials

### 1. Clone the repository

```bash
git clone https://github.com/dipankar2002/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### 2. Configure MySQL

Create the database used by the backend and configure the Spring datasource with your local MySQL credentials.

Example:

```sql
CREATE DATABASE ai_resume_analyzer;
```

Use the database name/configuration expected by your local backend configuration.

### 3. Configure backend secrets

Set the required environment/configuration values for:

```text
MySQL
Clerk JWT / authentication
Google Gemini / GenAI
ADZUNA_APP_ID
ADZUNA_APP_KEY
```

Never place real secrets directly in source code.

### 4. Start the backend

```bash
cd Backend
./mvnw spring-boot:run
```

The backend runs on the configured Spring Boot port, which is `8080` in the current local development setup.

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal.

## 🧪 Build Verification

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd Backend
./mvnw clean compile
```

The current `main` branch was verified during development with successful frontend and backend builds.

## 🔌 Important API Areas

The backend exposes REST APIs for major application features, including:

```text
/api/resumes
/api/jobs
/api/adzuna
/api/recommendations
```

Examples of functionality include:

```text
GET  /api/resumes/me
PUT  /api/resumes/me/active/{resumeId}
GET  /api/resumes/{resumeId}/skills
GET  /api/jobs/live
GET  /api/jobs/live/personalized
GET  /api/recommendations/me
```

Most user-specific endpoints require authentication.

## 🔄 Job Data: Database vs Live API

The project uses two different job-data flows.

### Live personalized jobs

Personalized Job Matches and live recommendations use the **Adzuna API**. These jobs are fetched dynamically according to the active resume's skills.

### Imported/database jobs

The backend also contains functionality for importing Adzuna jobs into the application's `jobs` table. Imported jobs can therefore exist in MySQL separately from the live personalized results.

This separation allows the application to support both external live job discovery and persistent application job data.

## 🔒 Security Notes

- Keep Clerk secrets private.
- Keep Gemini/GenAI API keys private.
- Keep Adzuna credentials private.
- Keep MySQL credentials private.
- Do not commit `.env` files containing secrets.
- Do not expose backend API credentials in frontend source code.

## 📌 Current Project Status

The current `main` branch contains the completed development flow for:

- Authentication
- Resume upload and management
- Active resume selection
- AI resume analysis
- Resume skill extraction
- Live Adzuna job matching
- Resume-based job recommendations
- Job search/filtering
- External job application redirection

## 👥 Contributors

Developed as a Computer Science project by the project team.

## 📄 License

This project is currently maintained as an academic/project repository. Add an explicit open-source license here if the project is later released under one.
