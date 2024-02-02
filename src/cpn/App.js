
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home, About } from './dashboard';
import { Navigation, PageNotFound } from './navigations';
import { Login, SignUp, SignOut } from './auth';
import { Settings } from './settings';
import { Projects, ProjectsCard, ProjectDetail, TaskDetail, EditProject } from './projects';
import { ListUser, Profile } from './users';
import { Tasks } from './tasks';
import { Logs } from './logs';
import { Tables, Field, UpdateField, Pre_import  } from './tables';
import { Apis, CreateApi, UpdateAi, StatisticalField } from './api';
// import { UI, CreateUi, Detail } from './ui'
import UI from './ui/Program'

import updateApi from './api/update-api';
import Statistical from './statistical/static';
import Report from './report/report';
import { Workflow } from './workflow';
import { View_Notication } from './navbar';
import Keys  from './keys/keys'
import "../css/index.scss";

function App() {
  const { lang, proxy, auth } = useSelector(state => state);
  const dispatch = useDispatch()
  const _token = localStorage.getItem("_token");

  

  useEffect(() => {
    const specialURLs = ["/login", "/signup", "/signout"]
    const url = window.location.pathname;
    const _token = localStorage.getItem("_token");
    const stringifiedUser = localStorage.getItem("user");
    const user = JSON.parse(stringifiedUser)

    if (specialURLs.indexOf(url) === -1) {
      if (!_token ) {
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

  useEffect(() => {

    if(_token != undefined){

      fetch(`${proxy}/auth/token/check`, {
        headers: {
          Authorization: _token
        }
      })
        .then(res => res.json())
        .then(resp => {
          const { success } = resp;
          // console.log(resp)
          if (success) {
  
          } else {
            window.location = "/signout"
          }
        })
    }
  }, [_token])


  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/" element={<Navigation Child={Home} />} />
        <Route path="/projects" element={<Navigation Child={Projects} />} />
        <Route path="/keys" element={<Navigation Child={Keys} />} />
        <Route path="/projects/detail/:project_id/edit" element={<Navigation Child={EditProject} />} />
        <Route path="/projects/detail/:project_id" element={<Navigation Child={ProjectDetail} />} />
        <Route path="/projects/task/:project_id" element={<Navigation Child={Tasks} />} />
        <Route path="/projects/detail/task/:project_id" element={<Navigation Child={TaskDetail} />} />
        <Route path="/projects/:version_id/tables" element={<Navigation Child={Tables} />} />
        <Route path="/projects/:version_id/tables/field" element={<Navigation Child={Field} />} />
        <Route path="/projects/:version_id/table/:table_id" element={<Navigation Child={UpdateField} />} />
        <Route path="/projects/:version_id/table/:table_id/pre_import" element={<Navigation Child={Pre_import} />} />
        
        <Route path="/projects/:project_id/:version_id/apis" element={<Navigation Child={Apis} />} />
        <Route path="/projects/:project_id/:version_id/apis/create" element={<Navigation Child={CreateApi} />} />
        <Route path="/projects/:project_id/:version_id/apis/update/:api_id" element={<Navigation Child={updateApi} />} />
        <Route path="/projects/:version_id/uis" element={<UI />} />
        
        <Route path="/statis" element={<Navigation Child={Statistical} />} />
        <Route path="/report" element={<Navigation Child={Report} />} />
        <Route path="/workflow" element={<Navigation Child={Workflow} />} />
        <Route path="/logs" element={<Navigation Child={Logs} />} />
        <Route path="/users" element={<Navigation Child={ListUser} />} />
        <Route path="/notifications" element={<Navigation Child={View_Notication} />} />
        <Route path="/profile" element={<Navigation Child={Profile} />} />
        <Route path="/settings" element={<Navigation Child={Settings} />} />
        <Route path="/about" element={<Navigation Child={About} />} />
        <Route path="*" element={<PageNotFound />} />
        
      </Routes>
    </Router>
  );
}
export default App;