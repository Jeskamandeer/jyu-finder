import { useEffect, useState } from "react";
import backendService from "./services/backendService";
import "react-datepicker/dist/react-datepicker.css";
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


let places = [
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


  return(
    <div style={({display: 'flex', alignItems: 'center'})}>
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} arial-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
            <Typography sx={{ mt: 4, mb: 2, width: 0.3}} variant="h6" component="div">{res["Room Code"]}</Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ mt: 4, mb: 2, mx: 2, width: 0.4}} variant="h7" component="div">
              Room Info
              </Typography>
            </TableCell>
            <TableCell>
            <Button sx={{ mt: 2, mb: 2, mx: 2, width: 0.3}} variant="contained" color="success" onClick={() => redirect()}>
              Varaa
            </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {times.map((t) => (
            <TableRow>
            <Typography item key={t["Start time"]}>
            {t["Start time"]} - {t["End time"]}
            </Typography>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )

/*   return (
    <Grid sx={{ width: 1 }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
    }}>
      <Typography sx={{ mt: 4, mb: 2, width: 0.3}} variant="h6" component="div">
        {res["Room Code"]}
      </Typography>
      <Typography sx={{ mt: 4, mb: 2, mx: 2, width: 0.4}} variant="h7" component="div">
        Room Info
      </Typography>
      <Button sx={{ mt: 2, mb: 2, mx: 2, width: 0.3}} variant="contained" color="success" onClick={() => redirect()}>
        Varaa
      </Button>
    </div>
      <List >
      {times.map((t) => (
        <Typography item key={t["Start time"]}>
          {t["Start time"]} - {t["End time"]}
        </Typography>
      ))}
      </List>
    </Grid>
  ); */
};

const ResList = ({ reservations, building }) => {
  if (reservations.length === 0) {
    return <p>loading...</p>;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <div >

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
  const [time, setTime] = useState(null);

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
    <div >
      <Typography sx={{ mt: 4, mb: 2 }} variant="h4" component="div" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        Hae vapaat tilat:
      </Typography>
      <form onSubmit={submit} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
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
            <MenuItem value={"MaD"}>MaA</MenuItem>
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
          </TextField>
          <br></br>
        <Button variant="contained" type="submit">Hae</Button>
      </FormControl>
      </form>
    </div>
  );
};

const App = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");

  useEffect(() => {
    backendService.getAll().then((response) => {
      let res = response;
      setReservations(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = (newRes) => {
    backendService.get(newRes).then((response) => {
      let res = response;
      setReservations(res);
    });
  };

  const handlePlace = (building) => {
    setSelectedBuilding(building);
  };

  return (
    <Box sx={{ flexGrow: 1, justifyContent:"center", alignItems: 'center' }}>
      <AppBar position="static">
      <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
        MyJYU Finder
      </Typography>
      </AppBar>
      <Form search={search} places={places} handlePlace={handlePlace} />
      <ResList reservations={reservations} building={selectedBuilding} />
    </Box>
  );
};

export default App;
