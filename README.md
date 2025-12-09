# Prompt2Support – Autonomous Multi-Agent Customer Support System for MSMEs

Prompt2Support is an AI-powered multi-agent system that automates customer support for MSMEs by understanding queries, retrieving information from documents, generating accurate responses, and verifying correctness.

### 🚀 Why This Project?
MSMEs struggle because:
- Customer support is slow and inconsistent
- Information is scattered across PDFs, invoices, manuals, emails
- Staff manually search for answers

This system solves it using 5 AI agents:
1. **Understanding Agent** – Classifies intent and extracts entities  
2. **Retrieval Agent** – Performs semantic search over documents  
3. **Reasoning Agent** – Generates accurate customer response  
4. **Verification Agent** – Ensures it’s grounded & hallucination-free  
5. **Action Agent** – Creates tickets, drafts emails, schedules callbacks  

### 🧠 Core Features
- Multi-agent pipeline (Agentic AI)
- PDF/Doc/TXT ingestion & automatic chunking
- Vector search with embeddings
- Real-time workflow visualization
- Scalable across industries

---

## 📦 Tech Stack
**Backend**
- Node.js / Express  
- Multi-agent orchestration  
- PDF & DOCX parsers  
- Custom embedding + vector search  

**Frontend**
- React + Tailwind  
- Upload documents  
- Query interface  
- Agent workflow visualizer  

---

## 🛠 Installation

### Backend
```bash
cd backend
npm ci
npm run dev
