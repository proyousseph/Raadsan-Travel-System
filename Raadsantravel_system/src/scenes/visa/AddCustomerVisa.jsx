import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Button, Form } from "react-bootstrap";
import { AiFillCloseCircle } from "react-icons/ai";
import styles from "./modal.module.scss";
import Select from "react-select";
import { countries } from "../../data/countryData";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { registerCustomerVisa } from "../../api/other";

const customStyles = {
  content: {
    top: "50%",
    left: "60%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// setting up the main element
ReactModal.setAppElement("#root");
function Modal({
  showToastMessage,
  isOpen,
  setisOpen,
  bankaccountinformation,
  visainformation,
  getAlldata,
}) {
  function closeModal() {
    setisOpen(!isOpen);
    setVisaInfo([]);
    setVisaVal([]);
    setPassportNat(null);
    setVisa([]);
  }
  useEffect(() => {
    const visaselect = [];

    visainformation.map((visa, index) => {
      // console.log(visa);
      visaselect.push({
        value: visa.visa_id,
        label: visa.visa_country + " | " + visa.visa_type,
      });
    });
    setVisa(visaselect);
  }, []);
  const [visaInfo, setVisaInfo] = useState([]);
  var [visa, setVisa] = useState([]);
  var [visaVal, setVisaVal] = useState([]);
  var [passportNat, setPassportNat] = useState([]);
  const [selectedFilePic, setSelectedFilePic] = useState(null);
  const [selectedFilePdf, setSelectedFilePdf] = useState(null);

  if (!isOpen) return;
  const handleOnChange = (event) => {
    const { name, value } = event.target;

    if (name === "expire_date") {
      const today = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(today.getMonth() + 5);
      const selectedDate = new Date(value);
      selectedDate.setDate(1);
      sixMonthsFromNow.setDate(1);
      // console.log(selectedDate, sixMonthsFromNow);
      if (selectedDate < sixMonthsFromNow) {
        showToastMessage(
          "error",
          "Passports that are less than 6 months past their expiration date cannot be accepted."
        );
        document.getElementById("expire_date").value = "";
      }
    }
    if (name === "pass_pdf") {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        setSelectedFilePdf(file);
      } else {
        setSelectedFilePdf(null);
        showToastMessage("error", "Please select file type PDF");
        document.getElementById("pass_pdf").value = "";
      }
    }
    if (name === "pic_image") {
      const file = event.target.files[0];
      if (file && isFileTypeAllowed(file.type)) {
        setSelectedFilePic(file);
      } else {
        setSelectedFilePic(null);
        showToastMessage("error", "Please select file type png, jpg, jpeg");
        document.getElementById("pic_image").value = "";
      }
    }
    setVisaInfo({ ...visaInfo, [name]: value });
  };
  const isFileTypeAllowed = (fileType) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    return allowedTypes.includes(fileType);
  };
  const handleSelect = async (event) => {
    setVisaVal(event);
    var filter_visa = visainformation.filter(
      (visa) => visa.visa_id === event.value
    );
    document.getElementById("visa_amount").value = filter_visa[0].visa_price;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    var post = new FormData();
    post.append("action", "registerCustomerVisa");
    post.append("CustomerTitle", visaInfo.title_type);
    post.append("CustomerFName", visaInfo.first_name);
    post.append("CustomerLName", visaInfo.last_name);
    post.append("CustomerPhone", visaInfo.customer_mobile);
    post.append("SexType", visaInfo.sex);
    // post.append("PassportNumber", visaInfo.passport_number);
    // post.append("BirthDate", visaInfo.birth_date);
    // post.append("PassportNationality", passportNat.value);
    // post.append("ExpireDate", visaInfo.expire_date);

    post.append("PassportNumber", "-");
    post.append("BirthDate", "-");
    post.append("PassportNationality", "-");
    post.append("ExpireDate", "-");

    post.append("VisaID", visaVal.value);
    post.append("NetAmount", visaInfo.net_amount);
    post.append("BankID", visaInfo.bank_accounts);
    post.append("image", selectedFilePic);
    post.append("file", selectedFilePdf);
    post.append("update", "0");
    document.getElementById("btnsubmitVisa").style.display = "none";

    var cusvisaInf = await registerCustomerVisa(post);
    // console.log(cusvisaInf);
    // return;
    if (cusvisaInf.status) {
      getAlldata();
      closeModal();
      showToastMessage("success", cusvisaInf.Message);
    } else {
      showToastMessage("error", cusvisaInf.Message);
    }
    document.getElementById("btnsubmitVisa").style.display = "block";
  };
  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2
          style={{
            textAlign: "center",
            margin: "3%",
            fontWeight: "bold",
            marginBottom: "2%",
          }}
        >
          REGISTER CUSTOMER VISA INFORMATION
        </h2>
        <Form className={styles.form} onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="form-group col-md-2">
              <label>Title</label>
              <select
                onChange={handleOnChange}
                className="form-select"
                name="title_type"
                id="title_type"
                required
              >
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Miss</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
            <div className="form-group col-md-3">
              <label>First Name</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="First Name"
                name="first_name"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-3">
              <label>Last Name</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="last_name"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-2">
              <label>Mobile</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Mobile"
                name="customer_mobile"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-2">
              <label>Select Sex</label>
              <select
                onChange={handleOnChange}
                className="form-select"
                name="sex"
                id="sex"
                required
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          {/* <div className="row mb-3">
            <div className="form-group col-md-3">
              <label>Passport Number</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Passport Number"
                id="passport_number"
                name="passport_number"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-3">
              <label>Birth Date</label>
              <Form.Control
                type="date"
                className="form-control"
                placeholder="Birth Date"
                name="birth_date"
                id="birth_date"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-3">
              <label>Passport Nationality</label>
              <Select
                value={passportNat}
                styles={{
                  menu: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
                options={countries}
                name="passport_nationality"
                id="passport_nationality"
                onChange={setPassportNat}
                required
              />
            </div>
            <div className="form-group col-md-3">
              <label>Expire Date</label>
              <Form.Control
                type="date"
                className="form-control"
                placeholder="Expire Date"
                name="expire_date"
                id="expire_date"
                onChange={handleOnChange}
                required
              />
            </div>
          </div> */}
          <div className="row mb-3">
            <div className="form-group col-md-4">
              <label>Select Visa</label>
              <Select
                value={visaVal}
                styles={{
                  menu: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
                name="visa_type"
                id="visa_type"
                options={visa}
                onChange={handleSelect}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Visa Amount</label>
              <Form.Control
                type="number"
                min="0"
                step="any"
                className="form-control"
                placeholder="Visa Amount"
                name="visa_amount"
                id="visa_amount"
                onChange={handleOnChange}
                // readOnly
                // disabled
              />
            </div>
            <div className="form-group col-md-4">
              <label>Net Amount</label>
              <Form.Control
                type="number"
                min="0"
                step="any"
                className="form-control"
                placeholder="Net Amount"
                name="net_amount"
                onChange={handleOnChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="form-group col-md-4">
              <label>Bank Accounts</label>
              <select
                className="form-select"
                name="bank_accounts"
                id="bank_accounts"
                onChange={handleOnChange}
                required
              >
                <option value="">Select Account</option>
                {bankaccountinformation.map((account, index) => (
                  <option key={index} value={account.bank_id}>
                    {account.bank_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-4">
              <label>Picture/ Image</label>
              <input
                type="file"
                accept=".png, .jpg, .jpeg, image/png, image/jpeg, image/jpg"
                className="form-control"
                placeholder="Picure/ Image"
                name="pic_image"
                id="pic_image"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Passaport/ PDF</label>
              <input
                type="file"
                accept="application/pdf"
                className="form-control"
                placeholder="Passaport/ PDF"
                name="pass_pdf"
                id="pass_pdf"
                onChange={handleOnChange}
                required
              />
            </div>
          </div>
          <div
            className="form-group col-md-6 mt-4"
            style={{ marginLeft: "35%" }}
          >
            <Button type="submit" id="btnsubmitVisa" className="btn btn-primary">
              <MdOutlineAirplaneTicket sx={{ mr: "10px" }} />
              Register
            </Button>

            <Button
              type="button"
              className="btn btn-danger"
              onClick={closeModal}
              style={{ marginLeft: "20%" }}
            >
              <AiFillCloseCircle /> Close
            </Button>
          </div>
        </Form>
      </ReactModal>
    </div>
  );
}

export default Modal;
