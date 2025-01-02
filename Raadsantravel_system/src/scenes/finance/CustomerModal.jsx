import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { AiFillCloseCircle } from "react-icons/ai";
import styles from "./modal.module.scss";
import { getBankAccount, registerCustomerPay } from "../../api/financeapi";
import { setBankAccountInfo, handleModal } from "../../feature/userSlice";
import PaidIcon from "@mui/icons-material/Paid";

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
function Modal({ showToastMessage, getcustomerInfo, customerInfoModal }) {
  const { isOpen, bankaccountinformation,userloginfo } = useSelector(
    (store) => store.userReducer
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    getbankAccountinfo();
  }, []);
  const getbankAccountinfo = async () => {
    var bankaccountinfo = await getBankAccount();
    dispatch(setBankAccountInfo(bankaccountinfo.Message));
  };

  function closeModal() {
    dispatch(handleModal());
  }
  // if (currentProductInfo.length === 0) return;
  if (customerInfoModal.length === 0) return;

  const handleSubmit = async (event) => {
    event.preventDefault();

    var account_type = document.getElementById("account_type").value;
    var price = document.getElementById("price").value;
    if (parseFloat(price) > customerInfoModal.customer_due) {
      showToastMessage("error", "Lacagta uu bixinaayo waa in ay ka yaraataa deynta lagu leeyahay");
      return;
    }
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
      }
      var post = new FormData();
      post.append("action", "registerCustomerPay");
      post.append("CustomerID", customerInfoModal.customer_id);
      post.append("AccountType", account_type);
      post.append("SelledBy", userloginfo.userid);
      post.append("Money", price);
      var customerpayinfo = await registerCustomerPay(post);
      if (customerpayinfo.status) {
        closeModal();
        showToastMessage("success", customerpayinfo.Message);
        getcustomerInfo();
      } else {
        showToastMessage("error", customerpayinfo.Message);
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
          Customer Pay
        </h2>

        <Form className={styles.form} onSubmit={handleSubmit}>
          <div className="row">
            <div className="form-group col-12 mb-3">
              <label>Choose Account</label>
              <select
                className="form-select"
                name="account_type"
                id="account_type"
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
          </div>

          <div className="row">
            <div className="form-group col-12 mb-3">
              <label>Paying Price</label>
              <Form.Control
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                placeholder="Price"
                name="price"
                id="price"
                required
              />
            </div>
          </div>
          <div
            className="form-group col-md-12 mt-4"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button type="submit" className="btn btn-primary" disabled={isButtonDisabled}>
              <PaidIcon /> Pay
            </Button>

            <Button
              type="button"
              onClick={closeModal}
              className="btn btn-danger"
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
