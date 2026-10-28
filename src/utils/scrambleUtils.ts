/**
 * Utility functions and curated data for Word Scramble in Smaya's Brain Quest.
 * Tailored for Year 2 (Age 6-7) UK Key Stage 1 National Curriculum.
 * Features non-trivial shuffling, 3-level graduated hints, and duplicate letter support.
 */

import { Question, Difficulty } from '../types';

export interface ScrambleTile {
  id: string; // Unique ID so duplicate letters (e.g. two 'E's) are tracked distinctly
  letter: string;
}

/**
 * Shuffles letters of a word guaranteeing it does not match the original word.
 * Also ensures that for words with 3+ letters, the first letter is not the original first letter if possible.
 */
export function shuffleWordLetters(word: string): string[] {
  const letters = word.toUpperCase().split('');
  if (letters.length <= 1) return letters;

  const originalStr = letters.join('');
  let shuffled = [...letters];
  let attempts = 0;

  do {
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;
  } while (
    (shuffled.join('') === originalStr ||
      (letters.length >= 3 && shuffled[0] === letters[0] && new Set(letters).size > 1)) &&
    attempts < 40
  );

  // If still matching after attempts (e.g. word with many identical letters), force reverse or circular shift
  if (shuffled.join('') === originalStr) {
    shuffled.reverse();
    if (shuffled.join('') === originalStr && shuffled.length > 2) {
      const first = shuffled.shift()!;
      shuffled.push(first);
    }
  }

  return shuffled;
}

/**
 * Creates distinct ScrambleTile objects from an array of letters.
 */
export function createScrambleTiles(letters: string[]): ScrambleTile[] {
  return letters.map((letter, index) => ({
    id: `tile-${letter}-${index}-${Math.random().toString(36).substring(2, 7)}`,
    letter,
  }));
}

export interface CuratedScrambleData {
  id: string;
  word: string;
  difficulty: Difficulty;
  meaningClue: string;
  factClue: string;
  explanation: string;
  rewardStars: number;
}

