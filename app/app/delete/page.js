// Delete Appliance page - two-step flow:
// 1) look up by serial number, show the appliance for confirmation
// 2) on confirm, call the same DELETE endpoint with confirmDelete=true
"use client";

import Link from "next/link";
import { useState } from "react";

export default function DeletePage() {
  const [serialNumber, setSerialNumber] = useState("");
  const [message, setMessage] = useState("");
  const [foundAppliance, setFoundAppliance] = useState(null);

  async function handleLookup(event) {
    event.preventDefault();
    setMessage("");
    setFoundAppliance(null);

    const response = await fetch("/api/appliances/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serialNumber, confirmDelete: false }),
    });
    const data = await response.json();

    if (!response.ok && !data.appliance) {
      setMessage(data.message || "No matching appliance found!");
      return;
    }

    setMessage(data.message);
    setFoundAppliance(data.appliance || null);
  }

  async function handleDelete() {
    const response = await fetch("/api/appliances/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serialNumber, confirmDelete: true }),
    });
    const data = await response.json();
    setMessage(data.message);
    setFoundAppliance(null);
    setSerialNumber("");
  }

  return (
    <main className="container">
      <h1>Delete Appliance</h1>
      <p className="subtitle">Find an appliance and confirm deletion.</p>

      <form className="card" onSubmit={handleLookup}>
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
        <button type="submit">Find Appliance</button>
      </form>

      {message && <p className="message">{message}</p>}

      {foundAppliance && (
        <section className="card result">
          <h2>Confirm Deletion</h2>
          <p>Appliance ID: {foundAppliance.appliance_id}</p>
          <p>Type: {foundAppliance.appliance_type}</p>
          <p>Brand: {foundAppliance.brand}</p>
          <button className="danger" type="button" onClick={handleDelete}>
            Confirm Delete
          </button>
        </section>
      )}

      <Link className="home-link" href="/">
        Back to homepage
      </Link>
    </main>
  );
}
