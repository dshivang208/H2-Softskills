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
} from 'lucide-react';
import { adminFetch, clearAdminToken } from '../lib/adminApi';
import { ICON_MAP } from '../components/Services';

function emptyForm() {
  return {
    intro: '',
    status: 'draft',
    capabilities: [''],
    outcomes: [''],
    deliverables: [''],
    ideal_fit: [''],
    faqs: [{ question: '', answer: '' }],
  };
}

const LIST_LIMITS = { capabilities: 8, outcomes: 6, deliverables: 8, ideal_fit: 6, faqs: 8 };

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

// Simple single-line string list editor (used for Capabilities, Outcomes, Ideal Fit).
function SimpleListEditor({ label, hint, field, items, onChange, max, placeholder }) {
  const updateItem = (index, value) => {
    onChange(field, items.map((item, i) => (i === index ? value : item)));
  };
  const addItem = () => {
    if (items.length >= max) return;
    onChange(field, [...items, '']);
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
      <div className="space-y-2">
        {items.map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-lg focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none text-sm text-[#131b2e]"
            />
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

// Numbered step-style editor (used for Deliverables).
function StepListEditor({ items, onChange, max }) {
  const updateItem = (index, value) => {
    onChange('deliverables', items.map((item, i) => (i === index ? value : item)));
  };
  const addItem = () => {
    if (items.length >= max) return;
    onChange('deliverables', [...items, '']);
  };
  const removeItem = (index) => {
    onChange('deliverables', items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654]">
          Deliverables <span className="normal-case font-normal text-[#737685]">(shown as a numbered list, up to {max})</span>
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

// Question/answer list editor (used for FAQ).
function FaqListEditor({ items, onChange, max }) {
  const updateItem = (index, key, value) => {
    onChange('faqs', items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };
  const addItem = () => {
    if (items.length >= max) return;
    onChange('faqs', [...items, { question: '', answer: '' }]);
  };
  const removeItem = (index) => {
    onChange('faqs', items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654]">
          FAQ <span className="normal-case font-normal text-[#737685]">(up to {max})</span>
        </span>
        {items.length < max && (
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#003594] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add Question
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
                value={item.question}
                onChange={(e) => updateItem(i, 'question', e.target.value)}
                placeholder="Question"
                className="w-full px-3 py-2 bg-white border border-[#c3c6d6]/50 rounded-lg focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none text-sm text-[#131b2e]"
              />
              <textarea
                rows={2}
                value={item.answer}
                onChange={(e) => updateItem(i, 'answer', e.target.value)}
                placeholder="Answer"
                className="w-full px-3 py-2 bg-white border border-[#c3c6d6]/50 rounded-lg focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none text-sm text-[#131b2e] resize-none"
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(i)}
                aria-label="Remove question"
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

function AdminServiceDetails() {
  const navigate = useNavigate();

  // The full catalogue of services this admin section can attach detail
  // pages to — every service card on the site, since they all live in the
  // `services` table now.
  const [allServices, setAllServices] = useState([]);
  const [detailsByService, setDetailsByService] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [view, setView] = useState('list'); // list | form
  const [activeServiceId, setActiveServiceId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  async function loadAll() {
    setLoading(true);
    setLoadError('');
    try {
      const [servicesRes, detailsRes] = await Promise.all([
        adminFetch('/api/admin/services'),
        adminFetch('/api/admin/service-details'),
      ]);

      const mappedServices = (servicesRes.services || []).map((service) => ({
        ...service,
        icon: ICON_MAP[service.icon] || ICON_MAP.Code2,
      }));
      setAllServices(mappedServices);

      const byService = {};
      (detailsRes.serviceDetails || []).forEach((d) => {
        byService[d.service_id] = d;
      });
      setDetailsByService(byService);
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
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  };

  const openEditForm = (serviceId) => {
    const existing = detailsByService[serviceId];
    setActiveServiceId(serviceId);
    if (existing) {
      setForm({
        intro: existing.intro || '',
        status: existing.status || 'draft',
        capabilities: existing.capabilities?.length ? existing.capabilities : [''],
        outcomes: existing.outcomes?.length ? existing.outcomes : [''],
        deliverables: existing.deliverables?.length ? existing.deliverables : [''],
        ideal_fit: existing.ideal_fit?.length ? existing.ideal_fit : [''],
        faqs: existing.faqs?.length ? existing.faqs : [{ question: '', answer: '' }],
      });
    } else {
      setForm(emptyForm());
    }
    setSaveError('');
    setView('form');
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e, statusOverride) => {
    e.preventDefault();
    if (saving || !activeServiceId) return;

    setSaving(true);
    setSaveError('');

    const payload = { ...form, status: statusOverride || form.status };

    try {
      await adminFetch(`/api/admin/service-details/${activeServiceId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setView('list');
      loadAll();
    } catch (err) {
      setSaveError(err.message || 'Could not save this service detail page.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Delete this detail page? The service card itself will stay untouched.')) return;
    setDeletingId(serviceId);
    try {
      await adminFetch(`/api/admin/service-details/${serviceId}`, { method: 'DELETE' });
      setDetailsByService((prev) => {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      });
    } catch (err) {
      alert(err.message || 'Could not delete this detail page.');
    } finally {
      setDeletingId(null);
    }
  };

  const activeService = allServices.find((s) => s.id === activeServiceId);

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
              Service Detail Manager
            </h1>
            <p className="text-sm text-[#737685] mt-2 max-w-xl">
              Add detail-page content (capabilities, outcomes, deliverables, ideal fit, FAQ) for
              your existing service cards. The cards on the Services and Home pages stay exactly
              as they are — this only fills in what shows up behind each card&apos;s detail page.
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
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading services…
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#c3c6d6]/30 text-left text-xs uppercase tracking-wider text-[#737685]">
                        <th className="px-5 py-3 font-semibold">Service</th>
                        <th className="px-5 py-3 font-semibold">Tag</th>
                        <th className="px-5 py-3 font-semibold">Detail Page Status</th>
                        <th className="px-5 py-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allServices.map((service) => {
                        const existing = detailsByService[service.id];
                        const Icon = service.icon;
                        return (
                          <tr key={service.id} className="border-b border-[#c3c6d6]/15 last:border-0 hover:bg-[#faf8ff]">
                            <td className="px-5 py-3.5 text-[#131b2e] font-medium max-w-xs">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-[#e1e7ff] flex items-center justify-center flex-shrink-0">
                                  {Icon && <Icon className="w-4 h-4 text-[#003594]" />}
                                </div>
                                <span className="truncate">{service.title}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-[#434654]">{service.tag}</td>
                            <td className="px-5 py-3.5">
                              <StatusPill status={existing?.status || 'none'} />
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => openEditForm(service.id)}
                                  aria-label={`Edit detail page for ${service.title}`}
                                  className="p-2 rounded-lg text-[#003594] hover:bg-[#e1e7ff] transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                {existing && (
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(service.id)}
                                    disabled={deletingId === service.id}
                                    aria-label={`Delete detail page for ${service.title}`}
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                  >
                                    {deletingId === service.id ? (
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

        {view === 'form' && activeService && (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-sm p-6 md:p-8 space-y-6 max-w-3xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#e1e7ff] flex items-center justify-center flex-shrink-0">
                {activeService.icon && <activeService.icon className="w-6 h-6 text-[#003594]" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#737685]">
                  Detail Page For
                </p>
                <h2 className="text-lg font-bold text-[#131b2e]">{activeService.title}</h2>
              </div>
            </div>

            <div>
              <label htmlFor="intro" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                Intro <span className="normal-case font-normal text-[#737685]">(optional — falls back to the card description if left blank)</span>
              </label>
              <textarea
                id="intro"
                rows={3}
                value={form.intro}
                onChange={(e) => handleFieldChange('intro', e.target.value)}
                placeholder="A short intro paragraph shown at the top of the detail page…"
                className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e] resize-none"
              />
            </div>

            <SimpleListEditor
              label="Capabilities"
              hint={`what we build — up to ${LIST_LIMITS.capabilities}`}
              field="capabilities"
              items={form.capabilities}
              onChange={handleFieldChange}
              max={LIST_LIMITS.capabilities}
              placeholder="e.g. Marketing and corporate websites"
            />

            <SimpleListEditor
              label="Outcomes"
              hint={`key benefits — up to ${LIST_LIMITS.outcomes}`}
              field="outcomes"
              items={form.outcomes}
              onChange={handleFieldChange}
              max={LIST_LIMITS.outcomes}
              placeholder="e.g. Stronger first impressions online"
            />

            <StepListEditor
              items={form.deliverables}
              onChange={handleFieldChange}
              max={LIST_LIMITS.deliverables}
            />

            <SimpleListEditor
              label="Ideal For"
              hint={`up to ${LIST_LIMITS.ideal_fit}`}
              field="ideal_fit"
              items={form.ideal_fit}
              onChange={handleFieldChange}
              max={LIST_LIMITS.ideal_fit}
              placeholder="e.g. B2B companies refreshing their digital presence"
            />

            <FaqListEditor items={form.faqs} onChange={handleFieldChange} max={LIST_LIMITS.faqs} />

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

export default AdminServiceDetails;