export const CURATED_SCRAMBLE_WORDS: CuratedScrambleData[] = [
  // ==========================================
  // LEVEL 1: EXPLORER (4-5 letter words)
  // Common Exception Words, simple digraphs, split digraphs
  // ==========================================
  {
    id: 'scramble-exp-1',
    word: 'WATER',
    difficulty: 'explorer',
    meaningClue: 'A clear liquid that falls as gentle rain and fills rivers and ponds.',
    factClue: 'A Year 2 common exception word that sounds like "w-o", but begins with "w-a"!',
    explanation: 'WATER (W-A-T-E-R): Drink plenty of fresh water every day to keep your brain hydrated!',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-2',
    word: 'SHINE',
    difficulty: 'explorer',
    meaningClue: 'To give off bright, warm light like the morning sun or a golden star.',
    factClue: 'Uses the split digraph "i-e" to make the long "eye" sound.',
    explanation: 'SHINE (S-H-I-N-E): Stars shine brightly in the clear night sky!',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-3',
    word: 'FROST',
    difficulty: 'explorer',
    meaningClue: 'A sparkling white crust of ice that blankets the grass on chilly mornings.',
    factClue: 'Begins with the blend "fr-" and ends with "st".',
    explanation: 'FROST (F-R-O-S-T): Jack Frost paints glittering ice patterns on winter windows!',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-4',
    word: 'SMILE',
    difficulty: 'explorer',
    meaningClue: 'A happy, cheerful face expression where the corners of your mouth turn up.',
    factClue: 'Features the "i-e" split digraph, rhyming with crocodile and file.',
    explanation: 'SMILE (S-M-I-L-E): Smaya wore a beaming smile when she earned her star badge!',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-5',
    word: 'BRAVE',
    difficulty: 'explorer',
    meaningClue: 'Ready to face tricky challenges or scary things without giving up.',
    factClue: 'An adjective with the split digraph "a-e", opposite of timid.',
    explanation: 'BRAVE (B-R-A-V-E): Knights and woodland explorers are exceptionally brave!',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-6',
    word: 'SWEET',
    difficulty: 'explorer',
    meaningClue: 'Having a delicious sugary taste like ripe strawberries, honey, or cupcakes.',
    factClue: 'Notice the double vowel "ee" in the middle!',
    explanation: 'SWEET (S-W-E-E-T): Oliver Bear loved spreading sweet blackberry jam on his toast!',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-7',
    word: 'CLOUD',
    difficulty: 'explorer',
    meaningClue: 'A fluffy white or grey shape floating high in the sky made of tiny water drops.',
    factClue: 'Uses the "ou" vowel digraph, just like in "proud" and "sound".',
    explanation: 'CLOUD (C-L-O-U-D): Fluffy white clouds drifted slowly across the blue sky.',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-8',
    word: 'PLANT',
    difficulty: 'explorer',
    meaningClue: 'A living green thing with roots, a stem, and leaves growing in garden soil.',
    factClue: 'A Year 2 common exception word that rhymes with "ant" and "grant".',
    explanation: 'PLANT (P-L-A-N-T): Smaya watered her sunflower plant until it grew tall!',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-9',
    word: 'MAGIC',
    difficulty: 'explorer',
    meaningClue: 'A special, wondrous power used by friendly wizards and fairy-tale folk.',
    factClue: 'Ends in the letter "c" making the "k" sound (M-A-G-I-C).',
    explanation: 'MAGIC (M-A-G-I-C): The woodland fairy waved her wand to sprinkle glittering magic!',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-10',
    word: 'TRAIN',
    difficulty: 'explorer',
    meaningClue: 'A series of railway carriages pulled along iron tracks by an engine.',
    factClue: 'Uses the "ai" vowel digraph in the middle, just like "rain" and "pain".',
    explanation: 'TRAIN (T-R-A-I-N): The steam train blew its cheerful whistle at the station platform!',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-11',
    word: 'STONE',
    difficulty: 'explorer',
    meaningClue: 'A small, smooth piece of hard rock found along paths or near rivers.',
    factClue: 'Uses the split digraph "o-e" to make the long "oh" sound.',
    explanation: 'STONE (S-T-O-N-E): Pip found a smooth grey stone shaped like a heart.',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-12',
    word: 'GRASS',
    difficulty: 'explorer',
    meaningClue: 'The green vegetation with narrow blades that covers lawns and meadows.',
    factClue: 'A Year 2 common exception word ending with a double "ss"!',
    explanation: 'GRASS (G-R-A-S-S): Dewdrops glittered on the fresh green grass at sunrise.',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-13',
    word: 'HAPPY',
    difficulty: 'explorer',
    meaningClue: 'Feeling joyful, cheerful, and full of giggles and contentment.',
    factClue: 'Spelled with double "p" and ends in "y" making the "ee" sound.',
    explanation: 'HAPPY (H-A-P-P-Y): The baby rabbit was so happy hopping through the clover!',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-14',
    word: 'CLOCK',
    difficulty: 'explorer',
    meaningClue: 'An instrument with two hands and numbers used for telling the time.',
    factClue: 'Ends with the digraph "-ck" following the short vowel "o".',
    explanation: 'CLOCK (C-L-O-C-K): The school clock ticked quietly as the morning began.',
    rewardStars: 1,
  },
  {
    id: 'scramble-exp-15',
    word: 'GREEN',
    difficulty: 'explorer',
    meaningClue: 'The fresh colour of spring leaves, mossy tree trunks, and emeralds.',
    factClue: 'Contains the "ee" double vowel making the long "ee" sound.',
    explanation: 'GREEN (G-R-E-E-N): Hazel wore a cosy green velvet coat to explore the woods.',
    rewardStars: 1,
  },

  // ==========================================
  // LEVEL 2: ADVENTURER (5-6 letter words)
  // Silent letters, suffixes, common exception words
  // ==========================================
  {
    id: 'scramble-adv-1',
    word: 'FRIEND',
    difficulty: 'adventurer',
    meaningClue: 'A person you cherish, play happily with, and trust through thick and thin.',
    factClue: 'Spelling secret: A friend stays with you until the "end" (F-R-I-E-N-D)!',
    explanation: 'FRIEND (F-R-I-E-N-D): Pip the Squirrel is Hazel Hedgehog\'s loyal woodland friend.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-2',
    word: 'CASTLE',
    difficulty: 'adventurer',
    meaningClue: 'A grand stone fortress with high battlements, tall towers, and a moat.',
    factClue: 'Contains a silent letter "t" inside (C-A-S-T-L-E).',
    explanation: 'CASTLE (C-A-S-T-L-E): Windsor Castle is one of the royal homes in England!',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-3',
    word: 'BRIDGE',
    difficulty: 'adventurer',
    meaningClue: 'A pathway built over a river or valley so people can cross safely.',
    factClue: 'Ends in "-dge" to create the soft "j" sound right after a short vowel.',
    explanation: 'BRIDGE (B-R-I-D-G-E): Tower Bridge crosses high over the River Thames in London!',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-4',
    word: 'GARDEN',
    difficulty: 'adventurer',
    meaningClue: 'A plot of outdoor land where fragrant flowers, vegetables, and fruit grow.',
    factClue: 'Begins with the "ar" phonics digraph, as in "star" and "bark".',
    explanation: 'GARDEN (G-A-R-D-E-N): Honeybees buzz from blossom to blossom in the sunny garden.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-5',
    word: 'WINTER',
    difficulty: 'adventurer',
    meaningClue: 'The coldest season of the year, following autumn and bringing frost.',
    factClue: 'A two-syllable word (win-ter) ending in the suffix sound "-er".',
    explanation: 'WINTER (W-I-N-T-E-R): In winter, robins visit the bird table to feed in the snow.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-6',
    word: 'FLOWER',
    difficulty: 'adventurer',
    meaningClue: 'The colourful blossom of a plant with delicate petals and fragrant nectar.',
    factClue: 'Uses the "ow" vowel sound as in "shower" and "power".',
    explanation: 'FLOWER (F-L-O-W-E-R): Hazel smelled a bright yellow daffodil flower in the meadow.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-7',
    word: 'POCKET',
    difficulty: 'adventurer',
    meaningClue: 'A small fabric pouch sewn into a coat or trousers to hold small items.',
    factClue: 'Ends in the spelling "-et", rhyming with rocket, locket, and socket.',
    explanation: 'POCKET (P-O-C-K-E-T): Pip kept three shiny brown acorns tucked safely inside his pocket!',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-8',
    word: 'FOREST',
    difficulty: 'adventurer',
    meaningClue: 'A vast expanse of woodland thickly covered with tall trees and wildlife.',
    factClue: 'A noun beginning with "for-" and ending with "-est".',
    explanation: 'FOREST (F-O-R-E-S-T): Barnaby Owl lives high in the ancient Whispering Forest canopy.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-9',
    word: 'SILVER',
    difficulty: 'adventurer',
    meaningClue: 'A precious, shiny grey-white metal used to make coins, bells, and jewellery.',
    factClue: 'Two syllables (sil-ver) ending with the "-er" pattern.',
    explanation: 'SILVER (S-I-L-V-E-R): The moon cast a gentle silver glow over the sleepy meadow.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-10',
    word: 'MONKEY',
    difficulty: 'adventurer',
    meaningClue: 'A clever, agile mammal with hands and a long tail that loves swinging in trees.',
    factClue: 'A Year 2 exception word ending in "-ey" making the long "ee" sound!',
    explanation: 'MONKEY (M-O-N-K-E-Y): The cheeky monkey swung playfully from vine to vine.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-11',
    word: 'RABBIT',
    difficulty: 'adventurer',
    meaningClue: 'A gentle furry creature with long ears that hops quickly and nibbles carrots.',
    factClue: 'Spelled with a double "bb" in the middle (R-A-B-B-I-T).',
    explanation: 'RABBIT (R-A-B-B-I-T): The fluffy white rabbit twitched its pink nose curioiusly.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-12',
    word: 'BASKET',
    difficulty: 'adventurer',
    meaningClue: 'A woven container with a handle used for carrying berries, picnics, or flowers.',
    factClue: 'Contains two syllables (bas-ket) ending with the "-et" sound.',
    explanation: 'BASKET (B-A-S-K-E-T): Hazel collected sweet ripe blackberries in her wicker basket.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-13',
    word: 'BUTTON',
    difficulty: 'adventurer',
    meaningClue: 'A small round disc sewn onto a shirt or cardigan to fasten it closed.',
    factClue: 'Features a double "tt" in the middle (B-U-T-T-O-N).',
    explanation: 'BUTTON (B-U-T-T-O-N): Smaya fastened the top shiny red button on her winter cardigan.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-14',
    word: 'CANDLE',
    difficulty: 'adventurer',
    meaningClue: 'A stick of wax with a wick that burns to produce a warm flickering flame.',
    factClue: 'Ends in the "-le" pattern typical of Year 2 words like "table" and "apple".',
    explanation: 'CANDLE (C-A-N-D-L-E): A cosy beeswax candle glowed brightly in the lantern.',
    rewardStars: 2,
  },
  {
    id: 'scramble-adv-15',
    word: 'KITTEN',
    difficulty: 'adventurer',
    meaningClue: 'A playful baby cat that purrs softly and loves chasing balls of yarn.',
    factClue: 'Begins with the letter "k" and has a double "tt" in the middle.',
    explanation: 'KITTEN (K-I-T-T-E-N): The ginger kitten curled up warmly by the fireside.',
    rewardStars: 2,
  },

  // ==========================================
  // LEVEL 3: CHAMPION (6-8 letter words)
  // Advanced phonics patterns, complex KS1 vocabulary
  // ==========================================
  {
    id: 'scramble-champ-1',
    word: 'BEAUTY',
    difficulty: 'champion',
    meaningClue: 'A wondrous quality that pleases the senses and fills the heart with delight.',
    factClue: 'Features the unusual "eau" vowel combination making the "yoo" sound.',
    explanation: 'BEAUTY (B-E-A-U-T-Y): In Year 2 we also learn the adjective "beautiful"!',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-2',
    word: 'BECAUSE',
    difficulty: 'champion',
    meaningClue: 'An important connecting word (conjunction) we use to explain a reason why.',
    factClue: 'Mnemonic: Big Elephants Can Always Upset Small Elephants (B-E-C-A-U-S-E)!',
    explanation: 'BECAUSE (B-E-C-A-U-S-E): Smaya wore wellingtons because it was raining outside.',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-3',
    word: 'DOLPHIN',
    difficulty: 'champion',
    meaningClue: 'A graceful, intelligent sea mammal that leaps playfully over ocean waves.',
    factClue: 'Uses the "ph" digraph to make the "f" sound, as in "phonics" and "elephant".',
    explanation: 'DOLPHIN (D-O-L-P-H-I-N): Bottlenose dolphins swim happily along the British coastline!',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-4',
    word: 'WHISPER',
    difficulty: 'champion',
    meaningClue: 'To speak with your quietest breath so only someone very close can hear.',
    factClue: 'Begins with the digraph "wh-", opposite of shouting or bellowing.',
    explanation: 'WHISPER (W-H-I-S-P-E-R): Smaya leaned in to whisper the secret riddle answer to Pip!',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-5',
    word: 'JOURNEY',
    difficulty: 'champion',
    meaningClue: 'An act of travelling from one place to another, especially on an exciting quest.',
    factClue: 'Ends in the spelling "-ey" making the long "ee" sound, like "donkey".',
    explanation: 'JOURNEY (J-O-U-R-N-E-Y): The woodland friends set off on an epic treasure quest journey!',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-6',
    word: 'FEATHER',
    difficulty: 'champion',
    meaningClue: 'One of the light, soft growths that covers a bird\'s wings and helps it soar.',
    factClue: 'Contains "ea" making the short "e" sound, just like "weather" and "bread".',
    explanation: 'FEATHER (F-E-A-T-H-E-R): Barnaby Owl tucked a soft grey feather into his favourite book.',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-7',
    word: 'BLANKET',
    difficulty: 'champion',
    meaningClue: 'A large, warm cover made of wool or fleece tucked snugly over a bed.',
    factClue: 'Begins with the blend "bl-" and ends in the suffix sound "-et".',
    explanation: 'BLANKET (B-L-A-N-K-E-T): Hazel nestled under a cosy patchwork blanket to snooze.',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-8',
    word: 'TREASURE',
    difficulty: 'champion',
    meaningClue: 'A precious collection of gold coins, sparkling jewels, or special prizes.',
    factClue: 'Ends with the "-ure" spelling pattern, as in "measure" and "pleasure".',
    explanation: 'TREASURE (T-R-E-A-S-U-R-E): Follow the ancient map clues to uncover the secret treasure!',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-9',
    word: 'MORNING',
    difficulty: 'champion',
    meaningClue: 'The early part of the day from sunrise until the clock strikes noon.',
    factClue: 'Contains the "or" digraph and ends with the suffix sound "-ing".',
    explanation: 'MORNING (M-O-R-N-I-N-G): Birds sing their sweetest songs in the fresh morning air.',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-10',
    word: 'SQUIRREL',
    difficulty: 'champion',
    meaningClue: 'A nimble woodland animal with a bushy tail that scurries up trees collecting nuts.',
    factClue: 'Spelled with "qu", a double "rr", and ends in "-el" (S-Q-U-I-R-R-E-L).',
    explanation: 'SQUIRREL (S-Q-U-I-R-R-E-L): Pip the cheeky squirrel hid his golden acorn in an oak tree!',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-11',
    word: 'RAINBOW',
    difficulty: 'champion',
    meaningClue: 'An arch of seven vibrant colours that spans the sky when sunlight hits rain.',
    factClue: 'A compound word made from two words: "rain" + "bow"!',
    explanation: 'RAINBOW (R-A-I-N-B-O-W): Violet, indigo, blue, green, yellow, orange, and red make a rainbow!',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-12',
    word: 'PENGUIN',
    difficulty: 'champion',
    meaningClue: 'A flightless seabird with a white belly and black coat that waddles on ice and swims fast.',
    factClue: 'Contains the "ui" digraph and ends with the consonant blend "-in".',
    explanation: 'PENGUIN (P-E-N-G-U-I-N): Penguins dive deep into icy waters to catch tasty fish!',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-13',
    word: 'SPARKLE',
    difficulty: 'champion',
    meaningClue: 'To shine brightly with flashes of light, like diamonds or frost crystals.',
    factClue: 'Contains the "ar" digraph and ends in the "-le" spelling pattern.',
    explanation: 'SPARKLE (S-P-A-R-K-L-E): Dewdrops sparkle like little diamonds on the spiderweb.',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-14',
    word: 'BLOSSOM',
    difficulty: 'champion',
    meaningClue: 'The fragrant mass of pink or white flowers that covers fruit trees in springtime.',
    factClue: 'Contains a double "ss" in the middle, rhyming with awesome.',
    explanation: 'BLOSSOM (B-L-O-S-S-O-M): Apple blossom fluttered like pink snowflakes in the breeze.',
    rewardStars: 3,
  },
  {
    id: 'scramble-champ-15',
    word: 'EXPLORER',
    difficulty: 'champion',
    meaningClue: 'A brave person who journeys into unknown lands to make exciting discoveries.',
    factClue: 'Contains the letter "x" and ends with the agent suffix "-er".',
    explanation: 'EXPLORER (E-X-P-L-O-R-E-R): Smaya is a fantastic Quest Explorer on Brain Island!',
    rewardStars: 3,
  },
];

