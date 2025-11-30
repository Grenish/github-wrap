import { WrappedData, Language, Week, ContributionDay } from "./types";

interface GitHubEvent {
  type: string;
  created_at: string;
  payload: {
    size?: number;
    action?: string;
  };
}

interface GraphQLRepo {
  name: string;
  stargazerCount: number;
  primaryLanguage: { name: string; color: string } | null;
  contributions?: {
    nodes: Array<{ occurredAt: string }>;
  };
}

interface RepoData {
  name: string;
  stargazerCount?: number;
  stargazers_count?: number; // REST API fallback
  primaryLanguage?: { name: string; color: string };
  language?: string; // REST API fallback
}

// --- Helpers ---

const analyzeTiming = (dates: Date[]) => {
  if (dates.length === 0) return { peakHour: 12, activeDay: 0 };
  const hours = new Array(24).fill(0);
  const days = new Array(7).fill(0);
  dates.forEach((d) => {
    hours[d.getHours()]++;
    days[d.getDay()]++;
  });
  return {
    peakHour: hours.indexOf(Math.max(...hours)),
    activeDay: days.indexOf(Math.max(...days)),
  };
};

const generateMockHeatmapFromDates = (dates: Date[]): Week[] => {
  const dateMap: Record<string, number> = {};
  dates.forEach((d) => {
    const iso = d.toISOString().split("T")[0];
    dateMap[iso] = (dateMap[iso] || 0) + 1;
  });

  const weeks: Week[] = [];
  const current = new Date();
  // Go back ~20 weeks
  current.setDate(current.getDate() - 20 * 7);
  // Align to Sunday
  while (current.getDay() !== 0) current.setDate(current.getDate() - 1);

  const end = new Date();

  for (let w = 0; w < 21; w++) {
    const week: Week = { contributionDays: [] };
    for (let d = 0; d < 7; d++) {
      const iso = current.toISOString().split("T")[0];
      week.contributionDays.push({
        contributionCount: dateMap[iso] || 0,
        date: iso,
        weekday: d,
      });
      current.setDate(current.getDate() + 1);
      if (current > end) break;
    }
    weeks.push(week);
  }
  return weeks;
};

// --- Main Function ---

