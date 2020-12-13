import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import styles from "./Styles.module.css";
import classes from "../pages/DischargeSummary/DischargeSummary.module.css";
import { hostAddress } from "../assets/config";
import { currentServer } from "../assets/config";
import { Redirect } from "react-router";
import HamburgerDropdown from "./HamburgerDropdown";
import axios from "axios";
import fs from "fs";
import DefaultPdf from "../assets/DefaultPdf.jpg";

import {
  DropzoneArea,
  DropzoneAreaBase,
  DropzoneDialog,
  DropzoneDialogBase,
} from "material-ui-dropzone";

const DSUploadManager = (props) => {
  const [open, setOpen] = React.useState(false);
  const [arrayOfArrayBuffer, setArrayOfArrayBuffer] = useState([]);
  const [thumbnails, setThumbnails] = useState(null);
  const [uploadRespStr, setUploadRespStr] = useState("");
  const [prompt, setPrompt] = useState(0);
  let allFiles =
    localStorage.getItem("uploadFiles") == null
      ? []
      : JSON.parse(localStorage.getItem("uploadFiles"));

  let globalfiles = null;

  // function handleSubmitOld(files) {
  //   localStorage.setItem("uploadFiles", JSON.stringify(files));
  //   allFiles = JSON.parse(localStorage.getItem("uploadFiles"));
  //   console.log("Files:", files);

  //   let data = {
  //     patientMultiMediaDetails: [
  //       {
  //         addUploadedVisitRequiredFlag: 1,
  //         checked: false,
  //         clinicID: localStorage.getItem("clinicId"),
  //         deviceTimeUTC: Math.floor(new Date().getTime() / 1000),
  //         doctorID: localStorage.getItem("doctorId"),
  //         downloaded: false,
  //         lastSyncTimeFromServer: 0,
  //         patientID: JSON.parse(localStorage.getItem("patient"))["id"],
  //         patientMaxInvestigationID: 0,
  //         ptCaseID: JSON.parse(localStorage.getItem("patient"))["ptcaseId"],
  //         ptInvestigationSubList: [
  //           {
  //             addUploadedVisitRequiredFlag: 1,
  //             checked: false,
  //             clinicID: localStorage.getItem("clinicId"),
  //             deviceTimeUTC: 1595852933256,
  //             doctorID: localStorage.getItem("doctorId"),
  //             downloaded: false,
  //             evolkoVisitID: 0,
  //             investigationID: 86,
  //             patientID: JSON.parse(localStorage.getItem("patient"))["id"],
  //             patientSqlLiteVisitID: 0,
  //             ptCaseID: JSON.parse(localStorage.getItem("patient"))["ptcaseId"],
  //             referredByClinicID: 0,
  //             referredByDoctorID: 0,
  //             referredToClinicID: 0,
  //             referredToDoctorID: 0,
  //             selected: false,
  //             selfFlag: 0,
  //             sqlLiteID: 27,
  //             tagName: "Others",
  //           },
  //         ],
  //         referredByClinicID: 0,
  //         referredByDoctorID: 0,
  //         referredToClinicID: 0,
  //         referredToDoctorID: 0,
  //         selected: false,
  //       },
  //     ],
  //     upload_feature_flag: true,
  //   };
  //   axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  //   axios
  //     .put(
  //       hostAddress +
  //         currentServer +
  //         "/RestEasy/multimediaServices/saveMultiMediathroughSynFramework",
  //       data
  //     )
  //     .then((response) => {
  //       console.log("saveMultiMediathroughSynFramework res", response.data);
  //       let ptInvestigationId =
  //         response.data["patientVisitDetails"][0]["ptInvestigationId"];
  //       let data1 = {
  //         // uploaded: [
  //         //   "68",
  //         //   "65",
  //         //   "6c",
  //         //   "6c",
  //         //   "6f",
  //         //   "20",
  //         //   "77",
  //         //   "6f",
  //         //   "72",
  //         //   "6c",
  //         //   "64",
  //         // ],
  //         uploaded: arrayOfArrayBuffer, //contains FileBody ..bytearray
  //         ptInvestigationID: 63875,
  //         imageFileName: "EVOLKO-ICONS-01", //filename without extension
  //         todayDate: Math.floor(new Date().getTime() / 1000), //utc date
  //         imageTag: "", //always going "" blank
  //         sqlLiteID: 27, //send this if saving images locally
  //       };
  //       const headers = {
  //         "Content-Type": "multipart/form-data",
  //         Accept: "application/json;charset=UTF-8",
  //       };

  //       const formdata = new FormData();
  //       // formdata.append('uploaded',fs.createReadStream('C:\Users\dell\Desktop\photo-1543713181-a6e21349e2b5.jpg'));
  //       formdata.append("uploaded", files[0]);

  //       formdata.append("ptInvestigationID", ptInvestigationId);
  //       formdata.append(
  //         "imageFileName",
  //         "androidSqlLiteAKNTESTTTTTTTTTTTTTTT_0fc21ed679293036_20200819_145409"
  //       );
  //       formdata.append("todayDate", Math.floor(new Date().getTime() / 1000));
  //       formdata.append("imageTag", "LAB");
  //       formdata.append("sqlLiteID", "179");

  //       // console.log("uploadOriginalImage req data", data1);
  //       // console.log("uploadOriginalImage req formdata", formdata);

  //       var object = {};
  //       formdata.forEach((value, key) => {
  //         console.log("keyvalformdata", key, value);
  //         alert(key);
  //         object[key] = value;
  //       });
  //       console.log(
  //         "uploadOriginalImage req formdata json",
  //         JSON.parse(object)
  //       );

  //       axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  //       axios
  //         .post(
  //           hostAddress +
  //             currentServer +
  //             "/RestEasy/multimediaServices/uploadOriginalImage",
  //           JSON.parse(object)
  //         )
  //         // axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  //         // axios
  //         //   .post(
  //         //     hostAddress + currentServer +
  //         //       "/RestEasy/multimediaServices/uploadOriginalImage",
  //         //     data1
  //         //   )
  //         .then((response) => {
  //           console.log("uploadOriginalImage res", response.data);
  //           setUploadRespStr(JSON.stringify(response.data));
  //           setPrompt(Math.random());
  //         })
  //         .catch((err) => {
  //           console.log("err", err);
  //         });
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //     });

  //   getByteArray(files);
  //   setOpen(false);
  // }
  function handleSubmit(files) {
    localStorage.setItem("uploadFiles", JSON.stringify(files));
    allFiles = JSON.parse(localStorage.getItem("uploadFiles"));
    console.log("Files:", files);
    console.log("Files type:", files[0].type);

    console.log(
      "Math.floor(new Date().getTime() / 1000) type:",
      Math.floor(new Date().getTime() / 1000)
    );

    const timestamp = Date.now(); // This would be the timestamp you want to format

    console.log("timestamptimestamptimestamptimestamp type:", timestamp);

    console.log(
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(timestamp)
    );

    let prefixForMultiMedia = "";
    if (files[0].type.includes("image"))
      prefixForMultiMedia = "React_WebApp_Image";
    else if (files[0].type.includes("video"))
      prefixForMultiMedia = "React_WebApp_Video";
    else if (files[0].type.includes("pdf"))
      //pdf
      prefixForMultiMedia = "React_WebApp_Pdf";

    let thumbnailImg = "tmumb_" + prefixForMultiMedia + "_" + timestamp;

    if (files[0].type.includes("image")) {
      console.log("Files: images");

      let data = {
        patientMultiMediaDetails: [
          {
            addUploadedVisitRequiredFlag: 1,
            checked: false,
            clinicID: localStorage.getItem("clinicId"),
            deviceTimeUTC: Math.floor(new Date().getTime() / 1000),
            doctorID: localStorage.getItem("doctorId"),
            downloaded: false,
            lastSyncTimeFromServer: 0,
            patientID: JSON.parse(localStorage.getItem("patient"))["id"],
            patientMaxInvestigationID: 0,
            ptCaseID: JSON.parse(localStorage.getItem("patient"))["ptcaseId"],
            ptInvestigationSubList: [
              {
                addUploadedVisitRequiredFlag: 1,
                checked: false,
                clinicID: localStorage.getItem("clinicId"),
                deviceTimeUTC: timestamp,
                doctorID: localStorage.getItem("doctorId"),
                downloaded: false,
                evolkoVisitID: 0,
                investigationID: 86,
                patientID: JSON.parse(localStorage.getItem("patient"))["id"],
                patientSqlLiteVisitID: 0,
                ptCaseID: JSON.parse(localStorage.getItem("patient"))[
                  "ptcaseId"
                ],
                referredByClinicID: 0,
                referredByDoctorID: 0,
                referredToClinicID: 0,
                referredToDoctorID: 0,
                selected: false,
                selfFlag: 0,
                sqlLiteID: 27,
                tagName: "Others",
              },
            ],
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
          let ptInvestigationId =
            response.data["patientVisitDetails"][0]["ptInvestigationId"];
          let data1 = {
            // uploaded: [
            //   "68",
            //   "65",
            //   "6c",
            //   "6c",
            //   "6f",
            //   "20",
            //   "77",
            //   "6f",
            //   "72",
            //   "6c",
            //   "64",
            // ],
            uploaded: arrayOfArrayBuffer, //contains FileBody ..bytearray
            ptInvestigationID: 63875,
            imageFileName: "EVOLKO-ICONS-01", //filename without extension
            todayDate: Math.floor(new Date().getTime() / 1000), //utc date
            imageTag: "", //always going "" blank
            sqlLiteID: 27, //send this if saving images locally
          };
          const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json;charset=UTF-8",
          };

          const formdata = new FormData();
          // formdata.append('uploaded',fs.createReadStream('C:\Users\dell\Desktop\photo-1543713181-a6e21349e2b5.jpg'));
          formdata.append("uploaded", files[0]);

          formdata.append("ptInvestigationID", ptInvestigationId);
          formdata.append("imageFileName", thumbnailImg);

          formdata.append("todayDate", timestamp);
          formdata.append("imageTag", "Others");
          formdata.append("sqlLiteID", "179");

          console.log("uploadOriginalImage req data", data1);
          console.log("uploadOriginalImage req formdata", formdata);

          var object = {
            uploaded: files[0],
            ptInvestigationID: ptInvestigationId,
            imageFileName: thumbnailImg,
            todayDate: timestamp,
            imageTag: "Others",
            sqlLiteID: "179",
          };

          let temp = {};
          formdata.forEach((value, key) => {
            temp[key] = value;
          });
          console.log("uploadOriginalImage req formdata obj", temp);

          axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
          axios
            .post(
              hostAddress +
                currentServer +
                "/RestEasy/multimediaServices/uploadOriginalImage",
              formdata
            )
            // axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
            // axios
            //   .post(
            //     hostAddress + currentServer +
            //       "/RestEasy/multimediaServices/uploadOriginalImage",
            //     data1
            //   )
            .then((response) => {
              console.log("uploadOriginalImage res", response.data);
              setUploadRespStr(JSON.stringify(response.data));
              setPrompt(Math.random());
            })
            .catch((err) => {
              console.log("err", err);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else if (files[0].type.includes("video")) {
      console.log("video");

      let data = {
        patientMultiMediaDetails: [
          {
            addUploadedVisitRequiredFlag: 1,
            checked: false,
            clinicID: localStorage.getItem("clinicId"),
            deviceTimeUTC: Math.floor(new Date().getTime() / 1000),
            doctorID: localStorage.getItem("doctorId"),
            downloaded: false,
            lastSyncTimeFromServer: 0,
            patientID: JSON.parse(localStorage.getItem("patient"))["id"],
            patientMaxInvestigationID: 0,
            ptCaseID: JSON.parse(localStorage.getItem("patient"))["ptcaseId"],
            ptInvestigationSubList: [
              {
                addUploadedVisitRequiredFlag: 1,
                checked: false,
                clinicID: localStorage.getItem("clinicId"),
                deviceTimeUTC: 1595852933256,
                doctorID: localStorage.getItem("doctorId"),
                downloaded: false,
                evolkoVisitID: 0,
                investigationID: 85,
                patientID: JSON.parse(localStorage.getItem("patient"))["id"],
                patientSqlLiteVisitID: 0,
                ptCaseID: JSON.parse(localStorage.getItem("patient"))[
                  "ptcaseId"
                ],
                referredByClinicID: 0,
                referredByDoctorID: 0,
                referredToClinicID: 0,
                referredToDoctorID: 0,
                selected: false,
                selfFlag: 0,
                sqlLiteID: 27,
                tagName: "Others",
              },
            ],
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
          // "/RestEasy/videoUploadServices/saveVideoThroughSyncFrameWork",
          //"/RestEasy/videoUploadServices/savePDFThroughSyncFrameWork",
          data
        )
        .then((response) => {
          console.log("saveVideoThroughSyncFrameWork res", response.data);
          let ptInvestigationId =
            response.data["patientVisitDetails"][0]["ptInvestigationId"];
          let data1 = {
            // uploaded: [
            //   "68",
            //   "65",
            //   "6c",
            //   "6c",
            //   "6f",
            //   "20",
            //   "77",
            //   "6f",
            //   "72",
            //   "6c",
            //   "64",
            // ],
            uploaded: arrayOfArrayBuffer, //contains FileBody ..bytearray
            ptInvestigationID: 63875,
            imageFileName: "EVOLKO-ICONS-01", //filename without extension
            todayDate: Math.floor(new Date().getTime() / 1000), //utc date
            imageTag: "", //always going "" blank
            sqlLiteID: 27, //send this if saving images locally
          };
          const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json;charset=UTF-8",
          };

          const formdata = new FormData();
          // formdata.append('uploaded',fs.createReadStream('C:\Users\dell\Desktop\photo-1543713181-a6e21349e2b5.jpg'));
          formdata.append("uploaded", files[0]);

          formdata.append("ptInvestigationID", ptInvestigationId);
          formdata.append("imageFileName", thumbnailImg);

          formdata.append("todayDate", timestamp);
          formdata.append("imageTag", "Others");
          formdata.append("sqlLiteID", "179");

          console.log("uploadOriginalImage req data", data1);
          console.log("uploadOriginalImage req formdata", formdata);

          var object = {};
          formdata.forEach((value, key) => {
            object[key] = value;
          });
          var json = JSON.stringify(object);
          console.log("uploadOriginalImage req formdata json", json);

          axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
          axios
            .post(
              hostAddress +
                currentServer +
                //"/RestEasy/multimediaServices/uploadOriginalImage",
                "/RestEasy/videoUploadServices/saveUploadedVideo",
              //"/RestEasy/videoUploadServices/saveUploadedPDF",
              formdata,

              { headers }
            )
            // axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
            // axios
            //   .post(
            //     hostAddress + currentServer +
            //       "/RestEasy/multimediaServices/uploadOriginalImage",
            //     data1
            //   )
            .then((response) => {
              console.log("saveUploadedVideo res", response.data);
              setUploadRespStr(JSON.stringify(response.data));
              setPrompt(Math.random());
            })
            .catch((err) => {
              console.log("err", err);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else if (files[0].type.includes("pdf")) {
      console.log("pdf");

      let data = {
        patientMultiMediaDetails: [
          {
            addUploadedVisitRequiredFlag: 1,
            checked: false,
            clinicID: localStorage.getItem("clinicId"),
            deviceTimeUTC: Math.floor(new Date().getTime() / 1000),
            doctorID: localStorage.getItem("doctorId"),
            downloaded: false,
            lastSyncTimeFromServer: 0,
            patientID: JSON.parse(localStorage.getItem("patient"))["id"],
            patientMaxInvestigationID: 0,
            ptCaseID: JSON.parse(localStorage.getItem("patient"))["ptcaseId"],
            ptInvestigationSubList: [
              {
                addUploadedVisitRequiredFlag: 1,
                checked: false,
                clinicID: localStorage.getItem("clinicId"),
                deviceTimeUTC: 1595852933256,
                doctorID: localStorage.getItem("doctorId"),
                downloaded: false,
                evolkoVisitID: 0,
                investigationID: 1000,
                patientID: JSON.parse(localStorage.getItem("patient"))["id"],
                patientSqlLiteVisitID: 0,
                ptCaseID: JSON.parse(localStorage.getItem("patient"))[
                  "ptcaseId"
                ],
                referredByClinicID: 0,
                referredByDoctorID: 0,
                referredToClinicID: 0,
                referredToDoctorID: 0,
                selected: false,
                selfFlag: 0,
                sqlLiteID: 27,
                tagName: "Others",
              },
            ],
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
          //"/RestEasy/videoUploadServices/saveVideoThroughSyncFrameWork",
          //"/RestEasy/videoUploadServices/savePDFThroughSyncFrameWork",
          data
        )
        .then((response) => {
          console.log("saveMultiMediathroughSynFramework res", response.data);
          let ptInvestigationId =
            response.data["patientVisitDetails"][0]["ptInvestigationId"];
          let data1 = {
            // uploaded: [
            //   "68",
            //   "65",
            //   "6c",
            //   "6c",
            //   "6f",
            //   "20",
            //   "77",
            //   "6f",
            //   "72",
            //   "6c",
            //   "64",
            // ],
            uploaded: arrayOfArrayBuffer, //contains FileBody ..bytearray
            ptInvestigationID: 63875,
            imageFileName: "EVOLKO-ICONS-01", //filename without extension
            todayDate: Math.floor(new Date().getTime() / 1000), //utc date
            imageTag: "", //always going "" blank
            sqlLiteID: 27, //send this if saving images locally
          };
          const headers = {
            "Content-Type": "multipart/form-data",
            Accept: "application/json;charset=UTF-8",
          };

          const formdata = new FormData();
          // formdata.append('uploaded',fs.createReadStream('C:\Users\dell\Desktop\photo-1543713181-a6e21349e2b5.jpg'));
          formdata.append("uploaded", files[0]);

          formdata.append("ptInvestigationID", ptInvestigationId);
          formdata.append("imageFileName", thumbnailImg);

          formdata.append("todayDate", timestamp);
          formdata.append("imageTag", "Others");
          formdata.append("sqlLiteID", "179");

          console.log("uploadOriginalImage req data", data1);
          console.log("uploadOriginalImage req formdata", formdata);

          var object = {};
          formdata.forEach((value, key) => {
            object[key] = value;
          });
          var json = JSON.stringify(object);
          console.log("uploadOriginalImage req formdata json", json);

          axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
          axios
            .post(
              hostAddress +
                currentServer +
                //"/RestEasy/multimediaServices/uploadOriginalImage",
                //"/RestEasy/videoUploadServices/saveUploadedVideo",
                "/RestEasy/videoUploadServices/saveUploadedPDF",
              formdata,

              { headers }
            )
            // axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
            // axios
            //   .post(
            //     hostAddress + currentServer +
            //       "/RestEasy/multimediaServices/uploadOriginalImage",
            //     data1
            //   )
            .then((response) => {
              console.log("saveUploadedPDF res", response.data);
              setUploadRespStr(JSON.stringify(response.data));
              setPrompt(Math.random());
            })
            .catch((err) => {
              console.log("err", err);
            });
        })
        .catch((err) => {
          console.log("err", err);
        });
    }

    // getByteArray(files);
    setOpen(false);
  }

  function viewFile(arrayBuffer, type) {
    var blob = new Blob([arrayBuffer], { type: type });
    var url = URL.createObjectURL(blob);
    window.open(url);
  }

  async function getByteArray(files) {
    let arrayOfArrayBuffer = [];

    for (let i in files) {
      let file = files[i];
      let type = file["type"];
      let byteArray = await fileToByteArray(file);
      let arrayBuffer = await byteArrTobase64ToArrayBuffer(byteArray);
      console.log("arrayBuffer", arrayBuffer);
      // viewFile(arrayBuffer, type);
      await arrayOfArrayBuffer.push(arrayBuffer);
    }
    setArrayOfArrayBuffer(arrayOfArrayBuffer);
  }

  function byteArrTobase64ToArrayBuffer(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let base64 = window.btoa(binary);
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  function fileToByteArray(file) {
    return new Promise((resolve, reject) => {
      try {
        let reader = new FileReader();
        let fileByteArray = [];
        reader.readAsArrayBuffer(file);
        reader.onloadend = (evt) => {
          if (evt.target.readyState == FileReader.DONE) {
            let arrayBuffer = evt.target.result,
              array = new Uint8Array(arrayBuffer);
            for (let byte of array) {
              fileByteArray.push(byte);
            }
          }
          resolve(fileByteArray);
        };
      } catch (e) {
        reject(e);
      }
    });
  }
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
          patientID: JSON.parse(localStorage.getItem("patient"))["id"],
          patientMaxInvestigationID: 63080,
          ptCaseID: JSON.parse(localStorage.getItem("patient"))["ptcaseId"],
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
          "https://dev2.evolko.com/RestEasy/multimediaServices/saveMultiMediathroughSynFramework",
        data
      )
      .then((response) => {
        console.log("saveMultiMediathroughSynFramework res", response.data);
        let thumbArr = response.data["patientVisitDetails"];
        setThumbnails(
          thumbArr.map((item) => {
            let thumbNailImageInByteFormat = item["thumbNailImageInByteFormat"];
            let investigationName = item["investigationName"];

            console.log(
              "thumbNailImageInByteFormat res",
              thumbNailImageInByteFormat
            );

            if (investigationName == "Pdf") {
              let dataId = item["thumbnailDataId"];
              console.log(
                "dataId saveMultiMediathroughSynFramework res",
                dataId
              );
              console.log(
                "Number above(dataId) in handleThumbnailClick resp",
                Number(dataId)
              );

              return (
                <img
                  className={styles.thumbnailImg}
                  src={DefaultPdf}
                  onClick={handleThumbnailClick(dataId, investigationName)}
                ></img>
              );
            } else {
              let base64String = btoa(
                String.fromCharCode(
                  ...new Uint8Array(thumbNailImageInByteFormat)
                )
              );
              let src = "data:image/*;base64," + base64String;
              let dataId = item["thumbnailDataId"];
              let investigationType = item["investigationName"];

              console.log(
                "dataId saveMultiMediathroughSynFramework res",
                dataId
              );

              return (
                <img
                  className={styles.thumbnailImg}
                  src={src}
                  onClick={handleThumbnailClick(dataId, investigationType)}
                ></img>
              );
            }
          })
        );
      })
      .catch((err) => console.log("err", err));
  }, [prompt]);

  const handleThumbnailClick = (dataId, investigationType) => (event) => {
    console.log(
      "dhandleThumbnailClickhandleThumbnailClickandleThumbnailClick red"
    );

    console.log("dataId in handleThumbnailClick resp", dataId);
    console.log("Number(dataId) in handleThumbnailClick resp", Number(dataId));
    console.log(
      "investigationType in handleThumbnailClick resp",
      investigationType
    );

    let data1 = {
      pId: JSON.parse(localStorage.getItem("patient"))["id"],
      caseId: JSON.parse(localStorage.getItem("patient"))["ptcaseId"],
      original_image_id: Number(dataId),
      investigation_type: investigationType,
    };
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          "https://dev2.evolko.com/RestEasy/DischargeSummaryWebService/downloadOriginalMultimedia",
        data1
      )
      .then((response) => {
        var urlLocation = response.data;
        console.log("urlLocation resp", urlLocation);
        let url = response.data["successString"];
        console.log("url resp", url);

        window.open(url);
      });
  };

  function ArrayBufferToBinary(buffer) {
    var uint8 = new Uint8Array(buffer);
    return uint8.reduce((binary, uint8) => binary + uint8.toString(2), "");
  }

  function displayPicture(pdfString) {
    console.log("displayPicture:displayPicture:displayPicture" + pdfString);

    var file = new Blob([pdfString], { type: "image/png" });

    var url = window.URL.createObjectURL(file);

    window.open(url);
  }

  function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);
    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  function displayVideo(pdfString) {
    console.log("displayVideo:displayVideo:displayVideo");

    var file = new Blob([pdfString], { type: "video/*" });

    var url = window.URL.createObjectURL(file);

    window.open(url);
  }

  function displayApplicationPdf(pdfString) {
    console.log(
      "displayApplicationPdf:displayApplicationPdf:displayApplicationPdf"
    );

    var file = new Blob([pdfString], { type: "application/pdf" });

    var url = window.URL.createObjectURL(file);

    window.open(url);
  }

  function displayPDF(pdfString) {
    console.log("displayPDFdisplayPDF:displayPDF:displayPDF" + pdfString);

    var bytes = [];
    for (var i = 0; i < pdfString.length; ++i) {
      bytes.push(pdfString.charCodeAt(i));
    }

    var file = new File([byteArrTobase64ToArrayBuffer(bytes)], "pd", {
      type: "application/pdf",
    });

    var url = window.URL.createObjectURL(file);

    window.open(url);
  }

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = btoa(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  function convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ";base64,",
      base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length,
      base64 = dataURI.substring(base64Index),
      raw = window.atob(base64),
      rawLength = raw.length,
      array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  function convertStringToByteArray(str) {
    String.prototype.encodeHex = function () {
      var bytes = [];
      for (var i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
      }
      return bytes;
    };

    var byteArray = str.encodeHex();
    return byteArray;
  }

  return (
    <>
      <Button
        className={styles.uploadImgBtn}
        onClick={() => setOpen(true)}
        variant="secondary"
      >
        Upload
      </Button>
      <DropzoneDialog
        acceptedFiles={["image/*", "application/pdf", "video/*", "text/plain"]}
        clearOnUnmount={false}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={5000000000}
        open={open}
        onClose={() => setOpen(false)}
        // initialFiles={[file]}
        onSave={(files) => {
          handleSubmit(files);
        }}
        filesLimit="20"
        showPreviews={true}
        showFileNamesInPreview={true}
      />
      <div className={styles.thumbnailDiv}>{thumbnails}</div>
    </>
  );
};

export default DSUploadManager;
