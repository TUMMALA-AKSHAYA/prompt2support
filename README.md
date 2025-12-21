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

### Prerequisites
- Node.js 18+ (20.x recommended)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Quick Start
```bash
# Run the start script (starts both backend and frontend)
./start.sh
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Demo Page: http://localhost:3000/demo

## 🚀 Deployment

The application is deployed on Render and available at:
**https://p2p-gtpy.onrender.com**

### Deployment Details
- **Platform**: Render
- **Type**: Full-stack web service
- **Build Command**: `npm install`
- **Start Command**: `npm start` (runs the full-stack application)

## � Usage

1. Visit the deployed application at https://p2p-gtpy.onrender.com
2. Upload documents (PDF, DOCX, TXT) in the Knowledge Base section
3. Ask questions about your documents in the chat interface
4. The AI assistant will provide answers based on the uploaded content

## 🤖 Features

- Document upload and processing
- Intelligent question answering
- Real-time chat interface
- Support for multiple document formats
- Responsive web interface

## 🔧 API Endpoints

- `POST /api/documents/upload` - Upload documents
- `POST /api/queries` - Ask questions
- `GET /api/documents` - List uploaded documents