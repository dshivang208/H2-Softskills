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
  X,
  Upload,
  FileText,
} from 'lucide-react';
import { adminFetch, adminUpload, clearAdminToken } from '../lib/adminApi';

const EMPTY_TITLED = { title: '', description: '' };

function emptyForm() {
  return {
    client_type: '',
    region: '',
    tech_stack: '',
    summary: '',
    pdf_url: '',
    status: 'draft',
    challenges: [{ ...EMPTY_TITLED }],
    solutions: [{ ...EMPTY_TITLED }],
    process_steps: [''],
    outcomes: [{ ...EMPTY_TITLED }],
  };
}

const LIST_LIMITS = { challenges: 4, solutions: 6, outcomes: 4, process_steps: 8 };

function StatusPill({ status }) {
  const styles =
    status === 'published'
      ? 'bg-[#e1f7ec] text-[#006c49]'
      : status === 'draft'
      ? 'bg-[#fdf1e0] text-[#a34700]'
      : 'bg-[#f2f3f5] text-[#737685]';
  const label = status === 'published' ? 'Published' : status === 'draft' ? 'Draft' : 'Not Created';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>
      {label}
    </span>
  );
}

function TitledListEditor({ label, hint, field, items, onChange, max }) {
  const updateItem = (index, key, value) => {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onChange(field, next);
  };

  const addItem = () => {
    if (items.length >= max) return;
    onChange(field, [...items, { ...EMPTY_TITLED }]);
  };

  const removeItem = (index) => {
    onChange(field, items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654]">
          {label} <span className="normal-case font-normal text-[#737685]">({hint})</span>
        </span>
        {items.length < max && (
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#003594] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        )}
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className="flex gap-2 items-start bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl p-3">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(i, 'title', e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 bg-white border border-[#c3c6d6]/50 rounded-lg focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none text-sm text-[#131b2e]"
              />
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => updateItem(i, 'description', e.target.value)}
                placeholder="Description"
                className="w-full px-3 py-2 bg-white border border-[#c3c6d6]/50 rounded-lg focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none text-sm text-[#131b2e] resize-none"
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(i)}
                aria-label="Remove item"
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepListEditor({ items, onChange, max }) {
  const updateItem = (index, value) => {
    const next = items.map((item, i) => (i === index ? value : item));
    onChange('process_steps', next);
  };

  const addItem = () => {
    if (items.length >= max) return;
    onChange('process_steps', [...items, '']);
  };

  const removeItem = (index) => {
    onChange('process_steps', items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654]">
          Process Steps <span className="normal-case font-normal text-[#737685]">(shown as a numbered list, up to {max})</span>
        </span>
        {items.length < max && (
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#003594] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add Step
          </button>
        )}
      </div>
      <div className="space-y-2">
        {items.map((step, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className="flex gap-2 items-center">
            <span className="w-6 h-6 rounded-full bg-[#e1e7ff] text-[#003594] text-xs font-bold flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            <input
              type="text"
              value={step}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={`Step ${i + 1}`}
              className="flex-1 px-3 py-2 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-lg focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none text-sm text-[#131b2e]"
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(i)}
                aria-label="Remove step"
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminCaseStudies() {
  const navigate = useNavigate();

  const [caseStudiesByProject, setCaseStudiesByProject] = useState({});
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [view, setView] = useState('list'); // list | form
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function loadCaseStudies() {
    setLoading(true);
    setLoadError('');
    try {
      const [caseStudiesData, projectsData] = await Promise.all([
        adminFetch('/api/admin/case-studies'),
        adminFetch('/api/admin/projects'),
      ]);
      const byProject = {};
      (caseStudiesData.caseStudies || []).forEach((cs) => {
        byProject[cs.project_id] = cs;
      });
      setCaseStudiesByProject(byProject);
      setProjectsList(projectsData.projects || []);
    } catch (err) {
      setLoadError(err.message || 'Could not load case studies.');
      if (err.message?.toLowerCase().includes('session expired')) {
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCaseStudies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  };

  const openEditForm = (projectId) => {
    const existing = caseStudiesByProject[projectId];
    setActiveProjectId(projectId);
    if (existing) {
      setForm({
        client_type: existing.client_type || '',
        region: existing.region || '',
        tech_stack: existing.tech_stack || '',
        summary: existing.summary || '',
        pdf_url: existing.pdf_url || '',
        status: existing.status || 'draft',
        challenges: existing.challenges?.length ? existing.challenges : [{ ...EMPTY_TITLED }],
        solutions: existing.solutions?.length ? existing.solutions : [{ ...EMPTY_TITLED }],
        process_steps: existing.process_steps?.length ? existing.process_steps : [''],
        outcomes: existing.outcomes?.length ? existing.outcomes : [{ ...EMPTY_TITLED }],
      });
    } else {
      setForm(emptyForm());
    }
    setSaveError('');
    setUploadError('');
    setView('form');
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file || !activeProjectId) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Please choose a PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('That PDF is too large (20 MB max).');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await adminUpload(`/api/admin/case-studies/${activeProjectId}/report`, formData);
      handleFieldChange('pdf_url', data.url);
    } catch (err) {
      setUploadError(err.message || 'Could not upload this PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveReport = async () => {
    if (!activeProjectId) return;
    if (!window.confirm('Remove the uploaded PDF? The Download button will show "Coming Soon" until a new one is added.')) return;

    setUploading(true);
    setUploadError('');
    try {
      await adminFetch(`/api/admin/case-studies/${activeProjectId}/report`, { method: 'DELETE' });
      handleFieldChange('pdf_url', '');
    } catch (err) {
      setUploadError(err.message || 'Could not remove this PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e, statusOverride) => {
    e.preventDefault();
    if (saving || !activeProjectId) return;

    if (!form.summary.trim()) {
      setSaveError('A summary is required.');
      return;
    }

    setSaving(true);
    setSaveError('');

    const payload = { ...form, status: statusOverride || form.status };

    try {
      await adminFetch(`/api/admin/case-studies/${activeProjectId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setView('list');
      loadCaseStudies();
    } catch (err) {
      setSaveError(err.message || 'Could not save this case study.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this case study? The project card itself will stay untouched.')) return;
    setDeletingId(projectId);
    try {
      await adminFetch(`/api/admin/case-studies/${projectId}`, { method: 'DELETE' });
      setCaseStudiesByProject((prev) => {
        const next = { ...prev };
        delete next[projectId];
        return next;
      });
    } catch (err) {
      alert(err.message || 'Could not delete this case study.');
    } finally {
      setDeletingId(null);
    }
  };

  const activeProject = projectsList.find((p) => p.id === activeProjectId);

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
              Case Study Manager
            </h1>
            <p className="text-sm text-[#737685] mt-2 max-w-xl">
              Add case study details for your project cards. This only manages the content behind
              &quot;Explore Case Study&quot; — to add, edit, or remove the project cards themselves
              (including their image), use{' '}
              <Link to="/admin/projects" className="font-semibold text-[#003594] hover:underline">
                Manage Projects
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center gap-3">
            {view === 'form' && (
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
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#c3c6d6]/30 text-left text-xs uppercase tracking-wider text-[#737685]">
                        <th className="px-5 py-3 font-semibold">Project</th>
                        <th className="px-5 py-3 font-semibold">Category</th>
                        <th className="px-5 py-3 font-semibold">Case Study Status</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectsList.map((project) => {
                        const existing = caseStudiesByProject[project.id];
                        return (
                          <tr key={project.id} className="border-b border-[#c3c6d6]/15 last:border-0 hover:bg-[#faf8ff]">
                            <td className="px-5 py-3.5 text-[#131b2e] font-medium max-w-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={project.image_url}
                                  alt={project.title}
                                  className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-[#eaedff]"
                                />
                                <span className="truncate">{project.title}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-[#434654]">{project.tag}</td>
                            <td className="px-5 py-3.5">
                              <StatusPill status={existing?.status || 'none'} />
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => openEditForm(project.id)}
                                  aria-label={`Edit case study for ${project.title}`}
                                  className="p-2 rounded-lg text-[#003594] hover:bg-[#e1e7ff] transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                {existing && (
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(project.id)}
                                    disabled={deletingId === project.id}
                                    aria-label={`Delete case study for ${project.title}`}
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                  >
                                    {deletingId === project.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
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

        {view === 'form' && activeProject && (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-sm p-6 md:p-8 space-y-6 max-w-3xl"
          >
            <div className="flex items-center gap-3">
              <img
                src={activeProject.image_url}
                alt={activeProject.title}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
              />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737685]">
                  Case Study For
                </p>
                <h2 className="text-lg font-bold text-[#131b2e]">{activeProject.title}</h2>
              </div>
            </div>

            <div>
              <label htmlFor="summary" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Summary
              </label>
              <textarea
                id="summary"
                required
                rows={3}
                value={form.summary}
                onChange={(e) => handleFieldChange('summary', e.target.value)}
                placeholder="A short intro paragraph shown at the top of the case study…"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="client_type" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Client Type
                </label>
                <input
                  id="client_type"
                  type="text"
                  value={form.client_type}
                  onChange={(e) => handleFieldChange('client_type', e.target.value)}
                  placeholder="IT Hardware Distributor"
                  className="w-full px-3 py-2.5 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-sm text-[#131b2e]"
                />
              </div>
              <div>
                <label htmlFor="region" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Region
                </label>
                <input
                  id="region"
                  type="text"
                  value={form.region}
                  onChange={(e) => handleFieldChange('region', e.target.value)}
                  placeholder="India"
                  className="w-full px-3 py-2.5 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-sm text-[#131b2e]"
                />
              </div>
              <div>
                <label htmlFor="tech_stack" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Tech / Solution
                </label>
                <input
                  id="tech_stack"
                  type="text"
                  value={form.tech_stack}
                  onChange={(e) => handleFieldChange('tech_stack', e.target.value)}
                  placeholder="Custom Web Platform"
                  className="w-full px-3 py-2.5 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-sm text-[#131b2e]"
                />
              </div>
            </div>

            <TitledListEditor
              label="Challenges"
              hint={`up to ${LIST_LIMITS.challenges}`}
              field="challenges"
              items={form.challenges}
              onChange={handleFieldChange}
              max={LIST_LIMITS.challenges}
            />

            <TitledListEditor
              label="What We Built"
              hint={`up to ${LIST_LIMITS.solutions}`}
              field="solutions"
              items={form.solutions}
              onChange={handleFieldChange}
              max={LIST_LIMITS.solutions}
            />

            <StepListEditor
              items={form.process_steps}
              onChange={handleFieldChange}
              max={LIST_LIMITS.process_steps}
            />

            <TitledListEditor
              label="Outcomes"
              hint={`up to ${LIST_LIMITS.outcomes}`}
              field="outcomes"
              items={form.outcomes}
              onChange={handleFieldChange}
              max={LIST_LIMITS.outcomes}
            />

            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Case Study Report PDF <span className="normal-case font-normal text-[#737685]">(used by the &quot;Download Case Study Report&quot; button)</span>
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#003594] text-white rounded-xl font-semibold text-sm cursor-pointer hover:bg-[#002a72] transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Uploading…' : form.pdf_url ? 'Replace PDF' : 'Upload PDF'}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                {form.pdf_url && (
                  <>
                    <a
                      href={form.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#003594] hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      View current PDF
                    </a>
                    <button
                      type="button"
                      onClick={handleRemoveReport}
                      disabled={uploading}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:underline disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </>
                )}
              </div>

              {uploadError && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mt-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <p className="text-xs text-[#737685] mt-4 mb-1.5">
                Or paste a PDF URL manually instead of uploading:
              </p>
              <input
                id="pdf_url"
                type="url"
                value={form.pdf_url}
                onChange={(e) => handleFieldChange('pdf_url', e.target.value)}
                placeholder="https://…/case-study.pdf"
                className="w-full px-4 py-2.5 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-sm text-[#131b2e]"
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

export default AdminCaseStudies;