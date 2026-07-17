import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  Star,
  ArrowLeft,
} from 'lucide-react';
import { adminFetch, clearAdminToken } from '../lib/adminApi';

const CATEGORY_OPTIONS = [
  'Web Development',
  'Blockchain',
  'Mobile Apps',
  'CRM',
  'Digital Marketing',
  'AI & Automation',
];

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: CATEGORY_OPTIONS[0],
  image_url: '',
  author: 'H2 Softskills Team',
  read_time: '5 min read',
  status: 'draft',
  is_popular: false,
};

function AdminBlogs() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [view, setView] = useState('list'); // list | form
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadPosts() {
    setLoading(true);
    setLoadError('');
    try {
      const data = await adminFetch('/api/admin/blogs');
      setPosts(data.posts || []);
    } catch (err) {
      setLoadError(err.message || 'Could not load blog posts.');
      if (err.message?.toLowerCase().includes('session expired')) {
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSaveError('');
    setView('form');
  };

  const openEditForm = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || CATEGORY_OPTIONS[0],
      image_url: post.image_url || '',
      author: post.author || 'H2 Softskills Team',
      read_time: post.read_time || '5 min read',
      status: post.status || 'draft',
      is_popular: Boolean(post.is_popular),
    });
    setSaveError('');
    setView('form');
  };

  const handleFormChange = (field) => (e) => {
    const value = field === 'is_popular' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e, statusOverride) => {
    e.preventDefault();
    if (saving) return;

    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setSaveError('Title, excerpt, and content are required.');
      return;
    }

    setSaving(true);
    setSaveError('');

    const payload = { ...form, status: statusOverride || form.status };

    try {
      if (editingId) {
        await adminFetch(`/api/admin/blogs/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch('/api/admin/blogs', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setView('list');
      loadPosts();
    } catch (err) {
      setSaveError(err.message || 'Could not save this post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await adminFetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete this post.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-56px)] bg-[#faf8ff] tech-grid overflow-x-hidden">
      <div className="floating-radial bg-[#003594] top-0 -left-64" />
      <div className="floating-radial bg-[#006c49] bottom-0 -right-64" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#737685] hover:text-[#003594] transition-colors mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Admin Control Panel
            </Link>
            <h1 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-black tracking-tight text-[#131b2e]">
              Blog Manager
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {view === 'list' ? (
              <button
                type="button"
                onClick={openCreateForm}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#003594] text-white rounded-xl font-semibold text-sm hover:bg-[#002a72] transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Post
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setView('list')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c3c6d6]/40 rounded-xl text-[#434654] font-semibold text-sm hover:bg-[#f2f3ff] transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2.5 bg-[#131b2e] text-white rounded-xl font-semibold text-sm hover:bg-[#0a0f1a] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {view === 'list' && (
          <>
            {loadError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-8">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{loadError}</span>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-[#737685]">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading posts…
                </div>
              ) : posts.length === 0 ? (
                <p className="text-[#737685] text-sm py-16 text-center">
                  No blog posts yet. Click &quot;New Post&quot; to write your first one.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#c3c6d6]/30 text-left text-xs uppercase tracking-wider text-[#737685]">
                        <th className="px-5 py-3 font-semibold">Title</th>
                        <th className="px-5 py-3 font-semibold">Category</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold">Updated</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post) => (
                        <tr key={post.id} className="border-b border-[#c3c6d6]/15 last:border-0 hover:bg-[#faf8ff]">
                          <td className="px-5 py-3.5 text-[#131b2e] font-medium max-w-xs">
                            <div className="flex items-center gap-2">
                              {post.is_popular && (
                                <Star className="w-3.5 h-3.5 text-[#a34700] fill-[#a34700] flex-shrink-0" />
                              )}
                              <span className="truncate">{post.title}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-[#434654]">{post.category}</td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                post.status === 'published'
                                  ? 'bg-[#e1f7ec] text-[#006c49]'
                                  : 'bg-[#f2f3f5] text-[#737685]'
                              }`}
                            >
                              {post.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[#737685]">
                            {new Date(post.updated_at || post.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditForm(post)}
                                aria-label={`Edit ${post.title}`}
                                className="p-2 rounded-lg text-[#003594] hover:bg-[#e1e7ff] transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(post.id)}
                                disabled={deletingId === post.id}
                                aria-label={`Delete ${post.title}`}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                {deletingId === post.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {view === 'form' && (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-sm p-6 md:p-8 space-y-6 max-w-3xl"
          >
            <h2 className="text-xl font-bold text-[#131b2e]">
              {editingId ? 'Edit Post' : 'New Post'}
            </h2>

            <div>
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={form.title}
                onChange={handleFormChange('title')}
                placeholder="The Future of Web Development"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                URL Slug <span className="normal-case font-normal text-[#737685]">(optional — auto-generated from title if left blank)</span>
              </label>
              <input
                id="slug"
                type="text"
                value={form.slug}
                onChange={handleFormChange('slug')}
                placeholder="future-of-web-development"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                required
                rows={2}
                value={form.excerpt}
                onChange={handleFormChange('excerpt')}
                placeholder="A short teaser shown on the blog listing page…"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e] resize-none"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Content <span className="normal-case font-normal text-[#737685]">(separate paragraphs with a blank line)</span>
              </label>
              <textarea
                id="content"
                required
                rows={12}
                value={form.content}
                onChange={handleFormChange('content')}
                placeholder="Write the full article here…"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e] resize-none font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={handleFormChange('category')}
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="read_time" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Read Time
                </label>
                <input
                  id="read_time"
                  type="text"
                  value={form.read_time}
                  onChange={handleFormChange('read_time')}
                  placeholder="5 min read"
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  value={form.author}
                  onChange={handleFormChange('author')}
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
                />
              </div>

              <div>
                <label htmlFor="image_url" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Cover Image URL
                </label>
                <input
                  id="image_url"
                  type="url"
                  value={form.image_url}
                  onChange={handleFormChange('image_url')}
                  placeholder="https://…"
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_popular}
                onChange={handleFormChange('is_popular')}
                className="w-4 h-4 rounded border-[#c3c6d6] text-[#003594] focus:ring-[#003594]"
              />
              <span className="text-sm text-[#434654]">
                Feature in <strong>Popular Posts</strong> sidebar
              </span>
            </label>

            {saveError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSave(e, 'draft')}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border border-[#c3c6d6]/50 text-[#131b2e] font-bold rounded-xl hover:bg-[#f2f3ff] transition-colors disabled:opacity-60"
              >
                {saving && form.status !== 'published' && <Loader2 className="w-4 h-4 animate-spin" />}
                Save as Draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSave(e, 'published')}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#003594] text-white font-bold rounded-xl hover:bg-[#002a72] transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Publish
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default AdminBlogs;