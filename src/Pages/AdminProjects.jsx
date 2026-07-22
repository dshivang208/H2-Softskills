import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Trash2,
  ArrowLeft,
  Plus,
  Upload,
  ImageOff,
} from 'lucide-react';
import { adminFetch, adminUpload, clearAdminToken } from '../lib/adminApi';

const EMPTY_FORM = {
  title: '',
  tag: '',
  accent: 'primary',
  description: '',
  image_url: '',
  status: 'draft',
};

function StatusPill({ status }) {
  const styles =
    status === 'published' ? 'bg-[#e1f7ec] text-[#006c49]' : 'bg-[#fdf1e0] text-[#a34700]';
  const label = status === 'published' ? 'Published' : 'Draft';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>
      {label}
    </span>
  );
}

function AdminProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [view, setView] = useState('list'); // list | form
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function loadProjects() {
    setLoading(true);
    setLoadError('');
    try {
      const data = await adminFetch('/api/admin/projects');
      setProjects(data.projects || []);
    } catch (err) {
      setLoadError(err.message || 'Could not load projects.');
      if (err.message?.toLowerCase().includes('session expired')) {
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
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
    setUploadError('');
    setView('form');
  };

  const openEditForm = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title || '',
      tag: project.tag || '',
      accent: project.accent || 'primary',
      description: project.description || '',
      image_url: project.image_url || '',
      status: project.status || 'draft',
    });
    setSaveError('');
    setUploadError('');
    setView('form');
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setUploadError('Please choose a JPG, PNG, WEBP, or GIF image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('That image is too large (5 MB max).');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await adminUpload('/api/admin/uploads/image', formData);
      handleFieldChange('image_url', data.url);
    } catch (err) {
      setUploadError(err.message || 'Could not upload this image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e, statusOverride) => {
    e.preventDefault();
    if (saving) return;

    if (!form.title.trim()) {
      setSaveError('A title is required.');
      return;
    }

    setSaving(true);
    setSaveError('');

    const payload = { ...form, status: statusOverride || form.status };

    try {
      if (editingId) {
        await adminFetch(`/api/admin/projects/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch('/api/admin/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setView('list');
      loadProjects();
    } catch (err) {
      setSaveError(err.message || 'Could not save this project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Delete this project card? Its case study content (if any) will be deleted too, and the card will disappear from the Projects and Home pages.'
      )
    )
      return;
    setDeletingId(id);
    try {
      await adminFetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete this project.');
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
              Manage Projects
            </h1>
            <p className="text-sm text-[#737685] mt-2 max-w-xl">
              Add, edit, or remove the project cards shown on the Home page and the Projects grid
              — including uploading each card&apos;s image. To add the detailed write-up behind
              &quot;Explore Case Study&quot; for a project, use{' '}
              <Link to="/admin/case-studies" className="font-semibold text-[#003594] hover:underline">
                Manage Case Studies
              </Link>
              .
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
                Add New Project
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
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading projects…
                </div>
              ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3 px-6">
                  <ImageOff className="w-8 h-8 text-[#c3c6d6]" />
                  <p className="text-[#737685] text-sm">
                    No projects yet. Click &quot;Add New Project&quot; to create your first card.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#c3c6d6]/30 text-left text-xs uppercase tracking-wider text-[#737685]">
                        <th className="px-5 py-3 font-semibold">Project</th>
                        <th className="px-5 py-3 font-semibold">Category</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id} className="border-b border-[#c3c6d6]/15 last:border-0 hover:bg-[#faf8ff]">
                          <td className="px-5 py-3.5 text-[#131b2e] font-medium max-w-xs">
                            <div className="flex items-center gap-3">
                              {project.image_url ? (
                                <img
                                  src={project.image_url}
                                  alt={project.title}
                                  className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-[#eaedff]"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-[#eaedff] flex items-center justify-center flex-shrink-0">
                                  <ImageOff className="w-4 h-4 text-[#c3c6d6]" />
                                </div>
                              )}
                              <span className="truncate">{project.title}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-[#434654]">{project.tag}</td>
                          <td className="px-5 py-3.5">
                            <StatusPill status={project.status} />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditForm(project)}
                                aria-label={`Edit ${project.title}`}
                                className="p-2 rounded-lg text-[#003594] hover:bg-[#e1e7ff] transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(project.id)}
                                disabled={deletingId === project.id}
                                aria-label={`Delete ${project.title}`}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                {deletingId === project.id ? (
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
            <h2 className="text-lg font-bold text-[#131b2e]">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h2>

            {/* Image */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Project Image
              </span>

              <div className="flex flex-wrap items-center gap-4">
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt="Project preview"
                    className="w-24 h-24 rounded-xl object-cover border border-[#c3c6d6]/40"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-[#f2f3ff] border border-[#c3c6d6]/40 flex items-center justify-center">
                    <ImageOff className="w-6 h-6 text-[#c3c6d6]" />
                  </div>
                )}

                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#003594] text-white rounded-xl font-semibold text-sm cursor-pointer hover:bg-[#002a72] transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Uploading…' : form.image_url ? 'Replace Image' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadError && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mt-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <p className="text-xs text-[#737685] mt-4 mb-1.5">
                Or paste an image URL manually instead of uploading:
              </p>
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => handleFieldChange('image_url', e.target.value)}
                placeholder="https://…/project-screenshot.jpg"
                className="w-full px-4 py-2.5 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-sm text-[#131b2e]"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={form.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Predictive Analytics Suite"
                className="w-full px-4 py-2.5 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tag" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Category Tag
                </label>
                <input
                  id="tag"
                  type="text"
                  value={form.tag}
                  onChange={(e) => handleFieldChange('tag', e.target.value)}
                  placeholder="DATA ENGINE"
                  className="w-full px-3 py-2.5 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-sm text-[#131b2e]"
                />
              </div>
              <div>
                <label htmlFor="accent" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Badge Color
                </label>
                <select
                  id="accent"
                  value={form.accent}
                  onChange={(e) => handleFieldChange('accent', e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-sm text-[#131b2e]"
                >
                  <option value="primary">Blue</option>
                  <option value="secondary">Green</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="A short one-liner shown on the card…"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e] resize-none"
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

export default AdminProjects;