import {React} from 'react';
import { Navbar, Nav, Dropdown} from 'react-bootstrap';
import { logo, userIcon } from '../icons';
import { Link } from 'react-router-dom';


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
                         {props.user ? 
                            <Dropdown.Item as={Link} style={{color: "black"}} to="/" onClick = {()=>{props.logout()}}>
                                    Logout
                            </Dropdown.Item>  : 
                        <Dropdown.Item as={Link} style={{color: "black"}} to="/login" onClick={()=>props.login()}>
                                Login
                        </Dropdown.Item> }
                        </Dropdown.Menu>
                    </Dropdown>
                    
                </Nav>
            </Navbar>

    );
}

export default MyNavbar;