import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import AddUser from "./scenes/user/AddUser";
import ViewUser from "./scenes/user/ViewUser";
import Location from "./scenes/location/Location";
import Flight from "./scenes/flight/Flight";
import ViewTicket from "./scenes/ticket/ViewTicket";
// import RequestTicket from "./scenes/ticket/RequestTicket";
import TodayTicket from "./scenes/ticket/TodayTicket";
import ReissueTicket from "./scenes/ticket/ReissueTicket";
import VoidTicket from "./scenes/ticket/VoidTicket";
import RefundTicket from "./scenes/ticket/RefundTicket";
import Visa from "./scenes/visa/Visa";
import VisaCustomer from "./scenes/visa/ViewCustomerVisa";
import ProcessVisa from "./scenes/visa/ProcessVisa";
import Company from "./scenes/cargo/Company";
import Cargo from "./scenes/cargo/ViewCargo";
import ProcessCargo from "./scenes/cargo/ProcessCargo";
import Account from "./scenes/finance/Account";
import Expense from "./scenes/finance/Expense";
import Customer from "./scenes/finance/Customer";
import Supplier from "./scenes/finance/Supplier";
import TicketReport from "./scenes/reports/TicketReport";
import FlightReport from "./scenes/reports/FlightReport";
import SalesReport from "./scenes/reports/Sales";
// import CustomerReport from "./scenes/reports/CustomerReport"
// import SupplierReport from "./scenes/reports/SupplierReport"
import IncomeReport from "./scenes/reports/IncomeStatement";
import BalanceSheetReport from "./scenes/reports/BalanceSheet.jsx";
import OwnersEquityReport from "./scenes/reports/OwnersEquity.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
// import { useSelector } from "react-redux";

function App({ root }) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  // const { userinformation } = useSelector((store) => store.userReducer);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar root={root} setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/adduser" element={<AddUser />} />
              <Route path="/viewuser" element={<ViewUser />} />
              <Route path="/location" element={<Location />} />
              <Route path="/flight" element={<Flight />} />
              <Route path="/viewticket" element={<ViewTicket />} />
              {/* <Route path="/requestticket" element={<RequestTicket />} /> */}
              <Route path="/todayticket" element={<TodayTicket />} />
              <Route path="/reissueticket" element={<ReissueTicket />} />
              <Route path="/voidticket" element={<VoidTicket />} />
              <Route path="/refundticket" element={<RefundTicket />} />
              <Route path="/visa" element={<Visa />} />
              <Route path="/visacustomer" element={<VisaCustomer />} />
              <Route path="/processvisa" element={<ProcessVisa />} />
              <Route path="/company" element={<Company />} />
              <Route path="/viewcargo" element={<Cargo />} />
              <Route path="/processcargo" element={<ProcessCargo />} />
              <Route path="/account" element={<Account />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/supplier" element={<Supplier />} />
              {/* <Route path="/customerreport" element={<CustomerReport />} /> */}
              {/* <Route path="/supplierreport" element={<SupplierReport />} /> */}
              <Route path="/ticketreport" element={<TicketReport />} />
              <Route path="/flightreport" element={<FlightReport />} />
              <Route path="/salesreport" element={<SalesReport />} />
              <Route path="/incomereport" element={<IncomeReport />} />
              <Route
                path="/balancsheetreport"
                element={<BalanceSheetReport />}
              />
              <Route path="/ownersreport" element={<OwnersEquityReport />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
