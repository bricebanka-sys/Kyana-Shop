import { Mail, MapPin, Phone, ShieldCheck, Truck, CreditCard } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-gray-900">
      {/* Bandeau de réassurance */}
      <div className="border-b border-gray-800">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">Free shipping</p>
              <p className="text-xs text-gray-400">On all orders over 50 €</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">Secure payment</p>
              <p className="text-xs text-gray-400">Powered by Stripe</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">Flexible returns</p>
              <p className="text-xs text-gray-400">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal du footer */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Marque + description */}
          <div>
            <h2 className="text-xl font-bold text-emerald-400">Kyana'Shop</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Quality products, curated for you. Shop with confidence and enjoy a
              seamless experience from cart to delivery.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 transition-colors hover:text-emerald-400">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 transition-colors hover:text-emerald-400">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 transition-colors hover:text-emerald-400">
                <FaTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li><a href="/" className="transition-colors hover:text-emerald-400">Home</a></li>
              <li><a href="/cart" className="transition-colors hover:text-emerald-400">Cart</a></li>
              <li><a href="#" className="transition-colors hover:text-emerald-400">New arrivals</a></li>
              <li><a href="#" className="transition-colors hover:text-emerald-400">Best sellers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Support</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li><a href="#" className="transition-colors hover:text-emerald-400">FAQ</a></li>
              <li><a href="#" className="transition-colors hover:text-emerald-400">Shipping & returns</a></li>
              <li><a href="#" className="transition-colors hover:text-emerald-400">Track my order</a></li>
              <li><a href="#" className="transition-colors hover:text-emerald-400">Contact us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>123 Market Street, Berlin, Germany</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>+49 15776500475</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>mesminvisionds@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-gray-500 sm:flex-row">
          <p>&copy; {currentYear} Kyana'Shop (Mesmin Vision Digital Services). All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-gray-300">Privacy policy</a>
            <a href="#" className="transition-colors hover:text-gray-300">Terms of service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;