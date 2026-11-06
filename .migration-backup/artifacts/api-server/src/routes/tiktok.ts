import { Router, type IRouter } from "express";

const router: IRouter = Router();
const profileUrl = "https://www.tiktok.com/@ancientrebornworld";
const refreshIntervalMs = 15 * 60 * 1000;
const requestTimeoutMs = 10_000;

type FollowerSnapshot = {
  followers: number;
  fetchedAt: string;
};

let snapshot: FollowerSnapshot | null = null;
let refreshPromise: Promise<FollowerSnapshot> | null = null;

function extractFollowerCount(html: string): number | null {
  const patterns = [
    /"followerCount"\s*:\s*(\d+)/,
    /"fans"\s*:\s*(\d+)/,
    /"followers"\s*:\s*(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const followers = Number(match[1]);
      if (Number.isSafeInteger(followers)) return followers;
    }
  }

  return null;
}

async function fetchSnapshot(): Promise<FollowerSnapshot> {
  const response = await fetch(profileUrl, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
    },
    signal: AbortSignal.timeout(requestTimeoutMs),
  });

  if (!response.ok) {
    throw new Error(`TikTok profile request failed with status ${response.status}`);
  }

  const followers = extractFollowerCount(await response.text());
  if (followers === null) {
    throw new Error("TikTok follower count was not present in the profile response");
  }

  return { followers, fetchedAt: new Date().toISOString() };
}

async function getSnapshot(): Promise<FollowerSnapshot> {
  if (snapshot && Date.now() - Date.parse(snapshot.fetchedAt) < refreshIntervalMs) {
    return snapshot;
  }

  if (!refreshPromise) {
    refreshPromise = fetchSnapshot()
      .then((nextSnapshot) => {
        snapshot = nextSnapshot;
        return nextSnapshot;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

router.get("/tiktok/stats", async (_req, res) => {
  try {
    const current = await getSnapshot();
    res.json({
      ...current,
      source: "tiktok-public-profile",
      stale: false,
    });
  } catch {
    res.status(503).json({
      error: "TikTok follower count is temporarily unavailable.",
      stale: true,
      lastKnown: snapshot,
    });
  }
});

export default router;
