import { useState } from "react";
import backendService from "./services/backendService";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import GitHubIcon from '@mui/icons-material/GitHub';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

let places = [];

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
    <Grid sx={{ width: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ mt: 4, mb: 2, width: 0.3 }}
          variant="h6"
          component="div"
        >
          {res["Room Code"]}
        </Typography>
        <Typography
          sx={{ mt: 4, mb: 2, mx: 2, width: 0.4 }}
          variant="h7"
          component="div"
        >
          {times[0]["Room info"]}
        </Typography>
        <Button
          sx={{ mt: 2, mb: 2, mx: 2, width: 0.3 }}
          variant="contained"
          color="success"
          onClick={() => redirect()}
        >
          Varaa
        </Button>
      </div>
      <List>
        {times.map((t) => (
          <Typography item key={t["Start time"]}>
            {t["Start time"]} - {t["End time"]}
          </Typography>
        ))}
      </List>
    </Grid>
  );
};

const ResList = ({ reservations, building}) => {


  if (reservations.length === 0) {
    return (
      <Typography
        sx={{ mt: 4, mb: 2 }}
        variant="h4"
        component="div"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Ei vapaita tiloja
      </Typography>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        {reservations.map((res) => (
          <Reservation key={res.Room} res={res}></Reservation>
        ))}
      </div>
    </div>
  );
};

const Form = ({ search, places, handlePlace }) => {
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(60);

  const submit = (event) => {
    event.preventDefault();
    const newRes = {
      building: place,
      date: date.toISOString().slice(0, 10),
      min_duration: time,
    };
    search(newRes);
    handlePlace(place);
  };

  return (
    <div>
      <Typography
        sx={{ mt: 4, mb: 2 }}
        variant="h4"
        component="div"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      </Typography>
      <form
        onSubmit={submit}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FormControl>
          <InputLabel id="building-select">Rakennus</InputLabel>
          <Select
            labelId="building-select"
            id="building-select"
            value={place}
            onChange={({ target }) => setPlace(target.value)}
          >
            <MenuItem value={"Lähde"}>Lähde</MenuItem>
            <MenuItem value={"Agora"}>Agora</MenuItem>
            <MenuItem value={"MaD"}>MaD</MenuItem>
            <MenuItem value={"MaA"}>MaA</MenuItem>
          </Select>
          <br></br>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              inputFormat="DD.MM.YYYY"
              labelId="date-picker"
              value={date}
              onChange={(date) => setDate(date)}
              renderInput={(params) => <TextField {...params} />}
              label="Päivä"
            />
          </LocalizationProvider>
          <br></br>
          <TextField
            label="Kesto"
            value={time}
            select
            onChange={({ target }) => setTime(parseInt(target.value))}
          >
            <MenuItem value={60}>1h</MenuItem>
            <MenuItem value={120}>2h</MenuItem>
            <MenuItem value={240}>3h</MenuItem>
            <MenuItem value={300}>4h</MenuItem>
            <MenuItem value={360}>5h</MenuItem>
          </TextField>
          <br></br>
          <Button variant="contained" type="submit">
            Hae
          </Button>
        </FormControl>
      </form>
    </div>
  );
};

const Footer = () => {
  return (
    <Box sx={{ width: 500 }}>
    <BottomNavigation
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0
      }}
      showLabels
    >
        <BottomNavigationAction label="GitHub" href="https://github.com/Jeskamandeer/jyu-finder" icon={<GitHubIcon/>}></BottomNavigationAction>
    </BottomNavigation>
    </Box>
  );
};

const App = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [loading, setLoading] = useState(false);


  const search = (newRes) => {
    setLoading(true)
    backendService.get(newRes)
    .then((response) => {
      setReservations(response);
      setLoading(false)
    });

  };

  const handlePlace = (building) => {
    setSelectedBuilding(building);
  };

  return (
    <Box sx={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
      <AppBar position="static" sx={{
        width: "100%",
        height: 40 ,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            RoomForJYU
          </Typography>
      </AppBar>
      
      <Form search={search} places={places} handlePlace={handlePlace} />
      {loading ? 
      (<Box sx={{margin: 2 , display: 'flex', justifyContent: "center", alignItems: "center"}}>
        <CircularProgress />
      </Box>)
      : (<ResList reservations={reservations} building={selectedBuilding} />)}
      <Footer />
    </Box>
  );
};

export default App;
