/**
 * Utility functions and curated data for Sentence Building in Smaya's Brain Quest.
 * Specifically designed for Year 2 (Age 6-7) Key Stage 1 UK Curriculum.
 * Covers:
 * 1. Build from picture prompt with plausible distractors
 * 2. Punctuation & capitalisation fixers (., ?, !)
 * 3. Conjunction connectors (and, but, because, so, or)
 * 4. Sentence expansion with adjectives and adverbs
 * 5. Question vs statement word ordering
 */

import { Question, Difficulty } from '../types';

export type SentenceExerciseType =
  | 'picture_builder'
  | 'punctuation_fixer'
  | 'conjunction_connector'
  | 'sentence_expansion'
  | 'question_vs_statement';

export interface SentenceExercise {
  id: string;
  difficulty: Difficulty;
  exerciseType: SentenceExerciseType;
  prompt: string;
  subprompt?: string;
  contextPicture?: string;
  wordChips: string[]; // Raw chips to display (will be shuffled)
  distractorWords?: string[]; // Plausible distractors that do NOT belong
  correctOrder: string[]; // Primary target tokens
  alternativeOrders?: string[][]; // Accepted grammatical variations
  hints: [string, string, string]; // [Hint 1: Starter word, Hint 2: Grammar clue, Hint 3: First 2 words reveal]
  explanation: string;
  rewardStars: number;
}

/**
 * Robust sentence token matching that handles punctuation variations and case insensitivity.
 */
export function validateSentenceAnswer(
  candidateTokens: string[],
  targetTokens: (string | number)[],
  alternativeOrders?: (string[] | (string | number)[])[]
): boolean {
  if (!candidateTokens || candidateTokens.length === 0) return false;

  const normalize = (tokens: (string | number)[]) =>
    tokens
      .map(String)
      .join(' ')
      .trim()
      .toLowerCase()
      .replace(/\s+([.,?!])/g, '$1'); // Normalise detached punctuation chips

  const candidateStr = normalize(candidateTokens);
  const targetStr = normalize(targetTokens);

  if (candidateStr === targetStr) {
    return true;
  }

  if (alternativeOrders && alternativeOrders.length > 0) {
    for (const alt of alternativeOrders) {
      if (candidateStr === normalize(alt)) {
        return true;
      }
    }
  }

  return false;
}

