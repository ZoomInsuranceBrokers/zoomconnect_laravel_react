import React, { useState } from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

const cities = [
	{
		key: 'bengaluru',
		name: 'Bengaluru',
		address: 'Nova Benefits, 2nd Floor, 91 Springboard, MG Road, Bengaluru, Karnataka 560001',
		mapSrc:
			'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.927812345!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c2c2c2c2%3A0x2c2c2c2c2c2c2c2c!2sMG%20Road%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin',
		icon: (
			<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e2e8f0"/><path d="M12 7v5l3 3" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
		),
	},
	{
		key: 'gurgaon',
		name: 'Gurgaon',
		address: 'Building Number 145, Sector 44 Rd, Sector 44, Gurugram, Haryana 122003',
		mapSrc:
			'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.931434774635!2d77.06796131508368!3d28.45949798248259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193b2b2b2b2b%3A0x2b2b2b2b2b2b2b2b!2sSector%2044%2C%20Gurugram%2C%20Haryana%20122003!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin',
		icon: (
			<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="#e2e8f0"/><path d="M12 8v4l2 2" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
		),
	},
	{
		key: 'mumbai',
		name: 'Mumbai',
		address: 'Nova Benefits, 3rd Floor, WeWork, BKC, Mumbai, Maharashtra 400051',
		mapSrc:
			'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609999998!2d72.74109999999999!3d19.082197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63c2c2c2c2c%3A0x2c2c2c2c2c2c2c2c!2sBKC%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin',
		icon: (
			<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="10" fill="#e2e8f0"/><path d="M12 6v6l4 4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
		),
	},
	{
		key: 'pune',
		name: 'Pune',
		address: 'Nova Benefits, 1st Floor, Tech Park, Pune, Maharashtra 411057',
		mapSrc:
			'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.1160999999997!2d73.74109999999999!3d18.5204303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c2c2c2c2c2c2%3A0x2c2c2c2c2c2c2c2c!2sTech%20Park%2C%20Pune!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin',
		icon: (
			<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e2e8f0"/><path d="M12 9v3l3 3" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
		),
	},
	{
		key: 'chennai',
		name: 'Chennai',
		address: 'Nova Benefits, 4th Floor, Olympia, Chennai, Tamil Nadu 600032',
		mapSrc:
			'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.1160999999997!2d80.24109999999999!3d13.0826802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526c2c2c2c2c2c%3A0x2c2c2c2c2c2c2c2c!2sOlympia%2C%20Chennai!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin',
		icon: (
			<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="6" fill="#e2e8f0"/><path d="M12 10v2l2 2" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
		),
	},
];

