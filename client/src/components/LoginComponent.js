import { Form, Button, Alert, Col, Container, Row } from 'react-bootstrap';
import { useState } from 'react';

function LoginForm(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState('') ;
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username: username, password: password };
      
      let valid = true;
      if (username === '' || password === '' || password.length < 6) {
        valid = false;
        setErrorMessage('Email cannot be empty and password must be at least six character long.');
      }
      
      if(valid)
      {
        props.login(credentials)
        .catch( (err) => { setErrorMessage(err); } )
      }
  };

  return (
        <Form>
        {(props.errors && props.errors.type === "login" && errorMessage === "") ?  <Alert variant='danger'>{"Incorrect username/password"}</Alert> : ''}
        {errorMessage.count > 0 ? <Alert variant='danger'>{"Some errors occured, please check the prompted fields"}</Alert> : ''}
          <Form.Group controlId="username">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </Form.Group>
          <Button variant="outline-danger" onClick={handleSubmit}>Login</Button>
        </Form>
  );
}

export { LoginForm };