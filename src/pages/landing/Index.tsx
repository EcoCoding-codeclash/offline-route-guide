import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Navigation,
  MapPin,
  Wifi,
  Shield,
  Clock,
  Star,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">NaviGo</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Reviews
              </a>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link to="/app">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Navigate Anywhere,
                  <span className="text-green-600"> Even Offline</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Plan your routes, navigate confidently, and never lose your
                  way. Our offline-capable navigation app works everywhere, even
                  without internet connection.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700"
                  asChild
                >
                  <Link to="/app">
                    Start Navigating
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 border-green-600 text-green-600 hover:bg-green-50"
                >
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    10,000+
                  </div>
                  <div className="text-sm text-gray-600">Routes Planned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Offline Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Happy Users</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span className="font-medium">Current Route</span>
                    </div>
                    <div className="bg-green-400 px-2 py-1 rounded-full text-xs">
                      Offline
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                      <span>Downtown Plaza</span>
                    </div>
                    <div className="border-l-2 border-dashed border-white/30 ml-1.5 h-8"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span>Airport Terminal</span>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="flex justify-between text-sm">
                      <span>Distance: 12.5 km</span>
                      <span>Time: 18 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Discover How We Can Help
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find exceptional routes tailored to your lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                  <Wifi className="h-8 w-8 text-green-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Offline Navigation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Navigate confidently even without internet connection. All
                  your routes are cached locally for reliable access anywhere.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                  <Shield className="h-8 w-8 text-emerald-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Secure & Private
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your location data stays private with end-to-end encryption
                  and secure authentication through industry-standard protocols.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-teal-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors">
                  <Clock className="h-8 w-8 text-teal-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Real-time Updates
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get live traffic updates and route optimizations when online,
                  with seamless fallback to cached data when offline.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Your Journey, Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience seamless navigation in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Plan Your Route
              </h3>
              <p className="text-gray-600">
                Enter your starting point and destination. Our smart routing
                finds the best path for your journey.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cache for Offline
              </h3>
              <p className="text-gray-600">
                Download maps and route data to your device for reliable
                navigation without internet connection.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Navigate Anywhere
              </h3>
              <p className="text-gray-600">
                Follow turn-by-turn directions with confidence, whether you're
                online or completely offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Experts
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "Relocating to a new city felt overwhelming, but thanks to
                  NaviGo, I found my way around faster than I ever
                  imagined—without the usual stress and confusion!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">ES</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Emma Sullivan
                    </div>
                    <div className="text-sm text-gray-600">
                      Business Development, San Francisco
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "As a delivery driver, offline navigation is crucial. NaviGo
                  never lets me down, even in areas with poor signal coverage."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Marcus Rodriguez
                    </div>
                    <div className="text-sm text-gray-600">
                      Delivery Professional, Chicago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "Perfect for hiking and outdoor adventures. The offline
                  capability saved our trip when we lost cell service in the
                  mountains."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">SC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Sarah Chen
                    </div>
                    <div className="text-sm text-gray-600">
                      Adventure Guide, Denver
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Navigate with Confidence?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust NaviGo for their daily navigation
            needs. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4"
              asChild
            >
              <Link to="/app">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-green-600 hover:bg-green-600 hover:text-white text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">NaviGo</span>
              </div>
              <p className="text-gray-400">
                Navigate anywhere, even offline. Your trusted companion for
                every journey.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NaviGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
