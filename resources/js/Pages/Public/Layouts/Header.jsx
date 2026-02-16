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
  const [expandedMobileSection, setExpandedMobileSection] = useState(null);

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

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // 🔥 added
      document.body.style.touchAction = 'none'; // 🔥 added (mobile swipe lock)
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);


  return (
    <>
      <ScrollProgressBar />
      <style>{`html,body{overflow-x:hidden !important;}`}</style>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

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
      <header className={`fixed top-0 left-0 w-full flex justify-between items-center py-3 px-6 md:py-6 transition-all duration-500 ${isMobileMenuOpen ? 'z-50 bg-white' : hoveredNav ? 'z-30 bg-[#f6dcc7] text-white' : 'z-30 bg-transparent text-black'
        } backdrop-blur-lg`}>
        <Link href="/" className="flex items-center">
          {/* Mobile Logo */}
          <img src="/assets/logo/Purple-ZoomConnect-Logo.png" alt="ZoomConnect Logo" className="h-12 w-auto md:hidden" />
          {/* Desktop Logo */}
          <img src="/assets/logo/ZoomConnect-logo.png" alt="ZoomConnect Logo" className="hidden md:block h-8 w-auto" />
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
          <Link href="/employee-login" className="relative overflow-hidden font-bold px-3 py-1 rounded text-sm shadow transition flex items-center bg-transparent border border-[#934790] text-[#934790] group">
            <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#934790] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Log In</span>
          </Link>
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
          className="md:hidden flex items-center justify-center w-10 h-10 text-[#934790] hover:bg-[#934790]/10 rounded-lg transition-colors duration-300 relative z-50"
          aria-label="Toggle mobile menu"
        >
          {<FaBars className="w-5 h-5" />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-[4px] z-40 animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Sidebar */}
        <div className={`md:hidden fixed top-0 left-0 h-screen w-[85%] max-w-sm bg-[#f6dcc7]  shadow-2xl z-50 transform transition-all duration-500 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}>
          <div className="h-full overflow-y-auto px-4 pt-2 pb-6">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#dd4b63]/20">
              <div>
                <img src="/assets/logo/Purple-ZoomConnect-Logo.png" alt="ZoomConnect Logo" className="h-12 w-auto" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <FaTimes className="w-5 h-5 text-[#934790]" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-3 mb-6">
              {navLinks.map(({ href, label, dropdownItems }, navIdx) => (
                <div
                  key={label}
                  className="animate-slideInLeft"
                  style={{ animationDelay: `${navIdx * 50}ms` }}
                >
                  <button
                    onClick={() => {
                      if (dropdownItems) {
                        setExpandedMobileSection(expandedMobileSection === label ? null : label);
                      } else {
                        window.location.href = href;
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-xl bg-white/60 text-gray-800 font-semibold transition-all duration-300 shadow-sm ${expandedMobileSection === label ? 'bg-gradient-to-r from-[#FF0066]/80 to-[#FF0066]/70 text-white' : ''
                      }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider">{label}</span>
                    {dropdownItems && (
                      <svg
                        className={`w-4 h-4 transform transition-transform duration-300 ${expandedMobileSection === label ? 'rotate-90' : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>

                  {dropdownItems && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMobileSection === label ? 'max-h-96 mt-2' : 'max-h-0'
                        }`}
                    >
                      <div className="pl-2 space-y-1">
                        {dropdownItems.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.href}
                            className="flex items-start gap-2 py-1 px-3 rounded-lg text-xs text-gray-600 hover:text-[#dd4b63] hover:bg-white/80 transition-all duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#FF0066]/80 mt-1.5"></span>
                            <span className="flex-1">{item.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-[#dd4b63]/20 animate-slideInLeft flex flex-col items-center" style={{ animationDelay: '250ms' }}>
              <Link
                href="/employee-login"
                className="group relative overflow-hidden flex items-center justify-center bg-white/60 gap-2 w-[220px] px-5 py-2 text-xs border-2 border-[#934790] text-[#934790] rounded-xl font-semibold transition-all duration-300 shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#934790] to-[#dd4b63] transform scale-x-0 group-active:scale-x-100 transition-transform duration-300 origin-left"></span>
                <svg className="w-3 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="relative z-10">Employee Login</span>
              </Link>

              <Link
                href="/book-demo"
                className="group relative overflow-hidden flex items-center justify-center gap-2 w-[220px] px-5 py-2 text-xs bg-[#934790] text-white rounded-xl font-semibold shadow-lg transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#dd4b63] to-[#934790] opacity-0 group-active:opacity-100 transition-opacity duration-300"></span>
                <svg className="w-3 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="relative z-10">Book a Demo</span>
              </Link>
            </div>


          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
