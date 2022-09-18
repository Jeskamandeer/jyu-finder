import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import GitHubIcon from '@mui/icons-material/GitHub';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App/>
    <footer
      sx={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "2.5rem",
        alignItems: "center",
        justifyContent: "center",
      }}
      showLabels
    >
      <BottomNavigation>
        <BottomNavigationAction label="GitHub" href="https://github.com/Jeskamandeer/jyu-finder" icon={<GitHubIcon/>}></BottomNavigationAction>
        </BottomNavigation>
    </footer>
    </BrowserRouter>
);