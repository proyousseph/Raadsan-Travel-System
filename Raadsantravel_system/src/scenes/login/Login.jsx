import React, { useState } from "react";
// import ReactDOM from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import userstore from "../../reducers/user";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";
import App from "../../App";
import "./style.css";
import { checkUserLogin, isLogin } from "../../api/userapi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUserLogInfo } from "../../feature/userSlice";

function Login({ root }) {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isloading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmitLogin = async (event) => {
    setLoading(true);
    event.preventDefault();
    var user = await checkUserLogin(userName, userPassword);
    // console.log(user,"UUU")
    if (user.status === true) {
      dispatch(setUserLogInfo(user.Message[0]));
        showToastMessage("success", "Successfully logged in.");

        root.render(
          <React.StrictMode>
            <BrowserRouter>
              <Provider store={userstore}>
                <App root={root} />
              </Provider>
            </BrowserRouter>
          </React.StrictMode>
        );

        //user different pages
        if (user.Message[0].usertype === "Developer") navigate("/");
        else if (user.Message[0].usertype === "Administrator")
          navigate("/");
      // if (user.Message[0].islogin === "1") {
      //   showToastMessage(
      //     "error",
      //     "The system is already logged in by other user"
      //   );
      //   setLoading(false);
      // } else {
      //   // await isLogin();
        
      // }
    } else {
      showToastMessage("error", "Username or password is incorrect");
      setLoading(false);
    }
  };
  const showToastMessage = (type, message) => {
    toast(message, {
      type: type,
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  var bodyreturn = "";

  if (isloading) {
    bodyreturn = <Loading />;
  } else {
    bodyreturn = (
      <form
        className="login100-form validate-form"
        onSubmit={handleSubmitLogin}
      >
        <div
          className="wrap-input100 validate-input m-b-26"
          data-validate="Username is required"
        >
          <span className="label-input100">Username</span>
          <input
            className="input100"
            type="text"
            onChange={(event) => setUserName(event.target.value)}
            placeholder="Enter username"
            required
          />
          <span className="focus-input100"></span>
        </div>

        <div
          className="wrap-input100 validate-input m-b-18"
          data-validate="Password is required"
        >
          <span className="label-input100">Password</span>
          <input
            className="input100"
            type="password"
            placeholder="Enter password"
            onChange={(event) => setUserPassword(event.target.value)}
            required
          />
          <span className="focus-input100"></span>
        </div>

        <div className="container-login100-form-btn">
          <button className="login100-form-btn">Login</button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <ToastContainer />
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div
              className="login100-form-title"
              // style="background-image: url(images/bg-01.jpg);"
              style={{ backgroundImage: 'url("../assets/bg-01.jpg")' }}
              // style={{ backgroundImage: 'url("../assets/airline5g.jpg")' }}
            >
              <span className="login100-form-title-1">Log In</span>
            </div>

            {bodyreturn}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
