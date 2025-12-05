import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import { motion } from 'framer-motion';

export default function Resources({ resources }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    // Get unique categories
    const categories = ['all', ...new Set(resources.map(r => r.category).filter(Boolean))];
    
    // Filter resources based on selected category
    const filteredResources = selectedCategory === 'all' 
        ? resources 
        : resources.filter(r => r.category === selectedCategory);

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

    return (
        <>
            <Header />
            
            {/* Hero Section styled like Group Medical Cover */}
            <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#ffceea78] text-gray-900">
                <div className="absolute inset-0 opacity-80 pointer-events-none">
                    <img
                        src="/assets/images/wavy design-01.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Gradient overlay from top */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#ffceea78] via-transparent to-white/30 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-8 pt-12 pb-4 grid grid-cols-1 md:grid-cols-2 gap-12 z-10 items-center">
                    <div className="space-y-5">
                        <h1 className="text-4xl md:text-5xl font-dmserif font-semibold leading-tight text-gray-800">
                            Resources & <span className="text-[#FF0066]/80">Insights</span>
                        </h1>
                        <p className="text-sm md:text-base opacity-90">
                            Guides, whitepapers, and practical materials to help you make informed decisions about employee benefits and wellness programs.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/book-demo"
                                className="relative overflow-hidden bg-[#FF0066]/80 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:bg-[#df0059cc] hover:text-white transition-all duration-500 group"
                            >
                                <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#6A0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-700 ease-out -translate-x-1/2 z-0"></span>
                                <span className="relative z-10">Schedule a Call</span>
                            </Link>
                            <Link
                                href="/contact"
                                className="relative overflow-hidden border border-[#E8D4B7] bg-[#934790] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#6a0066] hover:text-white transition-all duration-500 group"
                            >
                                <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#FF0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-700 ease-out -translate-x-1/2 z-0"></span>
                                <span className="relative z-10">Contact Us</span>
                            </Link>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative overflow-hidden w-80 md:w-[350px] p-6">
                            <img className="w-full h-full object-cover" src="/assets/images/gmc_groupmedical.png" alt="Resources hero section" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="bg-gray-50 border-b border-gray-200 sticky top-0 z-30">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-500 ${
                                    selectedCategory === category
                                        ? 'bg-[#934790] text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm hover:shadow-md'
                                }`}
                            >
                                {category === 'all' ? 'All Resources' : category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="container mx-auto px-4 py-16">
                {filteredResources.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No resources found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredResources.map((resource, index) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                            >
                                <Link 
                                    href={`/resources/${resource.slug}`}
                                    className="group block h-full"
                                >
                                    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-700 overflow-hidden h-full flex flex-col group-hover:-translate-y-3 border border-gray-100">
                                        {/* Cover Image */}
                                        {resource.cover_image && (
                                            <div className="relative h-52 overflow-hidden bg-gray-100">
                                                <img 
                                                    src={getImageUrl(resource.cover_image)}
                                                    alt={resource.heading}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                {/* Category Badge on Image */}
                                                {resource.category && (
                                                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(resource.category)} shadow-sm`}>
                                                        {resource.category}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            {/* Category Badge (if no image) */}
                                            {!resource.cover_image && resource.category && (
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 w-fit ${getCategoryColor(resource.category)}`}>
                                                    {resource.category}
                                                </span>
                                            )}
                                            
                                            {/* Title */}
                                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#934790] transition-colors duration-500 line-clamp-2">
                                                {resource.heading}
                                            </h3>
                                            
                                            {/* Excerpt from content */}
                                            {resource.content && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                                                    {resource.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                                </p>
                                            )}
                                            
                                            {/* Meta Info */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    {resource.author && (
                                                        <>
                                                            <div className="w-6 h-6 rounded-full bg-[#934790]/10 flex items-center justify-center">
                                                                <span className="text-xs font-semibold text-[#934790]">{resource.author.charAt(0)}</span>
                                                            </div>
                                                            <span className="font-medium">{resource.author}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {resource.published_at && (
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(resource.published_at).toLocaleDateString('en-US', { 
                                                            year: 'numeric', 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Read More Link */}
                                            <div className="mt-4">
                                                <span className="inline-flex items-center text-[#934790] font-semibold text-sm group-hover:gap-2 transition-all duration-500">
                                                    Read More
                                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Tags */}
                                        {resource.tags && (
                                            <div className="px-6 pb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {resource.tags.split(',').slice(0, 3).map((tag, idx) => (
                                                        <span 
                                                            key={idx}
                                                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-[#934790]/10 hover:text-[#934790] transition-colors duration-300"
                                                        >
                                                            #{tag.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#934790] to-[#6A0066]"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF0066]/10 rounded-full blur-3xl"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-dmserif font-bold text-white mb-4">
                            Ready to Transform Your Employee Benefits?
                        </h2>
                        <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                            Let's discuss how ZoomConnect can help streamline your benefits management and improve employee wellness.
                        </p>
                        <Link
                            href="/book-demo"
                            className="relative overflow-hidden inline-flex items-center gap-2 bg-white text-[#934790] font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 group"
                        >
                            <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#FF0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-700 ease-out -translate-x-1/2 z-0"></span>
                            <span className="relative z-10 group-hover:text-white transition-colors duration-500">Book a Demo</span>
                            <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 group-hover:text-white transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
