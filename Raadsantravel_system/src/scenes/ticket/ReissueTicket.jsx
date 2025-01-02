import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "./ReissueTicketTable";
import {
  getRefundReissueTicketInfo,
  registerReissue,
  registerVoReReCha,
} from "../../api/other";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { getCustomersInfo } from "../../api/financeapi";

const ViewTicket = () => {
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userloginfo } = useSelector((store) => store.userReducer);
  const [ticketinformation, setTicketInfo] = useState([]);
  const [filterticket_information, setfilterTicketInfo] = useState([]);
  const [currentTicket, setCurrentTicket] = useState([]);
  const [show, setShow] = useState(false);
  const [retype, setRetype] = useState(false);
  const [modalbody, setmodalbody] = useState("");
  const [customer_information, setCustomerInfo] = useState([]);
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
    var ticketInfo = await getRefundReissueTicketInfo();
    var customerInfo = await getCustomersInfo();
    setCustomerInfo(customerInfo.Message);
    var filter_ticket = ticketInfo.Message.filter(
      (ticket) => ticket.ticket_status === "Confirm" || ticket.ticket_status === "Booking"
    );
    setTicketInfo(filter_ticket);
    setfilterTicketInfo(filter_ticket);
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    if (name === "isdebt") {
      if (value === "Yes") {
        setmodalbody(
          <div className="row">
            <div className="form-group col-md-6">
              <label>Is it debt?</label>
              <select
                className="form-select"
                placeholder="Is it debt?"
                name="isdebt"
                id="isdebt"
                onChange={handleOnChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group col-md-6">
              <label>Select Customer</label>
              <select
                className="form-select"
                placeholder="Customer"
                name="customerid"
                id="customerid"
                onChange={handleOnChange}
              >
                <option value="Z">Select Customer</option>
                {customer_information.map((cust, index) => {
                  return (
                    <option value={cust.customer_id}>
                      {cust.customer_name + " | " + cust.customer_phone}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        );
      } else {
        setmodalbody(
          <div className="row">
            <div className="form-group col-md-6">
              <label>Is it debt?</label>
              <select
                className="form-select"
                placeholder="Is it debt?"
                name="isdebt"
                id="isdebt"
                onChange={handleOnChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        );
      }
    }
  };
  const handleClickEditCat = (currentticket_id) => {
    setRetype(true);
    setmodalbody(
      <div className="row">
        <div className="form-group col-md-6">
          <label>Is it debt?</label>
          <select
            className="form-select"
            placeholder="Is it debt?"
            name="isdebt"
            id="isdebt"
            onChange={handleOnChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="form-group col-md-6">
          <label>Select Customer</label>
          <select
            className="form-select"
            placeholder="Customer"
            name="customerid"
            id="customerid"
            onChange={handleOnChange}
          >
            <option value="Z">Select Customer</option>
            {customer_information.map((cust, index) => {
              return (
                <option value={cust.customer_id}>
                  {cust.customer_name + " | " + cust.customer_phone}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
    setShow(true);
    var curretnticket = ticketinformation.filter(
      (ticket) => ticket.ticket_id === currentticket_id
    );
    setCurrentTicket(curretnticket[0]);
  };

  const handleClickChange = (currentticket_id) => {
    setRetype(false);
    setmodalbody(
      <div className="row">
        <div className="form-group col-md-6">
          <label>Depature Date</label>
          <input
            type="datetime-local"
            className="form-control"
            name="depature_date"
            id="depature_date"
          />
        </div>
        <div className="form-group col-md-6">
          <label>Charge Fee</label>
          <input
            type="number"
            min="0"
            className="form-control"
            name="fee"
            id="fee"
          />
        </div>
      </div>
    );
    setShow(true);
    var curretnticket = ticketinformation.filter(
      (ticket) => ticket.ticket_id === currentticket_id
    );
    setCurrentTicket(curretnticket[0]);
  };

  const handleClickYes = async (event) => {
    event.preventDefault();
    if (retype === true) {
      var post = new FormData();
      var isdebt = document.getElementById("isdebt").value;
      if (isdebt === "No") {
        post.append("CustomerID", "-");
      } else {
        var customerid = document.getElementById("customerid").value;
        if (customerid !== "Z") post.append("CustomerID", customerid);
        else {
          showToastMessage("error", "Please select Customer");
          return;
        }
      }
      post.append("action", "registerReissue");
      post.append("TicketID", currentTicket.ticket_id);
      post.append("CustomerName", currentTicket.customer_name);
      post.append("CustomerPhone", currentTicket.customer_phone);
      post.append("BankID", currentTicket.bank_id);
      post.append("NetAmount", currentTicket.net_amount);
      post.append("SelledBy", userloginfo.userid);
      var reissueinfo = await registerReissue(post);
      // console.log(reissueinfo);
      if (reissueinfo.status) {
        getAlldata();
        showToastMessage("success", reissueinfo.Message);
        setShow(false);
      } else {
        showToastMessage("error", reissueinfo.Message);
      }
    } else {
      var fee = document.getElementById("fee").value;
      var depature_date = document.getElementById("depature_date").value;
      if (fee === "" || depature_date === "") {
        showToastMessage("error", "Please fill the missing input");
        return;
      }
      var post = new FormData();
      post.append("action", "registerVoReReCha");
      post.append("TicketID", currentTicket.ticket_id);
      post.append("CustomerName", currentTicket.customer_name);
      post.append("CustomerPhone", currentTicket.customer_phone);
      post.append("Type", "ReissueChange");
      post.append("BankID", currentTicket.bank_id);
      post.append("NetAmount", fee);
      post.append("DepatureDate", depature_date);
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
    }
  };

  const handleSerach = (event) => {
    event.preventDefault();
    var PATTERN = event.target.value.toLowerCase();
    setfilterTicketInfo(
      ticketinformation.filter(function (str) {
        return (
          str.ticket_id.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_name.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_phone.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.ticket_status.toLowerCase().indexOf(PATTERN) !== -1
        );
      })
    );
  };

  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="20px">
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="RE-ISSUE TICKET" subtitle="Re-issue Ticket" />
        <Modal show={show} onHide={handleClose} style={{ color: "black" }}>
          <Modal.Header closeButton>
            <Modal.Title>Re-issue this Ticket?</Modal.Title>
          </Modal.Header>
          <Modal.Body> {modalbody}</Modal.Body>
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
        <DataTable
          ticketinformation={filterticket_information}
          handleClickEditCat={handleClickEditCat}
          handleClickChange={handleClickChange}
        />
      )}
    </Box>
  );
};

export default ViewTicket;
