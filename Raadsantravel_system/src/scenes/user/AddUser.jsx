import { Box, Button, TextField, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { registerUser } from "../../api/userapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useSelector } from "react-redux";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { userloginfo } = useSelector((store) => store.userReducer);
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    var post = new FormData();
    post.append("action", "registerUser");
    post.append("UserFullName", userinfo.UserFullName);
    post.append("UserUsername", userinfo.UserUsername);
    post.append("UserPassword", userinfo.UserPassword);
    post.append("UserType", userinfo.UserType);
    var UserInfo = await registerUser(post);
    if (UserInfo.status) {
      showToastMessage("success", UserInfo.Message);
      var regUserForm = document.getElementById("regUserForm");
      regUserForm.reset();
      setUserInfo({
        UserFullName: "",
        UserUsername: "",
        UserPassword: "",
        UserType: "",
      });
    } else {
      showToastMessage("error", UserInfo.Message);
    }
  };
  const [userinfo, setUserInfo] = useState({
    UserFullName: "",
    UserUsername: "",
    UserPassword: "",
    UserType: "",
  });
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userinfo, [name]: value });
  };

  const selectBgColor = theme.palette.mode === "light" ? "#E8F0FE" : "#323848";
  const selectFgColor = theme.palette.mode === "light" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Header title="REGISTER USER" subtitle="Create a New User" />

      <form id="regUserForm" onSubmit={handleFormSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Fullname"
            onChange={handleOnChange}
            // value={values.UserFullName}
            name="UserFullName"
            sx={{ gridColumn: "span 2" }}
            required
          />
          <select
            fullWidth
            variant="filled"
            component="select"
            name="UserType"
            onChange={handleOnChange}
            style={{
              gridColumn: "span 2",
              backgroundColor: selectBgColor,
              color: selectFgColor,
              // height: "150%",
            }}
            required
          >
            <option value="">Select Type</option>
            {userloginfo.usertype === "Developer" ? (
              <>
                <option value="Administrator">Administrator</option>
                <option value="Admin">Admin</option>
              </>
            ) : (
              ""
            )}
            {userloginfo.usertype === "Administrator" ? (
              <>
                <option value="Admin">Admin</option>
              </>
            ) : (
              ""
            )}
          </select>

          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Username"
            onChange={handleOnChange}
            // value={values.UserUsername}
            name="UserUsername"
            sx={{ gridColumn: "span 2" }}
            required
          />

          <TextField
            fullWidth
            variant="filled"
            type="password"
            label="Password"
            onChange={handleOnChange}
            // value={values.UserPassword}
            name="UserPassword"
            sx={{ gridColumn: "span 2" }}
            required
          />
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Create New User
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Form;
