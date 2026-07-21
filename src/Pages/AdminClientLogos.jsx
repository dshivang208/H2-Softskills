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

const EMPTY_FORM = {
  name: '',
  logo_url: '',
  website_url: '',
  display_order: 0,
  status: 'draft',
};

function AdminClientLogos() {
  const navigate = useNavigate();

  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [view, setView] = useState('list'); // list | form
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadLogos() {
    setLoading(true);
    setLoadError('');
    try {
      const data = await adminFetch('/api/admin/client-logos');
      setLogos(data.logos || []);
    } catch (err) {
      setLoadError(err.message || 'Could not load client logos.');
      if (err.message?.toLowerCase().includes('session expired')) {
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogos();
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

  const openEditForm = (logo) => {
    setEditingId(logo.id);
    setForm({
      name: logo.name || '',
      logo_url: logo.logo_url || '',
      website_url: logo.website_url || '',
      display_order: logo.display_order ?? 0,
      status: logo.status || 'draft',
    });
    setSaveError('');
    setView('form');
  };

  const handleFormChange = (field) => (e) => {
    const value = field === 'display_order' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e, statusOverride) => {
    e.preventDefault();
    if (saving) return;

    if (!form.name.trim() || !form.logo_url.trim()) {
      setSaveError('Name and logo URL are required.');
      return;
    }

    setSaving(true);
    setSaveError('');

    const payload = { ...form, status: statusOverride || form.status };

    try {
      if (editingId) {
        await adminFetch(`/api/admin/client-logos/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch('/api/admin/client-logos', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setView('list');
      loadLogos();
    } catch (err) {
      setSaveError(err.message || 'Could not save this logo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this logo? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await adminFetch(`/api/admin/client-logos/${id}`, { method: 'DELETE' });
      setLogos((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(err.message || 'Could not remove this logo.');
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
              Client Logos Manager
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
                Add Logo
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
              These are added into the same scrolling logo marquee on the Home page, alongside the
              existing client logos (which stay as they are and can&apos;t be removed here).
            </p>

            <div className="bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-[#737685]">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading logos…
                </div>
              ) : logos.length === 0 ? (
                <p className="text-[#737685] text-sm py-16 text-center">
                  No extra logos yet. Click &quot;Add Logo&quot; to add your first one.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#c3c6d6]/30 text-left text-xs uppercase tracking-wider text-[#737685]">
                        <th className="px-5 py-3 font-semibold">Logo</th>
                        <th className="px-5 py-3 font-semibold">Name</th>
                        <th className="px-5 py-3 font-semibold">Website</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold">Order</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logos.map((logo) => (
                        <tr key={logo.id} className="border-b border-[#c3c6d6]/15 last:border-0 hover:bg-[#faf8ff]">
                          <td className="px-5 py-3.5">
                            <div className="w-16 h-10 rounded-lg border border-[#c3c6d6]/40 bg-white flex items-center justify-center p-1.5">
                              <img
                                src={logo.logo_url}
                                alt={logo.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-[#131b2e] font-medium max-w-xs">
                            <span className="truncate block">{logo.name}</span>
                          </td>
                          <td className="px-5 py-3.5 text-[#434654] max-w-[160px]">
                            {logo.website_url ? (
                              <a
                                href={logo.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#003594] hover:underline truncate block"
                              >
                                {logo.website_url}
                              </a>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                logo.status === 'published'
                                  ? 'bg-[#e1f7ec] text-[#006c49]'
                                  : 'bg-[#f2f3f5] text-[#737685]'
                              }`}
                            >
                              {logo.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[#737685]">{logo.display_order}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditForm(logo)}
                                aria-label={`Edit ${logo.name}`}
                                className="p-2 rounded-lg text-[#003594] hover:bg-[#e1e7ff] transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(logo.id)}
                                disabled={deletingId === logo.id}
                                aria-label={`Remove ${logo.name}`}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                {deletingId === logo.id ? (
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
              {editingId ? 'Edit Logo' : 'Add Logo'}
            </h2>

            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Client / Company Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={handleFormChange('name')}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
              />
            </div>

            <div>
              <label htmlFor="logo_url" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Logo Image URL
              </label>
              <input
                id="logo_url"
                type="url"
                required
                value={form.logo_url}
                onChange={handleFormChange('logo_url')}
                placeholder="https://…"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
              />
              {form.logo_url && (
                <div className="mt-3 w-32 h-16 rounded-lg border border-[#c3c6d6]/40 bg-white flex items-center justify-center p-2">
                  {/* eslint-disable-next-line jsx-a11y/alt-text -- preview only, alt not meaningful here */}
                  <img src={form.logo_url} className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="website_url" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Website URL <span className="normal-case font-normal text-[#737685]">(optional)</span>
                </label>
                <input
                  id="website_url"
                  type="url"
                  value={form.website_url}
                  onChange={handleFormChange('website_url')}
                  placeholder="https://…"
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
                />
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

export default AdminClientLogos;