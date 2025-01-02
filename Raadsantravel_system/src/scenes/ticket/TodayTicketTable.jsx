import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const Datatablemui = ({ ticketinformation }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>PNR</TableCell>
              <TableCell>FName</TableCell>
              <TableCell>LName</TableCell>
              <TableCell>Sex</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Depature</TableCell>
              <TableCell>Travel Date</TableCell>
              <TableCell>Arrival</TableCell>
              <TableCell>Airline</TableCell>
              <TableCell>Ticket</TableCell>
              <TableCell>Gross</TableCell>
              <TableCell>Net</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketinformation
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket, index) => {
                var type_className = "";
                const separators = / |T/;
                if (ticket.ticket_status === "Confirm") {
                  type_className = "btn bg-info btn-sm";
                } else if (ticket.ticket_status === "Booking") {
                  type_className = "btn btn-warning btn-sm";
                } else if (ticket.ticket_status === "Used") {
                  type_className = "btn btn-success btn-sm";
                } else if (ticket.ticket_status === "Cancel") {
                  type_className = "btn btn-danger btn-sm";
                }
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>{ticket.ticket_id}</TableCell>
                    <TableCell>{ticket.customer_title + ". " +ticket.customer_name.split(",")[0]}</TableCell>
                    <TableCell>{ticket.customer_name.split(",")[1]}</TableCell>
                     <TableCell>{ticket.customer_sex}</TableCell>
                    <TableCell>{ticket.customer_phone}</TableCell>
                    <TableCell>{ticket.travel_type}</TableCell>
                    <TableCell>{ticket.depature_place}</TableCell>
                    <TableCell>{ticket.depature_date.split(separators)[0]}</TableCell>
                    <TableCell>{ticket.arrival_place}</TableCell>
                    <TableCell>{ticket.flight_id}</TableCell>
                    <TableCell>{ticket.ticket_type}</TableCell>
                    <TableCell>${ticket.gross_amount}</TableCell>
                    <TableCell>${ticket.net_amount}</TableCell>
                    <TableCell>
                      <div
                        style={{ color: "white", pointerEvents: "none" }}
                        className={type_className}
                      >
                        {ticket.ticket_status}
                      </div>
                    </TableCell>
                    <TableCell>{ticket.reg_date}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={ticketinformation.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Datatablemui;
