# FCC Script Generator — AI-Powered Web Application

![Deploy Status](https://img.shields.io/badge/Status-Live-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-v18+-green) ![Express](https://img.shields.io/badge/Express-4.18-blue) ![Render](https://img.shields.io/badge/Deployed-Render-purple)

---

## ⚡️ 30 Second Summary

In today's tech-driven world, integrating AI APIs into real applications is one of the most in-demand skills across DevOps, backend development, and cloud engineering roles. This project demonstrates my ability to build, secure, and deploy a full-stack web application from scratch — not as a tutorial exercise, but as a live production tool actively used by a real business.

I built the FCC Script Generator for First Class Creators, a content marketing agency I run. The tool automates short-form video script generation using the Anthropic Claude AI API, replacing a manual process that previously took hours each month.

### What I built and learned:

- 🖥️ **Built a Node.js REST API** with Express.js to handle client requests and securely communicate with an external AI API
- 🔐 **Implemented secure API key management** using environment variables — a critical DevOps and security best practice used in every professional cloud environment
- ☁️ **Deployed a live web application** to Render cloud hosting, connected directly to GitHub for automatic redeployment on every code push
- 🔗 **Integrated a third-party AI API** (Anthropic Claude) with proper authentication, error handling, and structured prompt engineering
- 📁 **Structured a production-ready codebase** with clear separation between frontend, backend, and configuration

This project sits at the intersection of backend development, cloud deployment, and API integration — skills directly applicable to Junior DevOps, Linux Admin, Cloud Engineer, and Backend Developer roles.

---

## 📋 Overview

| Field | Details |
|-------|---------|
| **Project Name** | FCC Script Generator |
| **Primary Technologies** | Node.js, Express.js, HTML/CSS/JavaScript, Anthropic Claude API |
| **Deployment Platform** | Render (cloud hosting, free tier) |
| **Repository** | [github.com/brendanmrojas-ops/FCC-Script-Generator](https://github.com/brendanmrojas-ops/FCC-Script-Generator) |
| **Live Demo** | [fcc-script-generator.onrender.com](https://fcc-script-generator.onrender.com) |
| **Status** | Live and actively used in production |

---

## 📸 Screenshot Gallery

📌 **Screenshot Placeholder: Full application UI showing the two-column layout with the form on the left and script output on the right**

📌 **Screenshot Placeholder: Generated script output showing HOOK, BODY, and CTA sections with editor notes highlighted in gold**

📌 **Screenshot Placeholder: Render dashboard showing successful deployment and live status**

📌 **Screenshot Placeholder: GitHub repository showing file structure and commit history**

📌 **Screenshot Placeholder: Anthropic console showing API usage and spend cap configuration**

---

## 🏗️ Project Structure

```
FCC-Script-Generator/
├── index.js              # Express server — API route handler and middleware
├── package.json          # Node.js project config and dependencies
├── public/
│   └── index.html        # Frontend UI (HTML, CSS, JavaScript in one file)
└── README.md             # Project documentation
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                  User / Browser                  │
│         (Scriptwriter fills out form)            │
└─────────────────────┬───────────────────────────┘
                      │
                      │  HTTP POST /generate
                      ▼
┌─────────────────────────────────────────────────┐
│            Express.js Backend                    │
│              index.js                            │
│                                                  │
│  • Receives form data from client                │
│  • Builds structured AI prompt                   │
│  • Attaches API key from environment variable    │
│  • Sends request to Anthropic API                │
│  • Returns generated script to client            │
└─────────────────────┬───────────────────────────┘
                      │
                      │  HTTPS POST with API Key
                      ▼
┌─────────────────────────────────────────────────┐
│           Anthropic Claude API                   │
│         claude-sonnet-4-6 model                  │
│                                                  │
│  • Processes system prompt + user prompt         │
│  • Generates formatted video script              │
│  • Returns structured text response              │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Detailed Project Walkthrough

### Step 1 — Setting Up the Node.js Backend

**What I did:**
Created a Node.js project with Express.js to handle HTTP requests and serve the frontend.

**Commands:**
```bash
mkdir fcc-script-generator
cd fcc-script-generator
npm init -y
npm install express cors
```

**Why this matters:**
Node.js is one of the most widely used backend runtimes in the industry. Express.js is the standard framework for building REST APIs in Node. Understanding how to initialize a project, manage dependencies with npm, and structure a backend server is foundational knowledge for any DevOps or backend role.

**Real-world connection:**
In production environments, backend services like this sit between client applications and third-party APIs, acting as a secure middleware layer. This is a common pattern in microservices architecture.

**Key code — Express server setup:**
```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => console.log('Server running on port 3000'));
```

📌 **Screenshot Placeholder: Terminal showing the server running successfully on port 3000**

---

### Step 2 — Secure API Key Management with Environment Variables

**What I did:**
Stored the Anthropic API key as an environment variable instead of hardcoding it in the source code. This is a non-negotiable security practice in any professional environment.

**Why this matters:**
Hardcoding API keys in source code is one of the most common and dangerous security mistakes developers make. When code is pushed to GitHub, hardcoded keys become publicly visible and can be exploited immediately. Environment variables keep secrets out of the codebase entirely.

**How I implemented it:**
```javascript
// index.js — API key loaded from environment, never hardcoded
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
```

**Setting the variable locally:**
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Setting the variable on Render (production):**
- Navigate to Render dashboard → Service → Environment
- Add key: `ANTHROPIC_API_KEY`
- Add value: your API key
- Render injects this at runtime — it never appears in the codebase

**Real-world connection:**
This is exactly how environment variables are managed in professional DevOps workflows — locally via `.env` files or shell exports, and in production via platform-level secret management (AWS Secrets Manager, Azure Key Vault, Render environment variables, Kubernetes secrets). Understanding this pattern is essential for any cloud or DevOps role.

📌 **Screenshot Placeholder: Render environment variables dashboard showing the ANTHROPIC_API_KEY variable configured (value hidden)**

---

### Step 3 — Building the API Route and Anthropic Integration

**What I did:**
Built a POST endpoint at `/generate` that accepts form data from the frontend, constructs a structured prompt, calls the Anthropic Claude API, and returns the generated script.

**Key code — API route:**
```javascript
app.post('/generate', async (req, res) => {
  const formData = req.body;

  const systemPrompt = `You are an expert short-form video scriptwriter...`;
  const userPrompt = `Write a ${formData.videoLength} ${formData.videoType} script for:
CLIENT: ${formData.clientName}
NICHE: ${formData.niche}
TOPIC: ${formData.topic}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  const data = await response.json();
  const script = data.content.map(b => b.text || '').join('').trim();
  res.json({ script });
});
```

**Why this matters:**
Working with REST APIs and handling HTTP requests and responses is a core skill in backend development and DevOps. Understanding request structure, headers, authentication, and response parsing is directly applicable to roles that involve building or maintaining API-driven services.

**Real-world connection:**
Third-party API integration is ubiquitous in modern software — payment gateways, cloud services, communication tools, monitoring platforms. This project demonstrates I can read API documentation, implement authentication correctly, and handle responses properly.

📌 **Screenshot Placeholder: Browser network tab showing the POST request to /generate and the JSON response containing the script**

---

### Step 4 — Building the Frontend UI

**What I did:**
Built a responsive two-column web interface in HTML, CSS, and JavaScript. The left column contains the input form, the right column displays the generated script in real time with formatted sections and editor notes.

**Key features implemented:**
- Input validation with inline error messages before making API calls
- Loading state with animated indicators during script generation
- Dynamic script rendering with highlighted section labels and editor notes
- One-click copy to clipboard functionality
- Responsive layout that collapses to single column on mobile

**Why this matters:**
Even in DevOps and Linux admin roles, understanding how frontend applications communicate with backends — HTTP methods, JSON payloads, fetch API — helps engineers debug issues, monitor traffic, and understand the full application stack.

📌 **Screenshot Placeholder: The full UI with a completed form on the left and a generated script displayed on the right**

---

### Step 5 — Cloud Deployment on Render with GitHub Integration

**What I did:**
Deployed the application to Render cloud hosting by connecting the GitHub repository directly. Render automatically rebuilds and redeploys the application every time a new commit is pushed to the main branch.

**Deployment configuration:**
| Setting | Value |
|---------|-------|
| Runtime | Node.js |
| Build Command | `npm install` |
| Start Command | `node index.js` |
| Branch | main |
| Auto-Deploy | Yes — triggers on every push to main |
| Plan | Free tier ($0/month) |

**Why this matters:**
This is a basic implementation of CI/CD (Continuous Integration / Continuous Deployment) — one of the most important concepts in DevOps. The workflow of committing code to GitHub and having it automatically deploy to a live environment mirrors how professional engineering teams ship software.

**Real-world connection:**
Tools like GitHub Actions, Jenkins, CircleCI, and GitLab CI/CD all follow this same principle — code change triggers an automated build and deploy pipeline. Understanding this workflow is foundational for any DevOps role.

📌 **Screenshot Placeholder: Render deploy log showing a successful deployment triggered by a GitHub push**

📌 **Screenshot Placeholder: The live application running at the Render URL**

---

## 🧱 Challenges and Solutions

### Challenge 1 — API Key Security in a Public Repository
**Problem:** The repository is public on GitHub for portfolio visibility, but the Anthropic API key cannot be exposed in the source code.

**Solution:** Used environment variables exclusively. The key is configured directly in Render's dashboard and injected at runtime. The codebase contains zero sensitive credentials. This is the industry-standard approach.

**What I learned:** The difference between application code (safe to share) and application secrets (must never be shared), and how environment variables bridge that gap in production deployments.

---

### Challenge 2 — CORS and Browser Security Restrictions
**Problem:** Browsers block direct API calls to third-party services from frontend JavaScript for security reasons. An earlier attempt to call the Anthropic API directly from the browser failed with a CORS error.

**Solution:** Built an Express.js backend to act as a proxy. The browser calls my own backend, which then calls the Anthropic API server-side. The browser never directly touches the external API.

**What I learned:** How CORS works, why browsers enforce same-origin policy, and why backend middleware layers exist in production architectures.

---

### Challenge 3 — Free Tier Cold Starts on Render
**Problem:** Render's free tier spins down inactive services after 15 minutes. The first request after inactivity has a 30-60 second delay.

**Solution:** Documented the limitation clearly and set user expectations. For a low-traffic internal tool this is acceptable. The upgrade path to a paid tier ($7/month) eliminates cold starts if needed.

**What I learned:** The trade-offs between free and paid cloud hosting tiers, and how to evaluate when a limitation is acceptable versus when it requires a solution.

---

## ✅ Summary

By completing this project I demonstrated the following skills directly applicable to Linux Admin and DevOps roles:

- **Node.js and Express.js** — built a production REST API from scratch
- **API integration** — authenticated and communicated with a third-party AI API
- **Security best practices** — managed secrets with environment variables, never in code
- **Cloud deployment** — deployed a live application to Render with zero downtime updates
- **Git and GitHub** — version controlled the entire project with meaningful commit history
- **CI/CD fundamentals** — implemented automatic redeployment triggered by GitHub pushes
- **Full-stack understanding** — built and connected both frontend and backend layers
- **Real-world application** — shipped a tool that is actively used in a production business workflow

---

## 📚 References

- [Node.js Official Documentation](https://nodejs.org/en/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [Render Deployment Documentation](https://render.com/docs)
- [MDN Web Docs — Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CORS Explained — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Environment Variables Best Practices](https://12factor.net/config)

---

*Built by Brendan Rojas — [github.com/brendanmrojas-ops](https://github.com/brendanmrojas-ops) — [firstclasscreators.com](https://firstclasscreators.com)*
