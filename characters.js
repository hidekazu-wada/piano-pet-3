// ピアノペット図鑑 - キャラクターデータベース
// ファイル命名規則: {rarity}_{species}_{attribute}_{number}.png

export const CHARACTER_DATABASE = {
    // コモン (出現率60%)
    common: [
        {
            id: 'common_cat_melody_001',
            name: 'メロディニャン',
            species: 'ネコ',
            attribute: 'メロディ',
            rarity: 'common',
            image: 'images/characters/common/common_cat_melody_001.png',
            description: 'やさしいメロディを奏でる音楽好きなネコ',
            personality: '優しい',
            habitat: '音楽の森',
            favoriteScale: 'ハ長調',
            catchphrase: 'ニャーン♪ メロディを大切にするニャン',
            ability: 'メロディ記憶'
        },
        {
            id: 'common_rabbit_rhythm_002',
            name: 'リズムピョン',
            species: 'ウサギ',
            attribute: 'リズム',
            rarity: 'common',
            image: 'images/characters/common/common_rabbit_rhythm_002.png',
            description: 'ぴょんぴょん跳ねてリズムを刻むウサギ',
            personality: '元気',
            habitat: 'リズムの草原',
            favoriteScale: 'ト長調',
            catchphrase: 'ピョンピョン♪ リズムに合わせて跳ねるよ',
            ability: 'テンポキープ'
        },
        {
            id: 'common_bird_harmony_003',
            name: 'ハーモニーチュン',
            species: 'トリ',
            attribute: 'ハーモニー',
            rarity: 'common',
            image: 'images/characters/common/common_bird_harmony_003.png',
            description: '美しいハーモニーを歌う小鳥',
            personality: '穏やか',
            habitat: '和音の木',
            favoriteScale: 'ニ長調',
            catchphrase: 'チュンチュン♪ みんなで歌おうよ',
            ability: '和音感知'
        },
        {
            id: 'common_turtle_adagio_004',
            name: 'アダージョガメ',
            species: 'カメ',
            attribute: 'ゆっくり',
            rarity: 'common',
            image: 'images/characters/common/common_turtle_adagio_004.png',
            description: 'ゆっくりだけど確実に演奏するカメ',
            personality: '慎重',
            habitat: 'テンポの池',
            favoriteScale: 'イ短調',
            catchphrase: 'のんびり♪ 急がば回れガメ',
            ability: '正確演奏'
        },
        {
            id: 'common_mouse_staccato_005',
            name: 'スタッカートチュー',
            species: 'ネズミ',
            attribute: 'スタッカート',
            rarity: 'common',
            image: 'images/characters/common/common_mouse_staccato_005.png',
            description: '軽やかなスタッカートが得意なネズミ',
            personality: '活発',
            habitat: '音符の隙間',
            favoriteScale: 'ホ長調',
            catchphrase: 'チューチュー♪ 軽やかに弾くよ',
            ability: 'タッチコントロール'
        }
    ],

    // レア (出現率25%)
    rare: [
        {
            id: 'rare_fox_presto_001',
            name: 'プレストキツネ',
            species: 'キツネ',
            attribute: 'はやい',
            rarity: 'rare',
            image: 'images/characters/rare/rare_fox_presto_001.png',
            description: '稲妻のような速弾きが得意なキツネ',
            personality: '機敏',
            habitat: '高速の風',
            favoriteScale: 'ロ長調',
            catchphrase: 'キツネ♪ 速さなら負けないよ',
            ability: '超高速演奏'
        },
        {
            id: 'rare_owl_nocturne_002',
            name: 'ノクターンフクロウ',
            species: 'フクロウ',
            attribute: '夜想曲',
            rarity: 'rare',
            image: 'images/characters/rare/rare_owl_nocturne_002.png',
            description: '夜の静寂に響く美しい夜想曲を奏でる',
            personality: '神秘的',
            habitat: '月夜の森',
            favoriteScale: '変イ長調',
            catchphrase: 'ホーホー♪ 夜の音楽は特別だよ',
            ability: '感情表現'
        },
        {
            id: 'rare_dolphin_arpeggio_003',
            name: 'アルペジオドルフィン',
            species: 'イルカ',
            attribute: 'アルペジオ',
            rarity: 'rare',
            image: 'images/characters/rare/rare_dolphin_arpeggio_003.png',
            description: '流れるようなアルペジオで海を泳ぐ',
            personality: '流麗',
            habitat: '音の海',
            favoriteScale: '変ニ長調',
            catchphrase: 'イルイル♪ 流れるように弾こう',
            ability: '流麗演奏'
        }
    ],

    // スーパーレア (出現率12%)
    superRare: [
        {
            id: 'super_phoenix_fortissimo_001',
            name: 'フォルテフェニックス',
            species: 'フェニックス',
            attribute: '強音',
            rarity: 'super-rare',
            image: 'images/characters/super-rare/super_phoenix_fortissimo_001.png',
            description: '炎のような情熱的な強音を響かせる不死鳥',
            personality: '情熱的',
            habitat: '音の炎',
            favoriteScale: 'ホ短調',
            catchphrase: 'フェニックス♪ 魂を込めて弾くのだ',
            ability: '魂の響き'
        },
        {
            id: 'super_unicorn_legato_002',
            name: 'レガートユニコーン',
            species: 'ユニコーン',
            attribute: 'なめらか',
            rarity: 'super-rare',
            image: 'images/characters/super-rare/super_unicorn_legato_002.png',
            description: '虹色の音を奏でる伝説のユニコーン',
            personality: '気高い',
            habitat: '虹の橋',
            favoriteScale: '嬰ヘ長調',
            catchphrase: 'ユニコーン♪ 美しい音色を創ろう',
            ability: '虹色演奏'
        }
    ],

    // レジェンダリー (出現率3%)
    legendary: [
        {
            id: 'legendary_dragon_symphony_001',
            name: 'シンフォニードラゴン',
            species: 'ドラゴン',
            attribute: '交響曲',
            rarity: 'legendary',
            image: 'images/characters/legendary/legendary_dragon_symphony_001.png',
            description: '全ての音を司る伝説の音楽ドラゴン',
            personality: '威厳',
            habitat: '楽譜の王座',
            favoriteScale: '全調',
            catchphrase: 'ドラゴン♪ 音楽の力で世界を創造する',
            ability: '完全音感'
        }
    ]
};

