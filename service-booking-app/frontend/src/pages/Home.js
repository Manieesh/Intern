import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const context = useContext(AuthContext);
  const { isAuthenticated, user } = context || {};

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Book Local Services Easily</h1>
          <p className="text-xl mb-8">Find verified service providers in your area and book them instantly</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/services"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Browse Services
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold mb-2">Verified Providers</h3>
            <p className="text-gray-600">All service providers are carefully verified to ensure quality</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-2">Ratings & Reviews</h3>
            <p className="text-gray-600">Read real customer reviews to make informed decisions</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Safe and secure payment processing with multiple options</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning'].map((cat) => (
              <Link
                key={cat}
                to={`/services?category=${cat.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition"
              >
                <div className="text-3xl mb-2">🔧</div>
                <p className="font-semibold">{cat}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <Link
            to="/services"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
          >
            Explore Services
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
