import React, { useState, useEffect } from "react";
import { Button, Badge } from "react-bootstrap";
import styles from "./Styles.module.css";
import classes from "../pages/DischargeSummary/DischargeSummary.module.css";
import { hostAddress } from "../assets/config";
import { Redirect } from "react-router";
import HamburgerDropdown from "./HamburgerDropdown";
import SearchDiagnosis from "./SearchDiagnosis";
import axios from "axios";
import convert from "xml-js";

const DSCreateLeftPaneToxicity = (props) => {
  const [content, setContent] = useState(null);
  const [prompt, setPrompt] = useState(null);
  useEffect(() => {
    let arr = [
      "Grade 0 - No Adverse event/ within normal limits",
      "Grade 1 - Mild adverse event",
      "Grade 2 - Moderate adverse event",
      "Grade 3 - Severe and undesirable adverse event",
      "Grade 4 - Life threatening/ disabling adverse event",
      "Grade 5 - Death related to an adverse event",
    ];
    let arrContent = arr.map((item) => {
      return (
        <Button
          variant="primary"
          className={
            JSON.parse(localStorage.getItem("toxicityObj")) == null ||
            JSON.parse(localStorage.getItem("toxicityObj"))[item] == null ||
            !JSON.parse(localStorage.getItem("toxicityObj"))[item]
              ? styles.toxicityInactive
              : styles.toxicityActive
          }
          onClick={() => {
            let obj =
              JSON.parse(localStorage.getItem("toxicityObj")) == null ||
              JSON.parse(localStorage.getItem("toxicityObj"))[item] == null
                ? {}
                : JSON.parse(localStorage.getItem("toxicityObj"));
            obj[item] = obj == {} || obj[item] ? false : true;
            localStorage.setItem("toxicityObj", JSON.stringify(obj));
            setPrompt(Math.random());
            props.setCreateDsStateChange(JSON.stringify(obj));
          }}
        >
          {item}
        </Button>
      );
    });
    setContent(
      <div className={styles.scrollleft}>
        <div className={styles.vitalsDiv}>
          <div className={styles.vitalsHead}></div>
          <div className={styles.generalsBody}>{arrContent}</div>
        </div>
        </div>
    );
  }, [props.leftPrompt, prompt]);

  return (
    <>
      {/* <div className={classes.leftPaneHeaderDSCreate}>
        <div className={classes.leftHeaderImageContainer}>
          <img
            alt=""
            className={classes.leftHeaderImage}
            src="https://www.zilliondesigns.com/images/portfolio/healthcare-hospital/iStock-471629610-Converted.png"
          ></img>
        </div>
        <div className={classes.leftHeaderHeading}>
          <div className={classes.leftHeaderHeadingTitle}>
            <Button
              className={classes.createPageClinicNameBtn}
              onClick={() =>
                props.setRedirect(<Redirect to="/dischargeSummaryPage" />)
              }
            >
              {localStorage.getItem("clinicName")}
            </Button>
          </div>
          <div className={classes.leftHeaderSubHeading}>
            {localStorage.getItem("doctorName")}
          </div>
          <div className={classes.leftHeaderSubHeadingRight}>
            {localStorage.getItem("docSpecialityName")}
          </div>
        </div>
        <HamburgerDropdown></HamburgerDropdown>
      </div> */}
      <div className={classes.leftPaneSearchCreatePage}></div>
      <div className={classes.leftPaneContentCreate}>
        <div className={classes.leftHeaders}>
          <div className={styles.phyExamMainHead}>
            <h4>Toxicity</h4>
            <hr />
          </div>
        </div>
        <div className={styles.physicalExamContent}>{content}</div>
      </div>
    </>
  );
};

export default DSCreateLeftPaneToxicity;
