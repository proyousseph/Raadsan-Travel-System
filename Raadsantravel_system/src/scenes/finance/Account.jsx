import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { getBankAccount, registerBankAccount, transferMoney } from "../../api/financeapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { AiFillCloseCircle } from "react-icons/ai";
import B from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { setBankAccountInfo } from "../../feature/userSlice";
import { Modal } from "react-bootstrap";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

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
  const { bankaccountinformation } = useSelector((store) => store.userReducer);
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const [show, setShow] = useState(false);
  const [accountinfo, setAccountInfo] = useState({
    AccountType: "",
    Money: "",
    RegisterDate: "",
  });
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().slice(0, 16);
  useEffect(() => {
    getbankaccounts();
  }, []);

  const getbankaccounts = async () => {
    var bankaccountinfo = await getBankAccount();
    dispatch(setBankAccountInfo(bankaccountinfo.Message));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmit(true);
    var post = new FormData();
    post.append("action", "registerBankAccount");
    post.append("AccountName", accountinfo.account_name);
    post.append("AccountNumber", accountinfo.account_number);
    post.append("RegisterDate", accountinfo.RegisterDate);
    var AccountInfo = await registerBankAccount(post);

    if (AccountInfo.status) {
      showToastMessage("success", AccountInfo.Message);
      var regAccountForm = document.getElementById("regAccountForm");
      regAccountForm.reset();
      setAccountInfo({
        account_name: "",
        account_number: "",
        RegisterDate: "",
      });
      getbankaccounts();
      setIsSubmit(false);
    } else {
      showToastMessage("error", AccountInfo.Message);
    }
  };
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setAccountInfo({ ...accountinfo, [name]: value });
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleClickYes = async (event) => {
    event.preventDefault();
    var from_account = document.getElementById("from_account").value;
    var to_account = document.getElementById("to_account").value;
    var amount = document.getElementById("amount").value;
    if (from_account === "" || to_account === "") {
      showToastMessage("error", "Fadlan dooro Account");
      return;
    }
     if (from_account === to_account) {
      showToastMessage("error", "Fadlan dooro labo Account kala duwan");
      return;
    }
    if (amount === "") {
      showToastMessage("error", "Fadlan soo gali Lacag");
      return;
    }
    if (parseFloat(amount) <= 0) {
      showToastMessage("error", "Fadlan soo gali Lacag kabadan 0");
      return;
    }
    var post = new FormData();
    post.append("action", "transferMoney");
    post.append("From", from_account);
    post.append("To", to_account);
    post.append("Amount", amount);
    var productinfo = await transferMoney(post);
    // console.log(productinfo);
    // return;
    if (productinfo.status) {
      showToastMessage("success", productinfo.Message);
      getbankaccounts();
      setShow(false);
    } else {
      showToastMessage("error", productinfo.Message);
    }
  };
  const tableClass =
    theme.palette.mode === "dark"
      ? "table table-striped table-dark"
      : "table table-striped";
  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="REGISTER ACCOUNT" subtitle="Register a New Account" />

      <Modal show={show} onHide={handleClose} style={{ color: "black" }}>
        <Modal.Header closeButton>
          <Modal.Title>Transfer Money?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="form-group col-md-4">
              <label>From Account</label>
              <select
                className="form-select"
                name="from_account"
                id="from_account"
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
            <div className="form-group col-md-4">
              <label>To Account</label>
              <select
                className="form-select"
                name="to_account"
                id="to_account"
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

            <div className="form-group col-md-4">
              <label>Amount</label>
              <input
                type="number"
                min="0.01"
                className="form-control"
                placeholder="Amount"
                name="amount"
                id="amount"
                // onChange={handleOnChange}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <B variant="primary" onClick={handleClickYes}>
            Yes
          </B>
          <B variant="danger" onClick={handleClose}>
            No
          </B>
        </Modal.Footer>
      </Modal>

      <Box
        style={{
          justifyContent: "flex-end",
          display: "flex",
          marginBottom: "1%",
        }}
      >
        <B onClick={() => setShow(true)}>
          <CurrencyExchangeIcon sx={{ mr: "10px" }} />
          Transfer
        </B>
      </Box>
      <form id="regAccountForm" onSubmit={handleFormSubmit}>
        <Box
          display="grid"
          gap="40px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Account Name"
            onChange={handleOnChange}
            name="account_name"
            id="account_name"
            sx={{ gridColumn: "span 1" }}
            required
          />

          <TextField
            fullWidth
            variant="filled"
            type="number"
            InputProps={{ inputProps: { step: "1" } }}
            label="Account Number"
            onChange={handleOnChange}
            // value={values.Money}
            name="account_number"
            id="account_number"
            sx={{ gridColumn: "span 1" }}
            required
          />

          <TextField
            fullWidth
            variant="filled"
            type="datetime-local"
            label="Register Date"
            onChange={handleOnChange}
            // InputLabelProps={{
            //   shrink: true,
            // }}
            inputProps={{
              max: tomorrowFormatted,
            }}
            // value={values.RegisterDate}
            name="RegisterDate"
            sx={{ gridColumn: "span 1" }}
            required
          />

          {isSubmit === true ? (
            <Button type="button" color="info" variant="contained">
              Loading ..........
            </Button>
          ) : (
            <Button type="submit" color="secondary" variant="contained">
              Register New Account
            </Button>
          )}
        </Box>
      </form>

      {bankaccountinformation.length === 0 ? (
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
              <th scope="col">Account Name</th>
              <th scope="col">Account Number</th>
              <th scope="col">Balance</th>
              <th scope="col">Register Date</th>
              {/* <th scope="col">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {bankaccountinformation.map((account, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{account.bank_name}</td>
                <td>{account.bank_number}</td>
                <td>${parseFloat(account.Balance).toLocaleString("en-US")}</td>
                <td>{account.bank_reg_date}</td>

                {/* <td>
                  <B
                    type="button"
                    className="btn btn-danger btn-sm"
                    variant="contained"
                    // onClick={() => handleClickDelete(index)}
                  >
                    <AiFillCloseCircle style={{ color: "white" }} />
                  </B>{" "}
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Box>
  );
};

export default Form;
