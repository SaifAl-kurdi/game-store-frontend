import {
  useEffect,
  useState,
} from "react";

import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const PAGE_SIZE = 4;


export default function ProductsPage() {
  const { logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();


    async function loadProducts() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get(
          "/products/",
          {
            params: {
              page,
              page_size: PAGE_SIZE,
              ...(location && { location }),
            },
            signal: controller.signal,
          }
        );

        if (!isActive) {
          return;
        }

        setProducts(response.data.results);
        setCount(response.data.count);
        setHasNextPage(Boolean(response.data.next));
      } catch (error) {
        if (
          !isActive ||
          error.code === "ERR_CANCELED"
        ) {
          return;
        }

        if (error.response?.status === 401) {
          setErrorMessage(
            "Your session has expired. Please sign in again."
          );
        } else {
          setErrorMessage(
            "Unable to load products. Please try again."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }


    loadProducts();


    return () => {
      isActive = false;
      controller.abort();
    };
  }, [page, location]);


  function handleLocationChange(event) {
    setLocation(event.target.value);
    setPage(1);
  }


  const totalPages = Math.max(
    1,
    Math.ceil(count / PAGE_SIZE)
  );


  return (
    <main className="app">
      <header className="page-header">
        <div>
          <span className="brand-label">
            Digital Marketplace
          </span>

          <h1>Products</h1>

          <p className="page-description">
            Browse digital items available in Jordan
            and Saudi Arabia.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={logout}
        >
          Sign out
        </button>
      </header>

      <section className="product-toolbar">
        <div>
          <strong>{count}</strong>{" "}
          {count === 1 ? "product" : "products"}
        </div>

        <label className="location-filter">
          <span>Location</span>

          <select
            value={location}
            onChange={handleLocationChange}
          >
            <option value="">
              All locations
            </option>

            <option value="JO">
              Jordan
            </option>

            <option value="SA">
              Saudi Arabia
            </option>
          </select>
        </label>
      </section>

      {isLoading && (
        <div
          className="status-message"
          role="status"
        >
          Loading products...
        </div>
      )}

      {errorMessage && (
        <div
          className="status-message error-message"
          role="alert"
        >
          <p>{errorMessage}</p>

          {errorMessage.includes("expired") && (
            <button
              type="button"
              onClick={logout}
            >
              Return to login
            </button>
          )}
        </div>
      )}

      {!isLoading &&
        !errorMessage &&
        products.length === 0 && (
          <div className="status-message">
            No products were found.
          </div>
        )}

      {!isLoading &&
        !errorMessage &&
        products.length > 0 && (
          <>
            <section className="product-grid">
              {products.map((product) => (
                <article
                  className="product-card"
                  key={product.id}
                >
                  <div className="product-card-top">
                    <span className="location-badge">
                      {product.location_name}
                    </span>

                    <span className="product-number">
                      #{product.id}
                    </span>
                  </div>

                  <h2>{product.title}</h2>

                  <p className="product-description">
                    {product.description}
                  </p>

                  <div className="product-price">
                    <span>Price</span>
                    <strong>{product.price}</strong>
                  </div>
                  <Link
                    className="details-link"
                    to={`/products/${product.id}`}
                  >
                    View details
                  </Link>
                </article>
              ))}
            </section>

            <nav
              className="pagination"
              aria-label="Product pagination"
            >
              <button
                type="button"
                disabled={page === 1 || isLoading}
                onClick={() => {
                  setPage((currentPage) =>
                    currentPage - 1
                  );
                }}
              >
                Previous
              </button>

              <span>
                Page <strong>{page}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>

              <button
                type="button"
                disabled={!hasNextPage || isLoading}
                onClick={() => {
                  setPage((currentPage) =>
                    currentPage + 1
                  );
                }}
              >
                Next
              </button>
            </nav>
          </>
        )}
    </main>
  );
}