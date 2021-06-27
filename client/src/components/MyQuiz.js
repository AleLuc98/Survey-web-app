import {
  ListGroup,
  Modal,
  Button,
  Form,
  Alert,
  Row,
  Container,
  Card,
  Spinner
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
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
import API from '../API';

function MyQuiz(props) {
  const history = useHistory();
  const location = useLocation();
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState();
  const [errorMessage, setErrorMessage] = useState('') ;
  const id = location.pathname.split("_")[1]
  

  useEffect(() => {
    const inizializeQuiz = async () => {
        const titolo = await API.getQuizTitle(id);
        setTitle(titolo);
        const response = await API.getQuizQuestions(id);
        setQuiz(response)
        setLoading(false)   
     }
    if(id!=="quiz"&&id!=="question")
      inizializeQuiz()
    else{
      setLoading(false)   
    }
 },[id])

 function saveHandler(id_q, testo, min ,max, tipo, risposte) {
  let domanda = {
    //Id used to link answers to the question locally
    id: quiz.length+1,
    id_quiz:id_q,
    testo:testo,
    min:min,
    max:max,
    tipo:tipo,
    posizione: quiz.length+1,
    risposte: risposte
  }
  setQuiz(oldQuiz=>[...oldQuiz,domanda])
}

const rollUp = (e) => {
  if (e.posizione>1){
    let prec = quiz.filter((d) => d.posizione === (e.posizione - 1));
    e.posizione--
    prec[0].posizione++;
    let tmp = quiz.map((e)=>e)
    setQuiz(tmp)
  }
}

const rollDown = (e) => {
  if (e.posizione < quiz.length) {
    let succ = quiz.filter((d) => d.posizione === (e.posizione + 1));
    e.posizione++;
    succ[0].posizione--;
    let tmp = quiz.map((e)=>e)
    setQuiz(tmp)
  }
};

const deleteQuestion = (e) => {
    let tmp = quiz.filter((d)=>d.id!==e.id)
    setQuiz(tmp)
}


const handleSubmit = (event) => {
  event.preventDefault();
  setErrorMessage("");
  let valid = true;
  if (title === "" || title == undefined) {
    valid = false;
    setErrorMessage(
      "Il titolo non può essere vuoto"
    );
  }
    if (quiz.length === 0) {
      valid = false;
      setErrorMessage(
        "Deve esserci almeno una domanda"
      );
  }

  if (valid) {
    API.pubblicaQuiz(title,quiz).catch(() => {
    setErrorMessage("Impossibile pubblicare il quiz per problemi al server. La preghiamo di riprovare più tardi")
    }).then(()=>{if(errorMessage.length === 0) history.push("/")})
  }
};

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
      
        {id==="quiz"||id==="question" ? <Form.Group>
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
              ></Form.Control>
            </Form.Group> :
        <h5>
        Quiz {id}: {title}
        </h5>
        }
      <br></br>
      <br></br>
      <Container fluid className="card-group">
      {errorMessage.length > 0 ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      {loading ? (
      <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>) :(
        quiz.sort((a,b)=>a.posizione-b.posizione).map((d) => (
          <Myquestion domanda={d} key={d.id} user={props.user} up={()=>rollUp(d)} down={()=>rollDown(d)} delete ={()=>deleteQuestion(d)}></Myquestion>
        )))}
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
        <Button variant="outline-danger" onClick={handleSubmit}>Pubblica</Button>{" "}
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
    let valid = true;
    if (testo === "") {
      valid= false
      setErrorMsg("Inserire il testo della domanda");
    }
    if (numeroRisposte>0){
      if ((risposte.size!=numeroRisposte)||(Array.from(risposte).some((el)=>el[1]==="")))
      {
        valid=false
        setErrorMsg("Completare tutte le opzioni della risposte chiuse");
      }
    }
    if (valid)
    {
      onSave(props.id_quiz,testo, min, max, tipo, Array.from(risposte).map((r)=>{let risposta = {id:r[0],testo:r[1]};return risposta}));
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
          <Modal.Title>Crea una nuova domanda</Modal.Title>
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
              <Form.Group>
                <Form.Label>Numero minimo di riposte &nbsp;&nbsp;</Form.Label>
                <Form.Control
                value={min}
                onChange={(e) => setMin(e.target.value)}
                type="number"
              ></Form.Control>
              <Form.Label>Numero massimo di riposte &nbsp;&nbsp;</Form.Label>
                <Form.Control
                value={max}
                onChange={(e) => setMax(e.target.value)}
                type="number"
              ></Form.Control>
              </Form.Group>
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
                {Array.from(risposte).map((el) =>
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
            )}
              </>
            ) : (
              <Form.Group>
              <Form.Check
              onChange={(e) => {e.target.checked===true ? setMin(1) : setMin(0) }}
              type="checkbox"
              label="La domanda è obbligatoria?"
            ></Form.Check>
             </Form.Group>

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
