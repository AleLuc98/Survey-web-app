import {
  Button,
  Alert,
  Table,
  Spinner,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { arrowIcon } from "../icons";
import {
  Link,
} from "react-router-dom";
import API from "../API";

function QuizViewer(props) {
  const [quiz, setQuiz] = useState();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('') ;


  useEffect(() => {
    const inizializeQuiz = async () => {
      const response = await API.getMyQuiz().catch(() => {
        setErrorMessage("Impossibile visionare i quiz per problemi al server. La preghiamo di riprovare più tardi")})
      setQuiz(response);
      setLoading(false);
    };
    inizializeQuiz();
  }, []);

  return (
    <>
      {errorMessage.length > 0 ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
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
                  {q.compilazioni > 0 ?
                  <Link to={"/compilazioni_"+q.id+"/utilizzatore_1"}>
                    <Button variant="outline-grey">{arrowIcon}</Button>
                  </Link> : null}
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
