import { Box, useTheme } from "@mui/material";
// import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { balanceReport } from "../../api/financeapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const Form = () => {
  // const isNonMobile = useMediaQuery("(min-width:600px)");
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
  useEffect(() => {
    const getbalance = async () => {
      var post = new FormData();
      post.append("action", "balanceReport");
      var balancereportInfo = await balanceReport(post);
      if (balancereportInfo.status) {
        if (balancereportInfo.Message.length === 0)
          showToastMessage("error", "No data Found.");
        setBalancereportInformation(balancereportInfo.Message);
      } else {
        setBalancereportInformation([]);

        showToastMessage("error", balancereportInfo.Message);
      }
    };

    getbalance();
  }, []);
  const [balancereportinformation, setBalancereportInformation] = useState([]);
  const tableClass =
    theme.palette.mode === "dark"
      ? "table table-striped table-dark"
      : "table table-striped";
  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="BALANCE SHEET REPORT" subtitle="" />

      {balancereportinformation.length === 0 ? (
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
            {balancereportinformation.map((balance, index) => {
              if (balance.account_type === "Asset") {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{balance.account_name}</td>
                    <td>${parseFloat(balance.Price).toLocaleString("en-US")}</td>
                  </tr>
                );
              } else if (balance.account_type === "TotalAsset") {
                return (
                  <tr key={index}>
                    <td></td>
                    <td style={{ paddingLeft: "10%" }}>
                      {balance.account_name}
                    </td>
                   <td>${parseFloat(balance.Price).toLocaleString("en-US")}</td>
                  </tr>
                );
              } else if (
                balance.account_type === "Liability" ||
                balance.account_type === "Capital"
              ) {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{balance.account_name}</td>
                   <td>${parseFloat(balance.Price).toLocaleString("en-US")}</td>
                  </tr>
                );
              } else {
                return (
                  <>
                    <tr key={index}>
                      <td></td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td style={{ paddingLeft: "5%" }}>
                        {balance.account_name}
                      </td>
                     <td>${parseFloat(balance.Price).toLocaleString("en-US")}</td>
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
