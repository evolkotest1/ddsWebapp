import React, { useState } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Alert,
  InputGroup,
} from "react-bootstrap";
import classes from "./Login.module.css";
import { Redirect } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";
import DischargeSummary from "../DischargeSummary/DischargeSummary";
import SelfRegistrationDoctor from "../../components/SelfRegistrationDoctor";
import axios from "axios";
import { hostAddress } from "../../assets/config";
import { currentServer } from "../../assets/config";
import { useHistory } from "react-router";
import VerifyOtpNumber from "../../components/VerifyOtpNumber";
import ResetPassword from "../../components/ResetPassword";
import ClinicRegistration from "../../components/ClinicRegistration";
const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  //const [username, setUsername] = useState("");
  const [redirect, setRedirect] = useState(null);
  const [validated, setValidated] = useState(false);

  const redirectToSelfRegistration = (event) => {
    setRedirect(
      <Redirect
        to={{
          pathname: "/DoctorSelfRegistration",
        }}
      />
    );
  };
  const redirectToClinicRegistration = (event) => {
    setRedirect(
      <Redirect
        to={{
          pathname: "/clinicRegistration",
        }}
      />
    );
  };

  // let history = useHistory();
  const redirectToReset = () => {
    let data = {
      username: email,
    };
    localStorage.setItem("username", email);
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          "https://dev2.evolko.com/RestEasy/DischargeSummaryWebService/forgotPassword",
        data
      )
      .then((response) => {
        console.log(
          "forget passworddddddddddddddddd: ",
          response.data.successString
        );
        if (response.data.successString !== "Success") {
          alert("User not exists");
        } else {
          alert("Please check your email for re-setting the password");
        }
      })
      .catch((err) => {});
    //  history.push("/ResetPassword");
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
      console.log("user enters credentials", email, pwd);
      let data = {
        username: email,
        password: pwd,
      };
      let roleId;
      axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
      axios
        .put(
          hostAddress +
            currentServer +
            "/RestEasy/DischargeSummaryWebService/login",
          data
        )

        .then((response) => {
          console.log("login api response", response.data);
          let resp = response.data["ptAppointmentOrgList"];
          roleId = resp[0]["roleId"];
          console.log(resp[0]["userId"]);
          console.log("ROLE ID OF USER ", resp[0]["roleId"]);
          if (resp[0]["userId"] != 0) {
            if (resp[0]["roleId"] == "31" || resp[0]["roleId"] == "1") {
              if (resp[0]["roleId"] == "31") {
                localStorage.setItem("userId", resp[0]["userId"]);
              } else if (resp[0]["roleId"] == "1") {
                localStorage.setItem("doctorId", resp[0]["userId"]);
                localStorage.setItem("originalDoctorId", resp[0]["userId"]);
                localStorage.setItem("userId", resp[0]["userId"]);
                localStorage.setItem("userName", resp[0]["userName"]);
                localStorage.setItem(
                  "docSpecialityName",
                  resp[0]["docSpecialityName"]
                );
              }
              localStorage.setItem("email", email);
              localStorage.setItem("roleId", roleId);
              localStorage.setItem("userName", resp[0]["userName"]);
            } else {
              alert("Invalid Credentials");
            }
          } else {
            alert("Invalid Credentials");
          }

          if (localStorage.getItem("email")) {
            let clinicdata = {
              userId: localStorage.getItem("userId"),
              roleId: roleId,
            };
            console.log("clinicdata", clinicdata);
            axios.defaults.headers.common["X-Requested-With"] =
              "XMLHttpRequest";
            axios
              .put(
                hostAddress +
                  currentServer +
                  "/RestEasy/DischargeSummaryWebService/findClinicByUser",
                clinicdata
              )
              .then((response) => {
                console.log("findClinicByUser resp", response);
                if (Object.keys(response.data).length === 0)
                  localStorage.setItem("allClinics", JSON.stringify([]));
                else
                  localStorage.setItem(
                    "allClinics",
                    JSON.stringify(response.data["ptAppointmentOrgList"])
                  );
                setRedirect(<Redirect to="/dischargeSummaryPage" />);
              })
              .catch((err) => {
                console.log("err", err);
              });
          }
        })

        .catch((err) => {
          alert("Invalid");
          console.log("error", err);
        });
    }
    setValidated(true);
  };

  return (
    <div>
      {redirect}
      {localStorage.getItem("email") ? (
        <Redirect to="/dischargeSummaryPage" />
      ) : null}
      <div className={classes.mainContainer}>
        <Card className={classes.loginCard1}>
          <Card.Body>
            <Card.Title className={classes.title}>
              <img
                className={classes.img}
                src={require("../../assets/logo-white.png")}
              />
            </Card.Title>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group
                as={Row}
                controlId="formGridEmail"
                controlId="validationCustom01"
              >
                {/* <Form.Label column sm={4}>
                  {" "}
                  Login
                </Form.Label> */}
                <Col sm={12}>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter your email id"
                    className="mb-3"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                controlId="formGridPassword"
                className="mb-0"
              >
                {/* <Form.Label column sm={4}>
                  Password
                </Form.Label> */}
                <Col sm={12}>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Enter your password"
                    className="mb-3"
                    required
                    onChange={(e) => setPwd(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a password.
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Row className="my-3">
                <Col sm={6}>
                  <Button
                    type="submit"
                    className={classes.btnLogin}
                    variant="primary"
                  >
                    Login
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button
                    type="submit"
                    className={classes.btnLogin}
                    variant="secondary"
                    onClick={redirectToSelfRegistration}
                  >
                    Register Now
                  </Button>
                </Col>
              </Row>
              <Row className="mb-0">
                <Col sm={12}>
                  <Button
                    variant="primary"
                    className={classes.btnRegister}
                    onClick={redirectToClinicRegistration}
                  >
                    <span> Don't have any Clinic? </span> &nbsp; Register Clinic
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <div className={classes.forgotPwd}>
                    <Button variant="primary" onClick={redirectToReset}>
                      Forgot Password?
                    </Button>
                  </div>
                </Col>
                {/* <Col sm={6}>
                  <div className={classes.forgotPwd}>
                    <Button variant="primary" onClick={redirectToClinicRegistration}>
                      Register Clinic
                    </Button>
                  </div>
                </Col> */}
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;
