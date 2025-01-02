import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Button, Form } from "react-bootstrap";
import { AiFillCloseCircle } from "react-icons/ai";
import styles from "./modal.module.scss";
import Select from "react-select";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { registerCargo } from "../../api/other";

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
  locationinformation,
  companyinformation,
  getAlldata,
}) {
  function closeModal() {
    setisOpen(!isOpen);
    setCargoInfo([]);
    setLocation([]);
  }
  useEffect(() => {
    var filter_location = [];
    locationinformation.map((loc, index) => {
      filter_location.push({
        value: loc.location_id,
        label: loc.location_code + " | " + loc.location_name,
      });
    });

    setLocation(filter_location);
  }, []);
  const [cargoInfo, setCargoInfo] = useState([]);
  var [location, setLocation] = useState([]);
  var [senderVal, setSender] = useState([]);
  var [receptVal, setRecept] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  if (!isOpen) return;
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setCargoInfo({ ...cargoInfo, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (senderVal.value === receptVal.value) {
      showToastMessage(
        "error",
        "Sender City and Recipient City cannot be same"
      );
      return;
    }
    if (
      parseFloat(cargoInfo.gross_amount) <= parseFloat(cargoInfo.net_amount)
    ) {
      showToastMessage("error", "Net amount must be less than Gross amount");
      return;
    }
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
    }
    var post = new FormData();
    post.append("action", "registerCargo");
    post.append("Sname", cargoInfo.sender_name);
    post.append("Sphone", cargoInfo.sender_phone);
    post.append("Scity", senderVal.value);
    post.append("Rname", cargoInfo.rec_name);
    post.append("Rphone", cargoInfo.rec_phone);
    post.append("Rcity", receptVal.value);
    post.append("CompanyID", cargoInfo.company);
    post.append("Weight", cargoInfo.weight);
    post.append("Desc", cargoInfo.desc);
    post.append("BankID", cargoInfo.bank_accounts);
    post.append("Gross", cargoInfo.gross_amount);
    post.append("Net", cargoInfo.net_amount);
    post.append("update", "0");
    var cusvisaInf = await registerCargo(post);
    // console.log(cusvisaInf);
    // return;
    if (cusvisaInf.status) {
      getAlldata();
      closeModal();
      showToastMessage("success", cusvisaInf.Message);
    } else {
      showToastMessage("error", cusvisaInf.Message);
    }
    setIsButtonDisabled(false);
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
          REGISTER CUSTOMER CARGO INFORMATION
        </h2>
        <Form className={styles.form} onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="form-group col-md-4">
              <label>Sener Name</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Sender Name"
                name="sender_name"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Sender Phone</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Sender Phone"
                name="sender_phone"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Sender City</label>
              <Select
                value={senderVal}
                styles={{
                  menu: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
                name="visa_type"
                id="visa_type"
                options={location}
                onChange={setSender}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="form-group col-md-4">
              <label>Recipient Name</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Recipient Name"
                name="rec_name"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Recipient Phone</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Recipient Phone"
                name="rec_phone"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label>Recipient City</label>
              <Select
                value={receptVal}
                styles={{
                  menu: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "black",
                  }),
                }}
                name="visa_type"
                id="visa_type"
                options={location}
                onChange={setRecept}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="form-group col-md-4">
              <label>Select Company</label>
              <select
                className="form-select"
                name="company"
                id="company"
                onChange={handleOnChange}
                required
              >
                <option value="">Select Company</option>
                {companyinformation.map((comp, index) => (
                  <option key={index} value={comp.company_id}>
                    {comp.company_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-3">
              <label>Weight</label>
              <Form.Control
                type="number"
                min="1"
                step="any"
                className="form-control"
                placeholder="Weight only Number"
                name="weight"
                id="weight"
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-5">
              <label>Description</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Descreption"
                name="desc"
                id="desc"
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
              <label>Gross Amount</label>
              <Form.Control
                type="number"
                min="0"
                step="any"
                className="form-control"
                placeholder="Gross Amount"
                name="gross_amount"
                id="gross_amount"
                onChange={handleOnChange}
                required
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
                id="net_amount"
                onChange={handleOnChange}
                required
              />
            </div>
          </div>
          <div
            className="form-group col-md-6 mt-4"
            style={{ marginLeft: "35%" }}
          >
            <Button type="submit" className="btn btn-primary" disabled={isButtonDisabled}>
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
