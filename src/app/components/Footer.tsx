import { Link } from "react-router";
import { Phone, UtensilsCrossed } from "lucide-react";

export function Footer() {
  const phoneNumber = "054 972 9309";

  return (
    <footer className="bg-black border-t-2 border-yellow-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <UtensilsCrossed className="w-6 h-6 text-yellow-400" />
          <span className="text-2xl font-bold text-yellow-400">Believe Chops</span>
        </div>
        <p className="text-gray-400 mb-2">
          Healthy Fast Food & Fresh Fruit Juices
        </p>
        <p className="text-gray-400 text-sm mb-4">
          Made fresh with love • Call to order: {phoneNumber}
        </p>
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/" className="text-gray-400 hover:text-yellow-400 transition-colors">
            Home
          </Link>
          <Link to="/menu" className="text-gray-400 hover:text-yellow-400 transition-colors">
            Menu
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors">
            Contact
          </Link>
        </div>
        <a
          href={`tel:${phoneNumber.replace(/\s/g, '')}`}
          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <Phone className="w-4 h-4" />
          {phoneNumber}
        </a>
        <p className="text-gray-600 text-xs mt-4">
          © {new Date().getFullYear()} Believe Chops. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
