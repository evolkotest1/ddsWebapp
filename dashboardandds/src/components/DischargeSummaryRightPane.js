import React, { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import { hostAddress } from "../assets/config";
import { currentServer } from "../assets/config";
import styles from "./Styles.module.css";
import { Redirect } from "react-router";
import classes from "../pages/DischargeSummary/DischargeSummary.module.css";
import MedicineBar from "./MedicineBar";
import DraggableCardsDS from "./DraggableCardsDS";
import { Badge, Button, Card, Dropdown, Form, Row, Col } from "react-bootstrap";
import AddDraggableSectionModal from "./AddDraggableSectionModal";
import EditDraggableSectionModal from "./EditDraggableSectionModal";
import { Label } from "reactstrap";
import DatePicker from "react-datepicker";
import ReadMoreTextArea from "./ReadMoreTextArea";
import DraggableSectionHeading from "./DraggableSectionHeading";
import PatientInformation from "./PatientInformation";
import AllergiesCheckboxes from "./AllergiesCheckboxes";
import VitalsOnAdmissionTable from "./VitalsOnAdmissionTable";
import VitalsOnDischargeTable from "./VitalsOnDischargeTable";
import GynTable from "./GynTable";
import FollowupTable from "./FollowupTable";
import PhysicalExamTable from "./PhysicalExamTable";
import ConditionAtDischargeCheckboxes from "./ConditionAtDischargeCheckboxes";
import DispositionTable from "./DispositionTable";
import ProcedureTable from "./ProcedureTable";
import ActivityOrdersTable from "./ActivityOrdersTable";
import TherapyTable from "./TherapyTable";
import DietaryInstructionsTable from "./DietaryInstructionsTable";
import DSUploadManager from "./DSUploadManager";
import DSCreateManageSectionsModal from "./DSCreateManageSectionsModal";
import DropdownToggle from "react-bootstrap/DropdownToggle";

const useConstructor = (callBack = () => {}) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
};

