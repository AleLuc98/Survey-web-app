import { ListGroup, Modal, Button, Form , Alert, Table} from 'react-bootstrap'
import React, { useState } from 'react'
import { arrowIcon } from '../icons';
import { Link, Route, useLocation, Redirect,useHistory } from 'react-router-dom';

function QuizSelector(props) {
    return (
        <>
                <h5>Selezionare il questionario a cui si vuole rispondere</h5>
                <br></br><br></br>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Titolo del questionario</th>
                        </tr>
                    </thead>
                    <tbody>
                    {props.data.map((q) => 
                        <tr key={q.id}>
                            <td>{q.id}</td>
                            <td>{q.titolo}</td>
                            <td><Link to="/quiz" onClick={()=>props.setQuiz(q.id+" "+q.titolo)}><Button variant="outline-grey">
                            {arrowIcon}</Button></Link></td>
                        </tr>                        
                    )}   
                    </tbody>
                    </Table>
        </>
    )
}

export default QuizSelector;

