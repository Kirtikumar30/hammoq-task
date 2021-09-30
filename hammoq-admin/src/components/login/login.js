import React from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
} from "reactstrap";
import { _isUndefinedOrNull, UserService, Constant, setCurrentUserData } from '../../service/index';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../../variables/loader';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { LinkedIn } from 'react-linkedin-login-oauth2';

import './login.css'

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmit: false,
            email: '',
            password: '',
            isLoader: false,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event, key) => {
        if (key === "email") {
            this.setState({ "email": event })
        } else if (key === "password") {
            this.setState({ "password": event })
        }
    }

    signIn = async () => {
        this.setState({ isLoader: true }, async () => {
            if (!_isUndefinedOrNull(this.state.email) || _isUndefinedOrNull(this.state.password)) {
                let data = await UserService.login(this.state)
                this.setState({ isLoader: false })
                if (data.status === Constant.SUCCESS) {
                    toast.success(data.message, { duration: 500 })
                    setTimeout(() => {
                        setCurrentUserData(data);
                        this.props.history.push(`/admin/index`);
                    }, 2000);
                } else {
                    toast.error(data.message, { duration: 1000 })
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

    render() {
        return (
            <>
                <ToastContainer />
                <Col lg="5" md="7">
                    <Card className="bg-secondary shadow border-0">
                        {
                            this.state.isLoader &&
                            <Loader />

                        }
                        <CardHeader className="bg-transparent px-lg-5 pt-lg-5 pb-lg-3">
                            <div className="text-center text-muted mb-4">
                                <small>sign in with credentials</small>
                            </div>
                            <Form role="form">
                                <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-email-83" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                            placeholder="Email"
                                            type="email"
                                            autoComplete="new-email"
                                            onChange={(e) => this.handleChange(e.target.value, "email")}
                                            value={this.state.email}
                                        />
                                    </InputGroup>
                                    {
                                        (this.state.isSubmit && _isUndefinedOrNull(this.state.email)) &&
                                        <div className="text-danger h5"> Email is Required</div>
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
                                            autoComplete="new-password"
                                            onChange={(e) => this.handleChange(e.target.value, "password")}
                                            value={this.state.password}
                                        />
                                    </InputGroup>
                                    {
                                        (this.state.isSubmit && _isUndefinedOrNull(this.state.password)) &&
                                        <div className="text-danger h5"> Password is Required</div>
                                    }
                                </FormGroup>
                                <div className="text-center">
                                    <Button className="my-4" color="primary" type="button" onClick={e => this.signIn(e)}>
                                        Sign in
                                    </Button>
                                </div>
                            </Form>
                        </CardHeader>
                        <CardBody className="pb-lg-5 pt-0 pb-6">
                            <div className="text-muted text-center mt-2 mb-3">
                                <small>Or Sign in with</small>
                            </div>
                            <div className="btn-wrapper text-center">
                                <Row className="mt-3">
                                    <Col lg="4" md="4">
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
                                        />
                                    </Col>
                                    <Col lg="4" md="4">

                                        <LinkedIn
                                            clientId={Constant.LINKDIN_CLIENT_ID}
                                            onFailure={this.handleFailure}
                                            onSuccess={this.handleSuccess}
                                            redirectUri="http://localhost:3000/"
                                            secrectKey={Constant.LINKDIN_CLIENT_SECRET}
                                        >
                                            <img src={Constant.LINKDIN_BASE_64} className="linkdin-logo-size" alt="Log in" />
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