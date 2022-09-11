import { useEffect, useState } from "react";
import backendService from "./services/backendService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

let places = [
  {
    id: 1,
    place: "Lähde",
  },
  {
    id: 2,
    place: "Agora",
  },
  {
    id: 3,
    place: "MaA",
  },
  {
    id: 4,
    place: "MaB",
  },
];

const Reservation = ({ res }) => {
  let times = res["Free times"];

  if (!res) {
    return;
  }
  const redirect = () => {
    const link = res.Room;
    window.location.href = link;
  };

  return (
    <div>
      <h3>{res["Room Code"]} </h3>
      <button onClick={() => redirect()}>Varaa tästä</button>
      {times.map((t) => (
        <p key={t["Start time"]}>
          {t["Start time"]} - {t["End time"]}
        </p>
      ))}
    </div>
  );
};

const ResList = ({ reservations }) => {
  console.log(reservations);
  if (reservations.length === 0) {
    return <p>loading...</p>;
  }

  return (
    <div>
      {reservations.map((res) => (
        <Reservation key={res.Room} res={res}></Reservation>
      ))}
    </div>
  );
};

const Form = ({ search, places }) => {
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);

  const submit = (event) => {
    event.preventDefault();
    let editedTime = parseFloat(time / 60);
    const newRes = {
      place: place,
      date: date.toISOString().slice(0, 10),
      min_duration: Math.round(editedTime * 10) / 10,
    };
    search(newRes);
    setPlace("");
    setTime(null);
    setTime(null);
  };

  return (
    <div>
      <h3>Hae varauksia:</h3>
      <form onSubmit={submit}>
        <div>
          Tila:
          <select
            name="valitse"
            value={place}
            onChange={({ target }) => setPlace(target.value)}
          >
            <option label="valitse"></option>
            {places
              .sort((a, b) => {
                return a.place.localeCompare(b.place);
              })
              .map((p) => (
                <option key={p.id}>{p.place}</option>
              ))}
          </select>
        </div>
        <div>
          Päivä:
          <DatePicker
            dateFormat="dd.MM.yyyy"
            selected={date}
            onChange={(date) => setDate(date)}
          />
        </div>
        <div>
          Kesto:
          <input
            name="min"
            type="number"
            onChange={({ target }) => setTime(target.value)}
          />
        </div>
        <button type="submit">Hae tiloja</button>
      </form>
    </div>
  );
};

const App = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    backendService.getAll().then((response) => {
      let res = JSON.parse(response);
      setReservations(res);
    });
    console.log(reservations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = (newRes) => {
    backendService.get(newRes).then((response) => {
      let res = JSON.parse(response);
      setReservations(res);
    });
  };

  return (
    <div>
      <h1>Varausbotti 3000</h1>
      <Form search={search} places={places} />
      <ResList reservations={reservations} />
    </div>
  );
};

export default App;
