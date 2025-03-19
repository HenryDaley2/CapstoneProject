import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left Section - App Name */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Pure Picks
        </Link>
      </div>

      {/* Middle Section - About & Dropdown */}
      <div className="navbar-middle">
        <Link to="/about" className="nav-link">
          About
        </Link>

        {/* Dropdown Menu */}
        <div
          className="dropdown-container"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button className="dropdown-button">Menu ▼</button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/option1" className="dropdown-item">
                Fruits
              </Link>
              <Link to="/option2" className="dropdown-item">
                Vegetables
              </Link>
              <Link to="/option3" className="dropdown-item">
                Dairy
              </Link>
              <Link to="/option1" className="dropdown-item">
                Meats
              </Link>
              <Link to="/option2" className="dropdown-item">
                Seafood
              </Link>
              <Link to="/option3" className="dropdown-item">
                Bread
                </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
