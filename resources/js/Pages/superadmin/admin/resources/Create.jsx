import React, { useState, useRef, useEffect } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, router } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Create() {
    const { darkMode } = useTheme();
    const primary = '#934790';

    const [form, setForm] = useState({
        heading: '',
        slug: '',
        tags: '',
        category: '',
        content: '',
        author: '',
        status: 'draft',
        published_at: '',
    });

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [slugAuto, setSlugAuto] = useState(true);
    const quillElementRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        // create preview URL when coverImage changes
        if (coverImage) {
            const url = URL.createObjectURL(coverImage);
            setCoverPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setCoverPreview(null);
        }
    }, [coverImage]);

    useEffect(() => {
        // auto-generate slug when heading changes (if slugAuto enabled)
        if (slugAuto && form.heading) {
            const s = form.heading
                .toString()
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setForm(f => ({ ...f, slug: s }));
        }
    }, [form.heading, slugAuto]);

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setFileName(f.name);
    };

    const handleCover = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setCoverImage(f);
    };

    // Load Quill editor (CDN) and initialize with toolbar that includes font, size and alignment
    useEffect(() => {
        const loadQuill = () => {
            if (!window.Quill) return;

            const FontAttributor = window.Quill.import('formats/font');
            FontAttributor.whitelist = ['montserrat','arial','georgia','times-new-roman','courier-new','verdana','segoe-ui','sans-serif'];
            window.Quill.register(FontAttributor, true);

            const toolbarOptions = [
                [{ 'font': FontAttributor.whitelist }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ];

            // inject font css mapping
                if (!document.getElementById('quill-fonts-style')) {
                const style = document.createElement('style');
                style.id = 'quill-fonts-style';
                style.innerHTML = `
                    .ql-snow .ql-font-montserrat{font-family: Montserrat, sans-serif}
                    .ql-snow .ql-font-arial{font-family: Arial, Helvetica, sans-serif}
                    .ql-snow .ql-font-georgia{font-family: Georgia, serif}
                    .ql-snow .ql-font-times-new-roman{font-family: 'Times New Roman', Times, serif}
                    .ql-snow .ql-font-courier-new{font-family: 'Courier New', Courier, monospace}
                    .ql-snow .ql-font-verdana{font-family: Verdana, Geneva, sans-serif}
                    .ql-snow .ql-font-segoe-ui{font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif}
                        .ql-snow .ql-font-sans-serif{font-family: sans-serif}
                `;
                document.head.appendChild(style);
            }

            if (quillRef.current) return; // already initialized

            quillRef.current = new window.Quill(quillElementRef.current, {
                theme: 'snow',
                modules: { toolbar: toolbarOptions }
            });

            // set initial content if any
            if (form.content) {
                quillRef.current.root.innerHTML = form.content;
            }

            quillRef.current.on('text-change', () => {
                const html = quillRef.current.root.innerHTML;
                setForm(f => ({ ...f, content: html }));
            });

            // Improve font-picker labels (human friendly)
            const updateFontPickerLabels = () => {
                try {
                    const picker = quillElementRef.current.parentNode.querySelector('.ql-picker.ql-font');
                    if (!picker) return;
                    const items = picker.querySelectorAll('.ql-picker-item');
                    const labelMap = {
                        'montserrat': 'Montserrat',
                        'arial': 'Arial',
                        'georgia': 'Georgia',
                        'times-new-roman': 'Times New Roman',
                        'courier-new': 'Courier New',
                        'verdana': 'Verdana',
                        'segoe-ui': 'Segoe UI',
                        'sans-serif': 'Sans Serif'
                    };
                    items.forEach(item => {
                        const val = item.getAttribute('data-value');
                        if (val && labelMap[val]) item.textContent = labelMap[val];
                    });
                } catch (e) {
                    // non-fatal
                    console.warn('Failed to update font picker labels', e);
                }
            };

            // call once after init, and also slightly later to ensure DOM present
            setTimeout(updateFontPickerLabels, 50);
        };

        // load CSS + script if not present
        if (!window.Quill) {
            // quill css
            if (!document.getElementById('quill-css')) {
                const link = document.createElement('link');
                link.id = 'quill-css';
                link.rel = 'stylesheet';
                link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
                document.head.appendChild(link);
            }
            // quill script
            const s = document.createElement('script');
            s.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js';
            s.onload = loadQuill;
            document.body.appendChild(s);
        } else {
            loadQuill();
        }
    }, []); // run once

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach(k => data.append(k, form[k]));
        if (file) data.append('file_url', file);
        if (coverImage) data.append('cover_image', coverImage);

        router.post(route('superadmin.admin.resources.store'), data);
    };

    return (
        <SuperAdminLayout>
            <Head title="Create Resource" />
            <div className="p-4">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create Resource</h1>
                        <p className="text-sm text-gray-500 mt-1">Use this form to add guides, articles or downloadable files. Fields marked * are required.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => window.history.back()} className="px-3 py-2 rounded-md border text-sm">Cancel</button>
                        <button onClick={() => document.getElementById('create-form').requestSubmit()} style={{ background: primary }} className="px-4 py-2 rounded-md text-white text-sm">Save</button>
                    </div>
                </div>

                <form id="create-form" onSubmit={handleSubmit} className={`grid grid-cols-1 lg:grid-cols-3 gap-6`}>
                    <div className={`lg:col-span-2 space-y-4`}>
                        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Heading *</label>
                            <input value={form.heading} onChange={e => setForm({ ...form, heading: e.target.value })} placeholder="Enter heading" className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-[#934790]" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                                <div className="flex gap-2">
                                    <input value={form.slug} onChange={e => { setSlugAuto(false); setForm({ ...form, slug: e.target.value }); }} placeholder="resource-slug" className="w-full px-3 py-2 rounded-md border" />
                                    <button type="button" onClick={() => { setSlugAuto(true); }} title="Auto-generate slug" className="px-3 py-2 rounded-md border text-sm">Auto</button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">SEO-friendly URL part, e.g., <span className="font-mono">/resources/{form.slug || 'your-slug'}</span></p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g., Guide, Whitepaper" className="w-full px-3 py-2 rounded-md border" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
                            <div className="mb-2">
                                {/* Quill toolbar is injected by the Quill instance; the editor below will include it */}
                                <div ref={quillElementRef} className="min-h-[240px] p-0 border rounded-md" />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Tip: paste formatted content from docs or use the toolbar for formatting.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Tags</label>
                                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="comma separated" className="w-full px-3 py-2 rounded-md border" />
                            </div>

                            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Author</label>
                                <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Author name" className="w-full px-3 py-2 rounded-md border" />
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                            <label className="block text-xs font-medium text-gray-600 mb-2">Attachments</label>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">File (optional)</label>
                                    <input type="file" onChange={handleFile} className="w-full" />
                                    {fileName && <div className="mt-2 text-xs text-gray-600">Selected: {fileName}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Cover Image</label>
                                    <input type="file" accept="image/*" onChange={handleCover} className="w-full" />
                                    {coverPreview && <img src={coverPreview} alt="cover" className="mt-2 w-full h-32 object-cover rounded" />}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Visibility</label>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 rounded-md border mb-3">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                            <label className="block text-xs text-gray-500 mb-1">Publish Date</label>
                            <input type="datetime-local" value={form.published_at} onChange={e => setForm({ ...form, published_at: e.target.value })} className="w-full px-3 py-2 rounded-md border" />
                        </div>

                        <div className="flex md:hidden items-center gap-3">
                            <button type="button" onClick={() => window.history.back()} className="flex-1 px-3 py-2 rounded-md border">Cancel</button>
                            <button type="submit" form="create-form" style={{ background: primary }} className="flex-1 px-3 py-2 rounded-md text-white">Save</button>
                        </div>
                    </aside>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
