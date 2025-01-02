import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getlocationInfo, registerLocation } from "../../api/userapi";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "./ViewLocation";

const Location = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();

  const [locationinformation, setLocationInfo] = useState([]);
  const [upLocationID, setupLocationID] = useState("");
  useEffect(() => {
    getlocationinfo();
  }, []);
  const getlocationinfo = async () => {
    var locationInfo = await getlocationInfo();
    setLocationInfo(locationInfo.Message);
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
    var locationCode = document.getElementById("location_code").value;
    var locationName = document.getElementById("location_name").value;
    var locationType = document.getElementById("location_type").value;
    var post = new FormData();
    post.append("action", "registerLocation");
    post.append("locationCode", locationCode);
    post.append("locationName", locationName);
    post.append("locationType", locationType);
    if (upLocationID === "") {
      post.append("update", "0");
    } else {
      post.append("LocationID", upLocationID);
      post.append("update", "1");
    }
    var Categoryinfo = await registerLocation(post);
    // console.log(Categoryinfo);
    if (Categoryinfo.status) {
      showToastMessage("success", Categoryinfo.Message);
      document.getElementById("btnCategory").innerHTML = "Register";
      var regLocationForm = document.getElementById("regLocationForm");
      regLocationForm.reset();
      getlocationinfo();
      setupLocationID("")
    } else {
      showToastMessage("error", Categoryinfo.Message);
    }
  };
  const handleClickEditCat = (currentLocationId) => {
    document.getElementById("btnCategory").innerHTML = "Update";
    var update_location_info = locationinformation.filter(
      (location) => location.location_id === currentLocationId
    );
    document.getElementById("location_code").value = update_location_info[0].location_code;
    document.getElementById("location_name").value = update_location_info[0].location_name;
    setupLocationID(update_location_info[0].location_id)
  };
  const selectBgColor = theme.palette.mode === "light" ? "#E8F0FE" : "#323848";
  const selectFgColor = theme.palette.mode === "light" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title="REGISTER/VIEW LOCATION"
        subtitle="Create/View a New Location"
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
            label="Location Code"
            // value={categoryName}
            // onChange={(event) => setCategoryName(event.target.value)}
            name="location_code"
            id="location_code"
            sx={{ gridColumn: "span 1" }}
            required
          />
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Location Name"
            // value={categoryName}
            // onChange={(event) => setCategoryName(event.target.value)}
            name="location_name"
            id="location_name"
            sx={{ gridColumn: "span 1" }}
            required
          />
          <select
            // fullWidth
            variant="filled"
            component="select"
            // onChange={(event) => setCategoryName(event.target.value)}
            // value={CategoryStatus}
            name="location_type"
            id="location_type"
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
      {locationinformation.length === 0 ? (
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
          locationinformation={locationinformation}
          handleClickEditCat={handleClickEditCat}
        />
      )}
    </Box>
  );
};

export default Location;
