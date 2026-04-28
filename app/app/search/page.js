// Search Appliance page - look up by serial number and show the
// appliance + the owner's user info (joined on user_id).
"use client";

import Link from "next/link";
import { useState } from "react";

export default function SearchPage() {
  const [serialNumber, setSerialNumber] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setResult(null);

    const response = await fetch(
      `/api/appliances/search?serialNumber=${encodeURIComponent(serialNumber)}`
    );
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "No matching appliance found!");
      return;
    }

    setResult(data.appliance);
  }

  return (
    <main className="container">
      <h1>Search Appliance</h1>
      <p className="subtitle">Search by serial number.</p>

      <form className="card" onSubmit={handleSubmit}>
        <label>
          Serial Number
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            pattern="[A-Za-z0-9-]{3,50}"
            required
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {message && <p className="message">{message}</p>}

      {result && (
        <section className="card result">
          <h2>Appliance Details</h2>
          <p>Appliance ID: {result.appliance_id}</p>
          <p>User ID: {result.user_id}</p>
          <p>Name: {result.first_name} {result.last_name}</p>
          <p>Address: {result.address}</p>
          <p>Mobile: {result.mobile}</p>
          <p>Email: {result.email}</p>
          <p>Eircode: {result.eircode}</p>
          <p>Type: {result.appliance_type}</p>
          <p>Brand: {result.brand}</p>
          <p>Model Number: {result.model_number}</p>
          <p>Serial Number: {result.serial_number}</p>
          <p>Purchase Date: {result.purchase_date}</p>
          <p>Warranty Expiration Date: {result.warranty_expiration_date}</p>
          <p>Cost: €{result.cost}</p>
        </section>
      )}

      <Link className="home-link" href="/">
        Back to homepage
      </Link>
    </main>
  );
}
