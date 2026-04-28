// Regex rules for all form fields.
// These are used on both client and server to keep validation consistent.
export const regex = {
  firstName: /^[A-Za-z\s'-]{2,50}$/,
  lastName: /^[A-Za-z\s'-]{2,50}$/,
  address: /^[A-Za-z0-9\s,.'#-]{5,255}$/,
  mobile: /^\+?[0-9\s-]{7,20}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  eircode: /^[A-Za-z0-9\s]{3,8}$/,
  applianceType: /^[A-Za-z\s-]{2,50}$/,
  brand: /^[A-Za-z0-9\s-]{2,50}$/,
  modelNumber: /^[A-Za-z0-9-]{2,50}$/,
  serialNumber: /^[A-Za-z0-9-]{3,50}$/,
  cost: /^(?:0|[1-9]\d{0,7})(?:\.\d{1,2})?$/,
};

export function validateAppliancePayload(payload, includeUser = true) {
  const errors = {};

  if (includeUser) {
    if (!regex.firstName.test(payload.firstName || "")) {
      errors.firstName = "First name must be 2-50 letters.";
    }
    if (!regex.lastName.test(payload.lastName || "")) {
      errors.lastName = "Last name must be 2-50 letters.";
    }
    if (!regex.address.test(payload.address || "")) {
      errors.address = "Address must be 5-255 valid characters.";
    }
    if (!regex.mobile.test(payload.mobile || "")) {
      errors.mobile = "Mobile must be 7-20 digits, spaces, or dashes.";
    }
    if (!regex.email.test(payload.email || "")) {
      errors.email = "Email format is invalid.";
    }
    if (!regex.eircode.test(payload.eircode || "")) {
      errors.eircode = "Eircode must be 3-8 characters.";
    }
  }

  if (!regex.applianceType.test(payload.applianceType || "")) {
    errors.applianceType = "Appliance type must be 2-50 letters.";
  }
  if (!regex.brand.test(payload.brand || "")) {
    errors.brand = "Brand must be 2-50 valid characters.";
  }
  if (!regex.modelNumber.test(payload.modelNumber || "")) {
    errors.modelNumber = "Model number must be 2-50 letters/numbers.";
  }
  if (!regex.serialNumber.test(payload.serialNumber || "")) {
    errors.serialNumber = "Serial number must be 3-50 letters/numbers.";
  }
  if (!payload.purchaseDate) {
    errors.purchaseDate = "Purchase date is required.";
  }
  if (!payload.warrantyExpirationDate) {
    errors.warrantyExpirationDate = "Warranty expiration date is required.";
  }
  if (!regex.cost.test(String(payload.cost || ""))) {
    errors.cost = "Cost must be a valid number with max 2 decimals.";
  }

  if (payload.purchaseDate && payload.warrantyExpirationDate) {
    const purchase = new Date(payload.purchaseDate);
    const warranty = new Date(payload.warrantyExpirationDate);
    if (Number.isNaN(purchase.getTime()) || Number.isNaN(warranty.getTime())) {
      errors.dates = "Invalid date value.";
    } else if (warranty < purchase) {
      errors.dates = "Warranty date cannot be before purchase date.";
    }
  }

  return errors;
}
