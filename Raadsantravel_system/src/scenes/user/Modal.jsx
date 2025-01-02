import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { handleModal, setCurrentUserInfo } from "../../feature/userSlice";
import { Button, Form } from "react-bootstrap";
import { AiFillEdit, AiFillCloseCircle } from "react-icons/ai";
import styles from "./modal.module.scss";
import { updateUser } from "../../api/userapi";

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
function Modal({ showToastMessage, getuserInfo }) {
  const dispatch = useDispatch();
  const { isOpen, currentuserinformation, userloginfo } = useSelector(
    (store) => store.userReducer
  );
  function closeModal() {
    dispatch(handleModal());
    dispatch(setCurrentUserInfo([]));
    setCurrentUserInformation({});
  }
  useEffect(() => {
    setCurrentUserInformation({
      userid: currentuserinformation.userid,
      user_fullname: currentuserinformation.user_fullname,
      username: currentuserinformation.username,
      userpassword: currentuserinformation.userpassword,
      usertype: currentuserinformation.usertype,
      user_status: "0",
    });
  }, [currentuserinformation]);

  const [currentUser, setCurrentUserInformation] = useState({
    userid: currentuserinformation.userid,
    user_fullname: currentuserinformation.user_fullname,
    username: currentuserinformation.username,
    userpassword: currentuserinformation.userpassword,
    usertype: currentuserinformation.usertype,
    user_status: "0",
  });
  if (currentuserinformation.length === 0) return;

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setCurrentUserInformation({ ...currentUser, [name]: value });
    // if (name === "usertype") {
    //   console.log(value);
    //   document.getElementById("usertype").value = value;
    // }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(currentUser);
    // if (currentUser.user_status === 0 || currentUser.user_status === "0") {
    //   showToastMessage("error", "Select Status");
    //   return;
    // }
    var post = new FormData();
    post.append("action", "updateUser");
    post.append("UserID", currentUser.userid);
    post.append("UserFullname", currentUser.user_fullname);
    post.append("Username", currentUser.username);
    post.append("UserPassword", currentUser.userpassword);
    post.append("UserType", currentUser.usertype);
    post.append("UserStatus", currentUser.user_status);

    var userinfo = await updateUser(post);
    if (userinfo.status) {
      closeModal();
      showToastMessage("success", userinfo.Message);
      getuserInfo();
    } else {
      showToastMessage("error", userinfo.Message);
    }
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
          UPDATE USER INFORMATION
        </h2>
        <Form className={styles.form} onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="form-group col-md-6">
              <label>Full Name</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Full Name"
                name="user_fullname"
                value={currentUser.user_fullname}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label>User Type</label>
              <Form.Select
                className="form-control"
                placeholder="Status"
                name="usertype"
                id="usertype"
                onChange={handleOnChange}
                required
                // value={currentuserinformation.usertype}
              >
                <option value="">Select Type</option>
                {userloginfo.usertype === "Developer" ? (
                  <>
                    <option value="Admin">Admin</option>
                    <option value="Administrator">Administrator</option>
                  </>
                ) : (
                  ""
                )}
                {userloginfo.usertype === "Administrator" ? (
                  <option value="Admin">Admin</option>
                ) : (
                  ""
                )}
              </Form.Select>
            </div>
          </div>
          <div className="row mb-3">
            <div className="form-group col-md-6">
              <label>Username</label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Username"
                name="username"
                value={currentUser.username}
                onChange={handleOnChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label>Password</label>
              <Form.Control
                type="password"
                className="form-control"
                placeholder="Password"
                name="userpassword"
                value={currentUser.userpassword}
                onChange={handleOnChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="form-group col-md-6">
              <label>Status</label>
              <Form.Select
                className="form-control"
                placeholder="Status"
                name="user_status"
                onChange={handleOnChange}
                required
                // value={currentuserinformation.marketer_status}
              >
                <option value="">Select One</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </div>
            <div
              className="form-group col-md-6 mt-4 "
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button type="submit" className="btn btn-primary">
                <AiFillEdit /> Update
              </Button>

              <Button
                type="button"
                className="btn btn-danger"
                onClick={closeModal}
                style={{ marginLeft: "15%" }}
              >
                <AiFillCloseCircle /> Close
              </Button>
            </div>
          </div>
        </Form>
      </ReactModal>
    </div>
  );
}

export default Modal;
