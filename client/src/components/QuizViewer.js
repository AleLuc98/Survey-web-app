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
      let response;
      if (props.user)
        response = await API.getMyQuiz().catch(() => {
          setErrorMessage(
            "Impossibile visionare i quiz per problemi al server. La preghiamo di riprovare più tardi"
          );
        });
      else
        response = await API.getQuiz().catch(() => {
          setErrorMessage(
            "Impossibile visionare i quiz per problemi al server. La preghiamo di riprovare più tardi"
          );
        });

      setQuiz(response);
      setLoading(false);
    };
    inizializeQuiz();
  }, [props.user]);

  return (
    <>
      {errorMessage.length > 0 ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      {props.user ?
      <h5>I miei questionari </h5> :
      <h5>Selezionare il questionario a cui si vuole rispondere</h5>
      }
      <br></br>
      <br></br>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titolo del questionario</th>
            {props.user ?  <th>Numero di compilazioni</th> : null}
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
                {props.user ?  
                <td>{q.compilazioni}</td> : null }
                <td>
                  {props.user && q.compilazioni> 0 ?
                  <Link to={"/compilazioni_"+q.id+"/utilizzatore_1"}>
                    <Button variant="outline-grey">{arrowIcon}</Button>
                  </Link> : null}
                  {!props.user ? 
                  <Link to={"/quiz_"+q.id}><Button variant="outline-grey">
                  {arrowIcon}</Button></Link>
                  : null}
                </td>
              </tr>
            ))
            )}
        </tbody>
      </Table>
      {props.user ?
      <Link to="/new_quiz">
        <Button className="add-quiz-btn btn-danger circle">+</Button>
      </Link> : null}
    </>
  );
}

export default QuizViewer;
