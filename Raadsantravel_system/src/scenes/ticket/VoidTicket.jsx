import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "./VoidTicketTable";
import {  getVoidTicketInfo, registerVoReReCha } from "../../api/other";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";

const VoidTicket = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { userloginfo } = useSelector((store) => store.userReducer);
  const [ticketinformation, setTicketInfo] = useState([]);
  const [filterticket_information, setfilterTicketInfo] = useState([]);
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
  }, []);
  const getAlldata = async () => {
    var ticketInfo = await getVoidTicketInfo();
     var filter_ticket = ticketInfo.Message.filter(
      (ticket) => ticket.ticket_status === "Confirm" || ticket.ticket_status === "Booking" 
    );
    setTicketInfo(filter_ticket);
    setfilterTicketInfo(filter_ticket);
  };

  const handleSerach = (event) => {
    event.preventDefault();
    var PATTERN = event.target.value.toLowerCase();
    setfilterTicketInfo(
      ticketinformation.filter(function (str) {
        return (
          str.ticket_id.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_name.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_phone.toLowerCase().indexOf(PATTERN) !== -1
        );
      })
    );
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleClickEditCat = (currentticket_id) => {
    setShow(true);
    var curretnticket = ticketinformation.filter(
      (ticket) => ticket.ticket_id === currentticket_id
    );
    setCurrentTicket(curretnticket[0]);
  };

  const handleClickYes = async (event) => {
    event.preventDefault();
    var post = new FormData();
    post.append("action", "registerVoReReCha");
    post.append("TicketID", currentTicket.ticket_id);
    post.append("CustomerName", currentTicket.customer_name);
    post.append("CustomerPhone", currentTicket.customer_phone);
    post.append("Type", "Void");
    post.append("BankID", currentTicket.bank_id);
    post.append("NetAmount", currentTicket.net_amount);
    post.append("DepatureDate", "-");
    post.append("SelledBy", userloginfo.userid);
    var reissueinfo = await registerVoReReCha(post);
    // console.log(reissueinfo);
    if (reissueinfo.status) {
      showToastMessage("success", reissueinfo.Message);
      getAlldata();
      setShow(false);
    } else {
      showToastMessage("error", reissueinfo.Message);
    }
  };

  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="VIEW VOID TICKET" subtitle="View Void Ticket" />
        <Modal show={show} onHide={handleClose} style={{ color: "black" }}>
          <Modal.Header closeButton>
            <Modal.Title>Void this Ticket?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to cancel this Ticket?
          </Modal.Body>
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
          style={{ width: "30%"}}
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
      {ticketinformation.length === 0 ? (
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
        <DataTable ticketinformation={filterticket_information} handleClickEditCat={handleClickEditCat} />
      )}
    </Box>
  );
};

export default VoidTicket;
