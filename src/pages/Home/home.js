import "./styles.css";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";

import HeroImg from "../../assets/images/heroImage1.png";
import { Link, useNavigate } from "react-router-dom";
import Button1 from "../../components/Button1/button1";

const Home = () => {
  const { isFetching, token } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="homeContainer">
      <Header />
      <div className="homeContent">
        <div className="heroContainer">
          <div className="imageContainer">
            <img src={HeroImg} />
          </div>
          <Button1
            name={"Go to Canvas"}
            func={() => {
              navigate("/canvas");
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
