import React from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import { motion } from 'framer-motion';

export default function ResourceShow({ resource }) {
    const getCategoryColor = (category) => {
        const colors = {
            'Guide': 'bg-purple-100 text-purple-700',
            'Whitepaper': 'bg-blue-100 text-blue-700',
            'Case Study': 'bg-green-100 text-green-700',
            'Report': 'bg-orange-100 text-orange-700',
            'Ebook': 'bg-pink-100 text-pink-700',
            'Article': 'bg-teal-100 text-teal-700',
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        if (path.startsWith('/storage')) return path;
        return `/storage/${path.replace(/^\//, '')}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Calculate reading time (average 200 words per minute)
    const getReadingTime = (content) => {
        if (!content) return '5 min read';
        const text = content.replace(/<[^>]*>/g, '');
        const wordCount = text.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / 200);
        return `${minutes} min read`;
    };

    return (
        <>
            <Head title={resource.heading} />
            <Header />
            
            {/* Hero Section */}
            <section className="relative w-full bg-[#ffceea78] overflow-hidden">
                <div className="absolute inset-0 opacity-80 pointer-events-none">
                    <img
                        src="/assets/images/wavy design-01.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#ffceea78] via-transparent to-white/50 pointer-events-none"></div>

                <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        {/* Breadcrumb */}
                        <nav className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                            <Link href="/" className="hover:text-[#934790] transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href="/resources" className="hover:text-[#934790] transition-colors">
                                Resources
                            </Link>
                            <span>/</span>
                            <span className="text-[#934790] font-medium truncate max-w-[200px]">
                                {resource.heading}
                            </span>
                        </nav>

                        {/* Category Badge */}
                        {resource.category && (
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 ${getCategoryColor(resource.category)}`}>
                                {resource.category}
                            </span>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-dmserif font-semibold text-gray-900 leading-tight mb-6">
                            {resource.heading}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
                            {resource.author && (
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-[#934790]/10 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-[#934790]">{resource.author.charAt(0)}</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">{resource.author}</p>
                                        <p className="text-xs text-gray-500">Author</p>
                                    </div>
                                </div>
                            )}
                            
                            {resource.published_at && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{formatDate(resource.published_at)}</span>
                                </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{getReadingTime(resource.content)}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Cover Image */}
            {resource.cover_image && (
                <section className="container mx-auto px-4 -mt-8 relative z-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-5xl mx-auto"
                    >
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src={getImageUrl(resource.cover_image)}
                                alt={resource.heading}
                                className="w-full h-[400px] object-cover"
                            />
                        </div>
                    </motion.div>
                </section>
            )}

            {/* Main Content */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    {/* Tags */}
                    {resource.tags && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-8 flex flex-wrap gap-2"
                        >
                            {resource.tags.split(',').map((tag, idx) => (
                                <span 
                                    key={idx}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-[#934790]/10 hover:text-[#934790] transition-colors duration-300 cursor-pointer"
                                >
                                    #{tag.trim()}
                                </span>
                            ))}
                        </motion.div>
                    )}

                    {/* Article Content */}
                    <motion.article 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="prose prose-lg max-w-none
                            prose-headings:font-dmserif prose-headings:text-gray-900 prose-headings:font-semibold
                            prose-h1:text-4xl prose-h1:mb-8
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-4
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                            prose-a:text-[#934790] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                            prose-strong:text-gray-900 prose-strong:font-semibold
                            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                            prose-li:text-gray-700 prose-li:mb-2
                            prose-blockquote:border-l-4 prose-blockquote:border-[#934790] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
                            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-[#934790] prose-code:text-sm
                            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6
                        "
                        dangerouslySetInnerHTML={{ __html: resource.content }}
                    />

                    {/* Download Section */}
                    {resource.file_url && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-12 p-8 bg-gradient-to-r from-[#934790] to-[#6A0066] rounded-2xl shadow-xl"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-white text-center md:text-left">
                                    <h3 className="text-xl font-bold mb-2">Download Full Resource</h3>
                                    <p className="text-white/80 text-sm">Get the complete document for offline reading and reference.</p>
                                </div>
                                <a
                                    href={getImageUrl(resource.file_url)}
                                    download
                                    className="relative overflow-hidden flex items-center gap-3 bg-white text-[#934790] font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 group"
                                >
                                    <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#FF0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-700 ease-out -translate-x-1/2 z-0"></span>
                                    <svg className="relative z-10 w-5 h-5 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">Download PDF</span>
                                </a>
                            </div>
                        </motion.div>
                    )}

                    {/* Share Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-12 pt-8 border-t border-gray-200"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Share this resource</h4>
                                <div className="flex items-center gap-3">
                                    <a 
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(resource.heading)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                    </a>
                                    <a 
                                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(resource.heading)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                    </a>
                                    <a 
                                        href={`mailto:?subject=${encodeURIComponent(resource.heading)}&body=${encodeURIComponent(window.location.href)}`}
                                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#934790] hover:text-white transition-all duration-300"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            
                            <Link
                                href="/resources"
                                className="inline-flex items-center gap-2 text-[#934790] font-semibold hover:gap-3 transition-all duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to All Resources
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#934790] to-[#6A0066]"></div>
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF0066]/10 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-dmserif font-bold text-gray-900 mb-4">
                            Want to Learn More?
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                            Discover how ZoomConnect can transform your employee benefits management and improve wellness outcomes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/book-demo"
                                className="relative overflow-hidden inline-flex items-center gap-2 bg-[#934790] text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 group"
                            >
                                <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#FF0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-700 ease-out -translate-x-1/2 z-0"></span>
                                <span className="relative z-10">Book a Demo</span>
                                <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 border-2 border-[#934790] text-[#934790] font-bold px-8 py-4 rounded-xl hover:bg-[#934790]/5 transition-all duration-300"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
