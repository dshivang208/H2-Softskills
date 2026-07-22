import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { adminFetch, clearAdminToken } from '../lib/adminApi';
import { ICON_OPTIONS, ICON_MAP } from '../components/Services';

const EMPTY_STAT = { label: '', value: '' };

const EMPTY_FORM = {
  title: '',
  tag: '',
  description: '',
  image_url: '',
  icon: ICON_OPTIONS[0],
  status: 'draft',
  stats: [{ ...EMPTY_STAT }, { ...EMPTY_STAT }, { ...EMPTY_STAT }],
  highlight: '',
};

function AdminServices() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [view, setView] = useState('list'); // list | form
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadServices() {
    setLoading(true);
    setLoadError('');
    try {
      const data = await adminFetch('/api/admin/services');
      setServices(data.services || []);
    } catch (err) {
      setLoadError(err.message || 'Could not load services.');
      if (err.message?.toLowerCase().includes('session expired')) {
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
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

  const openEditForm = (service) => {
    const stats = Array.isArray(service.stats) && service.stats.length > 0
      ? [0, 1, 2].map((i) => service.stats[i] || { ...EMPTY_STAT })
      : [{ ...EMPTY_STAT }, { ...EMPTY_STAT }, { ...EMPTY_STAT }];

    setEditingId(service.id);
    setForm({
      title: service.title || '',
      tag: service.tag || '',
      description: service.description || '',
      image_url: service.image_url || '',
      icon: service.icon || ICON_OPTIONS[0],
      status: service.status || 'draft',
      stats: stats.map((s) => ({ label: s.label || '', value: s.value || '' })),
      highlight: (service.stats && service.stats[0] && service.stats[0].highlight) || '',
    });
    setSaveError('');
    setView('form');
  };

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleStatChange = (index, field) => (e) => {
    setForm((prev) => {
      const stats = prev.stats.map((s, i) => (i === index ? { ...s, [field]: e.target.value } : s));
      return { ...prev, stats };
    });
  };

  const handleSave = async (e, statusOverride) => {
    e.preventDefault();
    if (saving) return;

    if (!form.title.trim() || !form.description.trim()) {
      setSaveError('Title and description are required.');
      return;
    }

    setSaving(true);
    setSaveError('');

    const stats = form.stats
      .filter((s) => s.label.trim() && s.value.trim())
      .map((s, i) => ({
        label: s.label.trim(),
        value: s.value.trim(),
        ...(i === 0 && form.highlight.trim() ? { highlight: form.highlight.trim() } : {}),
      }));

    const payload = {
      title: form.title,
      tag: form.tag,
      description: form.description,
      image_url: form.image_url,
      icon: form.icon,
      status: statusOverride || form.status,
      stats,
    };

    try {
      if (editingId) {
        await adminFetch(`/api/admin/services/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch('/api/admin/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setView('list');
      loadServices();
    } catch (err) {
      setSaveError(err.message || 'Could not save this service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await adminFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete this service.');
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
              Service Manager
            </h1>
            <p className="text-sm text-[#737685] mt-2 max-w-xl">
              Every service shown on the Home page and Services page lives here — edit or delete
              an existing one, unpublish it by saving as a draft, or add a brand new service.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {view === 'list' ? (
              <button
                type="button"
                onClick={openCreateForm}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#003594] text-white rounded-xl font-semibold text-sm hover:bg-[#002a72] transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Service
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
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading services…
                </div>
              ) : services.length === 0 ? (
                <p className="text-[#737685] text-sm py-16 text-center">
                  No admin-added services yet. Click &quot;New Service&quot; to add one — the
                  existing cards on the Services page stay exactly as they are.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#c3c6d6]/30 text-left text-xs uppercase tracking-wider text-[#737685]">
                        <th className="px-5 py-3 font-semibold">Title</th>
                        <th className="px-5 py-3 font-semibold">Tag</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold">Updated</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => {
                        const Icon = ICON_MAP[service.icon] || ICON_MAP.Code2;
                        return (
                          <tr key={service.id} className="border-b border-[#c3c6d6]/15 last:border-0 hover:bg-[#faf8ff]">
                            <td className="px-5 py-3.5 text-[#131b2e] font-medium max-w-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-[#e1e7ff] flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-3.5 h-3.5 text-[#003594]" />
                                </span>
                                <span className="truncate">{service.title}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-[#434654]">{service.tag || '—'}</td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  service.status === 'published'
                                    ? 'bg-[#e1f7ec] text-[#006c49]'
                                    : 'bg-[#f2f3f5] text-[#737685]'
                                }`}
                              >
                                {service.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-[#737685]">
                              {new Date(service.updated_at || service.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => openEditForm(service)}
                                  aria-label={`Edit ${service.title}`}
                                  className="p-2 rounded-lg text-[#003594] hover:bg-[#e1e7ff] transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(service.id)}
                                  disabled={deletingId === service.id}
                                  aria-label={`Delete ${service.title}`}
                                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                  {deletingId === service.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
              {editingId ? 'Edit Service' : 'New Service'}
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
                placeholder="UI/UX Design"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
              />
            </div>

            <div>
              <label htmlFor="tag" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Tag <span className="normal-case font-normal text-[#737685]">(small label shown under the title)</span>
              </label>
              <input
                id="tag"
                type="text"
                value={form.tag}
                onChange={handleFormChange('tag')}
                placeholder="Design Systems"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={3}
                value={form.description}
                onChange={handleFormChange('description')}
                placeholder="A short description shown on the card…"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="icon" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Icon
                </label>
                <select
                  id="icon"
                  value={form.icon}
                  onChange={handleFormChange('icon')}
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
                >
                  {ICON_OPTIONS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="image_url" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Card Image URL
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

            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Stats <span className="normal-case font-normal text-[#737685]">(up to 3, shown at the bottom of the card — optional)</span>
              </span>
              <div className="space-y-3">
                {form.stats.map((stat, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={i} className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={handleStatChange(i, 'label')}
                      placeholder={`Label ${i + 1} (e.g. Uptime)`}
                      className="px-3 py-2.5 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-sm text-[#131b2e]"
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={handleStatChange(i, 'value')}
                      placeholder={`Value ${i + 1} (e.g. 99.9%)`}
                      className="px-3 py-2.5 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-sm text-[#131b2e]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="highlight" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Highlight Color for Stat 1 <span className="normal-case font-normal text-[#737685]">(optional hex, e.g. #6ffbbe)</span>
              </label>
              <input
                id="highlight"
                type="text"
                value={form.highlight}
                onChange={handleFormChange('highlight')}
                placeholder="#6ffbbe"
                className="w-full sm:w-48 px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
              />
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

export default AdminServices;