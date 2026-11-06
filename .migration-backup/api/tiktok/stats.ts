const profileUrl = "https://www.tiktok.com/@ancientrebornworld";
const requestTimeoutMs = 10_000;
const fallbackFollowers = 46;
const fallbackFetchedAt = "2026-11-06T00:00:00.000Z";

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

export default async function handler() {
  try {
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

    return new Response(
      JSON.stringify({
        followers,
        fetchedAt: new Date().toISOString(),
        source: "tiktok-public-profile",
        stale: false,
      }),
      {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      },
    );
  } catch {
    return new Response(
      JSON.stringify({
        followers: fallbackFollowers,
        fetchedAt: fallbackFetchedAt,
        source: "last-verified-tiktok-profile",
        stale: true,
      }),
      {
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
        },
      },
    );
  }
}
