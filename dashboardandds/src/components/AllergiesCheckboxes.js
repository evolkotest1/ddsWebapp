import React from "react";
import { Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import classes from "../pages/DischargeSummary/DischargeSummary.module.css";
import styles from "./Styles.module.css";

const AllergiesCheckboxes = (props) => {
  const handleCheckBox = (e, label) => {
    let obj =
      localStorage.getItem("allergies") == null
        ? {}
        : JSON.parse(localStorage.getItem("allergies"));
    obj[label] = obj[label] == null || obj[label] == false ? true : false;
    localStorage.setItem("allergies", JSON.stringify(obj));
  };
  return (
    <div>
      <form className={styles.checkboxForm}>
        <div>
          <div>
            <input
              type="checkbox"
              checked={
                localStorage.getItem("allergies") == null ||
                JSON.parse(localStorage.getItem("allergies"))["Drug Allergy"] ==
                  null ||
                !JSON.parse(localStorage.getItem("allergies"))["Drug Allergy"]
                  ? false
                  : true
              }
              onChange={(e) => handleCheckBox(e, "Drug Allergy")}
            />
            <label className={styles.checkboxLabel}>Drug Allergy</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={
                localStorage.getItem("allergies") == null ||
                JSON.parse(localStorage.getItem("allergies"))[
                  "Sulfa drugs allergy"
                ] == null ||
                !JSON.parse(localStorage.getItem("allergies"))[
                  "Sulfa drugs allergy"
                ]
                  ? false
                  : true
              }
              onChange={(e) => handleCheckBox(e, "Sulfa drugs allergy")}
            />
            <label className={styles.checkboxLabel}>Sulfa drugs allergy</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={
                localStorage.getItem("allergies") == null ||
                JSON.parse(localStorage.getItem("allergies"))[
                  "Penecillin allergy"
                ] == null ||
                !JSON.parse(localStorage.getItem("allergies"))[
                  "Penecillin allergy"
                ]
                  ? false
                  : true
              }
              onChange={(e) => handleCheckBox(e, "Penecillin allergy")}
            />
            <label className={styles.checkboxLabel}>Penecillin allergy</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={
                localStorage.getItem("allergies") == null ||
                JSON.parse(localStorage.getItem("allergies"))[
                  "NSAID allergy"
                ] == null ||
                !JSON.parse(localStorage.getItem("allergies"))["NSAID allergy"]
                  ? false
                  : true
              }
              onChange={(e) => handleCheckBox(e, "NSAID allergy")}
            />
            <label className={styles.checkboxLabel}>NSAID allergy</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={
                localStorage.getItem("allergies") == null ||
                JSON.parse(localStorage.getItem("allergies"))["Food Allergy"] ==
                  null ||
                !JSON.parse(localStorage.getItem("allergies"))["Food Allergy"]
                  ? false
                  : true
              }
              onChange={(e) => handleCheckBox(e, "Food Allergy")}
            />
            <label className={styles.checkboxLabel}>Food Allergy</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={
                localStorage.getItem("allergies") == null ||
                JSON.parse(localStorage.getItem("allergies"))[
                  "Pollen Allergy"
                ] == null ||
                !JSON.parse(localStorage.getItem("allergies"))["Pollen Allergy"]
                  ? false
                  : true
              }
              onChange={(e) => handleCheckBox(e, "Pollen Allergy")}
            />
            <label className={styles.checkboxLabel}>Pollen Allergy</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={
                localStorage.getItem("allergies") == null ||
                JSON.parse(localStorage.getItem("allergies"))[
                  "Dust mites Allergy"
                ] == null ||
                !JSON.parse(localStorage.getItem("allergies"))[
                  "Dust mites Allergy"
                ]
                  ? false
                  : true
              }
              onChange={(e) => handleCheckBox(e, "Dust mites Allergy")}
            />
            <label className={styles.checkboxLabel}>Dust mites Allergy</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={
                localStorage.getItem("allergies") == null ||
                JSON.parse(localStorage.getItem("allergies"))[
                  "Animal dander tiny flakes of skin or hair Allergy"
                ] == null ||
                !JSON.parse(localStorage.getItem("allergies"))[
                  "Animal dander tiny flakes of skin or hair Allergy"
                ]
                  ? false
                  : true
              }
              onChange={(e) =>
                handleCheckBox(
                  e,
                  "Animal dander tiny flakes of skin or hair Allergy"
                )
              }
            />
            <label className={styles.checkboxLabel}>
              Animal dander tiny flakes of skin or hair Allergy
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={
                localStorage.getItem("allergies") == null ||
                JSON.parse(localStorage.getItem("allergies"))[
                  "Household Chemicals Allergy"
                ] == null ||
                !JSON.parse(localStorage.getItem("allergies"))[
                  "Household Chemicals Allergy"
                ]
                  ? false
                  : true
              }
              onChange={(e) => handleCheckBox(e, "Household Chemicals Allergy")}
            />
            <label className={styles.checkboxLabel}>
              Household Chemicals Allergy
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={
                localStorage.getItem("allergies") == null ||
                JSON.parse(localStorage.getItem("allergies"))["Mold Allergy"] ==
                  null ||
                !JSON.parse(localStorage.getItem("allergies"))["Mold Allergy"]
                  ? false
                  : true
              }
              onChange={(e) => handleCheckBox(e, "Mold Allergy")}
            />
            <label className={styles.checkboxLabel}>Mold Allergy</label>
          </div>
        </div>
      </form>
      <hr />
    </div>
  );
};

export default AllergiesCheckboxes;