export default function Contact() {
	const [form, setForm] = useState({
		name: '',
		phone: '',
		company: '',
		employees: '0-50',
		email: '',
		message: '',
	});

	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [activeCity, setActiveCity] = useState('gurgaon');

	function validate(values) {
		const e = {};
		if (!values.name || values.name.trim().length < 2) {
			e.name = 'Please enter your full name';
		}

		const phoneDigits = (values.phone || '').replace(/[^0-9]/g, '');
		if (!phoneDigits || phoneDigits.length < 7) {
			e.phone = 'Please enter a valid phone number';
		}

		if (!values.company || values.company.trim().length < 2) {
			e.company = 'Please enter your company name';
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!values.email || !emailRegex.test(values.email)) {
			e.email = 'Please enter a valid work email address';
		}

		return e;
	}

	function handleChange(e) {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
		setErrors(prev => ({ ...prev, [name]: undefined }));
		setSuccess(false);
	}

	function handleSubmit(e) {
		e.preventDefault();
		const validation = validate(form);
		setErrors(validation);
		if (Object.keys(validation).length > 0) return;

		setSubmitting(true);
		// Simulate submit (replace with real API call)
		setTimeout(() => {
			setSubmitting(false);
			setSuccess(true);
			setForm({ name: '', phone: '', company: '', employees: '0-50', email: '', message: '' });
		}, 1000);
	}

	return (
		<>
			<Header />
			<div className="bg-[#ffceea78]">

				<section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden py-24">
					<div className="container mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
						{/* Left Section */}
						<div className="md:col-span-7">
							<h1 className="text-4xl md:text-5xl font-semibold font-dmserif text-gray-800 mb-4">Contact Us</h1>
							<p className="text-base text-gray-800 mb-6">Have a query about any of the solutions we provide? Reach out to us anytime — we’re happy to help.</p>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								{/* Contact Cards */}
								<div className="p-3 bg-white rounded-xl shadow-md text-center">
									<div className="text-[#dd4b63] text-3xl mb-4">📧</div>
									<h3 className="text-md font-semibold text-gray-800 ">Write to us at</h3>
									<p className="text-sm text-gray-800 mb-4">Share your queries here</p>
									<a href="mailto:support@zoomconnect.co.in" className="text-[#dd4b63] font-semibold text-sm break-words whitespace-normal md:max-w-xs">support@zoomconnect.co.in</a>
								</div>

								<div className="p-3 bg-white rounded-xl shadow-md text-center">
									<div className="text-[#00b37e] text-3xl mb-4">📱</div>
									<h3 className="text-md font-semibold text-gray-800 ">Chat with us at</h3>
									<p className="text-sm text-gray-800 mb-4">Instantly access policy here</p>
									<a href="tel:+919289695656" className="text-[#00b37e] font-semibold text-sm">+91-9289695656</a>
								</div>

								<div className="p-3 bg-white rounded-xl shadow-md text-center">
									<div className="text-[#0066ff] text-3xl mb-4">📞</div>
									<h3 className="text-md font-semibold text-gray-800 ">Call us at</h3>
									<p className="text-sm text-gray-800 mb-4">Available 24 x 7</p>
									<a href="tel:+918037834753" className="text-[#0066ff] font-semibold text-sm">+91-8037834753</a>
								</div>
							</div>
						</div>

						{/* Right Section */}
						<div className="md:col-span-5">
							<div className="bg-white rounded-lg shadow-md p-6">
								<form onSubmit={handleSubmit} noValidate>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="mb-4">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Full Name *</label>
											<input
												name="name"
												value={form.name}
												onChange={handleChange}
												type="text"
												className={`w-full px-4 py-2 border-2 rounded-lg bg-[#feebff8c] focus:outline-none focus:border-[#934790bd] focus:shadow-none placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium ${errors.name ? 'border-red-500' : 'border-[#93479066]'}`}
												placeholder="Enter your full name"
												aria-invalid={!!errors.name}
												aria-describedby={errors.name ? 'name-error' : undefined}
											/>
											{errors.name && <p id="name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
										</div>
										<div className="mb-4">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Phone Number *</label>
											<input
												name="phone"
												value={form.phone}
												onChange={handleChange}
												type="text"
												className={`w-full px-4 py-2 border-2 rounded-lg bg-[#feebff8c] focus:outline-none focus:border-[#934790bd] focus:shadow-none placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium ${errors.phone ? 'border-red-500' : 'border-[#93479066]'}`}
												placeholder="Enter your phone number"
												aria-invalid={!!errors.phone}
												aria-describedby={errors.phone ? 'phone-error' : undefined}
											/>
											{errors.phone && <p id="phone-error" className="text-red-500 text-xs mt-1">{errors.phone}</p>}
										</div>

										<div className="mb-4">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Company Name *</label>
											<input
												name="company"
												value={form.company}
												onChange={handleChange}
												type="text"
												className={`w-full px-4 py-2 border-2 rounded-lg bg-[#feebff8c] focus:outline-none focus:border-[#934790bd] focus:shadow-none placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium ${errors.company ? 'border-red-500' : 'border-[#93479066]'}`}
												placeholder="Enter the name of your company"
												aria-invalid={!!errors.company}
												aria-describedby={errors.company ? 'company-error' : undefined}
											/>
											{errors.company && <p id="company-error" className="text-red-500 text-xs mt-1">{errors.company}</p>}
										</div>
										<div className="mb-4">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Total Employees </label>
											<select
												name="employees"
												value={form.employees}
												onChange={handleChange}
												className="w-full px-4 py-2 border-2 border-[#93479066] rounded-lg bg-[#feebff8c] focus:outline-none focus:border-[#934790bd] focus:shadow-none placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium"
											>
												<option value="0-50">0-50</option>
												<option value="51-100">51-100</option>
												<option value="101-500">101-500</option>
												<option value="500+">500+</option>
											</select>
										</div>

										<div className="mb-4 md:col-span-2">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Work Email *</label>
											<input
												name="email"
												value={form.email}
												onChange={handleChange}
												type="email"
												className={`w-full px-4 py-2 border-2 rounded-lg bg-[#feebff8c] focus:outline-none focus:border-[#934790bd] focus:shadow-none placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium ${errors.email ? 'border-red-500' : 'border-[#93479066]'}`}
												placeholder="Enter your work email address"
												aria-invalid={!!errors.email}
												aria-describedby={errors.email ? 'email-error' : undefined}
											/>
											{errors.email && <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>}
										</div>
										<div className="mb-4 md:col-span-2">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Message (Optional)</label>
											<textarea
												name="message"
												value={form.message}
												onChange={handleChange}
												className="w-full px-4 py-2 border-2 border-[#93479066] rounded-lg bg-[#feebff8c] focus:outline-none focus:border-[#934790bd] focus:shadow-none placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium"
												placeholder="Enter your message"
											></textarea>
										</div>
									</div>
									{success && <div className="text-green-600 font-medium mb-3">Thanks — your message has been sent.</div>}
									<button type="submit" disabled={submitting} className={`md:w-auto w-full ${submitting ? 'bg-gray-400' : 'bg-[#ff3052] hover:bg-[#ff5470]'} text-white py-2 px-6 rounded-lg font-semibold transition flex items-center justify-center group`}>
										{submitting ? 'Sending...' : 'Submit'}
										<span className="ml-2 transition-transform transform group-hover:translate-x-1">➔</span>
									</button>
								</form>
							</div>
						</div>
					</div>

				</section>
				<div className="bg-[#f9f9f9] py-16">
					<div className="container mx-auto px-6 md:px-12">
						<h2 className="text-xl md:text-5xl font-medium font-dmserif text-gray-800 mb-8">We are present at</h2>
						<div className="grid grid-cols-1 md:grid-cols-12 gap-8">
							{/* Left Section: City Tabs */}
							<div className="md:col-span-6">
								<ul className="space-y-6">
									{cities.map(city => (
										<li key={city.key}>
											<button
												type="button"
												className="w-full flex items-center justify-between text-lg font-semibold text-gray-800 cursor-pointer group"
												onClick={() => setActiveCity(city.key)}
												aria-expanded={activeCity === city.key}
											>
												<span className="flex items-center gap-2 text-gray-500 ">
													<span className="transition-transform duration-200" style={{ transform: activeCity === city.key ? 'rotate(90deg)' : 'rotate(0deg)' }}>
														<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
													</span>
													{city.name}
												</span>
											</button>
											{activeCity === city.key && (
												<div className="mt-3">
													<div className="bg-white rounded-xl shadow-md flex items-center gap-4 p-4">
														<div>{city.icon}</div>
														<div>
															<h3 className="text-md font-semibold text-gray-800 mb-1">{city.name}</h3>
															<p className="text-sm text-gray-800">{city.address}</p>
														</div>
													</div>
												</div>
											)}
										</li>
									))}
								</ul>
							</div>
							{/* Right Section: Address and Map */}
							<div className="md:col-span-6">
								<div className="bg-white rounded-lg shadow-md p-3">
									{/* <h3 className="text-xl font-bold text-gray-800 mb-4">{cities.find(c => c.key === activeCity)?.name}</h3>
									<p className="text-sm text-gray-800 mb-4">{cities.find(c => c.key === activeCity)?.address}</p> */}
									<div className="overflow-hidden rounded-lg">
										<iframe
											src={cities.find(c => c.key === activeCity)?.mapSrc}
											width="100%"
											height="350"
											style={{ border: 0 }}
											allowFullScreen=""
											loading="lazy"
										></iframe>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
