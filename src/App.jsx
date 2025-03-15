import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage"; 
import RankingPage from "./RankingPage"; 
import Single from "./single";
import WinnerPage from "./WinerPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/single" element={<Single />} />
        <Route path="/winner" element={<WinnerPage />} /> 
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
    </Router>
  );
}

export default App;