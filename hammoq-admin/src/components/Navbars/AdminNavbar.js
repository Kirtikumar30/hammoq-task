import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { removeCurrentUserData, getCurrentUserData, Constant, _isUndefinedOrNull } from '../../service/index';
import './adminNav.css'

const userdata = getCurrentUserData(Constant.HAMMOQ_SESSION)

const AdminNavbar = (props) => {
 const logOut = () => {
   removeCurrentUserData();
   props.history.push(`/auth/login`)
 }

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>         
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">                
                  <Media className="ml-2 d-none d-lg-block">
                    {userdata &&
                      <span className="mb-0 text-sm font-weight-bold">
                        {userdata.firstName} {userdata.lastName}
                      </span>
                    }
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem onClick={(e) => logOut()}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
