import { ListGroup, Modal, Button, Form , Alert, Table} from 'react-bootstrap'
import React, { useState } from 'react'
import { arrowIcon } from '../icons';
import { Link, Route, useLocation, Redirect,useHistory } from 'react-router-dom';

const QuizViewer = (props) => {
    return (
        <>
            <Route>
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
                        <tr>
                        <td>1</td>
                        <td>Quiz 1</td>
                        <td><Link to='/add'><Button variant="outline-grey">
                        {arrowIcon}</Button></Link></td>
                        </tr>
                        <tr>
                        <td>2</td>
                        <td>Quiz 2</td>
                        <td><Link to='/add'><Button variant="outline-grey">
                        {arrowIcon}</Button></Link></td>
                        </tr>
                        <tr>
                        <td>3</td>
                        <td>Quiz 3</td>
                        <td><Link to='/add'><Button variant="outline-grey">
                        {arrowIcon}</Button></Link></td>
                        </tr>
                    </tbody>
                    </Table>
            </Route>
            <Link to='/add'><Button className="add-task-btn btn-danger circle">
                +
            </Button>
            </Link>
        </>
    )
}

export default QuizViewer;

