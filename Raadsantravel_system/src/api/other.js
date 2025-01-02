import axios from "axios";

const registerTicket = async (productInfo) => {
  var resultinfo = [];
  var post = productInfo;
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getTicketInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getTicketInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const getTodayTicketInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getTodayTicketInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerReissue = async (productInfo) => {
  var resultinfo = [];
  var post = productInfo;
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getVoidTicketInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getVoidTicketInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getRefundReissueTicketInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getRefundReissueTicketInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerVoReReCha = async (productInfo) => {
  var resultinfo = [];
  var post = productInfo;
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerVisa = async (productInfo) => {
  var resultinfo = [];
  var post = productInfo;
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getVisaInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getVisaInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerCustomerVisa = async (productInfo) => {
  var resultinfo = [];
  var post = productInfo;
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getCustomerVisaInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getCustomerVisaInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerProcessVisa = async (productInfo) => {
  var resultinfo = [];
  var post = productInfo;
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerCompany = async (productInfo) => {
  var resultinfo = [];
  var post = productInfo;
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const getCompanyInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getCompanyInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerCargo = async (productInfo) => {
  var resultinfo = [];
  var post = productInfo;
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getCargoInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getCargoInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerProcessCargo = async (productInfo) => {
  var resultinfo = [];
  var post = productInfo;
  const { data } = await axios.post(process.env.REACT_APP_OTHER_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};

export {
  registerTicket,
  getTicketInfo,
  getTodayTicketInfo,
  registerReissue,
  getVoidTicketInfo,
  getRefundReissueTicketInfo,
  registerVoReReCha,
  registerVisa,
  getVisaInfo,
  registerCustomerVisa,
  getCustomerVisaInfo,
  registerProcessVisa,
  registerCompany,
  getCompanyInfo,
  registerCargo,
  getCargoInfo,
  registerProcessCargo,
};
