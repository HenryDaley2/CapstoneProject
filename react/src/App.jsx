import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import "./App.css";
import Products from "./assets/Products.json";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home data={Products} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
