import "./styles.css";

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button1 from "../Button1/button1";
import { AuthContext } from "../../context/AuthContext";
import { signout } from "../../apicalls";

const Header = () => {
  const navigate = useNavigate();
  const { token, dispatch } = useContext(AuthContext);
  return (
    <div className="headerContainer">
      <div className="subContainer">
        <Link to="/">
          <button>
            <h3>MDesigns</h3>
          </button>
        </Link>
      </div>

      <div className="subContainer">
        {token ? (
          <Button1
            name={"All Canvases"}
            func={() => {
              navigate("/allcanvases");
            }}
          />
        ) : null}

        <Button1
          name={token ? "Logout" : "Sign In"}
          func={() => {
            if (!token) navigate("/signIn");
            else {
              signout(dispatch);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Header;
