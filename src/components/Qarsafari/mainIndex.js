import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/Qarsafari/mainIndex.css";

const MainPage = ({ cardDataArray }) => {
  return (
    <div className="main-container">
      <Link className="link" to="/qarsafariNavigator">
        <div className="cart-background">
          <div className="text">ქარსაფარი</div>
        </div>
      </Link>
    </div>
  );
};

export default MainPage;
