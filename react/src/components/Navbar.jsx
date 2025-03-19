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
              <Link to="/category/fruits" className="dropdown-item">
                Fruits
              </Link>
              <Link to="/category/vegetables" className="dropdown-item">
                Vegetables
              </Link>
              <Link to="/category/dairy" className="dropdown-item">
                Dairy
              </Link>
              <Link to="/category/meats" className="dropdown-item">
                Meats
              </Link>
              <Link to="/category/seafood" className="dropdown-item">
                Seafood
              </Link>
              <Link to="/category/bread" className="dropdown-item">
                Bread
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Create Account Button */}
      <div className="navbar-right">
        <Link to="/createaccount" className="create-account-btn">
          Create Account
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/login" className="login-btn">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
