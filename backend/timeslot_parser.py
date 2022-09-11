from bs4 import BeautifulSoup
import requests
import constants
from datetime import date
import json


def fetch_page(url: str):
    page = requests.get(url)

    soup = BeautifulSoup(page.content, "lxml")

    return soup


def parse_page(soup, min_duration: int) -> list:
    """
    Parses all information from JYU Calendar view

    Args:
        soup (_type_): Calenadar page contents
        min_duration (int): Mininum reservation duration in minutes

    Returns:
        list: All free timeslots found
    """

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
        duration = int(free_slot["data-min"])
        start_time = int(free_slot["data-minfromdaystart"]) + (8 * 60)  # Day start time
        end_time = start_time + duration

        if duration >= min_duration:

            freetimes.append(
                {
                    "Start time": "{:02d}:{:02d}".format(*divmod(start_time, 60)),
                    "End time": "{:02d}:{:02d}".format(*divmod(end_time, 60)),
                    "Room info": room_info,
                    "Duration": "{:02d}:{:02d}".format(*divmod(duration, 60)),
                }
            )

    return freetimes


def get_room_codes(selected_buildings: str) -> list:
    """
    Gets room codes from selected buildings

    Args:
        selected_buildings (list): Builings where to perform search

    Returns:
        list: Found rooms in selected buildings
    """
    rooms = []

    if "Lähde" in selected_buildings:
        rooms.extend(constants.kirjasto_rooms)

    if "Agora" in selected_buildings:
        rooms.extend(constants.agora_rooms)

    if "MaA" in selected_buildings:
        rooms.extend(constants.maa_rooms)

    if "MaD" in selected_buildings:
        rooms.extend(constants.mad_rooms)

    return rooms


def get_freetimes(
    date: str,
    min_duration: int,
    building: str,
):

    free_rooms = []

    selected_rooms = get_room_codes(building)

    for room_code in selected_rooms:
        c_url = f"https://kovs-calendar.app.jyu.fi/room/{room_code}?date={date}"

        soup = fetch_page(c_url)
        freetimes = parse_page(soup, min_duration)

        if len(freetimes) > 0:
            free_rooms.append(
                {
                    "Room": c_url,
                    "Room Code": room_code.replace("%20", ""),
                    "Free times": freetimes,
                }
            )

    return free_rooms


if __name__ == "__main__":
    payload = get_freetimes(
        date='2022-09-12', min_duration=60, building="Agora"
    )

    with open("test_payload.json", "w") as outfile:
        json.dump(payload, outfile, indent=4, ensure_ascii=False)