// レア度別の出現確率
export const RARITY_WEIGHTS = {
    common: 60,
    rare: 25,
    'super-rare': 12,
    legendary: 3
};

// 全キャラクター数の計算
export const TOTAL_CHARACTERS = 
    CHARACTER_DATABASE.common.length +
    CHARACTER_DATABASE.rare.length +
    CHARACTER_DATABASE.superRare.length +
    CHARACTER_DATABASE.legendary.length;

// レア度による表示色
export const RARITY_COLORS = {
    common: '#9CA3AF',      // グレー
    rare: '#3B82F6',        // ブルー  
    'super-rare': '#8B5CF6', // パープル
    legendary: '#F59E0B'     // ゴールド
};

// キャラクターIDから詳細データを取得
export function getCharacterById(id) {
    const allCharacters = [
        ...CHARACTER_DATABASE.common,
        ...CHARACTER_DATABASE.rare,
        ...CHARACTER_DATABASE.superRare,
        ...CHARACTER_DATABASE.legendary
    ];
    return allCharacters.find(char => char.id === id);
}

// レア度に基づくランダム選択
export function selectRandomCharacter(excludeIds = []) {
    const availableCharacters = [];
    
    // 除外IDを除いた利用可能なキャラクターを収集
    Object.entries(CHARACTER_DATABASE).forEach(([rarityKey, characters]) => {
        characters.forEach(char => {
            if (!excludeIds.includes(char.id)) {
                const weight = RARITY_WEIGHTS[char.rarity];
                // 重みの分だけ配列に追加（確率調整）
                for (let i = 0; i < weight; i++) {
                    availableCharacters.push(char);
                }
            }
        });
    });
    
    if (availableCharacters.length === 0) {
        return null; // 全てのキャラクターが取得済み
    }
    
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    return availableCharacters[randomIndex];
}