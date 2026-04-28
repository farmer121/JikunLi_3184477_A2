// home page - shows links to the four CRUD operations
import Link from 'next/link';

export default function Page() {
  return (
    <main className="container">
      <h1>Appliance Management</h1>
      <p className="subtitle">Choose one operation below.</p>
      <nav className="card nav-links">
        <Link href="/add">Add Appliance</Link>
        <Link href="/search">Search Appliance</Link>
        <Link href="/update">Update Appliance</Link>
        <Link href="/delete">Delete Appliance</Link>
      </nav>
    </main>
  );
}
