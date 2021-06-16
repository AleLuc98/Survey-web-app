import {
  ListGroup,
  Modal,
  Button,
  Form,
  Alert,
  Table,
  Container,
  Card,
} from "react-bootstrap";
import React, { useState } from "react";
import { confirmIcon, homeIcon, plusIcon } from "../icons";
import {
  Link,
  Route,
  useLocation,
  Redirect,
  useHistory,
} from "react-router-dom";
import { domande, risposte } from "../FakeQuiz";
import Myquestion from "./MyQuestion";


function saveHandler(id, id_q, testo, min ,max, tipo) {
  let domanda = {
    id:id,
    id_quiz:id_q,
    testo:testo,
    min:min,
    max:max,
    tipo:tipo
  }
  domande.push(domanda)
}

function MyQuiz(props) {
  const history = useHistory();
  const id = props.id.split(" ")[0];
  const titolo = props.id.split(" ")[1];
  const quiz = domande.filter((d) => d.id_quiz == id);
  return (
    <>
      <Route path="/add_question">
        <QuestionForm
        id_quiz={id}
          show={true}
          onSave={saveHandler}
          onHide={() => {
            history.push("/new_quiz");
          }}
        ></QuestionForm>
      </Route>
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
        <Link to="/add_question">
          <Button className="add-task-btn btn-danger circle">+</Button>
        </Link>
      ) : null}
      <Link to="/">
        <Button variant="outline-danger">Submit</Button>{" "}
      </Link>
    </>
  );
}

function QuestionForm(props) {
  const { onSave } = props;

  const [testo, setTesto] = useState("");
  const [tipo, setTipo] = useState("aperta");
  const [risposte, setRisposte] = useState(new Map());
  const [numeroRisposte, setNumeroRisposte] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const [errorMsg, setErrorMsg] = useState();
  const [submitted, setSubmitted] = useState();

  const aggiungiRisposta = (k, value) => {
    let tmp = new Map();
    for (let i = 0; i < numeroRisposte; i++) {
      if (i === k) tmp.set(i, value);
      else tmp.set(i, risposte.get(i));
    }
    setRisposte(tmp);
  };

  const selezioneNumeroRisposte = () => {
    let tmp = new Map();
    for (let i = 0; i < numeroRisposte; i++) tmp.set(i, "");
    setRisposte(tmp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (testo === "") setErrorMsg("INVALID_TEXT");
    else {
      onSave(6,props.id_quiz,testo, min, max, tipo);
      setSubmitted(true);
    }
  };

  return (
    <>
      {submitted && <Redirect to="/new_quiz"></Redirect>}
      <Modal
        onHide={props.onHide}
        show={props.show}
        onSubmit={handleSubmit}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Crea un nuovo quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {errorMsg ? <Alert variant="danger"> {errorMsg}</Alert> : ""}
            <Form.Group>
              <Form.Label>Testo</Form.Label>
              <Form.Control
                value={testo}
                onChange={(e) => setTesto(e.target.value)}
                type="text"
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Tipo &nbsp;&nbsp;</Form.Label>

              <Form.Check
                checked={tipo == "chiusa" ? true : false}
                onChange={(e) =>
                  e.target.value === "on" ? setTipo("chiusa") : null
                }
                inline
                type="radio"
                label="chiusa"
              ></Form.Check>
              <Form.Check
                onChange={(e) =>
                  e.target.value === "on" ? setTipo("aperta") : null
                }
                checked={tipo == "aperta" ? true : false}
                inline
                type="radio"
                label="aperta"
              ></Form.Check>
            </Form.Group>
            {tipo === "chiusa" ? (
              <>
                <Form.Group className="answers">
                  <Form.Label>Numero di opzioni (massimo 10) &nbsp;&nbsp;</Form.Label>
                  <Form.Control 
                    value={numeroRisposte}
                    onChange={(e) => setNumeroRisposte(e.target.value)}
                    onBlur={(e) => {
                      if (numeroRisposte > 10) {
                        setErrorMsg("Il numero massimo di riposte è 10");
                        setNumeroRisposte(10);
                      }
                      else
                        setErrorMsg(false)
                    }}
                    type="text"
                  ></Form.Control>
                  <Button
                    variant="outline-grey"
                    onClick={()=>selezioneNumeroRisposte(numeroRisposte)}
                  >
                    {confirmIcon}{" "}
                  </Button>
                </Form.Group>
              </>
            ) : null}
            {console.log(risposte)}
            {Array.from(risposte).map((el) =>
              <>
                <Form.Group key={el[0]} className="answers">
                  <Form.Check disabled inline type="checkbox"></Form.Check>
                  <Form.Control
                    value={risposte.get(el[0])}
                    onChange={(e) => {
                      aggiungiRisposta(el[0],e.target.value);
                    }}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Link to="/new_quiz">
            <Button variant="outline-grey">Close</Button>
          </Link>
          <Button variant="outline-danger" onClick={(e) => handleSubmit(e)}>
            Aggiungi domanda
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MyQuiz;
