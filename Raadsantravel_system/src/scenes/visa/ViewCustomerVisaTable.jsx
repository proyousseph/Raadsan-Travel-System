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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import { FaCcVisa } from "react-icons/fa";

const Datatablemui = ({
  customervisainformation,
  handleClickEditCat,
  handleViewImage,
  handleViewPdf,
  handleViewVisa,
  handleInvoiceDownloaded
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
              <TableCell>FName</TableCell>
              <TableCell>LName</TableCell>
              <TableCell>Sex</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>PNumber</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Nationality</TableCell>
              <TableCell>Expire Date</TableCell>
              <TableCell>Visa</TableCell>
              <TableCell>Net</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customervisainformation
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cusvisa, index) => {
                var type_className = "";
                // const separators = / |T/;
                if (cusvisa.visa_status === "Approved") {
                  type_className = "btn bg-info btn-sm";
                } else if (cusvisa.visa_status === "Accepted") {
                  type_className = "btn btn-success btn-sm";
                } else if (cusvisa.visa_status === "Rejected") {
                  type_className = "btn btn-danger btn-sm";
                }
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell onClick={() => handleInvoiceDownloaded(cusvisa.customer_id)}>{cusvisa.customer_id}</TableCell>
                    <TableCell>
                      {cusvisa.customer_title +
                        ". " +
                        cusvisa.customer_name.split(",")[0]}
                    </TableCell>
                    <TableCell>{cusvisa.customer_name.split(",")[1]}</TableCell>
                    <TableCell>{cusvisa.customer_sex}</TableCell>
                    <TableCell>{cusvisa.customer_phone}</TableCell>
                    <TableCell>{cusvisa.passport_number}</TableCell>
                    <TableCell>{cusvisa.birth_date}</TableCell>
                    <TableCell>{cusvisa.passport_nationality}</TableCell>
                    <TableCell>{cusvisa.expire_date}</TableCell>
                    <TableCell>{cusvisa.visa_country}</TableCell>
                    <TableCell>${cusvisa.net_amount}</TableCell>
                    <TableCell>
                      <div
                        style={{ color: "white", pointerEvents: "none" }}
                        className={type_className}
                      >
                        {cusvisa.visa_status}
                      </div>
                    </TableCell>
                    <TableCell>{cusvisa.reg_date}</TableCell>
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
                            handleClickEditCat(cusvisa.customer_id)
                          }
                        />

                        <ImageIcon
                          style={{
                            // color: "white",
                            // backgroundColor: "#0B5ED7",
                            borderRadius: "10px",
                            marginRight: "10px",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleViewImage(cusvisa.customer_id)}
                        />
                        <PictureAsPdfIcon
                          style={{
                            // color: "black",
                            // backgroundColor: "white",
                            borderRadius: "10px",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleViewPdf(cusvisa.customer_id)}
                        />
                        {cusvisa.visapdf_name === "-" ? (
                          ""
                        ) : (
                          <FaCcVisa
                            style={{
                              // color: "white",
                              // backgroundColor: "#0B5ED7",
                              borderRadius: "10px",
                              marginLeft: "10px",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleViewVisa(cusvisa.customer_id)}
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
        count={customervisainformation.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Datatablemui;
