import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./components/Qarsafari/mainIndex";
import Gadanomvra from "./components/Qarsafari/gadanomvra";
import QarsafaiPage from "../src/components/Qarsafari/qarsafariNavigator";
import EqselisWakitxva from "./components/Qarsafari/eqselisWakitxva";
import SideBarPanel from "./components/AdminPanel/sideBarPanel";
import VarjisFartebi from "./components/AdminPanel/varjisFarti";
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/gadanomvra" element={<Gadanomvra />} />
      <Route path="/qarsafariNavigator" element={<QarsafaiPage />} />
      <Route path="/eqselisWakitxva" element={<EqselisWakitxva />} />
      <Route path="/SideBarPanel" element={<SideBarPanel />} />
      <Route path="/Varjisfarti" element={<VarjisFartebi />} />
    </Routes>
  );
}

export default App;
