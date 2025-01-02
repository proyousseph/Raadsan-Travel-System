import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {
  cancelSellorBuy,
  getSupplierInfo,
  supplierReport,
} from "../../api/financeapi";
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
  const [supplier_information, setSupplierInfo] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteDate, setDeleteDate] = useState("");
  useEffect(() => {
    getcustomerinfo();
  }, []);
  const getcustomerinfo = async () => {
    var supplierinfo = await getSupplierInfo();
    setSupplierInfo(supplierinfo.Message);
  };
  const handleFormSubmit = async (event) => {
    document.getElementById("btnSubmit").innerText = "Loading...";

    setSalesreportInformation([]);
    event.preventDefault();
    var post = new FormData();
    post.append("action", "supplierReport");
    post.append("SupplierID", salesinfo.customer_id);
    post.append("FromDate", salesinfo.fromDate);
    post.append("ToDate", salesinfo.toDate);
    var salesreportInfo = await supplierReport(post);

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

  const handleClickDelete = async (index) => {
    if (
      salesreportinformation[index].current_quantity ===
      salesreportinformation[index].product_quantity
    ) {
      setDeleteDate(salesreportinformation[index].product_reg_date);
      setShow(true);
    } else {
      showToastMessage(
        "error",
        "This product cannot be canceled because some of it has been sold"
      );
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleClickDeleteButton = async () => {
    var post = new FormData();
    post.append("action", "cancelSellorBuy");
    post.append("RegisterDate", deleteDate);
    post.append("type", "buy");
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
  var totalcurrentquantity = 0;
  var totalbuyingprice = 0;
  var totalsellingprice = 0;
  var total = 0;

  return (
    <>
      <Modal show={show} onHide={handleClose} style={{ color: "black" }}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel this Buying?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this Buy?</Modal.Body>
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
        <Header title="SUPPLIER REPORT" subtitle="" />

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
                  <option value="">Select Supplier</option>
                  {supplier_information.map((supplier, index) => (
                    <option key={index} value={supplier.supplier_id}>
                      {supplier.supplier_name + " | " + supplier.supplier_phone}
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
                <th scope="col">Code</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Quantity</th>
                <th scope="col">Current</th>
                <th scope="col">Buying Price</th>
                <th scope="col">Selling Price</th>
                <th scope="col">Total Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {salesreportinformation.map((product, index) => {
                totalquantity += parseFloat(product.product_quantity);
                totalcurrentquantity += parseFloat(product.current_quantity);
                totalbuyingprice += parseFloat(product.product_buying_price);

                totalsellingprice += parseFloat(product.product_selling_price);
                total +=
                  parseFloat(product.product_buying_price) *
                  parseFloat(product.product_quantity);
                return (
                  <tr key={index}>
                    <td>{product.product_id}</td>
                    <td>{product.product_name}</td>
                    <td>{product.category_name}</td>
                    <td>{product.product_quantity}</td>
                    <td>{product.current_quantity}</td>
                    <td>${product.product_buying_price}</td>
                    <td>${product.product_selling_price}</td>
                    <td>
                      $
                      {(parseFloat(product.product_buying_price) *
                        parseFloat(product.product_quantity)).toLocaleString("en-US")}
                    </td>
                    <td>
                      <B
                        type="button"
                        className="btn btn-danger btn-sm"
                        variant="contained"
                        onClick={() => handleClickDelete(index)}
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
                <td>{totalquantity}</td>
                <td>{totalcurrentquantity}</td>
                <td>${totalbuyingprice.toLocaleString("en-US")}</td>
                <td>${totalsellingprice.toLocaleString("en-US")}</td>
                <td>${total.toLocaleString("en-US")}</td>
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
