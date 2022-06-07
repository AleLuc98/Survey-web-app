import {
  Button,
  Form,
  Alert,
  Container,
  Card,
  Spinner
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon, homeIcon } from "../icons";
import {
  Link,
  Route,
  useLocation,
  useHistory,
} from "react-router-dom";
import Myquestion from "./MyQuestion";
import QuestionForm from "./QuestionForm";
import API from '../API';

function MyQuiz(props) {
  const history = useHistory();
  const location = useLocation();
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState('') ;
  const [answer,setAnswer] = useState(new Map())
  const [utilizzatore, setUtilizzatore] = useState(1)
  const [numeroCompilazioni, setNumeroCompilazioni] = useState(0)
  const id = location.pathname.split("_")[1].split("/")[0]  

  useEffect(() => {
    const inizializeQuiz = async () => {
      const res = await API.getQuizTitle(id)
      setTitle(res.titolo);
      setNumeroCompilazioni(res.n);
      const response = await API.getQuizQuestions(id);
      setQuiz(response)
      setLoading(false);
    };
    const inizializeAnswers = async () => {
      const ans = await API.getQuizAnswers(id, utilizzatore);
      let tmp = new Map();
      for (let i = 0; i < ans.length; i++) {
        tmp.set(i, ans[i].testo);
      }
      setAnswer(tmp);
      setLoading(false);
    };
    if (
      !location.pathname.includes("new_quiz") &&
      !location.pathname.includes("add_question") &&
      !location.pathname.includes("compilazioni")
    ) {
      inizializeQuiz();
    } else {
      setLoading(false);
    }
    if (location.pathname.includes("compilazioni")) {
      setUtilizzatore(location.pathname.split("_")[2])
        if (utilizzatore === location.pathname.split("_")[2]) {
          inizializeQuiz().then(inizializeAnswers());
        }
    } else {
      setLoading(false);
    }
  }, [location.pathname, id, utilizzatore]);

  

 function saveHandler(testo, min ,max, tipo, risposte) {
  let domanda = {
    //Id used to link answers to the question locally
    id: quiz.length+1,
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


const submitAnswer = (k, value) => {
  let tmp = new Map();
  for (let i = 0; i < quiz.length; i++) {
    if (i === k) tmp.set(i, value);
    else tmp.set(i, answer.get(i));
  }
  setAnswer(tmp);
};

const handlePubblica = (event) => {
  event.preventDefault();
  setErrorMessage("");
  let valid = true;
  if (title === "" || title === undefined) {
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
    setErrorMessage("")
    API.pubblicaQuiz(title,quiz).then((res)=>{if(res) history.push("/")}).catch((res) => {
      if(res==="Parametri errati")
      setErrorMessage(res)
      else
      setErrorMessage("Impossibile pubblicare le risposte del quiz per problemi al server. La preghiamo di riprovare più tardi")
    })
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  setErrorMessage("");
  let valid = true;
  for (let i=0;i<quiz.length;i++){
    if (quiz[i].min>0 && (answer.get(i)===undefined || answer.get(i).length===0)) {
      valid = false;
      setErrorMessage(
        "Completare tutte le domande obbligatorie"
      );
    }
      if (quiz[i].min>1 && (answer.get(i)===undefined || answer.get(i).length!==quiz[i].min)) {
        valid = false;
        setErrorMessage(
          "Inserire il numero minimo di risposte dove esplicitamente richiesto"
        );
    }
  }
  if (valid) {
    API.pubblicaRisposte(quiz,answer,id).then((res)=>{if(res) history.push("/")}).catch((res) => {
      if(res==="Parametri errati")
      setErrorMessage(res)
      else
      setErrorMessage("Impossibile pubblicare le risposte del quiz per problemi al server. La preghiamo di riprovare più tardi")
    })
  }
}


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
      {location.pathname.includes("new_quiz") || location.pathname.includes("add_question") ? (
        <Form.Group>
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          ></Form.Control>
        </Form.Group>
      ) : (
        <h5>
          Quiz {id}: {title}
        </h5>
      )}
      <br></br>
      <br></br>
      <Container fluid className="card-group">
        
        <Card >
        {location.pathname.includes("compilazioni") && utilizzatore>1 ?
          <Link to={location.pathname.substring(0,location.pathname.lastIndexOf("_")+1)+`${utilizzatore-1}`}>
        <Button className="left-btn" variant="outline-danger">
          {ArrowLeftIcon}
        </Button>
        </Link>: null}
        {location.pathname.includes("compilazioni")  && utilizzatore<numeroCompilazioni?
        <Link to={location.pathname.substring(0,location.pathname.lastIndexOf("_")+1)+`${utilizzatore-(-1)}`}>
        <Button className="right-btn" variant="outline-danger">
          {ArrowRightIcon}
        </Button>
        </Link>: null}

        </Card> 
        {errorMessage.length > 0 ? (
          <Alert variant="danger">{errorMessage}</Alert>
        ) : (
          ""
        )}
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          quiz
            .sort((a, b) => a.posizione - b.posizione)
            .map((d,index) => (
              <Myquestion
                domanda={d}
                key={d.id}
                user={props.user}
                up={() => rollUp(d)}
                down={() => rollDown(d)}
                delete={() => deleteQuestion(d)}
                answer={answer.get(index) === undefined ? [] : answer.get(index)}
                submitAnswer={(a)=>submitAnswer(index,a)}
                location={location.pathname}
              ></Myquestion>
            ))
        )}
         {props.user && !location.pathname.includes("compilazioni") ? (
        <Link to="/add_question">
            <Button className="btn-danger circle">Aggiungi domanda</Button>
          </Link>) : null}
        <Card.Footer>* indica la domanda obbligatoria</Card.Footer>
      </Container>
      <Link to="/">
        <Button className="home-btn" variant="outline-danger">
          {homeIcon}
        </Button>{" "}
      </Link>

      {props.user && !location.pathname.includes("compilazioni") ? (
        <>
            <Button variant="outline-danger" onClick={handlePubblica}>
              Pubblica
            </Button>{" "}
        </>
      ) : null}
      {!location.pathname.includes("compilazioni") && !props.user ? 
        <Button variant="outline-danger" onClick={handleSubmit}>
          Invia risposte
        </Button> : null}
    </>
  );
}



export default MyQuiz;
