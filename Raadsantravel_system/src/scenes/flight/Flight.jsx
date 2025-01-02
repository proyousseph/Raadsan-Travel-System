import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getflightInfo, registerFlight } from "../../api/userapi";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "./ViewFlight";

const Flight = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();

  const [flightinformation, setFlightInfo] = useState([]);
  const [upFlightID, setupFlightID] = useState("");
  useEffect(() => {
    getflightinfo();
  }, []);
  const getflightinfo = async () => {
    var flightInfo = await getflightInfo();
    setFlightInfo(flightInfo.Message);
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
    var flightCode = document.getElementById("flight_code").value;
    var flightName = document.getElementById("flight_name").value;
    var flightType = document.getElementById("flight_type").value;
    var post = new FormData();
    post.append("action", "registerFlight");
    post.append("flightCode", flightCode);
    post.append("flightName", flightName);
    post.append("flightType", flightType);
    if (upFlightID === "") {
      post.append("update", "0");
    } else {
      post.append("flightID", upFlightID);
      post.append("update", "1");
    }
    var Categoryinfo = await registerFlight(post);
    // console.log(Categoryinfo);
    if (Categoryinfo.status) {
      showToastMessage("success", Categoryinfo.Message);
      document.getElementById("btnCategory").innerHTML = "Register";
      var regLocationForm = document.getElementById("regLocationForm");
      regLocationForm.reset();
      getflightinfo();
      setupFlightID("")
    } else {
      showToastMessage("error", Categoryinfo.Message);
    }
  };
  const handleClickEditCat = (currentLocationId) => {
    document.getElementById("btnCategory").innerHTML = "Update";
    var update_flight_info = flightinformation.filter(
      (flight) => flight.flight_id === currentLocationId
    );
    document.getElementById("flight_code").value = update_flight_info[0].flight_code;
    document.getElementById("flight_name").value = update_flight_info[0].flight_name;
    setupFlightID(update_flight_info[0].flight_id)
  };
  const selectBgColor = theme.palette.mode === "light" ? "#E8F0FE" : "#323848";
  const selectFgColor = theme.palette.mode === "light" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title="REGISTER/VIEW FLIGHT"
        subtitle="Create/View a New Flight"
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
            label="Flight Code"
            // value={categoryName}
            // onChange={(event) => setCategoryName(event.target.value)}
            name="flight_code"
            id="flight_code"
            sx={{ gridColumn: "span 1" }}
            required
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Flight Name"
            // value={categoryName}
            // onChange={(event) => setCategoryName(event.target.value)}
            name="flight_name"
            id="flight_name"
            sx={{ gridColumn: "span 1" }}
            required
          />
          <select
            // fullWidth
            variant="filled"
            component="select"
            // onChange={(event) => setCategoryName(event.target.value)}
            // value={CategoryStatus}
            name="flight_type"
            id="flight_type"
            style={{
              gridColumn: "span 1",
              backgroundColor: selectBgColor,
              color: selectFgColor,
            }}
            required
          >
            <option value="">Select Travel Type</option>
            <option value="Local">Local</option>
            <option value="International">International</option>
            <option value="Both">Both</option>
          </select>
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
      {flightinformation.length === 0 ? (
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
          flightinformation={flightinformation}
          handleClickEditCat={handleClickEditCat}
        />
      )}
    </Box>
  );
};

export default Flight;
