import { Box, IconButton, useTheme } from "@mui/material";
import React, { useContext } from "react";
import { ColorModeContext } from "../../theme";
// import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Login from "../login/Login";
import { Provider, useDispatch } from "react-redux";
import userstore from "../../reducers/user";
import { logout } from "../../feature/userSlice";
import { logoutP } from "../../feature/productSlice";
import { isLogout } from "../../api/userapi";

const Topbar = ({ root }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogoutClick = async () => {
    await isLogout();
    dispatch(logout());
    dispatch(logoutP());
    navigate("/");
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <Provider store={userstore}>
            <Login root={root} />
          </Provider>
        </BrowserRouter>
      </React.StrictMode>
    );
  };

  return (
    <Box display="flex" justifyContent="end" p={2}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon fontSize="large" />
          ) : (
            <LightModeOutlinedIcon fontSize="large" />
          )}
        </IconButton>
        {/* <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton> */}
        {/* <IconButton>
          <SettingsOutlinedIcon />
        </IconButton> */}
        <IconButton onClick={handleLogoutClick}>
          <PowerSettingsNewIcon fontSize="large" />
        </IconButton>
        {/* <IconButton>
          <PersonOutlinedIcon />
        </IconButton> */}
      </Box>
    </Box>
  );
};

export default Topbar;
