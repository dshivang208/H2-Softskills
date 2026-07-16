import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Send,
  LogOut,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Mail,
  History,
} from 'lucide-react';
import { adminFetch, clearAdminToken } from '../lib/adminApi';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-[#c3c6d6]/30 p-6 flex items-center gap-4 shadow-sm">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: accent + '1a' }}
      >
        <Icon className="w-6 h-6" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-2xl font-black text-[#131b2e] leading-none">{value}</p>
        <p className="text-xs uppercase tracking-wider text-[#737685] mt-1">{label}</p>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();

  const [subscribers, setSubscribers] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendStatus, setSendStatus] = useState('idle'); // idle | sending | sent | error
  const [sendError, setSendError] = useState('');
  const [sendResult, setSendResult] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const activeCount = useMemo(
    () => subscribers.filter((s) => s.status === 'active').length,
    [subscribers]
  );

  async function loadData() {
    setLoading(true);
    setLoadError('');
    try {
      const [subsData, broadcastsData] = await Promise.all([
        adminFetch('/api/admin/subscribers'),
        adminFetch('/api/admin/broadcasts'),
      ]);
      setSubscribers(subsData.subscribers || []);
      setBroadcasts(broadcastsData.broadcasts || []);
    } catch (err) {
      setLoadError(err.message || 'Could not load dashboard data.');
      if (err.message?.toLowerCase().includes('session expired')) {
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login', { replace: true });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    setDeletingId(id);
    try {
      await adminFetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' });
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete subscriber.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (sendStatus === 'sending') return;

    if (activeCount === 0) {
      setSendStatus('error');
      setSendError('There are no active subscribers to send to.');
      return;
    }

    if (!window.confirm(`Send this email to ${activeCount} subscriber${activeCount === 1 ? '' : 's'}?`)) {
      return;
    }

    setSendStatus('sending');
    setSendError('');
    setSendResult(null);

    try {
      const data = await adminFetch('/api/admin/broadcast', {
        method: 'POST',
        body: JSON.stringify({ subject, message }),
      });
      setSendStatus('sent');
      setSendResult(data);
      setSubject('');
      setMessage('');
      loadData();
    } catch (err) {
      setSendStatus('error');
      setSendError(err.message || 'Could not send broadcast.');
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
            <span className="font-['Hanken_Grotesk'] text-[#003594] text-sm leading-4 tracking-[0.3em] font-bold uppercase mb-2 block">
              Admin
            </span>
            <h1 className="font-['Hanken_Grotesk'] text-3xl md:text-4xl font-black tracking-tight text-[#131b2e]">
              Newsletter Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c3c6d6]/40 rounded-xl text-[#434654] font-semibold text-sm hover:bg-[#f2f3ff] transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#131b2e] text-white rounded-xl font-semibold text-sm hover:bg-[#0a0f1a] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {loadError && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-8">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{loadError}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <StatCard icon={Users} label="Total Subscribers" value={subscribers.length} accent="#003594" />
          <StatCard icon={Mail} label="Active Subscribers" value={activeCount} accent="#006c49" />
          <StatCard icon={History} label="Broadcasts Sent" value={broadcasts.length} accent="#a34700" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Subscribers table */}
          <section className="lg:col-span-7">
            <h2 className="text-xl font-bold text-[#131b2e] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#003594] rounded-full" />
              Subscribers
            </h2>
            <div className="bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-[#737685]">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading subscribers…
                </div>
              ) : subscribers.length === 0 ? (
                <p className="text-[#737685] text-sm py-16 text-center">No subscribers yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#c3c6d6]/30 text-left text-xs uppercase tracking-wider text-[#737685]">
                        <th className="px-5 py-3 font-semibold">Email</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold">Joined</th>
                        <th className="px-5 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub) => (
                        <tr key={sub.id} className="border-b border-[#c3c6d6]/15 last:border-0 hover:bg-[#faf8ff]">
                          <td className="px-5 py-3.5 text-[#131b2e] font-medium">{sub.email}</td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                sub.status === 'active'
                                  ? 'bg-[#e1f7ec] text-[#006c49]'
                                  : 'bg-[#f2f3f5] text-[#737685]'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[#737685]">
                            {new Date(sub.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleDelete(sub.id)}
                              disabled={deletingId === sub.id}
                              aria-label={`Remove ${sub.email}`}
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {deletingId === sub.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Broadcast history */}
            {broadcasts.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-[#131b2e] mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#a34700] rounded-full" />
                  Recent Broadcasts
                </h2>
                <div className="space-y-3">
                  {broadcasts.map((b) => (
                    <div key={b.id} className="bg-white rounded-xl border border-[#c3c6d6]/30 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-[#131b2e] text-sm truncate">{b.subject}</p>
                        <span className="text-xs text-[#737685] flex-shrink-0">
                          {new Date(b.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#737685] mt-1">
                        Sent to {b.sent_count}/{b.recipient_count} subscribers
                        {b.failed_count > 0 ? ` · ${b.failed_count} failed` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Broadcast composer */}
          <section className="lg:col-span-5">
            <h2 className="text-xl font-bold text-[#131b2e] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#006c49] rounded-full" />
              Send a Broadcast
            </h2>
            <form
              onSubmit={handleBroadcast}
              className="bg-white rounded-2xl border border-[#c3c6d6]/30 shadow-sm p-6 space-y-5"
            >
              <p className="text-sm text-[#434654]">
                This will email <strong>{activeCount}</strong> active subscriber
                {activeCount === 1 ? '' : 's'}.
              </p>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="This week's insights from H2 Softskills"
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e]"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#434654] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your update here…"
                  className="w-full px-4 py-3 bg-[#f2f3ff] border border-[#c3c6d6]/50 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all text-[#131b2e] resize-none"
                />
              </div>

              {sendStatus === 'error' && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              {sendStatus === 'sent' && sendResult && (
                <div className="flex items-start gap-2 text-sm text-[#006c49] bg-[#e1f7ec] border border-[#c7ecd9] rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Sent to {sendResult.sentCount}/{sendResult.recipientCount} subscribers
                    {sendResult.failedCount > 0 ? ` (${sendResult.failedCount} failed)` : ''}.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={sendStatus === 'sending'}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#003594] text-white font-bold rounded-xl hover:bg-[#002a72] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sendStatus === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Broadcast
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;