import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
// import { mockTransactions } from "../../data/mockData";
// import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
// import EmailIcon from "@mui/icons-material/Email";
// import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
// import GeographyChart from "../../components/GeographyChart";
// import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
// import ProgressCircle from "../../components/ProgressCircle";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FaChartLine } from "react-icons/fa";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import AirlinesIcon from "@mui/icons-material/Airlines";
import CargoIcon from '@mui/icons-material/LocalShipping';

import {
  dashboardRowOne,
  last_10_SalesRevenue,
  recentTransactions,
} from "../../api/financeapi";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dashboardRowone, setDashboardRowone] = useState([]);
  const [last_10SalesRevenue, setLast_10SalesRevenue] = useState([]);
  const [recentTransaction, setRecentTransaction] = useState([]);
  useEffect(() => {
    getAllInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getAllInfo = async () => {
    var dashboardrowone = await dashboardRowOne();
    var last_10_salesrevenue = await last_10_SalesRevenue();
    var recenttransaction = await recentTransactions();
    if (dashboardrowone.status === true)
      setDashboardRowone(dashboardrowone.Message);
    if (last_10_salesrevenue.status === true)
      setLast_10SalesRevenue(last_10_salesrevenue.Message);
    if (recenttransaction.status === true)
      setRecentTransaction(recenttransaction.Message);
  };
  if (
    dashboardRowone.status === false ||
    last_10SalesRevenue.status === false ||
    recentTransaction.status === false
  ) {
    return null;
  }
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="DASHBOARD"
          subtitle="Welcome RAADSAN TRAVEL SERVICES SYSTEM"
        />
        {/* Download Button */}
        {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="120px"
        gap="25px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardRowone.length == 0? 0: dashboardRowone[0].Price + "$"}
            subtitle="Today's Sales Revenue"
            // progress="0.0"
            // increase="+14%"
            icon={<FaChartLine size={30} color="#3DA58A" />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardRowone.length == 0? "": dashboardRowone[1].Price + "$"}
            subtitle="Today's Ticket Revenue"
            // progress="0.50"
            // increase="+21%"
            icon={
              <AirplaneTicketIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardRowone.length == 0? "": dashboardRowone[2].Price + "$"}
            subtitle="Today's Visa Revenue"
            // progress="0.30"
            // increase="+5%"
            icon={
              <AirlinesIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardRowone.length == 0? "": dashboardRowone[3].Price + "$"}
            subtitle="Today's Cargo Revenue"
            // progress="0.80"
            // increase="+43%"
            icon={
              <CargoIcon
                sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          height="150%"
          gridColumn="span 9"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Last 10 Days Sales Revenue
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                ${Number(last_10SalesRevenue.length == 0 ? 0: last_10SalesRevenue[10].Price).toFixed(2)}
              </Typography>
            </Box>
            {/* <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box> */}
          </Box>
          <Box height="300px" m="2% 0 0 0">
            <BarChart last_10SalesRevenue={last_10SalesRevenue} />
          </Box>
        </Box>
        <Box
          height="150%"
          gridColumn="span 3"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {recentTransaction.map((transaction, i) => {
            if (i % 2 === 0) {
              return (
                <Box
                  key={`${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h5"
                      fontWeight="600"
                    >
                      {transaction.descr}
                    </Typography>
                    {/* <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography> */}
                  </Box>
                  <Box color={colors.grey[100]}>{transaction.date}</Box>
                  <Box
                    backgroundColor={colors.greenAccent[500]}
                    p="5px 10px"
                    borderRadius="4px"
                  >
                    $
                    {transaction.Debit == 0
                      ? transaction.Credit
                      : transaction.Debit}
                  </Box>
                </Box>
              );
            } else {
              // console.log(transaction.Debit);
              return null;
            }
          })}
        </Box>
        <Box height="100%"></Box>

        {/* ROW 3 */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
