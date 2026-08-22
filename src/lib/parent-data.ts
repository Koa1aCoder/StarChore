export type Chore = {
  id: string;
  title: string;
  assignee: string;
  difficulty: "Easy" | "Medium" | "Hard";
  dueDate: string;
  reward: number;
  requirePhoto: boolean;
  requireApproval: boolean;
  recurring: "One-time" | "Daily" | "Weekly";
  instructions: string;
  checklist: string[];
};

export const initialChores: Chore[] = [
  {
    id: "chore-1",
    title: "Make your bed",
    assignee: "Praise",
    difficulty: "Easy",
    dueDate: "Today",
    reward: 5,
    requirePhoto: false,
    requireApproval: false,
    recurring: "Daily",
    instructions: "Straighten sheets, fluff pillows, fold the blanket.",
    checklist: ["Sheets straight", "Pillows fluffed", "Blanket folded"],
  },
  {
    id: "chore-2",
    title: "Kitchen Cleanup",
    assignee: "Zion",
    difficulty: "Medium",
    dueDate: "Today",
    reward: 10,
    requirePhoto: true,
    requireApproval: true,
    recurring: "Daily",
    instructions: "Wipe counters, load dishwasher, sweep floor.",
    checklist: ["Counters wiped", "Dishwasher loaded", "Floor swept"],
  },
  {
    id: "chore-3",
    title: "Laundry",
    assignee: "Shiloh",
    difficulty: "Medium",
    dueDate: "Fri",
    reward: 8,
    requirePhoto: false,
    requireApproval: true,
    recurring: "Weekly",
    instructions: "Wash, dry, fold, and put away.",
    checklist: ["Washed", "Dried", "Folded", "Put away"],
  },
  {
    id: "chore-4",
    title: "Water the garden",
    assignee: "Shalom",
    difficulty: "Easy",
    dueDate: "Today",
    reward: 4,
    requirePhoto: true,
    requireApproval: false,
    recurring: "Daily",
    instructions: "Water all outdoor plants until soil is moist.",
    checklist: ["Front yard", "Back yard"],
  },
  {
    id: "chore-5",
    title: "Take out the trash",
    assignee: "Rotating",
    difficulty: "Hard",
    dueDate: "Sat",
    reward: 12,
    requirePhoto: false,
    requireApproval: true,
    recurring: "Weekly",
    instructions: "Bins to the curb before 8am pickup.",
    checklist: ["Trash bin", "Recycling bin"],
  },
];

export type Kid = {
  name: string;
  icon: string;
  color: string;
  age: number;
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  streak: number;
  weeklyProgress: number;
  monthlyProgress: number;
  completion: number;
  goals: string[];
  badges: string[];
};

export const kids: Kid[] = [
  {
    name: "Praise",
    icon: "P",
    color: "#f6c85f",
    age: 12,
    level: 6,
    xp: 320,
    xpToNext: 400,
    coins: 85,
    streak: 7,
    weeklyProgress: 90,
    monthlyProgress: 78,
    completion: 82,
    goals: ["20 min reading streak", "Zoo Trip fund"],
    badges: ["Team Players", "Early Bird"],
  },
  {
    name: "Zion",
    icon: "Z",
    color: "#a78bfa",
    age: 10,
    level: 5,
    xp: 260,
    xpToNext: 350,
    coins: 60,
    streak: 4,
    weeklyProgress: 70,
    monthlyProgress: 65,
    completion: 68,
    goals: ["Kitchen cleanup streak"],
    badges: ["Team Players"],
  },
  {
    name: "Shiloh",
    icon: "S",
    color: "#38bdf8",
    age: 8,
    level: 4,
    xp: 180,
    xpToNext: 250,
    coins: 40,
    streak: 3,
    weeklyProgress: 55,
    monthlyProgress: 50,
    completion: 60,
    goals: ["Laundry helper badge"],
    badges: [],
  },
  {
    name: "Shalom",
    icon: "S",
    color: "#f472b6",
    age: 6,
    level: 2,
    xp: 90,
    xpToNext: 150,
    coins: 20,
    streak: 2,
    weeklyProgress: 45,
    monthlyProgress: 40,
    completion: 50,
    goals: ["Garden watering streak"],
    badges: [],
  },
];

export type ApprovalItem = {
  id: string;
  kid: string;
  type: "Photo" | "Video" | "Voice Note" | "Chore" | "Reward" | "Bonus Request";
  label: string;
  submittedAt: string;
};

export const initialApprovals: ApprovalItem[] = [
  { id: "approval-1", kid: "Praise", type: "Chore", label: "20 min reading", submittedAt: "9:12 AM" },
  { id: "approval-2", kid: "Zion", type: "Photo", label: "Kitchen Cleanup proof", submittedAt: "8:40 AM" },
  { id: "approval-3", kid: "Shiloh", type: "Reward", label: "Redeem: Stay Up Later", submittedAt: "Yesterday" },
  { id: "approval-4", kid: "Shalom", type: "Bonus Request", label: "Extra stars for helping Grandma", submittedAt: "Yesterday" },
];

export type RewardItem = {
  id: string;
  label: string;
  icon: string;
  cost: number;
  availability: string;
  quantity: number | "Unlimited";
  expiration: string;
};

export const initialRewards: RewardItem[] = [
  { id: "reward-1", label: "Screen Time (30 min)", icon: "📱", cost: 20, availability: "Anytime", quantity: "Unlimited", expiration: "None" },
  { id: "reward-2", label: "Movie Night Pick", icon: "🎬", cost: 40, availability: "Weekends", quantity: 1, expiration: "This week" },
  { id: "reward-3", label: "$5 Allowance", icon: "💵", cost: 100, availability: "Anytime", quantity: "Unlimited", expiration: "None" },
  { id: "reward-4", label: "Stay Up Later", icon: "🌙", cost: 30, availability: "School nights", quantity: 2, expiration: "None" },
  { id: "reward-5", label: "Family Trip Vote", icon: "🧳", cost: 150, availability: "Anytime", quantity: 1, expiration: "Aug 31" },
];

export const dailyProgress = [
  { label: "Today", percent: 65 },
  { label: "Yesterday", percent: 90 },
];

export const monthlyProgress = [
  { label: "Week 1", percent: 72 },
  { label: "Week 2", percent: 80 },
  { label: "Week 3", percent: 68 },
  { label: "Week 4", percent: 85 },
];

export const mostCompletedChores = [
  { label: "Make your bed", count: 28 },
  { label: "Feed the dog", count: 24 },
  { label: "Kitchen Cleanup", count: 19 },
];

export const leastCompletedChores = [
  { label: "Take out the trash", count: 6 },
  { label: "Laundry", count: 8 },
];

export const reportSummary = {
  averageTime: "14 min per chore",
  streakHistory: "7-day current streak, 21-day best streak",
  coinsEarned: 640,
  xpEarned: 1850,
};

export const parentActivityFeed = [
  { time: "10:42 AM", message: "Praise completed Clean Bedroom", detail: "⭐ +25" },
  { time: "9:30 AM", message: "Zion earned 100 XP", detail: "🎮" },
  { time: "9:05 AM", message: "Reward redeemed: Movie Night", detail: "🎬" },
  { time: "8:15 AM", message: "Parent assigned Kitchen Cleanup", detail: "🧹" },
  { time: "Yesterday", message: "Shiloh unlocked a new badge", detail: "🏅" },
];

export const notificationTypes = [
  "Chore Completed",
  "Chore Skipped",
  "Reward Requested",
  "Streak Broken",
  "New Badge Earned",
  "Overdue Chore",
  "Weekly Summary Ready",
];
