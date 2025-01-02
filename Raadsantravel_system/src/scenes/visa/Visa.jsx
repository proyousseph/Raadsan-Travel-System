import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "./ViewVisaTable";
import Select from "react-select";
import { countries } from "../../data/countryData";
import { getVisaInfo, registerVisa } from "../../api/other";

const Visa = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();

  const [visainformation, setVisaInfo] = useState([]);
  const [upVisaID, setupVisaID] = useState("");
  var [visaCountry, setVisaCountry] = useState(null);
  useEffect(() => {
    getvisainfo();
  }, []);
  const getvisainfo = async () => {
    var visaInfo = await getVisaInfo();
    setVisaInfo(visaInfo.Message);
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
    if (visaCountry.value === null) {
      showToastMessage("error", "Please select Visa Country");
      return;
    }
    var visa_type = document.getElementById("visa_type").value;
    var price = document.getElementById("price").value;
    var days = document.getElementById("days").value;
    var post = new FormData();
    post.append("action", "registerVisa");
    post.append("VisaCountry", visaCountry.value);
    post.append("VisaType", visa_type);
    post.append("Price", price);
    post.append("Days", days);
    if (upVisaID === "") {
      post.append("update", "0");
    } else {
      post.append("VisaID", upVisaID);
      post.append("update", "1");
    }
    var VisaInfo = await registerVisa(post);
    // console.log(VisaInfo);
    if (VisaInfo.status) {
      setVisaCountry(null);
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
    var update_visa_info = visainformation.filter(
      (visa) => visa.visa_id === currVisaID
    );
    document.getElementById("visa_type").value = update_visa_info[0].visa_type;
    document.getElementById("price").value = update_visa_info[0].visa_price;
    document.getElementById("days").value = update_visa_info[0].visa_days;

    setVisaCountry({
      value: update_visa_info[0].visa_country,
      label: update_visa_info[0].visa_country,
    });
    setupVisaID(update_visa_info[0].visa_id);
  };
  const selectBgColor = theme.palette.mode === "light" ? "#E8F0FE" : "#323848";
  const selectFgColor = theme.palette.mode === "light" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="REGISTER/VIEW VISA" subtitle="Create/View a New Visa" />
      <form
        id="regLocationForm"
        onSubmit={handleFormSubmit}
        style={{ marginBottom: "5%" }}
      >
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(5, minmax(0, 1fr))"
          sx={{
            "& > div": {
              gridColumn: isNonMobile ? undefined : "span 4",
            },
          }}
        >
          <Select
            styles={{
              control: (provided, state) => ({
                ...provided,
                backgroundColor: selectBgColor,
                color: selectFgColor,
                height: "100%",
              }),
              menu: (baseStyles, state) => ({
                ...baseStyles,
                color: "black",
                zIndex: 9999,
              }),
              input: (baseStyles, state) => ({
                ...baseStyles,
                color: selectFgColor,
              }),
              placeholder: (baseStyles, state) => ({
                ...baseStyles,
                color: selectFgColor,
              }),
              singleValue: (baseStyles, state) => ({
                ...baseStyles,
                color: selectFgColor,
              }),
              menuList: (baseStyles, state) => ({
                ...baseStyles,
                maxHeight: "200px",
              }),
            }}
            placeholder="Select a Visa Country"
            value={visaCountry}
            onChange={setVisaCountry}
            options={countries}
          />
          <select
            // fullWidth
            variant="filled"
            component="select"
            name="visa_type"
            id="visa_type"
            style={{
              gridColumn: "span 1",
              backgroundColor: selectBgColor,
              color: selectFgColor,
            }}
            required
          >
            <option value="">Select Visa Type</option>
            <option value="Emergancy">Emergancy</option>
            <option value="Normal">Normal</option>
          </select>

          <TextField
            fullWidth
            variant="filled"
            type="number"
            InputProps={{
              inputProps: {
                min: 0,
              },
            }}
            label="Price"
            // value={categoryName}
            // onChange={(event) => setCategoryName(event.target.value)}
            name="price"
            id="price"
            sx={{ gridColumn: "span 1" }}
            required
          />
          <TextField
            fullWidth
            variant="filled"
            type="number"
            InputProps={{
              inputProps: {
                min: 0,
              },
            }}
            label="Days"
            // value={categoryName}
            // onChange={(event) => setCategoryName(event.target.value)}
            name="days"
            id="days"
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
      {visainformation.length === 0 ? (
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
          visainformation={visainformation}
          handleClickEditCat={handleClickEditCat}
        />
      )}
    </Box>
  );
};

export default Visa;
