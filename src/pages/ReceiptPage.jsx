import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../api/client";


export default function ReceiptPage() {
  const { receiptNumber } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    // This declaration was missing.
    let isActive = true;

    const controller = new AbortController();


    async function loadReceipt() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get(
          `/orders/${receiptNumber}/`,
          {
            signal: controller.signal,
          }
        );

        if (isActive) {
          setOrder(response.data);
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
            "This receipt does not exist."
          );
        } else if (error.response?.status === 401) {
          setErrorMessage(
            "Your session has expired. Please sign in again."
          );
        } else {
          setErrorMessage(
            "Unable to load this receipt."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }


    loadReceipt();


    return () => {
      isActive = false;
      controller.abort();
    };
  }, [receiptNumber]);


  if (isLoading) {
    return (
      <main className="app">
        <div
          className="status-message"
          role="status"
        >
          Loading receipt...
        </div>
      </main>
    );
  }


  if (!order) {
    return (
      <main className="app">
        <div
          className="status-message error-message"
          role="alert"
        >
          <p>
            {errorMessage ||
              "The receipt could not be loaded."}
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
      <section className="receipt-card">
        <span className="success-label">
          Purchase successful
        </span>

        <h1>Your receipt</h1>

        <div className="receipt-row">
          <span>Receipt number</span>
          <strong>{order.receipt_number}</strong>
        </div>

        <div className="receipt-row">
          <span>Product</span>
          <strong>{order.product_title}</strong>
        </div>

        <div className="receipt-row">
          <span>Location</span>
          <strong>{order.product_location}</strong>
        </div>

        <div className="receipt-row">
          <span>Price</span>
          <strong>{order.unit_price}</strong>
        </div>

        <div className="receipt-row">
          <span>Purchased at</span>
          <strong>
            {new Date(
              order.purchased_at
            ).toLocaleString()}
          </strong>
        </div>

        <Link
          className="primary-link"
          to="/products"
        >
          Continue shopping
        </Link>
      </section>
    </main>
  );
}