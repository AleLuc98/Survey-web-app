import { Card, FormControl, Form, Spinner} from 'react-bootstrap'
import { useState, useEffect } from "react";
import { risposte_chiuse } from '../FakeQuiz';
import API from '../API';


function Myquestion(props) {
  const [risposte, setRisposte] = useState();
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const inizializeQuestion = async () => {
          const response = await API.getAnswers(props.domanda.id);
          setRisposte(response)
       }
       if (!props.domanda.risposte)
          inizializeQuestion()
        else
          setRisposte(props.domanda.risposte)  
        setLoading(false)   
   },[props.domanda.id,props.domanda.risposte])

  return (
    <>
      <Card border="danger" style={{ width: "18rem" }} key={props.domanda.id}>
      {loading ? (
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
          ) : <>
        <Card.Header>Domanda {props.domanda.min>0 ? "*" : ""} {props.domanda.tipo === "chiusa" ? "[min: "+props.domanda.min+", max: "+props.domanda.max+"]" : ""}</Card.Header>
        <Card.Body>
          <Card.Title>{props.domanda.testo} </Card.Title>
          {props.domanda.tipo === "aperta"  ? 
          <FormControl as="textarea"/> 
          :
            <Form.Group className="centered-checkbox">
              {risposte.map((r)=>
              <Form.Check
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
