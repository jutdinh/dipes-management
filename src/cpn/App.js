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
import { Projects, ProjectsCard } from './projects';
import { ListUser, Profile } from './users';


function App() {

  const dispatch = useDispatch()  

  useEffect(() => {
    const specialURLs = ["/login", "/signup", "/signout"]
    const url = window.location.pathname;
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const user = JSON.parse(stringifiedUser)   
    

    if (specialURLs.indexOf(url) === -1) {
      if (!_token) {
        window.location = '/login'
      }

      if (user) {
        dispatch({
          branch: "default",
          type: "setAuthInfor",
          payload: {
            user
          }
        })
      }
    }

  }, [])



  return (

    <Router>
      <Routes>
        <Route exac path="/login" element={<Login />} />s
        <Route exac path="/signup" element={<SignUp />} />
        <Route exac path="/signout" element={<SignOut />} />
        <Route exac path="/" element={<Navigation Child={Home} />} />
        <Route exac path="/projects" element={<Navigation Child={Projects} />} />
        <Route exac path="/project/:project_id" element={<Navigation Child={ProjectsCard} />} />
        <Route exac path="/users" element={<Navigation Child={ListUser} />} />
        <Route exac path="/users/profile" element={<Navigation Child={Profile} />} />
        <Route exac path="/settings" element={<Navigation Child={Settings} />} />
        <Route exac path="*" element={<PageNotFound />} />
      </Routes>
    </Router>

  );
}

export default App;