const DischargeSummaryRightPane = (props) => {
  const [toggleValue, setToggleValue] = useState();
  const [healthRadarMsg, setHealthRadarMsg] = useState(null);
  const [healthRadarSelected, setHealthRadarSelected] = useState();
  const handleRemoveSection = (label) => {
    let cardStates =
      localStorage.getItem("cardStates") == null
        ? {}
        : JSON.parse(localStorage.getItem("cardStates"));
    let cardsLabel = JSON.parse(localStorage.getItem("cardsLabel"));
    if (cardStates == {}) {
      cardsLabel.forEach((card) => {
        cardStates[card] = true;
      });
    }
    cardStates[label] = false;
    localStorage.setItem("cardStates", JSON.stringify(cardStates));

    // localStorage.setItem("deletedSection", label);
    // cardsLabel.splice(cardsLabel.indexOf(label), 1);
    // setCardsLabel(cardsLabel);
    // localStorage.setItem("cardsLabel", JSON.stringify(cardsLabel));
  };
  const handleCardStyling = (label) => {
    cardStyler = {};
    cardStyler[label] = true;
    localStorage.setItem("cardStyler", JSON.stringify(cardStyler));
    setCardStylerStr(label);
    setPrompt(Math.random());
  };
  const toggle = (props) => {
    let newTog = document.getElementById("custom-switch").checked;
    let tog = localStorage.getItem("toggleValue");
    localStorage.setItem("toggleValue", newTog);
    setHealthRadarSelected(!healthRadarSelected);
    if (tog == null) {
      document.getElementById("dropOne").disabled = false;
      document.getElementById("enroll").style.visibility = "hidden";
    }
    if (tog) {
      document.getElementById("dropOne").disabled = false;
      document.getElementById("enroll").style.visibility = "hidden";
    }
    if (newTog == false) {
      setHealthRadarMsg(null);
      document.getElementById("dropOne").disabled = true;
      document.getElementById("enroll").style.visibility = "hidden";
      document.getElementById("dropOne").value = "Select";
      localStorage.setItem("radarDuration", "select");
    }
  };
  let tog = localStorage.getItem("toggleValue");
  const getSelValue = () => {
    var getDropOne = document.getElementById("dropOne").value;
    console.log("getDropOne", getDropOne);

    if (getDropOne == "select") {
      console.log("getDropOne selecteddddddddddddddddddd");
      document.getElementById("enroll").style.visibility = "hidden";
    } else {
      console.log("getDropOne notttttttttt sele");

      document.getElementById("enroll").style.visibility = "visible";
    }
    localStorage.setItem("radarDuration", getDropOne);
    // localStorage.getItem("radarDuration") == "select"
    //   ? setHealthRadarMsg(null)
    //   : setHealthRadarMsg(
    //       "Active -General Health for " + localStorage.getItem("radarDuration")
    //     );

    console.log(
      "getDroplocallllllllllllOne",
      localStorage.getItem("radarDuration")
    );
  };

  const setNotification = () => {
    // var str =
    //   "you are enrolling " +
    //   patient["name"] +
    //   " for " +
    //   localStorage.getItem("radarDuration");
    // console.log("getDropOne strrrrrrrrrr" + str);
    if (document.getElementById("dropOne").value == "select") {
    } else {
      localStorage.getItem("radarDuration") == "select"
        ? setHealthRadarMsg(null)
        : setHealthRadarMsg(
            "Active -General Health for " +
              localStorage.getItem("radarDuration")
          );
    }
  };

  let patient = JSON.parse(localStorage.getItem("patient"));
  let isGyn =
    patient != null &&
    patient["sex"] == "Female" &&
    patient["age"].substring(0, patient["age"].length - 1) >= 18 &&
    patient["age"].substring(0, patient["age"].length - 1) <= 45;
  const [cardsLabel, setCardsLabel] = useState([]);
  const [secHeadings, setSecHeadings] = useState({});
  const [cardsString, setCardsString] = useState("");
  const [cards, setCards] = useState([]);
  const [prompt, setPrompt] = useState(0);
  const [pageUpdate, setPageUpdate] = useState("");
  const [cardStylerStr, setCardStylerStr] = useState("");
  let diagnosisOnAdmission =
    JSON.parse(localStorage.getItem("diagnosisOnAdmission")) == null
      ? null
      : JSON.parse(localStorage.getItem("diagnosisOnAdmission")).map((item) => {
          return (
            <div className={styles.diagnosisDiv}>
              <Badge pill variant="warning" className={styles.diagnosisBadge}>
                {item}
              </Badge>
              <i
                className={[styles.crossBtn, "fa fa-close"].join(" ")}
                onClick={() => removeElementDiagnosis(item)}
              ></i>
            </div>
          );
        });
  let advisedInvestigations =
    JSON.parse(localStorage.getItem("advisedInvestigations")) == null
      ? null
      : JSON.parse(localStorage.getItem("advisedInvestigations")).map(
          (item) => {
            return (
              <div className={styles.diagnosisDiv}>
                <Badge pill variant="warning" className={styles.diagnosisBadge}>
                  {item}
                </Badge>
                <i
                  className={[styles.crossBtn, "fa fa-close"].join(" ")}
                  onClick={() => removeElementInvestigation(item)}
                ></i>
              </div>
            );
          }
        );
  let physicalExamOnAdmissionObj = JSON.parse(
    localStorage.getItem("physicalExamOnAdmissionObj")
  );
  let l1disp, l2disp, l3disp, l4disp;
  let physicalExamOnAdmissionContent =
    physicalExamOnAdmissionObj == null
      ? null
      : (l1disp = Object.keys(physicalExamOnAdmissionObj).map((l1) => {
          let l1Obj = physicalExamOnAdmissionObj[l1];
          l2disp = Object.keys(l1Obj).map((l2) => {
            let l2Obj = l1Obj[l2];
            l3disp = Object.keys(l2Obj).map((l3) => {
              let l3Obj = l2Obj[l3];
              l4disp = Object.keys(l3Obj).map((l4) => {
                if (l3Obj[l4]) {
                  console.log("phyexmdisp", l1, l2, l3, l4);
                  return l4;
                } else return null;
              });
              let l4dispArr = [];
              l4disp.forEach((item) => {
                if (item != null) l4dispArr.push(item);
              });

              if (l4dispArr.length > 0)
                return (
                  <>
                    <h6>
                      {l3}: {l4dispArr.toString()}
                    </h6>
                  </>
                );
            });
            let l3dispArr = [];
            l3disp.forEach((item) => {
              if (item != null) l3dispArr.push(item);
            });
            console.log("l3dispArr", l3dispArr);
            if (l3dispArr.length > 0)
              return (
                <>
                  <br />
                  <h5>{l2}</h5>
                  {l3dispArr}
                </>
              );
          });
          let l2dispArr = [];
          l2disp.forEach((item) => {
            if (item != null) l2dispArr.push(item);
          });
          console.log("l2dispArr", l2dispArr);
          if (l2dispArr.length > 0)
            return (
              <Card className={styles.phyExamRightCard}>
                <Card.Body>
                  <h4>{l1}</h4>
                  {l2disp}
                </Card.Body>
              </Card>
            );
        }));
  let diagnosisOnAdmissionStr =
    JSON.parse(localStorage.getItem("diagnosisOnAdmission")) == null
      ? ""
      : localStorage.getItem("diagnosisOnAdmission");
  let physicalExamOnAdmissionContentStr =
    JSON.parse(localStorage.getItem("physicalExamOnAdmissionObj")) == null
      ? ""
      : localStorage.getItem("physicalExamOnAdmissionObj");
  let advisedInvestigationsStr =
    JSON.parse(localStorage.getItem("advisedInvestigations")) == null
      ? ""
      : localStorage.getItem("advisedInvestigations");
  let dietaryInstructionsContent =
    JSON.parse(localStorage.getItem("dietaryInstructions")) == null
      ? []
      : Object.keys(
          JSON.parse(localStorage.getItem("dietaryInstructions"))
        ).map((item) => {
          if (
            item != null &&
            item != "" &&
            JSON.parse(localStorage.getItem("dietaryInstructions"))[item]
          )
            return (
              <div className={styles.diagnosisDiv}>
                <Badge pill variant="warning" className={styles.diagnosisBadge}>
                  {item}
                </Badge>
                <i
                  className={[styles.crossBtn, "fa fa-close"].join(" ")}
                  onClick={() => {
                    removeElementDietAndOthers(
                      "dietaryInstructions",
                      "Dietary Instructions",
                      item
                    );
                  }}
                ></i>
              </div>
            );
        });
  let dietaryInstructionsContentStr =
    localStorage.getItem("dietaryInstructions") == null
      ? ""
      : localStorage.getItem("dietaryInstructions");
  let conditionAtDischargeContent =
    JSON.parse(localStorage.getItem("conditionAtDischarge")) == null
      ? []
      : Object.keys(
          JSON.parse(localStorage.getItem("conditionAtDischarge"))
        ).map((item) => {
          if (JSON.parse(localStorage.getItem("conditionAtDischarge"))[item])
            return (
              <div className={styles.diagnosisDiv}>
                <Badge pill variant="warning" className={styles.diagnosisBadge}>
                  {item}
                </Badge>
                <i
                  className={[styles.crossBtn, "fa fa-close"].join(" ")}
                  onClick={() => {
                    removeElementDietAndOthers(
                      "conditionAtDischarge",
                      "Condition at Discharge",
                      item
                    );
                  }}
                ></i>
              </div>
            );
        });
  let conditionAtDischargeContentStr =
    localStorage.getItem("conditionAtDischarge") == null
      ? ""
      : localStorage.getItem("conditionAtDischarge");
  let chiefComplaintContent =
    JSON.parse(localStorage.getItem("chiefComplaintObj")) == null
      ? null
      : Object.keys(JSON.parse(localStorage.getItem("chiefComplaintObj"))).map(
          (item) => {
            if (JSON.parse(localStorage.getItem("chiefComplaintObj"))[item])
              return (
                <div className={styles.diagnosisDiv}>
                  <Badge
                    pill
                    variant="warning"
                    className={styles.diagnosisBadge}
                  >
                    {item}
                  </Badge>
                </div>
              );
            else return null;
          }
        );
  let chiefComplaintContentStr =
    localStorage.getItem("chiefComplaintObj") == null
      ? ""
      : localStorage.getItem("chiefComplaintObj");
  let toxicityContent =
    JSON.parse(localStorage.getItem("toxicityObj")) == null
      ? null
      : Object.keys(JSON.parse(localStorage.getItem("toxicityObj"))).map(
          (item) => {
            if (JSON.parse(localStorage.getItem("toxicityObj"))[item])
              return (
                <div className={styles.diagnosisDiv}>
                  <Badge
                    pill
                    variant="warning"
                    className={styles.diagnosisBadge}
                  >
                    {item}
                  </Badge>
                </div>
              );
            else return null;
          }
        );
  let toxicityContentStr =
    localStorage.getItem("toxicityObj") == null
      ? ""
      : localStorage.getItem("toxicityObj");
  let siteContent =
    JSON.parse(localStorage.getItem("siteObj")) == null
      ? null
      : Object.keys(JSON.parse(localStorage.getItem("siteObj"))).map((item) => {
          if (JSON.parse(localStorage.getItem("siteObj"))[item])
            return (
              <div className={styles.diagnosisDiv}>
                <Badge pill variant="warning" className={styles.diagnosisBadge}>
                  {item}
                </Badge>
              </div>
            );
          else return null;
        });
  let siteContentStr =
    localStorage.getItem("siteObj") == null
      ? ""
      : localStorage.getItem("siteObj");
  let pastMedicalHistoryContent =
    JSON.parse(localStorage.getItem("pastMedicalHistoryObj")) == null
      ? null
      : Object.keys(
          JSON.parse(localStorage.getItem("pastMedicalHistoryObj"))
        ).map((item) => {
          let itemObj = JSON.parse(
            localStorage.getItem("pastMedicalHistoryObj")
          )[item];
          if (itemObj[Object.keys(itemObj)[0]])
            return (
              <div className={styles.diagnosisDiv}>
                <Badge pill variant="warning" className={styles.diagnosisBadge}>
                  {item}: {Object.keys(itemObj)[0]}
                </Badge>
                {/* <i
                  className={[styles.crossBtn, "fa fa-close"].join(" ")}
                  onClick={() => {
                    removeElementHistory(
                      "pastMedicalHistoryObj",
                      "Past Medical History",
                      item,
                      Object.keys(itemObj)[0]
                    );
                  }}
                ></i> */}
              </div>
            );
          else return null;
        });
  let pastMedicalHistoryContentStr =
    localStorage.getItem("pastMedicalHistoryObj") == null
      ? ""
      : localStorage.getItem("pastMedicalHistoryObj");

  let pastSurgicalHistoryContent =
    JSON.parse(localStorage.getItem("pastSurgicalHistoryObj")) == null
      ? null
      : Object.keys(
          JSON.parse(localStorage.getItem("pastSurgicalHistoryObj"))
        ).map((item) => {
          let itemObj = JSON.parse(
            localStorage.getItem("pastSurgicalHistoryObj")
          )[item];
          if (itemObj[Object.keys(itemObj)[0]])
            return (
              <div className={styles.diagnosisDiv}>
                <Badge pill variant="warning" className={styles.diagnosisBadge}>
                  {item}: {Object.keys(itemObj)[0]}
                </Badge>
                {/* <i
                    className={[styles.crossBtn, "fa fa-close"].join(" ")}
                    onClick={() => {
                      removeElementHistory(
                        "pastMedicalHistoryObj",
                        "Past Medical History",
                        item,
                        Object.keys(itemObj)[0]
                      );
                    }}
                  ></i> */}
              </div>
            );
          else return null;
        });
  let pastSurgicalHistoryContentStr =
    localStorage.getItem("pastSurgicalHistoryObj") == null
      ? ""
      : localStorage.getItem("pastSurgicalHistoryObj");

  let familyHistoryContent =
    JSON.parse(localStorage.getItem("familyHistoryObj")) == null
      ? null
      : Object.keys(JSON.parse(localStorage.getItem("familyHistoryObj"))).map(
          (item) => {
            let itemObj = JSON.parse(localStorage.getItem("familyHistoryObj"))[
              item
            ];
            let itemValues = Object.keys(itemObj).map((ele) => {
              console.log("damn", ele, itemObj);
              if (itemObj[ele]) return <> {ele} </>;
              else return null;
            });
            return (
              <div className={styles.diagnosisDiv}>
                <Badge pill variant="warning" className={styles.diagnosisBadge}>
                  {item}:{itemValues}
                </Badge>
              </div>
            );
          }
        );
  let familyHistoryContentStr =
    localStorage.getItem("familyHistoryObj") == null
      ? ""
      : localStorage.getItem("familyHistoryObj");

  let historyOfPresentIllnessAndObsProfileContent =
    JSON.parse(localStorage.getItem("historyOfPresentIllnessObj")) == null
      ? null
      : Object.keys(
          JSON.parse(localStorage.getItem("historyOfPresentIllnessObj"))
        ).map((page) => {
          let itemObj = JSON.parse(
            localStorage.getItem("historyOfPresentIllnessObj")
          )[page];
          let cardContent = Object.keys(itemObj).map((ele) => {
            return (
              <div className={styles.hisObsDiv}>
                {ele}: {itemObj[ele]}
              </div>
            );
          });
          return (
            <Card className={styles.historyObsCard}>
              <Card.Body>
                <h4>{page}</h4>
                {cardContent}
              </Card.Body>
            </Card>
          );
        });
  let historyOfPresentIllnessAndObsProfileContentStr =
    localStorage.getItem("historyOfPresentIllnessObj") == null
      ? ""
      : localStorage.getItem("historyOfPresentIllnessObj");

  let dispositionToContent =
    JSON.parse(localStorage.getItem("dischargedTo")) == null
      ? []
      : Object.keys(JSON.parse(localStorage.getItem("dischargedTo"))).map(
          (item) => {
            if (
              item != null &&
              item != "" &&
              JSON.parse(localStorage.getItem("dischargedTo"))[item]
            )
              return (
                <div className={styles.diagnosisDiv}>
                  <Badge
                    pill
                    variant="warning"
                    className={styles.diagnosisBadge}
                  >
                    {item}
                  </Badge>
                  <i
                    className={[styles.crossBtn, "fa fa-close"].join(" ")}
                    onClick={() => {
                      removeElementDietAndOthers(
                        "dischargedTo",
                        "Discharged To",
                        item
                      );
                    }}
                  ></i>
                </div>
              );
          }
        );

  let dispositionToContentStr =
    localStorage.getItem("dischargedTo") == null
      ? ""
      : localStorage.getItem("dischargedTo");

  let activityOrdersContent =
    JSON.parse(localStorage.getItem("activityOrders")) == null
      ? []
      : Object.keys(JSON.parse(localStorage.getItem("activityOrders"))).map(
          (item) => {
            if (
              item != null &&
              item != "" &&
              JSON.parse(localStorage.getItem("activityOrders"))[item]
            )
              return (
                <div className={styles.diagnosisDiv}>
                  <Badge
                    pill
                    variant="warning"
                    className={styles.diagnosisBadge}
                  >
                    {item}
                  </Badge>
                  <i
                    className={[styles.crossBtn, "fa fa-close"].join(" ")}
                    onClick={() => {
                      removeElementDietAndOthers(
                        "activityOrders",
                        "Activity Orders",
                        item
                      );
                    }}
                  ></i>
                </div>
              );
          }
        );
  let activityOrdersContentStr =
    localStorage.getItem("activityOrders") == null
      ? ""
      : localStorage.getItem("activityOrders");
  let therapyOrdersContent =
    JSON.parse(localStorage.getItem("therapyOrders")) == null
      ? []
      : Object.keys(JSON.parse(localStorage.getItem("therapyOrders"))).map(
          (item) => {
            if (
              item != null &&
              item != "" &&
              JSON.parse(localStorage.getItem("therapyOrders"))[item]
            )
              return (
                <div className={styles.diagnosisDiv}>
                  <Badge
                    pill
                    variant="warning"
                    className={styles.diagnosisBadge}
                  >
                    {item}
                  </Badge>
                  <i
                    className={[styles.crossBtn, "fa fa-close"].join(" ")}
                    onClick={() => {
                      removeElementDietAndOthers(
                        "therapyOrders",
                        "Therapy Orders",
                        item
                      );
                    }}
                  ></i>
                </div>
              );
          }
        );
  let therapyOrdersContentStr =
    localStorage.getItem("therapyOrders") == null
      ? ""
      : localStorage.getItem("therapyOrders");
  let treatmentProtocolContent =
    localStorage.getItem("selectedTreatmentProtocol") == null ? null : (
      <div className={styles.diagnosisDiv}>
        <Badge pill variant="warning" className={styles.diagnosisBadge}>
          {localStorage.getItem("selectedTreatmentProtocol")}
        </Badge>
      </div>
    );
  let treatmentProtocolContentStr = localStorage.getItem(
    "selectedTreatmentProtocol"
  );
  let cardStyler =
    localStorage.getItem("cardStyler") == null
      ? {}
      : JSON.parse(localStorage.getItem("cardStyler"));

  let cardsObjDefault = {
    "Patient Information": (
      <div
        className={
          cardStyler["Patient Information"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Patient Information");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <DraggableSectionHeading label="Patient Information" />
        </div>
        <PatientInformation
          setPrompt={setPrompt}
          dateOfDischarge={props.dateOfDischarge}
          setDateOfDischarge={props.setDateOfDischarge}
          dateOfAdmission={props.dateOfAdmission}
          setDateOfAdmission={props.setDateOfAdmission}
        ></PatientInformation>
        <ReadMoreTextArea
          localStorageId={_.camelCase("PatientInformation")}
          style={!cardStyler["PatientInformation"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Chief Complaint": (
      <div
        className={
          cardStyler["Chief Complaint"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Chief Complaint");
          props.setLeftPaneLabel("Chief Complaint");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Chief Complaint" />
            <EditDraggableSectionModal
              secName="Chief Complaint"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Chief Complaint");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>{chiefComplaintContent}</div>
        <ReadMoreTextArea
          localStorageId="chiefComplaint"
          style={!cardStyler["Chief Complaint"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    Toxicity: (
      <div
        className={
          cardStyler["Toxicity"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          props.setLeftPaneLabel("Toxicity");
          handleCardStyling("Toxicity");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Toxicity" />
            <EditDraggableSectionModal
              secName="Toxicity"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Toxicity");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>{toxicityContent}</div>

        <ReadMoreTextArea
          localStorageId={_.camelCase("Toxicity")}
          style={!cardStyler["Toxicity"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    Site: (
      <div
        className={
          cardStyler["Site"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          props.setLeftPaneLabel("Site");
          handleCardStyling("Site");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Site" />
            <EditDraggableSectionModal
              secName="Site"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Site");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>{siteContent}</div>

        <ReadMoreTextArea
          localStorageId={_.camelCase("Site")}
          style={!cardStyler["Site"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Past Medical History": (
      <div
        className={
          cardStyler["Past Medical History"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          props.setLeftPaneLabel("Past Medical History");
          handleCardStyling("Past Medical History");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Past Medical History" />
            <EditDraggableSectionModal
              secName="Past Medical History"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Past Medical History");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>
          {pastMedicalHistoryContent}
        </div>

        <ReadMoreTextArea
          localStorageId={_.camelCase("Past Medical History")}
          style={!cardStyler["Past Medical History"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Past Surgical History": (
      <div
        className={
          cardStyler["Past Surgical History"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          props.setLeftPaneLabel("Past Surgical History");
          handleCardStyling("Past Surgical History");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Past Surgical History" />
            <EditDraggableSectionModal
              secName="Past Surgical History"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Past Surgical History");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>
          {pastSurgicalHistoryContent}
        </div>
        <ReadMoreTextArea
          localStorageId={_.camelCase("Past Surgical History")}
          style={!cardStyler["Past Surgical History"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Family History": (
      <div
        className={
          cardStyler["Family History"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          props.setLeftPaneLabel("Family History");
          handleCardStyling("Family History");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Family History" />
            <EditDraggableSectionModal
              secName="Family History"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Family History");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>{familyHistoryContent}</div>
        <ReadMoreTextArea
          localStorageId={_.camelCase("Family History")}
          style={!cardStyler["Family History"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Physical Exam on Admission": (
      <div
        className={
          cardStyler["Physical Exam on Admission"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          props.setLeftPaneLabel("PhysicalExam");
          handleCardStyling("Physical Exam on Admission");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Physical Exam on Admission" />
            <EditDraggableSectionModal
              secName="Physical Exam on Admission"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Physical Exam on Admission");
            }}
          ></i>
        </div>
        <div className={styles.phyExamCardsParent}>
          {physicalExamOnAdmissionContent}
        </div>
        <ReadMoreTextArea
          localStorageId={_.camelCase("Physical Exam on Admission")}
          style={
            !cardStyler["Physical Exam on Admission"] ? "greyBackground" : ""
          }
        ></ReadMoreTextArea>
      </div>
    ),
    "Vitals on Admission": (
      <div
        className={
          cardStyler["Vitals on Admission"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Vitals on Admission");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Vitals on Admission" />
            <EditDraggableSectionModal
              secName="Vitals on Admission"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Vitals on Admission");
            }}
          ></i>
        </div>
        <VitalsOnAdmissionTable></VitalsOnAdmissionTable>
        <ReadMoreTextArea
          localStorageId={_.camelCase("Vitals on Admission")}
          style={!cardStyler["Vitals on Admission"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Investigations at the Hospital": (
      <div
        className={
          cardStyler["Investigations at the Hospital"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Investigations at the Hospital");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Investigations at the Hospital" />
            <EditDraggableSectionModal
              secName="Investigations at the Hospital"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Investigations at the Hospital");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId={_.camelCase("Investigations at the Hospital")}
          style={
            !cardStyler["Investigations at the Hospital"]
              ? "greyBackground"
              : ""
          }
        ></ReadMoreTextArea>
      </div>
    ),
    "Procedure Done": (
      <div
        className={
          cardStyler["Procedure Done"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Procedure Done");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Procedure Done" />
            <EditDraggableSectionModal
              secName="Procedure Done"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Procedure Done");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId={_.camelCase("Procedure Done")}
          style={!cardStyler["Procedure Done"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Procedure Findings": (
      <div
        className={
          cardStyler["Procedure Findings"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Procedure Findings");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Procedure Findings" />
            <EditDraggableSectionModal
              secName="Procedure Findings"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Procedure Findings");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId={_.camelCase("Procedure Findings")}
          style={!cardStyler["Procedure Findings"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Course in the Hospital": (
      <div
        className={
          cardStyler["Course in the Hospital"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Course in the Hospital");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Course in the Hospital" />
            <EditDraggableSectionModal
              secName="Course in the Hospital"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Course in the Hospital");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId={_.camelCase("Course in the Hospital")}
          style={!cardStyler["Course in the Hospital"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Vitals on Discharge": (
      <div
        className={
          cardStyler["Vitals on Discharge"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Vitals on Discharge");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Vitals on Discharge" />
            <EditDraggableSectionModal
              secName="Vitals on Discharge"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Vitals on Discharge");
            }}
          ></i>
        </div>
        <VitalsOnDischargeTable></VitalsOnDischargeTable>
        <ReadMoreTextArea
          localStorageId={_.camelCase("Vitals on Discharge")}
          style={!cardStyler["Vitals on Discharge"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Advice on Discharge": (
      <div
        className={
          cardStyler["Advice on Discharge"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Advice on Discharge");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Advice on Discharge" />
            <EditDraggableSectionModal
              secName="Advice on Discharge"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Advice on Discharge");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId={_.camelCase("Advice on Discharge")}
          style={!cardStyler["Advice on Discharge"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "HealthRADAR Monitoring (Duration, Condition)": (
      <div
        className={
          cardStyler["HealthRADAR Monitoring (Duration, Condition)"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("HealthRADAR Monitoring (Duration, Condition)");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div className={styles.sameLineRadar}>
            <div className={styles.radarTitle}>
              <DraggableSectionHeading label="HealthRADAR Monitoring (Duration, Condition)" />
              <EditDraggableSectionModal
                secName="HealthRADAR Monitoring (Duration, Condition)"
                secHeadings={secHeadings}
                setSecHeadings={setSecHeadings}
                setCardsString={setCardsString}
              ></EditDraggableSectionModal>
            </div>
            <Form>
              <Form.Check
                type="switch"
                id="custom-switch"
                label=""
                onClick={toggle}
              />
            </Form>
            <div className={styles.sameLineRadarRight}>
              <i
                className={[styles.crossBtn, "fa fa-close"].join(" ")}
                onClick={() => {
                  handleRemoveSection(
                    "HealthRADAR Monitoring (Duration, Condition)"
                  );
                }}
              ></i>
            </div>
          </div>
        </div>

        <Row className={styles.drpbox}>
          <Col lg={3}>
            <select
              id="dropOne"
              onChange={getSelValue}
              disabled={
                localStorage.getItem("toggleValue") == "true" ? false : true
              }
              value={
                healthRadarSelected
                  ? localStorage.getItem("radarDuration")
                  : null
              }
            >
              <option value="select">Select</option>
              <option value="1 week">1 week</option>
              <option value="2 week">2 week</option>
              <option value="6 week">6 week</option>
              <option value="12 week">12 week</option>
              <option value="52 week">52 week</option>
            </select>
          </Col>
          <Col lg={3}>
            <Button
              id="enroll"
              style={{ visibility: "hidden" }}
              className={styles.uploadImgBtn}
              onClick={() => setNotification()}
            >
              Enroll
            </Button>
          </Col>
          <Col lg={5}>{healthRadarMsg}</Col>
        </Row>
        <ReadMoreTextArea
          localStorageId={_.camelCase(
            "HealthRADAR Monitoring (Duration, Condition)"
          )}
          style={
            !cardStyler["HealthRADAR Monitoring (Duration, Condition)"]
              ? "greyBackground"
              : ""
          }
        ></ReadMoreTextArea>
      </div>
    ),
    "Obs Profile": (
      <div
        className={
          cardStyler["Obs Profile"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => handleCardStyling("Obs Profile")}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Obs Profile" />
            <EditDraggableSectionModal
              secName="Obs Profile"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Obs Profile");
            }}
          ></i>
        </div>
        <GynTable setPrompt={setPrompt}></GynTable>
        <ReadMoreTextArea
          localStorageId="gyneAndObs"
          style={!cardStyler["Obs Profile"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),

    "History of Present Illness": (
      <div
        className={
          cardStyler["History of Present Illness"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("History of Present Illness");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="History of Present Illness" />
            <EditDraggableSectionModal
              secName="History of Present Illness"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("History of Present Illnes");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId="historyOfPresentIllness"
          style={
            !cardStyler["History of Present Illness"] ? "greyBackground" : ""
          }
        ></ReadMoreTextArea>
      </div>
    ),

    "History of Present Illness & Obs Profile": (
      <div
        className={
          cardStyler["History of Present Illness & Obs Profile"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          props.setLeftPaneLabel("History of Present Illness & Obs Profile");
          handleCardStyling("History of Present Illness & Obs Profile");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="History of Present Illness & Obs Profile" />
            <EditDraggableSectionModal
              secName="History of Present Illness & Obs Profile"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("History of Present Illness & Obs Profile");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>
          {historyOfPresentIllnessAndObsProfileContent}
        </div>
        <ReadMoreTextArea
          localStorageId="historyOfPresentIllness"
          style={
            !cardStyler["History of Present Illness & Obs Profile"]
              ? "greyBackground"
              : ""
          }
        ></ReadMoreTextArea>
      </div>
    ),
    "Menstrual/Obstetric History": (
      <div
        className={
          cardStyler["Menstrual/Obstetric History"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => handleCardStyling("Menstrual/Obstetric History")}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Menstrual/Obstetric History" />
            <EditDraggableSectionModal
              secName="Menstrual/Obstetric History"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Menstrual/Obstetric History");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId="menstrualObstetricHistory"
          style={
            !cardStyler["Menstrual/Obstetric History"] ? "greyBackground" : ""
          }
        ></ReadMoreTextArea>
      </div>
    ),
    "Diagnosis On Admission": (
      <div
        className={
          cardStyler["Diagnosis On Admission"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Diagnosis On Admission");
          props.setLeftPaneLabel("Diagnosis");
        }}
      >
        <div
          className={[
            styles.sectionHeader,
            styles.instructionsAndCoTextDiv,
          ].join(" ")}
        >
          <div>
            <DraggableSectionHeading label="Diagnosis On Admission" />
            <EditDraggableSectionModal
              secName="Diagnosis On Admission"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            <div className={styles.diagnosisDivParent}>
              {diagnosisOnAdmission}
            </div>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Diagnosis On Admission");
            }}
          ></i>
        </div>
        {/* <div className={styles.instructionsAndCoTextDivDiag}></div> */}
        <ReadMoreTextArea
          localStorageId="diagnosisOnAdmissionText"
          style={!cardStyler["Diagnosis On Admission"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Diagnosis On Discharge": (
      <div
        className={
          cardStyler["Diagnosis On Discharge"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Diagnosis On Discharge");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Diagnosis On Discharge" />
            <EditDraggableSectionModal
              secName="Diagnosis On Discharge"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Diagnosis On Discharge");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId="diagnosisOnDischarge"
          style={!cardStyler["Diagnosis On Discharge"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    Allergies: (
      <div
        className={
          cardStyler["Allergies"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Allergies");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Allergies" />
            <EditDraggableSectionModal
              secName="Allergies"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Allergies");
            }}
          ></i>
        </div>
        <AllergiesCheckboxes></AllergiesCheckboxes>
        {/* <ReadMoreTextArea
          label="allergies"
          localStorageId="allergiesText"
          style={!cardStyler["Allergies"] ? "greyBackground" : ""}
        ></ReadMoreTextArea> */}
      </div>
    ),
    "Course Label": (
      <div className={styles.instuctionsAndAtStuffHeading}>
        <DraggableSectionHeading label="Course Label" />
        <EditDraggableSectionModal
          secName="Course Label"
          secHeadings={secHeadings}
          setSecHeadings={setSecHeadings}
          setCardsString={setCardsString}
        ></EditDraggableSectionModal>
      </div>
    ),
    Procedures: (
      <div
        className={
          cardStyler["Procedures"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => handleCardStyling("Procedures")}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Procedures" />
            <EditDraggableSectionModal
              secName="Procedures"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Procedures");
            }}
          ></i>
        </div>
        <ProcedureTable></ProcedureTable>
        {/* <ReadMoreTextArea localStorageId="procedures"></ReadMoreTextArea> */}
      </div>
    ),
    Findings: (
      <div
        className={
          cardStyler["Findings"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => handleCardStyling("Findings")}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Findings" />
            <EditDraggableSectionModal
              secName="Findings"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Findings");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId="findings"
          style={!cardStyler["Findings"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),

    "Lab tests": (
      <div
        className={
          cardStyler["Lab tests"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => handleCardStyling("Lab tests")}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Lab tests" />
            <EditDraggableSectionModal
              secName="Lab tests"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Lab tests");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId="labTests"
          style={!cardStyler["Lab tests"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),

    Complications: (
      <div
        className={
          cardStyler["Complications"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => handleCardStyling("Complications")}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Complications" />
            <EditDraggableSectionModal
              secName="Complications"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Complications");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId="complications"
          style={!cardStyler["Complications"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Treatment Given": (
      <div
        className={
          cardStyler["Treatment Given"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Treatment Given");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Treatment Given" />
            <EditDraggableSectionModal
              secName="Treatment Given"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>

            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Treatment Given");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId="treatmentGiven"
          style={!cardStyler["Treatment Given"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Treatment Protocol": (
      <div
        className={
          cardStyler["Treatment Protocol"]
            ? styles.createPageBarActive
            : styles.createPageBarActiveGrey
        }
        onClick={() => {
          handleCardStyling("Treatment Protocol");
          props.setLeftPaneLabel("Treatment Protocol");
        }}
      >
        <div className={styles.treatmentProtocolCard}>
          <div className={styles.sectionHeader}>
            <div>
              <DraggableSectionHeading label="Treatment Protocol" />
              <EditDraggableSectionModal
                secName="Treatment Protocol"
                secHeadings={secHeadings}
                setSecHeadings={setSecHeadings}
                setCardsString={setCardsString}
              ></EditDraggableSectionModal>

              {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
            </div>
            <i
              className={[styles.crossBtn, "fa fa-close"].join(" ")}
              onClick={() => {
                handleRemoveSection("Treatment Protocol");
              }}
            ></i>
          </div>
          <div className={styles.diagnosisDivParent}>
            {treatmentProtocolContent}
          </div>

          {/* <ReadMoreTextArea 
          localStorageId="treatmentProtocol"
          style={!cardStyler["Treatment Protocol"] ? "greyBackground" : ""}
        ></ReadMoreTextArea> */}
        </div>
      </div>
    ),
    "Discharge Label": (
      <div className={styles.instuctionsAndAtStuffHeading}>
        <DraggableSectionHeading label="Discharge Label" />
      </div>
    ),
    "Vitals At Discharge": (
      <div
        className={
          cardStyler["Vitals At Discharge"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Vitals At Discharge");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Vitals at Discharge" />
            <EditDraggableSectionModal
              secName="Vitals at Discharge"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Vitals at Discharge");
            }}
          ></i>
        </div>
        <VitalsOnDischargeTable></VitalsOnDischargeTable>
      </div>
    ),
    "Instructions Label": (
      <div className={styles.instuctionsAndAtStuffHeading}>
        <DraggableSectionHeading label="Instructions Label" />
        <EditDraggableSectionModal
          secName="Instructions Label"
          secHeadings={secHeadings}
          setSecHeadings={setSecHeadings}
          setCardsString={setCardsString}
        ></EditDraggableSectionModal>
      </div>
    ),
    "Physical Exam at Discharge": (
      <div
        className={
          cardStyler["Physical Exam at Discharge"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Physical Exam At Discharge");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        {" "}
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Physical Exam at Discharge" />
            <EditDraggableSectionModal
              secName="Physical Exam at Dischargee"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{physicalExamContent}</div> */}
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Physical Exam at Discharge");
            }}
          ></i>
        </div>
        <PhysicalExamTable></PhysicalExamTable>
        {/* <ReadMoreTextArea localStorageId="physicalExamAtDischarge"></ReadMoreTextArea> */}
      </div>
    ),
    "Discharged To": (
      <div
        className={
          cardStyler["Discharged To"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => handleCardStyling("Discharged To")}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Discharged To" />
            <EditDraggableSectionModal
              secName="Discharged To"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Discharged To");
            }}
          ></i>
        </div>
        <DispositionTable></DispositionTable>
        {/* <ReadMoreTextArea localStorageId="disposition"></ReadMoreTextArea> */}
      </div>
    ),
    "Instructions Label": (
      <div className={styles.instuctionsAndAtStuffHeading}>
        <DraggableSectionHeading label="Instructions Label" />
        <EditDraggableSectionModal
          secName="Instructions Label"
          secHeadings={secHeadings}
          setSecHeadings={setSecHeadings}
          setCardsString={setCardsString}
        ></EditDraggableSectionModal>
      </div>
    ),
    "Advised Investigations": (
      <div
        className={
          cardStyler["Advised Investigations"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Advised Investigations");
          props.setLeftPaneLabel("Investigation");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Advised Investigations" />
            <EditDraggableSectionModal
              secName="Advised Investigations"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            <div className={styles.diagnosisDivParent}>
              {advisedInvestigations}
            </div>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Advised Investigations");
            }}
          ></i>
        </div>
        <ReadMoreTextArea
          localStorageId="advisedInvestigationss"
          style={!cardStyler["Advised Investigations"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Medications at Discharge": (
      <MedicineBar
        setLeftContent={props.setLeftContent}
        mediToAddArr={props.mediToAddArr}
        handleFavourites={props.handleFavourites}
        onPage={props.onPage}
        setMediArr={props.setMediArr}
        setMediToAddArr={props.setMediToAddArr}
        setMediObj={props.setMediObj}
        setMediObjWithBrack={props.setMediObjWithBrack}
        mediObjWithBrack={props.mediObjWithBrack}
        mediObj={props.mediObj}
        setPrompt={props.setPrompt}
        setLeftPaneLabel={props.setLeftPaneLabel}
        secName="Medications at Discharge"
        secHeadings={secHeadings}
        setSecHeadings={setSecHeadings}
        setCardsString={setCardsString}
        cardStyler={cardStyler}
        handleCardStyling={handleCardStyling}
        handleRemoveSection={handleRemoveSection}
      ></MedicineBar>
    ),
    // "Medications at Discharge Notes": (
    //   <div
    //     className={
    //       cardStyler["Medications at Discharge Notes"]
    //         ? styles.createPageBarActive
    //         : styles.createPageBarActiveGrey
    //     }
    //     onClick={() => {
    //       handleCardStyling("Medications at Discharge Notes");
    //       // props.setLeftPaneLabel("LandingLeftDSC");
    //     }}
    //   >
    //     <div className={styles.sectionHeader}>
    //       <div>
    //         <DraggableSectionHeading label="Medications at Discharge Notes" />
    //         <EditDraggableSectionModal
    //           secName="Medications at Discharge Notes"
    //           secHeadings={secHeadings}
    //           setSecHeadings={setSecHeadings}
    //           setCardsString={setCardsString}
    //         ></EditDraggableSectionModal>
    //       </div>
    //       <i
    //         className={[styles.crossBtn, "fa fa-close"].join(" ")}
    //         onClick={() => {
    //           handleRemoveSection("Medications at Discharge Notes");
    //         }}
    //       ></i>
    //     </div>
    // <ReadMoreTextArea
    //   localStorageId="medicationsAtDischargeNotes"
    //   style={
    //     !cardStyler["Medications at Discharge Notes"]
    //       ? "greyBackground"
    //       : ""
    //   }
    // ></ReadMoreTextArea>
    //   </div>
    // ),
    "Condition at Discharge": (
      <div
        className={
          cardStyler["Condition at Discharge"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Condition at Discharge");
          props.setLeftPaneLabel("Condition at Discharge");
        }}
      >
        {" "}
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Condition at Discharge" />
            <EditDraggableSectionModal
              secName="Condition at Dischargee"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Condition at Discharge");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>
          {conditionAtDischargeContent}
        </div>
        {/* <ConditionAtDischargeCheckboxes></ConditionAtDischargeCheckboxes> */}
        <ReadMoreTextArea
          localStorageId="conditionAtDischargeTextArea"
          style={!cardStyler["Condition at Discharge"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Discharged To": (
      <div
        className={
          cardStyler["Discharged To"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Discharged To");
          props.setLeftPaneLabel("Discharged To");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Discharged To" />
            <EditDraggableSectionModal
              secName="Discharged To"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Discharged To");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>{dispositionToContent}</div>
        <ReadMoreTextArea
          localStorageId={_.camelCase("DischargedToTextArea")}
          style={!cardStyler["Discharged To"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Activity Orders": (
      <div
        className={
          cardStyler["Activity Orders"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Activity Orders");
          props.setLeftPaneLabel("Activity Orders");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Activity Orders" />
            <EditDraggableSectionModal
              secName="Activity Orders"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Activity Orders");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>{activityOrdersContent}</div>

        {/* <ActivityOrdersTable></ActivityOrdersTable> */}
        <ReadMoreTextArea
          localStorageId="activityOrdersTextArea"
          style={!cardStyler["Activity Orders"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Therapy Orders": (
      <div
        className={
          cardStyler["Therapy Orders"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Therapy Orders");
          props.setLeftPaneLabel("Therapy Orders");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Therapy Orders" />
            <EditDraggableSectionModal
              secName="Therapy Orders"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            {/* <div className={styles.diagnosisDivParent}>{diagnosisOnAdmission}</div> */}
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Therapy Orders");
            }}
          ></i>
        </div>
        <div className={styles.diagnosisDivParent}>{therapyOrdersContent}</div>
        {/* <TherapyTable></TherapyTable> */}
        <ReadMoreTextArea
          localStorageId="therapyOrdersTextArea"
          style={!cardStyler["Therapy Orders"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Dietary Instructions": (
      <div
        className={
          cardStyler["Dietary Instructions"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Dietary Instructions");
          props.setLeftPaneLabel("Dietary Instructions");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Dietary Instructions" />
            <EditDraggableSectionModal
              secName="Dietary Instructions"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
            <div className={styles.diagnosisDivParent}>
              {dietaryInstructionsContent}
            </div>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Dietary Instructions");
            }}
          ></i>
        </div>
        {/* <DietaryInstructionsTable></DietaryInstructionsTable> */}
        <ReadMoreTextArea
          localStorageId="dietaryInstructionsTextArea"
          style={!cardStyler["Dietary Instructions"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),
    "Plans for Medical Follow-up": (
      <div
        className={
          cardStyler["Plans for Medical Follow-up"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Plans for Medical Follow-up");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Plans for Medical Follow-up" />
            <EditDraggableSectionModal
              secName="Plans for Medical Follow-up"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Plans for Medical Follow-up");
            }}
          ></i>
        </div>
        <FollowupTable setPrompt={setPrompt}></FollowupTable>
        <ReadMoreTextArea
          localStorageId="plansForMedicalFollowUp"
          style={
            !cardStyler["Plans for Medical Follow-up"] ? "greyBackground" : ""
          }
        ></ReadMoreTextArea>
      </div>
    ),
    "Attached Images": (
      <div
        className={
          cardStyler["Attached Images"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Attached Images");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Attached Images" />
            <EditDraggableSectionModal
              secName="Attached Images"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Attached Images");
            }}
          ></i>
        </div>
        <div className="pt-2">
          <DSUploadManager />
        </div>
        <ReadMoreTextArea
          localStorageId="attachedImages"
          style={!cardStyler["Attached Images"] ? "greyBackground" : ""}
        ></ReadMoreTextArea>
      </div>
    ),

    "Patient's Signature": (
      <div
        className={
          cardStyler["Patient's Signature"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Patient's Signature");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Patient's Signature" />
            <EditDraggableSectionModal
              secName="Patient's Signature"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Patient's Signature");
            }}
          ></i>
        </div>
        <div
          className={[
            styles.instructionsAndCoTextDiv,
            styles.greyBackground,
          ].join(" ")}
        >
          <div className={styles.ptSignText}>
            I have received all relevant documents and records
          </div>
          <textarea
            placeholder={
              localStorage.getItem("patientsSignature") == null ||
              localStorage.getItem("patientsSignature") === ""
                ? "Sign Here"
                : localStorage.getItem("patientsSignature")
            }
            className={[
              styles.instructionsAndCoTextbox,
              styles.greyBackground,
            ].join(" ")}
            onChange={(e) => {
              localStorage.setItem("patientsSignatureText", e.target.value);
            }}
          ></textarea>
          <br />
          <br />
        </div>
      </div>
    ),
    "Doctor's Signature": (
      <div
        className={
          cardStyler["Doctor's Signature"]
            ? styles.createPageBarActive
            : styles.createPageBarActivePatient
        }
        onClick={() => {
          handleCardStyling("Doctor's Signature");
          props.setLeftPaneLabel("LandingLeftDSC");
        }}
      >
        <div className={styles.sectionHeader}>
          <div>
            <DraggableSectionHeading label="Doctor's Signature" />
            <EditDraggableSectionModal
              secName="Doctor's Signature"
              secHeadings={secHeadings}
              setSecHeadings={setSecHeadings}
              setCardsString={setCardsString}
            ></EditDraggableSectionModal>
          </div>
          <i
            className={[styles.crossBtn, "fa fa-close"].join(" ")}
            onClick={() => {
              handleRemoveSection("Doctor's Signature");
            }}
          ></i>
        </div>
        <div
          className={[
            styles.instructionsAndCoTextDiv,
            styles.greyBackground,
          ].join(" ")}
        >
          <textarea
            placeholder={
              localStorage.getItem("doctorsSignature") == null ||
              localStorage.getItem("doctorsSignature") === ""
                ? "Sign Here"
                : localStorage.getItem("doctorsSignature")
            }
            className={[
              styles.instructionsAndCoTextbox,
              styles.greyBackground,
            ].join(" ")}
            onChange={(e) => {
              localStorage.setItem("doctorsSignature", e.target.value);
            }}
          ></textarea>
        </div>
      </div>
    ),
  };

  useConstructor(() => {
    let getSpecialityForDoctorData = {
      doctorId: localStorage.getItem("doctorId"),
    };
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          currentServer +
          "/RestEasy/DischargeSummaryWebService/getSpecialityForDoctor",
        getSpecialityForDoctorData
      )
      .then((response) => {
        console.log("getSpecialityForDoctor resp", response.data);
        localStorage.setItem("specialityId", response.data["speciality_id"]);
        if (response.data["speciality_name"] == "Obstetrics & Gynecology")
          isGyn = isGyn & true;
        else isGyn = false;
        let isOnco =
          response.data["speciality_name"] == "Radiation Oncology"
            ? true
            : false;
        let data = {
          userId: localStorage.getItem("userId"),
          doctorId: localStorage.getItem("doctorId"),
        };
        axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        axios
          .put(
            hostAddress +
              currentServer +
              "/RestEasy/DischargeSummaryWebService/fetchDsCardsSequence",
            data
          )
          .then((response) => {
            console.log("fetchDsCardsSequence response", response.data);
            let cardseqJson = response.data["cardSequence"];
            let cardseqarr = [null, null];
            if (cardseqJson != "")
              cardseqarr = JSON.parse(response.data["cardSequence"]);
            console.log("fetchDsCardsSequencearr", cardseqarr);
            let respCardsLabel = cardseqarr[0];
            let respSecHeadings = cardseqarr[1];
            if (true || respSecHeadings == null || respSecHeadings == {}) {
              setSecHeadings({
                "Patient Information": "Patient Information",
                "Chief Complaint": "Chief Complaint",
                Toxicity: "Toxicity",
                Site: "Site",
                "Obs Profile": "Obs Profile",
                "History of Present Illness & Obs Profile":
                  "History of Present Illness & Obs Profile",
                "History of Present Illness": "History of Present Illness",
                "Menstrual/Obstetric History": "Menstrual/Obstetric History",
                "Diagnosis On Admission": "Diagnosis On Admission",
                "Diagnosis On Discharge": "Diagnosis On Discharge",
                Allergies: "Allergies",
                "Course Label": "Course in Hospital",
                Findings: "Findings",
                "Lab tests": "Lab tests",
                Procedures: "Procedures",
                Complications: "Complications",
                "Treatment Given": "Treatment Given",
                "Treatment Protocol": "Treatment Protocol",
                "Discharge Label": "At the time of Discharge",
                "Vitals on Discharge": "Vitals on Discharge",
                "Physical Exam at Discharge": "Physical Exam at Discharge",
                "Condition at Discharge": "Condition at Discharge",
                "Discharged To": "Discharged To",
                "Instructions Label":
                  "Instructions to Patient and Family at Discharge",

                "Advised Investigations": "Advised Investigations",
                "Medications at Discharge": "Medications at Discharge",
                "Medications at Discharge Notes":
                  "Medications at Discharge Notes",
                "Activity Orders": "Activity Orders",
                "Therapy Orders": "Therapy Orders",
                "Dietary Instructions": "Dietary Instructions",
                "Plans for Medical Follow-up": "Plans for Medical Follow-up",
                "Attached Images": "Attached Images",
                "Patient's Signature": "Patient's Signature",
                "Doctor's Signature": "Doctor's Signature",
                "Past Medical History": "Past Medical History",
                "Past Surgical History": "Past Surgical History",
                "Family History": "Family History",
                "Physical Exam on Admission": "Physical Exam on Admission",
                "Vitals on Admission": "Vitals on Admission",
                "Investigations at the Hospital":
                  "Investigations at the Hospital",
                "Procedure Done": "Procedure Done",
                "Procedure Findings": "Procedure Findings",
                "Course in the Hospital": "Course in the Hospital",
                "HealthRADAR Monitoring (Duration, Condition)":
                  "HealthRADAR Monitoring (Duration, Condition)",
                "Advice on Discharge": "Advice on Discharge",
                "Medications at Discharge": "Medications at Discharge",
                "Discharged To": "Discharged To",
              });
            } else {
              setSecHeadings(respSecHeadings);
            }
            if (false && respCardsLabel != "" && respCardsLabel != null) {
              // if (isGyn) {
              //   let arr = respCardsLabel;
              //   arr.splice(4, 0, "Obs Profile");
              //   setCardsLabel(arr);
              //   localStorage.setItem("cardsLabel", arr);
              // } else {
              setCardsLabel(respCardsLabel);
              localStorage.setItem("cardsLabel", respCardsLabel);
              // }
            } else {
              setCardsLabel(
                isGyn
                  ? [
                      "Patient Information",
                      "Treatment Protocol",
                      "Diagnosis On Admission",
                      "Diagnosis On Discharge",
                      "Chief Complaint",
                      "History of Present Illness & Obs Profile",
                      "Past Medical History",
                      "Past Surgical History",
                      "Family History",
                      "Allergies",
                      "Physical Exam on Admission",
                      "Vitals on Admission",
                      "Investigations at the Hospital",
                      "Procedure Done",
                      "Procedure Findings",
                      "Course in the Hospital",
                      "Treatment Given",
                      "Physical Exam at Discharge",
                      "Vitals on Discharge",
                      "Condition at Discharge",
                      "Discharged To",
                      "Instructions Label",
                      "Discharge Label",
                      "Advised Investigations",
                      "Medications at Discharge",
                      "Medications at Discharge Notes",
                      "Advice on Discharge",
                      "Activity Orders",
                      "Therapy Orders",
                      "Dietary Instructions",
                      "Plans for Medical Follow-up",
                      "Attached Images",
                      "HealthRADAR Monitoring (Duration, Condition)",
                      "Doctor's Signature",
                      "Patient's Signature",
                    ]
                  : isOnco
                  ? [
                      "Patient Information",
                      "Treatment Protocol",
                      "Diagnosis On Admission",
                      "Diagnosis On Discharge",
                      "Chief Complaint",
                      "Toxicity",
                      "Site",
                      "History of Present Illness",
                      "Past Medical History",
                      "Past Surgical History",
                      "Family History",
                      "Allergies",
                      "Physical Exam on Admission",
                      "Vitals on Admission",
                      "Investigations at the Hospital",
                      "Procedure Done",
                      "Procedure Findings",
                      "Course in the Hospital",
                      "Treatment Given",
                      "Discharge Label",
                      "Physical Exam at Discharge",
                      "Vitals on Discharge",
                      "Condition at Discharge",
                      "Discharged To",
                      "Instructions Label",
                      "Advised Investigations",
                      "Medications at Discharge",
                      "Medications at Discharge Notes",
                      "Advice on Discharge",
                      "Activity Orders",
                      "Therapy Orders",
                      "Dietary Instructions",
                      "Plans for Medical Follow-up",
                      "Attached Images",
                      "HealthRADAR Monitoring (Duration, Condition)",
                      "Doctor's Signature",
                      "Patient's Signature",
                    ]
                  : [
                      "Patient Information",
                      "Treatment Protocol",
                      "Diagnosis On Admission",
                      "Diagnosis On Discharge",
                      "Chief Complaint",
                      "History of Present Illness",
                      "Past Medical History",
                      "Past Surgical History",
                      "Family History",
                      "Allergies",
                      "Physical Exam on Admission",
                      "Vitals on Admission",
                      "Investigations at the Hospital",
                      "Procedure Done",
                      "Procedure Findings",
                      "Course in the Hospital",
                      "Treatment Given",
                      "Discharge Label",
                      "Physical Exam at Discharge",
                      "Vitals on Discharge",
                      "Condition at Discharge",
                      "Discharged To",
                      "Instructions Label",
                      "Advised Investigations",
                      "Medications at Discharge",
                      "Medications at Discharge Notes",
                      "Advice on Discharge",
                      "Activity Orders",
                      "Therapy Orders",
                      "Dietary Instructions",
                      "Plans for Medical Follow-up",
                      "Attached Images",
                      "HealthRADAR Monitoring (Duration, Condition)",
                      "Doctor's Signature",
                      "Patient's Signature",
                    ]
              );
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      })
      .catch((err) => console.log("err", err));
  });
  useEffect(() => {
    localStorage.setItem("cardsLabel", JSON.stringify(cardsLabel));
    localStorage.setItem("secHeadings", JSON.stringify(secHeadings));
    let cardsArr = [];
    diagnosisOnAdmission =
      JSON.parse(localStorage.getItem("diagnosisOnAdmission")) == null
        ? null
        : JSON.parse(localStorage.getItem("diagnosisOnAdmission")).map(
            (item) => {
              return (
                <div className={styles.diagnosisDiv}>
                  <Badge
                    pill
                    variant="warning"
                    className={styles.diagnosisBadge}
                  >
                    {item}
                  </Badge>
                  <i
                    className={[styles.crossBtn, "fa fa-close"].join(" ")}
                    onClick={() => removeElementDiagnosis(item)}
                  ></i>
                </div>
              );
            }
          );
    advisedInvestigations =
      JSON.parse(localStorage.getItem("advisedInvestigations")) == null
        ? null
        : JSON.parse(localStorage.getItem("advisedInvestigations")).map(
            (item) => {
              return (
                <div className={styles.diagnosisDiv}>
                  <Badge
                    pill
                    variant="warning"
                    className={styles.diagnosisBadge}
                  >
                    {item}
                  </Badge>
                  <i
                    className={[styles.crossBtn, "fa fa-close"].join(" ")}
                    onClick={() => removeElementInvestigation(item)}
                  ></i>
                </div>
              );
            }
          );
    let cardStates =
      localStorage.getItem("cardStates") == null
        ? {}
        : JSON.parse(localStorage.getItem("cardStates"));
    for (let label of cardsLabel) {
      if (
        (cardStates[label] == null || cardStates[label]) &&
        label != "Medications at Discharge Notes"
      ) {
        if (!(label in cardsObjDefault)) {
          cardsArr.push(
            <div className={styles.createPageBarActive} value={label}>
              <div className={styles.sectionHeader}>
                <div>
                  {localStorage.getItem("secHeadings") != null
                    ? JSON.parse(localStorage.getItem("secHeadings"))[label]
                    : Label}
                  <EditDraggableSectionModal
                    secName={label}
                    secHeadings={secHeadings}
                    setSecHeadings={setSecHeadings}
                    setCardsString={setCardsString}
                  ></EditDraggableSectionModal>
                </div>
                <i
                  className={[styles.crossBtn, "fa fa-close"].join(" ")}
                  onClick={() => {
                    handleRemoveSection(label);
                  }}
                ></i>
              </div>
              <ReadMoreTextArea
                localStorageId={_.camelCase(label)}
              ></ReadMoreTextArea>
            </div>
          );
        } else {
          cardsArr.push(cardsObjDefault[label]);
        }
      }
    }
    setCards(cardsArr);
  }, [
    cardsLabel,
    diagnosisOnAdmissionStr,
    advisedInvestigationsStr,
    dietaryInstructionsContentStr,
    conditionAtDischargeContentStr,
    dispositionToContentStr,
    activityOrdersContentStr,
    therapyOrdersContentStr,
    physicalExamOnAdmissionContentStr,
    pastMedicalHistoryContentStr,
    pastSurgicalHistoryContentStr,
    familyHistoryContentStr,
    chiefComplaintContentStr,
    toxicityContentStr,
    siteContentStr,
    historyOfPresentIllnessAndObsProfileContentStr,
    treatmentProtocolContentStr,
    prompt,
    cardsString,
    pageUpdate,
  ]);

  const removeElementDiagnosis = (diagnosisToRemove) => {
    let contentArr =
      localStorage.getItem("diagnosisOnAdmission") == null
        ? []
        : JSON.parse(localStorage.getItem("diagnosisOnAdmission"));
    contentArr = contentArr.filter((item) => item != diagnosisToRemove);
    localStorage.setItem("diagnosisOnAdmission", JSON.stringify(contentArr));
    setPrompt(Math.random());
    props.setLeftPrompt(Math.random());
  };
  const removeElementInvestigation = (investigationToRemove) => {
    let contentArr =
      localStorage.getItem("advisedInvestigations") == null
        ? []
        : JSON.parse(localStorage.getItem("advisedInvestigations"));
    contentArr = contentArr.filter((item) => item != investigationToRemove);
    localStorage.setItem("advisedInvestigations", JSON.stringify(contentArr));
    setPrompt(Math.random());
    props.setLeftPrompt(Math.random());
  };
  const removeElementDietAndOthers = (camelLabel, label, dietItemToRemove) => {
    let obj = JSON.parse(localStorage.getItem(camelLabel));
    obj[dietItemToRemove] = false;
    localStorage.setItem(camelLabel, JSON.stringify(obj));
    props.setCreateDsStateChange(JSON.stringify(obj));
    props.setLeftPaneLabel(label);
  };
  const removeElementHistory = (camelLabel, label, heading, item) => {
    let obj = JSON.parse(localStorage.getItem(camelLabel));
    obj[heading][item] = !obj[heading][item];
    localStorage.setItem(camelLabel, JSON.stringify(obj));
    handleCardStyling("Past Medical History");
    props.setCreateDsStateChange(JSON.stringify(obj));
    props.setLeftPaneLabel(label);
  };
  return (
    <>
      {!localStorage.getItem("email") ? (
        <Redirect to="/dischargeSummary" />
      ) : null}
      <div className={styles.dsrightdraggablecards}>
        <DraggableCardsDS
          mediToAddArr={props.mediToAddArr}
          cards={cards}
          setCardsLabel={setCardsLabel}
          cardsLabel={cardsLabel}
        />
        <div className={styles.dsrightbottomdiv}>
          <DSCreateManageSectionsModal
            setCardsLabel={setCardsLabel}
            secHeadings={secHeadings}
            setCardsString={setCardsString}
            setSecHeadings={setSecHeadings}
            setPrompt={setPrompt}
          ></DSCreateManageSectionsModal>
          <AddDraggableSectionModal
            setCardsLabel={setCardsLabel}
            secHeadings={secHeadings}
            setCardsString={setCardsString}
            setSecHeadings={setSecHeadings}
          ></AddDraggableSectionModal>
        </div>
      </div>
    </>
  );
};

export default DischargeSummaryRightPane;
