export const creatures = [
  {
    name: "Stone Golem",
    traits: {
      strength: { dice: 3, sides: 4 },    // 3d4
      agility: { dice: 1, sides: 6 },     // 1d6
      magic: { dice: 1, sides: 4 },       // 1d4
      cunning: { dice: 2, sides: 4 }      // 2d4
    }
  },
  {
    name: "Swift Sprite",
    traits: {
      strength: { dice: 1, sides: 4 },    // 1d4
      agility: { dice: 3, sides: 6 },     // 3d6
      magic: { dice: 2, sides: 4 },       // 2d4
      cunning: { dice: 1, sides: 8 }      // 1d8
    }
  },
  {
    name: "Mystic Dragon",
    traits: {
      strength: { dice: 2, sides: 6 },    // 2d6
      agility: { dice: 1, sides: 8 },     // 1d8
      magic: { dice: 2, sides: 8 },       // 2d8
      cunning: { dice: 1, sides: 4 }      // 1d4
    }
  },
  {
    name: "Shadow Fox",
    traits: {
      strength: { dice: 1, sides: 6 },    // 1d6
      agility: { dice: 2, sides: 6 },     // 2d6
      magic: { dice: 1, sides: 4 },       // 1d4
      cunning: { dice: 3, sides: 6 }      // 3d6
    }
  },
  // Add more creatures with balanced traits
];