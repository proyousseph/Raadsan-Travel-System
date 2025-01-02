import { Box, IconButton, InputBase, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { getBankAccount } from "../../api/financeapi";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Button } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "./AddCargo";
import ModalU from "./UpdateCargo";
import DataTable from "./ViewCargoTable";
import {
  getCargoInfo,
  getCompanyInfo,
  getCustomerVisaInfo,
  getVisaInfo,
} from "../../api/other";
import { getlocationInfo } from "../../api/userapi";

const ViewTicket = () => {
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customercargoinformation, setCustomerCargoInfo] = useState([]);
  const [filtercargo_information, setfilterCargoInfo] = useState([]);
  const [bankaccountinformation, setBankInfo] = useState([]);
  const [locationinformation, setLocationInfo] = useState([]);
  const [companyinformation, setCompanyInfo] = useState([]);
  const [currentCargo, setCurrentCargo] = useState([]);
  const [isOpenU, setisOpenU] = useState(false);
  const [isOpen, setisOpen] = useState(false);
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
    var bankaccountinfo = await getBankAccount();
    var cargoinfo = await getCargoInfo();
    var locationInfo = await getlocationInfo();
    var cargInfo = await getCompanyInfo();
    setLocationInfo(locationInfo.Message);
    setBankInfo(bankaccountinfo.Message);
    setCustomerCargoInfo(cargoinfo.Message);
    setfilterCargoInfo(cargoinfo.Message);
    setCompanyInfo(cargInfo.Message);
  };
  const handleModal = () => {
    setisOpen(!isOpen);
  };
  const handleClickEditCat = (current_cargoid) => {
    var currentcusvisa = customercargoinformation.filter(
      (cusvisa) => cusvisa.cargo_id === current_cargoid
    );
    if (currentcusvisa[0].cargo_status === "Completed") {
      showToastMessage(
        "error",
        "Visa status keeda Accepted ama Rejected ah lama update gareyn karo"
      );
      return;
    }
    setisOpenU(!isOpenU);
    setCurrentCargo(currentcusvisa[0]);
  };
  const handleViewImage = (current_cargoid) => {
    var currentcusvisa = customercargoinformation.filter(
      (cusvisa) => cusvisa.cargo_id === current_cargoid
    );
    var path = process.env.REACT_APP_CA_API + currentcusvisa[0].cargo_image;
    window.open(path, "_blank");
  };

  const handleSerach = (event) => {
    event.preventDefault();
    var PATTERN = event.target.value.toLowerCase();
    setfilterCargoInfo(
      customercargoinformation.filter(function (str) {
        return (
          str.customer_id.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_name.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.customer_phone.toLowerCase().indexOf(PATTERN) !== -1 ||
          str.visa_status.toLowerCase().indexOf(PATTERN) !== -1
        );
      })
    );
  };

  const emptyColor = theme.palette.mode === "dark" ? "black" : "white";

  return (
    <Box m="15px">
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="REGISTER/VIEW CUSTOMER CARGO"
          subtitle="Register a New Customer Cargo"
        />
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          style={{ width: "20%", marginLeft: "5%" }}
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
        <Box>
          <Button
            sx={{
              backgroundColor: "#141B2D",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              // padding: "10px 20px",
            }}
            onClick={handleModal}
          >
            <PersonAddAltIcon sx={{ mr: "0px" }} />
            Customer Cargo
          </Button>
        </Box>
      </Box>
      {isOpenU && (
        <ModalU
          showToastMessage={showToastMessage}
          isOpen={isOpenU}
          setisOpen={setisOpenU}
          bankaccountinformation={bankaccountinformation}
          locationinformation={locationinformation}
          companyinformation={companyinformation}
          getAlldata={getAlldata}
          currentCargo={currentCargo}
          setCurrentCargo={setCurrentCargo}
        />
      )}
      {isOpen && (
        <Modal
          showToastMessage={showToastMessage}
          isOpen={isOpen}
          setisOpen={setisOpen}
          bankaccountinformation={bankaccountinformation}
          locationinformation={locationinformation}
          companyinformation={companyinformation}
          getAlldata={getAlldata}
        />
      )}
      {isOpen === false && isOpenU === false ? (
        customercargoinformation.length === 0 ? (
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
            customercargoinformation={filtercargo_information}
            handleClickEditCat={handleClickEditCat}
            handleViewImage={handleViewImage}
          />
        )
      ) : (
        ""
      )}
    </Box>
  );
};

export default ViewTicket;
