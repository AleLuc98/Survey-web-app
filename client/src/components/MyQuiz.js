import { ListGroup, Modal, Button, Form , Alert, Table, Container, Card} from 'react-bootstrap'
import React, { useState } from 'react'
import { arrowIcon,homeIcon } from '../icons';
import { Link, Route, useLocation, Redirect,useHistory } from 'react-router-dom';
import { domande} from '../FakeQuiz';
import Myquestion from './MyQuestion';


function MyQuiz(props) {
  const id = props.id.split(" ")[0];
  const titolo = props.id.split(" ")[1];
  const quiz = domande.filter((d) => d.id_quiz == id);
  console.log(quiz);
  return (
    <>
      <h5>
        Quiz {id}: {titolo}
      </h5>
      <br></br>
      <br></br>
      <Container fluid className="card-group">
        {quiz.map((d) => (
          <Myquestion domanda={d} key={d.id}></Myquestion>
        ))}
        <Card.Footer>* indica la domanda obbligatoria</Card.Footer>
      </Container>
      <Link to="/">
        <Button className="home-btn" variant="outline-light">
          {homeIcon}
        </Button>{" "}
      </Link>

      {props.user ? (
        <Link to="/add">
          <Button className="add-task-btn btn-danger circle">+</Button>
        </Link>
      ) : null}
      <Link to="/">
        <Button variant="outline-danger">
          Submit
        </Button>{" "}
      </Link>
    </>
  );
}

export default MyQuiz;