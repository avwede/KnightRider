from fastapi import Body, Request, FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from getfunction import getfunction

app = FastAPI()

origins = [
    'null',
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def getfunc():
    gfunct = getfunction()
    return gfunct.getScores()
