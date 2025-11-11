import React, { useState, useRef, useEffect } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, router } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Edit({ blog }) {
    const { darkMode } = useTheme();
    const [form, setForm] = useState({
        blog_title: blog.blog_title || '',
        blog_slug: blog.blog_slug || '',
        blog_author: blog.blog_author || '',
        blog_thumbnail_alt: blog.blog_thumbnail_alt || '',
        blog_banner_alt: blog.blog_banner_alt || '',
        blog_content: blog.blog_content || '',
        blog_date: blog.blog_date || '',
        focus_keyword: blog.focus_keyword || '',
        meta_title: blog.meta_title || '',
        meta_description: blog.meta_description || '',
        meta_keywords: blog.meta_keywords || '',
        og_title: blog.og_title || '',
        og_description: blog.og_description || '',
        twitter_title: blog.twitter_title || '',
        twitter_description: blog.twitter_description || '',
        blog_tags: blog.blog_tags || '',
        blog_categories: blog.blog_categories || '',
        is_active: blog.is_active ?? true,
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(form.blog_content || '');
    const editorRef = useRef(null);

    useEffect(() => {
        setPreviewHtml(form.blog_content || '');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach(k => data.append(k, form[k]));
        if (thumbnailFile) data.append('blog_thumbnail', thumbnailFile);
        if (bannerFile) data.append('blog_banner', bannerFile);

        router.put(route('superadmin.admin.blogs.update', blog.id), data);
    };

    const updateContentFromEditor = () => {
        const html = editorRef.current ? editorRef.current.innerHTML : '';
        setForm(f => ({ ...f, blog_content: html }));
        setPreviewHtml(html);
    };

    return (
        <SuperAdminLayout>
            <Head title="Edit Blog" />
            <div className="p-4">
                <h1 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Blog</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <div className="mb-3">
                            <label className="text-xs">Title</label>
                            <input type="text" value={form.blog_title} onChange={e => setForm({ ...form, blog_title: e.target.value })} className="w-full p-2 border rounded" required />
                        </div>
                        <div className="mb-3">
                            <label className="text-xs">Slug</label>
                            <input type="text" value={form.blog_slug} onChange={e => setForm({ ...form, blog_slug: e.target.value })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-3">
                            <label className="text-xs">Author</label>
                            <input type="text" value={form.blog_author} onChange={e => setForm({ ...form, blog_author: e.target.value })} className="w-full p-2 border rounded" />
                        </div>

                        <div className="mb-3">
                            <label className="text-xs">Thumbnail</label>
                            <input type="file" onChange={e => setThumbnailFile(e.target.files[0])} className="w-full" />
                        </div>
                        <div className="mb-3">
                            <label className="text-xs">Banner</label>
                            <input type="file" onChange={e => setBannerFile(e.target.files[0])} className="w-full" />
                        </div>

                        <div className="mb-3">
                            <label className="text-xs">Tags (comma separated)</label>
                            <input type="text" value={form.blog_tags} onChange={e => setForm({ ...form, blog_tags: e.target.value })} className="w-full p-2 border rounded" />
                        </div>

                        <div className="mb-3">
                            <label className="text-xs">Categories (comma separated)</label>
                            <input type="text" value={form.blog_categories} onChange={e => setForm({ ...form, blog_categories: e.target.value })} className="w-full p-2 border rounded" />
                        </div>

                        <div className="mb-3">
                            <label className="text-xs">Publish Date</label>
                            <input type="datetime-local" value={form.blog_date} onChange={e => setForm({ ...form, blog_date: e.target.value })} className="w-full p-2 border rounded" />
                        </div>

                    </div>

                    <div>
                        <div className="mb-3">
                            <label className="text-xs">Content (Rich Text)</label>
                            <div ref={editorRef} contentEditable className={`p-3 border min-h-[200px] rounded ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`} onInput={updateContentFromEditor} dangerouslySetInnerHTML={{ __html: form.blog_content }} />
                        </div>

                        <div className="mb-3">
                            <button type="button" onClick={() => setPreviewHtml(form.blog_content)} className="mr-2 px-3 py-2 bg-gray-200 rounded">Update Preview</button>
                            <label className="inline-flex items-center ml-4"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="mr-2"/> Active</label>
                        </div>

                        <div className="mb-3">
                            <label className="text-xs">Live Preview</label>
                            <div className={`p-3 border rounded min-h-[200px] ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`} dangerouslySetInnerHTML={{ __html: previewHtml }} />
                        </div>

                        <div className="mt-4">
                            <button type="submit" className="bg-[#934790] text-white px-4 py-2 rounded">Save Changes</button>
                        </div>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
