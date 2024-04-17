import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/Qarsafari/mainIndex.css";

const MainPage = ({ cardDataArray }) => {
  return (
    <div className="main-container main-index-container">
      <Link className="link" to="/qarsafariNavigator">
        <div className="cart-background">
          <div className="text">ქარსაფარი</div>
        </div>
      </Link>
      <Link className="link" to="/SideBarPanel/Varjisfarti">
        <div className="cart-background">
          <div className="text">Sidebar</div>
        </div>
      </Link>
      <Link className="link" to="/ChromBot/ChromeBotPage">
        <div className="cart-background">
          <div className="text">ქრომ ბოტი</div>
        </div>
      </Link>
    </div>
  );
};

export default MainPage;
