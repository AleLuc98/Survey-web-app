import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyNavbar from './components/MyNavbar'
import QuizViewer from './components/QuizViewer'
import QuizSelector from './components/QuizSelector'
import MyQuiz from './components/MyQuiz'
import './components/components.css'
import {Container, Row} from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import {BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import { quiz } from './FakeQuiz';



function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [quizSelection, setQuizSelection] = useState();

  const logoutHandler = async () => {
    await fetch('/api/sessions/current', { method: 'DELETE' });
    setLoggedIn(false)
  }
    return (
      <Router>
        <MyNavbar
          title="Questionario"
          user={loggedIn}
          logout={logoutHandler}
        ></MyNavbar>
        <div className="App">
          <Container fluid>
            <Row className="app-body">
              <Route exact path="/">
                {!loggedIn ? (
                  <QuizSelector
                    data={quiz}
                    setQuiz={setQuizSelection}
                  ></QuizSelector>
                ) : (
                  <QuizViewer data={quiz}></QuizViewer>
                )}
              </Route>
              <Route path="/quiz">
                <MyQuiz id={quizSelection} user={loggedIn}></MyQuiz>
              </Route>
            </Row>
          </Container>
        </div>
      </Router>
    );
}

export default App;
