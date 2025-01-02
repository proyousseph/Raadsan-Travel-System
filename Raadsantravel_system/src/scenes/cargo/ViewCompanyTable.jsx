import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Datatablemui = ({ companyinformation, handleClickEditCat }) => {
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
              {/* {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))} */}
              <TableCell>#</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Company Phone</TableCell>
              <TableCell>Company Address</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companyinformation
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((company, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{company.company_id}</TableCell>
                    <TableCell>{company.company_name}</TableCell>
                    <TableCell>{company.company_phone}</TableCell>
                    <TableCell>{company.company_address}</TableCell>
                    <TableCell>
                      <Button
                        style={{ backgroundColor: "#0B5ED7" }}
                        variant="contained"
                        onClick={() => handleClickEditCat(company.company_id)}
                      >
                        <EditIcon style={{ color: "white" }} />
                      </Button>
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
        count={companyinformation.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Datatablemui;
