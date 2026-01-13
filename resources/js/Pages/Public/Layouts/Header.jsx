import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from '@inertiajs/react';
import ScrollProgressBar from '../../../Components/ScrollProgressBar';

const navLinks = [
  {
    label: 'Product',
    href: '#product',
    dropdownItems: [
      { label: 'Group Medical Cover', href: '/products/group-medical-cover', description: 'Comprehensive health insurance for your entire team' },
      { label: 'Group Accident Cover', href: '/products/group-accident-cover', description: 'Protection against unforeseen accidents and injuries' },
      { label: 'Group Term Life', href: '/products/group-term-life', description: 'Life insurance coverage to protect your employees and their families' },
      { label: 'Wellness Programs/Services', href: '/products/wellness-programs', description: 'Holistic wellness solutions for employee well-being' },
      // { label: 'Telehealth Services', href: '/products/telehealth-services', description: 'Virtual healthcare consultations anytime, anywhere' },
      { label: 'Customisable Surveys', href: '/products/surveys', description: 'Gather insights and feedback from your team' },
    ]
  },
  {
    label: 'Experience',
    href: '#employee',
    dropdownItems: [
      { label: 'Employee Platform', href: '/employee', description: 'Easy-to-use dashboard for managing benefits' },
      { label: 'Employer Platform', href: '/employer', description: 'Complete control and insights for HR teams' },
      { label: 'Mobile App', href: '/mobile', description: 'Access your benefits on the go with our app' },
    ]
  },
  {
    label: 'Solutions',
    href: '#solutions',
    dropdownItems: [
      { label: 'Small Teams', href: '/solutions/small-teams', description: 'Flexible plans designed for startups and SMEs' },
      { label: 'Medium Enterprises', href: '/solutions/medium-teams', description: 'Benefits that work for remote and on-site teams' },
      { label: 'Large Enterprises', href: '/solutions/large-teams', description: 'Scalable solutions for large organizations' },
    ]
  },
  {
    label: 'Explore',
    href: '#resources',
    dropdownItems: [
      { label: 'Resources', href: '/resources', description: 'Guides, whitepapers, and helpful materials' },
      { label: 'Blog', href: '/blog', description: 'Latest insights on employee benefits and wellness' },
      // { label: 'Case Studies', href: '/cases', description: 'Success stories from our clients' },
      { label: 'FAQs', href: '/#faq', description: 'Find answers to common questions', isFaq: true },
    ]
  },
  {
    label: 'Company',
    href: '/about',
    dropdownItems: [
      { label: 'About Us', href: '/about', description: 'Learn about our mission and values' },
      // { label: 'Careers', href: '/careers', description: 'Join our growing team of professionals' },
      { label: 'Contact Us', href: '/contact', description: 'Get in touch with our team' },
    ]
  },
];

