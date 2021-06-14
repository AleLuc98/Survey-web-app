import {React} from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import { logo, userIcon } from '../icons';

function MyNavbar(props){

    return (
 
            <Navbar bg="danger" variant="dark" expand="sm" fixed="top">
                <Navbar.Brand>
                    {logo}&nbsp;&nbsp;{props.title}
                </Navbar.Brand>
                <Nav>
                    <Dropdown >
                        <Dropdown.Toggle    style={{background: "none", borderStyle: "none"}}>
                            {userIcon}
                        </Dropdown.Toggle>
                         <Dropdown.Menu style={{left:"-100px", fontSize:"14px"}}>
                         {props.user ? <>
                            <Dropdown.Header>
                                Hi, {props.user.name}
                            </Dropdown.Header> 
                            <Dropdown.Item>
                                <Nav.Link style={{color: "black"}} onClick = {()=>props.logout()}>
                                    Logout
                                </Nav.Link>
                            </Dropdown.Item> </>  : 
                        <Dropdown.Item>
                            <Nav.Link style={{color: "black"}} onClick = {()=>props.login()}>
                                Login
                            </Nav.Link>
                        </Dropdown.Item> }
                        </Dropdown.Menu>
                    </Dropdown>
                    
                </Nav>
            </Navbar>

    );
}

export default MyNavbar;