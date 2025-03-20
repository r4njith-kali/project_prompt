from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.websockets import WebSocket
from typing import List
import json

app = FastAPI(
    title="Technical Support Chatbot API",
    description="AI-Powered Technical Support Chatbot Backend",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active WebSocket connections
active_connections: List[WebSocket] = []

@app.get("/")
async def root():
    return {"message": "Welcome to the Technical Support Chatbot API"}

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Process the received message
            try:
                message_data = json.loads(data)
                # TODO: Implement AI processing logic here
                response = {
                    "message": "Your message has been received",
                    "type": "bot",
                    "data": message_data
                }
                await websocket.send_json(response)
            except json.JSONDecodeError:
                await websocket.send_json({
                    "error": "Invalid message format"
                })
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)

@app.get("/health")
async def health_check():
    return JSONResponse(
        status_code=200,
        content={"status": "healthy"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 