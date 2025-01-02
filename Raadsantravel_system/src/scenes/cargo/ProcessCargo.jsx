import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "./ProcessCargoTable";
import { Button, Modal } from "react-bootstrap";
import {
  getCargoInfo,
  registerProcessCargo,
  registerProcessVisa,
} from "../../api/other";
import { useSelector } from "react-redux";
import { getCustomersInfo } from "../../api/financeapi";

const ViewTicket = () => {
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userloginfo } = useSelector((store) => store.userReducer);
  const [customercargoinformation, setCustomerCargoInfo] = useState([]);
  const [filtercargo_information, setfilterCargoInfo] = useState([]);
  const [currentCusCargo, setCurrentCusCargo] = useState([]);
  const [selectedFilePic, setSelectedFilePic] = useState(null);
  const [processType, setProcessType] = useState("");
  const [show, setShow] = useState(false);
  const [customer_information, setCustomerInfo] = useState([]);
  const [Isdebt, setIsdebt] = useState(true);
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
    var cargoinfo = await getCargoInfo();
    var customerInfo = await getCustomersInfo();
    setCustomerInfo(customerInfo.Message);
    setCustomerCargoInfo(cargoinfo.Message);
    var cusvisainfo = cargoinfo.Message.filter(
      (cusvisa) => cusvisa.cargo_status === "Ongoing"
    );
    setfilterCargoInfo(cusvisainfo);
  };

  const handleSerach = (event) => {
    event.preventDefault();
    var PATTERN = event.target.value.toLowerCase();
    setfilterCargoInfo(
      filtercargo_information.filter(function (str) {
        return (
          str.sender_name.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.sender_phone.toLowerCase().indexOf(PATTERN) !== -1 ||
          // str.customer_phone.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.cargo_status.toLowerCase().indexOf(PATTERN) !== -1
        );
      })
    );
  };

  const handleClickProcess = (currentcusvisa_id) => {
    setShow(true);
    var currentcusvisa = customercargoinformation.filter(
      (cusvisa) => cusvisa.cargo_id === currentcusvisa_id
    );
    setCurrentCusCargo(currentcusvisa[0]);
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleOnCange = (event) => {
    const { name, value } = event.target;
    if (name === "pic_image") {
      const file = event.target.files[0];
      if (file && isFileTypeAllowed(file.type)) {
        setSelectedFilePic(file);
      } else {
        setSelectedFilePic(null);
        showToastMessage("error", "Please select file type png, jpg, jpeg");
        document.getElementById("pic_image").value = "";
      }
    }
  };

  const isFileTypeAllowed = (fileType) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    return allowedTypes.includes(fileType);
  };

  const handleClickYes = async (event) => {
    event.preventDefault();
    var post = new FormData();
    if (selectedFilePic === null) {
      showToastMessage("error", "Please select file Image to input");
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
    post.append("action", "registerProcessCargo");
    post.append("CargoID", currentCusCargo.cargo_id);
    post.append("CustomerName", currentCusCargo.sender_name);
    post.append("CustomerPhone", currentCusCargo.sender_phone);
    post.append("BankID", currentCusCargo.bank_id);
    post.append("NetAmount", currentCusCargo.net_amount);
    post.append("image", selectedFilePic);
    post.append("SelledBy", userloginfo.userid);
    var visaprocess = await registerProcessCargo(post);
    // console.log(visaprocess);
    // return;
    if (visaprocess.status) {
      showToastMessage("success", visaprocess.Message);
      getAlldata();
      setShow(false);
      setSelectedFilePic(null);
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
          <Modal.Title>Process this Cargo?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="form-group col-md-5">
              <label>Cargo Image</label>
              <input
                type="file"
                accept=".png, .jpg, .jpeg, image/png, image/jpeg, image/jpg"
                className="form-control"
                placeholder="Picure/ Image"
                name="pic_image"
                id="pic_image"
                onChange={handleOnCange}
              />
            </div>
            <div className="form-group col-md-3">
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

            <div className="form-group col-md-4">
              <label>Select Customer</label>
              <select
                className="form-select"
                placeholder="Customer"
                name="customerid"
                id="customerid"
                onChange={handleOnChange}
                disabled={!Isdebt}
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

      {filtercargo_information.length === 0 ? (
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
          customercargoinformation={filtercargo_information}
          handleClickProcess={handleClickProcess}
        />
      )}
    </Box>
  );
};

export default ViewTicket;
