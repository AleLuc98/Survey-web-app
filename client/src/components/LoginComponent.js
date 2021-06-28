import { Form, Button, Alert,Container } from 'react-bootstrap';
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
      if (username === '' || password === '' || password === undefined || password.length < 6) {
        valid = false;
        setErrorMessage('La email non può essere vuota e la password deve essere di almeno 6 caratteri');
      }
      
      if(valid)
      {
        props.login(credentials)
        .catch( (err) => { setErrorMessage(err); } )
      }
  };

  return (
        <Container>
        {(props.errors && props.errors.type === "login" && errorMessage === "") ?  <Alert variant='danger'>{"username/password errati"}</Alert> : ''}
        {errorMessage.length > 0 ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
        <Form className="login">
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
        </Container>
  );
}

export { LoginForm };