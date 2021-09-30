import React from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Label,
    Container,
    Row,
    Col,
} from "reactstrap";
import { _isUndefinedOrNull, Constant, getCurrentUserData, UserService, numericValue } from '../../service/index';
import UserHeader from "components/Headers/UserHeader.js";
import './profile.css';
import { BASE_URL } from '../../environment/environment';
import Loader from '../../variables/loader';
import { ToastContainer, toast } from 'react-toastify';
// import Logo from '../../assets/img/dummyDace.jpg'

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserData: {},
            userId: '',
            isUpdate: false,
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            country: '',
            password: '',
            isLoader: false
        };

        this.fileRef = React.createRef(null);
    }
    componentDidMount() {
        let userData = getCurrentUserData(Constant.HAMMOQ_SESSION)
        if (userData && userData._id) {
            this.setState({ userId: userData._id })
            this.getUserData(userData._id)
        }
    }
    getUserData = async (id) => {
        this.setState({ isLoader: true }, async () => {
            let data = await UserService.getUseById(id)
            this.setState({ isLoader: false })
            if (data.status === Constant.SUCCESS) {
                this.setState({ currentUserData: data.data, firstName: data.data["firstName"], lastName: data.data["lastName"], email: data.data["email"], gender: data.data['gender'], phone: data.data["phone"], address: data.data['address'], city: data.data['city'], state: data.data['city'], country: data.data['country'] }, () => {
                })
            }
        })
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
        } else if (key === "address") {
            this.setState({ "address": event })
        } else if (key === "city") {
            this.setState({ "city": event })
        } else if (key === "state") {
            this.setState({ "state": event })
        } else if (key === "country") {
            this.setState({ "country": event })
        } else if (key === "password") {
            this.setState({ "password": event })
        }
    }

    updateProfile = async () => {
        this.setState({}, async () => {
            let obj = {
                firstName: !_isUndefinedOrNull(this.state.firstName) ? this.state.firstName : this.state.currentUserData.firstName,
                lastName: !_isUndefinedOrNull(this.state.lastName) ? this.state.lastName : this.state.currentUserData.lastName,
                email: !_isUndefinedOrNull(this.state.email) ? this.state.email : this.state.currentUserData.email,
                gender: !_isUndefinedOrNull(this.state.gender) ? this.state.gender : this.state.currentUserData.gender,
                phone: !_isUndefinedOrNull(this.state.phone) ? this.state.phone : this.state.currentUserData.phone,
                address: !_isUndefinedOrNull(this.state.address) ? this.state.address : this.state.currentUserData.address,
                city: !_isUndefinedOrNull(this.state.city) ? this.state.city : this.state.currentUserData.city,
                state: !_isUndefinedOrNull(this.state.state) ? this.state.state : this.state.currentUserData.state,
                country: !_isUndefinedOrNull(this.state.country) ? this.state.country : this.state.currentUserData.country,
                password: this.state.password,
            }
            let data = await UserService.updateUseById(obj, this.state.userId)
            if (data.status === Constant.SUCCESS) {
                toast.success(data.message, { duration: 500 })
                this.getUserData(this.state.userId)
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                toast.error(data.message, { duration: 500 })
                this.getUserData(this.state.userId)
            }
        })
    }
    profileUpload = () => {
        console.log("called", this.fileRef.current);
        this.fileRef.current.click();
    }
    onFileChange = async (e) => {
        let files = e.target.files
        let data = await UserService.updateUsePhotoById(files[0], this.state.userId)
        if (data.status === Constant.SUCCESS) {
            toast.success(data.message, { duration: 500 })
            this.getUserData(this.state.userId)
        } else {
            toast.error(data.message, { duration: 500 })
        }
        window.location.reload();
    }

    render() {
        return (
            <>
                <UserHeader data={this.state.currentUserData} />
                <ToastContainer />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row>
                        <Col className="order-xl-1" xl="12">
                            <Card className="bg-secondary shadow">
                                {
                                    this.state.isLoader &&
                                    <Loader />
                                }
                                <CardHeader className="bg-white border-0">
                                    <Row className="align-items-center">
                                        <Col xs="8">
                                            <h3 className="mb-0">User Profile</h3>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <h6 className="heading-small text-muted mb-4">
                                            User information
                                        </h6>
                                        <div className="pl-lg-4">
                                            <Row>
                                                <Col lg="6">
                                                    <div className="mb-3">
                                                        <input type="file" name="file" ref={this.fileRef} onChange={(e) => this.onFileChange(e)} accept="image/*" hidden />
                                                        {
                                                            this.state.currentUserData && this.state.currentUserData.photo &&
                                                            <img
                                                                alt="profile" width="120" onClick={this.profileUpload}
                                                                className="user-photo img-size media-object rounded-circle"
                                                                src={BASE_URL + this.state.currentUserData.photo}
                                                            />
                                                        }{
                                                            (!this.state.currentUserData || !this.state.currentUserData.photo) &&
                                                            <div className="c-user-photo media-object rounded-circle" onClick={this.profileUpload}></div>
                                                        }
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-first-name"
                                                        >
                                                            First name
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-first-name"
                                                            placeholder="First name"
                                                            type="text"
                                                            defaultValue={this.state.currentUserData.firstName}
                                                            onChange={(e) => this.handleChange(e.target.value, "firstName")}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-last-name"
                                                        >
                                                            Last name
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-last-name"
                                                            placeholder="Last name"
                                                            type="text"
                                                            defaultValue={this.state.currentUserData.lastName}
                                                            onChange={(e) => this.handleChange(e.target.value, "lastName")}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-email"
                                                        >
                                                            Email address
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-email"
                                                            placeholder="abc@example.com"
                                                            type="email"
                                                            defaultValue={this.state.currentUserData.email}
                                                            onChange={(e) => this.handleChange(e.target.value, "email")}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-userPhone"
                                                        >
                                                            Gender
                                                        </label>
                                                        <div className="col-form-label ml-4">
                                                            <Label className="mr-5">
                                                                <Input type="radio" name="gender" value="male" checked={(this.state.gender == "male") ? true : false} onChange={(e) => this.handleChange(e.target.value, "gender")} />
                                                                Male
                                                            </Label>
                                                            <Label>
                                                                <Input type="radio" name="gender" value="female" checked={(this.state.gender == "female") ? true : false} onChange={(e) => this.handleChange(e.target.value, "gender")} />
                                                                Female
                                                            </Label>
                                                        </div>
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                        </div>
                                        <hr className="my-4" />
                                        {/* Address */}
                                        <h6 className="heading-small text-muted mb-4">
                                            Contact information
                                        </h6>
                                        <div className="pl-lg-4">
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-address"
                                                        >
                                                            Address
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-address"
                                                            placeholder="Home Address"
                                                            type="text"
                                                            defaultValue={this.state.currentUserData.address}
                                                            onChange={(e) => this.handleChange(e.target.value, "address")}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-userPhone"
                                                        >
                                                            Phone Number
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-userPhone"
                                                            placeholder="userPhone"
                                                            type="number"
                                                            defaultValue={this.state.currentUserData.phone}
                                                            onKeyPress={(e) => numericValue(e.target.value)}
                                                            onChange={(e) => this.handleChange(e.target.value, "phone")}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-city"
                                                        >
                                                            City
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-city"
                                                            placeholder="City"
                                                            type="text"
                                                            defaultValue={this.state.currentUserData.city}
                                                            onChange={(e) => this.handleChange(e.target.value, "city")}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-country"
                                                        >
                                                            State
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-state"
                                                            placeholder="State"
                                                            type="text"
                                                            defaultValue={this.state.currentUserData.state}
                                                            onChange={(e) => this.handleChange(e.target.value, "state")}
                                                        />

                                                    </FormGroup>
                                                </Col>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-country"
                                                        >
                                                            Country
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            defaultValue={this.state.currentUserData.country}
                                                            id="input-country"
                                                            placeholder="Country"
                                                            type="text"
                                                            onChange={(e) => this.handleChange(e.target.value, "country")}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="6">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-password"
                                                        >
                                                            Password
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-password"
                                                            placeholder="Password"
                                                            type="password"
                                                            onChange={(e) => this.handleChange(e.target.value, "password")}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Button
                                                        color="info"
                                                        className="float-right"
                                                        onClick={(e) => this.updateProfile(e)}
                                                    >
                                                        Update profile
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}