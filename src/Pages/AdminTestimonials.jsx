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

const EMPTY_FORM = {
  name: '',
  role: '',
  quote: '',
  avatar_url: '',
  rating: 5,
  display_order: 0,
  status: 'draft',
};

function AdminTestimonials() {
  const navigate = useNavigate();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [view, setView] = useState('list'); // list | form
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadTestimonials() {
    setLoading(true);
    setLoadError('');
    try {
      const data = await adminFetch('/api/admin/testimonials');
      setTestimonials(data.testimonials || []);
    } catch (err) {
      setLoadError(err.message || 'Could not load testimonials.');
      if (err.message?.toLowerCase().includes('session expired')) {
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
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

  const openEditForm = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name || '',
      role: t.role || '',
      quote: t.quote || '',
      avatar_url: t.avatar_url || '',
      rating: t.rating ?? 5,
      display_order: t.display_order ?? 0,
      status: t.status || 'draft',
    });
    setSaveError('');
    setView('form');
  };

  const handleFormChange = (field) => (e) => {
    const value =
      field === 'rating' || field === 'display_order' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e, statusOverride) => {
    e.preventDefault();
    if (saving) return;

    if (!form.name.trim() || !form.quote.trim()) {
      setSaveError('Name and quote are required.');
      return;
    }

    setSaving(true);
    setSaveError('');

    const payload = { ...form, status: statusOverride || form.status };

    try {
      if (editingId) {
        await adminFetch(`/api/admin/testimonials/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch('/api/admin/testimonials', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setView('list');
      loadTestimonials();
    } catch (err) {
      setSaveError(err.message || 'Could not save this testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await adminFetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete this testimonial.');
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
              Testimonials Manager
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
                New Testimonial
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

            <p className="text-sm text-[#737685] mb-6 max-w-2xl">
              These show in an additional &quot;What Our Clients Say&quot; section on the Home page,
              separate from the 3 original testimonial cards (which stay as they are).
            </p>

            <div className="bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-[#737685]">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading testimonials…
                </div>
              ) : testimonials.length === 0 ? (
                <p className="text-[#737685] text-sm py-16 text-center">
                  No testimonials yet. Click &quot;New Testimonial&quot; to add your first one.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#c3c6d6]/30 text-left text-xs uppercase tracking-wider text-[#737685]">
                        <th className="px-5 py-3 font-semibold">Name</th>
                        <th className="px-5 py-3 font-semibold">Role / Company</th>
                        <th className="px-5 py-3 font-semibold">Rating</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold">Order</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.map((t) => (
                        <tr key={t.id} className="border-b border-[#c3c6d6]/15 last:border-0 hover:bg-[#faf8ff]">
                          <td className="px-5 py-3.5 text-[#131b2e] font-medium max-w-xs">
                            <span className="truncate block">{t.name}</span>
                          </td>
                          <td className="px-5 py-3.5 text-[#434654]">{t.role || '—'}</td>
                          <td className="px-5 py-3.5 text-[#a34700]">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: t.rating || 0 }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-[#a34700]" />
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                t.status === 'published'
                                  ? 'bg-[#e1f7ec] text-[#006c49]'
                                  : 'bg-[#f2f3f5] text-[#737685]'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[#737685]">{t.display_order}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditForm(t)}
                                aria-label={`Edit ${t.name}`}
                                className="p-2 rounded-lg text-[#003594] hover:bg-[#e1e7ff] transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(t.id)}
                                disabled={deletingId === t.id}
                                aria-label={`Delete ${t.name}`}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                {deletingId === t.id ? (
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
            className="bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-sm p-6 md:p-8 space-y-6 max-w-2xl"
          >
            <h2 className="text-xl font-bold text-[#131b2e]">
              {editingId ? 'Edit Testimonial' : 'New Testimonial'}
            </h2>

            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={handleFormChange('name')}
                placeholder="Arjun Mehta"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Role / Company
              </label>
              <input
                id="role"
                type="text"
                value={form.role}
                onChange={handleFormChange('role')}
                placeholder="CEO, Bright Solutions"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
              />
            </div>

            <div>
              <label htmlFor="quote" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Quote
              </label>
              <textarea
                id="quote"
                required
                rows={4}
                value={form.quote}
                onChange={handleFormChange('quote')}
                placeholder="What did this client say about working with you?"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="avatar_url" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Avatar URL <span className="normal-case font-normal text-[#737685]">(optional)</span>
                </label>
                <input
                  id="avatar_url"
                  type="url"
                  value={form.avatar_url}
                  onChange={handleFormChange('avatar_url')}
                  placeholder="https://…"
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
                />
              </div>

              <div>
                <label htmlFor="rating" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Rating (1–5)
                </label>
                <select
                  id="rating"
                  value={form.rating}
                  onChange={handleFormChange('rating')}
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="display_order" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Display Order <span className="normal-case font-normal text-[#737685]">(lower shows first)</span>
                </label>
                <input
                  id="display_order"
                  type="number"
                  value={form.display_order}
                  onChange={handleFormChange('display_order')}
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
                />
              </div>
            </div>

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

export default AdminTestimonials;