export interface Theme {
  id: string;
  bg: string;
  text: string;
  highlight: string;
  accent: string;
  gradient: string;
  blob1: string;
  blob2: string;
  border: string;
}

export interface Language {
  name: string;
  count: number;
  color: string;
  percent: number;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

export interface Week {
  contributionDays: ContributionDay[];
}

export interface WrappedData {
  user: {
    login: string;
    id: number;
    avatar_url: string;
    name?: string;
  };
  stats: {
    commits: number;
    prs: number;
    issues: number;
    stars: number;
    last90Days: number;
  };
  repos: Array<{
    name: string;
    stargazerCount?: number;
    stargazers_count?: number;
    primaryLanguage?: { name: string; color: string };
    language?: string;
    forkCount?: number;
  }>;
  languages: Language[];
  analysis: {
    title: string;
    remarks: string;
    disciplineLevel: string;
    vibe: string;
  };
  streaks: {
    current: number;
    longest: number;
    longestBreak: number;
  };
  timing: {
    peakHour: number;
    activeDay: number;
  };
  workStyle: {
    weekend: number;
    weekday: number;
  };
  mostProductiveDay: {
    date: string;
    count: number;
  };
  codeStats: {
    additions: number;
    deletions: number;
  };
  heatmap: Week[];
  isExact: boolean;
}
