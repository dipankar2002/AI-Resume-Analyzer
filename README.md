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