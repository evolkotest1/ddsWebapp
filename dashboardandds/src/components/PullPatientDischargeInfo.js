import React, { useState, useEffect } from "react";
import { Card, Dropdown, Button } from "react-bootstrap";
import classes from "./Styles.module.css";
import { Redirect } from "react-router";
import { hostAddress } from "../assets/config";
import { currentServer } from "../assets/config";
import axios from "axios";
import html2pdf from "html2pdf.js";
import _ from "lodash";
import SaveAsProtocolModal from "./SaveAsProtocolModal";

const useConstructor = (callBack = () => {}) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
};

const PullPatientDischargeInfo = (props) => {
  const [redirect, setRedirect] = useState(null);
  const [visits, setVisists] = useState(null);
  const [stateVal, setStateVal] = useState("DRAFT");
  const [dispObj, setDispObj] = useState();
  const [patientDispObj, setPatientDispObj] = useState();
  const [signature, setSignature] = useState(localStorage.getItem("signature"));
  const [thumbnails, setThumbnails] = useState(null);
  const [linkToCreatePg, setLinkToCreatePage] = useState(
    localStorage.getItem("approved_status") != 4 ? (
      <Button
        onClick={() => {
          // localStorage.setItem("patient", JSON.stringify(props.patient));
          localStorage.setItem("protocolSet", false);
          localStorage.removeItem("isDirtySave");
          localStorage.removeItem("protocolDataString");
          //at this point patient beciomes extra stringfied
          //done---case for undefined..see drname is not updated i think..and save not going correctly
          //done---apply changes tp..filter sections..36
          //done---doctor login..display dr name and remove alert
          setRedirect(
            <Redirect
              to={{
                pathname: "/dischargeSummaryCreate",
                state: {
                  patient: props.patient,
                },
              }}
            />
          );
        }}
      >
        Edit
      </Button>
    ) : (
      <Button disabled>Edit</Button>
    )
  );
  const [cardsLabel, setCardsLabel] = useState([]);

  console.log("props.summaryDataArr", props.summaryDataArr);
  let ds = props.summaryDataArr;
  let medicines = null;
  let patient =
    typeof props.patient === "string"
      ? JSON.parse(props.patient)
      : props.patient;
  // console.log("props.patient", props.patient);
  let isGyn =
    patient["sex"] == "Female" &&
    patient["age"].substring(0, patient["age"].length - 1) >= 18 &&
    patient["age"].substring(0, patient["age"].length - 1) <= 45;
  //old code
  // useEffect(() => {
  //   if (props.summaryDataArr.stateFlag == "0") {
  //     setStateVal("DRAFT");
  //     setLinkToCreatePage(
  //       <a
  //         href=""
  //         onClick={() => {
  //           localStorage.setItem("patient", JSON.stringify(props.patient));
  //           setRedirect(
  //             <Redirect
  //               to={{
  //                 pathname: "/dischargeSummaryCreate",
  //                 state: {
  //                   patient: props.patient,
  //                 },
  //               }}
  //             />
  //           );
  //         }}
  //       >
  //         Edit Discharge Summary
  //       </a>
  //     );
  //   } else if (props.summaryDataArr.stateFlag == "1") {
  //     setStateVal("PENDING APPROVAL");
  //     setLinkToCreatePage(
  //       <a
  //         href=""
  //         onClick={() => {
  //           localStorage.setItem("patient", JSON.stringify(props.patient));
  //           setRedirect(
  //             <Redirect
  //               to={{
  //                 pathname: "/dischargeSummaryCreate",
  //                 state: {
  //                   patient: props.patient,
  //                 },
  //               }}
  //             />
  //           );
  //         }}
  //       >
  //         Edit Discharge Summary
  //       </a>
  //     );
  //   } else if (props.summaryDataArr.stateFlag == "2") {
  //     setStateVal("APPROVED/SCHEDULED");
  //     setLinkToCreatePage(null);
  //   } else if (props.summaryDataArr.stateFlag == "3") {
  //     setStateVal("DISCHARGED");
  //     setLinkToCreatePage(null);
  //   }
  //   let dataFetch = {
  //     pId: props.patient["id"],
  //     docId: localStorage.getItem("doctorId"),
  //     caseId: props.patient["ptcaseId"],
  //     clinicId: localStorage.getItem("clinicId"),
  //   };
  //   console.log("findPatientVisits dataFetch", dataFetch);
  //   axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  //   axios
  //     .put(
  //       hostAddress + currentServer +
  //         "/RestEasy/DischargeSummaryWebService/findPatientVisits",
  //       dataFetch
  //     )
  //     .then((response) => {
  //       console.log("findPatientVisits response", response.data);
  //       let visitArr =
  //         response.data["ptAppointmentOrgList"] == null
  //           ? []
  //           : response.data["ptAppointmentOrgList"];
  //       setVisists(
  //         visitArr.map((item) => {
  //           return (
  //             <Button variant="success" className={classes.visitBtn}>
  //               {item["visited_on"]}
  //             </Button>
  //           );
  //         })
  //       );
  //     })
  //     .catch((err) => console.log("err", err));
  // }, [props.patient["id"]]);
  // if (ds["adviseRx"] != null && "Lbl" in ds["adviseRx"]) {
  //   medicines = (
  //     <div>
  //       <br />
  //       <div>{ds["adviseRx"]["Lbl"]["_cdata"]}</div>
  //       <div>{ds["adviseRx"]["details"]["_cdata"]}</div>
  //     </div>
  //   );
  // } else if (ds["adviseRx"] != null || ds["adviseRx"] != "") {
  //   medicines = ds["adviseRx"].map((item) => {
  //     return (
  //       <div>
  //         <br />
  //         <div>{item["Lbl"]["_cdata"]}</div>
  //         <div>{item["details"]["_cdata"]}</div>
  //       </div>
  //     );
  //   });
  // }

  // useEffect(()=>{
  //   if (localStorage.getItem("patientStatus") === "Existing") {
  //     let dispArr;

  //     displayJson.forEach((item) => {
  //       if (item["displayText"] == "Patient Information") {
  //         let ptarr = item["groupedDetails"];
  //         console.log("ptinfo", ptarr);
  //         let arr = [];
  //         ptarr.forEach((ele) => {
  //           let key = ele["_name"];
  //           let val = ele["_description"];
  //           arr.push(key + "- " + val);
  //         });
  //         dispArr = arr.map((ele) => {
  //           return <div>{ele}</div>;
  //         });
  //       }
  //       if (item["displayText"] == "Patient Information")
  //         setPatientDispObj(
  //           <Card.Body>
  //             <div>
  //               <span className={classes.temptitle}>Patient Information</span>
  //               <div>{dispArr}</div>
  //             </div>
  //           </Card.Body>
  //         );
  //     });
  //     setDispObj(
  //       displayJson.map((item) => {
  //         if (
  //           item["displayText"] != "Course Label" &&
  //           item["displayText"] != "Instructions Label" &&
  //           item["displayText"] != "Patient Information" &&
  //           !(
  //             (item["finalValue"] == null || item["finalValue"] == "") &&
  //             item["displayText"] != "Doctor's Signature" &&
  //             item["displayText"] != "Patient's Signature"
  //           )
  //         ) {
  //           return (
  //             <Card.Body>
  //               <div>
  //                 <span className={classes.temptitle}>
  //                   {" "}
  //                   {item["displayText"]}
  //                 </span>
  //                 <div>{item["finalValue"]}</div>
  //               </div>
  //             </Card.Body>
  //           );
  //         }
  //       })
  //     );
  //   }
  // },[])

  const removeLocalStorage = () => {
    localStorage.removeItem("cardsLabel");
    localStorage.removeItem("savedObject");
    localStorage.removeItem("deletedSection");
    localStorage.removeItem("physicalExamAtDischargeObj");
    localStorage.removeItem("physicalExamOnAdmissionObj");
    localStorage.removeItem("mediToAddArr");
    localStorage.removeItem("mediObj");
    localStorage.removeItem("brandValue");
    localStorage.removeItem("mediToAddWithBrackArr");
    localStorage.removeItem("freqValObj");
    localStorage.removeItem("dispositionTo");
    localStorage.removeItem("mediObjWithBrack");
    localStorage.removeItem("patientInformationObj");
    localStorage.removeItem("quantValObj");
    localStorage.removeItem("allMedicineDeets");
    localStorage.removeItem("phyExamSelectedOne");
    localStorage.removeItem("conditionAtDischarge");
    localStorage.removeItem("chiefComplaint");
    localStorage.removeItem("dietaryInstructions");
    localStorage.removeItem("courseInTheHospital");
    localStorage.removeItem("dateOfDischarge");
    localStorage.removeItem("durationOptions");
    localStorage.removeItem("historyOfIllnessPages");
    localStorage.removeItem("investigationsAtTheHospital");
    localStorage.removeItem("phyExamSelectedOneId");
    localStorage.removeItem("treatmentGiven");
    localStorage.removeItem("procedureFindings");
    localStorage.removeItem("therapyOrdersContent");
    localStorage.removeItem("therapyOrders");
    localStorage.removeItem("procedureDone");
    localStorage.removeItem("phyExamAllPagesOfSelectedOne");
    localStorage.removeItem("cardStyler");
    localStorage.removeItem("pastSurgicalHistoryObj");
    localStorage.removeItem("diagnosisOnDischarge");
    localStorage.removeItem("scheduleDate");
    localStorage.removeItem("conditionAtDischargeContent");
    localStorage.removeItem("allergies");
    localStorage.removeItem("phyExamPageNumber");
    localStorage.removeItem("vitalsOnAdmissionObj");
    localStorage.removeItem("physicalExamContent");
    localStorage.removeItem("familyHistoryObj");
    localStorage.removeItem("remarksOptions");
    localStorage.removeItem("pastMedicalHistoryObj");
    localStorage.removeItem("activityOrdersContent");
    localStorage.removeItem("dateOfAdmission");
    localStorage.removeItem("plansForMedicalFollowUpObj");
    localStorage.removeItem("vitalsOnDischargeObj");
    localStorage.removeItem("lsObj");
    localStorage.removeItem("uploadFiles");
    localStorage.removeItem("routeOptions");
    localStorage.removeItem("dispositionToContent");
    localStorage.removeItem("healthRadarMonitoringDurationCondition");
    localStorage.removeItem("diagnosisOnAdmission");
    localStorage.removeItem("dietaryInstructionsContent");
    localStorage.removeItem("activityOrders");
    localStorage.removeItem("physicalExamAtDischargeObjNad");
    localStorage.removeItem("dispostionTo");
    localStorage.removeItem("historyOfPresentIllnessObj");
    localStorage.removeItem("patientsSignTextbox");
    localStorage.removeItem("siteObj");
    localStorage.removeItem("savedObject");
    localStorage.removeItem("advisedInvestigations");
    localStorage.removeItem("adviceOnDischarge");
    localStorage.removeItem("protocolSet");
    localStorage.removeItem("isDirtySave");
  };
  const handleDischarge = () => {
    let data = {
      approvedStatus: 4,
      approvedById: localStorage.getItem("userId"),
      visitId: localStorage.getItem("visitId"),
    };
    console.log("generateDischargeSummary data", data);
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          currentServer +
          "/RestEasy/DischargeSummaryWebService/updatedDischargeSummaryApprovedStatus",
        data
      )
      .then((response) => {
        console.log("generateDischargeData resp", response.data);
        // alert();
        let data = {
          approvedStatus: 4,
          approvedById: localStorage.getItem("userId"),
          visitId: localStorage.getItem("visitId"),
          roleId: 1,
          clinicId: localStorage.getItem("clinicId"),
          doctorID: localStorage.getItem("doctorId"),
          patientId:
            JSON.parse(localStorage.getItem("patient")) == null
              ? 0
              : JSON.parse(localStorage.getItem("patient"))["id"],
        };
        console.log("generateDischargeSummary sms data", data);
        axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        axios
          .put(
            hostAddress +
              currentServer +
              "/RestEasy/DischargeSummaryWebService/updatedDischargeSummaryApprovedStatus",
            data
          )
          .then((response) => {
            setStateVal("DISCHARGED");
            setLinkToCreatePage();
          })
          .catch((err) => {
            console.log("err", err);
          });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const handleApproveScheduled = () => {
    let data = {
      approvedStatus: 3,
      approvedById: localStorage.getItem("userId"),
      visitId: localStorage.getItem("visitId"),
    };
    console.log("generateDischargeSummary data", data);
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          currentServer +
          "/RestEasy/DischargeSummaryWebService/updatedDischargeSummaryApprovedStatus",
        data
      )
      .then((response) => {
        console.log("generateDischargeData resp", response.data);
        setStateVal("APPROVED/SCHEDULED");
        setLinkToCreatePage();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const handleImg = () => {
    var doc = localStorage.getItem("doctorId");
    console.log("doctorId", doc);
    const ful = "http://ht1.evolko.com:8080/flex/images/signatures/";
    var signature = ful + doc + ".jpg";
    console.log("ful", ful);
    const getSign = localStorage.getItem("signature");
    const setSign = localStorage.setItem("signature", signature);
    // setSignature(signature);
    console.log(signature);
    console.log("getSign", getSign);
    console.log("setSign", setSign);
  };
  const handleSelfApprove = () => {
    let data = {
      approvedStatus: 2,
      approvedById: localStorage.getItem("userId"),
      visitId: localStorage.getItem("visitId"),
    };
    console.log("generateDischargeSummary data", data);
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          currentServer +
          "/RestEasy/DischargeSummaryWebService/updatedDischargeSummaryApprovedStatus",
        data
      )
      .then((response) => {
        console.log(
          "updatedDischargeSummaryApprovedStatus resp",
          response.data
        );
        setStateVal("APPROVED");
        setLinkToCreatePage();
        handleImg();
        // <a
        //   className={classes.disabledLink}
        //   href=""
        //   onClick={() => {
        //     setRedirect(
        //       <Redirect
        //         to={{
        //           pathname: "/dischargeSummaryCreate",
        //           state: {
        //             patient: props.patient,
        //           },
        //         }}
        //       />
        //     );
        //   }}
        // >
        //   Edit Discharge Summary
        // </a>
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const handleDataOpApprove = () => {
    let data = {
      patientId: props.patient["id"],
      caseId: props.patient["ptcaseId"],
      finalizeFlag: 2,
    };
    console.log("generateDischargeSummary data", data);
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          currentServer +
          "/RestEasy/DischargeSummaryWebService/generateDischargeData",
        data
      )
      .then((response) => {
        console.log("generateDischargeData resp", response.data);
        setStateVal("APPROVED/SCHEDULED");
        setLinkToCreatePage();
        // <a
        //   className={classes.disabledLink}
        //   href=""
        //   onClick={() => {
        //     setRedirect(
        //       <Redirect
        //         to={{
        //           pathname: "/dischargeSummaryCreate",
        //           state: {
        //             patient: props.patient,
        //           },
        //         }}
        //       />
        //     );
        //   }}
        // >
        //   Edit Discharge Summary
        // </a>
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const handleGeneratePdf = () => {
    console.log("save pttttttttttttttt", localStorage.getItem("patientId"));
    console.log("save revvvvvvvvvvvv", localStorage.getItem("evolkoId"));
    console.log("save vist", localStorage.getItem("visitId"));
    console.log("save clinic", localStorage.getItem("clinicId"));

    console.log("save ptttttttifdddddd", localStorage.getItem("patientId"));

    console.log("save ptcaseeeeeeeeeee", localStorage.getItem("ptCaseId"));

    let data1 = {
      patientID: localStorage.getItem("patientId"),
      case_id: localStorage.getItem("ptCaseId"),
      clinic_id: localStorage.getItem("clinicId"),
      doctor_id: localStorage.getItem("doctorId"),
      PDFName:
        "RX_" +
        localStorage.getItem("evolkoId") +
        "_" +
        localStorage.getItem("visitId") +
        ".pdf",
      Remark: "Discharge Summary",
      evolko_visit_id: localStorage.getItem("visitId"),
    };

    let data2 = {
      patientID: localStorage.getItem("patientId"),
      case_id: localStorage.getItem("ptCaseId"),
      clinic_id: "600023103",
      doctor_id: "701697307",
      PDFName: "RX_948218_217722.pdf",
      Remark: "Discharge Summary",
      evolko_visit_id: "217722",
      multiVisitPrint: false,
    };

    let data3 = {
      patientID: localStorage.getItem("patientId"),
      case_id: localStorage.getItem("ptCaseId"),
      clinic_id: "200058",
      doctor_id: "701609791",
      PDFName: "RX_947695_210924.pdf",
      Remark: "Discharge Summary",
      evolko_visit_id: "210924",
      multiVisitPrint: false,
    };

    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          currentServer +
          "/RestEasy//DischargeSummaryWebService/downloadOriginalPrescription",
        data1
      )
      .then((response) => {
        console.log("save pdfffffffffffffffffffffff", response.data);

        console.log(
          "displayApplicationPdf:displayApplicationPdf:displayApplicationPdf"
        );
        var urlLocation = response.data;
        console.log("urlLocation pressssssssssssss resp", urlLocation);
        let url = response.data["successString"];
        console.log("url resp pressssssssss", url);

        window.open(url);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const handleThumbnailClick = (dataId) => {
    let data = {
      original_image_id: dataId,
    };
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          currentServer +
          "/RestEasy/multimediaServices/downLoadOriginalImage",
        data
      )
      .then((response) => {
        console.log("downLoadOriginalImage resp", response.data);
      })
      .catch((err) => console.log("err", err));
  };

  //for approved status
  useEffect(() => {
    console.log("propsss", props);
    if (localStorage.getItem("approved_status") == 0) setStateVal("DRAFT");
    else if (localStorage.getItem("approved_status") == 1)
      setStateVal("PENDING APPROVAL");
    else if (localStorage.getItem("approved_status") == 2)
      setStateVal("APPROVED");
    else if (localStorage.getItem("approved_status") == 3)
      setStateVal("APPROVED/SCHEDULED");
    else if (localStorage.getItem("approved_status") == 4)
      setStateVal("DISCHARGED");
  }, [localStorage.getItem("approved_status"), props.prompt]);

  //for images
  useEffect(() => {
    let data = {
      patientMultiMediaDetails: [
        {
          checked: false,
          clinicID: localStorage.getItem("clinicId"),
          deviceTimeUTC: Math.floor(new Date().getTime() / 1000),
          doctorID: localStorage.getItem("doctorId"),
          downloaded: false,
          lastSyncTimeFromServer: 1595855120049,
          patientID:
            localStorage.getItem("patient") == null
              ? 0
              : JSON.parse(localStorage.getItem("patient"))["id"],
          patientMaxInvestigationID: 63080,
          ptCaseID:
            localStorage.getItem("patient") == null
              ? 0
              : JSON.parse(localStorage.getItem("patient"))["ptcaseId"],
          ptInvestigationSubList: [],
          referredByClinicID: 0,
          referredByDoctorID: 0,
          referredToClinicID: 0,
          referredToDoctorID: 0,
          selected: false,
        },
      ],
      upload_feature_flag: true,
    };
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          currentServer +
          "/RestEasy/multimediaServices/saveMultiMediathroughSynFramework",
        data
      )
      .then((response) => {
        console.log("saveMultiMediathroughSynFramework res", response.data);
        let thumbArr = response.data["patientVisitDetails"];
        setThumbnails(
          thumbArr.map((item) => {
            let thumbNailImageInByteFormat = item["thumbNailImageInByteFormat"];
            if (thumbNailImageInByteFormat != null) {
              let base64String = btoa(
                String.fromCharCode(
                  ...new Uint8Array(thumbNailImageInByteFormat)
                )
              );
              let src = "data:image/*;base64," + base64String;
              let dataId = item["thumbnailDataId"];
              return (
                <img
                  className={classes.thumbnailImg}
                  src={src}
                  onClick={(dataId) => handleThumbnailClick(dataId)}
                ></img>
              );
            }
          })
        );
      })
      .catch((err) => console.log("err", err));
  }, [props.prompt]);

  //for cardsLabel getting
  useEffect(() => {
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

            if (respCardsLabel != "" && respCardsLabel != null) {
              // if (isGyn) {
              //   let arr = respCardsLabel;
              //   arr.splice(4, 0, "Obs Profile");
              //   setCardsLabel(arr);
              //   localStorage.setItem("cardsLabel", arr);
              // } else {
              localStorage.setItem(
                "cardsLabel",
                JSON.stringify(respCardsLabel)
              );
              setCardsLabel(respCardsLabel);
              // }
            } else {
              let cardsLabel = isGyn
                ? [
                    "Patient Information",
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
                    "Disposition To",
                    "Instructions Label",
                    "Discharge Label",
                    "Advised Investigations",
                    "Medications at Discharge",
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
                    "Disposition To",
                    "Instructions Label",
                    "Advised Investigations",
                    "Medications at Discharge",
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
                    "Disposition To",
                    "Instructions Label",
                    "Advised Investigations",
                    "Medications at Discharge",
                    "Advice on Discharge",
                    "Activity Orders",
                    "Therapy Orders",
                    "Dietary Instructions",
                    "Plans for Medical Follow-up",
                    "Attached Images",
                    "HealthRADAR Monitoring (Duration, Condition)",
                    "Doctor's Signature",
                    "Patient's Signature",
                  ];
              localStorage.setItem("cardsLabel", JSON.stringify(cardsLabel));
              setCardsLabel(JSON.stringify(cardsLabel));
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      })
      .catch((err) => console.log("err", err));
  }, [props.prompt]);

  //for rendering
  useEffect(() => {
    //handling patient information
    let obj = JSON.parse(localStorage.getItem("patientInformationObj"));
    let arr = [];
    for (let objitem in obj) {
      let key = objitem;
      let val = obj[key];
      if (key == "idpNo" || key == "mrnNo" || key == "roomNo")
        key = _.upperCase(key);
      arr.push(key + "-" + val);
    }
    let subfields = arr.map((subItem) => {
      return <div>{subItem}</div>;
    });
    setPatientDispObj(
      <Card.Body>
        <div>
          <span className={classes.temptitle}>Patient Information</span>
          <div>{subfields}</div>
        </div>
      </Card.Body>
    );

    //handling other cards
    let cardsLabel =
      localStorage.getItem("cardsLabel") == null
        ? []
        : JSON.parse(localStorage.getItem("cardsLabel"));
    console.log("cardsLabelTemp", cardsLabel);
    setDispObj(
      cardsLabel.map((item) => {
        if (
          item != "Course Label" &&
          item != "Instructions Label" &&
          item != "Patient Information" &&
          item != "Attached Images" &&
          item != "Discharge Label" &&
          item != "Treatment Protocol"
        ) {
          let camelCaseName = _.camelCase(item);
          let camelCaseNameWObj = _.camelCase(camelCaseName + "Obj");

          //advised investigation and diagnosis old

          // if (item == "Diagnosis On Admission") {
          //   let arr =
          //     localStorage.getItem("diagnosisOnAdmission") == null
          //       ? []
          //       : JSON.parse(localStorage.getItem("diagnosisOnAdmission"));
          //   if (arr.length > 0) {
          //     let subfields = arr.map((i) => {
          //       return <div>{i}</div>;
          //     });
          //     return (
          //       <Card.Body>
          //         <div>
          //           <span className={classes.temptitle}> {item}</span>
          //           {subfields}
          //           {localStorage.getItem("diagnosisOnAdmission") != null
          //             ? ", " + localStorage.getItem("diagnosisOnAdmission")
          //             : ""}
          //         </div>
          //       </Card.Body>
          //     );
          //   }
          // }
          // if (item == "Advised Investigations") {
          //   let arr =
          //     localStorage.getItem("advisedInvestigations") == null
          //       ? []
          //       : JSON.parse(localStorage.getItem("advisedInvestigations"));
          //   if (arr.length > 0) {
          //     let subfields = arr.map((i) => {
          //       return <div>{i}</div>;
          //     });
          //     return (
          //       <Card.Body>
          //         <div>
          //           <span className={classes.temptitle}> {item}</span>
          //           {subfields}
          //           {localStorage.getItem("advisedInvestigationss") != null
          //             ? ", " + localStorage.getItem("advisedInvestigationss")
          //             : ""}
          //         </div>
          //       </Card.Body>
          //     );
          //   }
          // }

          let spCase = [
            "Medications at Discharge",
            "Physical Exam on Admission",
            "History of Present Illness & Obs Profile",
          ];
          if (item == "Medications at Discharge") {
            let obj1 =
              localStorage.getItem("mediObj") == null
                ? {}
                : JSON.parse(localStorage.getItem("mediObj"));
            let arr1 = Object.keys(obj1);
            let obj2 =
              localStorage.getItem("allMedicineDeets") == null ||
              Object.keys(JSON.parse(localStorage.getItem("allMedicineDeets")))
                .length === 0
                ? null
                : JSON.parse(localStorage.getItem("allMedicineDeets"));
            let mediNotes =
              localStorage.getItem("medicationsAtDischargeNotes") == null
                ? ""
                : ""; //: ", " + localStorage.getItem("medicationsAtDischargeNotes");
            if (mediNotes != "") arr1.push(mediNotes);
            if (obj2 == null || obj2 == undefined) {
              if (arr1.length > 0 && arr1[0] != "") {
                let subfields = arr1.map((i) => {
                  if (
                    obj1[i] ||
                    (arr1.indexOf(i) === arr1.length - 1 &&
                      localStorage.getItem("medicationsAtDischargeNotes") !=
                        null)
                  )
                    return <div>{i}</div>;
                });
                if (subfields != null) {
                  return (
                    <Card.Body>
                      <div>
                        <span className={classes.temptitle}> {item}</span>
                        {subfields}
                      </div>
                    </Card.Body>
                  );
                }
              }
            } else {
              let arr2 = [];
              let brandVal =
                localStorage.getItem("brandValue") == null
                  ? null
                  : JSON.parse(localStorage.getItem("brandValue"));
              let freqVal =
                localStorage.getItem("freqValObj") == null
                  ? null
                  : JSON.parse(localStorage.getItem("freqValObj"));
              for (let i in obj2) {
                let bval = "";
                if (brandVal != null) bval = brandVal[i];
                bval =
                  bval == "" || bval == undefined
                    ? (bval = "")
                    : ", of Brand: " + bval;
                let fval = "";
                if (freqVal != null) fval = freqVal[i];
                fval =
                  fval == "" || fval == undefined
                    ? (fval = "")
                    : ", with Frequency: " + fval;
                arr2.push(
                  i + ": " + Object.values(obj2[i]).toString() + bval + fval
                );
                console.log("emptymeds-", obj1[i]);
              }
              for (let j in obj1) {
                if (obj1[j] && !(j in obj2)) arr2.push(j);
              }
              arr2.push(mediNotes);
              if (arr2.length > 0) {
                let subfields = arr2.map((i) => {
                  return <div>{i}</div>;
                });
                if (subfields != null)
                  return (
                    <Card.Body>
                      <div>
                        <span className={classes.temptitle}> {item}</span>
                        {subfields}
                      </div>
                    </Card.Body>
                  );
              }
            }
          } else if (item == "Physical Exam on Admission") {
            let obj =
              JSON.parse(localStorage.getItem("physicalExamOnAdmissionObj")) ==
              null
                ? {}
                : JSON.parse(
                    localStorage.getItem("physicalExamOnAdmissionObj")
                  );
            let grpArr = [];
            let lvalStr = "";
            for (let i in obj) {
              //i gen phy exam
              let jarr = [];
              for (let j in obj[i]) {
                // j skin
                let kval = [];
                for (let k in obj[i][j]) {
                  //k clinically
                  let lval = "";
                  for (let l in obj[i][j][k]) {
                    //l NAD
                    if (obj[i][j][k][l]) lval = i;
                  }
                  if (lval != "") kval.push(k + "-" + lval);
                  lvalStr += lval;
                }
                jarr.push({ _name: j, _description: kval.toString() });
              }
              grpArr.push({ displayText: i, groupedDetails: jarr });
            }
            // saveObj["groupedDetails"] = grpArr;
            // console.log("groupedDetails phy exam", saveObj["groupedDetails"]);
            let grpArrContent = grpArr.map((item) => {
              return (
                <>
                  <h5>{item["displayText"]}</h5>
                  <div>
                    {item["groupedDetails"].map((ele) => {
                      return (
                        <>
                          <h6>{ele["_name"]}</h6>
                          <div>{ele["_description"]}</div>
                        </>
                      );
                    })}
                  </div>
                </>
              );
            });
            if (lvalStr != "" && grpArr.length > 0)
              return (
                <Card.Body>
                  <div>
                    <span className={classes.temptitle}> {item}</span>
                    {grpArrContent}
                  </div>
                </Card.Body>
              );
          } else if (item == "History of Present Illness & Obs Profile") {
            let obj =
              JSON.parse(localStorage.getItem("historyOfPresentIllnessObj")) ==
              null
                ? {}
                : JSON.parse(
                    localStorage.getItem("historyOfPresentIllnessObj")
                  );
            let grpArr = [];
            for (let i in obj) {
              //i gen phy exam
              let jarr = [];
              for (let j in obj[i]) {
                // j skin
                let kval = obj[i][j];
                jarr.push({ _name: j, _description: kval.toString() });
              }
              grpArr.push({ displayText: i, groupedDetails: jarr });
            }
            // saveObj["groupedDetails"] = grpArr;
            // console.log("groupedDetails phy exam", saveObj["groupedDetails"]);
            let grpArrContent = grpArr.map((item) => {
              return (
                <>
                  <br />
                  <h6>{item["displayText"]}</h6>
                  <div>
                    {item["groupedDetails"].map((ele) => {
                      return (
                        <>
                          <div>
                            {ele["_name"]}: {ele["_description"]}
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              );
            });
            if (grpArr.length > 0)
              return (
                <Card.Body>
                  <div>
                    <span className={classes.temptitle}> {item}</span>
                    {grpArrContent}
                  </div>
                </Card.Body>
              );
          }
          let historyCards = [
            "Past Medical History",
            "Past Surgical History",
            "Family History",
          ];
          if (historyCards.includes(item)) {
            let obj =
              JSON.parse(localStorage.getItem(camelCaseNameWObj)) == null
                ? {}
                : JSON.parse(localStorage.getItem(camelCaseNameWObj));
            let grpArr = [];
            for (let i in obj) {
              let jarr = [];
              for (let j in obj[i]) {
                let kval = obj[i][j];
                if (kval) jarr.push(j);
              }
              grpArr.push({ displayText: i, groupedDetails: jarr.toString() });
            }
            if (grpArr.length > 0) {
              // alert();
              let grpArrContent = grpArr.map((ele) => {
                return (
                  <>
                    <div>
                      {ele["displayText"]}:{ele["groupedDetails"]}
                    </div>
                  </>
                );
              });
              return (
                <Card.Body>
                  <div>
                    <span className={classes.temptitle}> {item}</span>
                    {grpArrContent}
                  </div>
                </Card.Body>
              );
            }
          }
          let cardTextOrArrToStringCase = [
            "Medications at Discharge Notes",
            "Investigations at the Hospital",
            "Procedure Done",
            "Procedure Findings",
            "Course in the Hospital",
            "Treatment Given",
            "Advice on Discharge",
            "HealthRADAR Monitoring (Duration, Condition)",
            "Diagnosis On Discharge",
            "Diagnosis On Admission",
            "Advised Investigations",
          ];
          if (cardTextOrArrToStringCase.includes(item)) {
            let isArr =
              item == "Diagnosis On Admission" ||
              item == "Advised Investigations";
            let content =
              localStorage.getItem(camelCaseName) == null
                ? null
                : isArr
                ? JSON.parse(localStorage.getItem(camelCaseName)) != null
                  ? JSON.parse(localStorage.getItem(camelCaseName)).toString()
                  : null
                : localStorage.getItem(camelCaseName);
            return content == null || content == "" ? null : (
              <Card.Body>
                <div>
                  <span className={classes.temptitle}> {item}</span>
                  <div>{content}</div>
                </div>
              </Card.Body>
            );
          }
          if (cardTextOrArrToStringCase.includes(item)) {
            alert(item);
            return (
              <Card.Body>
                <div>
                  <span className={classes.temptitle}> {item}</span>
                  <div>{item}</div>
                  <div>Health RADAR</div>
                  <br />
                  <br />
                  <hr />
                </div>
                {/* <div>
                  <span className={classes.temptitle}> {item}</span>
                  <div>
                      
                    {item == "Doctor's Signature"

                      ?    <img src={signature} 
                      ></img>
                      : ""}
                    </div>
                  <div>{localStorage.getItem(signature)}</div>
                  <br />
                  <br />
                  <hr />
                </div> */}
              </Card.Body>
            );
          }
          let cardObjToStringCase = [
            "Chief Complaint",
            "Dietary Instructions",
            "Therapy Orders",
            "Activity Orders",
            "Condition at Discharge",
            "Discharged To",
            "Allergies",
          ];
          if (cardObjToStringCase.includes(item)) {
            let obj =
              localStorage.getItem(camelCaseName) == null ||
              localStorage.getItem(camelCaseName) == ""
                ? {}
                : JSON.parse(localStorage.getItem(camelCaseName));
            let arr = [];
            for (let objitem in obj) {
              let key = objitem;
              let val = obj[key];
              if (val == true) arr.push(key);
            }
            if (!(arr.length < 1 || (arr.length == 1 && arr[0] == ""))) {
              let subfields = arr.map((subItem) => {
                return <div>{subItem}</div>;
              });
              return (
                <Card.Body>
                  <div>
                    <span className={classes.temptitle}> {item}</span>
                    {subfields}
                  </div>
                </Card.Body>
              );
            }
          }

          let cardObjToObjCase = [
            "Patient Information",
            "Physical Exam at Discharge",
            "Vitals on Discharge",
            "Plans for Medical Follow-up",
            "Vitals on Admission",
          ];
          if (cardObjToObjCase.includes(item)) {
            console.log("itemitemm", item);
            let obj = JSON.parse(localStorage.getItem(camelCaseNameWObj));
            if (obj == null && localStorage.getItem(camelCaseName) != null)
              return (
                <Card.Body>
                  <div>
                    <span className={classes.temptitle}> {item}</span>
                    <div>{localStorage.getItem(camelCaseName)}</div>
                  </div>
                </Card.Body>
              );
            let arr = [];
            for (let objitem in obj) {
              let key = objitem;
              let val = obj[key];
              console.log("vitalssobjnew", obj, key, val);

              if (typeof val === "object" && val !== null) {
                val = val[Object.keys(val)[0]] ? Object.keys(val)[0] : "";
                if (val != "") {
                  arr.push(key + "-" + val);
                }
              } else if (typeof val == "boolean") arr.push(key);
              else {
                let unit = "";
                if (
                  item == "Vitals on Admission" ||
                  item == "Vitals on Discharge"
                ) {
                  console.log("vitalssobj", obj);
                  unit =
                    key == "Temperature"
                      ? " F"
                      : key == "PR" || key == "RR"
                      ? " bpm"
                      : " mmHg";
                }
                arr.push(key + "-" + val + unit);
              }
            }
            if (arr.length > 0) {
              let subfields = arr.map((subItem) => {
                return <div>{subItem}</div>;
              });
              return (
                <Card.Body>
                  <div>
                    <span className={classes.temptitle}> {item}</span>
                    <div>{subfields}</div>
                  </div>
                </Card.Body>
              );
            }
          }
          let signObjects = ["Doctor's Signature", "Patient's Signature"];
          if (signObjects.includes(item)) {
            return (
              <Card.Body>
                <div>
                  <span className={classes.temptitle}> {item}</span>
                  <div>
                    {item == "Patient's Signature"
                      ? "I have received all relevant documents and records"
                      : ""}
                  </div>
                  <div>
                    {item == "Doctor's Signature" ? (
                      <img src={signature}></img>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>{localStorage.getItem(camelCaseName)}</div>
                  <br />
                  <br />
                  <hr />
                </div>
                {/* <div>
                  <span className={classes.temptitle}> {item}</span>
                  <div>
                      
                    {item == "Doctor's Signature"

                      ?    <img src={signature} 
                      ></img>
                      : ""}
                    </div>
                  <div>{localStorage.getItem(signature)}</div>
                  <br />
                  <br />
                  <hr />
                </div> */}
              </Card.Body>
            );
          }
          if (
            !cardTextOrArrToStringCase.includes(item) &&
            !cardObjToStringCase.includes(item) &&
            !cardObjToObjCase.includes(item) &&
            !signObjects.includes(item) &&
            !historyCards.includes(item) &&
            !spCase.includes(item)
          ) {
            return (
              <Card.Body>
                <div>
                  <span className={classes.temptitle}> {item}</span>
                  <div>{localStorage.getItem(camelCaseName)}</div>
                </div>
              </Card.Body>
            );
          }
        }
      })
    );
  }, [props.prompt, cardsLabel]);

  return (
    <div className={classes.tempcontainer}>
      {redirect}
      <div className={classes.rightTopDivDSPage}>
        <div className={classes.dsNameAndImgHeaderDiv}>
          <div className={classes.nameDischargeSummaryForNew}>
            {" "}
            {localStorage.getItem("patient") == null
              ? null
              : JSON.parse(localStorage.getItem("patient"))["name"]}
            <span className={classes.perAge}>
              {" "}
              {localStorage.getItem("patient") == null
                ? null
                : JSON.parse(localStorage.getItem("patient"))["age"]}
              /
              {props.patient["sex"] == "" || props.patient["sex"] == null
                ? ""
                : props.patient["sex"].substring(0, 1)}
            </span>
          </div>

          <div className={classes.contactActions}>
            {" "}
            <img
              className={classes.imgActionsDsShow}
              src={require("../assets/phone.png")}
            />
            <img
              className={classes.imgActionsDsShow}
              src={require("../assets/video-camera.png")}
            />
          </div>
        </div>
        <div className={classes.pullDsPageDropdown}>
          <div className={classes.btnPad}>{linkToCreatePg}</div>
          <div className={classes.btnPad}>
            <Button
              onClick={() => {
                removeLocalStorage();
                localStorage.setItem("protocolSet", false);
                localStorage.setItem(
                  "patient",
                  typeof props.patient == "string"
                    ? props.patient
                    : JSON.stringify(props.patient)
                );
                setRedirect(
                  <Redirect
                    to={{
                      pathname: "/dischargeSummaryCreate",
                      state: {
                        patient: props.patient,
                      },
                    }}
                  />
                );
              }}
            >
              New
            </Button>
          </div>
        </div>
      </div>

      <>
        <div className={classes.pullDsPageBottom}>
          <div className={classes.dsdispcenterdiv}>
            <Card className={classes.tempcard}>
              <div className={classes.pullDsPageCardHeader}>
                <h3 className={classes.pullDsPageCardHeaderTitle}>
                  State-{stateVal}
                </h3>
                <div className={classes.pullDsPageCardHeaderDropdown}>
                  {
                    <Dropdown className={classes.dropdownPullDsPg}>
                      <Dropdown.Toggle
                        variant="danger"
                        id="dropdown-basic"
                        className={classes.dropdownPullDsPg}
                      >
                        Actions
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          disabled={stateVal != "DISCHARGED" ? false : true}
                          onClick={() => {
                            if (
                              localStorage.getItem("userId") !=
                              localStorage.getItem("doctorId")
                            )
                              setRedirect(
                                <Redirect
                                  to={{
                                    pathname: "/dsSendForApproval",
                                    state: { patient: props.patient },
                                  }}
                                />
                              );
                          }}
                        >
                          Send for Approval
                        </Dropdown.Item>
                        <Dropdown.Item
                          disabled={stateVal != "DISCHARGED" ? false : true}
                          onClick={() => handleSelfApprove()}
                        >
                          Self Approve
                        </Dropdown.Item>
                        <Dropdown.Item
                          disabled={stateVal != "DISCHARGED" ? false : true}
                          onClick={() => handleSelfApprove()}
                        >
                          Approve
                        </Dropdown.Item>
                        <Dropdown.Item
                          disabled={stateVal != "DISCHARGED" ? false : true}
                          onClick={() => handleApproveScheduled()}
                        >
                          Approve/Schedule
                        </Dropdown.Item>
                        <Dropdown.Item
                          disabled={stateVal != "DISCHARGED" ? false : true}
                          onClick={() => handleDischarge()}
                        >
                          Discharge
                        </Dropdown.Item>
                        <Dropdown.Item
                          disabled={stateVal != "DISCHARGED" ? false : true}
                        >
                          Verbal/Phone Approval
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <SaveAsProtocolModal />
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleGeneratePdf()}>
                          Print
                        </Dropdown.Item>
                        <Dropdown.Item>Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  }
                </div>
              </div>
              {/* temp code below */}
              <div id="divToPrint">
                {/* <Card.Body>
                <div>
                  <span className={classes.temptitle}> Date </span>
                  {"August 9"}
                </div>
                <div>
                  <span className={classes.temptitle}>Time </span>
                  {ds["time"]}
                </div>
              </Card.Body> */}
                {patientDispObj}
                <Card.Body>
                  <div>
                    <span className={classes.temptitle}> Doctor Name:</span>{" "}
                    {localStorage.getItem("doctorName")}
                  </div>
                  <div>
                    <span className={classes.temptitle}> Clinic Name: </span>
                    {ds["clinicName"]}
                    {localStorage.getItem("clinicName")}
                  </div>
                  <div>
                    <span className={classes.temptitle}>
                      {" "}
                      Organization Name:
                    </span>{" "}
                    {localStorage.getItem("clinicName")}
                  </div>
                </Card.Body>
                {dispObj}
                <div className={classes.thumbnailDiv}>{thumbnails}</div>
              </div>

              {/* uncomment the below part */}
              {/* <div id="divToPrint">
              <Card.Body>
                <div>
                  <span className={classes.temptitle}> Date </span>
                  {ds["date"]}
                </div>
                <div>
                  <span className={classes.temptitle}>Time </span>
                  {ds["time"]}
                </div>
              </Card.Body>

              <Card.Body>
                <div>
                  <span className={classes.temptitle}> Doctor Name:</span>{" "}
                  {ds["drName"]}
                </div>
                <div>
                  <span className={classes.temptitle}> Clinic Name: </span>
                  {ds["clinicName"]}
                </div>
                <div>
                  <span className={classes.temptitle}> Organization Name:</span>{" "}
                  {ds["clinicName"]}
                </div>
              </Card.Body>

              <Card.Body>
                <div>
                  <span className={classes.temptitle}> Patient Name:</span>{" "}
                  {ds["patientName"]}
                </div>
                <div>
                  <span className={classes.temptitle}>
                    {" "}
                    Patient Card Number:{" "}
                  </span>
                  {ds["patientCardNo"]}
                </div>
                <div>
                  <span className={classes.temptitle}> Patient Visit:</span>{" "}
                  {ds["patientVisit"]}
                </div>
              </Card.Body>

              <Card.Body>
                <div>
                  <span className={classes.temptitle}> Instructions</span>
                  <div>{ds["instruction"]}</div>
                </div>
              </Card.Body>

              <Card.Body>
                <div>
                  <span className={classes.temptitle}> AdviseRx</span>
                  <br />
                  {medicines}
                </div>
              </Card.Body>

              <Card.Body>
                <div>
                  <span className={classes.temptitle}> Status</span>{" "}
                  <span className={classes.temptitleBlue}> {ds["status"]}</span>
                </div>
                <br />
                <div>
                  <span className={classes.temptitle}> Complaint</span>
                </div>
                <br />
                <div>
                  <span className={classes.temptitle}> Diagnosis</span>

                </div>
                <br />
              </Card.Body>

              <Card.Body>
                <div>
                  <span className={classes.temptitle}> Investigations</span>
                  <div>{ds["investigation"]}</div>
                  
                </div>
              </Card.Body>

              <Card.Body>
                <div>
                  <span className={classes.temptitle}> Surgery</span>
                  <div>{ds["surgery"]}</div>
                </div>
                <br />
                <div>
                  <span className={classes.temptitle}> Chemotherapy</span>
                  <div>{ds["chemotherapy"]}</div>
                </div>
                <br />
                <div>
                  <span className={classes.temptitle}> Radiotherapy</span>
                  <div>{ds["radiotherapy"]}</div>
                </div>
                <br />
                <div>
                  <span className={classes.temptitle}> Procedure</span>

                </div>
                <br />

                <div>
                  <span className={classes.temptitle}> Remarks</span>
                </div>
              </Card.Body>
            </div> */}
            </Card>
          </div>
          {/* <div className={classes.pullDsSidePane}>
            <br />
            <div>{linkToCreatePg}</div>
            <br />
            <div>
              <Button
                onClick={() => {
                  localStorage.setItem(
                    "patient",
                    JSON.stringify(props.patient)
                  );
                  setRedirect(
                    <Redirect
                      to={{
                        pathname: "/dischargeSummaryCreate",
                        state: {
                          patient: props.patient,
                        },
                      }}
                    />
                  );
                }}
              >
                New
              </Button>
            </div>
            <br />
            <h4>Visits</h4>
            {visits}
          </div> */}
        </div>
      </>
    </div>
  );
};

export default PullPatientDischargeInfo;
