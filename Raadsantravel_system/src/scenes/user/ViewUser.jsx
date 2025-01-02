import { Box, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
// import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleModal,
  setCurrentUserInfo,
  setUserInfo,
} from "../../feature/userSlice";
import Modal from "./Modal";
import { getUserInfo } from "../../api/userapi";

const ViewMarketer = () => {
  const { userinformation, userloginfo } = useSelector(
    (store) => store.userReducer
  );
  var userinformation_filter = [];
  if (userloginfo.usertype === "Developer") {
    userinformation_filter = userinformation;
  } else if (userloginfo.usertype === "Administrator") {
    userinformation_filter = userinformation.filter(
      (user) => user.usertype !== "Developer"
    );
  } else {
    userinformation_filter = userinformation.filter(
      (user) =>
        user.usertype !== "Developer" && user.usertype !== "Administrator"
    );
  }

  const dispatch = useDispatch();
  useEffect(() => {
    getuserInfo();
  }, []);
  const getuserInfo = async () => {
    var userinfo = await getUserInfo();
    dispatch(setUserInfo(userinfo.Message));
  };

  const theme = useTheme();
  //   const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleClick = (currentUserName) => {
    var userinformation_filter_edit = userinformation.filter(
      (user) =>
        user.username === currentUserName
    );
    dispatch(setCurrentUserInfo(userinformation_filter_edit[0]));
    dispatch(handleModal());
  };
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
  const tableClass =
    theme.palette.mode === "dark"
      ? "table table-striped table-dark"
      : "table table-striped";
  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";
  if (userinformation.length === 0)
    return (
      <h1 style={{ color: { emptyColor }, textAlign: "center" }}>
        No data Found
      </h1>
    );
  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title="VIEW USER INFORMATION"
        subtitle="View a User Information"
      />
      <Modal showToastMessage={showToastMessage} getuserInfo={getuserInfo} />
      <Table className={tableClass}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Full Name</th>
            <th scope="col">Username</th>
            <th scope="col">Password</th>
            <th scope="col">User Type</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {userinformation_filter.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>

              <td>{user.user_fullname}</td>
              <td>{user.username}</td>
              <td>{user.userpassword}</td>
              <td>{user.usertype}</td>
              <td>{user.userstatus}</td>
              <td>
                <Button
                  className="btn btn-sm"
                  onClick={() => handleClick(user.username)}
                >
                  <EditIcon />
                </Button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default ViewMarketer;
