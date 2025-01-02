import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import {
  cancelExpense,
  getBankAccount,
  getExpenseAccounts,
  getExpenses,
  registerExpense,
} from "../../api/financeapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Table, Modal } from "react-bootstrap";
import { AiFillCloseCircle } from "react-icons/ai";
import B from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { setBankAccountInfo } from "../../feature/userSlice";

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
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [expenseAccounts, setExpenseAccount] = useState([]);
  const [expenseinformation, setExpenseInformation] = useState([]);
  const [expenseinfo, setExpenseInfo] = useState({
    ExpenseType: "",
    Description: "",
    AccountType: "",
    Money: "",
    RegisterDate: "",
  });
  useEffect(() => {
    getexpenses();
  }, []);

  const getexpenses = async () => {
    var accountinfo = await getExpenseAccounts();
    var expinfo = await getExpenses();
    var bankaccountinfo = await getBankAccount();
    dispatch(setBankAccountInfo(bankaccountinfo.Message));
    setExpenseAccount(accountinfo.Message);
    setExpenseInformation(expinfo.Message);
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleClickDelete = (id) => {
    setDeleteId(id);
    setShow(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (expenseinfo.Money <= 0) {
      showToastMessage("error", "Money must be greater than 0");
      return;
    }
    const datetime = new Date(expenseinfo.RegisterDate);
    const randomNumber = Math.floor(Math.random() * 30) + 1;
    datetime.setSeconds(datetime.getSeconds() + randomNumber);
    const year = datetime.getFullYear();
    const month = String(datetime.getMonth() + 1).padStart(2, "0");
    const day = String(datetime.getDate()).padStart(2, "0");
    const hours = String(datetime.getHours()).padStart(2, "0");
    const minutes = String(datetime.getMinutes()).padStart(2, "0");
    const seconds = String(datetime.getSeconds()).padStart(2, "0");
const formattedDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    var post = new FormData();
    post.append("action", "registerExpense");
    post.append("ExpenseType", expenseinfo.ExpenseType);
    post.append("Money", expenseinfo.Money);
    post.append("AccountType", expenseinfo.AccountType);
    post.append("Description", expenseinfo.Description);
    post.append("RegisterDate", formattedDatetime);
    var ExpenseInfo = await registerExpense(post);

    if (ExpenseInfo.status) {
      showToastMessage("success", ExpenseInfo.Message);
      var regExpenseForm = document.getElementById("regExpenseForm");
      regExpenseForm.reset();
      setExpenseInfo({
        ExpenseType: "",
        Description: "",
        AccountType: "",
        Money: "",
        RegisterDate: "",
      });
      getexpenses();
    } else {
      showToastMessage("error", ExpenseInfo.Message);
    }
  };
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setExpenseInfo({ ...expenseinfo, [name]: value });

    if (name === "Money") {
      var val = parseFloat(value);
      if (!(typeof val === "number" && !isNaN(val))) {
        showToastMessage("error", "Money Must be a number");
        setExpenseInfo({ ...expenseinfo, [name]: "" });
        document.getElementById("Money").value = "";
      } else {
        if (typeof val === "number" && val < 0) {
          showToastMessage("error", "Money Must greater than 0");
          setExpenseInfo({ ...expenseinfo, [name]: "" });
          document.getElementById("Money").value = "";
        }
      }
    }
  };
  const handleClickEditCat = async () => {
    var post = new FormData();
    post.append("action", "cancelExpense");
    post.append("RegisterDate", expenseinformation[deleteId].transaction_date);
    var ExpenseInfo = await cancelExpense(post);

    if (ExpenseInfo.status) {
      showToastMessage("success", ExpenseInfo.Message);
    } else {
      showToastMessage("error", ExpenseInfo.Message);
    }
    getexpenses();
    setDeleteId("");
    setShow(false);
  };

  const selectBgColor = theme.palette.mode === "light" ? "#E8F0FE" : "#323848";
  const selectFgColor = theme.palette.mode === "light" ? "black" : "white";
  const tableClass =
    theme.palette.mode === "dark"
      ? "table table-striped table-dark"
      : "table table-striped";
  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <>
      <Modal show={show} onHide={handleClose} style={{ color: "black" }}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel this Expense?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this Expense?</Modal.Body>
        <Modal.Footer>
          <B variant="primary" onClick={handleClickEditCat}>
            Yes
          </B>
          <B variant="danger" onClick={handleClose}>
            No
          </B>
        </Modal.Footer>
      </Modal>
      <Box m="20px">
        <ToastContainer />
        <Header title="REGISTER EXPENSE" subtitle="Register a New Expense" />

        <form id="regExpenseForm" onSubmit={handleFormSubmit}>
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(6, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <select
              fullWidth
              variant="filled"
              component="select"
              name="ExpenseType"
              onChange={handleOnChange}
              style={{
                gridColumn: "span 1",
                backgroundColor: selectBgColor,
                color: selectFgColor,
                // height: "150%",
              }}
              required
            >
              <option value="">Select Expense</option>

              {expenseAccounts.map((account, index) => (
                <option key={index} value={account.account_id}>
                  {account.account_name}
                </option>
              ))}
            </select>
            <select
              fullWidth
              variant="filled"
              component="select"
              name="AccountType"
              onChange={handleOnChange}
              style={{
                gridColumn: "span 1",
                backgroundColor: selectBgColor,
                color: selectFgColor,
                // height: "150%",
              }}
              required
            >
              <option value="">Select Account</option>
              {bankaccountinformation.map((account, index) => (
                <option key={index} value={account.bank_id}>
                  {account.bank_name}
                </option>
              ))}
            </select>
            <TextField
              fullWidth
              variant="filled"
              type="number"
              InputProps={{ inputProps: { step: "0.01" } }}
              label="Money"
              onChange={handleOnChange}
              // value={values.Money}
              name="Money"
              id="Money"
              sx={{ gridColumn: "span 1" }}
              required
            />
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Description"
              onChange={handleOnChange}
              // value={values.Money}
              name="Description"
              id="Description"
              sx={{ gridColumn: "span 1" }}
              required
            />

            <TextField
              fullWidth
              variant="filled"
              type="datetime-local"
              label="Register Date"
              onChange={handleOnChange}
              // value={values.RegisterDate}
              name="RegisterDate"
              sx={{ gridColumn: "span 1" }}
              required
            />

            <Button type="submit" color="secondary" variant="contained">
              Register New Expense
            </Button>
          </Box>
        </form>

        {expenseinformation.length === 0 ? (
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
                <th scope="col">Name</th>
                <th scope="col">Money</th>
                <th scope="col">Description</th>
                <th scope="col">Register Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenseinformation.map((expense, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{expense.account_name}</td>
                  <td>${parseFloat(expense.Debit).toLocaleString("en-US")}</td>
                  <td>{expense.description}</td>
                  <td>{expense.transaction_date}</td>

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
              ))}
            </tbody>
          </Table>
        )}
      </Box>
    </>
  );
};

export default Form;
