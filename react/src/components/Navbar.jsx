import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch Cart Count
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    const user = localStorage.getItem("user");
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:3000/cart?user=${user}`);
      const cartItems = await response.json();
      setCartCount(cartItems.length);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
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
          </div>
        </div>
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
          🛒 Cart <span className="cart-count">{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
