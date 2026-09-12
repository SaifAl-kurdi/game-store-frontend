import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";


export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      await login(username.trim(), password);

      navigate("/products", {
        replace: true,
      });
    } catch (error) {
      const backendMessage =
        error.response?.data?.detail;

      setErrorMessage(
        backendMessage ||
        "Unable to connect to the server."
      );
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-heading">
          <span className="brand-label">
            Digital Marketplace
          </span>

          <h1>Game Store</h1>

          <p>
            Sign in to browse and purchase digital items.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="username">
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            autoComplete="username"
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            autoComplete="current-password"
            required
          />

          {errorMessage && (
            <p
              className="error-message"
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}