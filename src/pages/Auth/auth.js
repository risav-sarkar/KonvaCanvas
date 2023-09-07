import "./styles.css";

import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import Input from "../../components/Input/input";
import Button2 from "../../components/Button2/button2";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { login, register } from "../../apicalls";
import { toast } from "react-toastify";

const Auth = ({ type }) => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [signinFields, setSignInFields] = useState({
    email: "",
    password: "",
  });
  const [registerFields, setRegisterFields] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    country: "",
  });

  const HandleSubmit = async () => {
    if (type === "Signin") login(signinFields, dispatch, navigate, toast);
    else {
      let obj = { ...registerFields };
      if (registerFields.password !== registerFields.password2) return;

      delete obj.password2;
      register(obj, dispatch, navigate, toast);
    }
  };

  return (
    <div className="authContainer">
      <Header />
      <div className="authContent">
        <form
          className="formContainer shadow"
          onSubmit={(e) => {
            e.preventDefault();
            HandleSubmit();
          }}
        >
          <h3 className="header1">Welcome Back</h3>
          <p className="header2">Please enter your details</p>

          <div className="inputsContainer">
            {type === "Signin" ? (
              <>
                <Input
                  label={"Email"}
                  type={"email"}
                  placeholder={"abc@g.com"}
                  objectKey={"email"}
                  state={signinFields}
                  setState={setSignInFields}
                />
                <Input
                  label={"Password"}
                  type={"password"}
                  placeholder={"*****"}
                  objectKey={"password"}
                  state={signinFields}
                  setState={setSignInFields}
                />
              </>
            ) : (
              <>
                <Input
                  label={"First Name"}
                  type={"text"}
                  placeholder={"John"}
                  objectKey={"first_name"}
                  state={registerFields}
                  setState={setRegisterFields}
                />
                <Input
                  label={"Last Name"}
                  type={"text"}
                  placeholder={"Doe"}
                  objectKey={"last_name"}
                  state={registerFields}
                  setState={setRegisterFields}
                />
                <Input
                  label={"Email"}
                  type={"email"}
                  placeholder={"abc@g.com"}
                  objectKey={"email"}
                  state={registerFields}
                  setState={setRegisterFields}
                />
                <Input
                  label={"Password"}
                  type={"password"}
                  placeholder={"*****"}
                  objectKey={"password"}
                  state={registerFields}
                  setState={setRegisterFields}
                />
                <Input
                  label={"Confirm Password"}
                  type={"password"}
                  placeholder={"*****"}
                  objectKey={"password2"}
                  state={registerFields}
                  setState={setRegisterFields}
                />
                <Input
                  label={"Country"}
                  type={"text"}
                  placeholder={"India"}
                  objectKey={"country"}
                  state={registerFields}
                  setState={setRegisterFields}
                />
              </>
            )}

            <Button2
              name={type === "Signin" ? "Sign In" : "Register"}
              func={() => {}}
            />

            <div className="redirectMessage">
              <p>
                {type === "Signin"
                  ? "Not registered yet?"
                  : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (type === "Signin") navigate("/register");
                  else navigate("/signin");
                }}
              >
                {type === "Signin" ? "Register" : "Sign In"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
