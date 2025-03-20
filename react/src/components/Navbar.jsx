import { Link } from "react-router-dom";

const Navbar = () => {
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

        <div className="dropdown-container">
          <button className="dropdown-button">Menu ▼</button>
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
        </div>
      </div>

      {/* Right Section - Login & Create Account */}
      <div className="navbar-right">
        <Link to="/create-account" className="create-account-btn">
          Create Account
        </Link>
        <Link to="/login" className="login-btn">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
