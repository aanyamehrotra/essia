import { Link } from 'wouter';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { FaPinterest } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-purple-dark text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h4 className="text-xl sm:text-2xl font-serif font-bold mb-4">Essia</h4>
            <p className="text-white/80 mb-6 max-w-md text-sm sm:text-base leading-relaxed">
              Creating moments of tranquility through premium handcrafted candles. 
              Made with love, care, and the finest natural ingredients.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-200"
                aria-label="Pinterest"
              >
                <FaPinterest className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-4 text-base sm:text-lg">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer text-sm sm:text-base">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <span className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer text-sm sm:text-base">
                    Products
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer text-sm sm:text-base">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-white/60 hover:text-white transition-colors duration-200 cursor-pointer text-sm sm:text-base">
                    Contact
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="font-semibold mb-4 text-base sm:text-lg">Customer Service</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Care Instructions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/60 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                >
                  Wholesale
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-white/60 text-sm text-center sm:text-left">
            © 2024 Essia. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}