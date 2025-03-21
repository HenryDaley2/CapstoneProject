import "../App.css";

const About = () => {
  return (
    <div className="about-container">
      <h1>About Pure Picks</h1>
      <p>
        Welcome to <strong>Pure Picks</strong> — your go-to online grocery store
        built with care and code. Our platform was created to deliver a smooth
        and responsive experience for browsing, searching, and purchasing fresh
        produce, meats, seafood, and more.
      </p>

      <h3>What You Can Do</h3>
      <ul>
        <li>🔍 Search and filter grocery items by name or type</li>
        <li>🛒 Add products to your cart and manage quantities</li>
        <li>✅ Create an account, login, and securely check out</li>
        <li>📸 View dynamic images powered by the Unsplash API</li>
      </ul>

      <h3>Built With</h3>
      <ul>
        <li>⚛️ React (Vite) — frontend UI and routing</li>
        <li>🖥️ Express & Node.js — RESTful API backend</li>
        <li>🌱 MongoDB — storing users, products, and cart data</li>
        <li>📷 Unsplash API — product imagery</li>
      </ul>

      <p>
        Whether you're shopping for dinner or just testing out the tech, Pure
        Picks delivers a seamless user experience from login to checkout.
      </p>

      <p>Thanks for visiting! </p>
    </div>
  );
};

export default About;
