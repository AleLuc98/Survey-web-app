import { Form, Button, Alert,Container } from 'react-bootstrap';
import { useState } from 'react';
import {
  Link,
} from "react-router-dom";
import { homeIcon } from "../icons";


function LoginForm(props) {
  const [username, setUsername] = useState("s281755@polito.it");
  const [password, setPassword] = useState("password");
  const [errorMessage, setErrorMessage] = useState('') ;
  // eslint-disable-next-line no-control-regex
  let emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username: username, password: password };
      
      let valid = true;
      if (username === '' || password === '' || password === undefined || password.length < 6) {
        valid = false;
        setErrorMessage('La email non può essere vuota e la password deve essere di almeno 6 caratteri');
      }

      if (!username.match(emailPattern)){
        valid = false;
        setErrorMessage('Inserire una email valida');
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
        <Link to="/">
        <Button className="home-btn" variant="outline-danger">
          {homeIcon}
        </Button>{" "}
      </Link>
        </Container>
  );
}

export { LoginForm };