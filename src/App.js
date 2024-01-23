import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./components/Qarsafari/mainIndex";
import Qarsafari from "./components/Qarsafari/qarsafari";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/qarsafari" element={<Qarsafari />} />
    </Routes>
  );
}

export default App;
