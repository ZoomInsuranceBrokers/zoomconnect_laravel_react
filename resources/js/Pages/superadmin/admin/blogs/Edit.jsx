import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Head, router, usePage } from "@inertiajs/react";
import { FaRegThumbsUp } from "react-icons/fa";
import SuperAdminLayout from "../../../../Layouts/SuperAdmin/Layout";
import { useTheme } from "../../../../Context/ThemeContext";

export default function Edit({ blog }) {
  const { darkMode } = useTheme();
  const { errors } = usePage().props;

  const [form, setForm] = useState({
    blog_title: blog.blog_title || "",
    blog_slug: blog.blog_slug || "",
    blog_author: blog.blog_author || "",
    blog_content: blog.blog_content || "",
    blog_tags: blog.blog_tags || "",
    blog_categories: blog.blog_categories || "",
    focus_keyword: blog.focus_keyword || "",
    meta_title: blog.meta_title || "",
    meta_description: blog.meta_description || "",
    meta_keywords: blog.meta_keywords || "",
    blog_thumbnail_alt: blog.blog_thumbnail_alt || "",
    blog_banner_alt: blog.blog_banner_alt || "",
    og_title: blog.og_title || "",
    og_description: blog.og_description || "",
    twitter_title: blog.twitter_title || "",
    twitter_description: blog.twitter_description || "",
    is_active: blog.is_active || false,
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [seoScore, setSeoScore] = useState(0);
  const [seoTips, setSeoTips] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((k) => data.append(k, form[k]));
    if (thumbnailFile) data.append("blog_thumbnail", thumbnailFile);
    if (bannerFile) data.append("blog_banner", bannerFile);
    data.append("_method", "PUT");
    router.post(route("superadmin.admin.blogs.update", blog.id), data);
  };

  // ✳️ SEO Scoring Logic
  useEffect(() => {
    const tips = [];
    let score = 0;

    const { blog_title, blog_content, focus_keyword, meta_description } = form;
    const content = blog_content?.toLowerCase() || "";
    const keyword = focus_keyword?.toLowerCase() || "";

    if (blog_title.length > 40 && blog_title.length < 65) {
      score += 10;
    } else {
      tips.push("Optimize title length (40–65 chars).");
    }

    if (meta_description.length > 120 && meta_description.length < 160) {
      score += 10;
    } else {
      tips.push("Meta description should be 120–160 chars.");
    }

    if (keyword && content.includes(keyword)) {
      score += 20;
    } else {
      tips.push("Use your focus keyword in the content.");
    }

    if (content.split(" ").length > 300) {
      score += 10;
    } else {
      tips.push("Content too short (min 300 words).");
    }

    if (content.includes("<img")) {
      score += 10;
    } else {
      tips.push("Add at least one image.");
    }

    if (content.includes("<a")) {
      score += 10;
    } else {
      tips.push("Add at least one outbound or internal link.");
    }

    setSeoScore(score);
    setSeoTips(tips);
  }, [form.blog_content, form.blog_title, form.focus_keyword, form.meta_description]);

  const seoColor =
    seoScore >= 70 ? "text-green-600" : seoScore >= 50 ? "text-yellow-500" : "text-red-500";

  return (
    <SuperAdminLayout>
      <Head title="Edit Blog" />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            ✍️ Edit Blog Post
          </h1>
          <button
            onClick={() => window.history.back()}
            className="px-3 py-2 rounded-md border text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ← Back
          </button>
        </div>

        {/* Main Card */}
        <div
          className={`rounded-2xl p-6 border shadow-sm ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="lg:col-span-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside text-sm">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Left: Editor Section */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Blog Title"
                  value={form.blog_title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setForm({ ...form, blog_title: title, blog_slug: slug });
                  }}
                  className={`w-full text-xl font-medium border-0 border-b-2 focus:ring-0 ${
                    errors.blog_title ? 'border-red-500' : ''
                  } ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                />
                {errors.blog_title && <p className="text-red-500 text-xs mt-1">{errors.blog_title}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Slug (auto-generated)"
                  value={form.blog_slug}
                  onChange={(e) => setForm({ ...form, blog_slug: e.target.value })}
                  className={`w-full text-sm border-0 border-b focus:ring-0 ${
                    errors.blog_slug ? 'border-red-500' : ''
                  } ${darkMode ? "bg-gray-800 text-gray-400 border-gray-600" : "bg-white text-gray-500 border-gray-300"}`}
                />
                {errors.blog_slug && <p className="text-red-500 text-xs mt-1">{errors.blog_slug}</p>}
              </div>

              <input
                type="text"
                placeholder="Author Name"
                value={form.blog_author}
                onChange={(e) => setForm({ ...form, blog_author: e.target.value })}
                className={`w-full text-sm border-0 border-b focus:ring-0 ${
                  darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"
                }`}
              />

              <Editor
                apiKey="riy64nyqubm01u4t80g8hh3r3b12294cj0wy9veg4uq0yyi1"
                value={form.blog_content}
                onEditorChange={(newContent) =>
                  setForm((f) => ({ ...f, blog_content: newContent }))
                }
                init={{
                  height: 500,
                  menubar: true,
                  plugins:
                    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                  toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                  branding: false,
                  skin: darkMode ? 'oxide-dark' : 'oxide',
                  content_css: darkMode ? 'dark' : 'default',
                }}
              />
            </div>

            {/* Right: SEO + Meta Section */}
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-900"
                }`}
              >
                <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FaRegThumbsUp /> SEO Score
                </h2>
                <div className={`text-2xl font-bold ${seoColor}`}>{seoScore}/70</div>
                <ul className="text-xs mt-2 list-disc pl-4">
                  {seoTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                  {seoTips.length === 0 && <li>Excellent SEO structure!</li>}
                </ul>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1 block">Focus Keyword</label>
                  <input
                    type="text"
                    value={form.focus_keyword}
                    onChange={(e) => setForm({ ...form, focus_keyword: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Meta Title</label>
                  <input
                    type="text"
                    value={form.meta_title}
                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Meta Description</label>
                  <textarea
                    value={form.meta_description}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg h-20 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Meta Keywords</label>
                  <input
                    type="text"
                    value={form.meta_keywords}
                    onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Thumbnail Image</label>
                  {blog.blog_thumbnail && (
                    <div className="mb-2">
                      <img
                        src={`/storage/${blog.blog_thumbnail}`}
                        alt="Current thumbnail"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Current thumbnail</p>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                    className="text-xs"
                  />
                  {thumbnailFile && (
                    <p className="text-xs mt-1 text-gray-500">New: {thumbnailFile.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Thumbnail Alt Text</label>
                  <input
                    type="text"
                    value={form.blog_thumbnail_alt}
                    onChange={(e) => setForm({ ...form, blog_thumbnail_alt: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Banner Image</label>
                  {blog.blog_banner && (
                    <div className="mb-2">
                      <img
                        src={`/storage/${blog.blog_banner}`}
                        alt="Current banner"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">Current banner</p>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={(e) => setBannerFile(e.target.files[0])}
                    className="text-xs"
                  />
                  {bannerFile && (
                    <p className="text-xs mt-1 text-gray-500">New: {bannerFile.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Banner Alt Text</label>
                  <input
                    type="text"
                    value={form.blog_banner_alt}
                    onChange={(e) => setForm({ ...form, blog_banner_alt: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.blog_tags}
                    onChange={(e) => setForm({ ...form, blog_tags: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block">Categories</label>
                  <input
                    type="text"
                    value={form.blog_categories}
                    onChange={(e) => setForm({ ...form, blog_categories: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                <label className="inline-flex items-center text-xs mt-2">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  Published
                </label>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#934790] hover:bg-[#7d3d7b] text-white font-semibold py-2 rounded-lg"
                  >
                    Update Blog
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
