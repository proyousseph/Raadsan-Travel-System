import {
  Box,
  useTheme,
  IconButton,
  TextField,
  TableBody,
  TableRow,
} from "@mui/material";
// import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { handleModal } from "../../feature/userSlice";
import Modal from "./CustomerModal";
import PaidIcon from "@mui/icons-material/Paid";

import Pagination from "../../components/Pagination";
import {
  getCustomersInfo,
  registerCustomer,
  registerSupCusCash,
} from "../../api/financeapi";
import { useDispatch, useSelector } from "react-redux";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Modal as ModalCash } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import myImage from "../system_logo.jpg";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

const Customer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { isOpen, bankaccountinformation } = useSelector(
    (store) => store.userReducer
  );
  const dispatch = useDispatch();
  const [isCancel, setisCancel] = useState(false);
  const [customerID, setCustomerID] = useState("null");
  const [customer_information, setCustomerInfo] = useState([]);
  const [filtercustomer_information, setfilterCustomerInfo] = useState([]);
  const [submitButtonValue, setSubmitButtonValue] = useState("Register");
  const [customerInfoModal, setCustomerInfoModal] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const [currentCus, setCurrentCus] = useState([]);
  const columns = [
    { title: "Name", field: "customer_name" },
    { title: "Phone", field: "customer_phone" },
    { title: "Debit", field: "Liability" },
    { title: "Paid", field: "Paid" },
    { title: "Due", field: "Due" },
    { title: "Register Date", field: "regdate" },
  ];

  const downloadPdf = () => {
    var tableData = customer_information;
    for (let i = 0; i < tableData.length; i++) {
      tableData[i].Paid = parseFloat(tableData[i].Paid).toFixed(2);
      tableData[i].Liability = parseFloat(tableData[i].Liability).toFixed(2);
      const paid = tableData[i].Paid;
      const liability = tableData[i].Liability;
      const due = liability - paid;
      tableData[i].Due = parseFloat(due).toFixed(2);
    }
    var doc = new jsPDF();
    // var imgData = myImage;
    var imgData = "";


    // Add the image to the PDF
    doc.addImage(imgData, "JPEG", 80, 0, 50, 50); // Adjust the coordinates and dimensions as needed
    doc.text(process.env.REACT_APP_COMPANY_NAME, 70, 45);
    doc.text("CUSTOMER INFORMATION", 70, 55);
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
    var currentdate = new Date();
    var documentName =
      "Customer " +
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
  useEffect(() => {
    getcustomerInfo();
  }, []);
  const getcustomerInfo = async () => {
    var customerInfo = await getCustomersInfo();
    setCustomerInfo(customerInfo.Message);
    setfilterCustomerInfo(customerInfo.Message);
    setCustomerInfoModal([]);
  };

  //   const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleClick = (currentCustomerId) => {
    setSubmitButtonValue("Update");
    var customer_info = customer_information.filter(
      (customer) => customer.customer_id === currentCustomerId
    );
    document.getElementById("full_name").value = customer_info[0].customer_name;
    document.getElementById("telephone").value =
      customer_info[0].customer_phone;
    setisCancel(true);
    setCustomerID(customer_info[0].customer_id);
  };
  const handleCancel = () => {
    setisCancel(false);
    setCustomerID("");
    setSubmitButtonValue("Register");
    document.getElementById("full_name").value = "";
    document.getElementById("telephone").value = "";
  };
  const handleClickPay = (currentCustomerId) => {
    var customer_info = customer_information.filter(
      (customer) => customer.customer_id === currentCustomerId
    );

    var liab = Math.round(parseFloat(customer_info[0].Liability) * 100) / 100;
    var paid = Math.round(parseFloat(customer_info[0].Paid) * 100) / 100;
    if (liab - paid <= 0) {
      showToastMessage("error", "Qof aan deyn lagu lahayn lacag ma bixin karo");
      return;
    }
    setCustomerInfoModal({
      customer_id: customer_info[0].customer_id,
      customer_due:
        parseFloat(customer_info[0].Liability) -
        parseFloat(customer_info[0].Paid),
    });
    dispatch(handleModal());
  };
  const handleFormSubmit = async (event) => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
    }

    event.preventDefault();
    var customer_name = document.getElementById("full_name").value;
    var customer_phone = document.getElementById("telephone").value;

    var post = new FormData();
    post.append("action", "registerCustomer");
    post.append("CustomerName", customer_name);
    post.append("CustomerPhone", customer_phone);
    if (customerID === "null") {
      post.append("upate", "0");
    } else {
      post.append("CustomerID", customerID);
      post.append("upate", "1");
    }
    var CustomerInfo = await registerCustomer(post);

    if (CustomerInfo.status) {
      showToastMessage("success", CustomerInfo.Message);
      var regCustomerForm = document.getElementById("regCustomerForm");
      regCustomerForm.reset();
      document.getElementById("full_name").value = "";
      document.getElementById("telephone").value = "";
      getcustomerInfo();
      setisCancel(false);
      setCustomerID("null");
      setSubmitButtonValue("Register");
    } else {
      showToastMessage("error", CustomerInfo.Message);
    }
    setIsButtonDisabled(false);
  };

  const handleSerach = (event) => {
    event.preventDefault();
    var PATTERN = event.target.value.toLowerCase();
    setfilterCustomerInfo(
      customer_information.filter(function (str) {
        return (
          str.customer_name.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_phone.toLowerCase().indexOf(PATTERN) !== -1
        );
      })
    );
  };
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

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(25);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filtercustomer_information.slice(
    firstPostIndex,
    lastPostIndex
  );
  // end pagination

  const handleClose = () => {
    setShow(false);
  };
  const handleClickCash = (currentCustomerId) => {
    var customer_info = customer_information.filter(
      (customer) => customer.customer_id === currentCustomerId
    );
    setCurrentCus(customer_info[0]);
    setShow(true);
  };

  const handleOnChangeCash = (event) => {
    event.preventDefault();
    var quantity = event.target.value;
    if (quantity == "") {
      showToastMessage("error", "Fadlan soo gali tiro");
      document.getElementById("quantity").value = "";
      return;
    }
    if (!quantity % 1 !== 0) {
      showToastMessage("error", "Fadlan soo gali Number");
      document.getElementById("quantity").value = "";
      return;
    }
  };

  const handleClickYes = async (event) => {
    event.preventDefault();
    var amount = document.getElementById("quantity").value;
    var account_type = document.getElementById("account_type").value;
    // console.log(quantity);
    if (amount == "") {
      showToastMessage("error", "Fadlan soo gali Number");
      return;
    }
    if (account_type == "") {
      showToastMessage("error", "Fadlan dooro Account");
      return;
    }
    var post = new FormData();
    post.append("action", "registerSupCusCash");
    post.append("CustomerID", currentCus.customer_id);
    post.append("SupplierID", "-");
    post.append("BankID", account_type);
    post.append("Amount", amount);
    post.append("Type", "Cu");
    var productinfo = await registerSupCusCash(post);
    // console.log(productinfo);
    // return;
    if (productinfo.status) {
      showToastMessage("success", productinfo.Message);
      getcustomerInfo();
    } else {
      showToastMessage("error", productinfo.Message);
    }
    setShow(false);
  };

  const tableClass =
    theme.palette.mode === "dark"
      ? "table table-striped table-dark"
      : "table table-striped";
  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";
  // if (productinformation.length === 0)
  //   return (
  //     <h1 style={{ color: { emptyColor }, textAlign: "center" }}>
  //       No data Found
  //     </h1>
  //   );
  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title="CUSTOMER INFORMATION"
        subtitle="View Customer Information"
      />
      <Modal
        showToastMessage={showToastMessage}
        getcustomerInfo={getcustomerInfo}
        customerInfoModal={customerInfoModal}
      />
      <ModalCash show={show} onHide={handleClose} style={{ color: "black" }}>
        <ModalCash.Header closeButton>
          <ModalCash.Title>Give Cash the Customer?</ModalCash.Title>
        </ModalCash.Header>
        <ModalCash.Body>
          <div className="row">
            <div className="form-group col-6">
              <input
                type="number"
                min="0.5"
                className="form-control"
                placeholder="Enter Money"
                id="quantity"
                onChange={handleOnChangeCash}
              />
            </div>
            <div className="form-group col-6">
              <select
                className="form-select"
                name="account_type"
                id="account_type"
                required
              >
                <option value="">Select Account</option>
                {bankaccountinformation.map((account, index) => (
                  <option key={index} value={account.bank_id}>
                    {account.bank_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </ModalCash.Body>
        <ModalCash.Footer>
          <Button variant="primary" onClick={handleClickYes}>
            Yes
          </Button>
          <Button variant="danger" onClick={handleClose}>
            No
          </Button>
        </ModalCash.Footer>
      </ModalCash>

      {/* SEARCH BAR & REGISTER FORM */}
      <Box display="flex" justifyContent="end" style={{ marginBottom: "3%" }}>
        <form
          id="regCustomerForm"
          onSubmit={handleFormSubmit}
          style={{ width: "80%", marginRight: "10%", display: "flex" }}
        >
          <Box
            display="flex"
            borderRadius="3px"
            style={{ width: "100%", marginRight: "10%" }}
          >
            <Box
              display="flex"
              borderRadius="3px"
              style={{ width: "40%", marginRight: "5%" }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                InputProps={{ inputProps: { step: "0.01" } }}
                label="Customer Name"
                id="full_name"
                required
              />
            </Box>
            <Box
              display="flex"
              borderRadius="3px"
              style={{ width: "40%", marginRight: "5%" }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={isOpen === false ? "Customer Phone" : ""}
                id="telephone"
                // sx={{ gridColumn: "span 2" }}
                required
              />
            </Box>
            <div style={{ display: "flex", gap: "10%" }}>
              <input
                type="submit"
                value={submitButtonValue}
                id="btnRegister"
                style={{ color: "white", height: "85%" }}
                className="btn btn-md bg-primary"
                disabled={isButtonDisabled}
              />
              {isCancel && (
                <input
                  onClick={handleCancel}
                  type="button"
                  value="Cancel"
                  id="btnCancel"
                  style={{ color: "white", height: "85%" }}
                  className="btn btn-md bg-danger"
                />
              )}
            </div>
          </Box>
        </form>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          style={{ width: "25%", marginRight: "0%", height: "45px" }}
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

        {/* <Box>
          <Button
            sx={{
              backgroundColor: "#141B2D",
              color: "white",
              // fontSize: "14px",
              // fontWeight: "bold",
              // padding: "10px 20px",
            }}
            onClick={downloadPdf}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download
          </Button>
        </Box> */}
      </Box>

      {filtercustomer_information.length > 0 ? (
        <>
          <Table className={tableClass}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Debit</th>
                <th scope="col">Paid</th>
                <th scope="col">Due</th>
                <th scope="col">Register Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <TableBody>
              {currentPosts.map((customer, index) => (
                <TableRow key={index}>
                  {/* <td>{index + 1}</td> */}
                  <td>{customer.customer_name}</td>
                  <td>{customer.customer_phone}</td>
                  <td>
                    ${parseFloat(customer.Liability).toLocaleString("en-US")}
                  </td>
                  <td>${parseFloat(customer.Paid).toLocaleString("en-US")}</td>
                  <td>
                    $
                    {parseFloat(
                      parseFloat(customer.Liability) - parseFloat(customer.Paid)
                    ).toLocaleString("en-US")}
                  </td>
                  <td>{customer.regdate.split(" ")[0]}</td>
                  <td>
                    <div style={{ display: "flex", gap: "5%" }}>
                      <Button
                        className="btn btn-sm"
                        onClick={() => handleClick(customer.customer_id)}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        className="btn btn-sm bg-success"
                        onClick={() => handleClickPay(customer.customer_id)}
                      >
                        <PaidIcon />
                      </Button>
                      <Button
                        className="btn btn-sm bg-warning"
                        onClick={() => handleClickCash(customer.customer_id)}
                      >
                        <PaymentsIcon />
                      </Button>
                    </div>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            totalPosts={filtercustomer_information.length}
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </>
      ) : (
        <h1 style={{ color: { emptyColor }, textAlign: "center" }}>
          No Customer Found
        </h1>
      )}
    </Box>
  );
};

export default Customer;
