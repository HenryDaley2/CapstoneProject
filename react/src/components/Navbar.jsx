import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = (props) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Retrieve user from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // Redirects to home page

    // Force a reload to refresh the home page
    window.location.reload();
  };

  return (
    <nav className="navbar">
      {/* Left Section - Logo */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Pure Picks
        </Link>
      </div>

      {/* Middle Section - Menu & About */}
      <div className="navbar-middle">
        <Link to="/about" className="nav-link">
          About
        </Link>
      </div>

      {/* Right Section - Login, Account, and Cart */}
      <div className="navbar-right">
        {user ? (
          <>
            <span className="welcome-text">Welcome, {user.username}!</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/create-account" className="create-account-btn">
              Create Account
            </Link>
            <Link to="/login" className="login-btn">
              Login
            </Link>
          </>
        )}

        {/* Cart Button */}
        <Link to="/cart" className="cart-btn">
          🛒 Cart{" "}
          <span className="cart-count">{props.numberOfItemsInCart}</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
