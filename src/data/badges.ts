import { Badge } from '../types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'First Spark',
    description: 'Answered your very first question correctly!',
    icon: '✨',
    category: 'general',
    requirementText: 'Earn your 1st star',
  },
  {
    id: 'maths_spark',
    title: 'Number Explorer',
    description: 'Completed 5 Maths Adventures!',
    icon: '🧮',
    category: 'maths',
    requirementText: 'Earn 5 stars in Maths Adventures',
  },
  {
    id: 'maths_wizard',
    title: 'Maths Magician',
    description: 'Mastered 12 tricky Maths questions!',
    icon: '🎩',
    category: 'maths',
    requirementText: 'Earn 12 stars in Maths Adventures',
  },
  {
    id: 'word_scout',
    title: 'Word Detective',
    description: 'Solved 5 Word Wizard spelling and grammar activities!',
    icon: '🔍',
    category: 'words',
    requirementText: 'Earn 5 stars in Word Wizard',
  },
  {
    id: 'bookworm',
    title: 'Master Storyteller',
    description: 'Read stories and solved 12 Word Wizard questions!',
    icon: '📚',
    category: 'words',
    requirementText: 'Earn 12 stars in Word Wizard',
  },
  {
    id: 'puzzle_solver',
    title: 'Riddle Cracker',
    description: 'Cracked 5 brain-tickling puzzles on Puzzle Island!',
    icon: '🧩',
    category: 'puzzles',
    requirementText: 'Earn 5 stars in Puzzle Island',
  },
  {
    id: 'treasure_finder',
    title: 'Island Explorer',
    description: 'Followed the secret clues and solved the Treasure Hunt!',
    icon: '🗺️',
    category: 'puzzles',
    requirementText: 'Solve all 3 Treasure Hunt clues',
  },
  {
    id: 'streak_hero',
    title: 'Streak Superstar',
    description: 'Got 3 questions right in a row without a wobble!',
    icon: '🔥',
    category: 'general',
    requirementText: 'Achieve a 3-question correct streak',
  },
  {
    id: 'star_hoarder',
    title: 'Star Collector',
    description: 'Gathered a shining hoard of 15 stars!',
    icon: '⭐',
    category: 'general',
    requirementText: 'Collect 15 total stars',
  },
  {
    id: 'galaxy_hero',
    title: 'Galaxy Adventurer',
    description: 'Reached an incredible 35 stars across the kingdom!',
    icon: '🚀',
    category: 'general',
    requirementText: 'Collect 35 total stars',
  },
  {
    id: 'chest_master',
    title: 'Treasure Captain',
    description: 'Unlocked all three mysterious treasure chests!',
    icon: '👑',
    category: 'general',
    requirementText: 'Open all 3 treasure chests',
  },
  {
    id: 'curious_explorer',
    title: 'Curious Explorer',
    description: 'Answered 5 General Knowledge questions about our wonderful world!',
    icon: '🌍',
    category: 'knowledge',
    requirementText: 'Earn 5 stars in General Knowledge',
  },
  {
    id: 'world_whizz',
    title: 'World Whizz',
    description: 'Mastered 12 fascinating facts across science, history and the planet!',
    icon: '🧠',
    category: 'knowledge',
    requirementText: 'Earn 12 stars in General Knowledge',
  },
  {
    id: 'daily_first',
    title: 'Daily Champion',
    description: 'Completed your first full Daily Challenge!',
    icon: '🗓️',
    category: 'general',
    requirementText: 'Complete 1 Daily Challenge',
  },
  {
    id: 'daily_streak_3',
    title: 'Quest Marathoner',
    description: 'Completed the Daily Challenge 3 times!',
    icon: '🏅',
    category: 'general',
    requirementText: 'Complete 3 Daily Challenges',
  },
];

export interface TreasureChestInfo {
  id: string;
  name: string;
  starsRequired: number;
  rewardName: string;
  rewardIcon: string;
  description: string;
  colour: string;
}

export const TREASURE_CHESTS: TreasureChestInfo[] = [
  {
    id: 'chest-1',
    name: 'Woodland Bronze Chest',
    starsRequired: 10,
    rewardName: 'Forest Squirrel Sticker & 3 Bonus Stars',
    rewardIcon: '🐿️',
    description: 'A mossy oak chest filled with acorns, golden leaves, and secret woodland magic!',
    colour: 'from-amber-600 to-amber-800',
  },
  {
    id: 'chest-2',
    name: 'Rainbow Silver Chest',
    starsRequired: 25,
    rewardName: 'Rainbow Unicorn Badge & Sparkle Power',
    rewardIcon: '🦄',
    description: 'A shimmering chest radiating seven brilliant colours of the rainbow!',
    colour: 'from-slate-400 to-blue-600',
  },
  {
    id: 'chest-3',
    name: 'Royal Gold Chest',
    starsRequired: 45,
    rewardName: 'The Golden Crown of Smaya',
    rewardIcon: '👑',
    description: 'The ancient legendary chest of the High Quest Champions!',
    colour: 'from-yellow-400 to-amber-600',
  },
];
