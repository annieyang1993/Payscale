import React, { useContext, useState, useMemo, useEffect} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  HashRouter
} from "react-router-dom";

import Levels from '../pages/levels'
import SalaryForm from '../pages/salaryform'
import Salaries from '../pages/salaries'
import Welcome from '../pages/welcome'
import Entry from '../pages/entryopsform'
import TitlesForm from '../pages/titlesform'
import SupportPayscale from '../pages/supportpayscale'
import {Firebase, db, functions} from '../../config/firebase';


Firebase.analytics().logEvent('notification_received')

export default function App() {
  return (
      <div className='app'>
         <Switch>
           <Route exact path="/">
              <Welcome/>
            </Route>
          <Route exact path="/salary-form">
              <SalaryForm/>
            </Route>
           <Route exact path="/ops-form">
              <Entry/>
            </Route>
           <Route exact path="/titlesform">
              <TitlesForm/>
            </Route>
            
          <Route exact path="/support-payscale">
              <SupportPayscale/>
          </Route>
          <Route exact path="/salaries">
              <Salaries/>
            </Route>              
        </Switch>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        </div>

  );
}


