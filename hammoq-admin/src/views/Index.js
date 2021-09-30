import { useState, useEffect } from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  Table,
  Container,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

import Header from "components/Headers/Header.js";
import { Constant, UserService } from '../service/index';
import Loader from '../variables/loader';
import { ToastContainer, toast } from 'react-toastify';

const Index = (props) => {
  const [userData, setUserData] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    setIsLoader(true);
    async function fetchMyAPI() {
      let data = await UserService.getAllUser();
      setIsLoader(false);
      if (data.status === Constant.SUCCESS) {
        setUserData(data.data)
      } else {
        toast.error(data.message, { duration: 500 })
      }
    }

    fetchMyAPI();
  }, []);
  return (
    <>
      <Header />
      <ToastContainer />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">User List</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Country</th>
                    <th scope="col">State</th>
                    <th scope="col">City</th>
                  </tr>
                </thead>
                {
                  isLoader &&
                  <tbody>
                    <tr>
                      <th colSpan="7">
                        <Loader />
                      </th>
                    </tr>
                  </tbody>
                }
                <tbody>
                  {
                    userData.map((user, i) => (
                      <tr key={i}>
                        <td scope="row">{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.country}</td>
                        <td>{user.state}</td>
                        <td>{user.city}</td>
                      </tr>
                    )
                    )
                  }
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
