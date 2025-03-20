import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Save user data
        navigate("/"); // ✅ Redirect to home page

        // ✅ Force a reload to refresh the home page
        window.location.reload();
      } else {
        setErrors({ general: data.message || "Invalid credentials" });
      }
    } catch (error) {
      setErrors({ general: "Failed to connect to server" });
    }
  };

  return (
    <div className="account-container">
      <h1>Login</h1>
      <form className="account-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>

        {errors.general && <p className="error">{errors.general}</p>}
      </form>
    </div>
  );
};

export default Login;
