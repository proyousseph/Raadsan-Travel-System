import axios from "axios";

const getExpenseAccounts = async () => {
  var resultinfo = [];
  var post = {
    action: "getExpenseAccounts",
  };
  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerExpense = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getExpenses = async () => {
  var resultinfo = [];
  var post = {
    action: "getExpenses",
  };
  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const cancelExpense = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

// const getCustomerLoan = async () => {
//   var resultinfo = [];
//   var post = {
//     action: "getCustomerLiability",
//   };
//   const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
//     headers: {
//       "Content-Type": "application/json",
//       // Accept: "application/json",
//     },
//   });
//   resultinfo = data;
//   return resultinfo;
// };

// const getCustomerLoanAndPaid = async () => {
//   var resultinfo = [];
//   var post = {
//     action: "getCustomerLiabilityAndPaid",
//   };
//   const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
//     headers: {
//       "Content-Type": "application/json",
//       // Accept: "application/json",
//     },
//   });
//   resultinfo = data;
//   return resultinfo;
// };

const registerCustomerPay = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

// const getSupplierLoan = async () => {
//   var resultinfo = [];
//   var post = {
//     action: "getSupplierLiability",
//   };
//   const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
//     headers: {
//       "Content-Type": "application/json",
//       // Accept: "application/json",
//     },
//   });
//   resultinfo = data;
//   return resultinfo;
// };

// const getSupplierLoanAndPaid = async () => {
//   var resultinfo = [];
//   var post = {
//     action: "getSupplierLiabilityAndPaid",
//   };
//   const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
//     headers: {
//       "Content-Type": "application/json",
//       // Accept: "application/json",
//     },
//   });
//   resultinfo = data;
//   return resultinfo;
// };

const registerSupplierPay = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const ticketReport = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const flightReport = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const salesReport = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const customerReport = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const cancelSellorBuy = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const supplierReport = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const incomeReport = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const balanceReport = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const ownerReport = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const dashboardRowOne = async () => {
  var resultinfo = [];
  var post = {
    action: "dashboardRowOne",
  };

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const last_10_SalesRevenue = async () => {
  var resultinfo = [];
  var post = {
    action: "last_10_SalesRevenue",
  };

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const recentTransactions = async () => {
  var resultinfo = [];
  var post = {
    action: "recentTransactions",
  };

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerBankAccount = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getBankAccount = async () => {
  var resultinfo = [];
  var post = {
    action: "getBankAccounts",
  };

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const registerCustomer = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const getCustomersInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getCustomersInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerSupplier = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getSupplierInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getSupplierInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const transferMoney = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const registerSupCusCash = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_FINANCE_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};


export {
  getExpenseAccounts,
  registerExpense,
  getExpenses,
  cancelExpense,
  // getCustomerLoan,
  // getCustomerLoanAndPaid,
  registerCustomerPay,
  // getSupplierLoan,
  // getSupplierLoanAndPaid,
  registerSupplierPay,
  salesReport,
  customerReport,
  cancelSellorBuy,
  supplierReport,
  incomeReport,
  balanceReport,
  ownerReport,
  dashboardRowOne,
  last_10_SalesRevenue,
  recentTransactions,
  registerBankAccount,
  getBankAccount,
  registerCustomer,
  getCustomersInfo,
  registerSupplier,
  getSupplierInfo,
  transferMoney,
  registerSupCusCash,
  ticketReport,
  flightReport
};
