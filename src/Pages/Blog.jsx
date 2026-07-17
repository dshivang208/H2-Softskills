import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchPublishedPosts, fetchPopularPosts, API_URL } from '../lib/blogApi';

const DEFAULT_CATEGORIES = [
  'Web Development',
  'Blockchain',
  'Mobile Apps',
  'CRM',
  'Digital Marketing',
  'AI & Automation',
];

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function Blog() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');

  const [articles, setArticles] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle | sending | sent | error
  const [newsletterError, setNewsletterError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      setLoading(true);
      setLoadError('');
      try {
        const [postsData, popularData] = await Promise.all([
          fetchPublishedPosts({ category: activeCategory }),
          fetchPopularPosts(),
        ]);
        if (cancelled) return;
        setArticles(postsData.posts || []);
        setPopularPosts(popularData.posts || []);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Could not load blog posts.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (newsletterStatus === 'sending') return;

    setNewsletterStatus('sending');
    setNewsletterError('');

    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setNewsletterStatus('sent');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 4000);
    } catch (err) {
      setNewsletterStatus('error');
      setNewsletterError(err.message || 'Something went wrong. Please try again.');
    }
  };

  // Category filtering already happens server-side (see the effect above),
  // so here we only need to apply the client-side search box.
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const categories = ['All Articles', ...DEFAULT_CATEGORIES];

  return (
    <main className="relative min-h-screen bg-[#faf8ff] tech-grid overflow-x-hidden">
      {/* Atmospheric Glows */}
      <div className="floating-radial bg-[#003594] top-0 -left-64" />
      <div className="floating-radial bg-[#006c49] bottom-0 -right-64" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12 md:py-20">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between  mb-16 gap-8">
          <div className="max-w-3xl">
            <span className="font-['Hanken_Grotesk'] text-[#003594] text-lg leading-4 tracking-[0.3em] font-bold uppercase mb-3 block">
              Our Blog
            </span>
            <h1 className="font-['Hanken_Grotesk'] text-4xl md:text-[54px] leading-tight md:leading-[64px] font-black tracking-tight text-[#131b2e] mb-4">
              Insights, Ideas &amp; <br className="hidden md:block" />
              Industry <span className="gradient-text">Trends</span>
            </h1>
            <p className="text-[#434654] text-lg md:text-xl leading-relaxed max-w-2xl font-normal">
              Stay updated with the latest insights, tips, and trends in technology and digital
              transformation.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full lg:max-w-xs">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-4 pr-12 py-3.5 bg-white border border-[#c3c6d6]/30 rounded-xl focus:ring-2 focus:ring-[#003594] focus:border-transparent outline-none transition-all duration-300 shadow-sm group-hover:shadow-md text-[#131b2e]"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#737685] pointer-events-none" />
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Articles List */}
          <section className="lg:col-span-8 space-y-10">
            {loadError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{loadError}</span>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-16 text-[#737685]">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading articles…
              </div>
            ) : (
              <>
                {filteredArticles.length === 0 && !loadError && (
                  <p className="text-[#434654] text-base">
                    No articles found{activeCategory !== 'All Articles' ? ` in "${activeCategory}"` : ''}
                    {searchQuery ? ` matching "${searchQuery}"` : ''}.
                  </p>
                )}
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => navigate(`/blog/${article.slug}`)}
                    className="group flex flex-col md:flex-row gap-6 p-2 -m-2 rounded-2xl hover:bg-white transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-full md:w-64 h-44 flex-shrink-0 overflow-hidden rounded-2xl bg-[#eaedff]">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col justify-center py-2">
                      <h2 className="text-[22px] leading-tight font-bold text-[#131b2e] mb-3 group-hover:text-[#003594] transition-colors duration-300">
                        {article.title}
                      </h2>
                      <p className="text-[#434654] text-base leading-relaxed mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 font-['JetBrains_Mono'] text-xs text-[#737685] uppercase tracking-wider">
                        <span>{formatDate(article.created_at)}</span>
                        <span className="w-1 h-1 bg-[#c3c6d6] rounded-full" />
                        <span>{article.read_time}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </>
            )}
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Categories */}
            <div>
              <h3 className="text-xl font-bold text-[#131b2e] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#003594] rounded-full" />
                Categories
              </h3>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeCategory === category
                        ? 'bg-[#e1e7ff] text-[#003594] font-bold'
                        : 'text-[#434654] hover:bg-white hover:text-[#003594]'
                    }`}
                  >
                    <span>{category}</span>
                    {activeCategory === category && (
                      <ChevronRight className="w-4 h-4 opacity-60" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Popular Posts */}
            {popularPosts.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-[#131b2e] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#006c49] rounded-full" />
                  Popular Posts
                </h3>
                <div className="space-y-6">
                  {popularPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="flex gap-4 group cursor-pointer items-start"
                    >
                      <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-2xl bg-[#eaedff]">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#131b2e] leading-tight group-hover:text-[#003594] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <span className="text-[11px] text-[#737685] font-medium mt-1 block uppercase tracking-tight">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Subscription Card */}
            <div className="p-8 rounded-2xl bg-[#004ac6] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-125" />
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                Get the best of tech directly in your inbox.
              </h3>
              <p className="text-[#dbe1ff] text-sm mb-6 relative z-10">
                No spam, just pure insights once a week.
              </p>
              {newsletterStatus === 'sent' ? (
                <div className="relative z-10 flex items-center gap-2 text-white bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>You&apos;re subscribed! Welcome aboard.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3 relative z-10">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:bg-white/20 focus:outline-none transition-all"
                  />
                  {newsletterStatus === 'error' && (
                    <div className="flex items-start gap-2 text-xs text-red-100 bg-red-500/20 border border-red-300/30 rounded-lg px-3 py-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{newsletterError}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={newsletterStatus === 'sending'}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#003594] font-bold rounded-xl hover:bg-[#9df4c8] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {newsletterStatus === 'sending' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Subscribing…
                      </>
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Blog;