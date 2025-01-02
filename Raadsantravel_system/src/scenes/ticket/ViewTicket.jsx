import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { getBankAccount } from "../../api/financeapi";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { Button } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "./AddTicket";
import ModalU from "./UpdateTicket";
import DataTable from "./ViewTicketTable";
import { generateInvoiceID, getflightInfo, getlocationInfo } from "../../api/userapi";
import { getTicketInfo } from "../../api/other";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import B from "react-bootstrap/Button";
import { Modal as ModalB } from "react-bootstrap";
import { Modal as ModalC } from "react-bootstrap";
import { Modal as ModalR } from "react-bootstrap";

const ViewTicket = () => {
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [locationinformation, setLocationInfo] = useState([]);
  const [flightinformation, setFlightInfo] = useState([]);
  const [ticketinformation, setTicketInfo] = useState([]);
  const [filterticket_information, setfilterTicketInfo] = useState([]);
  const [bankaccountinformation, setBankInfo] = useState([]);
  const [currentTicket, setCurrentTicket] = useState([]);
  const [isOpenU, setisOpenU] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [currentTicketD, setCurrentTicketD] = useState([]);
  const [invID, setInvID] = useState("");
  const [recID, setRecID] = useState("");
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
  useEffect(() => {
    getAlldata();
  }, []);
  const getAlldata = async () => {
    var bankaccountinfo = await getBankAccount();
    var locationInfo = await getlocationInfo();
    var ticketInfo = await getTicketInfo();
    var flightInfo = await getflightInfo();
    setFlightInfo(flightInfo.Message);
    setBankInfo(bankaccountinfo.Message);
    setLocationInfo(locationInfo.Message);
    setTicketInfo(ticketInfo.Message);
    setfilterTicketInfo(ticketInfo.Message);
  };
  const handleModal = () => {
    setisOpen(!isOpen);
  };
  const handleTicketDownloaded = async (currentticket_id) => {
    var curretnticket = ticketinformation.filter(
      (ticket) => ticket.ticket_id === currentticket_id
    );
    setCurrentTicketD(curretnticket[0]);
    setShow(true);
    // console.log();
  };

  const handleInvoiceDownloaded = async (currentticket_id) => {
    var curretnticket = ticketinformation.filter(
      (ticket) => ticket.ticket_id === currentticket_id
    );
    var post = {
      action:"generateInvoiceID",
      update:"0"
    }
    var invoiceID = await generateInvoiceID(post)
    // console.log(invoiceID.status)
    if(invoiceID.status){

      setInvID("INV-00"+invoiceID.Message)
    }
    setCurrentTicketD(curretnticket[0]);
    setShow2(true);
    // console.log();
  };
  const handleRecDownloaded = async (currentticket_id) => {
    var curretnticket = ticketinformation.filter(
      (ticket) => ticket.ticket_id === currentticket_id
    );
    var post = {
      action:"generateInvoiceID",
      update:"0"
    }
    var invoiceID = await generateInvoiceID(post)
    // console.log(invoiceID.status)
    if(invoiceID.status){

      setRecID("REC-00"+(parseInt(invoiceID.Message)-1))
    }
    setCurrentTicketD(curretnticket[0]);
    setShow3(true);
    // console.log();
  };
  const handleClickEditCat = (currentticket_id) => {
    var curretnticket = ticketinformation.filter(
      (ticket) => ticket.ticket_id === currentticket_id
    );
    if (
      curretnticket[0].ticket_status === "Used" ||
      curretnticket[0].ticket_status === "Cancel"
    ) {
      showToastMessage(
        "error",
        "Ticket status kiisa used ama cancel ah lama update gareyn karo"
      );
      return;
    }
    setisOpenU(!isOpenU);
    setCurrentTicket(curretnticket[0]);
  };

  const handleSerach = (event) => {
    event.preventDefault();
    var PATTERN = event.target.value.toLowerCase();
    setfilterTicketInfo(
      ticketinformation.filter(function (str) {
        return (
          str.ticket_id.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_name.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_phone.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.ticket_status.toLowerCase().indexOf(PATTERN) !== -1
        );
      })
    );
  };
  const handleClickYes = async () => {
    const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const day = String(currentDate.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;
    var pnr = document.getElementById("pnr").value;
    var dai = document.getElementById("dai").value;
    var ftn = document.getElementById("ftn").value;
    var det = document.getElementById("det").value;
    var arrt = document.getElementById("arrt").value;
    var fn = document.getElementById("fn").value;
    var checktime = document.getElementById("checktime").value
    var flightn = document.getElementById("flightn").value;
    var price = document.getElementById("price").value;
    var tax = document.getElementById("tax").value;
    var totalp = parseFloat(price) + parseFloat(tax);
    if (
      pnr === "" ||
      dai === "" ||
      ftn === "" ||
      det === "" ||
      arrt === "" ||
      fn === "" ||
      checktime ==""||
      flightn === "" ||
      price === "" ||
      tax === ""
    ) {
      showToastMessage("error", "Please fill missing input");
      return;
    }

    const fileInput = document.getElementById('flightlogo');
    const file = fileInput.files[0];
    const validExtensions = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
    
    if (file) {
        const fileExtension = file.name.split('.').pop();
        
        if (validExtensions.includes(fileExtension)) {
            // return true;
        } else {
            showToastMessage("error", "Invalid file extension. Please select a PNG or JPG image.");
            fileInput.value = ''; // Clear the input value
            return false;
        }
    } else {
        showToastMessage("error", "No file selected.");
        return false;
    }


    try {
      // Load the existing PDF
      // const url = "../../ticket.pdf";
      const url = "https://admin.5gtrip.so/api/pdf.php?id=aysd^^";
      const response = await fetch(url); // Modify the endpoint URL as needed
      const existingPdfBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      // Add text to the PDF
      const page = pdfDoc.getPages()[0]; // Get the first page (modify as needed)
      // const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const font = await pdfDoc.embedFont("Helvetica-Bold");
      var custname =
        currentTicketD.customer_title +
        " " +
        currentTicketD.customer_name.split(",")[0] +
        " " +
        currentTicketD.customer_name.split(",")[1];
      var custphon = currentTicketD.customer_phone;
      var dp = currentTicketD.depature_place;
      var ap = currentTicketD.arrival_place;

      const imageBytes = await file.arrayBuffer();
      let image;
      if (file.type === 'image/jpeg') {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (file.type === 'image/png') {
        image = await pdfDoc.embedPng(imageBytes);
      }
      // console.log(image)
      // return

      const { width, height } = image.scale(0.35); // Adjust the scale as needed


      page.drawImage(image, {
        x: 360,
        y: 750,
        size: 10,
        width: width,
        height: height,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(pnr, {
        x: 94,
        y: 664,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(flightn, {
        x: 295,
        y: 663,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(formattedDate, {
        x: 520,
        y: 659,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(custname, {
        x: 10,
        y: 580,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(custphon, {
        x: 260,
        y: 580,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(ftn, {
        x: 450,
        y: 580,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(dp, {
        x: 40,
        y: 491,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(ap, {
        x: 40,
        y: 478,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(dai, {
        x: 45,
        y: 505,
        size: 10,
        font,
        color: rgb(1, 1, 1),
      });
      page.drawText(det, {
        x: 200,
        y: 491,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(arrt, {
        x: 200,
        y: 478,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(fn, {
        x: 300,
        y: 491,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(checktime, {
        x: 520,
        y: 491,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$" + price, {
        x: 100,
        y: 410,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$" + tax, {
        x: 310,
        y: 410,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$" + totalp, {
        x: 500,
        y: 410,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      // Save the modified PDF as a new file
      const pdfBytes = await pdfDoc.save();

      // Create a blob from PDF bytes
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      var tname = custname + ".pdf";
      link.download = tname;
      link.click();
    } catch (error) {
      console.error("Error:", error);
    }
    setShow(false);
  };
  const handleClickYes2 = async () => {
    var ipnr = document.getElementById("ipnr").value;
    var inv = document.getElementById("inv").value;
    var ito = document.getElementById("ito").value;
    var iqty = document.getElementById("iqty").value;
    var irate = document.getElementById("irate").value;
    if (
      ipnr === "" ||
      inv === "" ||
      ito === "" ||
      iqty === "" ||
      irate === ""
    ) {
      showToastMessage("error", "Please fill missing input");
      return;
    }
    // console.log(ipnr,ito,iqty,irate);return;
    try {
      // Load the existing PDF
      // const url = "../../ticket.pdf";
      const url = "https://admin.5gtrip.so/api/pdf.php?id=aysd^^in";
      const response = await fetch(url); // Modify the endpoint URL as needed
      const existingPdfBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      // Add text to the PDF
      const page = pdfDoc.getPages()[0]; // Get the first page (modify as needed)
      // const font = await pdfDoc.embedFont(StandardFonts.LucidaSansUnicode);
      const font = await pdfDoc.embedFont("Helvetica-Bold");
      const font2 = await pdfDoc.embedFont("Helvetica");
      var custname1 = ito;
      var custname2 = "";
      var dp = currentTicketD.depature_place;
      dp = dp.charAt(0).toUpperCase() + dp.slice(1).toLowerCase();
      var ap = currentTicketD.arrival_place;
      ap = ap.charAt(0).toUpperCase() + ap.slice(1).toLowerCase();
      var place = dp + " - " + ap;
      if (ito.includes(",")) {
        custname1 = ito.split(",")[0];
        custname2 = ito.split(",")[1];
      }
      const date = new Date();
      var day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const InvoiceDate = `${day} ${month} ${year}`;
      day = parseInt(day) + 1;
      const DueDate = `${day} ${month} ${year}`;
      var amount = parseInt(iqty) * parseFloat(irate);
      page.drawText(inv, {
        x: 503,
        y: 737,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(custname1, {
        x: 61,
        y: 560,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(InvoiceDate, {
        x: 498,
        y: 548,
        size: 10,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(DueDate, {
        x: 498,
        y: 507,
        size: 10,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(place, {
        x: 80,
        y: 445,
        size: 10,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(iqty + ".00", {
        x: 405,
        y: 445,
        size: 10,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(irate , {
        x: 456,
        y: 445,
        size: 10,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(amount.toString(), {
        x: 516,
        y: 445,
        size: 10,
        font2,
        color: rgb(0, 0, 0),
      });
      if (ito.includes(",")) {
        page.drawText(ipnr +" " + custname1, {
          x: 50,
          y: 425,
          size: 9,
          font,
          color: rgb(0, 0, 0),
        });
         page.drawText(ipnr +" " + custname2, {
        x: 50,
        y: 405,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
      } else {
         page.drawText(ipnr +" " + custname1, {
          x: 50,
          y: 425,
          size: 9,
          font,
          color: rgb(0, 0, 0),
        });
      }
      page.drawText("$ " + amount.toString(), {
        x: 516,
        y: 362,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$ " + amount.toString(), {
        x: 516,
        y: 337,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$ " + amount.toString(), {
        x: 513,
        y: 307,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });

      // Save the modified PDF as a new file
      const pdfBytes = await pdfDoc.save();

      // Create a blob from PDF bytes
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      var post = {
      action:"generateInvoiceID",
      update:"1"
    }
    await generateInvoiceID(post)
      var tname = custname1 + ".pdf";
      link.download = tname;
      link.click();
      
    } catch (error) {
      console.error("Error:", error);
    }
    setShow2(false);
  };
  const handleClickYes3 = async () => {
    var rec = document.getElementById("rrec").value;
    var accno = document.getElementById("raccno").value;
    var rtype = document.getElementById("rtype").value;
    var rqty = document.getElementById("rqty").value;
    var rrate = document.getElementById("rrate").value;
    var rpaid = document.getElementById("rpaid").value;
    if (
      rec === "" ||
      accno === "" ||
      rtype === "" ||
      rqty === "" ||
       rrate === "" ||
      rpaid === ""
    ) {
      showToastMessage("error", "Please fill missing input");
      return;
    }
    // console.log(ipnr,ito,iqty,irate);return;
    try {
      // Load the existing PDF
      // const url = "../../ticket.pdf";
      const url = "https://admin.5gtrip.so/api/pdf.php?id=aysd^^re";
      const response = await fetch(url); // Modify the endpoint URL as needed
      const existingPdfBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      // Add text to the PDF
      const page = pdfDoc.getPages()[0]; // Get the first page (modify as needed)
      // const font = await pdfDoc.embedFont(StandardFonts.LucidaSansUnicode);
      const font = await pdfDoc.embedFont("Helvetica-Bold");
      const font2 = await pdfDoc.embedFont("Helvetica");
      var cusname = currentTicketD.customer_title +currentTicketD.customer_name.split(",")[0] + " " + currentTicketD.customer_name.split(",")[1]
      var custname1 = cusname;
      var ticket_type = currentTicketD.ticket_type
      var dp = currentTicketD.depature_place;
      dp = dp.charAt(0).toUpperCase() + dp.slice(1).toLowerCase();
      var ap = currentTicketD.arrival_place;
      ap = ap.charAt(0).toUpperCase() + ap.slice(1).toLowerCase();
      var place ="Go Ticket From "+ dp + " To " + ap;
      const date = new Date();
      var day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const RecDate = `${day} ${month} ${year}`;
      day = parseInt(day) + 1;
      var amount = parseInt(rqty) * parseFloat(rrate);
      var balance = parseFloat(amount) - parseFloat(rpaid);
      // console.log(custname1)
      page.drawText(rec, {
        x: 518,
        y: 730,
        size: 11,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(RecDate, {
        x: 516,
        y: 678,
        size: 11,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(accno, {
        x: 516,
        y: 640,
        size: 10,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(rtype, {
        x: 516,
        y: 620,
        size: 10,
        font2,
        color: rgb(0, 0, 0),
      });
       page.drawText(RecDate, {
        x: 516,
        y: 600,
        size: 11,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText("$"+balance, {
        x: 516,
        y: 575,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(custname1, {
        x: 48,
        y: 556,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(dp +"-", {
        x: 48,
        y: 508,
        size: 11,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(ap, {
        x: 48,
        y: 495,
        size: 11,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(ticket_type, {
        x: 48,
        y: 482,
        size: 11,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(custname1, {
        x: 50,
        y: 390,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(place, {
        x: 50,
        y: 375,
        size: 11,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(rqty, {
        x: 358,
        y: 390,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$"+ rrate, {
        x: 447,
        y: 390,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$"+ amount, {
        x: 525,
        y: 390,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      
      page.drawText("$"+ amount, {
        x: 535,
        y: 315,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$"+ rpaid, {
        x: 535,
        y: 290,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$"+ balance, {
        x: 535,
        y: 265,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      

      // Save the modified PDF as a new file
      const pdfBytes = await pdfDoc.save();

      // Create a blob from PDF bytes
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
    //   var post = {
    //   action:"generateInvoiceID",
    //   update:"1"
    // }
    // await generateInvoiceID(post)
      var tname = custname1 + ".pdf";
      link.download = tname;
      link.click();
      
    } catch (error) {
      console.error("Error:", error);
    }
    setShow3(false);
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleClose2 = () => {
    setShow2(false);
  };
  const handleClose3 = () => {
    setShow3(false);
  };


  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <ModalB show={show} onHide={handleClose} style={{ color: "black" }}>
        <ModalB.Header closeButton>
          <ModalB.Title>Ticket Information?</ModalB.Title>
        </ModalB.Header>
        <ModalB.Body>
          <div className="row">
            <div className="form-group col-md-4">
              <label>PNR</label>
              <input
                type="text"
                className="form-control"
                placeholder="PNR"
                name="pnr"
                id="pnr"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Date Travel</label>
              <input
                type="date"
                className="form-control"
                placeholder="PNR"
                name="dai"
                id="dai"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Flight Ticket Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Flight Ticket Number"
                name="ftn"
                id="ftn"
                // onChange={handleOnChange}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="form-group col-md-4">
              <label>DEP Time</label>
              <input
                type="text"
                className="form-control"
                placeholder="Depature Time"
                name="det"
                id="det"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label>ARR Time</label>
              <input
                type="text"
                className="form-control"
                placeholder="Arrive Time"
                name="arrt"
                id="arrt"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Flight Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Flight Number"
                name="fn"
                id="fn"
                // onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="form-group col-md-4">
              <label>Check In-Time</label>
              <input
                type="text"
                className="form-control"
                placeholder="Check In-Time"
                name="checktime"
                id="checktime"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-8">
              <label>Flight Logo</label>
              <input
                type="file"
                className="form-control"
                placeholder="Flight Logo"
                name="flightlogo"
                id="flightlogo"
                accept=".png, .jpg, .jpeg, .PNG, .JPG, .JPEG"
                // onChange={handleOnChange}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="form-group col-md-4">
              <label>Flight Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Flight Name"
                name="flightn"
                id="flightn"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Price</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="form-control"
                placeholder="Price"
                name="price"
                id="price"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Tax</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="form-control"
                placeholder="Tax"
                name="tax"
                id="tax"
                // onChange={handleOnChange}
              />
            </div>
          </div>
        </ModalB.Body>
        <ModalB.Footer>
          <B variant="primary" onClick={handleClickYes}>
            Yes
          </B>
          <B variant="danger" onClick={handleClose}>
            No
          </B>
        </ModalB.Footer>
      </ModalB>
      <ModalC show={show2} onHide={handleClose2} style={{ color: "black" }}>
        <ModalC.Header closeButton>
          <ModalC.Title>Invoice Information?</ModalC.Title>
        </ModalC.Header>
        <ModalC.Body>
          <div className="row">
            <div className="form-group col-md-3">
              <label>PNR</label>
              <input
                type="text"
                className="form-control"
                placeholder="PNR"
                name="ipnr"
                id="ipnr"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-3">
              <label>Invoice</label>
              <input
                type="text"
                className="form-control"
                placeholder="Invoice"
                name="inv"
                id="inv"
                value={invID}
                // onChange={handleOnChange}
                readOnly
              />
            </div>

            <div className="form-group col-md-6">
              <label>To</label>
              <input
                type="text"
                className="form-control"
                placeholder="To"
                name="ito"
                id="ito"
                // onChange={handleOnChange}
                
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="form-group col-md-6">
              <label>Qty</label>
              <input
                type="text"
                className="form-control"
                placeholder="Qty"
                name="iqty"
                id="iqty"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label>Rate</label>
              <input
                type="text"
                className="form-control"
                placeholder="Rate"
                name="irate"
                id="irate"
                // onChange={handleOnChange}
              />
            </div>
          </div>
        </ModalC.Body>
        <ModalC.Footer>
          <B variant="primary" onClick={handleClickYes2}>
            Yes
          </B>
          <B variant="danger" onClick={handleClose2}>
            No
          </B>
        </ModalC.Footer>
      </ModalC>
      <ModalR show={show3} onHide={handleClose3} style={{ color: "black" }}>
        <ModalC.Header closeButton>
          <ModalC.Title>Receipt Information?</ModalC.Title>
        </ModalC.Header>
        <ModalR.Body>
          <div className="row">
            
            <div className="form-group col-md-3">
              <label>Receipt</label>
              <input
                type="text"
                className="form-control"
                placeholder="Receipt"
                name="rrec"
                id="rrec"
                value={recID}
                // onChange={handleOnChange}
                readOnly
              />
            </div>
            <div className="form-group col-md-4">
              <label>Acc No</label>
              <input
                type="text"
                className="form-control"
                placeholder="Acc No"
                name="raccno"
                id="raccno"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-5">
              <label>Type</label>
              <input
                type="text"
                className="form-control"
                placeholder="Type"
                name="rtype"
                id="rtype"
                // onChange={handleOnChange}
              />
            </div>

          </div>
          <div className="row mt-3">
            <div className="form-group col-md-4">
              <label>Qty</label>
              <input
                type="text"
                className="form-control"
                placeholder="Qty"
                name="rqty"
                id="rqty"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Rate</label>
              <input
                type="text"
                className="form-control"
                placeholder="Rate"
                name="rrate"
                id="rrate"
                // onChange={handleOnChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label>Paid</label>
              <input
                type="text"
                className="form-control"
                placeholder="Paid"
                name="rpaid"
                id="rpaid"
                // onChange={handleOnChange}
              />
            </div>
          </div>
        </ModalR.Body>
        <ModalR.Footer>
          <B variant="primary" onClick={handleClickYes3}>
            Yes
          </B>
          <B variant="danger" onClick={handleClose3}>
            No
          </B>
        </ModalR.Footer>
      </ModalR>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="REGISTER/VIEW TICKET" subtitle="Register a New Ticket" />
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          style={{ width: "20%", marginLeft: "30%" }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            onChange={handleSerach}
            placeholder="Search"
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        <Box>
          <Button
            sx={{
              backgroundColor: "#141B2D",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleModal}
          >
            <MdOutlineAirplaneTicket sx={{ mr: "10px" }} />
            Register Ticket
          </Button>
        </Box>
      </Box>
      {isOpenU && (
        <ModalU
          showToastMessage={showToastMessage}
          isOpen={isOpenU}
          setisOpen={setisOpenU}
          bankaccountinformation={bankaccountinformation}
          locationinformation={locationinformation}
          flightinformation={flightinformation}
          getAlldata={getAlldata}
          currentTicket={currentTicket}
          setCurrentTicket={setCurrentTicket}
        />
      )}
      <Modal
        showToastMessage={showToastMessage}
        isOpen={isOpen}
        setisOpen={setisOpen}
        bankaccountinformation={bankaccountinformation}
        locationinformation={locationinformation}
        flightinformation={flightinformation}
        getAlldata={getAlldata}
      />
      {isOpen === false && isOpenU === false ? (
        ticketinformation.length === 0 ? (
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
          <DataTable
            ticketinformation={filterticket_information}
            handleClickEditCat={handleClickEditCat}
            handleTicketDownloaded={handleTicketDownloaded}
            handleInvoiceDownloaded={handleInvoiceDownloaded}
            handleRecDownloaded={handleRecDownloaded}
          />
        )
      ) : (
        ""
      )}
    </Box>
  );
};

export default ViewTicket;
