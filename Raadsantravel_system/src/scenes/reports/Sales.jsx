import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { salesReport } from "../../api/financeapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Table } from "react-bootstrap";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import myImage from "../systelogo.jpg";

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
  var sale_type = document.getElementById("sale_type");
  const handleFormSubmit = async (event) => {
    document.getElementById("btnSubmit").innerText = "Loading...";

    setSalesreportInformation([]);
    event.preventDefault();
    var post = new FormData();
    post.append("action", "salesReport");
    post.append("sale_type", sale_type.value);
    post.append("FromDate", salesinfo.fromDate);
    post.append("ToDate", salesinfo.toDate);
    var salesreportInfo = await salesReport(post);

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
    { title: "Service", field: "Service" },
    { title: "Name", field: "customer_name" },
    { title: "Phone", field: "customer_phone" },
    { title: "Price", field: "Credit" },
    { title: "Selled By", field: "fname" },

    { title: "Date", field: "date" },
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
    salesreportinformation.map((sale, index) => {
      totalp+=parseFloat(sale.Credit)
    })
    var tableData = salesreportinformation;
    for (let i = 0; i < tableData.length; i++) {
      var serviceName = "";
      if (
        tableData[i].ticket_id != "-" &&
        (tableData[i].visa_id == "-") & (tableData[i].cargo_id == "-")
      ) {
        serviceName = "Ticket";
      } else if (
        tableData[i].ticket_id == "-" &&
        (tableData[i].visa_id != "-") & (tableData[i].cargo_id == "-")
      ) {
        serviceName = "Visa";
      } else if (
        tableData[i].ticket_id == "-" &&
        (tableData[i].visa_id == "-") & (tableData[i].cargo_id != "-")
      ) {
        serviceName = "Cargo";
      }
      tableData[i].index = i + 1;
      tableData[i].Service = serviceName;
      tableData[i].Credit = "$"+tableData[i].Credit;
      // totalp +=parseFloat(tableData[i].Credit)
    }
    
    tableData.push({
      index: "",
      Service:"",
      customer_name: "",
      customer_phone:"",
      fname:"",
      date:"",
      Credit:"$"+totalp
    })
    // console.log(tableData.length,tableData);
    // return;
    // console.log(tableData);
    // return;
    var doc = new jsPDF();
    const imgData = myImage;

    // Add the image to the PDF
    doc.addImage(imgData, "JPEG", 80, 0, 50, 50); // Adjust the coordinates and dimensions as needed
    // doc.text("5G TRAVEL AGENCY AND LOGISTICS", 70, 45);
    doc.text("SALES INFORMATION REPORT", 60, 55);
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
      "Sales_Report " +
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

  var totalprice = 0;

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="SALES REPORT" subtitle="" />

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
            <div className="col-2">
              <select
                fullWidth
                variant="filled"
                component="select"
                name="sale_type"
                id="sale_type"
                onChange={handleOnChange}
                style={{
                  // gridColumn: "span 1",
                  backgroundColor: selectBgColor,
                  color: selectFgColor,
                  height: "100%",
                  width: "100%",
                }}
              >
                <option value="">Select Type</option>
                <option value="T">Ticket</option>
                <option value="V">Visa</option>
                <option value="C">Cargo</option>
              </select>
            </div>
            <div className="col-3">
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
            <div className="col-3">
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
            <div className="col-2 ">
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
            <div className="col-2 ">
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
              <th scope="col">#</th>
              <th scope="col">Service</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Customer Phone</th>
              <th scope="col">Price</th>
              <th scope="col">Selled By</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {salesreportinformation.map((sale, index) => {
              var serviceName = "";
              if (
                sale.ticket_id != "-" &&
                (sale.visa_id == "-") & (sale.cargo_id == "-")
              ) {
                serviceName = "Ticket";
              } else if (
                sale.ticket_id == "-" &&
                (sale.visa_id != "-") & (sale.cargo_id == "-")
              ) {
                serviceName = "Visa";
              } else if (
                sale.ticket_id == "-" &&
                (sale.visa_id == "-") & (sale.cargo_id != "-")
              ) {
                serviceName = "Cargo";
              }
              totalprice += parseFloat(sale.Credit);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{serviceName}</td>
                  <td>{sale.customer_name}</td>
                  <td>{sale.customer_phone}</td>
                  <td>${parseFloat(sale.Credit).toLocaleString("en-US")}</td>
                  <td>{sale.fname}</td>
                  <td>{sale.date}</td>
                </tr>
              );
            })}
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>${totalprice.toLocaleString("en-US")}</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </Table>
      )}
    </Box>
  );
};

export default Form;
