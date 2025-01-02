import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { incomeReport } from "../../api/financeapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Table } from "react-bootstrap";

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
  const [incomereportinformation, setIncomereportInformation] = useState([]);
  const [incominfo, setIncomeInfo] = useState({
    fromDate: "",
    toDate: "",
  });
  const handleFormSubmit = async (event) => {
    document.getElementById("btnSubmit").innerText = "Loading...";

    setIncomereportInformation([]);
    event.preventDefault();
    var post = new FormData();
    post.append("action", "incomeReport");
    post.append("FromDate", incominfo.fromDate);
    post.append("ToDate", incominfo.toDate);
    var incomreportInfo = await incomeReport(post);
    if (incomreportInfo.status) {
      if (incomreportInfo.Message.length === 0)
        showToastMessage("error", "No data Found.");
      setIncomereportInformation(incomreportInfo.Message);
      var regExpenseForm = document.getElementById("regExpenseForm");
      regExpenseForm.reset();
      setIncomeInfo({
        fromDate: "",
        toDate: "",
      });
    } else {
      setIncomereportInformation([]);

      showToastMessage("error", incomreportInfo.Message);
    }
    document.getElementById("btnSubmit").innerText = "Search";
  };
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setIncomeInfo({ ...incominfo, [name]: value });
  };

  const tableClass =
    theme.palette.mode === "dark"
      ? "table table-striped table-dark"
      : "table table-striped";
  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="INCOME STATEMETN REPORT" subtitle="" />

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
            <div className="col-5 ">
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
            <div className="col-5 ">
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

      {incomereportinformation.length === 0 ? (
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
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {incomereportinformation.map((income, index) => {
              if (income.account_type === "Revenue") {
                return (
                  <>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{income.account_name}</td>
                      <td>${parseFloat(income.Price).toLocaleString("en-US")}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>--</td>
                      <td></td>
                    </tr>
                  </>
                );
              } else if (income.account_type === "Expense") {
                return (
                  <>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{income.account_name}</td>
                     <td>${parseFloat(income.Price).toLocaleString("en-US")}</td>
                    </tr>
                  </>
                );
              } else if (income.account_type === "Sum") {
                return (
                  <tr>
                    <td></td>
                    <td style={{ paddingLeft: "10%" }}>Sum of Expense</td>
                    <td>${parseFloat(income.Price).toLocaleString("en-US")}</td>
                  </tr>
                );
              } else {
                return (
                  <>
                    <tr>
                      <td></td>
                      <td>--</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td style={{ paddingLeft: "5%" }}>
                        {income.account_name}
                      </td>
                      <td>${parseFloat(income.Price).toLocaleString("en-US")}</td>
                    </tr>
                  </>
                );
              }
            })}
          </tbody>
        </Table>
      )}
    </Box>
  );
};

export default Form;
