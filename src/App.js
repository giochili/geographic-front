import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./components/Qarsafari/mainIndex";
import Gadanomvra from "./components/Qarsafari/gadanomvra";
import QarsafaiPage from "./components/Qarsafari/qarsafariNavigator";
import EqselisWakitxva from "./components/Qarsafari/eqselisWakitxva";
import VarjisFartebi from "./components/AdminPanel/varjisFarti";
import ExcelExport from "./components/AdminPanel/excelExport";
import QarsafariGroup from "./components/QarsafariGroup/qarsafariGroup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/gadanomvra" element={<Gadanomvra />} />
      <Route path="/qarsafariNavigator" element={<QarsafaiPage />} />
      <Route path="/eqselisWakitxva" element={<EqselisWakitxva />} />
      <Route path="/SideBarPanel/Varjisfarti" element={<VarjisFartebi />} />
      <Route path="/SideBarPanel/ExcelExport" element={<ExcelExport />} />
      <Route path="/SideBarPanel/QarsafariGroup" element={<QarsafariGroup />} />
    </Routes>
  );
}

export default App;
