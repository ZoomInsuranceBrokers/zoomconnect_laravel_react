import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import { motion } from 'framer-motion';

export default function Blog({ blogs = [] }) {
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Get unique categories from blog_categories
    const categories = ['all', ...new Set(blogs.map(b => b.categories).filter(Boolean))];

    // Filter blogs based on selected category
    const filteredBlogs = selectedCategory === 'all'
        ? blogs
        : blogs.filter(b => b.categories === selectedCategory);

    const getCategoryColor = (category) => {
        const colors = {
            'Health': 'bg-purple-100 text-purple-700',
            'Wellness': 'bg-blue-100 text-blue-700',
            'Benefits': 'bg-green-100 text-green-700',
            'Insurance': 'bg-orange-100 text-orange-700',
            'HR': 'bg-pink-100 text-pink-700',
            'Technology': 'bg-teal-100 text-teal-700',
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    const getImageUrl = (path) => {
        if (!path) return '/assets/images/default-blog-thumbnail.jpg';
        if (path.startsWith('http')) return path;
        if (path.startsWith('/storage')) return path;
        if (path.startsWith('/uploads')) return path;
        return `/storage/${path.replace(/^\//, '')}`;
    };

    return (
        <>
            <Header />

            {/* Hero Section - Minimal Design */}
            <section className="w-full flex items-center justify-center relative overflow-hidden bg-[#ffceea78] pt-20 pb-10 md:py-32">
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <img
                        src="/assets/images/ribbon design-01.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40 pointer-events-none"></div>

                <div className="absolute top-10 left-10 w-32 h-32 bg-[#934790]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#FF0066]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="max-w-4xl mx-auto px-4 z-10 text-center">
                    <div className="mb-6">
                        <motion.h1
                            className="text-lg md:text-5xl font-bold mb-3 drop-shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-[#934790]">Blog</span>
                        </motion.h1>
                        <motion.p
                            className="text-xs md:text-base text-gray-700 max-w-xl mx-auto leading-snug"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Latest insights on employee benefits, wellness, and industry trends. Stay informed with expert perspectives from ZoomConnect.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="relative z-20 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap gap-6 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-medium text-xs md:text-sm transition-all duration-500 ${selectedCategory === category
                                    ? 'bg-[#934790] text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm hover:shadow-md'
                                    }`}
                            >
                                {category === 'all' ? '📚 All Blog Posts' : category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="container mx-auto px-4 py-12">
                {filteredBlogs.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-lg text-gray-500">No blog posts found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBlogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                            >
                                <Link
                                    href={`/blog/${blog.slug}`}
                                    className="group block h-full"
                                >
                                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-500 overflow-hidden h-full flex flex-col group-hover:-translate-y-2 border border-gray-100">
                                        {/* Cover Image */}
                                        {blog.thumbnail && (
                                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                                <img
                                                    src={getImageUrl(blog.thumbnail)}
                                                    alt={blog.thumbnail_alt || blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                {/* Category Badge on Image */}
                                                {blog.categories && (
                                                    <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(blog.categories)} shadow-sm`}>
                                                        {blog.categories}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            {/* Category Badge (if no image) */}
                                            {!blog.thumbnail && blog.categories && (
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 w-fit ${getCategoryColor(blog.categories)}`}>
                                                    {blog.categories}
                                                </span>
                                            )}

                                            {/* Title */}
                                            <h3 className="text-sm md:text-xl font-bold text-gray-800 mb-2 group-hover:text-[#934790] transition-colors duration-500 line-clamp-2">
                                                {blog.title}
                                            </h3>

                                            {/* Excerpt */}
                                            {blog.excerpt && (
                                                <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-3 flex-1 leading-relaxed">
                                                    {blog.excerpt}
                                                </p>
                                            )}

                                            {/* Meta Info */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    {blog.author && (
                                                        <>
                                                            <div className="w-5 h-5 rounded-full bg-[#934790]/10 flex items-center justify-center">
                                                                <span className="text-xs font-semibold text-[#934790]">{blog.author.charAt(0)}</span>
                                                            </div>
                                                            <span className="font-medium">{blog.author}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {blog.date && (
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(blog.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Read More Link */}
                                            <div className="mt-3">
                                                <span className="inline-flex items-center text-[#934790] font-semibold text-xs group-hover:gap-2 transition-all duration-500">
                                                    Read More
                                                    <svg className="w-3 h-3 ml-1 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {blog.tags && (
                                            <div className="px-6 pb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {blog.tags.split(',').slice(0, 3).map((tag, idx) => (
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


            <Footer />
        </>
    );
}
