import axios from "axios";

const registerProduct = async (productInfo) => {
  var resultinfo = [];
  var post = productInfo;
  const { data } = await axios.post(process.env.REACT_APP_PRODUCT_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const getCodeNumber = async () => {
  var resultinfo = [];
  var post = {
    action: "getcodenumber",
  };
  const { data } = await axios.post(process.env.REACT_APP_PRODUCT_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const getProductInfo = async () => {
  var resultinfo = [];
  var post = {
    action: "getProductInfo",
  };
  const { data } = await axios.post(process.env.REACT_APP_PRODUCT_API, post, {
    headers: {
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
  });
  resultinfo = data;
  return resultinfo;
};
const updateProduct = async (companyInfo) => {
  var resultinfo = [];
  var post = companyInfo;
  const { data } = await axios.post(process.env.REACT_APP_PRODUCT_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};

const registerSell = async (companyInfo) => {
  var resultinfo = [];
  var post = companyInfo;
  const { data } = await axios.post(process.env.REACT_APP_PRODUCT_API, post, {
    headers: {
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
      //   Accept: "multipart/form-data",
    },
  });
  resultinfo = data;
  return resultinfo;
};

export { getCodeNumber, registerProduct, getProductInfo, updateProduct,registerSell };
