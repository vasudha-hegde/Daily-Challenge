import { Question, Difficulty, VisualItem } from '../types';

/**
 * Random integer between min and max inclusive.
 */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random element from array.
 */
function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle array helper.
 */
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const FRIENDLY_EMOJIS = ['🐞', '🍎', '⭐', '🍓', '🌰', '🪙', '🧦', '🧸', '🎈', '🐸'];

/**
 * Generates 4 unique plausible options for multiple-choice questions.
 */
function generateDistractors(correctAnswer: number, min: number = 0, maxOffset: number = 4): string[] {
  const set = new Set<number>();
  set.add(correctAnswer);

  const offsets = [-3, -2, -1, 1, 2, 3, 4, 10, -10];
  shuffle(offsets);

  for (const offset of offsets) {
    const candidate = correctAnswer + offset;
    if (candidate >= min && candidate !== correctAnswer) {
      set.add(candidate);
    }
    if (set.size === 4) break;
  }

  // Fallback if needed
  let extra = 1;
  while (set.size < 4) {
    set.add(correctAnswer + extra);
    extra++;
  }

  return shuffle(Array.from(set).map((n) => String(n)));
}

/**
 * Generate a procedural Year 2 Maths Question.
 */
export function generateMathsQuestion(difficulty: Difficulty = 'explorer'): Question {
  const subcategories = ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Missing Number', 'Number Patterns'];
  const subcategory = randChoice(subcategories);
  const qId = `gen-maths-${Date.now()}-${randInt(100, 999)}`;
  const useKeypad = Math.random() > 0.5;

  // 1. ADDITION
  if (subcategory === 'Addition') {
    if (difficulty === 'explorer') {
      // 1-digit + 1-digit or bonds to 10/20
      const a = randInt(4, 9);
      const b = randInt(2, 8);
      const sum = a + b;
      const emoji = randChoice(FRIENDLY_EMOJIS);
      const visuals: VisualItem[] = [
        { emoji, count: a, label: `${a} items` },
        { emoji, count: b, label: `${b} items` },
      ];

      return {
        id: qId,
        category: 'maths',
        subcategory: 'Addition',
        difficulty,
        type: useKeypad ? 'numeric_input' : 'multiple_choice',
        prompt: `What is ${a} + ${b}?`,
        subprompt: `Count the friendly objects and add them together!`,
        visuals,
        options: useKeypad ? undefined : generateDistractors(sum),
        correctAnswer: useKeypad ? sum : String(sum),
        hint: `Start with ${Math.max(a, b)} and count on ${Math.min(a, b)} more!`,
        explanation: `${a} + ${b} = ${sum}. You can count on from ${a}: ${Array.from({ length: b }, (_, i) => a + 1 + i).join(', ')}!`,
        rewardStars: 1,
      };
    } else if (difficulty === 'adventurer') {
      // 2-digit + 1-digit or adding tens
      const isTens = Math.random() > 0.5;
      if (isTens) {
        const tens = randInt(1, 3) * 10;
        const base = randInt(21, 55);
        const sum = base + tens;
        return {
          id: qId,
          category: 'maths',
          subcategory: 'Addition',
          difficulty,
          type: useKeypad ? 'numeric_input' : 'multiple_choice',
          prompt: `Calculate: ${base} + ${tens}`,
          subprompt: `Add ${tens / 10} tens to ${base}!`,
          options: useKeypad ? undefined : generateDistractors(sum),
          correctAnswer: useKeypad ? sum : String(sum),
          hint: `Notice the units digit stays as ${base % 10}. Just add the tens!`,
          explanation: `${base} + ${tens} = ${sum}. Adding ${tens} increases the tens column from ${Math.floor(base / 10)} to ${Math.floor(sum / 10)}!`,
          rewardStars: 2,
        };
      } else {
        const a = randInt(18, 48);
        const b = randInt(4, 9);
        const sum = a + b;
        return {
          id: qId,
          category: 'maths',
          subcategory: 'Addition',
          difficulty,
          type: useKeypad ? 'numeric_input' : 'multiple_choice',
          prompt: `What is ${a} + ${b}?`,
          subprompt: `Count forward ${b} from ${a}.`,
          options: useKeypad ? undefined : generateDistractors(sum),
          correctAnswer: useKeypad ? sum : String(sum),
          hint: `Think what number makes the next ten!`,
          explanation: `${a} + ${b} = ${sum}. A wonderful calculation!`,
          rewardStars: 2,
        };
      }
    } else {
      // Champion: 2-digit + 2-digit or word problem
      const a = randInt(21, 45);
      const b = randInt(12, 34);
      const sum = a + b;
      const isWordProblem = Math.random() > 0.5;

      if (isWordProblem) {
        return {
          id: qId,
          category: 'maths',
          subcategory: 'Addition',
          difficulty,
          type: 'multiple_choice',
          prompt: `Smaya collected ${a} shiny shells on the beach. Her friend Hazel found ${b} shells. How many shells did they find altogether?`,
          subprompt: `Add ${a} and ${b} together.`,
          options: generateDistractors(sum),
          correctAnswer: String(sum),
          hint: `Add the tens first (${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10}), then add the units!`,
          explanation: `${a} + ${b} = ${sum}. They found ${sum} shells altogether!`,
          rewardStars: 3,
        };
      }

      return {
        id: qId,
        category: 'maths',
        subcategory: 'Addition',
        difficulty,
        type: useKeypad ? 'numeric_input' : 'multiple_choice',
        prompt: `Add together: ${a} + ${b}`,
        subprompt: `Add the tens first, then add the units.`,
        options: useKeypad ? undefined : generateDistractors(sum),
        correctAnswer: useKeypad ? sum : String(sum),
        hint: `Tens: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${(Math.floor(a / 10) + Math.floor(b / 10)) * 10}. Units: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}.`,
        explanation: `${a} + ${b} = ${sum}. Brilliant math thinking!`,
        rewardStars: 3,
      };
    }
  }

  // 2. SUBTRACTION
  if (subcategory === 'Subtraction') {
    if (difficulty === 'explorer') {
      const a = randInt(10, 18);
      const b = randInt(3, 8);
      const diff = a - b;
      const emoji = randChoice(FRIENDLY_EMOJIS);
      const visuals: VisualItem[] = [{ emoji, count: a, label: `${a} ${emoji} in total` }];

      return {
        id: qId,
        category: 'maths',
        subcategory: 'Subtraction',
        difficulty,
        type: useKeypad ? 'numeric_input' : 'multiple_choice',
        prompt: `What is ${a} - ${b}?`,
        subprompt: `Start with ${a} and take away ${b}!`,
        visuals,
        options: useKeypad ? undefined : generateDistractors(diff),
        correctAnswer: useKeypad ? diff : String(diff),
        hint: `Count backwards ${b} steps from ${a}!`,
        explanation: `${a} - ${b} = ${diff}. When you take away ${b} from ${a}, you have ${diff} left!`,
        rewardStars: 1,
      };
    } else if (difficulty === 'adventurer') {
      const a = randInt(25, 60);
      const isTens = Math.random() > 0.5;
      if (isTens) {
        const tens = randInt(1, 3) * 10;
        const diff = a - tens;
        return {
          id: qId,
          category: 'maths',
          subcategory: 'Subtraction',
          difficulty,
          type: useKeypad ? 'numeric_input' : 'multiple_choice',
          prompt: `Calculate: ${a} - ${tens}`,
          subprompt: `Take away ${tens / 10} tens from ${a}!`,
          options: useKeypad ? undefined : generateDistractors(diff),
          correctAnswer: useKeypad ? diff : String(diff),
          hint: `The units digit remains ${a % 10}!`,
          explanation: `${a} - ${tens} = ${diff}. Only the tens column changed!`,
          rewardStars: 2,
        };
      } else {
        const b = randInt(5, 9);
        const diff = a - b;
        return {
          id: qId,
          category: 'maths',
          subcategory: 'Subtraction',
          difficulty,
          type: useKeypad ? 'numeric_input' : 'multiple_choice',
          prompt: `What is ${a} - ${b}?`,
          subprompt: `Count back ${b} from ${a}.`,
          options: useKeypad ? undefined : generateDistractors(diff),
          correctAnswer: useKeypad ? diff : String(diff),
          hint: `Partition ${b}: take away to get to the ten, then take away the rest!`,
          explanation: `${a} - ${b} = ${diff}. Well done!`,
          rewardStars: 2,
        };
      }
    } else {
      // Champion: UK Money word problem or 2-digit subtraction
      const a = randInt(40, 85);
      const b = randInt(15, 35);
      const diff = a - b;

      return {
        id: qId,
        category: 'maths',
        subcategory: 'Subtraction',
        difficulty,
        type: 'multiple_choice',
        prompt: `Barnaby had ${a}p. He spent ${b}p on a sparkling bookmark. How much money does he have left?`,
        subprompt: `Calculate ${a}p - ${b}p.`,
        options: generateDistractors(diff).map((val) => `${val}p`),
        correctAnswer: `${diff}p`,
        hint: `Subtract the tens first (${Math.floor(a / 10) * 10} - ${Math.floor(b / 10) * 10}), then the ones!`,
        explanation: `${a}p - ${b}p = ${diff}p. Barnaby has ${diff}p remaining!`,
        rewardStars: 3,
      };
    }
  }

  // 3. MULTIPLICATION (2, 5, 10 Times Tables)
  if (subcategory === 'Multiplication') {
    const table = difficulty === 'explorer' ? 2 : randChoice([2, 5, 10]);
    const factor = randInt(2, difficulty === 'champion' ? 12 : 9);
    const product = table * factor;

    const visuals: VisualItem[] =
      difficulty === 'explorer' && factor <= 6
        ? Array.from({ length: factor }, (_, idx) => ({
            emoji: '🧦',
            count: 2,
            label: `Pair ${idx + 1}`,
          }))
        : [];

    return {
      id: qId,
      category: 'maths',
      subcategory: 'Multiplication',
      difficulty,
      type: useKeypad ? 'numeric_input' : 'multiple_choice',
      prompt: `What is ${factor} × ${table}?`,
      subprompt: `${factor} groups of ${table} = ?`,
      visuals: visuals.length > 0 ? visuals : undefined,
      options: useKeypad ? undefined : generateDistractors(product),
      correctAnswer: useKeypad ? product : String(product),
      hint: `Count up in ${table}s ${factor} times!`,
      explanation: `${factor} × ${table} = ${product}. Counting in ${table}s gives ${product}!`,
      rewardStars: difficulty === 'explorer' ? 1 : difficulty === 'adventurer' ? 2 : 3,
    };
  }

  // 4. DIVISION (Sharing Equally)
  if (subcategory === 'Division') {
    if (difficulty === 'champion') {
      // Division with remainder
      const divisor = randChoice([2, 5]);
      const quotient = randInt(3, 7);
      const remainder = randInt(1, divisor - 1);
      const total = divisor * quotient + remainder;

      const correctStr = `${quotient} each with ${remainder} left over`;
      const options = [
        correctStr,
        `${quotient - 1} each with ${remainder + 1} left over`,
        `${quotient + 1} each with none left over`,
        `${quotient} each with ${remainder + 1} left over`,
      ];

      return {
        id: qId,
        category: 'maths',
        subcategory: 'Division',
        difficulty,
        type: 'multiple_choice',
        prompt: `Pip shares ${total} acorns equally between ${divisor} squirrel friends. How many acorns does each squirrel get, and how many are left over?`,
        subprompt: `Share ${total} into ${divisor} equal groups.`,
        options: shuffle(options),
        correctAnswer: correctStr,
        hint: `In the ${divisor} times table: ${divisor} × ${quotient} = ${divisor * quotient}. What is left over from ${total}?`,
        explanation: `${total} ÷ ${divisor} = ${quotient} remainder ${remainder}! Each friend gets ${quotient} acorns and ${remainder} is left over!`,
        rewardStars: 3,
      };
    } else {
      // Whole number sharing
      const divisor = difficulty === 'explorer' ? 2 : randChoice([2, 5, 10]);
      const quotient = randInt(2, 6);
      const total = divisor * quotient;
      const emoji = randChoice(FRIENDLY_EMOJIS);

      return {
        id: qId,
        category: 'maths',
        subcategory: 'Division',
        difficulty,
        type: useKeypad ? 'numeric_input' : 'multiple_choice',
        prompt: `Share ${total} ${emoji} equally into ${divisor} baskets. How many in each basket?`,
        subprompt: `${total} ÷ ${divisor} = ?`,
        options: useKeypad ? undefined : generateDistractors(quotient),
        correctAnswer: useKeypad ? quotient : String(quotient),
        hint: `Think: What number multiplied by ${divisor} makes ${total}?`,
        explanation: `${total} ÷ ${divisor} = ${quotient}. Because ${quotient} × ${divisor} = ${total}!`,
        rewardStars: difficulty === 'explorer' ? 1 : 2,
      };
    }
  }

  // 5. MISSING NUMBER
  if (subcategory === 'Missing Number') {
    const isMultiplication = difficulty === 'champion' && Math.random() > 0.4;

    if (isMultiplication) {
      const table = randChoice([2, 5, 10]);
      const factor = randInt(3, 9);
      const prod = table * factor;

      return {
        id: qId,
        category: 'maths',
        subcategory: 'Missing Number',
        difficulty,
        type: useKeypad ? 'numeric_input' : 'multiple_choice',
        prompt: `Find the missing number: [ ? ] × ${table} = ${prod}`,
        subprompt: `What number times ${table} equals ${prod}?`,
        options: useKeypad ? undefined : generateDistractors(factor),
        correctAnswer: useKeypad ? factor : String(factor),
        hint: `Count in ${table}s until you reach ${prod}!`,
        explanation: `${factor} × ${table} = ${prod}. The missing number is ${factor}!`,
        rewardStars: 3,
      };
    } else {
      const a = randInt(5, 15);
      const b = randInt(4, 15);
      const sum = a + b;

      return {
        id: qId,
        category: 'maths',
        subcategory: 'Missing Number',
        difficulty,
        type: useKeypad ? 'numeric_input' : 'multiple_choice',
        prompt: `Find the missing number: ${a} + [ ? ] = ${sum}`,
        subprompt: `What do you add to ${a} to get ${sum}?`,
        options: useKeypad ? undefined : generateDistractors(b),
        correctAnswer: useKeypad ? b : String(b),
        hint: `Do the opposite: subtract ${a} from ${sum}!`,
        explanation: `${a} + ${b} = ${sum}. You can find the answer by doing ${sum} - ${a} = ${b}!`,
        rewardStars: difficulty === 'explorer' ? 1 : 2,
      };
    }
  }

  // 6. NUMBER PATTERNS
  const step = randChoice([2, 5, 10]);
  const start = randInt(1, 5) * step;
  const isBackwards = difficulty === 'champion' || (difficulty === 'adventurer' && Math.random() > 0.6);

  const seq = isBackwards
    ? [start + step * 4, start + step * 3, start + step * 2, start + step, start]
    : [start, start + step, start + step * 2, start + step * 3, start + step * 4];

  const missingIdx = 3;
  const missingVal = seq[missingIdx];
  const displaySeq = [...seq];
  displaySeq[missingIdx] = '[ ? ]' as unknown as number;

  return {
    id: qId,
    category: 'maths',
    subcategory: 'Number Patterns',
    difficulty,
    type: useKeypad ? 'numeric_input' : 'multiple_choice',
    prompt: `What number is missing in this pattern? ${displaySeq.join(', ')}`,
    subprompt: `The pattern is counting ${isBackwards ? 'backwards' : 'forward'} in ${step}s!`,
    options: useKeypad ? undefined : generateDistractors(missingVal),
    correctAnswer: useKeypad ? missingVal : String(missingVal),
    hint: `Look at the jump between each number: it changes by ${step} every time!`,
    explanation: `The missing number is ${missingVal}! The complete sequence is: ${seq.join(', ')}.`,
    rewardStars: difficulty === 'explorer' ? 1 : difficulty === 'adventurer' ? 2 : 3,
  };
}
