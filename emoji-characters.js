// 絵文字ベースのキャラクター生成
export const emojiCharacters = {
  // 動物系
  animals: [
    { emoji: '🐢', name: 'カメ', variants: ['🟢', '🔵', '🟣'] },
    { emoji: '🦋', name: 'チョウ', variants: ['🌸', '🌺', '🌼'] },
    { emoji: '🐸', name: 'カエル', variants: ['🎵', '🎶', '🎼'] },
    { emoji: '🦄', name: 'ユニコーン', variants: ['✨', '🌟', '💫'] },
    { emoji: '🐉', name: 'ドラゴン', variants: ['🔥', '💨', '⚡'] },
    { emoji: '🦊', name: 'キツネ', variants: ['🍁', '🍂', '🌙'] },
    { emoji: '🐧', name: 'ペンギン', variants: ['❄️', '🧊', '⛄'] },
    { emoji: '🦉', name: 'フクロウ', variants: ['🌙', '⭐', '🌃'] }
  ],
  
  // 楽器系
  instruments: [
    { emoji: '🎹', name: 'ピアノ', variants: ['🎵', '🎶', '🎼'] },
    { emoji: '🎸', name: 'ギター', variants: ['🎤', '🎧', '📻'] },
    { emoji: '🥁', name: 'ドラム', variants: ['💥', '⚡', '🔊'] },
    { emoji: '🎺', name: 'トランペット', variants: ['📯', '🎷', '🎻'] }
  ],
  
  // マジカル系
  magical: [
    { emoji: '🧚', name: 'フェアリー', variants: ['✨', '💫', '🌟'] },
    { emoji: '🧙', name: 'まほうつかい', variants: ['🔮', '📚', '🌙'] },
    { emoji: '👻', name: 'おばけ', variants: ['💨', '🌫️', '☁️'] },
    { emoji: '🤖', name: 'ロボット', variants: ['⚙️', '🔧', '💡'] }
  ],
  
  // 自然系
  nature: [
    { emoji: '🌻', name: 'ひまわり', variants: ['☀️', '🌤️', '🌈'] },
    { emoji: '🌳', name: 'たいぼく', variants: ['🍃', '🍂', '🌿'] },
    { emoji: '🌊', name: 'なみ', variants: ['🏄', '🐚', '⛵'] },
    { emoji: '⛰️', name: 'やま', variants: ['🏔️', '🗻', '⛺'] }
  ]
};

// キャラクターの組み合わせ生成
export function generateEmojiCharacter(seed) {
  const categories = Object.values(emojiCharacters);
  const category = categories[seed % categories.length];
  const character = category[Math.floor(Math.random() * category.length)];
  const variant = character.variants[Math.floor(Math.random() * character.variants.length)];
  
  return {
    main: character.emoji,
    accent: variant,
    category: character.name,
    display: `${character.emoji}${variant}`
  };
}