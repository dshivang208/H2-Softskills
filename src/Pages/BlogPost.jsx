import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { fetchPostBySlug, fetchPopularPosts } from '../lib/blogApi';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      setLoading(true);
      setLoadError('');
      try {
        const [postData, popularData] = await Promise.all([
          fetchPostBySlug(slug),
          fetchPopularPosts(),
        ]);
        if (cancelled) return;
        setPost(postData.post);
        setPopularPosts(popularData.posts || []);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Could not load this post.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPost();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <main className="relative min-h-screen bg-[#faf8ff] tech-grid overflow-x-hidden">
      <div className="floating-radial bg-[#003594] top-0 -left-64" />
      <div className="floating-radial bg-[#006c49] bottom-0 -right-64" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#003594] hover:text-[#002a72] mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {loading && (
          <div className="flex items-center justify-center py-24 text-[#737685]">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading post…
          </div>
        )}

        {!loading && loadError && (
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{loadError}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="text-sm font-semibold text-[#003594] hover:underline"
            >
              Return to the blog
            </button>
          </div>
        )}

        {!loading && !loadError && post && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <article className="lg:col-span-8">
              <span className="font-['Hanken_Grotesk'] text-[#003594] text-sm leading-4 tracking-[0.3em] font-bold uppercase mb-4 block">
                {post.category}
              </span>
              <h1 className="font-['Hanken_Grotesk'] text-3xl md:text-5xl leading-tight font-black tracking-tight text-[#131b2e] mb-5">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 font-['JetBrains_Mono'] text-xs text-[#737685] uppercase tracking-wider mb-8">
                <span>{post.author}</span>
                <span className="w-1 h-1 bg-[#c3c6d6] rounded-full" />
                <span>{formatDate(post.created_at)}</span>
                <span className="w-1 h-1 bg-[#c3c6d6] rounded-full" />
                <span>{post.read_time}</span>
              </div>

              {post.image_url && (
                <div className="w-full h-64 md:h-96 overflow-hidden rounded-2xl bg-[#eaedff] mb-10">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-5 text-[#434654] text-lg leading-relaxed">
                {post.content
                  .split('\n')
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph, idx) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <p key={idx}>{paragraph}</p>
                  ))}
              </div>
            </article>

            {/* Sidebar */}
            {popularPosts.length > 0 && (
              <aside className="lg:col-span-4">
                <h3 className="text-xl font-bold text-[#131b2e] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#006c49] rounded-full" />
                  Popular Posts
                </h3>
                <div className="space-y-6">
                  {popularPosts.map((popular) => (
                    <div
                      key={popular.id}
                      onClick={() => navigate(`/blog/${popular.slug}`)}
                      className="flex gap-4 group cursor-pointer items-start"
                    >
                      <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-2xl bg-[#eaedff]">
                        <img
                          src={popular.image_url}
                          alt={popular.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#131b2e] leading-tight group-hover:text-[#003594] transition-colors line-clamp-2">
                          {popular.title}
                        </h4>
                        <span className="text-[11px] text-[#737685] font-medium mt-1 block uppercase tracking-tight">
                          {formatDate(popular.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default BlogPost;