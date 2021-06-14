import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyNavbar from './components/MyNavbar'
import QuizViewer from './components/QuizViewer'
import './components/components.css'
import {Container, Row, Col} from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import {BrowserRouter as Router, Redirect, Route } from 'react-router-dom';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const logoutHandler = async () => {
    await fetch('/api/sessions/current', { method: 'DELETE' });
    setLoggedIn(false)
  }
    return (
    <Router>
      <Route exact path='/'><Redirect to='All'></Redirect></Route>
    <div className="App">
      <MyNavbar title="Questionario" user = {loggedIn} logout = {logoutHandler}>
          </MyNavbar> 
        <Container fluid>
         
        <Row className="app-body">
            <QuizViewer>
            </QuizViewer>
        </Row>
      </Container>
</div>
      </Router>

  );
}

export default App;
