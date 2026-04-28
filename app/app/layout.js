// root layout - applied to every page in the app
import "./globals.css";

export const metadata = {
  title: "Household Appliance Inventory",
  description: "SWD Assignment 2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
