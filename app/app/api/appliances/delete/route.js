// DELETE /api/appliances/delete
// two-step flow: first call (confirmDelete=false) returns the appliance for
// the user to confirm; second call (confirmDelete=true) actually deletes it.
import pool from "../../../../lib/db";
import { sanitizeText } from "../../../../lib/sanitize";
import { regex } from "../../../../lib/validation";

export async function DELETE(request) {
  try {
    const { serialNumber, confirmDelete } = await request.json();
    const cleanSerial = sanitizeText(serialNumber || "");

    if (!regex.serialNumber.test(cleanSerial)) {
      return Response.json(
        { message: "Invalid serial number format." },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      "SELECT appliance_id, user_id, appliance_type, brand FROM appliances WHERE serial_number = ?",
      [cleanSerial]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: "No matching appliance found!" },
        { status: 404 }
      );
    }

    // first call: return appliance details so the page can ask for confirmation
    if (!confirmDelete) {
      return Response.json({
        message: "Confirm appliance details before deletion.",
        appliance: rows[0],
      });
    }

    await pool.query("DELETE FROM appliances WHERE appliance_id = ?", [
      rows[0].appliance_id,
    ]);

    return Response.json({ message: "Appliance deleted." });
  } catch (error) {
    return Response.json(
      { message: "Delete failed." },
      { status: 500 }
    );
  }
}
