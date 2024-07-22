import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex space-x-4">
              <Link to="/info" className="text-sm hover:text-gray-400">
                Info
              </Link>
              <Link to="/support" className="text-sm hover:text-gray-400">
                Support
              </Link>
              <Link to="/terms-of-use" className="text-sm hover:text-gray-400">
                Terms of Use
              </Link>
              <Link
                to="/privacy-policy"
                className="text-sm hover:text-gray-400"
              >
                Privacy Policy
              </Link>
              <Link to="/about-us" className="text-sm hover:text-gray-400">
                About Us
              </Link>
            </div>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/src/asset/icon/character.png"
                alt="Instagram"
                className="w-6 h-6 hover:opacity-75"
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/src/asset/icon/character.png"
                alt="Twitter"
                className="w-6 h-6 hover:opacity-75"
              />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/src/asset/icon/character.png"
                alt="LinkedIn"
                className="w-6 h-6 hover:opacity-75"
              />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
