import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/Qarsafari/qarsafariNavigator.css";

const QarsafaiPage = () => {
  return (
    <div className="Main">
      <Link className="back-button" to="/">
        &#8592; უკან
      </Link>
      
      <div className="second-level-container">
        <Link className="link" to="/etapiErtiNavigator">
          <div className="eqselis-wakitxva-background">
            <div className="text">დათვლების პირველი ეტაპი</div>
          </div>
        </Link>
      </div>
      <div className="second-level-container">
        <Link className="link" to="/etapiOriNavigator">
          <div className="eqselis-wakitxva-background">
            <div className="text">დათვლების მეორე ეტაპი</div>
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
      
      <div className="second-level-container">
        <Link className="link" to="/washlaFolderebisMdbsMixedvit">
          <div className="admin-panel-background">
            <div className="text" style={{ color: "Red" }}>
            ფოლდერების წაშლა MDB-ს მიხედვით 
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QarsafaiPage;
