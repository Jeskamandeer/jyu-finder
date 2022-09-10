from bs4 import BeautifulSoup
import requests
import urls
from datetime import date
import json

url = "https://kovs-calendar.app.jyu.fi/room/"


def fetch_page(url: str):
    page = requests.get(url)

    soup = BeautifulSoup(page.content, "lxml")

    return soup


def parse_page(soup, min_duration: float):
    free_slots = soup.findAll("div", attrs={"class": "free slot"})
    
    # Gets rooms metainfo
    room_info = soup.find("span", attrs={"class": "room-info"}).getText()
    room_info = (
        room_info.replace("(", "")
        .replace(")", "")
        .replace("\n", " ")
        .replace(" ", "")
        .replace(",", ", ")
    )
    freetimes = []

    for free_slot in free_slots:
        start_time = int(free_slot["data-minfromdaystart"]) / 60 + 8.0
        duration = int(free_slot["data-min"]) / 60

        if duration >= min_duration:
            freetimes.append(
                {
                    "Start time": start_time,
                    "End time": start_time + duration,
                    "Room info": room_info,
                    "Duration": duration,
                }
            )

    return freetimes


def get_freetimes(date_s=date.today(), min_duration=1.0):
    json_array = []

    for room in urls.kirjasto_rooms:
        c_url = f"{url}{room}?date={date_s}"

        soup = fetch_page(c_url)
        freetimes =  parse_page(soup, min_duration)

        if len(freetimes) > 0:
            json_array.append(
                {
                    "Room": c_url,
                    "Room Code": room.replace("%20", ""),
                    "Free times": freetimes
                }
        )

    # Serializing json
    json_object = json.dumps(json_array, ensure_ascii=False)

    return json_object


if __name__ == "__main__":
    get_freetimes()
