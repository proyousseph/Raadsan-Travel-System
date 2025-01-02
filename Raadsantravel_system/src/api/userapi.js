import axios from "axios";

const checkUserLogin = async (userName, userPassword) => {
  var userinfo = [];

  var post = {
    action: "checkUserLogin",
    userName: userName,
    userPassword: userPassword,
  };

  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  userinfo = data;
  return userinfo;
};

const isLogin = async () => {
  var resultinfo = [];
  var post = {
    action: "isLogin",
  };
  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const isLogout = async () => {
  var resultinfo = [];
  var post = {
    action: "isLogout",
  };
  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerUser = async (post) => {
  var resultinfo = [];
  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const getUserInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getUserInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const updateUser = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerLocation = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getlocationInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getlocationInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerFlight = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getflightInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getflightInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const getRequestCustomerInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getRequestCustomerInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerCustomer = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const generateInvoiceID = async (post) => {
  var resultinfo = [];

  const { data } = await axios.post(process.env.REACT_APP_USER_API, post, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

function generateAuthToken(length) {
  let result = "";
  const characters = process.env.REACT_APP_CHARECTER_AUTH_TOKEN;
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const sendEmail = async (gmail) => {
  var authinfo = {};
  var authToken = "";
  if (window.Email) {
    var datetime = new Date().toLocaleString();
    authToken = generateAuthToken(12);
    // console.log(authToken);
    await window.Email.send({
      SecureToken: process.env.REACT_APP_SECURE_TOKEN,
      To: gmail,
      From: process.env.REACT_APP_FROM_GMAIL,
      Subject: "Authentication Key",
      Body:
        "At the time " +
        datetime +
        " Your Authentication key is [" +
        authToken +
        "] good luck",
    }).then((message) => {
      authinfo = { message, authToken };
    });
  }
  // console.log(authinfo);
  return authinfo;
};

// user authentication function
const userAuth = async (usertype, page) => {
  const authInfo = {
    Developer: {
      "/": 1,
      adduser: 1,
      viewuser: 1,
      viewticket: 1,
      reissueticket: 1,
      todayticket: 1,
      // requestticket: 1,
      voidticket: 1,
      refundticket: 1,
      visa: 1,
      visacustomer: 1,
      processvisa: 1,
      company: 1,
      viewcargo: 1,
      processcargo: 1,
      account: 1,
      expense: 1,
      customer: 1,
      supplier: 1,
      location: 1,
      flight: 1,
      // customerreport: 1,
      // supplierreport: 1,
      ticketreport: 1,
      flightreport:1,
      salesreport: 1,
      incomereport: 1,
      balancsheetreport: 1,
      ownersreport: 1,
    },
    Administrator: {
      "/": 1,
      viewticket: 1,
      todayticket: 1,
      // requestticket: 1,
      reissueticket: 1,
      voidticket: 1,
      refundticket: 1,
      visa: 1,
      visacustomer: 1,
      processvisa: 1,
      company: 1,
      viewcargo: 1,
      processcargo: 1,
      account: 1,
      expense: 1,
      customer: 1,
      location: 1,
      flight: 1,
      ticketreport: 1,
      flightreport:1,
      salesreport: 1,
      incomereport: 1,
      balancsheetreport: 1,
      ownersreport: 1,
    },
  };

  if (
    authInfo[usertype][page] === undefined ||
    authInfo[usertype][page] === 0
  ) {
    await isLogout();
    window.location.reload();
  }
};

export {
  checkUserLogin,
  sendEmail,
  registerUser,
  getUserInfo,
  updateUser,
  registerLocation,
  getlocationInfo,
  registerFlight,
  getflightInfo,
  userAuth,
  isLogin,
  isLogout,
  getRequestCustomerInfo,
  registerCustomer,
  generateInvoiceID,
};
