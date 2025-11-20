import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./components/Qarsafari/mainIndex";
import Gadanomvra from "./components/Qarsafari/gadanomvra";
import QarsafaiPage from "./components/Qarsafari/qarsafariNavigator";
import EqselisWakitxva from "./components/Qarsafari/eqselisWakitxva";
import EqselisPirveliEtapiWakitxva from "./components/Qarsafari/eqselisPirveliEtapiWakitxva";
import EtapiErtiNavigator from "./components/Qarsafari/etapiErtiNavigator";
import GadanomvraEtapiErti from "./components/Qarsafari/gadanomvraEtapiErti";
import EtapiOriNavigator from "./components/Qarsafari/etapiOriNavigator";
import VarjisFartebi from "./components/AdminPanel/varjisFarti";
import ExcelExport from "./components/AdminPanel/excelExport";
import QarsafariGroup from "./components/QarsafariGroup/qarsafariGroup";
import PhotoDateCheck from "./components/Qarsafari/photoDateCheck";
import ChromeBotPage from "./ChromBot/ChromeBotpage";
import PhotoSplit from "./PhotoSplit/PhotoSplit";
import WashlaFolderebisMdbsMixedvit from "./components/Qarsafari/washlaFolderebisMdbsMixedvit";
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/gadanomvra" element={<Gadanomvra />} />
      <Route path="/gadanomvraEtapiErti" element={<GadanomvraEtapiErti />} />
      <Route path="/qarsafariNavigator" element={<QarsafaiPage />} />
      <Route path="/eqselisWakitxva" element={<EqselisWakitxva />} />
      <Route path="/eqselisPirveliEtapiWakitxva" element={<EqselisPirveliEtapiWakitxva />} />
      <Route path="/etapiErtiNavigator" element= {<EtapiErtiNavigator /> }/>
      <Route path="/etapiOriNavigator" element= {<EtapiOriNavigator /> }/>
      <Route path="/SideBarPanel/Varjisfarti" element={<VarjisFartebi />} />
      <Route path="/SideBarPanel/ExcelExport" element={<ExcelExport />} />
      <Route path="/SideBarPanel/QarsafariGroup" element={<QarsafariGroup />} />
      <Route path="/photoDateCheck" element={<PhotoDateCheck />} />
      <Route path="/ChromBot/ChromeBotPage" element={<ChromeBotPage />} />
      <Route path="/PhotoSplit/PhotoSplit" element={<PhotoSplit />} />
      <Route path="/washlaFolderebisMdbsMixedvit" element={<WashlaFolderebisMdbsMixedvit />} />
    </Routes>
  );
}

export default App;
