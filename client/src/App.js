import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyNavbar from './components/MyNavbar'
import QuizViewer from './components/QuizViewer'
import MyQuiz from './components/MyQuiz'
import './components/components.css'
import {Container, Row, Spinner} from 'react-bootstrap'
import React, { useState,useEffect } from 'react'
import {BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import API from './API';
import { LoginForm } from './components/LoginComponent';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(user);
        setLoading(false)
      }
      catch(err){
        setLoggedIn(false)
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

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
    setLoading(true)
    await API.logOut()
    setLoggedIn(false)   
    setLoading(false)
  }
    return (
      <Router>
      
        <div className="App">
          <Container fluid>
          {loading ? 
                        <Spinner animation="border" role="status">
                         <span className="sr-only">Loading...</span>
                        </Spinner> :
            <Row className="app-body">
            <MyNavbar
                title="Questionario"
                user={loggedIn}
                logout={()=> logoutHandler()}
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
              <Route path={["/new_quiz","/add_question","/compilazioni_:id"]}>
                <>
              {!loggedIn ? (
                    <Redirect to="/login" />
                  ) : (
                <MyQuiz user={loggedIn}></MyQuiz>
                  )}
                  </>
              </Route>
              <Route path="/">
                  <QuizViewer user={loggedIn}
                  ></QuizViewer>
              </Route>
              </Switch>
            </Row>}
          </Container>
        </div>
 
      </Router>
    );
}

export default App;
