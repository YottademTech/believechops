import { Link, useLocation } from "react-router";
import { Menu, X, Phone, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { UserMenu } from "@/app/components/UserMenu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const phoneNumber = "054 972 9309";

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Menu" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b-2 border-yellow-400 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-yellow-400 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img src="/logo.jpeg" alt="Believe Chops" className="relative h-14 w-14 rounded-full object-cover border-2 border-yellow-400 shadow-lg" />
            </div>
            <span className="text-xl font-bold text-black hidden sm:block">Believe <span className="text-yellow-500">Chops</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors ${
                  isActive(link.path)
                    ? "text-yellow-500 font-semibold"
                    : "text-gray-700 hover:text-yellow-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/checkout"
              className="relative bg-black text-yellow-400 border-2 border-yellow-400 px-5 py-2 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-yellow-400 text-black text-xs font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="bg-yellow-400 text-black px-5 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
            <UserMenu variant="desktop" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 px-4 rounded-lg mb-1 ${
                  isActive(link.path)
                    ? "bg-yellow-50 text-yellow-600 font-semibold"
                    : "text-gray-700 hover:bg-yellow-400 hover:text-black"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-3 mt-4 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition-colors"
            >
              <ShoppingBag className="w-4 h-4 inline mr-2" />
              Cart {itemCount > 0 ? `(${itemCount})` : ""}
            </Link>
            <a
              href={`tel:${phoneNumber.replace(/\s/g, '')}`}
              className="block w-full text-center bg-yellow-400 text-black px-4 py-3 mt-2 rounded-full font-bold hover:bg-yellow-300 transition-colors"
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Call to order
            </a>
            <UserMenu variant="mobile" onNavigate={() => setIsOpen(false)} />
          </div>
        )}
      </div>
    </nav>
  );
}