const Header = () => {
  const [hoveredNav, setHoveredNav] = useState(null);
  const [closeTimeout, setCloseTimeout] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMouseEnter = (label) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setHoveredNav(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredNav(null);
    }, 150);
    setCloseTimeout(timeout);
  };

  return (
    <>
      <ScrollProgressBar />
      <style>{`html,body{overflow-x:hidden !important;}`}</style>
      {/*
                gmc-card pseudo-element fills the card with the feature's pastel color (set via --accent).
                Uses transform scale for a smooth fill animation and keeps content above the color using z-index.
            */}
      <style>{`.
                .gmc-card{position:relative;--accent:transparent}
                .gmc-card::before{content:'';position:absolute;inset:0;border-radius:inherit;background:var(--accent);transform:scale(0.01);opacity:0;transition:transform 700ms cubic-bezier(.2,.9,.2,1),opacity 700ms ease;z-index:0;pointer-events:none}
                .gmc-card :where(.z-10){position:relative;z-index:10}
                .gmc-card:hover::before,.gmc-card.group:hover::before{transform:scale(1);opacity:1}
            `}</style>
      <header className={`fixed top-0 left-0 w-full flex justify-between items-center py-3 px-6 md:py-6 z-30 backdrop-blur-lg transition-all duration-500 ${hoveredNav
        ? 'bg-[#f6dcc7] text-white'
        : 'bg-transparent text-black'
        }`}>
        <Link href="/" className="flex items-center">
          <img src="/assets/logo/ZoomConnect-logo.png" alt="ZoomConnect Logo" className="h-5 w-auto md:h-8 md:w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map(({ href, label, dropdownItems }) => (
            <div
              key={label}
              className="relative"
              onMouseLeave={handleMouseLeave}
            >
              <a
                href={href}
                className={`relative inline-flex items-center pb-1 text-[0.75rem] uppercase tracking-[0.12em] transition-all duration-300 before:content-['+'] before:mr-2 before:text-[#dd4b63] before:text-base before:transition-all before:duration-300 after:absolute after:left-0 after:-bottom-[0.35rem] after:h-[1px] after:w-0 after:bg-[#dd4b63] after:transition-all after:duration-300 hover:text-[#dd4b63] hover:before:content-['−'] hover:after:w-full focus-visible:outline-none ${hoveredNav ? 'text-white' : 'text-black'}`}
                onMouseEnter={() => handleMouseEnter(label)}
                onClick={
                  label === 'Explore' && dropdownItems?.some(i => i.isFaq)
                    ? undefined
                    : label === 'FAQs'
                      ? (e) => {
                        e.preventDefault();
                        const faq = document.getElementById('faq');
                        if (faq) {
                          faq.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                      : undefined
                }
              >
                {label}
              </a>

              {/* Full Screen Dropdown Menu */}
              {dropdownItems && (
                <div
                  className={`fixed left-0 right-0 top-[72px] min-h-[70vh] bg-[#f6dcc7] transition-all duration-300 shadow-md ${hoveredNav === label
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-4'
                    }`}
                  style={{
                    zIndex: 40,
                    pointerEvents: hoveredNav === label ? 'auto' : 'none'
                  }}
                  onMouseEnter={() => handleMouseEnter(label)}
                >
                  <div className="container mx-auto px-6 py-12">
                    <div className="max-w-7xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 overflow-y-auto max-h-[50vh] pr-4">
                        {dropdownItems.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.href}
                            className="group p-4 rounded-xl hover:bg-[#dd4b63]/5 transition-all duration-300 border border-transparent hover:border-[#dd4b63]/20"
                          >
                            <div className="flex items-start gap-4 ">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#dd4b63]/10 flex items-center justify-center group-hover:bg-[#dd4b63] transition-colors duration-300">
                                <span className="text-[#dd4b63] group-hover:text-white font-bold text-sm transition-colors duration-300">
                                  {idx + 1}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-800 group-hover:text-[#dd4b63] transition-colors duration-300 mb-2">
                                  {item.label}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {item.description || 'Explore our comprehensive solutions'}
                                </p>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>

                      {/* Optional CTA at the bottom (flows after scrollable content) */}
                      <div className="mt-10 pt-8 pb-4 border-t border-gray-200 px-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">Need help choosing?</h4>
                            <p className="text-sm text-gray-600">Talk to our experts to find the perfect solution</p>
                          </div>
                          <div>
                            <Link href="/contact" className="px-6 py-3 bg-[#ff3052] text-white rounded-lg font-semibold hover:bg-[#c43a53] transition-colors duration-300 inline-block">
                              Contact Us
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Actions - Hidden on Mobile */}
        <div className="hidden md:flex gap-3 items-center">
          <button className="relative overflow-hidden font-bold px-3 py-1 rounded text-sm shadow transition flex items-center bg-transparent border border-[#934790] text-[#934790] group">
            <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#934790] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Log In</span>
          </button>
          <Link
            href="/book-demo"
            className="relative overflow-hidden font-bold px-3 py-1 rounded text-sm shadow transition flex items-center bg-[#934790] text-white group"
          >
            <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#6A0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
            <span className="relative z-10">Book a Demo</span>
          </Link>
        </div>

        {/* Mobile Menu Button - Visible only on Mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 text-[#934790] hover:bg-[#934790]/10 rounded-lg transition-colors duration-300"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-[72px] left-0 right-0 bg-white shadow-lg z-40 max-h-[calc(100vh-72px)] overflow-y-auto">
            <div className="px-6 py-4 space-y-4">
              {navLinks.map(({ href, label, dropdownItems }) => (
                <div key={label} className="border-b border-gray-100 pb-4">
                  <a
                    href={href}
                    className="block text-base font-semibold text-[#432821] mb-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label}
                  </a>
                  {dropdownItems && (
                    <div className="pl-4 space-y-2">
                      {dropdownItems.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.href}
                          className="block py-2 text-sm text-gray-600 hover:text-[#dd4b63] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Actions */}
              <div className="pt-4 space-y-3">
                <button
                  className="w-full px-4 py-2 border border-[#934790] text-[#934790] rounded font-semibold hover:bg-[#934790] hover:text-white transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </button>
                <Link
                  href="/book-demo"
                  className="block w-full px-4 py-2 bg-[#934790] text-white text-center rounded font-semibold hover:bg-[#7a3677] transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>

        )}
      </header>
    </>
  );
};

export default Header;
