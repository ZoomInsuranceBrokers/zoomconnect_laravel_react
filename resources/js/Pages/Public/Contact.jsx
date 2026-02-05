import React, { useState } from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

const cities = [
	{
		key: 'bengaluru',
		name: 'Bengaluru',
		address: '6/13, Prim Rose Road, Gurappa Avenue, Bengaluru, Bengaluru Urban, Karnataka, 560025',
		mapSrc:
			'https://www.google.com/maps?q=6/13,+Prim+Rose+Road,+Gurappa+Avenue,+Bengaluru,+Bengaluru+Urban,+Karnataka,+560025&output=embed',
		icon: <img src="/assets/logo/contact Us logo/Vidhan-souda.png" alt="Bengaluru" width="96" height="96" />,
	},
	{
		key: 'gurgaon',
		name: 'Gurgaon',
		address: 'D-104, Udyog Vihar Phase V, Sector-19, Gurugram, Haryana 122 016',
		mapSrc:
			'https://www.google.com/maps?q=D-104,+Udyog+Vihar+Phase+V,+Sector-19,+Gurugram,+Haryana+122016&output=embed',
		icon: <img src="/assets/logo/contact Us logo/gurgaon.png" alt="Gurgaon" width="96" height="96" />,
	},
	{
		key: 'mumbai',
		name: 'Mumbai',
		address: 'Awfis, 4th Floor, Skyline Icon, Marol, Andheri Kurla Road, Mittal Industrial Estate, Andheri East, Mumbai 400059',
		mapSrc:
			'https://www.google.com/maps?q=Awfis,+4th+Floor,+Skyline+Icon,+Marol,+Andheri+Kurla+Road,+Mittal+Industrial+Estate,+Andheri+East,+Mumbai+400059&output=embed',
		icon: <img src="/assets/logo/contact Us logo/Gateway-of-india.png" alt="Mumbai" width="96" height="96" />,
	},
	{
		key: 'pune',
		name: 'Pune',
		address: 'Unit No. 307, 3rd floor in the building known as Koncord, located at S.No. 364 CTS No. 1/1 F.P. No. 256 Koncord Tower, Pune City, Pune 411001 ("Building")',
		mapSrc:
			'https://www.google.com/maps?q=Unit+No.+307,+3rd+floor,+Koncord+Tower,+S.No.+364+CTS+No.+1/1+F.P.+No.+256,+Pune+City,+Pune+411001&output=embed',
		icon: <img src="/assets/logo/contact Us logo/pune.png" alt="Pune" width="96" height="96" />,
	},
	{
		key: 'chennai',
		name: 'Chennai',
		address: 'Flat No. 1, Basement Door New No. 2 (Old No 37) Conron Smith road, Gopalapuram, Chennai - 600 086',
		mapSrc:
			'https://www.google.com/maps?q=Flat+No.+1,+Basement+Door+New+No.+2+(Old+No+37)+Conron+Smith+road,+Gopalapuram,+Chennai+-+600+086&output=embed',
		icon: <img src="/assets/logo/contact Us logo/chennai.png" alt="Chennai" width="96" height="96" />,
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
			<div className="bg-[#ffceea78] pb-8 md:pb-16">

				<section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden py-16 md:py-24">
					{/* Background image behind section content */}
					<div className="absolute inset-0 opacity-70 pointer-events-none -z-10">
						<img
							src="/assets/images/wavy design-01.png"
							alt="Background"
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
						{/* Left Section */}
						<div className="lg:col-span-7 flex flex-col justify-center">
							<h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-dmserif text-gray-800 mb-3 md:mb-4">Contact Us </h1>
							<p className="text-xs md:text-base text-gray-800 mb-6">Have a query about any of the solutions we provide? Reach out to us anytime — we're happy to help.</p>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 lg:mb-0">
								{/* Contact Cards */}
								<div className="p-4 md:p-3 bg-white rounded-xl shadow-md text-center">
									<div className="flex justify-center mb-3 md:mb-4">
										<div className="w-12 h-12 rounded-full bg-[#FFF4E6] flex items-center justify-center">
											<svg className="w-6 h-6 text-[#dd4b63]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
											</svg>
										</div>
									</div>
									<h3 className="text-sm md:text-md font-semibold text-gray-800">Write to us at</h3>
									<p className="text-xs md:text-sm text-gray-800 mb-3 md:mb-4">Share your queries here</p>
									<a href="mailto:support@zoomconnect.co.in" className="text-[#FF0066]/80 font-semibold text-xs md:text-sm break-words whitespace-normal">support@zoomconnect.co.in</a>
								</div>

								<div className="p-4 md:p-3 bg-white rounded-xl shadow-md text-center">
									<div className="flex justify-center mb-3 md:mb-4">
										<div className="w-12 h-12 rounded-full bg-[#E6F7F5] flex items-center justify-center">
											<svg className="w-6 h-6 text-[#00b37e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
											</svg>
										</div>
									</div>
									<h3 className="text-sm md:text-md font-semibold text-gray-800">Chat with us at</h3>
									<p className="text-xs md:text-sm text-gray-800 mb-3 md:mb-4">Instantly access policy here</p>
									<a href="tel:+919289695656" className="text-[#FF0066]/80 font-semibold text-xs md:text-sm">+91-9289695656</a>
								</div>

								<div className="p-4 md:p-3 bg-white rounded-xl shadow-md text-center">
									<div className="flex justify-center mb-3 md:mb-4">
										<div className="w-12 h-12 rounded-full bg-[#E6F2FF] flex items-center justify-center">
											<svg className="w-6 h-6 text-[#0066ff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
											</svg>
										</div>
									</div>
									<h3 className="text-sm md:text-md font-semibold text-gray-800">Call us at</h3>
									<p className="text-xs md:text-sm text-gray-800 mb-3 md:mb-4">Available 24 x 7</p>
									<a href="tel:+918037834753" className="text-[#FF0066]/80 font-semibold text-xs md:text-sm">+91-8037834753</a>
								</div>
							</div>
						</div>

						{/* Right Section */}
						<div className="lg:col-span-5">
							<div className="bg-white rounded-2xl shadow-2xl p-5 md:p-6 transform perspective-1000" style={{ boxShadow: '0 30px 80px rgba(147, 71, 144, 0.3), 0 15px 40px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(147, 71, 144, 0.1)', transform: 'translateZ(20px) rotateX(2deg)' }}>
								<form onSubmit={handleSubmit} noValidate>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="mb-2 md:mb-2">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Full Name *</label>
											<input
												name="name"
												value={form.name}
												onChange={handleChange}
												type="text"
												className={`w-full px-4 py-1 md:py-2 border-2 rounded-lg bg-[#feebff8c] focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent focus:bg-[#feebff8c] placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium ${errors.name ? 'border-red-500' : 'border-[#93479066]'}`}
												placeholder="Enter your full name"
												aria-invalid={!!errors.name}
												aria-describedby={errors.name ? 'name-error' : undefined}
											/>
											{errors.name && <p id="name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
										</div>
										<div className="mb-2 md:mb-2">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Phone Number *</label>
											<input
												name="phone"
												value={form.phone}
												onChange={handleChange}
												type="text"
												className={`w-full px-4 py-1 md:py-2 border-2 rounded-lg bg-[#feebff8c] focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent focus:bg-[#feebff8c] placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium ${errors.phone ? 'border-red-500' : 'border-[#93479066]'}`}
												placeholder="Enter your phone number"
												aria-invalid={!!errors.phone}
												aria-describedby={errors.phone ? 'phone-error' : undefined}
											/>
											{errors.phone && <p id="phone-error" className="text-red-500 text-xs mt-1">{errors.phone}</p>}
										</div>

										<div className="mb-2 md:mb-2">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Company Name *</label>
											<input
												name="company"
												value={form.company}
												onChange={handleChange}
												type="text"
												className={`w-full px-4 py-1 md:py-2 border-2 rounded-lg bg-[#feebff8c] focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent focus:bg-[#feebff8c] placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium ${errors.company ? 'border-red-500' : 'border-[#93479066]'}`}
												placeholder="Enter the name of your company"
												aria-invalid={!!errors.company}
												aria-describedby={errors.company ? 'company-error' : undefined}
											/>
											{errors.company && <p id="company-error" className="text-red-500 text-xs mt-1">{errors.company}</p>}
										</div>
										<div className="mb-2 md:mb-2">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Total Employees </label>
											<select
												name="employees"
												value={form.employees}
												onChange={handleChange}
												className="w-full px-4 py-1 md:py-2 border-2 border-[#93479066] rounded-lg bg-[#feebff8c] focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent focus:bg-[#feebff8c] placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium"
											>
												<option value="0-50">0-50</option>
												<option value="51-100">51-100</option>
												<option value="101-500">101-500</option>
												<option value="500+">500+</option>
											</select>
										</div>

										<div className="mb-2 md:mb-2 md:col-span-2">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Work Email *</label>
											<input
												name="email"
												value={form.email}
												onChange={handleChange}
												type="email"
												className={`w-full px-4 py-1 md:py-2 border-2 rounded-lg bg-[#feebff8c] focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent focus:bg-[#feebff8c] placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium ${errors.email ? 'border-red-500' : 'border-[#93479066]'}`}
												placeholder="Enter your work email address"
												aria-invalid={!!errors.email}
												aria-describedby={errors.email ? 'email-error' : undefined}
											/>
											{errors.email && <p id="email-error" className="text-red-500 text-xs mt-1">{errors.email}</p>}
										</div>
										<div className="mb-2 md:mb-2 md:col-span-2">
											<label className="block text-sm font-semibold text-gray-600 mb-2">Message (Optional)</label>
											<textarea
												name="message"
												value={form.message}
												onChange={handleChange}
												className="w-full px-4 py-1 md:py-2 border-2 border-[#93479066] rounded-lg bg-[#feebff8c] focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent focus:bg-[#feebff8c] placeholder:text-xs md:placeholder:text-sm placeholder:text-gray-400 placeholder:font-medium"
												placeholder="Enter your message"
												rows="3"
											></textarea>
										</div>
									</div>
									{success && <div className="text-green-600 font-medium mb-3 text-sm md:text-base">Thanks — your message has been sent.</div>}
								<div className="md:flex md:justify-center">
									<button type="submit" disabled={submitting} className={`w-full md:w-auto ${submitting ? 'bg-gray-400' : 'bg-[#ff3052] hover:bg-[#ff5470]'} text-white py-2 md:py-2 px-6 text-sm md:text-base rounded-lg font-semibold transition flex items-center justify-center group`}>
										{submitting ? 'Sending...' : 'Submit'}
										<span className="ml-2 transition-transform transform group-hover:translate-x-1">➔</span>
									</button>
								</div>
								</form>
							</div>
						</div>
					</div>

			</section>
			<section className="py-8 md:py-16 px-4 md:px-12">
				<div className="md:w-[95%] mx-auto py-4 md:py-12">
					<div className="container mx-auto px-4 md:px-6 lg:px-12">
						<h2 className="text-2xl md:text-3xl lg:text-5xl font-medium font-dmserif text-gray-800 mb-6 md:mb-8 text-center lg:text-left">We are present at</h2>
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
							{/* Left Section: City Tabs */}
							<div className="lg:col-span-6">
								<ul className="space-y-4 md:space-y-6 lg:space-y-8">
									{cities.map(city => (
										<li key={city.key}>
											{/* If this city is not active show the clickable header (arrow + name). */}
											{activeCity !== city.key && (
												<button
													type="button"
													className="w-full flex items-center justify-between text-base md:text-lg font-semibold text-gray-800 cursor-pointer group hover:text-gray-600"
													onClick={() => setActiveCity(city.key)}
													aria-expanded={activeCity === city.key}
												>
													<span className="flex items-center gap-3 text-gray-500">
														<span className="transition-transform duration-200" style={{ transform: activeCity === city.key ? 'rotate(90deg)' : 'rotate(0deg)' }}>
															<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
														</span>
														{city.name}
													</span>
													</button>
												)}

											{/* When the city is active show only the expanded container (no header). */}
											{activeCity === city.key && (
												<div className="mt-3">
													{/* Fixed height for active city card; content scrolls if it overflows */}
													<div className="bg-white rounded-xl shadow-lg flex flex-col sm:flex-row items-start gap-4 p-4 md:p-5">
														<div className="flex-shrink-0 mx-auto sm:mx-0">{city.icon}</div>
														<div className="text-center sm:text-left w-full">
															<h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">{city.name}</h3>
															<p className="text-xs md:text-sm text-gray-700 leading-relaxed">{city.address}</p>
														</div>
													</div>
												</div>
											)}
										</li>
									))}
								</ul>
							</div>
							{/* Right Section: Address and Map */}
							<div className="lg:col-span-6 mt-6 lg:mt-0">
								<div className="bg-white rounded-lg shadow-lg p-3 md:p-4">
									<div className="overflow-hidden rounded-lg">
										<iframe
											src={cities.find(c => c.key === activeCity)?.mapSrc}
											width="100%"
											height="300"
											className="md:h-[350px] lg:h-[400px]"
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
				</section>
			</div>
			<Footer />
		</>
	);
}
