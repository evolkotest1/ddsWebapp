import React from "react";
import classes from "./Styles.module.css";

const PatientCard = (props) => {
  return (
    <div className={classes.patientCardContainer}>
      <div className={classes.patientCardNameStuff}>
        <div className={classes.patientName}>
          {props.patient["name"]} &nbsp;
          <span>
            {props.patient["age"]}/
            {props.patient["sex"] == null
              ? ""
              : props.patient["sex"].substring(0, 1)}
          </span>
        </div>
        <div className={classes.patientDocName}>
          {props.patient["doctorName"]}
        </div>
      </div>

      <div className={classes.patientDateSmall}>
        {props.patient["dischargeStatus"] == "Draft" ? (
          <h9 style={{ color: "white" }}>Draft</h9>
        ) : null}
        {props.patient["dischargeStatus"] == "Pending Approval" ? (
          <h9 style={{ color: "red" }}>Pending Approval</h9>
        ) : null}
        {props.patient["dischargeStatus"] == "Approved" ? (
          <h9 style={{ color: "green" }}>Approved</h9>
        ) : null}
        {props.patient["dischargeStatus"] == "Approved/Scheduled" ? (
          <h9 style={{ color: "blue" }}>Approved/Scheduled</h9>
        ) : null}
        {props.patient["dischargeStatus"] == "Discharged" ? (
          <h9 style={{ color: "grey" }}>Discharged</h9>
        ) : null}
        <br></br>{" "}
        {props.patient["lastVisit"] == undefined
          ? null
          : props.patient["lastVisit"].substring(0, 12)}
      </div>
    </div>
  );
};

export default PatientCard;