export const CURATED_SENTENCE_EXERCISES: SentenceExercise[] = [
  // ==========================================
  // LEVEL 1: EXPLORER (Simple SVO sentences, basic adjectives, capital letter & full stop)
  // ==========================================
  {
    id: 'sent-exp-1',
    difficulty: 'explorer',
    exerciseType: 'picture_builder',
    prompt: 'Build a sentence about the kitten. Watch out for the sneaky extra word!',
    subprompt: 'Look at the picture for clues: 🐱🥛',
    contextPicture: '🐱🥛',
    wordChips: ['The', 'fluffy', 'kitten', 'drank', 'sweet', 'milk.', 'flew'],
    distractorWords: ['flew'],
    correctOrder: ['The', 'fluffy', 'kitten', 'drank', 'sweet', 'milk.'],
    alternativeOrders: [
      ['The', 'kitten', 'drank', 'sweet', 'fluffy', 'milk.'],
    ],
    hints: [
      'Look for the word starting with a capital letter "T" to begin the sentence!',
      'Kittens lap milk, but birds fly! The action word you need is "drank", and "flew" is a distractor.',
      'The sentence begins with: "The fluffy..."',
    ],
    explanation: 'Every sentence starts with a capital letter and ends with a full stop! "The fluffy kitten drank sweet milk." makes perfect sense.',
    rewardStars: 1,
  },
  {
    id: 'sent-exp-2',
    difficulty: 'explorer',
    exerciseType: 'punctuation_fixer',
    prompt: 'Arrange the word cards and end with the correct punctuation mark:',
    subprompt: 'Context: 🦉🌙',
    contextPicture: '🦉🌙',
    wordChips: ['Barnaby', 'Owl', 'hooted', 'in', 'the', 'night', '.', 'swimming'],
    distractorWords: ['swimming'],
    correctOrder: ['Barnaby', 'Owl', 'hooted', 'in', 'the', 'night', '.'],
    alternativeOrders: [
      ['In', 'the', 'night', 'Barnaby', 'Owl', 'hooted', '.'],
    ],
    hints: [
      'Start with the owl\'s capitalised proper name: "Barnaby"!',
      'Owls make hooting sounds at night; they do not go swimming! Put the full stop "." at the very end.',
      'The sentence begins with: "Barnaby Owl..."',
    ],
    explanation: 'Proper nouns like "Barnaby Owl" always start with capital letters, and a statement ends with a full stop "."!',
    rewardStars: 1,
  },
  {
    id: 'sent-exp-3',
    difficulty: 'explorer',
    exerciseType: 'conjunction_connector',
    prompt: 'Join these two ideas using the conjunction "and":',
    subprompt: 'Context: 🐿️🌰',
    contextPicture: '🐿️🌰',
    wordChips: ['Pip', 'found', 'an', 'acorn', 'and', 'hid', 'it', 'safely.', 'barking'],
    distractorWords: ['barking'],
    correctOrder: ['Pip', 'found', 'an', 'acorn', 'and', 'hid', 'it', 'safely.'],
    hints: [
      'Start with the cheeky squirrel\'s name: "Pip"!',
      'Use the connecting word "and" to join what Pip found with what Pip did next.',
      'The sentence begins with: "Pip found..."',
    ],
    explanation: 'We use the coordinating conjunction "and" to connect two related actions into one smooth sentence!',
    rewardStars: 1,
  },
  {
    id: 'sent-exp-4',
    difficulty: 'explorer',
    exerciseType: 'sentence_expansion',
    prompt: 'Build a sentence with colour and size describing the garden robin:',
    subprompt: 'Context: 🐦❄️',
    contextPicture: '🐦❄️',
    wordChips: ['A', 'tiny', 'red', 'robin', 'hopped', 'on', 'the', 'cold', 'snow.', 'swam'],
    distractorWords: ['swam'],
    correctOrder: ['A', 'tiny', 'red', 'robin', 'hopped', 'on', 'the', 'cold', 'snow.'],
    alternativeOrders: [
      ['A', 'red', 'tiny', 'robin', 'hopped', 'on', 'the', 'cold', 'snow.'],
    ],
    hints: [
      'Start with the capital letter "A"!',
      'Use descriptive adjectives ("tiny", "red", "cold") to paint a clear picture. Robins hop, they do not swim!',
      'The sentence begins with: "A tiny..."',
    ],
    explanation: 'Adjectives like "tiny", "red", and "cold" describe nouns and make your writing lively and interesting!',
    rewardStars: 1,
  },
  {
    id: 'sent-exp-5',
    difficulty: 'explorer',
    exerciseType: 'question_vs_statement',
    prompt: 'Arrange the word cards to ask a question with an asking mark (?):',
    subprompt: 'Notice that someone is asking for an apple! 🍎',
    contextPicture: '🍎❓',
    wordChips: ['Can', 'I', 'please', 'have', 'a', 'crisp', 'apple', '?', '.'],
    distractorWords: ['.'],
    correctOrder: ['Can', 'I', 'please', 'have', 'a', 'crisp', 'apple', '?'],
    hints: [
      'Questions often start with an asking word like "Can"!',
      'Because this sentence is asking a polite question, choose the question mark "?" instead of the full stop "."!',
      'The sentence begins with: "Can I..."',
    ],
    explanation: 'Sentences that ask for something begin with a capital letter and end with a Question mark (?)!',
    rewardStars: 1,
  },
  {
    id: 'sent-exp-6',
    difficulty: 'explorer',
    exerciseType: 'picture_builder',
    prompt: 'Build a sentence describing Smaya baking in the kitchen:',
    subprompt: 'Context: 🧁👩‍🍳',
    contextPicture: '🧁👩‍🍳',
    wordChips: ['Smaya', 'baked', 'six', 'delicious', 'cupcakes.', 'flew', 'sleeping'],
    distractorWords: ['flew', 'sleeping'],
    correctOrder: ['Smaya', 'baked', 'six', 'delicious', 'cupcakes.'],
    hints: [
      'Start with the baker\'s name: "Smaya"!',
      'Look for the past tense action word "baked", and leave out "flew" and "sleeping".',
      'The sentence begins with: "Smaya baked..."',
    ],
    explanation: '"Smaya baked six delicious cupcakes." tells who did the action, what they did, and what was made!',
    rewardStars: 1,
  },
  {
    id: 'sent-exp-7',
    difficulty: 'explorer',
    exerciseType: 'punctuation_fixer',
    prompt: 'Arrange the cards to build an exciting sentence ending with an exclamation mark (!):',
    subprompt: 'Context: 🌈✨',
    contextPicture: '🌈✨',
    wordChips: ['Look', 'at', 'that', 'beautiful', 'bright', 'rainbow', '!', '.'],
    distractorWords: ['.'],
    correctOrder: ['Look', 'at', 'that', 'beautiful', 'bright', 'rainbow', '!'],
    hints: [
      'Start with the imperative command word "Look"!',
      'When you see something amazing and surprising, end with an exclamation mark "!" to show delight!',
      'The sentence begins with: "Look at..."',
    ],
    explanation: 'Exclamation marks (!) are used to show strong excitement, wonder, joy, or surprise!',
    rewardStars: 1,
  },
  {
    id: 'sent-exp-8',
    difficulty: 'explorer',
    exerciseType: 'conjunction_connector',
    prompt: 'Connect the two ideas using "so" to show the result:',
    subprompt: 'Context: 🌧️🥾',
    contextPicture: '🌧️🥾',
    wordChips: ['It', 'was', 'raining,', 'so', 'Smaya', 'wore', 'boots.', 'flying'],
    distractorWords: ['flying'],
    correctOrder: ['It', 'was', 'raining,', 'so', 'Smaya', 'wore', 'boots.'],
    hints: [
      'Start with the weather starter: "It"!',
      'Use "so" to show the result of the rain (putting on boots!).',
      'The sentence begins with: "It was..."',
    ],
    explanation: 'The coordinating conjunction "so" explains the result of the first clause!',
    rewardStars: 1,
  },

  // ==========================================
  // LEVEL 2: ADVENTURER (Subordinating conjunctions because/when/that, expanded noun phrases, adverbs)
  // ==========================================
  {
    id: 'sent-adv-1',
    difficulty: 'adventurer',
    exerciseType: 'picture_builder',
    prompt: 'Build a sentence about the red fox leaping. Leave out the wrong preposition!',
    subprompt: 'Context: 🦊🪵',
    contextPicture: '🦊🪵',
    wordChips: ['The', 'quick', 'red', 'fox', 'leaped', 'over', 'the', 'log.', 'under'],
    distractorWords: ['under'],
    correctOrder: ['The', 'quick', 'red', 'fox', 'leaped', 'over', 'the', 'log.'],
    alternativeOrders: [
      ['The', 'red', 'quick', 'fox', 'leaped', 'over', 'the', 'log.'],
    ],
    hints: [
      'Start with the capitalised determiner "The"!',
      'Look at the picture: The fox is leaping in the air ABOVE the log, so use "over" and discard "under"!',
      'The sentence begins with: "The quick..."',
    ],
    explanation: 'Prepositions like "over" tell us where an action took place. "The quick red fox leaped over the log."',
    rewardStars: 2,
  },
  {
    id: 'sent-adv-2',
    difficulty: 'adventurer',
    exerciseType: 'conjunction_connector',
    prompt: 'Join these two clauses using "because" to explain why:',
    subprompt: 'Context: 🦔☕',
    contextPicture: '🦔☕',
    wordChips: ['Hazel', 'smiled', 'because', 'the', 'tea', 'was', 'warm.', 'or', 'flew'],
    distractorWords: ['or', 'flew'],
    correctOrder: ['Hazel', 'smiled', 'because', 'the', 'tea', 'was', 'warm.'],
    hints: [
      'Start with the hedgehog\'s name: "Hazel"!',
      'Use the subordinating conjunction "because" to give the reason why she smiled.',
      'The sentence begins with: "Hazel smiled..."',
    ],
    explanation: 'In Year 2, we use "because" to explain reasons and join subordinate clauses!',
    rewardStars: 2,
  },
  {
    id: 'sent-adv-3',
    difficulty: 'adventurer',
    exerciseType: 'conjunction_connector',
    prompt: 'Use the conjunction "but" to show a contrast between two ideas:',
    subprompt: 'Context: 🌳🐿️',
    contextPicture: '🌳🐿️',
    wordChips: ['Pip', 'wanted', 'to', 'climb', 'but', 'the', 'branch', 'was', 'wet.', 'singing'],
    distractorWords: ['singing'],
    correctOrder: ['Pip', 'wanted', 'to', 'climb', 'but', 'the', 'branch', 'was', 'wet.'],
    hints: [
      'Start with the proper noun: "Pip"!',
      'The conjunction "but" shows there was an obstacle or surprise (the wet branch!).',
      'The sentence begins with: "Pip wanted..."',
    ],
    explanation: '"But" connects two contrasting ideas where the second part introduces a surprise or obstacle.',
    rewardStars: 2,
  },
  {
    id: 'sent-adv-4',
    difficulty: 'adventurer',
    exerciseType: 'sentence_expansion',
    prompt: 'Arrange the cards to build a rich sentence starting with a time adverb (fronted adverbial):',
    subprompt: 'Context: 🐶🌿',
    contextPicture: '🐶🌿',
    wordChips: ['Yesterday,', 'the', 'playful', 'puppy', 'ran', 'quickly', 'across', 'the', 'garden.', 'purred'],
    distractorWords: ['purred'],
    correctOrder: ['Yesterday,', 'the', 'playful', 'puppy', 'ran', 'quickly', 'across', 'the', 'garden.'],
    alternativeOrders: [
      ['The', 'playful', 'puppy', 'ran', 'quickly', 'across', 'the', 'garden', 'yesterday.'],
    ],
    hints: [
      'Start with the time word setting the scene: "Yesterday," (with a capital letter and comma)!',
      'Adverbs like "quickly" describe how the puppy ran. Puppies do not purr!',
      'The sentence begins with: "Yesterday, the..."',
    ],
    explanation: 'Time words like "Yesterday" tell us when an event happened, and "-ly" adverbs like "quickly" describe how!',
    rewardStars: 2,
  },
  {
    id: 'sent-adv-5',
    difficulty: 'adventurer',
    exerciseType: 'punctuation_fixer',
    prompt: 'Arrange the words to ask where Pip hid his treasure, ending with a question mark:',
    subprompt: 'Context: 🗺️🌰',
    contextPicture: '🗺️🌰',
    wordChips: ['Where', 'did', 'Pip', 'hide', 'his', 'golden', 'acorn', '?', '.'],
    distractorWords: ['.'],
    correctOrder: ['Where', 'did', 'Pip', 'hide', 'his', 'golden', 'acorn', '?'],
    hints: [
      'Start with the question word "Where"!',
      'Because this asks for a location, finish with the question mark "?" rather than a full stop.',
      'The sentence begins with: "Where did..."',
    ],
    explanation: 'Questions starting with Who, What, Where, When, Why, or How must conclude with a Question mark (?)!',
    rewardStars: 2,
  },
  {
    id: 'sent-adv-6',
    difficulty: 'adventurer',
    exerciseType: 'question_vs_statement',
    prompt: 'Arrange the word cards into a true statement about nocturnal animals:',
    subprompt: 'Context: 🦉☀️',
    contextPicture: '🦉☀️',
    wordChips: ['Barnaby', 'Owl', 'sleeps', 'during', 'the', 'sunny', 'day.', 'Can', '?'],
    distractorWords: ['Can', '?'],
    correctOrder: ['Barnaby', 'Owl', 'sleeps', 'during', 'the', 'sunny', 'day.'],
    hints: [
      'Start with the owl\'s name: "Barnaby"!',
      'This is a factual statement telling information, not an asking question. Do not use "Can" or "?"!',
      'The sentence begins with: "Barnaby Owl..."',
    ],
    explanation: 'Statements deliver information and end with a full stop, unlike asking questions which end with question marks.',
    rewardStars: 2,
  },
  {
    id: 'sent-adv-7',
    difficulty: 'adventurer',
    exerciseType: 'picture_builder',
    prompt: 'Build a sentence about Oliver Bear searching for his missing red boot:',
    subprompt: 'Context: 🐻🥾',
    contextPicture: '🐻🥾',
    wordChips: ['Oliver', 'searched', 'under', 'the', 'wooden', 'garden', 'shed.', 'swimming', 'clouds'],
    distractorWords: ['swimming', 'clouds'],
    correctOrder: ['Oliver', 'searched', 'under', 'the', 'wooden', 'garden', 'shed.'],
    hints: [
      'Start with Oliver\'s capitalised name: "Oliver"!',
      'Look for the action verb "searched" and preposition "under". Ignore "swimming" and "clouds"!',
      'The sentence begins with: "Oliver searched..."',
    ],
    explanation: '"Oliver searched under the wooden garden shed." tells who performed the action and exactly where they looked.',
    rewardStars: 2,
  },
  {
    id: 'sent-adv-8',
    difficulty: 'adventurer',
    exerciseType: 'conjunction_connector',
    prompt: 'Join these two thoughts using "when" to show time:',
    subprompt: 'Context: 🔔🏫',
    contextPicture: '🔔🏫',
    wordChips: ['The', 'children', 'cheered', 'when', 'the', 'school', 'bell', 'rang.', 'flying'],
    distractorWords: ['flying'],
    correctOrder: ['The', 'children', 'cheered', 'when', 'the', 'school', 'bell', 'rang.'],
    hints: [
      'Start with the capital letter "The"!',
      'Use the time conjunction "when" to show at what moment the cheering happened.',
      'The sentence begins with: "The children..."',
    ],
    explanation: 'The subordinating conjunction "when" tells us the exact time or event that triggered an action.',
    rewardStars: 2,
  },

  // ==========================================
  // LEVEL 3: CHAMPION (Complex sentences, fronted adverbials, expanded noun phrases, dialogue / quotation)
  // ==========================================
  {
    id: 'sent-champ-1',
    difficulty: 'champion',
    exerciseType: 'sentence_expansion',
    prompt: 'Arrange the word cards into a majestic sentence. Leave out both distractor words!',
    subprompt: 'Context: 🏰👑',
    contextPicture: '🏰👑',
    wordChips: ['Inside', 'the', 'ancient', 'castle,', 'the', 'queen', 'wore', 'a', 'golden', 'crown.', 'swimming', 'barking'],
    distractorWords: ['swimming', 'barking'],
    correctOrder: ['Inside', 'the', 'ancient', 'castle,', 'the', 'queen', 'wore', 'a', 'golden', 'crown.'],
    alternativeOrders: [
      ['The', 'queen', 'wore', 'a', 'golden', 'crown', 'inside', 'the', 'ancient', 'castle.'],
    ],
    hints: [
      'Start with the setting phrase: "Inside" (capital letter)!',
      'Look for the fronted adverbial "Inside the ancient castle," setting the scene before the main clause.',
      'The sentence begins with: "Inside the..."',
    ],
    explanation: 'Fronted adverbials of place like "Inside the ancient castle," add rich setting detail to your creative writing!',
    rewardStars: 3,
  },
  {
    id: 'sent-champ-2',
    difficulty: 'champion',
    exerciseType: 'question_vs_statement',
    prompt: 'Arrange the word cards into an inquiring question about penguin flight:',
    subprompt: 'Context: 🐧❄️❓',
    contextPicture: '🐧❄️❓',
    wordChips: ['Can', 'penguins', 'fly', 'in', 'the', 'cold', 'sky', '?', '.', 'cannot'],
    distractorWords: ['.', 'cannot'],
    correctOrder: ['Can', 'penguins', 'fly', 'in', 'the', 'cold', 'sky', '?'],
    hints: [
      'Start with the modal asking verb "Can"!',
      'Because it is an inquiry, finish with the question mark "?" and leave out the statement word "cannot".',
      'The sentence begins with: "Can penguins..."',
    ],
    explanation: 'To turn a statement into a question in English, we often move an auxiliary verb like "Can" to the very beginning!',
    rewardStars: 3,
  },
  {
    id: 'sent-champ-3',
    difficulty: 'champion',
    exerciseType: 'punctuation_fixer',
    prompt: 'Build a sentence with an apostrophe for possession showing the puppy\'s collar:',
    subprompt: 'Context: 🐕✨',
    contextPicture: '🐕✨',
    wordChips: ['Toby\'s', 'shiny', 'silver', 'collar', 'jingled', 'cheerfully', 'in', 'the', 'park.', 'dogs', 'swimming'],
    distractorWords: ['dogs', 'swimming'],
    correctOrder: ['Toby\'s', 'shiny', 'silver', 'collar', 'jingled', 'cheerfully', 'in', 'the', 'park.'],
    hints: [
      'Start with the puppy\'s possessive name: "Toby\'s"!',
      'The apostrophe before the "s" shows that the collar belongs to Toby.',
      'The sentence begins with: "Toby\'s shiny..."',
    ],
    explanation: 'Possessive apostrophes (Toby\'s collar) show ownership of an object!',
    rewardStars: 3,
  },
  {
    id: 'sent-champ-4',
    difficulty: 'champion',
    exerciseType: 'conjunction_connector',
    prompt: 'Connect the two clauses using "or" to show a choice between two actions:',
    subprompt: 'Context: 🎨📖',
    contextPicture: '🎨📖',
    wordChips: ['We', 'can', 'paint', 'a', 'picture', 'or', 'we', 'can', 'read', 'a', 'story.', 'barking'],
    distractorWords: ['barking'],
    correctOrder: ['We', 'can', 'paint', 'a', 'picture', 'or', 'we', 'can', 'read', 'a', 'story.'],
    hints: [
      'Start with the pronoun "We"!',
      'Use the conjunction "or" to connect the two alternative fun choices.',
      'The sentence begins with: "We can..."',
    ],
    explanation: 'The coordinating conjunction "or" presents an alternative choice between two possibilities!',
    rewardStars: 3,
  },
  {
    id: 'sent-champ-5',
    difficulty: 'champion',
    exerciseType: 'sentence_expansion',
    prompt: 'Build a rich sentence using a manner adverb and descriptive colours:',
    subprompt: 'Context: 🦊🔭✨',
    contextPicture: '🦊🔭✨',
    wordChips: ['Finley', 'gazed', 'peacefully', 'at', 'the', 'glittering', 'silver', 'stars.', 'swam', 'purred'],
    distractorWords: ['swam', 'purred'],
    correctOrder: ['Finley', 'gazed', 'peacefully', 'at', 'the', 'glittering', 'silver', 'stars.'],
    hints: [
      'Start with Finley\'s name: "Finley"!',
      'The adverb "peacefully" tells how Finley gazed, and "glittering silver" describes the stars.',
      'The sentence begins with: "Finley gazed..."',
    ],
    explanation: 'Expanded noun phrases like "glittering silver stars" and adverbs like "peacefully" create vivid imagery.',
    rewardStars: 3,
  },
  {
    id: 'sent-champ-6',
    difficulty: 'champion',
    exerciseType: 'punctuation_fixer',
    prompt: 'Arrange the cards to build an urgent, excited exclamation:',
    subprompt: 'Context: 🌟🚀',
    contextPicture: '🌟🚀',
    wordChips: ['Watch', 'out', 'for', 'the', 'blazing', 'shooting', 'star', '!', '.'],
    distractorWords: ['.'],
    correctOrder: ['Watch', 'out', 'for', 'the', 'blazing', 'shooting', 'star', '!'],
    hints: [
      'Start with the capitalised action command: "Watch"!',
      'End with an exclamation mark "!" to convey high urgency and excitement.',
      'The sentence begins with: "Watch out..."',
    ],
    explanation: 'Imperative sentences with strong emotional urgency end with an Exclamation mark (!)!',
    rewardStars: 3,
  },
  {
    id: 'sent-champ-7',
    difficulty: 'champion',
    exerciseType: 'conjunction_connector',
    prompt: 'Join these two clauses using "that" to add specific information:',
    subprompt: 'Context: 🚪🔑',
    contextPicture: '🚪🔑',
    wordChips: ['Smaya', 'found', 'a', 'secret', 'key', 'that', 'unlocked', 'the', 'fairy', 'door.', 'barking'],
    distractorWords: ['barking'],
    correctOrder: ['Smaya', 'found', 'a', 'secret', 'key', 'that', 'unlocked', 'the', 'fairy', 'door.'],
    hints: [
      'Start with the adventurer\'s name: "Smaya"!',
      'Use the relative pronoun/conjunction "that" to describe what the secret key was able to do.',
      'The sentence begins with: "Smaya found..."',
    ],
    explanation: 'Using "that" introduces a relative clause giving essential information about the noun (the key)!',
    rewardStars: 3,
  },
  {
    id: 'sent-champ-8',
    difficulty: 'champion',
    exerciseType: 'picture_builder',
    prompt: 'Build a sentence about Hazel Hedgehog\'s wonderful gift at the woodland party:',
    subprompt: 'Context: 🦔🍐🍯',
    contextPicture: '🦔🍐🍯',
    wordChips: ['Hazel', 'brought', 'sweet', 'golden', 'pears', 'that', 'smelled', 'of', 'honey.', 'swimming'],
    distractorWords: ['swimming'],
    correctOrder: ['Hazel', 'brought', 'sweet', 'golden', 'pears', 'that', 'smelled', 'of', 'honey.'],
    hints: [
      'Start with Hazel\'s capitalised name: "Hazel"!',
      'Look for the past tense verb "brought" and the sensory description "smelled of honey".',
      'The sentence begins with: "Hazel brought..."',
    ],
    explanation: 'Year 2 writers use sensory details (sight, smell, taste) to make stories captivating and rich!',
    rewardStars: 3,
  },
];

