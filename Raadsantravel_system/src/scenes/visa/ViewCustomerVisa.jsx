import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { getBankAccount } from "../../api/financeapi";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Button } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "./AddCustomerVisa";
import ModalU from "./UpdateCustomerVisa";
import DataTable from "./ViewCustomerVisaTable";
import { getCustomerVisaInfo, getVisaInfo } from "../../api/other";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Modal as ModalC } from "react-bootstrap";
import B from "react-bootstrap/Button";
import { generateInvoiceID } from "../../api/userapi";

const ViewTicket = () => {
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customervisainformation, setCustomerVisatInfo] = useState([]);
  const [filtercusvisa_information, setfilterCusViInfo] = useState([]);
  const [bankaccountinformation, setBankInfo] = useState([]);
  const [currentCusVisa, setCurrentCusVisa] = useState([]);
  const [isOpenU, setisOpenU] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [visainformation, setVisaInfo] = useState([]);
  const [show, setShow] = useState(false);
  const [currentTicketD, setCurrentTicketD] = useState([]);
    const [invID, setInvID] = useState("");
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
    var customerVisaInfo = await getCustomerVisaInfo();
    var visaInfo = await getVisaInfo();
    setBankInfo(bankaccountinfo.Message);
    setCustomerVisatInfo(customerVisaInfo.Message);
    setfilterCusViInfo(customerVisaInfo.Message);
    setVisaInfo(visaInfo.Message);
  };
  const handleModal = () => {
    setisOpen(!isOpen);
  };
  const handleClickEditCat = (currentcusvisa_id) => {
    var currentcusvisa = customervisainformation.filter(
      (cusvisa) => cusvisa.customer_id === currentcusvisa_id
    );
    if (
      currentcusvisa[0].visa_status === "Accepted" ||
      currentcusvisa[0].visa_status === "Rejected"
    ) {
      showToastMessage(
        "error",
        "Visa status keeda Accepted ama Rejected ah lama update gareyn karo"
      );
      return;
    }
    setisOpenU(!isOpenU);
    setCurrentCusVisa(currentcusvisa[0]);
  };
  const handleViewImage = (currentcusvisa_id) => {
    var currentcusvisa = customervisainformation.filter(
      (cusvisa) => cusvisa.customer_id === currentcusvisa_id
    );
    var path = process.env.REACT_APP_IMAGE_API + currentcusvisa[0].image_name;
    window.open(path, "_blank");
  };
  const handleViewPdf = (currentcusvisa_id) => {
    var currentcusvisa = customervisainformation.filter(
      (cusvisa) => cusvisa.customer_id === currentcusvisa_id
    );
    var path = process.env.REACT_APP_PDF_API + currentcusvisa[0].pdf_name;
    window.open(path, "_blank");
  };
  const handleViewVisa = (currentcusvisa_id) => {
    var currentcusvisa = customervisainformation.filter(
      (cusvisa) => cusvisa.customer_id === currentcusvisa_id
    );
    var path = process.env.REACT_APP_VI_API + currentcusvisa[0].visapdf_name;
    window.open(path, "_blank");
  };

  const handleSerach = (event) => {
    event.preventDefault();
    var PATTERN = event.target.value.toLowerCase();
    setfilterCusViInfo(
      customervisainformation.filter(function (str) {
        return (
          str.customer_id.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_name.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_phone.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.visa_status.toLowerCase().indexOf(PATTERN) !== -1
        );
      })
    );
  };
  const handleInvoiceDownloaded = async (currentticket_id) => {
    var curretnticket = customervisainformation.filter(
      (ticket) => ticket.customer_id === currentticket_id
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
    setCurrentTicketD(curretnticket[0]);
    setShow(true);
    // console.log();
  };

  const handleClickYes = async () => {
    var inv = document.getElementById("inv").value;
    var iqty = document.getElementById("iqty").value;
    var irate = document.getElementById("irate").value;
    if (inv === "" || iqty === "" || irate === "") {
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
      var custname =
        currentTicketD.customer_title +
        ". " +
        currentTicketD.customer_name.split(",")[0] +" "+ currentTicketD.customer_name.split(",")[1];
      var dp = currentTicketD.visa_country;
      // dp = dp.charAt(0).toUpperCase() + dp.slice(1).toLowerCase();
      var place = "Visa - " + dp;
      const date = new Date();
      var day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const InvoiceDate = `${day} ${month} ${year}`;
      day = parseInt(day) + 1;
      const DueDate = `${day} ${month} ${year}`;
      var amount = parseInt(iqty) * parseInt(irate);
      page.drawText(inv, {
        x: 503,
        y: 737,
        size: 11,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(custname, {
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
      page.drawText(irate + ".00", {
        x: 456,
        y: 445,
        size: 10,
        font2,
        color: rgb(0, 0, 0),
      });
      page.drawText(amount.toString() + ".00", {
        x: 516,
        y: 445,
        size: 10,
        font2,
        color: rgb(0, 0, 0),
      });
        page.drawText(custname, {
          x: 60,
          y: 425,
          size: 9,
          font,
          color: rgb(0, 0, 0),
        });
      page.drawText("$ " + amount.toString() + ".00", {
        x: 516,
        y: 362,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$ " + amount.toString() + ".00", {
        x: 516,
        y: 337,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText("$ " + amount.toString() + ".00", {
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
      var tname = custname + ".pdf";
      link.download = tname;
      link.click();
    } catch (error) {
      console.error("Error:", error);
    }
    setShow(false);
  };
  const handleClose = () => {
    setShow(false);
  };

  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="15px">
      <ToastContainer />
      <ModalC show={show} onHide={handleClose} style={{ color: "black" }}>
        <ModalC.Header closeButton>
          <ModalC.Title>Invoice Information?</ModalC.Title>
        </ModalC.Header>
        <ModalC.Body>
          <div className="row">
            <div className="form-group col-md-4">
              <label>Invoice</label>
              <input
                type="text"
                className="form-control"
                placeholder="Invoice"
                name="inv"
                id="inv"
                value={invID}
                readOnly
                // onChange={handleOnChange}
              />
            </div>

            <div className="form-group col-md-4">
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
            <div className="form-group col-md-4">
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
          <B variant="primary" onClick={handleClickYes}>
            Yes
          </B>
          <B variant="danger" onClick={handleClose}>
            No
          </B>
        </ModalC.Footer>
      </ModalC>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="REGISTER/VIEW CUSTOMER VISA"
          subtitle="Register a New Customer Visa"
        />
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          style={{ width: "20%", marginLeft: "5%" }}
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
              // padding: "10px 20px",
            }}
            onClick={handleModal}
          >
            <PersonAddAltIcon sx={{ mr: "0px" }} />
            Customer Visa
          </Button>
        </Box>
      </Box>
      {isOpenU && (
        <ModalU
          showToastMessage={showToastMessage}
          isOpen={isOpenU}
          setisOpen={setisOpenU}
          bankaccountinformation={bankaccountinformation}
          visainformation={visainformation}
          getAlldata={getAlldata}
          currentCusVisa={currentCusVisa}
          setCurrentCusVisa={setCurrentCusVisa}
        />
      )}
      {isOpen && (
        <Modal
          showToastMessage={showToastMessage}
          isOpen={isOpen}
          setisOpen={setisOpen}
          bankaccountinformation={bankaccountinformation}
          visainformation={visainformation}
          getAlldata={getAlldata}
        />
      )}
      {isOpen === false && isOpenU === false ? (
        customervisainformation.length === 0 ? (
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
            customervisainformation={filtercusvisa_information}
            handleClickEditCat={handleClickEditCat}
            handleViewImage={handleViewImage}
            handleViewPdf={handleViewPdf}
            handleViewVisa={handleViewVisa}
            handleInvoiceDownloaded={handleInvoiceDownloaded}
          />
        )
      ) : (
        ""
      )}
    </Box>
  );
};

export default ViewTicket;
