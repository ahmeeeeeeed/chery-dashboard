import React from 'react';
import {Router} from 'react-router-dom'

import './App.css';

import history from './services/history'
import  Routes  from './Routes/index';



function App() {
  return (
    <Router history={history}>
     <Routes/>
    </Router>
    
  );
}

export default App;
