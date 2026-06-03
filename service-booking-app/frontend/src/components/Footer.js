import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Footer = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <footer id="contact" className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-10">
          {/* About */}
          <div>
            <h3 className="text-2xl font-black mb-4">ServiceHub</h3>
            <p className="text-slate-400 leading-7">
              Your trusted platform for booking local services with verified providers.
            </p>
            <div className="mt-5 space-y-3 text-slate-300">
              <a href="mailto:manieeshkumar@karunya.edu.in" className="flex items-center gap-2 hover:text-white">
                <FiMail />
                manieeshkumar@karunya.edu.in
              </a>
              <a href="tel:+916380428254" className="flex items-center gap-2 hover:text-white">
                <FiPhone />
                +91 6380428254
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">About Us</h4>
            <ul className="space-y-3 text-slate-400">
              {isAuthenticated ? (
                <>
                  <li><a href="/home#home" className="hover:text-white">Home</a></li>
                  <li><a href="/home#contact" className="hover:text-white">Contact</a></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="hover:text-white">Login</Link></li>
                  <li><Link to="/register" className="hover:text-white">Register</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">Services</h4>
            <ul className="space-y-3 text-slate-400">
              {isAuthenticated ? (
                <>
                  <li><Link to="/services?category=plumbing" className="hover:text-white">Plumbing</Link></li>
                  <li><Link to="/services?category=electrical" className="hover:text-white">Electrical</Link></li>
                  <li><Link to="/services?category=cleaning" className="hover:text-white">House Cleaning</Link></li>
                  <li><Link to="/services?category=photographer" className="hover:text-white">Photography</Link></li>
                  <li><Link to="/services?category=hvac" className="hover:text-white">AC Repair</Link></li>
                </>
              ) : (
                <li className="leading-7">Login to explore services available in your city.</li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-3">
              <a href="https://www.linkedin.com/in/manieesh-kumar-r" className="rounded-full bg-white/10 p-3 text-slate-300 hover:bg-teal-500 hover:text-white" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <FiLinkedin size={24} />
              </a>
              <a href="https://github.com/Manieesh" className="rounded-full bg-white/10 p-3 text-slate-300 hover:bg-teal-500 hover:text-white" aria-label="GitHub" target="_blank" rel="noreferrer">
                <FiGithub size={24} />
              </a>
              <a href="mailto:manieeshkumar@karunya.edu.in" className="rounded-full bg-white/10 p-3 text-slate-300 hover:bg-teal-500 hover:text-white" aria-label="Email">
                <FiMail size={24} />
              </a>
            </div>
            <div className="mt-6 space-y-3 text-slate-400">
              <Link to="/" className="block hover:text-white">Privacy Policy</Link>
              <Link to="/" className="block hover:text-white">Terms & Conditions</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 text-center text-slate-400">
          <p>&copy; 2026 ServiceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
