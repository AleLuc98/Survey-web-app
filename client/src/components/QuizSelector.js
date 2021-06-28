import { Button , Alert, Table, Spinner} from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { arrowIcon } from '../icons';
import { Link} from 'react-router-dom';
import API from '../API';

function QuizSelector() {
    const [quiz,setQuiz] = useState();
    const [loading, setLoading ] = useState(true)
    const [errorMessage, setErrorMessage] = useState('') ;


    useEffect(() => {
       const inizializeQuiz = async () => {
            const response = await API.getQuiz().catch(() => {
                setErrorMessage("Impossibile selezionare un quiz per problemi al server. La preghiamo di riprovare più tardi")})
            setQuiz(response)
            setLoading(false)   
        }
        inizializeQuiz()
    },[])

    return (
        <>
              {errorMessage.length > 0 ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
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
                    {loading ? 
                    <tr><td>
                        <Spinner animation="border" role="status">
                         <span className="sr-only">Loading...</span>
                        </Spinner>
                    </td></tr>
                    : 
                    quiz.map((q) => 
                        <tr key={q.id}>
                            <td>{q.id}</td>
                            <td>{q.titolo}</td>
                            <td><Link to={"/quiz_"+q.id}><Button variant="outline-grey">
                            {arrowIcon}</Button></Link></td>
                        </tr>                        
                    )}   
                    </tbody>
                    </Table>
        </>
    )
}

export default QuizSelector;

