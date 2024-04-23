import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/Qarsafari/qarsafariNavigator.css";

const QarsafaiPage = ({ cardDataArray }) => {
  return (
    <div className="Main">
      <Link className="back-button" to="/">
        &#8592; უკან
      </Link>
      <div className="second-level-container">
        <Link className="link" to="/gadanomvra">
          <div className="gadanomvra-background">
            <div className="text">გადანომვრა</div>
          </div>
        </Link>
      </div>
      <div className="second-level-container">
        <Link className="link" to="/eqselisWakitxva">
          <div className="eqselis-wakitxva-background">
            <div className="text">ექსელის წაკითხვა</div>
          </div>
        </Link>
      </div>
      <div className="second-level-container">
        <Link className="link" to="/photoDateCheck">
          <div className="photo-date-check-background">
            <div className="text" style={{ color: "black" }}>
              ფოტო/დეითის შემოწმება
            </div>
          </div>
        </Link>
      </div>
      <div className="second-level-container">
        <Link className="link" to="/PhotoSplit/PhotoSplit">
          <div className="photo-split-background">
            <div className="text" style={{ color: "black" }}>
            ფოტოების დახარისხება (სახელმწიფო\კერძო)
            </div>
          </div>
        </Link>
      </div>
      <div className="second-level-container">
        <Link className="link" to="/SideBarPanel/Varjisfarti">
          <div className="admin-panel-background">
            <div className="text" style={{ color: "black" }}>
            ადმინკა
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QarsafaiPage;
