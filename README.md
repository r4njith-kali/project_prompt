# AI-Powered Technical Support Chatbot

A full-stack application featuring an AI-powered chatbot for technical support, built with React.js and FastAPI.

## Features

- Real-time chat interface with AI-powered responses
- User authentication (email login and guest mode)
- Dark/light mode support
- Auto-suggestions for common queries
- Local knowledge base integration
- Admin panel for FAQ management
- WebSocket support for real-time communication

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- WebSocket client
- React Router

### Backend
- FastAPI
- SQLite
- Pydantic
- WebSockets
- OpenAI GPT API / Hugging Face Transformers

## Project Structure
```
project_prompt/
├── frontend/           # React.js frontend application
├── backend/            # FastAPI backend application
│   ├── app/           # Main application code
│   ├── database/      # Database models and migrations
│   └── knowledge_base/ # Local knowledge base storage
└── docker/            # Docker configuration files
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Docker (optional)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
5. Run the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation
Once the backend server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License
MIT 