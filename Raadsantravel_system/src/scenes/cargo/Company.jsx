import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "./ViewCompanyTable";
import { getCompanyInfo, registerCompany } from "../../api/other";

const Company = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();

  const [companyinformation, setCompanyInfo] = useState([]);
  const [upVisaID, setupVisaID] = useState("");
  useEffect(() => {
    getvisainfo();
  }, []);
  const getvisainfo = async () => {
    var visaInfo = await getCompanyInfo();
    setCompanyInfo(visaInfo.Message);
  };

  // const tableClass =
  //   theme.palette.mode === "dark"
  //     ? "table table-striped table-dark"
  //     : "table table-striped";
  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    var cname = document.getElementById("cname").value;
    var cphone = document.getElementById("cphone").value;
    var caddress = document.getElementById("caddress").value;
    if (cname == "" || cphone == "" || caddress == "") {
      showToastMessage("error", "Please fill missing inputs");
      return;
    }
    var post = new FormData();
    post.append("action", "registerCompany");
    post.append("Cname", cname);
    post.append("Cphone", cphone);
    post.append("Caddress", caddress);
    if (upVisaID === "") {
      post.append("update", "0");
    } else {
      post.append("CID", upVisaID);
      post.append("update", "1");
    }
    var VisaInfo = await registerCompany(post);
    // console.log(VisaInfo);
    if (VisaInfo.status) {
      showToastMessage("success", VisaInfo.Message);
      document.getElementById("btnCategory").innerHTML = "Register";
      var regLocationForm = document.getElementById("regLocationForm");
      regLocationForm.reset();
      getvisainfo();
      setupVisaID("");
    } else {
      showToastMessage("error", VisaInfo.Message);
    }
  };
  const handleClickEditCat = (currVisaID) => {
    document.getElementById("btnCategory").innerHTML = "Update";
    var update_visa_info = companyinformation.filter(
      (visa) => visa.company_id === currVisaID
    );
    document.getElementById("cname").value = update_visa_info[0].company_name;
    document.getElementById("cphone").value = update_visa_info[0].company_phone;
    document.getElementById("caddress").value =
      update_visa_info[0].company_address;

    setupVisaID(update_visa_info[0].company_id);
  };
  const selectBgColor = theme.palette.mode === "light" ? "#E8F0FE" : "#323848";
  const selectFgColor = theme.palette.mode === "light" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title="REGISTER/VIEW COMPANY"
        subtitle="Create/View a New Company"
      />
      <form
        id="regLocationForm"
        onSubmit={handleFormSubmit}
        style={{ marginBottom: "5%" }}
      >
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": {
              gridColumn: isNonMobile ? undefined : "span 4",
            },
          }}
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Company Name"
            // onChange={(event) => setCategoryName(event.target.value)}
            name="cname"
            id="cname"
            sx={{ gridColumn: "span 1" }}
            required
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Company Phone"
            // onChange={(event) => setCategoryName(event.target.value)}
            name="cphone"
            id="cphone"
            sx={{ gridColumn: "span 1" }}
            required
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            InputProps={{
              inputProps: {
                min: 0,
              },
            }}
            label="Company Address"
            // onChange={(event) => setCategoryName(event.target.value)}
            name="caddress"
            id="caddress"
            sx={{ gridColumn: "span 1" }}
            required
          />

          <Button
            type="submit"
            id="btnCategory"
            color="secondary"
            variant="contained"
          >
            Register
          </Button>
        </Box>
      </form>
      {companyinformation.length === 0 ? (
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
          companyinformation={companyinformation}
          handleClickEditCat={handleClickEditCat}
        />
      )}
    </Box>
  );
};

export default Company;