/**
 * Converts a CuratedScrambleData entry into a standard Question object.
 * Guarantees proper shuffling, no answer spoilers, and 3-level graduated hints.
 */
export function scrambleDataToQuestion(data: CuratedScrambleData): Question {
  const upperWord = data.word.toUpperCase();
  const shuffledOptions = shuffleWordLetters(upperWord);
  const firstLetter = upperWord[0];
  const remainingDashes = Array.from({ length: upperWord.length - 1 })
    .map(() => '_')
    .join(' ');

  return {
    id: data.id,
    category: 'words',
    subcategory: 'Word Scramble',
    difficulty: data.difficulty,
    type: 'word_unscramble',
    prompt: 'Unscramble the letters to reveal the secret word:',
    subprompt: data.meaningClue,
    options: shuffledOptions,
    correctAnswer: upperWord,
    hint: data.meaningClue,
    hints: [
      `Meaning Clue: ${data.meaningClue}`,
      `Spelling & Fact Clue: ${data.factClue}`,
      `Letter Reveal: The first letter is "${firstLetter}": ${firstLetter} ${remainingDashes}`,
    ],
    explanation: data.explanation,
    rewardStars: data.rewardStars,
  };
}

/**
 * Returns all curated word scramble questions, optionally filtered by difficulty.
 */
export function getWordScrambleQuestions(difficulty?: Difficulty): Question[] {
  const list = difficulty
    ? CURATED_SCRAMBLE_WORDS.filter((w) => w.difficulty === difficulty)
    : CURATED_SCRAMBLE_WORDS;
  return list.map(scrambleDataToQuestion);
}
