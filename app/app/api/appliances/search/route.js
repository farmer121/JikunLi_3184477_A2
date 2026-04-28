// GET /api/appliances/search?serialNumber=...
// returns the appliance + its owner's user details, joined on user_id.
import pool from "../../../../lib/db";
import { sanitizeText } from "../../../../lib/sanitize";
import { regex } from "../../../../lib/validation";

export async function GET(request) {
  try {
    // pull the serial from the query string and trim it
    const serialNumber = sanitizeText(
      request.nextUrl.searchParams.get("serialNumber") || ""
    );

    // server-side format check (the form already enforces pattern client-side)
    if (!regex.serialNumber.test(serialNumber)) {
      return Response.json(
        { message: "Invalid serial number format." },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `SELECT
        a.appliance_id,
        a.appliance_type,
        a.brand,
        a.model_number,
        a.serial_number,
        a.purchase_date,
        a.warranty_expiration_date,
        a.cost,
        u.user_id,
        u.first_name,
        u.last_name,
        u.address,
        u.mobile,
        u.email,
        u.eircode
      FROM appliances a
      INNER JOIN users u ON a.user_id = u.user_id
      WHERE a.serial_number = ?`,
      [serialNumber]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: "No matching appliance found!" },
        { status: 404 }
      );
    }

    return Response.json({ appliance: rows[0] });
  } catch (error) {
    return Response.json(
      { message: "Search failed." },
      { status: 500 }
    );
  }
}
