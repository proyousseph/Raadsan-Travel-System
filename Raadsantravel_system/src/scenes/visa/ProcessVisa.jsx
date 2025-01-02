import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "./ProcessVisaTable";
import { Button, Modal } from "react-bootstrap";
import { getCustomerVisaInfo, registerProcessVisa } from "../../api/other";
import { useSelector } from "react-redux";
import { getCustomersInfo } from "../../api/financeapi";

const ViewTicket = () => {
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userloginfo } = useSelector((store) => store.userReducer);
  const [customervisainformation, setCustomerVisatInfo] = useState([]);
  const [filtercusvisa_information, setfilterCusViInfo] = useState([]);
  const [currentCusVisa, setCurrentCusVisa] = useState([]);
  const [selectedFilePdf, setSelectedFilePdf] = useState(null);
  const [processType, setProcessType] = useState("");
  const [show, setShow] = useState(false);
  const [isCancel, setIsCancel] = useState(true);
  const [customer_information, setCustomerInfo] = useState([]);
  const [Isdebt, setIsdebt] = useState(false);
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
    var customerVisaInfo = await getCustomerVisaInfo();
    var customerInfo = await getCustomersInfo();
    setCustomerInfo(customerInfo.Message);
    setCustomerVisatInfo(customerVisaInfo.Message);
    var cusvisainfo = customerVisaInfo.Message.filter(
      (cusvisa) => cusvisa.visa_status === "Approved"
    );
    setfilterCusViInfo(cusvisainfo);
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

  const handleClickProcess = (currentcusvisa_id) => {
    setShow(true);
    var currentcusvisa = customervisainformation.filter(
      (cusvisa) => cusvisa.customer_id === currentcusvisa_id
    );
    setCurrentCusVisa(currentcusvisa[0]);
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleOnCange = (event) => {
    const { name, value } = event.target;
    if (name === "process_type") {
      if (value === "Rejected" || value === "") {
        setIsCancel(true);
      } else {
        setIsCancel(false);
      }
      setProcessType(value);
      setSelectedFilePdf(null);
    }

    if (name === "visa_pdf") {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        setSelectedFilePdf(file);
      } else {
        setSelectedFilePdf(null);
        showToastMessage("error", "Please select file type PDF");
        document.getElementById("visa_pdf").value = "";
      }
    }
  };
  const handleClickYes = async (event) => {
    event.preventDefault();
    var post = new FormData();
    if (processType === "") {
      showToastMessage("error", "Please fill the empty inputs");
      return;
    }
    if (processType === "Accepted") {
      if (selectedFilePdf === null) {
        showToastMessage("error", "Please select file pdf to input");
        return;
      }
      var isdebt = document.getElementById("isdebt").value;
      if (isdebt === "No") {
        post.append("CustomerID", "-");
      } else {
        var customerid = document.getElementById("customerid").value;
        if (customerid !== "Z") post.append("CustomerID", customerid);
        else {
          showToastMessage("error", "Please select Customer");
          return;
        }
      }
    }

    post.append("action", "registerProcessVisa");
    post.append("VisaID", currentCusVisa.visa_id);
    post.append("CustomerVisaID", currentCusVisa.customer_id);
    post.append("CustomerName", currentCusVisa.customer_name);
    post.append("CustomerPhone", currentCusVisa.customer_phone);
    post.append("Type", processType);
    post.append("BankID", currentCusVisa.bank_id);
    post.append("NetAmount", currentCusVisa.net_amount);
    post.append("file", selectedFilePdf);
    post.append("SelledBy", userloginfo.userid);
    var visaprocess = await registerProcessVisa(post);
    // console.log(visaprocess);
    // return;
    if (visaprocess.status) {
      showToastMessage("success", visaprocess.Message);
      getAlldata();
      setShow(false);
      setProcessType("");
      setSelectedFilePdf(null);
    } else {
      showToastMessage("error", visaprocess.Message);
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    if (name === "isdebt") {
      if (value === "Yes") {
        setIsdebt(true);
      } else {
        setIsdebt(false);
      }
    }
  };

  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="15px">
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="REGISTER/VIEW CUSTOMER VISA"
          subtitle="Register a New Customer Visa"
        />
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          style={{ width: "25%" }}
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
      </Box>
      <Modal show={show} onHide={handleClose} style={{ color: "black" }}>
        <Modal.Header closeButton>
          <Modal.Title>Process this Visa?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {isCancel === true ? (
              <div className="form-group col-md-12">
                <label>Select Process</label>
                <select
                  className="form-select"
                  name="process_type"
                  id="process_type"
                  onChange={handleOnCange}
                >
                  <option value="">Select Type</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            ) : (
              <>
                <div className="form-group col-md-6">
                  <label>Select Process</label>
                  <select
                    className="form-select"
                    name="process_type"
                    id="process_type"
                    onChange={handleOnCange}
                  >
                    <option value="">Select Type</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="form-group col-md-6">
                  <label>Is it debt?</label>
                  <select
                    className="form-select"
                    placeholder="Is it debt?"
                    name="isdebt"
                    id="isdebt"
                    onChange={handleOnChange}
                  >
                    <option selected value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {Isdebt && (
                  <div className="form-group col-md-6 mt-2">
                    <label>Select Customer</label>
                    <select
                      className="form-select"
                      placeholder="Customer"
                      name="customerid"
                      id="customerid"
                      onChange={handleOnChange}
                    >
                      <option value="Z">Select Customer</option>
                      {customer_information.map((cust, index) => {
                        return (
                          <option value={cust.customer_id}>
                            {cust.customer_name + " | " + cust.customer_phone}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                <div
                  className={
                    Isdebt === true
                      ? "form-group col-md-6 mt-2"
                      : "form-group col-md-12 mt-2"
                  }
                >
                  <label>Visa/ PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="form-control"
                    placeholder="Passaport/ PDF"
                    name="visa_pdf"
                    id="visa_pdf"
                    onChange={handleOnCange}
                  />
                </div>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClickYes}>
            Yes
          </Button>
          <Button variant="danger" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>

      {filtercusvisa_information.length === 0 ? (
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
          handleClickProcess={handleClickProcess}
        />
      )}
    </Box>
  );
};

export default ViewTicket;
