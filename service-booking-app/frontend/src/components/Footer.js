import React from 'react';
import { FiGithub, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-10">
          {/* About */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/assets/servicehub-logo.png"
                alt="ServiceHub logo"
                className="h-12 w-24 object-contain"
              />
              <h3 className="text-2xl font-black">ServiceHub</h3>
            </div>
            <p className="text-slate-400 leading-7">
              Connecting customers with trusted local professionals for fast, reliable, and hassle-free services.
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
              <li>Trusted Professionals</li>
              <li>Verified Experts</li>
              <li>Reliable Services</li>
              <li>Quality Assurance</li>
              <li>Customer Satisfaction</li>
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
              <span className="block">Privacy Policy</span>
              <span className="block">Terms & Conditions</span>
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
