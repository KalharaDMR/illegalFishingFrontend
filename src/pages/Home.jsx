import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../Home.css';
import { FaFish, FaShieldAlt, FaUsers, FaMapMarkerAlt, FaStar, FaQuoteLeft } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-screen flex items-center justify-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-cyan-900/80"></div>
        <div className="relative z-10 text-center text-white px-4 animate-fade-in max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl leading-tight">
            Protect Our Oceans
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            Join OceanWatch in the global fight against illegal fishing. Report incidents, monitor endangered species, and help preserve marine ecosystems for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-green-500/50"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up">
              <FaFish className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">10,000+</h3>
              <p className="text-gray-600">Reports Submitted</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <FaShieldAlt className="text-4xl text-green-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">500+</h3>
              <p className="text-gray-600">Protected Zones</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <FaUsers className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">50,000+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <FaMapMarkerAlt className="text-4xl text-red-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">200+</h3>
              <p className="text-gray-600">Countries Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 animate-slide-up group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <FaFish className="text-3xl text-blue-600" />
              </div>
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Report Illegal Fishing"
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              <h3 className="text-2xl font-semibold mb-4 text-blue-900">Report Illegal Fishing</h3>
              <p className="text-gray-600 leading-relaxed">
                Easily report illegal fishing activities with our intuitive platform. Your reports help authorities take swift action to protect marine life.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 animate-slide-up group" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <FaShieldAlt className="text-3xl text-green-600" />
              </div>
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Endangered Species"
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              <h3 className="text-2xl font-semibold mb-4 text-blue-900">Monitor Endangered Species</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay informed about endangered marine species in your area and contribute to their protection through our comprehensive database.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 animate-slide-up group" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                <FaMapMarkerAlt className="text-3xl text-purple-600" />
              </div>
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Restricted Zones"
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              <h3 className="text-2xl font-semibold mb-4 text-blue-900">Protected Areas</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn about restricted zones and marine sanctuaries to help prevent illegal activities and support conservation efforts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="animate-slide-up">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">1</div>
              <h3 className="text-2xl font-semibold mb-4">Report</h3>
              <p className="text-gray-600">Spot illegal fishing and submit a detailed report with photos and location data.</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">2</div>
              <h3 className="text-2xl font-semibold mb-4">Investigate</h3>
              <p className="text-gray-600">Our team of experts reviews and investigates reports to ensure accuracy and take action.</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">3</div>
              <h3 className="text-2xl font-semibold mb-4">Protect</h3>
              <p className="text-gray-600">Authorities are alerted, and measures are taken to protect marine ecosystems and wildlife.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg animate-slide-up">
              <FaQuoteLeft className="text-3xl text-gray-300 mb-4" />
              <p className="text-gray-600 mb-6 italic">"OceanWatch has made it so easy to report illegal fishing. I feel like I'm making a real difference in protecting our oceans."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">JD</div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <div className="flex text-yellow-400">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <FaQuoteLeft className="text-3xl text-gray-300 mb-4" />
              <p className="text-gray-600 mb-6 italic">"As a zoologist, this platform helps me track endangered species effectively. The community support is incredible."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">AS</div>
                <div>
                  <h4 className="font-semibold">Alice Smith</h4>
                  <div className="flex text-yellow-400">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-cyan-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Make a Difference Today</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Every report counts. Join our community of ocean protectors and help safeguard marine ecosystems for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-green-500/50"
            >
              Sign Up Now
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">OceanWatch</h3>
              <p className="text-gray-400">Protecting our oceans, one report at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Report Illegal Fishing</li>
                <li>Monitor Species</li>
                <li>Protected Zones</li>
                <li>Real-time Alerts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 OceanWatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;