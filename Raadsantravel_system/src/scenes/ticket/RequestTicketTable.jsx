import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Datatablemui = ({ requestticketinformation, handleClickChange }) => {
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
              <TableCell>Fullname</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Depature</TableCell>
              <TableCell>Arrival</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Register</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requestticketinformation
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((request, index) => {
                var status_className = "";
                // const separators = / |T/;

                if (request.status === "Reply") {
                  status_className = "btn btn-success btn-sm";
                } else {
                  status_className = "btn btn-danger btn-sm";
                }
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>
                      {request.customer_title + ". " + request.customer_name}
                    </TableCell>
                    <TableCell>{request.customer_phone}</TableCell>
                    <TableCell>{request.travel_type}</TableCell>
                    <TableCell>{request.from_city}</TableCell>
                    <TableCell>{request.to_city}</TableCell>
                    <TableCell>{request.depature_date}</TableCell>
                    <TableCell>
                      <div
                        style={{ color: "white", pointerEvents: "none" }}
                        className={status_className}
                      >
                        {request.status}
                      </div>
                    </TableCell>
                    <TableCell>{request.register_date}</TableCell>
                    <TableCell>
                      {request.status !== "Reply" ? (
                        <CheckCircleOutlineIcon
                          style={{
                            // color: "black",
                            // backgroundColor: "white",
                            borderRadius: "10px",
                            marginRight: "15px",
                            fontSize: "28px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleClickChange(request.customer_id)}
                        />
                      ) : (
                        ""
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={requestticketinformation.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Datatablemui;
