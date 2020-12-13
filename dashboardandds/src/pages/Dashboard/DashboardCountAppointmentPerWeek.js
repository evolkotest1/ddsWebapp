import React, { Component, useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import classes from "./Dashboard.module.css";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { hostAddress } from "../../assets/config";
import { currentServer } from "../../assets/config";

class DashboardCountAppointmentPerWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = { Data: {} };
  }
  componentDidMount() {
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    axios
      .put(
        hostAddress +
          currentServer +
          "/RestEasy/DashboardWebService/getCountAppointmentPerWeek"
      )
      .then((response) => {
        console.log("getCountAppointmentPerWeekResponse: ", response.data);
        const weekdata = response.data.ptAppointmentOrgList;
        let apptDate = [];
        let dateCreatedTotal = [];
        weekdata.forEach((record) => {
          apptDate.push(record.apptDate);
          dateCreatedTotal.push(record.dateCreatedTotal);
        });
        this.setState({
          Data: {
            labels: apptDate,
            datasets: [
              {
                label: "Online Appointments",
                data: dateCreatedTotal,
                backgroundColor: "blue",
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 0,
              },
            ],
          },
        });
      });
  }
  render() {
    return (
      <div className={classes.weekAppointment}>
        <Bar data={this.state.Data} options={{ maintainAspectRatio: false }} />
      </div>
    );
  }
}
export default DashboardCountAppointmentPerWeek;
