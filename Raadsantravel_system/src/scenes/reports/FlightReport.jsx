import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { flightReport } from "../../api/financeapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import myImage from "../systelogo.jpg";
import Select from "react-select";
import { getflightInfo } from "../../api/userapi";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const showToastMessage = (type, message) => {
    toast(message, {
      type: type,
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const [salesreportinformation, setSalesreportInformation] = useState([]);
  const [salesinfo, setSalesInfo] = useState({
    fromDate: "",
    toDate: "",
  });
  var [airline, setAirline] = useState([]);
  var [airlineVal, setAirlineVal] = useState([]);

  useEffect(() => {
    getAlldata();
  }, []);
  const getAlldata = async () => {
    var flightInfo = await getflightInfo();
    var flightinformation = flightInfo.Message;
    var filter_flight = [];
        for (var i = 0; i < flightinformation.length; i++) {
          
          filter_flight.push({
            value: flightinformation[i].flight_id,
            label:
              flightinformation[i].flight_code +
              " | " +
              flightinformation[i].flight_name,
          });
        }
        setAirline(filter_flight);
  };
  const handleFormSubmit = async (event) => {
    document.getElementById("btnSubmit").innerText = "Loading...";
    setSalesreportInformation([]);
    event.preventDefault();
    var post = new FormData();
    post.append("action", "FlightReport");
    post.append("FlightID", airlineVal.value);
    post.append("FromDate", salesinfo.fromDate);
    post.append("ToDate", salesinfo.toDate);
    var salesreportInfo = await flightReport(post);

    if (salesreportInfo.status) {
      if (salesreportInfo.Message.length === 0)
        showToastMessage("error", "No data Found.");

      setSalesreportInformation(salesreportInfo.Message);
      var regExpenseForm = document.getElementById("regExpenseForm");
      regExpenseForm.reset();
      // setSalesInfo({
      //   fromDate: "",
      //   toDate: "",
      // });
    } else {
      setSalesreportInformation([]);

      showToastMessage("error", salesreportInfo.Message);
    }
    document.getElementById("btnSubmit").innerText = "Search";
  };
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setSalesInfo({ ...salesinfo, [name]: value });
  };

  const tableClass =
    theme.palette.mode === "dark"
      ? "table table-striped table-dark"
      : "table table-striped";
  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";
  const selectBgColor = theme.palette.mode === "light" ? "#E8F0FE" : "#323848";
  const selectFgColor = theme.palette.mode === "light" ? "black" : "white";

  const columns = [
    { title: "#", field: "index" },
    // { title: "PNR", field: "ticket_id" },
    { title: "Name", field: "customer_name" },
    { title: "Phone", field: "customer_phone" },
    // { title: "Ticket", field: "ticket_type" },
    // { title: "Travel", field: "travel_type" },
    { title: "Depature", field: "depature_place" },
    { title: "Arrival", field: "arrival_place" },
    { title: "Flight", field: "flight_id" },
    // { title: "Gross", field: "gross_amount" },
    // { title: "Net", field: "net_amount" },
    // { title: "Status", field: "ticket_status" },
  ];
  // const columns = [
  //   "#",
  //   "Service",
  //   "Name",
  //   "Phone",
  //   "Price",
  //   "Selled By",
  //   "Date",
  // ];
  const downloadPdf = () => {
    var totalp = 0;
    var totaln = 0;
    salesreportinformation.map((sale, index) => {
      totalp+=parseFloat(sale.gross_amount)
      totaln+=parseFloat(sale.net_amount)
    })
    var tableData = salesreportinformation;
    for (let i = 0; i < tableData.length; i++) {
      tableData[i].index = i + 1;
      // tableData[i].gross_amount = "$"+tableData[i].gross_amount;
      // tableData[i].net_amount = "$"+tableData[i].net_amount;
    }
    
    // tableData.push({
    //   index: "",
    //   customer_name: "",
    //   customer_phone:"",
    //   depature_place:"",
    //   arrival_place:"",
    //   flight_id:"",
    //   gross_amount:"$"+totalp,
    //   net_amount:"$"+totaln
    // })
    // console.log(tableData.length,tableData);
    // return;
    // console.log(tableData);
    // return;
    var doc = new jsPDF();
    const imgData = myImage;

    // Add the image to the PDF
    doc.addImage(imgData, "JPEG", 80, 0, 50, 50); // Adjust the coordinates and dimensions as needed
    // doc.text("5G TRAVEL AGENCY AND LOGISTICS", 70, 45);
    doc.text("FLIGHT INFORMATION REPORT", 60, 55);
    const tableOptions = {
      startX: 20,
      startY: 65,
      margin: { top: 20, bottom: 20 },
      styles: { overflow: "linebreak" },
    };
    doc.autoTable({
      theme: "grid",
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body: tableData,
      ...tableOptions,
    });
    // doc.autoTable({
    //   theme: "grid",
    //   head: columns,
    //   data: tableData,
    // });
    var currentdate = new Date();
    var documentName =
      "Flight_Report " +
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " : " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds() +
      ".pdf";
    // console.log(documentName);
    doc.save(documentName);
  };

  var totalgross = 0;
  var totalnet = 0;

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="FLIGHT REPORT" subtitle="" />

      <form id="regExpenseForm" onSubmit={handleFormSubmit}>
        <Box
          display="grid"
          gap="40px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <div className="row" style={{ width: "450%" }}>
          <div className="form-group col-4">
              <label>Select Airline</label>
              <Select
                value={airlineVal}
                styles={{
                  menu: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
                name="airline_id"
                id="airline_id"
                options={airline}
                onChange={setAirlineVal}
                required
              />
            </div>
            <div className="col-2">
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="From Date"
                onChange={handleOnChange}
                // value={values.RegisterDate}
                name="fromDate"
                // sx={{ gridColumn: "span 2" }}
                required
              />
            </div>
            <div className="col-2">
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="To Date"
                onChange={handleOnChange}
                // value={values.RegisterDate}
                name="toDate"
                // sx={{ gridColumn: "span 2" }}
                required
              />
            </div>
            <div className="col-2">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                style={{ height: "100%", width: "100%" }}
                id="btnSubmit"
              >
                Search
              </Button>
            </div>
            <div className="col-2">
              <Button
                type="button"
                color="info"
                variant="contained"
                style={{ height: "100%", width: "100%" }}
                onClick={downloadPdf}
              >
                <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                Download
              </Button>
            </div>
          </div>
        </Box>
      </form>

      {salesreportinformation.length === 0 ? (
        <h1
          style={{
            color: { emptyColor },
            textAlign: "center",
            marginTop: "8%",
          }}
        >
          No data Found
        </h1>
      ) : (
        <Table className={tableClass} style={{ marginTop: "3%" }}>
          <thead>
            <tr>
              
              <th scope="col">PNR</th>
              <th scope="col">FName</th>
              <th scope="col">LName</th>
              <th scope="col">Sex</th>
              <th scope="col">Phone</th>
              <th scope="col">Type</th>
              <th scope="col">Depature</th>
              <th scope="col">Travel Date</th>
              <th scope="col">Arrival</th>
              <th scope="col">Airline</th>
              <th scope="col">Ticket</th>
              <th scope="col">Gross</th>
              <th scope="col">Net</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {salesreportinformation.map((ticket, index) => {
              var type_className = "";
                const separators = / |T/;
                if (ticket.ticket_status === "Confirm") {
                  type_className = "btn bg-info btn-sm";
                } else if (ticket.ticket_status === "Booking") {
                  type_className = "btn btn-warning btn-sm";
                } else if (ticket.ticket_status === "Used") {
                  type_className = "btn btn-success btn-sm";
                } else if (ticket.ticket_status === "Cancel") {
                  type_className = "btn btn-danger btn-sm";
                }
                totalgross += parseFloat(ticket.gross_amount);
                totalnet += parseFloat(ticket.net_amount);
              return (
                <tr key={index}>
                 <td>{ticket.ticket_id}</td>
                    <td>{ticket.customer_title + ". " +ticket.customer_name.split(",")[0]}</td>
                    <td>{ticket.customer_name.split(",")[1]}</td>
                     <td>{ticket.customer_sex}</td>
                    <td>{ticket.customer_phone}</td>
                    <td>{ticket.travel_type}</td>
                    <td>{ticket.depature_place}</td>
                    <td>{ticket.depature_date.split(separators)[0]}</td>
                    <td>{ticket.arrival_place}</td>
                    <td>{ticket.flight_id}</td>
                    <td>{ticket.ticket_type}</td>
                    <td>${ticket.gross_amount}</td>
                    <td>${ticket.net_amount}</td>
                    <td>
                      <div
                        style={{ color: "white", pointerEvents: "none" }}
                        className={type_className}
                      >
                        {ticket.ticket_status}
                      </div>
                    </td>
                </tr>
              );
            })}
            <tr>
               <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
               <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>${totalgross.toLocaleString("en-US")}</td>
              <td>${totalnet.toLocaleString("en-US")}</td>
              <td>-</td>
            </tr>
          </tbody>
        </Table>
      )}
    </Box>
  );
};

export default Form;
