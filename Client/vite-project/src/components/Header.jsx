import styles from "./Header.module.css";

function Header() {
  return (
    <div className="container mt-5 text-center bg-light p-5 rounded-4 shadow-lg border border-2 border-primary-subtle">
      <h1 className="text-primary fw-bold mb-3">Hello ChatterBoxes! 💬</h1>
      <p className="text-secondary fs-5">Welcome to your cozy chat space 🌸</p>
    </div>
  );
}

export default Header;
