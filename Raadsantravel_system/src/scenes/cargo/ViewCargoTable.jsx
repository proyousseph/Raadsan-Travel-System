import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";

const Datatablemui = ({
  customercargoinformation,
  handleClickEditCat,
  handleViewImage,
}) => {
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
              <TableCell>Code</TableCell>
              <TableCell>SName</TableCell>
              <TableCell>SPhone</TableCell>
              <TableCell>Scity</TableCell>
              <TableCell>RName</TableCell>
              <TableCell>RPhone</TableCell>
              <TableCell>Rcity</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Gross</TableCell>
              <TableCell>Net</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customercargoinformation
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cargo, index) => {
                var type_className = "";
                const separators = / |T/;
                if (cargo.cargo_status === "Ongoing") {
                  type_className = "btn bg-info btn-sm";
                } else if (cargo.cargo_status === "Completed") {
                  type_className = "btn btn-success btn-sm";
                }

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>{cargo.cargo_id}</TableCell>
                    <TableCell>{cargo.sender_name}</TableCell>
                    <TableCell>{cargo.sender_phone}</TableCell>
                    <TableCell>{cargo.scity}</TableCell>
                    <TableCell>{cargo.recipt_name}</TableCell>
                    <TableCell>{cargo.recipt_phone}</TableCell>
                    <TableCell>{cargo.rcity}</TableCell>
                    <TableCell>{cargo.company_name}</TableCell>
                    <TableCell>{cargo.cargo_weight} Kg</TableCell>
                    <TableCell>{cargo.cargo_description}</TableCell>
                    <TableCell>${cargo.gross_amount}</TableCell>
                    <TableCell>${cargo.net_amount}</TableCell>
                    <TableCell>
                      <div
                        style={{ color: "white", pointerEvents: "none" }}
                        className={type_className}
                      >
                        {cargo.cargo_status}
                      </div>
                    </TableCell>
                    <TableCell>{cargo.reg_date.split(separators)[0]}</TableCell>
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        <EditIcon
                          style={{
                            // color: "black",
                            // backgroundColor: "white",
                            borderRadius: "10px",
                            marginRight: "10px",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleClickEditCat(cargo.cargo_id)
                          }
                        />

                       
                        {cargo.cargo_image === "-" ? (
                          ""
                        ) : (
                          <ImageIcon
                          style={{
                            // color: "white",
                            // backgroundColor: "#0B5ED7",
                            borderRadius: "10px",
                            marginRight: "10px",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleViewImage(cargo.cargo_id)}
                        />
                        )}
                      </div>
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
        count={customercargoinformation.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Datatablemui;
