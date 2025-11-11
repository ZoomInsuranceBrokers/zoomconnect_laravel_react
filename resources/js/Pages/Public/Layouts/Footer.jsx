
import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/zoomconnect',
    Icon: FaLinkedinIn,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/zoomconnect',
    Icon: FaFacebookF,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/zoomconnect',
    Icon: FaInstagram,
  },
];

const currentYear = new Date().getFullYear();
const officeCities = ['Gurgaon', 'Bangalore', 'Pune', 'Mumbai', 'Chennai'];

const Footer = () => (
  <footer className='relative w-full mt-24 text-white bg-[#571754]'>
    <div className="absolute inset-0 overflow-hidden">
      <span className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></span>
      <span className="absolute top-1/3 right-[-5rem] h-72 w-72 rounded-full bg-[#FF6F91]/20 blur-[120px]"></span>
      <span className="absolute bottom-[-6rem] left-1/4 h-72 w-72 rounded-full bg-[#7AD9FF]/15 blur-[120px]"></span>
    </div>
    <div className="relative z-10 mx-auto w-full px-6 md:pt-16 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start">
        <div className="w-[100%] md:w-[80%] max-w-2xl lg:max-w-none  flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="mt-6 font-dmserif text-3xl md:text-3xl">
            Simplifying Employee <br className="hidden md:block" />Benefits, Every Day
          </h2>
          <p className="mt-4 max-w-xl text-sm text-white/70">
            From health cards and claims to wellness and insurance services - ZoomConnect brings everything together in one seamless platform. Stay informed.
          </p>

          <div className="mt-6 flex flex-row gap-6 items-center">
            {/* QR code next to app store buttons */}
            <div className="flex justify-center max-w-[100px]">
              <img src="/assets/logo/QR zoom connect-01.png" alt="Descriptive Alt Text" className="max-w-full h-auto" />
            </div>
            <div className="flex flex-row gap-3">
              <motion.a
                whileHover={{ y: -2 }}
                href="https://play.google.com/store/apps/details?id=com.zoomconnect"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 pl-0 pr-2 py-3 text-left text-white transition"
              >
                <img src="/assets/logo/google play-01 1.png" alt="Get it on Google Play" className="h-8 w-auto object-contain" />
                <img src="/assets/logo/app store-01 1.png" alt="Download on the App Store" className="h-8 w-auto object-contain" />
              </motion.a>
            </div>

          </div>

        </div>
        <div className="hidden self-stretch lg:flex lg:justify-center lg:px-10" aria-hidden="true">
          <div
            className="h-full w-px self-stretch rounded-full"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.25), rgba(255,255,255,0.05))' }}
          ></div>
        </div>
        <div className="grid grid-cols-2 gap-8 md:gap-40 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 ">
          <div className="min-w-[150px]">
            <div className="flex items-center text-sm font-semibold uppercase  text-white">
              {/* <span className="text-base">🛡️</span> */}
              <span className="">ZoomConnect </span>
            </div>
            <ul className="mt-4 space-y-3 text-xs">
              <li>
                <a href="#insurance" className="text-white/75  transition-colors hover:text-white">About Us</a>
              </li>
              <li>
                <a href="#product" className="text-white/75 transition-colors hover:text-white">Contact Us</a>
              </li>
              <li>
                <a href="#solutions" className="text-white/75 transition-colors hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#resources" className="text-white/75 transition-colors hover:text-white">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          <div className="min-w-[150px]">
            <div className="flex items-center text-sm font-semibold uppercase text-white">
              {/* <span className="text-base">✨</span> */}
              <span className="">Wellness</span>
            </div>
            <ul className="mt-4 space-y-3 text-xs">
              <li>
                <a href="#wellness" className="text-white/75 transition-colors hover:text-white">Wellness Overview</a>
              </li>
              <li>
                <a href="#telehealth" className="text-white/75 transition-colors hover:text-white">Telehealth</a>
              </li>
              <li>
                <a href="#fitness" className="text-white/75 transition-colors hover:text-white">Fitness</a>
              </li>
              <li>
                <a href="#mental-wellness" className="text-white/75 transition-colors hover:text-white">Mental Wellness</a>
              </li>
              <li>
                <a href="#maternity" className="text-white/75 transition-colors hover:text-white">Maternity Box</a>
              </li>
            </ul>
          </div>

          <div className="min-w-[150px]">
            <div className="flex items-center text-sm font-semibold uppercase text-white">
              {/* <span className="text-base">🖥️</span> */}
              <span className="">Platform</span>
            </div>
            <ul className="mt-4 space-y-3 text-xs">
              <li>
                <a href="#employee-platform" className="text-white/75 transition-colors hover:text-white">Employee</a>
              </li>
              <li>
                <a href="#employer-platform" className="text-white/75 transition-colors hover:text-white">Employer</a>
              </li>
              <li>
                <a href="#integrations" className="text-white/75 transition-colors hover:text-white">Integrations</a>
              </li>
            </ul>

            <div className="mt-8 flex items-center text-sm font-semibold uppercase  text-white">
              {/* <span className="text-base">💡</span> */}
              <span className="">Solutions</span>
            </div>
            <ul className="mt-4 space-y-3 text-xs">
              <li>
                <a href="#small-teams" className="text-white/75 transition-colors hover:text-white">Small Teams</a>
              </li>
              <li>
                <a href="#large-teams" className="text-white/75 transition-colors hover:text-white">Large Teams</a>
              </li>
              <li>
                <a href="#hybrid" className="text-white/75 transition-colors hover:text-white">Hybrid Workforce</a>
              </li>
            </ul>
          </div>

          <div className="min-w-[150px]">
            <div className="flex items-center text-sm font-semibold uppercase text-white">
              {/* <span className="text-base">📚</span> */}
              <span className="">Resources</span>
            </div>
            <ul className="mt-4 space-y-3 text-xs">
              <li>
                <a href="/careers" className="text-white/75 transition-colors hover:text-white">Careers</a>
              </li>
              <li>
                <a href="#company" className="text-white/75 transition-colors hover:text-white">About Us</a>
              </li>
              <li>
                <a href="#contact" className="text-white/75 transition-colors hover:text-white">Contact Us</a>
              </li>
              <li>
                <a href="#faq" className="text-white/75 transition-colors hover:text-white">FAQs</a>
              </li>
              <li>
                <a href="#testimonials" className="text-white/75 transition-colors hover:text-white">Testimonials</a>
              </li>
              <li>
                <a href="#guides" className="text-white/75 transition-colors hover:text-white">Guides & Blogs</a>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <div className="mt-14 flex flex-col gap-5 pt-2 lg:flex-col lg:items-center lg:justify-between">
        <div className="relative w-[100%] md:w-[80%] flex items-center justify-center gap-1 md:gap-6 py-2 before:content-[''] before:absolute before:left-0 before:top-1/2 before:h-px before:w-[30%] md:before:w-[35%] before:bg-white/30 after:content-[''] after:absolute after:right-0 after:top-1/2 after:h-px after:w-[30%] md:after:w-[35%] after:bg-white/30">
          {socialLinks.map(({ label, href, Icon }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -2 }}
              className="flex h-8 w-8 items-center justify-center text-white/60 transition hover:text-white"
            >
              <span className="sr-only">{label}</span>
              <Icon className="h-5 w-5" />
            </motion.a>
          ))}
        </div>

        <div className="flex flex-col gap-4 text-sm text-white/70 md:flex-row md:items-center md:gap-6">

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.3em] text-white/50">
            {officeCities.map((city) => (
              <span
                key={city}
                className="relative before:mr-4 before:text-[0.5rem] before:font-semibold before:text-white/30 before:content-['◆'] first:before:hidden"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>


      <div className="mt-4 w-full flex justify-center" >
        <img src="/assets/logo/ZOOMCONNECT WITH PEOPLE-02.png" alt="ZoomConnect Logo" className="h-full mt-4" />
      </div>

      <div className="mt-10 border-t border-white/40 pt-2 flex flex-col items-center"></div>

      <div className="mt-2 flex flex-col gap-6 text-xs text-white/45 md:flex-col md:justify-between md:items-center">
        <div className="leading-relaxed space-y-1 max-w-full text-center md:text-center">
          <p>
            <span className="font-semibold text-white/70">Registered & Corporate Office:</span> D-104, Udyog Vihar Phase V, Sector-19, Gurugram, Haryana-122016. CIN: U66000HR2008PTC065899.
          </p>
          <p>
            <span className="font-semibold text-white/70">IRDAI Licence No.: 389.</span> Licence Category: Composite. Licence Expiry: 1st January 2027.
          </p>
          <p>
            Insurance is a subject matter of solicitation.
            {/* Kindly read all policy related documents and take expert advice before taking any insurance or investment decisions. */}
          </p>
        </div>
        <div className="md:text-center mb-4">
          <p className="text-[10px]"> Developed by Novel Healthtech Solutions Pvt. Ltd. </p>
          <p> © {currentYear} Zoom Insurance Brokers Pvt. Ltd. All rights reserved. </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
