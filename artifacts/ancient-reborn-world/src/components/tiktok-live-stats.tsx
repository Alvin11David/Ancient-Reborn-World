import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Eye,
  Heart,
  MessageCircle,
  Play,
  Share2,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import { useGetTiktokStats } from '@workspace/api-client-react';
import { tiktokProfile, type MetricDelta, type LiveMetric } from '@/data/tiktok-stats';

const numberFormatter = new Intl.NumberFormat('en-US');

function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return { ref, inView };
}

function useCountUp(target: number, active: boolean, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

function AnimatedNumber({ value, active }: { value: number | null; active: boolean }) {
  const animated = useCountUp(value ?? 0, active && value !== null);
  if (value === null) return <span aria-hidden="true">—</span>;
  return <>{numberFormatter.format(animated)}</>;
}

function formatPercent(percent: number) {
  const rounded = Math.round(percent * 10) / 10;
  return `${rounded > 0 ? '+' : ''}${rounded}%`;
}

function DeltaBadge({ delta }: { delta: MetricDelta | null }) {
  if (!delta || delta.percent === null) {
    return <span className="mono text-[8px] text-[#f5efdf]/40">—</span>;
  }

  const flat = delta.change === 0;
  const Icon = delta.change < 0 ? TrendingDown : TrendingUp;
  const tone = flat ? 'text-[#f5efdf]/45' : delta.change < 0 ? 'text-[#e39a76]' : 'text-[#9fd6b4]';

  return (
    <span className={`inline-flex items-center gap-1.5 ${tone}`}>
      <Icon size={12} strokeWidth={1.8} aria-hidden="true" />
      <span className="mono text-[8px]">
        {flat ? '0' : `${delta.change > 0 ? '+' : ''}${delta.change}`} ({formatPercent(delta.percent)})
      </span>
    </span>
  );
}

function MetricRow({ metric, active }: { metric: LiveMetric; active: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[#f5efdf]/12 py-2.5 last:border-b-0">
      <span className="text-[12px] text-[#f5efdf]/70">{metric.label}</span>
      <span className="flex items-center gap-3">
        <span className="display text-[1.35rem] leading-none text-[#f5efdf]">
          <AnimatedNumber value={metric.value} active={active} />
        </span>
        <DeltaBadge delta={metric.delta} />
      </span>
    </div>
  );
}

function PostCard({ post }: { post: (typeof tiktokProfile.recentPosts)[number] }) {
  return (
    <article className="group flex gap-4 rounded-[1.2rem] border border-[#1c302f]/12 bg-[#f0e8d8] p-4 transition-colors hover:border-[#1c302f]/30 md:p-5">
      <div className="relative grid h-14 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#1c4341] text-[#f2d572]">
        <Play size={14} className="opacity-70" aria-hidden="true" />
        <span className="mono absolute bottom-1 text-[7px] tracking-[.06em] text-[#f5efdf]/80">{post.duration}</span>
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 text-[12px] leading-5 text-[#1c302f]/80">{post.caption}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="mono text-[8px] text-[#968b74]">{post.published}</span>
          <span className="flex items-center gap-1.5 text-[#1c302f]/70">
            <Eye size={12} strokeWidth={1.7} aria-hidden="true" />
            <span className="mono text-[8px]">{numberFormatter.format(post.views)} views</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#1c302f]/70">
            <Heart size={12} strokeWidth={1.7} aria-hidden="true" />
            <span className="mono text-[8px]">{numberFormatter.format(post.likes)}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#1c302f]/70">
            <MessageCircle size={12} strokeWidth={1.7} aria-hidden="true" />
            <span className="mono text-[8px]">{numberFormatter.format(post.comments)}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export function TiktokLiveStats() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { metrics, recentPosts, latestComment } = tiktokProfile;
  const {
    data: liveStats,
    isError,
    isLoading,
    refetch,
  } = useGetTiktokStats();

  useEffect(() => {
    const interval = window.setInterval(() => {
      void refetch();
    }, 15 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [refetch]);

  const followers = liveStats?.followers ?? tiktokProfile.totals.followers;
  const lastSyncedAt = liveStats?.fetchedAt ?? null;
  const syncStatus =
    liveStats?.stale || isError
      ? 'stale'
      : isLoading
        ? 'loading'
        : 'synced';
  const totals = { ...tiktokProfile.totals, followers };

  return (
    <section id="community" className="relative overflow-hidden bg-[#e9e2d2] px-5 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div data-reveal className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="mono mb-5 text-[9px] text-[#b94c34]">04 / THE WATCH AT THE WATERLINE</p>
            <h2 className="display max-w-[760px] text-[clamp(3.5rem,8vw,7.3rem)] font-semibold leading-[.82]">
              {totals.followers} keepers.<br />One returning<br /><em className="font-medium text-[#b94c34]">city.</em>
            </h2>
          </div>
          <p className="max-w-[310px] pb-1 text-[13px] leading-6 text-[#53605a]">
            The latest snapshot of the expedition on TikTok — every view, like and new pair of eyes following the map back to Namaris.
          </p>
        </div>

        <div ref={ref} className="grid gap-5 md:grid-cols-[.92fr_1.08fr]">
          <div data-reveal className="map-lines relative overflow-hidden rounded-[1.5rem] bg-[#1c4341] p-7 text-[#f5efdf] md:p-9">
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="mono text-[8px] text-[#e8cd72]">@{tiktokProfile.handle}</span>
                <p className="display mt-2 text-[2rem] font-medium leading-none">{tiktokProfile.displayName}</p>
                <p className="mt-3 max-w-[300px] text-[12px] leading-5 text-[#f5efdf]/65">{tiktokProfile.bio}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#e8cd72]/50 px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8cd72] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e8cd72]" />
                </span>
                <span className="mono text-[8px] text-[#e8cd72]">
                  {syncStatus === 'synced' ? 'Synced from TikTok' : syncStatus === 'loading' ? 'Syncing TikTok' : 'Latest available'}
                </span>
              </span>
            </div>

            <div className="relative mt-8 grid grid-cols-3 gap-3 border-y border-[#f5efdf]/15 py-5">
              {[
                { label: 'Likes', value: totals.likes, Icon: Heart },
                { label: 'Followers', value: totals.followers, Icon: Users },
                { label: 'Following', value: totals.following, Icon: UserPlus },
              ].map(({ label, value, Icon }) => (
                <div key={label}>
                  <Icon size={15} strokeWidth={1.5} className="mb-2 text-[#e8cd72]" aria-hidden="true" />
                  <p className="display text-[2.2rem] leading-none md:text-[2.6rem]">
                    <AnimatedNumber value={value} active={inView} />
                  </p>
                  <span className="mono mt-2 block text-[8px] text-[#f5efdf]/50">{label}</span>
                </div>
              ))}
            </div>

            <div className="relative mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="mono text-[8px] text-[#e8cd72]">Key metrics</span>
                <span className="mono text-[8px] text-[#f5efdf]/45">{tiktokProfile.windowLabel}</span>
              </div>
              {metrics.map((metric) => (
                <MetricRow key={metric.id} metric={metric} active={inView} />
              ))}
            </div>

            <p className="mono relative mt-5 text-[7px] leading-4 text-[#f5efdf]/35">
              {lastSyncedAt
                ? `Last checked ${new Date(lastSyncedAt).toLocaleString()}`
                : `Fallback value · last verified ${tiktokProfile.snapshotAt}`}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div data-reveal className="rounded-[1.5rem] border border-[#1c302f]/15 bg-[#d9d0bd] p-7 md:p-9">
              <div className="mb-5 flex items-center justify-between">
                <span className="mono text-[8px] text-[#1c302f]/60">Recent posts</span>
                <span className="mono text-[8px] text-[#b94c34]">{recentPosts.length} tracked</span>
              </div>
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div data-reveal className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[1.5rem] bg-[#d58650] p-7 text-[#263532] md:p-9">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-[#263532]/15" />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="mono text-[8px]">Latest comment</span>
                  <span className="mono text-[8px] opacity-60">{latestComment.postedAgo}</span>
                </div>
                <p className="display text-[1.4rem] leading-[1.32] md:text-[1.65rem]">“{latestComment.body}”</p>
              </div>
              <div className="relative mt-6 flex items-center justify-between gap-4 border-t border-[#263532]/20 pt-4">
                <span className="mono text-[8px]">@{latestComment.author}</span>
                <span className="flex items-center gap-1.5">
                  <Heart size={12} strokeWidth={1.7} aria-hidden="true" />
                  <span className="mono text-[8px]">{numberFormatter.format(latestComment.likes)}</span>
                </span>
              </div>
            </div>

            <div data-reveal className="flex flex-col gap-4 rounded-[1.5rem] border border-[#1c302f]/20 p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
              <div>
                <p className="mono text-[8px] text-[#b94c34]">Follow the expedition</p>
                <p className="display mt-2 text-[1.5rem] leading-tight md:text-[1.8rem]">Join the next first light.</p>
              </div>
              <a
                href={tiktokProfile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#1c302f] px-5 py-3.5 text-[10px] font-extrabold tracking-[.12em] text-[#f5efdf] transition-all hover:-translate-y-1 hover:bg-[#345b55]"
                data-testid="link-tiktok-profile"
              >
                @{tiktokProfile.handle} <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#1c302f]/15 pt-5">
          {[
            { Icon: Play, id: 'views', suffix: 'views' },
            { Icon: Heart, id: 'likes', suffix: 'likes' },
            { Icon: Share2, id: 'shares', suffix: 'shares' },
          ].map(({ Icon, id, suffix }) => {
            const metric = metrics.find((item) => item.id === id);
            return (
              <span key={id} className="flex items-center gap-2 text-[#53605a]">
                <Icon size={12} strokeWidth={1.7} aria-hidden="true" />
                <span className="mono text-[8px]">
                  {metric?.value == null ? '—' : `${numberFormatter.format(metric.value)} ${suffix}`}
                </span>
              </span>
            );
          })}
          <span className="mono ml-auto text-[8px] text-[#968b74]">Trailing 7 days · TikTok Studio</span>
        </div>
      </div>
    </section>
  );
}