export const fetchGitHubData = async (
  username: string,
  token: string,
): Promise<Omit<WrappedData, "analysis">> => {
  const headers: HeadersInit = token ? { Authorization: `token ${token}` } : {};

  // 1. Fetch User Profile
  const userRes = await fetch(`https://api.github.com/users/${username}`, {
    headers,
  });

  if (!userRes.ok) {
    if (userRes.status === 404) throw new Error("User not found");
    throw new Error("Failed to fetch user data");
  }

  const user = await userRes.json();

  // Initialize Data containers
  let stats = { commits: 0, prs: 0, issues: 0, stars: 0, last90Days: 0 };
  let repos: RepoData[] = [];
  let heatmap: Week[] = [];
  let streaks = { current: 0, longest: 0, longestBreak: 0 };
  let timing = { peakHour: 12, activeDay: 0 };
  const workStyle = { weekend: 0, weekday: 0 };
  let isExact = false;

  try {
    if (token) {
      // --- BRANCH A: AUTHENTICATED (GRAPHQL) ---
      const query = `
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              totalCommitContributions
              totalPullRequestContributions
              totalIssueContributions
              contributionCalendar {
                weeks {
                  contributionDays { contributionCount date weekday }
                }
              }
              commitContributionsByRepository(maxRepositories: 5) {
                  contributions(first: 100) { nodes { occurredAt } }
              }
            }
            repositories(first: 50, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: OWNER) {
              nodes { name, stargazerCount, primaryLanguage { name, color } }
            }
          }
        }
      `;

      const gqlRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables: { login: username } }),
      });
      const gqlData = await gqlRes.json();

      if (gqlData.data?.user) {
        const c = gqlData.data.user.contributionsCollection;
        stats = {
          commits: c.totalCommitContributions,
          prs: c.totalPullRequestContributions,
          issues: c.totalIssueContributions,
          stars: 0,
          last90Days: 0,
        };

        // Fix: Use GraphQLRepo type instead of 'any'
        if (gqlData.data.user.repositories?.nodes) {
          repos = gqlData.data.user.repositories.nodes.map(
            (node: GraphQLRepo) => ({
              name: node.name,
              stargazerCount: node.stargazerCount,
              primaryLanguage: node.primaryLanguage || undefined, // Convert null to undefined
            }),
          );
        }

        heatmap = c.contributionCalendar.weeks;
        isExact = true;

        const commitTimes: Date[] = [];
        if (c.commitContributionsByRepository) {
          c.commitContributionsByRepository.forEach((repo: GraphQLRepo) => {
            if (repo.contributions) {
              repo.contributions.nodes.forEach((n) =>
                commitTimes.push(new Date(n.occurredAt)),
              );
            }
          });
        }
        timing = analyzeTiming(commitTimes);
      }
    } else {
      // --- BRANCH B: UNAUTHENTICATED (REST) ---
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        { headers },
      );
      const reposData = await reposRes.json();
      repos = Array.isArray(reposData) ? reposData : [];

      const eventsRes = await fetch(
        `https://api.github.com/users/${username}/events?per_page=100`,
        { headers },
      );
      const events: GitHubEvent[] = await eventsRes.json();

      const eventDates: Date[] = [];
      let publicCommits = 0;
      let publicPrs = 0;

      if (Array.isArray(events)) {
        events.forEach((e) => {
          const date = new Date(e.created_at);
          if (e.type === "PushEvent") {
            publicCommits += e.payload.size || 1;
            eventDates.push(date);
          } else if (
            e.type === "PullRequestEvent" &&
            e.payload.action === "opened"
          ) {
            publicPrs++;
            eventDates.push(date);
          } else if (
            e.type === "IssuesEvent" &&
            e.payload.action === "opened"
          ) {
            eventDates.push(date);
          }
        });
      }

      timing = analyzeTiming(eventDates);
      stats.commits = publicCommits;
      stats.prs = publicPrs;
      stats.last90Days = eventDates.length;

      if (eventDates.length > 0) {
        heatmap = generateMockHeatmapFromDates(eventDates);
      }
    }

    // --- COMMON PROCESSING ---

    if (heatmap.length > 0) {
      const today = new Date();
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(today.getDate() - 90);

      let currentStreak = 0;
      let maxStreak = 0;
      let tempBreak = 0;
      let maxBreak = 0;
      let isActive = false;

      const days: ContributionDay[] = heatmap.flatMap(
        (w) => w.contributionDays,
      );

      days.forEach((day) => {
        const d = new Date(day.date);
        if (token && d > ninetyDaysAgo)
          stats.last90Days += day.contributionCount;

        if (day.contributionCount > 0) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
          if (isActive) {
            maxBreak = Math.max(maxBreak, tempBreak);
            tempBreak = 0;
          }
          isActive = true;

          if (day.weekday === 0 || day.weekday === 6) {
            workStyle.weekend += day.contributionCount;
          } else {
            workStyle.weekday += day.contributionCount;
          }
        } else {
          currentStreak = 0;
          if (isActive) tempBreak++;
        }
      });

      const lastDay = days[days.length - 1];
      const yesterday = days[days.length - 2];
      const isStreakActive =
        (lastDay && lastDay.contributionCount > 0) ||
        (yesterday && yesterday.contributionCount > 0);

      streaks = {
        current: isStreakActive
          ? lastDay.contributionCount > 0
            ? currentStreak
            : yesterday.contributionCount > 0
              ? currentStreak
              : 0
          : 0,
        longest: maxStreak,
        longestBreak: maxBreak,
      };
    }

    // Language Processing
    const langCounts: Record<string, { count: number; color: string }> = {};

    repos.forEach((repo) => {
      const stars = repo.stargazerCount ?? repo.stargazers_count ?? 0;
      stats.stars += stars;

      const lName = repo.primaryLanguage?.name || repo.language;
      const lColor = repo.primaryLanguage?.color || "#fff";

      if (lName) {
        if (!langCounts[lName]) langCounts[lName] = { count: 0, color: lColor };
        langCounts[lName].count++;
      }
    });

    const sortedLangs: Language[] = Object.entries(langCounts)
      .map(([name, d]) => ({
        name,
        count: d.count,
        color: d.color,
        percent: 0,
      }))
      .sort((a, b) => b.count - a.count);

    const totalL = sortedLangs.reduce((a, c) => a + c.count, 0);

    if (totalL > 0) {
      sortedLangs.forEach(
        (l) => (l.percent = Math.round((l.count / totalL) * 100)),
      );
    }

    return {
      user,
      stats,
      repos,
      languages: sortedLangs,
      heatmap,
      streaks,
      timing,
      workStyle,
      isExact,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(errorMessage);
  }
};
