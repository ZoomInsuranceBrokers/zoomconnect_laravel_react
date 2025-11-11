import React, { useState, useRef } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, router } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Create() {
    const { darkMode } = useTheme();
    const [form, setForm] = useState({
        blog_title: '',
        blog_slug: '',
        blog_author: '',
        blog_thumbnail_alt: '',
        blog_banner_alt: '',
        blog_content: '',
        blog_date: '',
        focus_keyword: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_title: '',
        og_description: '',
        twitter_title: '',
        twitter_description: '',
        blog_tags: '',
        blog_categories: '',
        is_active: true,
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [previewHtml, setPreviewHtml] = useState('');
    const editorRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach(k => data.append(k, form[k]));
        if (thumbnailFile) data.append('blog_thumbnail', thumbnailFile);
        if (bannerFile) data.append('blog_banner', bannerFile);

        // send via Inertia
        router.post(route('superadmin.admin.blogs.store'), data);
    };

    const updateContentFromEditor = () => {
        const html = editorRef.current ? editorRef.current.innerHTML : '';
        setForm(f => ({ ...f, blog_content: html }));
        setPreviewHtml(html);
    };

    return (
        <SuperAdminLayout>
            <Head title="Create Blog" />
            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create Blog</h1>
                    <div className="text-sm text-gray-500">Make sure content is SEO friendly</div>
                </div>

                <div className={`rounded-lg p-4 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="text-[12px] md:text-sm font-semibold mb-2">Post Details</div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <div className="mb-3">
                                <label className="block text-[10px] md:text-xs font-medium mb-1">Title *</label>
                                <input type="text" value={form.blog_title} onChange={e => setForm({ ...form, blog_title: e.target.value })} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} required />
                            </div>

                            <div className="mb-3">
                                <label className="block text-[10px] md:text-xs font-medium mb-1">Slug</label>
                                <input type="text" value={form.blog_slug} onChange={e => setForm({ ...form, blog_slug: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                            </div>

                            <div className="mb-3">
                                <label className="block text-[10px] md:text-xs font-medium mb-1">Author</label>
                                <input type="text" value={form.blog_author} onChange={e => setForm({ ...form, blog_author: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                            </div>

                            <div className="mb-3">
                                <label className="block text-[10px] md:text-xs font-medium mb-1">Thumbnail</label>
                                <input type="file" onChange={e => setThumbnailFile(e.target.files[0])} className="w-full" />
                                {thumbnailFile && <div className="mt-2 text-xs text-gray-500">Selected: {thumbnailFile.name}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="block text-[10px] md:text-xs font-medium mb-1">Banner</label>
                                <input type="file" onChange={e => setBannerFile(e.target.files[0])} className="w-full" />
                                {bannerFile && <div className="mt-2 text-xs text-gray-500">Selected: {bannerFile.name}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="block text-[10px] md:text-xs font-medium mb-1">Tags</label>
                                <input type="text" value={form.blog_tags} onChange={e => setForm({ ...form, blog_tags: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} placeholder="comma separated" />
                            </div>

                            <div className="mb-3">
                                <label className="block text-[10px] md:text-xs font-medium mb-1">Categories</label>
                                <input type="text" value={form.blog_categories} onChange={e => setForm({ ...form, blog_categories: e.target.value })} className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} placeholder="comma separated" />
                            </div>
                        </div>

                        <div>
                            <div className="mb-3">
                                <label className="block text-[10px] md:text-xs font-medium mb-1">Content (Rich Text)</label>
                                <div ref={editorRef} contentEditable className={`p-3 border min-h-[220px] rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`} onInput={updateContentFromEditor} dangerouslySetInnerHTML={{ __html: form.blog_content }} />
                                <div className="mt-2 text-xs text-gray-500">You can paste formatted HTML here. Use the preview to check rendering.</div>
                            </div>

                            <div className="mb-3 flex items-center gap-4">
                                <button type="button" onClick={() => { setPreviewHtml(form.blog_content); }} className="px-3 py-2 bg-gray-100 rounded-lg text-[13px]">Update Preview</button>
                                <label className="inline-flex items-center"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="mr-2" /> <span className="text-xs">Active</span></label>
                            </div>

                            <div className="mb-3">
                                <label className="block text-[10px] md:text-xs font-medium mb-1">Live Preview</label>
                                <div className={`p-3 border rounded-lg min-h-[200px] ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`} dangerouslySetInnerHTML={{ __html: previewHtml }} />
                            </div>

                            <div className="mt-4 flex justify-end gap-3">
                                <button type="submit" className="bg-[#934790] hover:bg-[#6A0066] text-white px-4 py-2 rounded-lg">Publish</button>
                                <button type="button" onClick={() => window.history.back()} className="px-4 py-2 rounded-lg border">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
