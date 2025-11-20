import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/Qarsafari/qarsafariNavigator.css";

const EtapiOriNavigator = () => {
    return (
    <div>
        <header className="header"> მეორე ეტაპი II</header>
        <div className="Main">
            <Link className="back-button" to="/qarsafariNavigator">
                    &#8592; უკან
            </Link>
            
            <div className="second-level-container">
                <Link className="link" to="/eqselisWakitxva">
                    <div className="eqselis-wakitxva-background">
                        <div className="text">ექსელის წაკითხვა</div>
                    </div>
                </Link>
            </div>
            <div className="second-level-container">
                <Link className="link" to="/gadanomvra">
                    <div className="gadanomvra-background">
                        <div className="text">გადანომვრა</div>
                    </div>
                </Link>
            </div>

        </div>
    </div>
    )
}


export default EtapiOriNavigator