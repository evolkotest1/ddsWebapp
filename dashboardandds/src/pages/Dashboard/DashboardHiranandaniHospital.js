import React, { useState, useEffect, useRef } from "react";
import classes from "./Dashboard.module.css";
import { Table, Button, Spinner, Form, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import axios from "axios";
import { hostAddress } from "../../assets/config";
import { currentServer } from "../../assets/config";
import ReactTextCollapse from "react-text-collapse";
import { Dropdown } from "semantic-ui-react";

const DashboardHiranandaniHospital = (props) => {
  const [triageDetailsTable, setTriageDetailsTable] = useState([]);
  const [triageDetailsTable1, setTriageDetailsTable1] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clinicId, setClinicId] = useState(localStorage.getItem("clinicId"));
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctorsDropdown, setDoctorsDropdown] = useState(null);
  const [selecteddoctorName, setSelecteddoctorName] = useState("");
  const [selecteddoctorId, setSelecteddoctorId] = useState("");
  const [options, setOptions] = useState(null);
  const [docObj, setDocObj] = useState({});
  const [textArea, setTextArea] = useState("");
  const TEXT_COLLAPSE_OPTIONS = {
    collapse: false,
    collapseText: "... Read more",
    expandText: "Read less",
    minHeight: 60,
    maxHeight: 300,
  };
 
  //doctor drp
  const handleTextChange = (docName, docId, label) => {};

  useEffect(() => {
    let data = {
      clinicId: "600054005",
    };
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          currentServer +
          "/RestEasy/DashboardWebService/getDoctorListForOrg",
        data
      )
      .then((response) => {
        console.log("findDoctorByClinic response", response.data);

        let doctors =
          response.data == null || response.data["ptAppointmentOrgList"] == null
            ? []
            : response.data["ptAppointmentOrgList"];
        let doctorsDrodownVar = null;
        localStorage.setItem("allDoctors", JSON.stringify(doctors));
        if (doctors != null && doctors.length > 0 && doctors[0] != null) {
          setSelecteddoctorName(
            localStorage.getItem("doctorName") == null
              ? doctors[0]["doctorName"]
              : localStorage.getItem("doctorName")
          );
          setSelecteddoctorId(
            localStorage.getItem("doctorId") == null
              ? doctors[0]["doctorId"]
              : localStorage.getItem("doctorId")
          );

          doctorsDrodownVar = doctors.map((item) => {
            return (
              <Dropdown.Item
                href="#/action-1"
                onClick={() => {
                  handleTextChange(
                    item["doctorName"],
                    item["doctorId"],
                    "Doctor Name"
                  );
                  setSelecteddoctorName(item["doctorName"]);
                  setSelecteddoctorId(item["doctorId"]);
                }}
              >
                {item["doctorName"]}
              </Dropdown.Item>
            );
          });
          let docDetsObj = {};
          setOptions(
            doctors.map((item) => {
              docDetsObj[item["doctorName"]] = {
                docName: item["doctorName"],
                docId: item["doctorId"],
              };
              return {
                key: item["doctorName"],
                text: item["doctorName"],
                value: item["doctorName"],
                docName: item["doctorName"],
                docId: item["doctorName"],
              };
            })
          );
          setDocObj(docDetsObj);
          setDoctorsDropdown(doctorsDrodownVar);
        }
      })
      .catch((err) => {});
  }, []);

  const handleDropdownChange = (e, data) => {
    let docName = docObj[data.value]["docName"];
    let docId = docObj[data.value]["docId"];

    setDoctorName(docName);
    setDoctorId(docId);
    console.log("doctor=", docName, "+", docId);
  };
  // datepicker
  function handeDatePicker(e) {
    console.log("StartDate:" + e.target.value);
    setStartDate(e.target.value);
  }
  function handeDatePicker1(e) {
    console.log("EndDate:" + e.target.value);
    setEndDate(e.target.value);
  }
  function pad2(n) {
    return n < 10 ? "0" + n : n;
  }
  
  // getTraige data
  useEffect(() => {
    let data, sdate, edate, drpDoctorId;
    if (doctorId == "") {
      drpDoctorId = "0";
    } else {
      drpDoctorId = doctorId;
    }

    if (startDate == "" && endDate == "") {
      let sdateDiffFormat = new Date();
      sdate =
        sdateDiffFormat.getFullYear().toString() +
        "-" +
        pad2(sdateDiffFormat.getMonth() + 1) +
        "-" +
        pad2(sdateDiffFormat.getDate());
      setStartDate(sdate);
      console.log("sdate", sdate);

      let sdateDiffFormat1 = new Date();
      edate =
        sdateDiffFormat1.getFullYear().toString() +
        "-" +
        pad2(sdateDiffFormat1.getMonth() + 1) +
        "-" +
        pad2(sdateDiffFormat1.getDate());
      setEndDate(edate);
      console.log("sdate", edate);

      data = {
        currentDateStr1: sdate,
        currentDateStr2: edate,
        clinicId: "600054005",
        doctorId: drpDoctorId,
      };
    } else {
      data = {
        currentDateStr1: startDate,
        currentDateStr2: endDate,
        clinicId: "600054005",
        doctorId: drpDoctorId,
      };
    }
    console.log("Hiranandani Hospital Data", data);
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          "https://dev2.evolko.com/RestEasy/DashboardWebService/getTriageDetailsForOrg",
        data
      )
      .then((response) => {
        console.log("getTmoReferralsListResponse: ", response.data);
       // let getTriageDetailsResponse = response.data["ptAppointmentOrgList"];
        let triageDataObj =
          response.data == null || response.data["ptAppointmentOrgList"] == null
            ? []
            : response.data["ptAppointmentOrgList"];

        localStorage.setItem("triageDataList", JSON.stringify(triageDataObj));
        
        
         triageDataObj.sort((a,b) => a.patientReferredDate.localeCompare(b.patientReferredDate));
         console.log("getTmoReferralsListResponse sorted", triageDataObj);
      
        let getTriageDetailsTableBody = triageDataObj.map((item) => {
          return (
            <tr>
              <td className="text-left" style={{ whiteSpace: "nowrap" }}>
                {item["patientName"].charAt(0).toUpperCase() + item["patientName"].slice(1)}
              </td>
              <td>{item["patientAge"]}</td>
              <td>{item["patientGender"]}</td>
              <td>{item["patientCity"]}</td>
              <td className="text-left">
                {item["patientTriageDetails"] !== "" ? (
                  <ReactTextCollapse options={TEXT_COLLAPSE_OPTIONS}>
                    {item["patientTriageDetails"]}
                  </ReactTextCollapse>
                ) : null}
              </td>
              <td>{item["patientComplaint"]}</td>
              <td>{item["patientReferredToDoctorName"]}</td>
              <td>{item["patientReferredSpeciality"]}</td>

              {/* <td>{item["patientReferredToDoctorName"]}</td> */}
              <td>{item["patientReferredBy"]}</td>
              <td>{item["patientReferredDate"]}</td>
              <td>{item["patientReferredReplyStatus"]}</td>
            </tr>
          );
        }); 
        let getTriageDetailsTable = (
          <div>
            <Table responsive striped hover id="TriageDetails">
              <thead>
                <tr>
                  <th className="text-left">Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th> City</th>
                  <th className="text-left">Triage Details</th>
                  <th>Complaint</th>
                  <th>Refferred To</th>
                  <th> Referred Speciality </th>

                  {/* <th> Referred Doctor To </th> */}
                  <th> Referred By</th>
                  <th> Referred Date</th>
                  <th> Referred Reply Status</th>
                </tr>
              </thead>
              <tbody>{getTriageDetailsTableBody}</tbody>
            </Table>
          </div>
        );
        setTriageDetailsTable(getTriageDetailsTable);
         //exceldata transformation
         let getTriageDetailsTableBody1 = triageDataObj.map((item) => {
          return (
            <tr>
              <td className="text-left" style={{ whiteSpace: "nowrap" }}>
                {item["patientName"].charAt(0).toUpperCase() + item["patientName"].slice(1)}
              </td>
              <td>{item["patientAge"]}</td>
              <td>{item["patientGender"]}</td>
              <td>{item["patientDistrict"]}</td>
              <td>{item["patientCity"]}</td>
              <td className="text-left">
              {item["patientTriageDetails"]}
              </td>
              <td>{item["patientComplaint"]}</td>
              <td>{item["patientReferredToDoctorName"]}</td>
              {/* <td>{item["patientReferredToDoctorName"]}</td> */}
              <td>{item["patientReferredBy"]}</td>
              <td>{item["patientReferredDate"]}</td> 
              <td>{item["patientReferredReplyStatus"]}</td>
            </tr>
          );
        });
        let getTriageDetailsTable1 = (
          <div>
            <Table responsive striped hover id="TriageDetails1">
              <thead>
                <tr>
                  <th className="text-left">Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>District</th>
                  <th> City</th>
                  <th className="text-left">Triage Details</th>
                  <th>Complaint</th>
                  <th>Refferred To</th>
                  {/* <th> Referred Doctor To </th> */}
                  <th> Referred By</th>
                  <th> Referred Date</th>
                  <th> Referred Reply Status</th>
                </tr>
              </thead>
              <tbody>{getTriageDetailsTableBody1}</tbody>
            </Table>
          </div>
        );
        setTriageDetailsTable1(getTriageDetailsTable1);
      })
      .catch((err) => {
        console.log("err.status");
        console.log("Traige details error", err);
      });
    return () => {};
  }, [startDate, endDate, clinicId, doctorId]);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.tableContainer} style={{ padding: "10px" }}>
        <div className={classes.tableHeader}>
          <div className={classes.tableHeadLeft}> &nbsp;Triage Details </div>
          <div className={classes.tableHeadRight}>
            <Form.Row>
              <Col>
                <Form.Group controlId="">
                  <Form.Label> Select Doctor</Form.Label>
                  <Dropdown
                    placeholder="Select Doctor"
                    search
                    selection
                    options={options}
                    fluid
                    //defaultValue={localStorage.getItem("doctorName")}
                    onChange={handleDropdownChange}
                    className={classes.doctorDropdownSemantic}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    onChange={handeDatePicker}
                    placeholder="Select Start Date"
                    value={startDate}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="">
                  <Form.Label>End Date &nbsp;</Form.Label>
                  <Form.Control
                    type="date"
                    onChange={handeDatePicker1}
                    placeholder="Select End Date"
                    value={endDate}
                  />
                  &nbsp;
                </Form.Group>
              </Col>
              <Col>
                <br></br>
                <ReactHTMLTableToExcel
                  style={("float", "right")}
                  className="btn btn-secondary btnExcel ml-3 mt-2"
                  table="TriageDetails1"
                  filename="HiranandaniTriageReportExcel"
                  sheet="Sheet"
                  buttonText="Download Excel"
                />
              </Col>
            </Form.Row>
          </div>
        </div>
        <div className={classes.tableBody}>{triageDetailsTable}</div>
        <div className={classes.tableBody} style={{ visibility: "collapse" }}>
          {triageDetailsTable1}
        </div>
        <br />
      </div>
    </div>
  );
};
export default DashboardHiranandaniHospital;
