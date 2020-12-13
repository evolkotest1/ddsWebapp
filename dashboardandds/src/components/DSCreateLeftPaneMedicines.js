import React, { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./Styles.module.css";
import classes from "../pages/DischargeSummary/DischargeSummary.module.css";
import { Redirect } from "react-router";
import HamburgerDropdown from "./HamburgerDropdown";
import SearchMedicine from "./SearchMedicine";

const DSCreateLeftPaneMedicines = (props) => {
  return (
    <>
      <div className={classes.leftPaneHeaderFix}>
        {/* <div className={classes.leftPaneHeaderDSCreate}>
         
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
        
        </div> */}
        <div className={classes.leftPaneSearchCreatePage}>
          <SearchMedicine
            getSelectedMedFromSearch={props.getSelectedMedFromSearch}
            setLeftContent={props.setLeftContent}
          />
        </div>

        <div className={classes.leftPaneContentCreate}>
          <div className={classes.leftHeaders}>
            <Button
              className={
                props.btnHeaderStyleObj["home"]
                  ? classes.leftHeaderBtnActive
                  : classes.leftHeaderBtnPassive
              }
              variant="success"
              onClick={() => {
                let tempBtnHeaderStyleObj = {};
                tempBtnHeaderStyleObj["home"] = true;
                props.setBtnHeaderStyleObj(tempBtnHeaderStyleObj);
                props.setOnPage("home");
                props.setPrompt(Math.random());
              }}
            >
              Home
            </Button>
            <Button
              className={
                props.btnHeaderStyleObj["favs"]
                  ? classes.leftHeaderBtnActive
                  : classes.leftHeaderBtnPassive
              }
              variant="success"
              onClick={() => {
                let tempBtnHeaderStyleObj = {};
                tempBtnHeaderStyleObj["favs"] = true;
                props.setBtnHeaderStyleObj(tempBtnHeaderStyleObj);
                props.handleFavourites();
              }}
            >
              Favourites
            </Button>
            <Button
              className={
                props.btnHeaderStyleObj["selected"]
                  ? classes.leftHeaderBtnActive
                  : classes.leftHeaderBtnPassive
              }
              onClick={() => {
                let tempBtnHeaderStyleObj = {};
                tempBtnHeaderStyleObj["selected"] = true;
                props.setBtnHeaderStyleObj(tempBtnHeaderStyleObj);
                props.handleSelect();
              }}
              variant="success"
            >
              Selected
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.leftContentScroll}> {props.leftContent}</div>
    </>
  );
};

export default DSCreateLeftPaneMedicines;
