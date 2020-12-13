import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Col } from "react-bootstrap";
import classes from "./Styles.module.css";
import AddModal from "./AddModalPatientDS";
import axios from "axios";

const AddNewPatientModal = (props) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [city, setCty] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [countrycode, setCountrycode] = useState("");
  // populate city data
  useEffect(() => {
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        console.log("getCurrentLocationResponse: ", response.data);
        let data = response.data;
        localStorage.setItem("country", data["country_name"]);
        localStorage.setItem("countrycode", data["country_calling_code"]);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {};
  }, []);


  return (
    <>
      <Button className={classes.addNewBtn} onClick={() => setModalShow(true)}>
        <span>+</span> Add New Patients
      </Button>
      <AddModal
        addPatient={props.addPatient}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default AddNewPatientModal;
