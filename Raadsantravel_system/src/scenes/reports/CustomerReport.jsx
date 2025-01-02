import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { cancelSellorBuy, customerReport, getCustomersInfo } from "../../api/financeapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Table, Modal } from "react-bootstrap";
import { AiFillCloseCircle } from "react-icons/ai";
import B from "react-bootstrap/Button";

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
    customer_id: "",
    fromDate: "",
    toDate: "",
  });
  const [customer_information, setCustomerInfo] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteDate, setDeleteDate] = useState("");
  useEffect(() => {
    getcustomerinfo();
  }, []);
  const getcustomerinfo = async () => {
    var customerInfo = await getCustomersInfo();
    setCustomerInfo(customerInfo.Message);
  };
  const handleFormSubmit = async (event) => {
    document.getElementById("btnSubmit").innerText = "Loading...";

    setSalesreportInformation([]);
    event.preventDefault();
    var post = new FormData();
    post.append("action", "customerReport");
    post.append("CustomerID", salesinfo.customer_id);
    post.append("FromDate", salesinfo.fromDate);
    post.append("ToDate", salesinfo.toDate);
    var salesreportInfo = await customerReport(post);

    if (salesreportInfo.status) {
      if (salesreportInfo.Message.length === 0)
        showToastMessage("error", "No data Found.");

      setSalesreportInformation(salesreportInfo.Message);
      var regExpenseForm = document.getElementById("regExpenseForm");
      regExpenseForm.reset();
      setSalesInfo({
        customer_id: "",
        fromDate: "",
        toDate: "",
      });
    } else {
      setSalesreportInformation([]);

      showToastMessage("error", salesreportInfo.Message);
    }
    document.getElementById("btnSubmit").innerText = "Search";
  };

  const handleClickDelete = async (saleDate) => {
   setDeleteDate(saleDate);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleClickDeleteButton = async () => {
    var post = new FormData();
    post.append("action", "cancelSellorBuy");
    post.append("RegisterDate", deleteDate);
    post.append("type", "sell");
    var ExpenseInfo = await cancelSellorBuy(post);

    if (ExpenseInfo.status) {
      showToastMessage("success", ExpenseInfo.Message);
    } else {
      showToastMessage("error", ExpenseInfo.Message);
    }
    setSalesreportInformation([]);
    setDeleteDate("");
    setShow(false);
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
  var totalquantity = 0;
  var totalunitprice = 0;
  var total = 0;

  return (
    <>
      <Modal show={show} onHide={handleClose} style={{ color: "black" }}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel this Sell?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this Sell?</Modal.Body>
        <Modal.Footer>
          <B variant="primary" onClick={handleClickDeleteButton}>
            Yes
          </B>
          <B variant="danger" onClick={handleClose}>
            No
          </B>
        </Modal.Footer>
      </Modal>
      <Box m="20px">
        <ToastContainer />
        <Header title="CUSTOMER REPORT" subtitle="" />

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
              <div className="col-4 ">
                <select
                  onChange={handleOnChange}
                  fullWidth
                  variant="filled"
                  component="select"
                  name="customer_id"
                  id="customer_id"
                  style={{
                    backgroundColor: selectBgColor,
                    color: selectFgColor,
                    height: "100%",
                    width: "100%",
                  }}
                  required
                >
                  <option value="">Select Customer</option>
                  {customer_information.map((customer, index) => (
                    <option key={index} value={customer.customer_id}>
                      {customer.customer_name + " | " + customer.customer_phone}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-3 ">
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
              <div className="col-3 ">
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
                <th scope="col">Code</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Quantity</th>
                <th scope="col">Unit Price</th>
                <th scope="col">Total</th>
                <th scope="col">Selled By</th>
                <th scope="col">Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {salesreportinformation.map((sale, index) => {
                totalquantity += parseFloat(sale.product_quantity);
                totalunitprice += parseFloat(
                  parseFloat(sale.Credit) / parseFloat(sale.product_quantity)
                );
                total += parseFloat(sale.Credit);
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{sale.product_id}</td>
                    <td>{sale.product_name}</td>
                    <td>{sale.category_name}</td>
                    <td>{sale.product_quantity}</td>
                    <td>
                      $
                      {parseFloat(
                        parseFloat(sale.Credit) /
                          parseFloat(sale.product_quantity)
                      ).toLocaleString("en-US")}
                    </td>
                    <td>${parseFloat(sale.Credit).toLocaleString("en-US")}</td>
                    <td>{sale.fname}</td>
                    <td>{sale.date}</td>
                    <td>
                      <B
                        type="button"
                        className="btn btn-danger btn-sm"
                        variant="contained"
                        onClick={() => handleClickDelete(sale.date)}
                      >
                        <AiFillCloseCircle style={{ color: "white" }} />
                      </B>{" "}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>{totalquantity}</td>
                <td>${totalunitprice.toLocaleString("en-US")}</td>
                <td>${total.toLocaleString("en-US")}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </Table>
        )}
      </Box>
    </>
  );
};

export default Form;
