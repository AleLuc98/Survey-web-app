import {
  ListGroup,
  Modal,
  Button,
  Form,
  Alert,
  Table,
  Spinner,
  Col,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { arrowIcon } from "../icons";
import {
  Link,
  Route,
  Router,
  useLocation,
  Redirect,
  useHistory,
} from "react-router-dom";
import API from "../API";

function QuizViewer(props) {
  const history = useHistory();
  const [quiz, setQuiz] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const inizializeQuiz = async () => {
      const response = await API.getMyQuiz();
      setQuiz(response);
      setLoading(false);
    };
    inizializeQuiz();
  }, []);

  return (
    <>
      <h5>I miei questionari </h5>
      <br></br>
      <br></br>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titolo del questionario</th>
            <th>Numero di compilazioni</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td>
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </td>
            </tr>
          ) : (
            quiz.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.titolo}</td>
                <td>{q.compilazioni}</td>
                <td>
                  <Link to="/add">
                    <Button variant="outline-grey">{arrowIcon}</Button>
                  </Link>
                </td>
              </tr>
            ))
            )}
        </tbody>
      </Table>
      <Link to="/new_quiz">
        <Button className="add-task-btn btn-danger circle">+</Button>
      </Link>
    </>
  );
}

export default QuizViewer;
