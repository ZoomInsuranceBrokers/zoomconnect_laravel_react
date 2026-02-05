import React from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import { motion } from 'framer-motion';

export default function SingleBlog({ blog, relatedBlogs = [] }) {
    const getImageUrl = (path) => {
        if (!path) return '/assets/images/default-blog-banner.jpg';
        if (path.startsWith('http')) return path;
        if (path.startsWith('/storage')) return path;
        if (path.startsWith('/uploads')) return path;
        return `/storage/${path.replace(/^\//, '')}`;
    };

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

    return (
        <>
            <Head>
                <title>{blog.meta_title || blog.title}</title>
                <meta name="description" content={blog.meta_description || blog.excerpt} />
                <meta name="keywords" content={blog.meta_keywords || ''} />

                {/* Open Graph Tags */}
                <meta property="og:title" content={blog.og_title || blog.title} />
                <meta property="og:description" content={blog.og_description || blog.meta_description} />
                <meta property="og:image" content={getImageUrl(blog.banner || blog.thumbnail)} />
                <meta property="og:type" content="article" />

                {/* Twitter Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={blog.twitter_title || blog.title} />
                <meta name="twitter:description" content={blog.twitter_description || blog.meta_description} />
                <meta name="twitter:image" content={getImageUrl(blog.banner || blog.thumbnail)} />
            </Head>

            <Header />

            {/* Blog Header with Banner */}
            <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                {/* Banner Image */}
                <div className="absolute inset-0">
                    <img
                        src={getImageUrl(blog.banner || blog.thumbnail)}
                        alt={blog.banner_alt || blog.thumbnail_alt || blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
                </div>

                {/* Blog Title & Meta */}
                <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 text-center text-white flex flex-col justify-end h-full">
                    {/* Category Badge */}
                    {blog.categories && (
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${getCategoryColor(blog.categories)}`}
                        >
                            {blog.categories}
                        </motion.span>
                    )}

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg md:text-4xl font-bold mb-6 drop-shadow-2xl text-white"
                    >
                        {blog.title}
                    </motion.h1>

                    {/* Meta Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="flex items-center justify-center gap-6 text-white/90 mt-4"
                    >
                        {blog.author && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                                    <span className="text-xs md:text-sm font-semibold text-white">{blog.author.charAt(0)}</span>
                                </div>
                                <span className="text-xs md:text-sm font-medium text-white">{blog.author}</span>
                            </div>
                        )}
                        {blog.date && (
                            <>
                                <span className="text-xs md:text-sm text-white/70">•</span>
                                <span className="text-xs md:text-sm text-white">
                                    {new Date(blog.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Blog Content */}
            <section className="container mx-auto px-4 py-4 md:py-16 max-w-6xl bg-gray-50 border border-transparent shadow-2xl rounded-xl my-8">
                <div className="flex items-center justify-center max-w-4xl mx-auto gap-4 mb-8">
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="prose text-xs md:text-base prose-gray max-w-none
                        prose-headings:text-gray-800 prose-headings:font-bold
                        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                        prose-p:text-gray-700 prose-p:leading-relaxed
                        prose-a:text-[#934790] prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-gray-900 prose-strong:font-semibold
                        prose-img:rounded-2xl prose-img:shadow-lg
                        prose-blockquote:border-l-4 prose-blockquote:border-[#934790] prose-blockquote:bg-purple-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic
                        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                        prose-ul:list-disc prose-ol:list-decimal"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    {blog.tags && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags:</h3>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.split(',').map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-[#934790]/10 hover:text-[#934790] transition-colors duration-300 cursor-pointer"
                                    >
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </section>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
                <section className="bg-gray-50 py-8">
                    <div className="container mx-auto px-4">
                        <h2 className="text-lg md:text-3xl font-bold text-gray-800 mb-8 text-center">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {relatedBlogs.map((relatedBlog) => (
                                <Link
                                    key={relatedBlog.id}
                                    href={`/blog/${relatedBlog.slug}`}
                                    className="group block bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
                                >
                                    {relatedBlog.thumbnail && (
                                        <div className="relative h-48 overflow-hidden bg-gray-100">
                                            <img
                                                src={getImageUrl(relatedBlog.thumbnail)}
                                                alt={relatedBlog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-sm md:text-xl font-bold text-gray-800 mb-2 group-hover:text-[#934790] transition-colors duration-300 line-clamp-2">
                                            {relatedBlog.title}
                                        </h3>
                                        <p className="text-gray-600 text-xs  md:text-sm mb-3 line-clamp-2">
                                            {relatedBlog.excerpt}
                                        </p>
                                        {relatedBlog.date && (
                                            <span className="text-xs text-gray-400">
                                                {new Date(relatedBlog.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </>
    );
}
