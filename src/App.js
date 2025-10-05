import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar"; 
import Home from "./components/Home";
import SummaryPage from "./components/SummaryPage";
import "./testConnections.js"; // Add connection tests
import "./App.css";

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/summary/:accession" element={<SummaryPage />} />
      </Routes>
    </Router>
  );
};

export default App;