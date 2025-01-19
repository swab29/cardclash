export const rollDice = (diceCount, diceSides) => {
  let total = 0;
  for (let i = 0; i < diceCount; i++) {
    total += Math.floor(Math.random() * diceSides) + 1;
  }
  return total;
}

export const formatDice = (count, sides) => {
  return `${count}d${sides}`;
}