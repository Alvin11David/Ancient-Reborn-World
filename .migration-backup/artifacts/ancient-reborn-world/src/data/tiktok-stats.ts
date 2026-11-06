export type MetricDelta = {
  /** Absolute change over the reporting window. */
  change: number;
  /** Percentage change, or null when the previous value was zero. */
  percent: number | null;
};

export type LiveMetric = {
  id: string;
  label: string;
  value: number | null;
  delta: MetricDelta | null;
};

export type RecentPost = {
  id: string;
  duration: string;
  caption: string;
  published: string;
  views: number;
  likes: number;
  comments: number;
};

export type LatestComment = {
  author: string;
  postedAgo: string;
  body: string;
  likes: number;
};

export const tiktokProfile = {
  handle: 'ancientrebornworld',
  displayName: 'Ancient Reborn World',
  url: 'https://www.tiktok.com/@ancientrebornworld',
  bio: '🏛️ Bringing forgotten places back to life 🌿 Ancient ruins • AI restoration',
  /** When these numbers were last verified against the TikTok profile. */
  snapshotAt: '06 Nov 2026',
  windowLabel: 'Last 7 days',
  totals: {
    likes: 296,
    followers: 46,
    following: 0,
  },
  metrics: [
    { id: 'views', label: 'Video views', value: 136, delta: { change: -382, percent: -73.7 } },
    { id: 'profile-views', label: 'Profile views', value: 0, delta: { change: -2, percent: -100 } },
    { id: 'likes', label: 'Likes', value: 22, delta: { change: -17, percent: -43.6 } },
    { id: 'comments', label: 'Comments', value: null, delta: null },
    { id: 'shares', label: 'Shares', value: 0, delta: { change: 0, percent: 0 } },
    { id: 'rewards', label: 'Est. rewards', value: null, delta: null },
  ] satisfies LiveMetric[],
  recentPosts: [
    {
      id: 'boy-these-two',
      duration: '00:58',
      caption:
        'BOY, THESE TWO ARE NOT READY FOR A JOB! 😂😭 Bongo is making excuses, Kiko is roasting him, and the interview is getting worse! 🤣 WHO WOULD YOU HIRE?! 👀 #BongoAndKiko #FunnyAnimation #StickmanComedy #ComedyTok #FunnyVideos #animatedcomedy #JobInterview',
      published: 'Nov 3 · 2:38 PM',
      views: 80,
      likes: 17,
      comments: 0,
    },
    {
      id: 'bongo-said-job',
      duration: '00:54',
      caption:
        "Bongo said they got a job... but BOY, he doesn't even know what the job is! 😭😂 Kiko is already tired of this man! Wait for Part 2! 🤣 #BongoAndKiko #FunnyAnimation #StickmanComedy #ComedyTok #FunnyVideos #Animation",
      published: 'Nov 2 · 11:47 AM',
      views: 97,
      likes: 22,
      comments: 0,
    },
  ] satisfies RecentPost[],
  latestComment: {
    author: 'ancientrebornworld',
    postedAgo: '3w ago',
    body: '🔮 Make your prediction before Part 4! 🏛️ LOST CITY 🏔️ SECRET PATH — which one will the ancient machine reveal? 👇 Follow us to find out!',
    likes: 0,
  } satisfies LatestComment,
};
