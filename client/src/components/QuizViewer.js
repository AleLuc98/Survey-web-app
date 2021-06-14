import { ListGroup, Modal, Button, Form , Alert, Table} from 'react-bootstrap'
import React, { useState } from 'react'
import { arrowIcon } from '../icons';
import { Link, Route, useLocation, Redirect,useHistory } from 'react-router-dom';

function QuizViewer(props) {
    return (
        <>
                <h5>I miei questionari </h5>
                <br></br><br></br>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Titolo del questionario</th>
                        <th>Numero di compilazioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.data.map((q) => 
                        <tr key={q.id}>
                            <td>{q.id}</td>
                            <td>{q.titolo}</td>
                            <td>{q.compilazioni}</td>
                            <td><Link to='/add'><Button variant="outline-grey">
                            {arrowIcon}</Button></Link></td>
                        </tr>
                        )}
                    </tbody>
                    </Table>
            <Link to='/add'><Button className="add-task-btn btn-danger circle">
                +
            </Button>
            </Link>
        </>
    )
}

export default QuizViewer;