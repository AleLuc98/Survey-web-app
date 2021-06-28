import { Card, FormControl, Form, Spinner, Button, Alert} from 'react-bootstrap'
import { useState, useEffect } from "react";
import { deleteIcon, ArrowUpIcon, ArrowDownIcon } from '../icons';
import API from '../API';


function Myquestion(props) {
  const [risposte, setRisposte] = useState();
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState(props.answer)
  const [errorMessage, setErrorMessage] = useState('') ;
  
    useEffect(() => {
      const inizializeQuestion = async () => {
        const response = await API.getAnswers(props.domanda.id);
        setRisposte(response);
        setLoading(false);
        if (props.domanda.tipo === "chiusa"){
          if (props.answer.length===0)
            setAnswer([])
        }
        setAnswer(props.answer)
      };

      if (!props.domanda.risposte) inizializeQuestion()
      else {
        setRisposte(props.domanda.risposte);
        setLoading(false);
      }
    }, [props.domanda.id, props.domanda.risposte, props.domanda.tipo,props.answer]);

 function modifyAnswer (id) {
   if (answer.includes(id)){
    setAnswer(o=>o.filter((e)=>e!==id))
    props.submitAnswer(answer.filter((e)=>e!==id)) 
    setErrorMessage("")
   }
  else{
    if (answer.length < props.domanda.max){
      setAnswer(o=>[...o,id]);
      props.submitAnswer([...answer,id])
    }
    else
      setErrorMessage("Numero massimo di risposte raggiunto")
  }
   
 }


  return (
    <>
      <Card border="danger" className="question" key={props.domanda.id}>
      {errorMessage.length > 0 ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      {loading ? (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
          ) : <>
        <Card.Header className="question-header">
        {props.user && !props.location.includes("compilazioni") ? <Card className="arrows">
            <Button variant="outline-light" onClick={props.up}>
              {ArrowUpIcon}
            </Button>
            <Button variant="outline-light" onClick={props.down}>
              {ArrowDownIcon}
            </Button>
            </Card> : null}
        Domanda {props.domanda.min>0 ? "*" : ""} {props.domanda.tipo === "chiusa" ? "[min: "+props.domanda.min+", max: "+props.domanda.max+"]" : ""}
        {props.user && !props.location.includes("compilazioni") ? <Button variant="danger" className="delete-btn" onClick={props.delete}>
          {deleteIcon}
        </Button> : null}
        </Card.Header>
        <Card.Body>
          <Card.Title>{props.domanda.testo} </Card.Title>
          {props.domanda.tipo === "aperta"  ? 
          <FormControl as="textarea" disabled={props.location.includes("compilazioni") ? true:false} value={answer} onChange={(e)=>{setAnswer(e.target.value);props.submitAnswer(e.target.value) }}/> 
          :
            <Form.Group className="centered-checkbox">
              {risposte.map((r)=>
              <Form.Check
                disabled={props.location.includes("compilazioni") ? true:false}
                checked={answer.includes(r.id) ? true : false}
                onChange={(e) =>
                  modifyAnswer(r.id)}
                type="checkbox"
                label={r.testo}
                key = {r.id}
              />
              )}
          </Form.Group>
          }
        </Card.Body>
          </>}
      </Card>
      <br />
    </>
  );
};

export default Myquestion;
