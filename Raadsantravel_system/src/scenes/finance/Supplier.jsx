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
import Modal from "./SupplierModal";
import PaidIcon from "@mui/icons-material/Paid";

import Pagination from "../../components/Pagination";
import { registerSupplier, getSupplierInfo } from "../../api/financeapi";
import { useDispatch, useSelector } from "react-redux";

const Supplier = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { isOpen } = useSelector((store) => store.userReducer);
  const dispatch = useDispatch();
  const [isCancel, setisCancel] = useState(false);
  const [supplierID, stSupplierID] = useState("null");
  const [supplier_information, setSupplierInfo] = useState([]);
  const [filtersupplier_information, setfilterCustomerInfo] = useState([]);
  const [submitButtonValue, setSubmitButtonValue] = useState("Register");
  const [supplierInfoModal, setCustomerInfoModal] = useState([]);

  useEffect(() => {
    getsupplierInfo();
  }, []);
  const getsupplierInfo = async () => {
    var SupplierInfo = await getSupplierInfo();
    setSupplierInfo(SupplierInfo.Message);
    setfilterCustomerInfo(SupplierInfo.Message);
    setCustomerInfoModal([]);
  };

  //   const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleClick = (currentCustomerIndex) => {
    setSubmitButtonValue("Update");
    document.getElementById("full_name").value =
      supplier_information[currentCustomerIndex].supplier_name;
    document.getElementById("telephone").value =
      supplier_information[currentCustomerIndex].supplier_phone;
    setisCancel(true);
    stSupplierID(supplier_information[currentCustomerIndex].supplier_id);
  };
  const handleCancel = () => {
    setisCancel(false);
    stSupplierID("");
    setSubmitButtonValue("Register");
    document.getElementById("full_name").value = "";
    document.getElementById("telephone").value = "";
  };
  const handleClickPay = (currentCustomerIndex) => {
    if (
      parseFloat(supplier_information[currentCustomerIndex].Liability) -
        parseFloat(supplier_information[currentCustomerIndex].Paid) <=
      0
    ) {
      showToastMessage("error", "Person with no liability can not able to pay");
      return;
    }
    setCustomerInfoModal({
      supplier_id: supplier_information[currentCustomerIndex].supplier_id,
      supplier_due:
        parseFloat(supplier_information[currentCustomerIndex].Liability) -
        parseFloat(supplier_information[currentCustomerIndex].Paid),
    });
    dispatch(handleModal());
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    var supplier_name = document.getElementById("full_name").value;
    var supplier_phone = document.getElementById("telephone").value;

    var post = new FormData();
    post.append("action", "registerSupplier");
    post.append("SupplierName", supplier_name);
    post.append("SupplierPhone", supplier_phone);
    if (supplierID === "null") {
      post.append("upate", "0");
    } else {
      post.append("supplierID", supplierID);
      post.append("upate", "1");
    }
    var SupplierInfo = await registerSupplier(post);

    if (SupplierInfo.status) {
      showToastMessage("success", SupplierInfo.Message);
      var regCustomerForm = document.getElementById("regCustomerForm");
      regCustomerForm.reset();
      document.getElementById("full_name").value = "";
      document.getElementById("telephone").value = "";
      getsupplierInfo();
      setisCancel(false);
      stSupplierID("");
      setSubmitButtonValue("Register");
    } else {
      showToastMessage("error", SupplierInfo.Message);
    }
  };

  const handleSerach = (event) => {
    event.preventDefault();
    var PATTERN = event.target.value.toLowerCase();
    setfilterCustomerInfo(
      supplier_information.filter(function (str) {
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
  const [postsPerPage, setPostsPerPage] = useState(10);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filtersupplier_information.slice(
    firstPostIndex,
    lastPostIndex
  );
  // end pagination
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
        title="SUPPLIER INFORMATION"
        subtitle="View Supplier Information"
      />
      <Modal
        showToastMessage={showToastMessage}
        getsupplierInfo={getsupplierInfo}
        supplierInfoModal={supplierInfoModal}
      />

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
                label="Supplier Name"
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
                label={isOpen === false ? "Supplier Phone" : ""}
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
                style={{ color: "white" }}
                className="btn btn-md bg-primary"
              />
              {isCancel && (
                <input
                  onClick={handleCancel}
                  type="button"
                  value="Cancel"
                  id="btnCancel"
                  style={{ color: "white" }}
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
          style={{ width: "30%" }}
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

      {filtersupplier_information.length > 0 ? (
        <>
          <Table className={tableClass}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Credit</th>
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
                  <td>{customer.supplier_name}</td>
                  <td>{customer.supplier_phone}</td>
                  <td>${parseFloat(customer.Liability).toLocaleString("en-US")}</td>
                  <td>${parseFloat(customer.Paid).toLocaleString("en-US")}</td>
                  <td>
                    ${parseFloat(parseFloat(customer.Liability) - parseFloat(customer.Paid)).toLocaleString("en-US")}
                  </td>
                  <td>{customer.regdate.split(" ")[0]}</td>
                  <td>
                    <div style={{ display: "flex", gap: "5%" }}>
                      <Button
                        className="btn btn-sm"
                        onClick={() => handleClick(index)}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        className="btn btn-sm bg-success"
                        onClick={() => handleClickPay(index)}
                      >
                        <PaidIcon />
                      </Button>
                    </div>
                  </td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            totalPosts={filtersupplier_information.length}
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </>
      ) : (
        <h1 style={{ color: { emptyColor }, textAlign: "center" }}>
          No Supplier Found
        </h1>
      )}
    </Box>
  );
};

export default Supplier;
