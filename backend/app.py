from fastapi import FastAPI
import timeslot_parser
from fastapi.responses import JSONResponse
from datetime import date

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():

    return {"message": "Hello World"}


@app.get("/get_freetimes")
async def get_freetimes(date_s=date.today(), min_duration=1.0):
    
    freetimes = timeslot_parser.get_freetimes(date_s, int(min_duration))

    return JSONResponse(content=freetimes)
