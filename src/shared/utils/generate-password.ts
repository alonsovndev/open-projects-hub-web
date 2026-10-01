const LETTERS = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const DIGITS = "23456789";
const ALL_CHARACTERS = LETTERS + DIGITS;

const randomInt = (exclusiveMax: number): number => {
  const [randomValue] = crypto.getRandomValues(new Uint32Array(1));
  return randomValue % exclusiveMax;
};

const pickRandom = (characters: string): string => characters[randomInt(characters.length)];

// Always contains a letter and a digit so it satisfies the password rules in the team form.
export const generateTemporaryPassword = (length = 12): string => {
  const characters = [pickRandom(LETTERS), pickRandom(DIGITS)];
  while (characters.length < length) {
    characters.push(pickRandom(ALL_CHARACTERS));
  }

  for (let index = characters.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]];
  }
  return characters.join("");
};
