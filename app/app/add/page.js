// Add Appliance page - form for creating a user (if new) and an appliance.
// Marked "use client" because the form uses useState and an onSubmit handler.
"use client";

import Link from "next/link";
import { useState } from "react";

const initialForm = {
  firstName: "",
  lastName: "",
  address: "",
  mobile: "",
  email: "",
  eircode: "",
  applianceType: "Washing Machine",
  brand: "",
  modelNumber: "",
  serialNumber: "",
  purchaseDate: "",
  warrantyExpirationDate: "",
  cost: "",
};

export default function AddPage() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // send the form to the Add API. server returns either a success message
  // or a list of validation errors that we render below the form.
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setErrors({});

    const response = await fetch("/api/appliances/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Could not add appliance.");
      setErrors(data.errors || {});
      return;
    }

    setMessage(data.message);
    setForm(initialForm);
  }

  return (
    <main className="container">
      <h1>Add Appliance</h1>
      <p className="subtitle">Enter user and appliance details.</p>

      <form className="card form-grid" onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            pattern="[A-Za-z\s'-]{2,50}"
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            pattern="[A-Za-z\s'-]{2,50}"
            required
          />
        </label>
        <label>
          Address
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            pattern="[A-Za-z0-9\s,.'#-]{5,255}"
            required
          />
        </label>
        <label>
          Mobile
          <input
            type="tel"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            pattern="\+?[0-9\s-]{7,20}"
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Eircode
          <input
            type="text"
            value={form.eircode}
            onChange={(e) => setForm({ ...form, eircode: e.target.value })}
            pattern="[A-Za-z0-9\s]{3,8}"
            required
          />
        </label>
        <label>
          Appliance Type
          <select
            value={form.applianceType}
            onChange={(e) => setForm({ ...form, applianceType: e.target.value })}
          >
            <option>Washing Machine</option>
            <option>Dishwasher</option>
            <option>Fridge</option>
            <option>Oven</option>
            <option>Microwave</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Brand
          <input
            type="text"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            pattern="[A-Za-z0-9\s-]{2,50}"
            required
          />
        </label>
        <label>
          Model Number
          <input
            type="text"
            value={form.modelNumber}
            onChange={(e) => setForm({ ...form, modelNumber: e.target.value })}
            pattern="[A-Za-z0-9-]{2,50}"
            required
          />
        </label>
        <label>
          Serial Number
          <input
            type="text"
            value={form.serialNumber}
            onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
            pattern="[A-Za-z0-9-]{3,50}"
            required
          />
        </label>
        <label>
          Purchase Date
          <input
            type="date"
            value={form.purchaseDate}
            onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
            required
          />
        </label>
        <label>
          Warranty Expiration Date
          <input
            type="date"
            value={form.warrantyExpirationDate}
            onChange={(e) =>
              setForm({ ...form, warrantyExpirationDate: e.target.value })
            }
            required
          />
        </label>
        <label>
          Cost of Appliance
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            required
          />
        </label>

        <button type="submit">Add</button>
      </form>

      {message && <p className="message">{message}</p>}
      {Object.keys(errors).length > 0 && (
        <ul className="errors">
          {Object.values(errors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <Link className="home-link" href="/">
        Back to homepage
      </Link>
    </main>
  );
}
