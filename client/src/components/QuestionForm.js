import {
    Modal,
    Button,
    Form,
    Alert,
  } from "react-bootstrap";
  import React, { useState } from "react";
  import { confirmIcon} from "../icons";
  import {
    Link,
    Redirect,
  } from "react-router-dom";


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
        if ((risposte.size!==numeroRisposte)||(Array.from(risposte).some((el)=>el[1]==="")))
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
                  checked={tipo === "chiusa" ? true : false}
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
                  checked={tipo === "aperta" ? true : false}
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

  export default QuestionForm;