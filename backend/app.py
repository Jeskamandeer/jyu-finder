from fastapi import FastAPI
import timeslot_parser
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import date

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/get_freetimes")
async def get_freetimes(date_s=date.today(), min_duration=1.0):
    
    freetimes = timeslot_parser.get_freetimes(date_s, int(min_duration))
    
    return JSONResponse(content=freetimes)