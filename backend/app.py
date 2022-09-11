from fastapi import FastAPI
import timeslot_parser
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging
app = FastAPI()

origins = ["http://localhost:3000", "https://jyu-finder-6pgu3rfsea-lz.a.run.app"]

logging.info(f"Using {origins} as origins")

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
async def get_freetimes(date, min_duration=60, building="Lähde"):

    freetimes = timeslot_parser.get_freetimes(
        date=date,
        min_duration=int(min_duration),
        building=building,
    )

    return JSONResponse(content=freetimes)
