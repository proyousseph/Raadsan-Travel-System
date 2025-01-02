import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import RuleIcon from "@mui/icons-material/Rule";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { GiReceiveMoney, GiPayMoney, GiOpenBook } from "react-icons/gi";
import CancelIcon from "@mui/icons-material/Cancel";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { GiCargoShip } from "react-icons/gi";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

// import { MdUnsubscribe } from "react-icons/md";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlightIcon from "@mui/icons-material/Flight";
import { useSelector } from "react-redux";

import { userAuth } from "../../api/userapi";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTicket, setIsTicket] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { userloginfo } = useSelector((store) => store.userReducer);

  //user page authentication
  const userauthentication = async () => {
    var link = window.location.href.split("/");
    if (link[3].length === 0) link[3] = "/";
    await userAuth(userloginfo.usertype, link[3]);
  };
  userauthentication();

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            // onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                // display="flex"
                // justifyContent="space-between"
                // alignItems="center"
                // ml="15px"
                textAlign="center"
              >
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  // style={{ paddingLeft: "0%" }}
                >
                  BARAF TRAVEL<br/> AGENCY
                </Typography>
                {/* <IconButton onClick={() => setIsCollapsed(!isCollapsed)}> */}
                {/* <MenuOutlinedIcon /> */}
                {/* </IconButton> */}
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/system_logo.jpg`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Hi{" "}
                  {{ userloginfo }
                    ? userloginfo.user_fullname.split(" ")[0]
                    : "Ed Roh"}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {{ userloginfo } ? userloginfo.usertype : "VP Fancy Admin"}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {userloginfo.usertype === "Developer" ? (
              <>
                <Item
                  title="Dashboard"
                  to="/"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  User
                </Typography>
                <Item
                  title="Add "
                  to="/adduser"
                  icon={<PersonAddIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="View"
                  to="/viewuser"
                  icon={<GroupsIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                  onClick={() => setIsTicket(!isTicket)}
                  style={{ cursor: "pointer" }}
                >
                  Ticket Application
                </Typography>
                {isTicket && (
                  <>
                    <Item
                      title="Ticket"
                      to="/viewticket"
                      icon={<AirplaneTicketIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    {/* <Item
                      title="Request"
                      to="/requestticket"
                      icon={<SupportAgentIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    /> */}
                    <Item
                      title="Today"
                      to="/todayticket"
                      icon={<ConnectingAirportsIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Re-issue"
                      to="/reissueticket"
                      icon={<RuleIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Void"
                      to="/voidticket"
                      icon={<CancelIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="Re-fund"
                      to="/refundticket"
                      icon={<CurrencyExchangeIcon />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </>
                )}
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Visa Application
                </Typography>
                <Item
                  title="Visa"
                  to="/visa"
                  icon={<AddBoxIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Customer"
                  to="/visacustomer"
                  icon={<PersonAddIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Process"
                  to="/processvisa"
                  icon={<PublishedWithChangesIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Cargo Application
                </Typography>
                <Item
                  title="Company"
                  to="/company"
                  icon={<AddBusinessIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Cargo"
                  to="/viewcargo"
                  icon={<GiCargoShip />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Process Cargo"
                  to="/processcargo"
                  icon={<PublishedWithChangesIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Finance
                </Typography>
                <Item
                  title="Accounts"
                  to="/account"
                  icon={<AccountBalanceIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Expense"
                  to="/expense"
                  icon={<PaidIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Customer"
                  to="/customer"
                  icon={<GiReceiveMoney />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Supplier"
                  to="/supplier"
                  icon={<GiPayMoney />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Settings
                </Typography>
                <Item
                  title="Location"
                  to="/location"
                  icon={<LocationOnIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Flight"
                  to="/flight"
                  icon={<FlightIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Reports
                </Typography>
                {/* <Item
                  title="Customer Report"
                  to="/customerreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                {/* <Item
                  title="Supplier Report"
                  to="/supplierreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                <Item
                  title="Ticket Report"
                  to="/ticketreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Flight Report"
                  to="/flightreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Sales Report"
                  to="/salesreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Income Statement"
                  to="/incomereport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Balance Sheet"
                  to="/balancsheetreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Owner's Equity"
                  to="/ownersreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            ) : (
              ""
            )}

            {userloginfo.usertype === "Administrator" ? (
              <>
                <Item
                  title="Dashboard"
                  to="/"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Ticket Application
                </Typography>
                <Item
                  title="Ticket"
                  to="/viewticket"
                  icon={<AirplaneTicketIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/* <Item
                  title="Request"
                  to="/requestticket"
                  icon={<SupportAgentIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                <Item
                  title="Today"
                  to="/todayticket"
                  icon={<ConnectingAirportsIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Re-issue"
                  to="/reissueticket"
                  icon={<RuleIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Void"
                  to="/voidticket"
                  icon={<CancelIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Re-fund"
                  to="/refundticket"
                  icon={<CurrencyExchangeIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Visa Application
                </Typography>
                <Item
                  title="Visa"
                  to="/visa"
                  icon={<AddBoxIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Customer"
                  to="/visacustomer"
                  icon={<PersonAddIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Process"
                  to="/processvisa"
                  icon={<PublishedWithChangesIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Cargo Application
                </Typography>
                <Item
                  title="Company"
                  to="/company"
                  icon={<AddBusinessIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Cargo"
                  to="/viewcargo"
                  icon={<GiCargoShip />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Process Cargo"
                  to="/processcargo"
                  icon={<PublishedWithChangesIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Finance
                </Typography>
                <Item
                  title="Accounts"
                  to="/account"
                  icon={<AccountBalanceIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Expense"
                  to="/expense"
                  icon={<PaidIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                 <Item
                  title="Customer"
                  to="/customer"
                  icon={<GiReceiveMoney />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Settings
                </Typography>
                <Item
                  title="Location"
                  to="/location"
                  icon={<LocationOnIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Flight"
                  to="/flight"
                  icon={<FlightIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Reports
                </Typography>
                <Item
                  title="Ticket Report"
                  to="/ticketreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Flight Report"
                  to="/flightreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Sales Report"
                  to="/salesreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Income Statement"
                  to="/incomereport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Balance Sheet"
                  to="/balancsheetreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Owner's Equity"
                  to="/ownersreport"
                  icon={<GiOpenBook />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            ) : (
              ""
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
