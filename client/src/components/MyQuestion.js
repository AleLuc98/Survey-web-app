import { Card, FormControl, Form, Row} from 'react-bootstrap'
import { risposte_chiuse } from '../FakeQuiz';


function Myquestion(props) {
const risposte = risposte_chiuse.filter((r)=>r.id_dom==props.domanda.id)

  return (
    <>
      <Card border="danger" style={{ width: "18rem" }} key={props.domanda.id}>
        <Card.Header>Domanda {props.domanda.min>0 ? "*" : ""} {props.domanda.tipo === "chiusa" ? "[min: "+props.domanda.min+", max: "+props.domanda.max+"]" : ""}</Card.Header>
        <Card.Body>
          <Card.Title>{props.domanda.testo} </Card.Title>
          {props.domanda.tipo === "aperta"  ? <FormControl as="textarea"/> :
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
      </Card>
      <br />
    </>
  );
};

export default Myquestion;
