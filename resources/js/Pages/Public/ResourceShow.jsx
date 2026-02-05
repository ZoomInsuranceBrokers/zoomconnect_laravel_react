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

                <div className="container mx-auto px-4 pt-20 pb-10 md:pt-32 md:pb-16 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        {/* Breadcrumb */}
                        <nav className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-600 mb-4">
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
                            <>
                                <style jsx>{`
                                    .resource-category-badge {
                                        background-color: #bbf7d0; /* Tailwind bg-green-200 */
                                        color: #166534; /* Tailwind text-green-900 */
                                    }
                                `}</style>
                                <span className={`inline-block w-fit px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-2 resource-category-badge`}>
                                    {resource.category}
                                </span>
                            </>
                        )}

                        {/* Title */}
                        <h1 className="text-xl md:text-4xl lg:text-5xl font-dmserif font-semibold text-gray-900 leading-tight mb-4 md:mb-6 drop-shadow-lg">
                            {resource.heading}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600 flex-wrap">
                            {resource.author && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#934790]/10 flex items-center justify-center">
                                        <span className="text-xs md:text-sm font-semibold text-[#934790]">{resource.author.charAt(0)}</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900 text-xs md:text-sm">{resource.author}</p>
                                        <p className="text-[10px] md:text-xs text-gray-500">Author</p>
                                    </div>
                                </div>
                            )}
                            
                            {resource.published_at && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{formatDate(resource.published_at)}</span>
                                </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <section className="container mx-auto px-4 -mt-4 md:-mt-8 relative z-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-5xl mx-auto"
                    >
                        <div className="rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src={getImageUrl(resource.cover_image)}
                                alt={resource.heading}
                                className="w-full h-[200px] md:h-[400px] object-cover"
                            />
                        </div>
                    </motion.div>
                </section>
            )}

            {/* Main Content */}
            <section className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Tags */}
                    {resource.tags && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-6 md:mb-8 flex flex-wrap gap-2"
                        >
                            {resource.tags.split(',').map((tag, idx) => (
                                <span 
                                    key={idx}
                                    className="px-2.5 py-1 md:px-3 md:py-1 bg-gray-100 text-gray-600 rounded-full text-xs md:text-sm hover:bg-[#934790]/10 hover:text-[#934790] transition-colors duration-300 cursor-pointer"
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
                        className="prose text-xs md:text-base max-w-none
                            prose-headings:font-dmserif prose-headings:text-gray-900 prose-headings:font-semibold
                            prose-h1:text-2xl md:prose-h1:text-4xl prose-h1:mb-6 md:prose-h1:mb-8
                            prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-8 md:prose-h2:mt-12 prose-h2:mb-4 md:prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3 md:prose-h2:pb-4
                            prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-6 md:prose-h3:mt-8 prose-h3:mb-3 md:prose-h3:mb-4
                            prose-p:text-xs md:prose-p:text-base prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 md:prose-p:mb-6 prose-p:font-semibold
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
                            className="mt-8 md:mt-12 p-4 md:p-8 bg-gradient-to-r from-[#934790] to-[#6A0066] rounded-xl md:rounded-2xl shadow-xl"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                                <div className="text-white text-center md:text-left">
                                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Download Full Resource</h3>
                                    <p className="text-white/80 text-xs md:text-sm">Get the complete document for offline reading and reference.</p>
                                </div>
                                <a
                                    href={getImageUrl(resource.file_url)}
                                    download
                                    className="relative overflow-hidden flex items-center gap-2 md:gap-3 bg-white text-[#934790] font-bold px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 group text-sm md:text-base"
                                >
                                    <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#FF0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-700 ease-out -translate-x-1/2 z-0"></span>
                                    <svg className="relative z-10 w-4 h-4 md:w-5 md:h-5 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="mt-4 md:mt-8 pt-6 md:pt-8 border-t border-gray-200"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-end gap-4 md:gap-6">
                           
                            <Link
                                href="/resources"
                                className="inline-flex items-center gap-2 text-[#934790] font-semibold hover:gap-3 transition-all duration-300 text-xs md:text-base justify-end"
                            >
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to All Resources
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            {/* <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#934790] to-[#6A0066]"></div>
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF0066]/10 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-dmserif font-bold text-gray-900 mb-4">
                            Want to Learn More?
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-snug">
                            Discover how ZoomConnect can transform your employee benefits management and improve wellness outcomes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/book-demo"
                                className="relative overflow-hidden inline-flex items-center gap-2 bg-[#934790] text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 group"
                            >
                                <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#FF0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-700 ease-out -translate-x-1/2 z-0"></span>
                                <span className="relative z-10">Book a Demo</span>
                                <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 border-2 border-[#934790] text-[#934790] font-bold px-6 py-2 rounded-xl hover:bg-[#934790]/5 transition-all duration-300"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section> */}

            <Footer />
        </>
    );
}
