import React from 'react';
import {
    Button,
    Card,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Label,
    Row,
    Col,
} from "reactstrap";
import { _isUndefinedOrNull, UserService, Constant, setCurrentUserData } from '../../service/index';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../variables/loader';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import './register.css'

export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmit: false,
            firstName: '',
            lastName: '',
            email: '',
            gender: 'male',
            phone: '',
            password: '',
            isLoader: false
        };

        this.handleChange = this.handleChange.bind(this);
    }
    createUser = (event) => {
        event.preventDefault();
        this.setState({ isSubmit: true }, async () => {
            if (!_isUndefinedOrNull(this.state.firstName) || !_isUndefinedOrNull(this.state.lastName) || !_isUndefinedOrNull(this.state.email) || !_isUndefinedOrNull(this.state.phone) || !_isUndefinedOrNull(this.state.password)) {
                let userData = await UserService.register(this.state);
                if (userData.status === Constant.SUCCESS) {
                    toast.success(userData.message, { duration: 500 })
                    setTimeout(() => {
                        this.props.history.push(`/auth/login`);
                    }, 2000);
                } else {
                    toast.error(userData.message, { duration: 500 })
                }
            }
        })

    }

    responseGoogle = (response) => {
        if (response && response.profileObj) {
            let dataObj = {
                firstName: response.profileObj["givenName"],
                lastName: response.profileObj["familyName"],
                email: response.profileObj["email"],
                gender: (response.profileObj["gender"]) ? (response.profileObj["gender"]) : '',
                phone: (response.profileObj["givenName"]) ? (response.profileObj["givenName"]) : '',
                password: '',
            }
            this.signInWithGoogle(dataObj)
        }
    }

    responseFacebook = (response) => {
        console.log(response);
        // let dataObj = {
        //     firstName: response.profileObj["givenName"],
        //     lastName: response.profileObj["familyName"],
        //     email: response.profileObj["email"],
        //     gender: (response.profileObj["gender"]) ? (response.profileObj["gender"]) : '',
        //     phone: (response.profileObj["givenName"]) ? (response.profileObj["givenName"]) : '',
        //     password: '',
        // }
    }

    componentClicked = (response) => {
        console.log(response);
    }
    handleFailure = () => {

    }
    handleSuccess = (response) => {
        console.log("linkdin", response);
    }

    signInWithGoogle = async (dataObj) => {
        let data = await UserService.loginWithGoogle(dataObj)
        if (data.status === Constant.SUCCESS) {
            toast.success(data.message, { duration: 500 })
            setTimeout(() => {
                setCurrentUserData(data);
                this.props.history.push(`/admin/index`);
            }, 2000);
        } else {
            toast.error(data.message, { duration: 100 })
        }
    }

    handleChange = (event, key) => {

        if (key === "firstName") {
            this.setState({ "firstName": event })
        } else if (key === "lastName") {
            this.setState({ "lastName": event })
        } else if (key === "email") {
            this.setState({ "email": event })
        } else if (key === "gender") {
            this.setState({ "gender": event })
        } else if (key === "phone") {
            this.setState({ "phone": event })
        } else if (key === "password") {
            this.setState({ "password": event })
        }

    }
    render() {
        return (
            <>
                {
                    this.state.isLoader &&
                    <Loader />
                }
                <ToastContainer />
                <Col lg="6" md="8">
                    <Card className="bg-secondary shadow border-0">
                        {
                            this.state.isLoader &&
                            <Loader />
                        }
                        <CardBody className="px-lg-5 py-lg-5">
                            <Form role="form" name="registerForm" onSubmit={this.createUser}>
                                <FormGroup>
                                    <InputGroup className="input-group-alternative mb-2 ">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-hat-3" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input placeholder="First Name" type="text" name="firstName"
                                            onChange={(e) => this.handleChange(e.target.value, "firstName")}
                                            value={this.state.firstName}
                                        />
                                    </InputGroup>
                                    {
                                        (this.state.isSubmit && _isUndefinedOrNull(this.state.firstName)) &&
                                        <div className="text-danger h5"> FirstName Required</div>
                                    }
                                </FormGroup>
                                <FormGroup>
                                    <InputGroup className="input-group-alternative mb-2">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-hat-3" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input placeholder="Last Name" type="text" name="lastName"
                                            onChange={(e) => this.handleChange(e.target.value, "lastName")}
                                        />
                                    </InputGroup>
                                    {
                                        (this.state.isSubmit && _isUndefinedOrNull(this.state.lastName)) &&
                                        <div className="text-danger h5"> LastName Required</div>
                                    }
                                </FormGroup>
                                <FormGroup>
                                    <InputGroup className="input-group-alternative mb-2">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-email-83" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Email"
                                            type="email"
                                            name="email"
                                            onChange={(e) => this.handleChange(e.target.value, "email")}
                                        />
                                    </InputGroup>
                                    {
                                        (this.state.isSubmit && _isUndefinedOrNull(this.state.email)) &&
                                        <div className="text-danger h5"> Email Required</div>
                                    }
                                </FormGroup>
                                <FormGroup>
                                    <div className="row">
                                        <legend className="col-form-label col-sm-3">Gender</legend>
                                        <div className="col-form-label col-sm-9">
                                            <Label className="mr-5">
                                                <Input type="radio" name="gender" value="male" checked={(this.state.gender === "male") ? true : false} onChange={(e) => this.handleChange(e.target.value, "gender")} />
                                                Male
                                            </Label>
                                            <Label>
                                                <Input type="radio" name="gender" value="female" checked={(this.state.gender === "female") ? true : false} onChange={(e) => this.handleChange(e.target.value, "gender")} />
                                                Female
                                            </Label>
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-mobile-button" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Phone Number"
                                            type="text"
                                            name="phone"
                                            value={this.state.phone}
                                            onChange={(e) => this.handleChange(e.target.value, "phone")}
                                        />
                                    </InputGroup>
                                    {
                                        (this.state.isSubmit && _isUndefinedOrNull(this.state.phone)) &&
                                        <div className="text-danger h5"> Phone Number Required</div>
                                    }
                                </FormGroup>
                                <FormGroup>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-lock-circle-open" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Password"
                                            type="password"
                                            name="password"
                                            value={this.state.password}
                                            autoComplete="new-password"
                                            onChange={(e) => this.handleChange(e.target.value, "password")}
                                        />
                                    </InputGroup>
                                    {
                                        (this.state.isSubmit && _isUndefinedOrNull(this.state.password)) &&
                                        <div className="text-danger h5"> Password Required</div>
                                    }
                                </FormGroup>
                                <div className="text-center">
                                    <Button className="mt-4" color="primary" type="buttom">
                                        Create account
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                        <CardBody className="pb-lg-5 pt-0 pb-6">
                            <div className="text-muted text-center mt-2 mb-3">
                                <small>Or Sign-Up with</small>
                            </div>
                            <div className="btn-wrapper text-center">
                                <Row className="mt-3">
                                    <Col lg="2" md="2"></Col>
                                    <Col lg="2" md="2">
                                        <FacebookLogin
                                            appId={Constant.FACEBOOK_CLIENT_ID}
                                            fields="name,email,picture"
                                            scope="public_profile, email"
                                            // onClick={this.componentClicked}
                                            callback={this.responseFacebook}
                                            autoLoad={false}
                                            icon="fa fa-facebook fa-lg"
                                            textButton={null}
                                        >
                                        </FacebookLogin>
                                    </Col>
                                    <Col lg="4" md="4">
                                        <GoogleLogin
                                            clientId={Constant.GOOGLE_CLIENT_ID}
                                            buttonText="Google"
                                            onSuccess={this.responseGoogle}
                                            onFailure={this.responseGoogle}
                                            cookiePolicy={'single_host_origin'}
                                            style={{ fontSize: "12px" }}
                                            icon="fa fa-facebook fa-lg"
                                        />
                                    </Col>
                                    <Col lg="2" md="2">

                                        <LinkedIn
                                            clientId={Constant.LINKDIN_CLIENT_ID}
                                            onFailure={this.handleFailure}
                                            onSuccess={this.handleSuccess}
                                            redirectUri="http://localhost:3000/"
                                            secrectKey={Constant.LINKDIN_CLIENT_SECRET}
                                        >
                                            <img src={Constant.LINKDIN_BASE_64} alt="Log in" className="linkdin-logo-size" />
                                        </LinkedIn>

                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </>
        );
    }
}