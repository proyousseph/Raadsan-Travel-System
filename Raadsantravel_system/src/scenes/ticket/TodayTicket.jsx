import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "./TodayTicketTable";
import { getTodayTicketInfo } from "../../api/other";

const TodayTicket = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ticketinformation, setTicketInfo] = useState([]);
  const [filterticket_information, setfilterTicketInfo] = useState([]);
  useEffect(() => {
    getAlldata();
  }, []);
  const getAlldata = async () => {
    var ticketInfo = await getTodayTicketInfo();
    var filter_ticket = ticketInfo.Message.filter(
      (ticket) => ticket.ticket_status === "Confirm"
    );
    setTicketInfo(filter_ticket);
    setfilterTicketInfo(filter_ticket)
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

  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="20px">
      {/* <ToastContainer /> */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="VIEW TODAY'S TICKET" subtitle="View Today's Ticket" />
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
        <DataTable ticketinformation={filterticket_information} />
      )}
    </Box>
  );
};

export default TodayTicket;
