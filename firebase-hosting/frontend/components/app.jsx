import React, { useContext, useState, useMemo, useEffect} from 'react';

import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  HashRouter,
  Router,
  browserHistory
} from "react-router-dom";

import Levels from '../pages/levels'
import SalaryForm from '../pages/salaryform'
import Salaries from '../pages/salaries'
import SalariesSpecific from '../pages/salariesspecific'

// import Welcome from '../pages/welcome'
import Entry from '../pages/entryopsform'
import TitlesForm from '../pages/titlesform'
import SupportPayscale from '../pages/supportpayscale'
import Posts from '../pages/posts'
import Poststest from '../pages/poststest'
import Post from '../pages/post'
import Signup from '../pages/signup'
import Signin from '../pages/signin'
import Upload from '../pages/upload'
import Verification from '../pages/verification'

import {Firebase, db, functions} from '../../config/firebase';


Firebase.analytics().logEvent('notification_received')

export default function App() {
  return (
      <div className='app'>
         <Switch>
           <Route exact path="/">
              <Salaries/>
          </Route>
           {/* <Route exact path="/">
              <Welcome/>
            </Route> */}
          <Route exact path="/sign-in">
              <Signin/>
            </Route>
          <Route exact path="/sign-in-verification">
              <Verification/>
            </Route>
          <Route exact path="/sign-up">
              <Signup/>
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
             
          <Route exact path="/salaries/:slug/:slug">
              <SalariesSpecific/>
          </Route> 
          <Route exact path="/posts">
              <Posts/>
          </Route>   
          {/* <Route exact path="/poststest">
              <Poststest/>
          </Route>       */}
   
          <Route exact path="/posts/:slug">
              <Post/>
          </Route>       
          <Route exact path="/upload">
              <Upload/>
          </Route>       
        </Switch>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        </div>

  );
}


