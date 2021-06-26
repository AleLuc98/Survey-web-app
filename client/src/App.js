import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyNavbar from './components/MyNavbar'
import QuizViewer from './components/QuizViewer'
import QuizSelector from './components/QuizSelector'
import MyQuiz from './components/MyQuiz'
import './components/components.css'
import {Container, Row} from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import {BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import { quiz } from './FakeQuiz';
import API from './API';
import { LoginForm } from './components/LoginComponent';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [errors, setErrors] = useState(false);

  const loginHandler = async (credentials) => {
    try{
      const user =  await API.logIn(credentials);
      setLoggedIn(user)      
      setErrors(false)
    }
    catch(err) {
      setErrors({message: err, type: "login"})
    }
  }

  const logoutHandler = async () => {
    await fetch('/api/sessions/current', { method: 'DELETE' });
    setLoggedIn(false)
  }
    return (
      <Router>
      
        <div className="App">
          <Container fluid>
            <Row className="app-body">
            <MyNavbar
                title="Questionario"
                user={loggedIn}
                logout={()=> {logoutHandler(); <Redirect to="/" />}}
                login={() => <Redirect to="/login" />}
              ></MyNavbar>
            <Switch>
              <Route path="/login">
                <>
                  {loggedIn ? (
                    <Redirect to="/" />
                  ) : (
                    <LoginForm errors={errors} login={loginHandler} />
                  )}
                </>
              </Route>
              <Route path="/quiz_:id">
                <MyQuiz user={loggedIn}></MyQuiz>
              </Route>
              <Route path={["/new_quiz","/add_question"]}>
                <>
              {!loggedIn ? (
                    <Redirect to="/login" />
                  ) : (
                <MyQuiz user={loggedIn}></MyQuiz>
                  )}
                  </>
              </Route>
              <Route path="/">
                {!loggedIn ? (
                  <QuizSelector
                  ></QuizSelector>
                ) : (
                  <QuizViewer
                  ></QuizViewer>
                )}
              </Route>
              </Switch>
            </Row>
          </Container>
        </div>
 
      </Router>
    );
}

export default App;
