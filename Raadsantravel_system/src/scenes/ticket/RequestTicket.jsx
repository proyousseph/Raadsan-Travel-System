import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "./RequestTicketTable";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { getRequestCustomerInfo, registerCustomer } from "../../api/userapi";

const ViewTicket = () => {
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userloginfo } = useSelector((store) => store.userReducer);
  const [requestticketinformation, setReqTicketInfo] = useState([]);
  const [filterreqticket_information, setfilterReqTicketInfo] = useState([]);
  const [currentTicket, setCurrentTicket] = useState([]);
  const [show, setShow] = useState(false);
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
    getAlldata();
    const interval = setInterval(() => {
      // Call your function here
      getAlldata();
    }, 30000); // 30 seconds in milliseconds

    return () => {
      clearInterval(interval);
    };
  }, []);
  const getAlldata = async () => {
    var requestticketInfo = await getRequestCustomerInfo();

    setReqTicketInfo(requestticketInfo.Message);
    setfilterReqTicketInfo(requestticketInfo.Message);
  };
  const handleClose = () => {
    setShow(false);
    setCurrentTicket([])
  };
  const handleClickChange = (current_cusid) => {
    setShow(true);
    var curretnticket = requestticketinformation.filter(
      (reqcustomer) => reqcustomer.customer_id === current_cusid
    );
    setCurrentTicket(curretnticket[0]);
  };

  const handleClickYes = async (event) => {
    event.preventDefault();
    var post = new FormData();
    post.append("action", "registerCustomer");
    post.append("customerTitle", "0");
    post.append("CustomerID", currentTicket.customer_id);
    post.append("SelledBy", userloginfo.userid);
    var reissueinfo = await registerCustomer(post);
    // console.log(reissueinfo);
    if (reissueinfo.status) {
      getAlldata();
      showToastMessage("success", reissueinfo.Message);
      setShow(false);
    } else {
      showToastMessage("error", reissueinfo.Message);
    }
  };

  const handleSerach = (event) => {
    event.preventDefault();
    var PATTERN = event.target.value.toLowerCase();
    setfilterReqTicketInfo(
      requestticketinformation.filter(function (str) {
        return (
          // str.customer.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_name.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_phone.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.status.toLowerCase().indexOf(PATTERN) !== -1
        );
      })
    );
  };

  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="REQUST TICKET" subtitle="Request Ticket" />
        <Modal show={show} onHide={handleClose} style={{ color: "black" }}>
          <Modal.Header closeButton>
            <Modal.Title>Reply this Ticket?</Modal.Title>
          </Modal.Header>
          <Modal.Body> Are you sure you want to reply this Ticket?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClickYes}>
              Yes
            </Button>
            <Button variant="danger" onClick={handleClose}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          style={{ width: "30%" }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            onChange={handleSerach}
            placeholder="Search"
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
      {requestticketinformation.length === 0 ? (
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
          requestticketinformation={filterreqticket_information}
          handleClickChange={handleClickChange}
        />
      )}
    </Box>
  );
};

export default ViewTicket;
