import { Question } from '../types';

export const MATHS_QUESTIONS: Question[] = [
  // 1. Addition with visual ladybirds (Level 1)
  {
    id: 'maths-1',
    category: 'maths',
    subcategory: 'Addition',
    difficulty: 'explorer',
    type: 'multiple_choice',
    prompt: 'How many ladybirds are there in total?',
    subprompt: 'Count the two groups of ladybirds and add them together.',
    visuals: [
      { emoji: '🐞', count: 6, label: '6 ladybirds' },
      { emoji: '🐞', count: 4, label: '4 ladybirds' },
    ],
    options: ['9', '10', '11', '12'],
    correctAnswer: '10',
    hint: 'Start with 6 and count on 4 more: 7, 8, 9, 10!',
    explanation: '6 + 4 = 10. These two numbers are number bonds to 10!',
    rewardStars: 1,
  },

  // 2. Addition with number bonds to 20
  {
    id: 'maths-2',
    category: 'maths',
    subcategory: 'Addition',
    difficulty: 'explorer',
    type: 'numeric_input',
    prompt: 'What is 13 + 7?',
    subprompt: 'Use your number bonds to 10 to help you find 20!',
    visuals: [
      { emoji: '⭐', count: 13, label: '13 gold stars' },
      { emoji: '✨', count: 7, label: '7 sparklers' },
    ],
    correctAnswer: 20,
    hint: 'Think: 3 + 7 makes 10, so 13 + 7 makes two tens, which is 20!',
    explanation: '13 + 7 = 20. When we add 7 to 13, 3 + 7 makes 10, giving us 20!',
    rewardStars: 1,
  },

  // 3. Subtraction with visual apples
  {
    id: 'maths-3',
    category: 'maths',
    subcategory: 'Subtraction',
    difficulty: 'explorer',
    type: 'multiple_choice',
    prompt: 'There were 15 juicy apples on the tree. Pip the Squirrel ate 6. How many are left?',
    subprompt: '15 take away 6 = ?',
    visuals: [
      { emoji: '🍎', count: 15, label: '15 apples' },
    ],
    options: ['8', '9', '10', '11'],
    correctAnswer: '9',
    hint: 'Take away 5 first to get to 10, then take away 1 more!',
    explanation: '15 - 6 = 9. First 15 - 5 = 10, then 10 - 1 = 9!',
    rewardStars: 1,
  },

  // 4. Missing Number Puzzle
  {
    id: 'maths-4',
    category: 'maths',
    subcategory: 'Missing Number',
    difficulty: 'explorer',
    type: 'numeric_input',
    prompt: 'Find the missing number: 8 + [ ? ] = 14',
    subprompt: 'What number do you need to add to 8 to reach 14?',
    visuals: [
      { emoji: '🌰', count: 8, label: '8 acorns' },
    ],
    correctAnswer: 6,
    hint: 'Count on from 8 until you reach 14: 9, 10, 11, 12, 13, 14 (that is 6 fingers)!',
    explanation: '8 + 6 = 14. You can also work it out by doing 14 - 8 = 6!',
    rewardStars: 1,
  },

  // 5. 2 Times Table Multiplication
  {
    id: 'maths-5',
    category: 'maths',
    subcategory: 'Multiplication',
    difficulty: 'explorer',
    type: 'multiple_choice',
    prompt: 'There are 5 pairs of socks. How many socks is that altogether?',
    subprompt: '5 groups of 2 = ?',
    visuals: [
      { emoji: '🧦', count: 2, label: 'Pair 1' },
      { emoji: '🧦', count: 2, label: 'Pair 2' },
      { emoji: '🧦', count: 2, label: 'Pair 3' },
      { emoji: '🧦', count: 2, label: 'Pair 4' },
      { emoji: '🧦', count: 2, label: 'Pair 5' },
    ],
    options: ['8', '10', '12', '14'],
    correctAnswer: '10',
    hint: 'Count in 2s five times: 2, 4, 6, 8, 10!',
    explanation: '5 × 2 = 10. Counting five groups of 2 gives 10 socks!',
    rewardStars: 1,
  },

  // 6. Number Pattern / Skip Counting (5s)
  {
    id: 'maths-6',
    category: 'maths',
    subcategory: 'Number Patterns',
    difficulty: 'explorer',
    type: 'multiple_choice',
    prompt: 'What number comes next in this pattern? 5, 10, 15, 20, [ ? ]',
    subprompt: 'Look closely: the numbers are counting up in fives!',
    options: ['22', '24', '25', '30'],
    correctAnswer: '25',
    hint: 'Add 5 to 20: 20 + 5 = ?',
    explanation: 'The pattern counts up in 5s: 5, 10, 15, 20, 25!',
    rewardStars: 1,
  },

  // 7. Everyday Word Problem - UK Money
  {
    id: 'maths-7',
    category: 'maths',
    subcategory: 'Word Problems',
    difficulty: 'adventurer',
    type: 'multiple_choice',
    prompt: 'Smaya had 25p in her pocket. She bought a pencil for 10p. How much money does she have left?',
    subprompt: 'Subtract 10p from 25p.',
    options: ['12p', '15p', '20p', '35p'],
    correctAnswer: '15p',
    hint: 'Take one ten away from 25: 25 - 10 = ?',
    explanation: '25p - 10p = 15p. 2 tens minus 1 ten leaves 1 ten and 5 units, so 15p!',
    rewardStars: 2,
  },

  // 8. Sharing Division (Whole Number)
  {
    id: 'maths-8',
    category: 'maths',
    subcategory: 'Division',
    difficulty: 'adventurer',
    type: 'numeric_input',
    prompt: 'Share 12 delicious strawberries equally between 3 woodland rabbits. How many does each rabbit get?',
    subprompt: '12 ÷ 3 = ?',
    visuals: [
      { emoji: '🍓', count: 12, label: '12 strawberries' },
    ],
    correctAnswer: 4,
    hint: 'Think of the 3 times table: 3 × ? = 12',
    explanation: '12 ÷ 3 = 4. Each rabbit gets 4 strawberries because 3 groups of 4 make 12!',
    rewardStars: 2,
  },

  // 9. 10 Times Table
  {
    id: 'maths-9',
    category: 'maths',
    subcategory: 'Multiplication',
    difficulty: 'adventurer',
    type: 'multiple_choice',
    prompt: 'There are 7 packets of crayons. Each packet has 10 crayons. How many crayons are there altogether?',
    subprompt: '7 × 10 = ?',
    options: ['17', '60', '70', '700'],
    correctAnswer: '70',
    hint: 'Count in tens 7 times: 10, 20, 30, 40, 50, 60, 70!',
    explanation: '7 × 10 = 70. Multiplying any whole number by 10 moves each digit one place to the left and adds a zero!',
    rewardStars: 2,
  },

  // 10. Subtraction crossing tens
  {
    id: 'maths-10',
    category: 'maths',
    subcategory: 'Subtraction',
    difficulty: 'adventurer',
    type: 'numeric_input',
    prompt: 'Calculate: 32 - 5',
    subprompt: 'Count back 5 from 32.',
    correctAnswer: 27,
    hint: 'Count back 2 to get to 30, then count back 3 more from 30!',
    explanation: '32 - 5 = 27. First take away 2 to get 30, then 30 - 3 = 27!',
    rewardStars: 2,
  },

  // 11. Missing Number Subtraction
  {
    id: 'maths-11',
    category: 'maths',
    subcategory: 'Missing Number',
    difficulty: 'adventurer',
    type: 'multiple_choice',
    prompt: 'Find the missing number: [ ? ] - 8 = 12',
    subprompt: 'What starting number gives 12 when you take away 8?',
    options: ['18', '20', '22', '4'],
    correctAnswer: '20',
    hint: 'Do the opposite operation: add 12 + 8!',
    explanation: '20 - 8 = 12. Because 12 + 8 = 20, the missing starting number is 20!',
    rewardStars: 2,
  },

  // 12. Number Pattern Counting in 2s backwards
  {
    id: 'maths-12',
    category: 'maths',
    subcategory: 'Number Patterns',
    difficulty: 'adventurer',
    type: 'multiple_choice',
    prompt: 'What number is missing? 24, 22, 20, [ ? ], 16',
    subprompt: 'The numbers are counting backwards in 2s.',
    options: ['17', '18', '19', '21'],
    correctAnswer: '18',
    hint: 'Take 2 away from 20: 20 - 2 = ?',
    explanation: 'Counting backwards in 2s: 24, 22, 20, 18, 16!',
    rewardStars: 2,
  },

  // 13. Two-digit Addition without regrouping
  {
    id: 'maths-13',
    category: 'maths',
    subcategory: 'Addition',
    difficulty: 'adventurer',
    type: 'numeric_input',
    prompt: 'Add together: 23 + 14',
    subprompt: 'Add the tens together (20 + 10), then add the units (3 + 4)!',
    correctAnswer: 37,
    hint: 'Tens: 20 + 10 = 30. Units: 3 + 4 = 7. Combine them!',
    explanation: '23 + 14 = 37. 2 tens + 1 ten = 3 tens (30). 3 ones + 4 ones = 7 ones. 30 + 7 = 37!',
    rewardStars: 2,
  },

  // 14. Word Problem with London Bus
  {
    id: 'maths-14',
    category: 'maths',
    subcategory: 'Word Problems',
    difficulty: 'champion',
    type: 'multiple_choice',
    prompt: 'A red double-decker bus had 28 passengers. At the bus stop, 9 passengers got off and 5 new passengers got on. How many passengers are on the bus now?',
    subprompt: 'First do 28 - 9, then add 5!',
    options: ['22', '24', '26', '32'],
    correctAnswer: '24',
    hint: 'Step 1: 28 - 9 = 19. Step 2: 19 + 5 = ?',
    explanation: '28 - 9 = 19 passengers left. Then 19 + 5 = 24 passengers on board!',
    rewardStars: 3,
  },

  // 15. Division with remainder (Master / Champion level)
  {
    id: 'maths-15',
    category: 'maths',
    subcategory: 'Division',
    difficulty: 'champion',
    type: 'multiple_choice',
    prompt: 'Barnaby Owl shares 11 golden coins equally between 2 treasure chests. How many coins are in each chest, and how many are left over?',
    subprompt: 'Share 11 equally into 2 chests.',
    visuals: [
      { emoji: '🪙', count: 11, label: '11 coins' },
    ],
    options: [
      '4 coins each with 3 left over',
      '5 coins each with 1 left over',
      '5 coins each with 2 left over',
      '6 coins each with none left over',
    ],
    correctAnswer: '5 coins each with 1 left over',
    hint: 'In the 2 times table: 2 × 5 = 10. How many more to make 11?',
    explanation: '11 ÷ 2 = 5 remainder 1! 2 chests each get 5 coins (2 × 5 = 10), and there is 1 coin left over!',
    rewardStars: 3,
  },

  // 16. Missing Number in Multiplication
  {
    id: 'maths-16',
    category: 'maths',
    subcategory: 'Missing Number',
    difficulty: 'champion',
    type: 'numeric_input',
    prompt: 'What number makes this true? [ ? ] × 5 = 35',
    subprompt: 'How many groups of 5 make 35?',
    correctAnswer: 7,
    hint: 'Count in 5s: 5, 10, 15, 20, 25, 30, 35. That is 7 groups!',
    explanation: '7 × 5 = 35. If you share 35 into 5 equal groups, each group has 7!',
    rewardStars: 3,
  },

  // 17. Number Pattern with 10s and 100
  {
    id: 'maths-17',
    category: 'maths',
    subcategory: 'Number Patterns',
    difficulty: 'champion',
    type: 'numeric_input',
    prompt: 'Fill in the missing number: 60, 70, 80, [ ? ], 100',
    subprompt: 'Counting up in tens towards one hundred!',
    correctAnswer: 90,
    hint: 'Add 10 to 80: 80 + 10 = ?',
    explanation: 'The pattern increases by 10 each time: 60, 70, 80, 90, 100!',
    rewardStars: 3,
  },

  // 18. Everyday British Measurement Word Problem
  {
    id: 'maths-18',
    category: 'maths',
    subcategory: 'Word Problems',
    difficulty: 'champion',
    type: 'multiple_choice',
    prompt: 'Smaya is baking cupcakes! The recipe needs 45g of flour. She has only 30g in the jar. How many more grams of flour does she need?',
    subprompt: 'Find the difference between 45g and 30g.',
    options: ['10g', '15g', '20g', '25g'],
    correctAnswer: '15g',
    hint: '45 - 30 = ? Take 3 tens away from 4 tens!',
    explanation: '45g - 30g = 15g. Smaya needs 15 more grams of flour to make 45g!',
    rewardStars: 3,
  },
];
