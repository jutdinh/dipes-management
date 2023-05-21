import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { Home } from './dashboard';
import { Navigation, PageNotFound } from './navigations';
import { Login, SignUp, SignOut } from './auth';

import { Settings } from './settings';
import { Projects } from './projects';

function App() {
   
    useEffect(() => {
        

    }, [])

  return (      
           
      <Router>
            <Routes>
                <Route exac path="/login" element={ <Login /> } />
                <Route exac path="/signup" element={ <SignUp /> } />
                <Route exac path="/signout" element={ <SignOut /> } />
                <Route exac path="/" element={ <Navigation Child={ Home } /> } />   
                <Route exac path="/projects" element={ <Navigation Child={ Projects } /> } />   
                <Route exac path="/settings" element={ <Navigation Child={ Settings } /> } />   
                <Route exac path="*" element={ <PageNotFound /> } />           
            </Routes>
      </Router>

  );
}

export default App;
