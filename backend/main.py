import os
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from livekit import api

load_dotenv()

LIVEKIT_URL = os.getenv("LIVEKIT_URL")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")

app = FastAPI()

# Ajusta esto con el dominio real de tu frontend en Vercel cuando lo tengas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tutoriapp-videollamadas.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RoomRequest(BaseModel):
    sessionId: str
    tutorId: str
    studentId: str


def verificar_clave(x_internal_key: str):
    if x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="No autorizado")


def generar_token(room_name: str, identity: str, name: str) -> str:
    token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
    token.with_identity(identity).with_name(name).with_grants(
        api.VideoGrants(room_join=True, room=room_name)
    )
    return token.to_jwt()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/rooms/create")
def crear_sala(req: RoomRequest, x_internal_key: str = Header(None)):
    verificar_clave(x_internal_key)

    room_name = f"session-{req.sessionId}"

    tutor_token = generar_token(room_name, req.tutorId, "Tutor")
    student_token = generar_token(room_name, req.studentId, "Estudiante")

    return {
        "roomName": room_name,
        "livekitUrl": LIVEKIT_URL,
        "tutorToken": tutor_token,
        "studentToken": student_token,
    }

from livekit.api import WebhookReceiver, TokenVerifier

webhook_receiver = WebhookReceiver(TokenVerifier(LIVEKIT_API_KEY, LIVEKIT_API_SECRET))

@app.post("/webhook")
async def livekit_webhook(request: Request, authorization: str = Header(None)):
    body = await request.body()
    try:
        event = webhook_receiver.receive(body.decode("utf-8"), authorization)
    except Exception:
        raise HTTPException(status_code=401, detail="Firma inválida")
    # procesar event.event, event.room, etc.
    return {"status": "ok"}