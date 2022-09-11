from fastapi import FastAPI
import timeslot_parser
from fastapi.responses import JSONResponse
from datetime import date
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
async def get_freetimes(date_s=date.today(), min_duration=60, buildings=["kirjasto"]):

    freetimes = timeslot_parser.get_freetimes(
        date_s=date_s,
        min_duration=int(min_duration),
        selected_buildings=buildings,
    )

    return JSONResponse(content=freetimes)
