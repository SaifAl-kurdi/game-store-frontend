import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../api/client";


export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();


    async function loadProduct() {
      setIsLoading(true);
      setErrorMessage("");
      setProduct(null);

      try {
        const response = await api.get(
          `/products/${productId}/`,
          {
            signal: controller.signal,
          }
        );

        if (isActive) {
          setProduct(response.data);
        }
      } catch (error) {
        if (
          !isActive ||
          error.code === "ERR_CANCELED"
        ) {
          return;
        }

        if (error.response?.status === 404) {
          setErrorMessage(
            "This product does not exist."
          );
        } else if (error.response?.status === 401) {
          setErrorMessage(
            "Your session has expired. Please sign in again."
          );
        } else {
          setErrorMessage(
            "Unable to load the product."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }


    loadProduct();


    return () => {
      isActive = false;
      controller.abort();
    };
  }, [productId]);


  async function handleBuy() {
    if (!product || isBuying) {
      return;
    }

    setIsBuying(true);
    setErrorMessage("");

    try {
      const response = await api.post(
        "/orders/",
        {
          product_id: product.id,
        }
      );

      navigate(
        `/receipts/${response.data.receipt_number}`
      );
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage(
          "Your session has expired. Please sign in again."
        );
      } else {
        setErrorMessage(
          "The purchase could not be completed."
        );
      }
    } finally {
      setIsBuying(false);
    }
  }


  if (isLoading) {
    return (
      <main className="app">
        <div
          className="status-message"
          role="status"
        >
          Loading product...
        </div>
      </main>
    );
  }


  /*
   * This check is important.
   * It prevents product.location_name from being
   * accessed when product is null.
   */
  if (!product) {
    return (
      <main className="app">
        <div
          className="status-message error-message"
          role="alert"
        >
          <p>
            {errorMessage ||
              "The product could not be loaded."}
          </p>

          <Link to="/products">
            Return to products
          </Link>
        </div>
      </main>
    );
  }


  return (
    <main className="app">
      <Link
        className="back-link"
        to="/products"
      >
        ← Back to products
      </Link>

      <section className="product-details">
        <div className="product-card-top">
          <span className="location-badge">
            {product.location_name}
          </span>

          <span className="product-number">
            #{product.id}
          </span>
        </div>

        <h1>{product.title}</h1>

        <p className="product-description">
          {product.description}
        </p>

        <div className="details-price">
          <div>
            <span>Price</span>
            <strong>{product.price}</strong>
          </div>

          <button
            className="buy-button"
            type="button"
            disabled={isBuying}
            onClick={handleBuy}
          >
            {isBuying
              ? "Processing..."
              : "Buy now"}
          </button>
        </div>

        {errorMessage && (
          <div
            className="error-message purchase-error"
            role="alert"
          >
            {errorMessage}
          </div>
        )}
      </section>
    </main>
  );
}