// Navbar.jsx
export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <span className="font-bold text-lg">DevOrbit</span>
      <div className="space-x-4 text-sm">Feed · Profile · Login</div>
    </nav>
  );
}