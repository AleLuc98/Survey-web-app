import { ListGroup, Modal, Button, Form , Alert, Table, Col} from 'react-bootstrap'
import React, { useState } from 'react'
import { arrowIcon } from '../icons';
import { Link, Route, Router, useLocation, Redirect,useHistory } from 'react-router-dom';
import API from '../API';


function QuizViewer(props) {
    return (
      <>
        <Route path="/confirm_new_quiz">
            <QuizForm show={true}
                    onSave={(res)=>props.setQuiz(res)}>
         </QuizForm>
         </Route>
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
            {props.data.map((q) => (
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
            ))}
          </tbody>
        </Table>
        <Link to="/confirm_new_quiz">
          <Button
            className="add-task-btn btn-danger circle"
          >
            +
          </Button>
        </Link>
      </>
    );
}

function QuizForm(props) {
    const {onSave} = props

    const [title, setTitle] = useState('');
    const [errorMsg, setErrorMsg] = useState();
    const [submitted, setSubmitted] = useState();

 

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(title==='') 
            setErrorMsg('INVALID_TTILE')        
        else{
            const id = await API.getLastID()
            onSave(id+' '+title)
            setSubmitted(true);
        }
        
    }

    return (<>
        {submitted && <Redirect to='/new_quiz'></Redirect>}
        <Modal onHide = {props.onHide} show = {props.show} onSubmit = {handleSubmit}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header>
                    <Modal.Title>Crea un nuovo quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {errorMsg ? <Alert variant="danger"> {errorMsg}</Alert> : 
                        ''}
                        <Form.Group>
                            <Form.Label>Titolo</Form.Label>
                            <Form.Control value={title}  onChange={(e)=>setTitle(e.target.value)} type="text"></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Link to='/'><Button variant="secondary">Close</Button></Link>
                    <Button variant="primary" onClick = {(e)=>handleSubmit(e)}>Crea un nuovo quiz</Button>
                </Modal.Footer>
        </Modal>
        </>
    )
}

export default QuizViewer;