/**
 * Converts a SentenceExercise into a Question object compatible with WordActivity and DailyChallenge.
 */
export function sentenceExerciseToQuestion(exercise: SentenceExercise): Question {
  // Combine wordChips and distractorWords, ensuring all distractor words are included in options
  const allWords = [...exercise.wordChips];
  if (exercise.distractorWords) {
    for (const d of exercise.distractorWords) {
      if (!allWords.includes(d)) {
        allWords.push(d);
      }
    }
  }

  // Shuffle options so chips do not appear in the solved order!
  const shuffledOptions = [...allWords].sort(() => Math.random() - 0.5);

  return {
    id: exercise.id,
    category: 'words',
    subcategory: 'Sentence Building',
    difficulty: exercise.difficulty,
    type: 'sentence_builder',
    prompt: exercise.prompt,
    subprompt: exercise.subprompt,
    contextPicture: exercise.contextPicture,
    options: shuffledOptions,
    distractorWords: exercise.distractorWords,
    correctAnswer: exercise.correctOrder,
    alternativeAnswers: exercise.alternativeOrders,
    hint: exercise.hints[0],
    hints: exercise.hints,
    explanation: exercise.explanation,
    rewardStars: exercise.rewardStars,
  };
}

/**
 * Returns all sentence building questions, optionally filtered by difficulty.
 */
export function getSentenceBuildingQuestions(difficulty?: Difficulty): Question[] {
  const list = difficulty
    ? CURATED_SENTENCE_EXERCISES.filter((e) => e.difficulty === difficulty)
    : CURATED_SENTENCE_EXERCISES;
  return list.map(sentenceExerciseToQuestion);
}
