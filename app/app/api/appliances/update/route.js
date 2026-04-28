// PUT /api/appliances/update
// looks up the appliance by serial_number, then updates both the user row
// (user info) and the appliance row (everything except the unique ids).
import pool from "../../../../lib/db";
import { sanitizePayload } from "../../../../lib/sanitize";
import { validateAppliancePayload } from "../../../../lib/validation";

export async function PUT(request) {
  try {
    // same sanitise + validate flow as Add
    const body = sanitizePayload(await request.json());
    const errors = validateAppliancePayload(body, true);

    if (Object.keys(errors).length > 0) {
      return Response.json(
        { message: "Validation failed.", errors },
        { status: 400 }
      );
    }

    // find the appliance and its owner's user_id from the serial
    const [applianceRows] = await pool.query(
      "SELECT appliance_id, user_id FROM appliances WHERE serial_number = ?",
      [body.serialNumber]
    );
    if (applianceRows.length === 0) {
      return Response.json(
        { message: "No matching appliance found!" },
        { status: 404 }
      );
    }

    const applianceId = applianceRows[0].appliance_id;
    const userId = applianceRows[0].user_id;

    await pool.query(
      `UPDATE users
       SET first_name = ?, last_name = ?, address = ?, mobile = ?, email = ?, eircode = ?
       WHERE user_id = ?`,
      [
        body.firstName,
        body.lastName,
        body.address,
        body.mobile,
        body.email,
        body.eircode,
        userId,
      ]
    );

    await pool.query(
      `UPDATE appliances
       SET appliance_type = ?, brand = ?, model_number = ?, purchase_date = ?,
           warranty_expiration_date = ?, cost = ?
       WHERE appliance_id = ?`,
      [
        body.applianceType,
        body.brand,
        body.modelNumber,
        body.purchaseDate,
        body.warrantyExpirationDate,
        body.cost,
        applianceId,
      ]
    );

    return Response.json({ message: "Appliance has been updated." });
  } catch (error) {
    return Response.json(
      { message: "Update failed." },
      { status: 500 }
    );
  }
}
