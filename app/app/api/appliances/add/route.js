// POST /api/appliances/add
// adds a new appliance, and creates a user row first if no user with this
// email exists yet (1 user -> many appliances relationship).
import pool from "../../../../lib/db";
import { sanitizePayload } from "../../../../lib/sanitize";
import { validateAppliancePayload } from "../../../../lib/validation";

export async function POST(request) {
  try {
    // sanitise + validate before touching the db
    const body = sanitizePayload(await request.json());
    const errors = validateAppliancePayload(body, true);

    if (Object.keys(errors).length > 0) {
      return Response.json(
        { message: "Validation failed.", errors },
        { status: 400 }
      );
    }

    // serial_number is UNIQUE so we reject duplicates up front.
    // using ? placeholders keeps user input out of the SQL string (prevents injection).
    const [existingAppliance] = await pool.query(
      "SELECT appliance_id FROM appliances WHERE serial_number = ?",
      [body.serialNumber]
    );
    if (existingAppliance.length > 0) {
      return Response.json(
        { message: "Appliance already exists." },
        { status: 409 }
      );
    }

    // re-use the user row if one already exists with this email,
    // otherwise insert a new one and remember the new id.
    const [existingUser] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [body.email]
    );

    let userId;
    if (existingUser.length > 0) {
      userId = existingUser[0].user_id;
    } else {
      const [userInsert] = await pool.query(
        `INSERT INTO users (first_name, last_name, address, mobile, email, eircode)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          body.firstName,
          body.lastName,
          body.address,
          body.mobile,
          body.email,
          body.eircode,
        ]
      );
      userId = userInsert.insertId;
    }

    await pool.query(
      `INSERT INTO appliances
      (user_id, appliance_type, brand, model_number, serial_number, purchase_date, warranty_expiration_date, cost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        body.applianceType,
        body.brand,
        body.modelNumber,
        body.serialNumber,
        body.purchaseDate,
        body.warrantyExpirationDate,
        body.cost,
      ]
    );

    return Response.json({ message: "New appliance added successfully." });
  } catch (error) {
    return Response.json(
      { message: "Failed to add appliance." },
      { status: 500 }
    );
  }
}
