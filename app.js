class PianoPracticeApp {
    constructor() {
        this.currentSongId = null;
        this.currentPracticeId = null;
        this.timerInterval = null;
        this.timerSeconds = 0;
        this.timerRunning = false;
        this.selectedLevel = 0;
        this.selectedAttitude = 0;
        this.currentView = 'list';
        this.skillTree = null;
        this.harvestAnimating = false;
        this.harvestAnimationProgress = 0;
        this.harvestPracticeId = null;
        this.animationQueue = [];
        this.previousTreeState = null;
        this.collectedCharacters = new Set();
        this.initializeData();
        this.loadSettings();
        this.loadCharacterData();
        this.render();
    }

    initializeData() {
        const savedData = localStorage.getItem('practiceData');
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            this.data = {
                songs: {
                    song1: {
                        id: "song1",
                        title: "ミュゼット",
                        practices: [
                            {
                                id: "p1",
                                title: "1だんめ りょうてでゆっくり",
                                description: "テンポ60でただしく",
                                level: 0,
                                isCompleted: false,
                                criteria: {
                                    tempo: { current: 60, target: 100 },
                                    accuracy: { current: 0, target: 10 }
                                },
                                practiceTime: 0,
                                lastPracticed: null,
                                checkPoints: [
                                    { id: "cp1", text: "ひだりてを ていねいに おさえる", checked: false },
                                    { id: "cp2", text: "みぎての おとが ちいさくならないように", checked: false }
                                ]
                            },
                            {
                                id: "p2",
                                title: "2だんめ みぎてだけ",
                                description: "ゆびづかいにちゅうい",
                                level: 0,
                                isCompleted: false,
                                criteria: {
                                    tempo: { current: 80, target: 120 },
                                    accuracy: { current: 0, target: 10 }
                                },
                                practiceTime: 0,
                                lastPracticed: null,
                                checkPoints: [
                                    { id: "cp3", text: "ゆびばんごうを まもる", checked: false },
                                    { id: "cp4", text: "スラーを なめらかに つなげる", checked: false }
                                ]
                            },
                            {
                                id: "p3",
                                title: "2だんめ ひだりてだけ",
                                description: "リズムをただしく",
                                level: 0,
                                isCompleted: false,
                                criteria: {
                                    tempo: { current: 80, target: 120 },
                                    accuracy: { current: 0, target: 10 }
                                },
                                practiceTime: 0,
                                lastPracticed: null,
                                checkPoints: [
                                    { id: "cp5", text: "8ぶおんぷうを そろえる", checked: false },
                                    { id: "cp6", text: "きゅうふを ただしく やすむ", checked: false }
                                ]
                            }
                        ]
                    },
                    song2: {
                        id: "song2",
                        title: "ちいさなせかい",
                        practices: [
                            {
                                id: "p4",
                                title: "さいしょの8しょうせつ",
                                description: "メロディーをうたうように",
                                level: 0,
                                isCompleted: false,
                                criteria: {
                                    tempo: { current: 70, target: 110 },
                                    accuracy: { current: 0, target: 10 }
                                },
                                practiceTime: 0,
                                lastPracticed: null,
                                checkPoints: [
                                    { id: "cp7", text: "メロディーを はっきり きかせる", checked: false },
                                    { id: "cp8", text: "ばんそうを ちいさく ひく", checked: false }
                                ]
                            },
                            {
                                id: "p5",
                                title: "わおんのぶぶん",
                                description: "ゆびをそろえて",
                                level: 0,
                                isCompleted: false,
                                criteria: {
                                    tempo: { current: 60, target: 100 },
                                    accuracy: { current: 0, target: 10 }
                                },
                                practiceTime: 0,
                                lastPracticed: null,
                                checkPoints: [
                                    { id: "cp9", text: "3つのおとを いっしょに おさえる", checked: false },
                                    { id: "cp10", text: "おとのおおきさを そろえる", checked: false }
                                ]
                            }
                        ]
                    }
                }
            };
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem('practiceData', JSON.stringify(this.data));
    }

    loadSettings() {
        this.settings = {
            geminiApiKey: localStorage.getItem('geminiApiKey') || '',
            elevenLabsApiKey: localStorage.getItem('elevenLabsApiKey') || '',
            openaiApiKey: localStorage.getItem('openaiApiKey') || ''
        };
        
        // キャラクターコレクションをロード
        this.characterCollection = JSON.parse(localStorage.getItem('characterCollection') || '{}');
    }

    saveSettings() {
        const geminiKey = document.getElementById('gemini-api-key').value;
        const elevenLabsKey = document.getElementById('elevenlabs-api-key').value;
        const openaiKey = document.getElementById('openai-api-key').value;
        
        if (geminiKey) {
            localStorage.setItem('geminiApiKey', geminiKey);
            this.settings.geminiApiKey = geminiKey;
        }
        if (elevenLabsKey) {
            localStorage.setItem('elevenLabsApiKey', elevenLabsKey);
            this.settings.elevenLabsApiKey = elevenLabsKey;
        }
        if (openaiKey) {
            localStorage.setItem('openaiApiKey', openaiKey);
            this.settings.openaiApiKey = openaiKey;
        }
        
        alert('せっていをほぞんしました！');
        this.showHomeScreen();
    }

    loadCharacterData() {
        // 収集済みキャラクターをロード
        const savedCharacters = localStorage.getItem('collectedCharacters');
        if (savedCharacters) {
            this.collectedCharacters = new Set(JSON.parse(savedCharacters));
        }
        
        // キャラクターデータベースをロード（非同期で読み込む）
        this.loadCharacterDatabase();
    }

    async loadCharacterDatabase() {
        try {
            const charactersModule = await import('./characters.js');
            this.CHARACTER_DATABASE = charactersModule.CHARACTER_DATABASE;
            this.RARITY_WEIGHTS = charactersModule.RARITY_WEIGHTS;
            this.TOTAL_CHARACTERS = charactersModule.TOTAL_CHARACTERS;
            this.getCharacterById = charactersModule.getCharacterById;
            this.selectRandomCharacter = charactersModule.selectRandomCharacter;
        } catch (error) {
            console.error('キャラクターデータベースの読み込みに失敗:', error);
            // フォールバック用のダミーデータ
            this.CHARACTER_DATABASE = { common: [], rare: [], superRare: [], legendary: [] };
            this.TOTAL_CHARACTERS = 0;
        }
    }

    saveCharacterData() {
        localStorage.setItem('collectedCharacters', JSON.stringify([...this.collectedCharacters]));
    }

    render() {
        this.renderSongList();
    }

    renderSongList() {
        const songList = document.getElementById('song-list');
        songList.innerHTML = '';
        
        Object.values(this.data.songs).forEach(song => {
            const totalPractices = song.practices.length;
            const completedPractices = song.practices.filter(p => p.isCompleted).length;
            const progress = totalPractices > 0 ? (completedPractices / totalPractices) * 100 : 0;
            
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <h3>${song.title}</h3>
                <p>${completedPractices}/${totalPractices} のれんしゅうがかんりょう</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <button class="delete-song-btn" onclick="event.stopPropagation(); app.deleteSong('${song.id}')">×</button>
            `;
            songCard.onclick = () => this.showPracticeScreen(song.id);
            songList.appendChild(songCard);
        });
    }

    renderPracticeList() {
        const practiceList = document.getElementById('practice-list');
        const song = this.data.songs[this.currentSongId];
        
        document.getElementById('song-title').textContent = song.title;
        practiceList.innerHTML = '';
        
        // 未完了の練習を先に表示
        const incompletePractices = song.practices.filter(p => !p.isCompleted);
        const completedPractices = song.practices.filter(p => p.isCompleted);
        
        // 未完了の練習を表示
        incompletePractices.forEach(practice => {
            const practiceCard = document.createElement('div');
            practiceCard.className = 'practice-card';
            practiceCard.innerHTML = `
                <h3>${practice.title}</h3>
                <p>${practice.description}</p>
                <div class="level-badge">
                    レベル ${Math.floor(practice.level)}
                </div>
                <div class="practice-actions-btns">
                    <button class="edit-practice-btn" onclick="event.stopPropagation(); app.showEditPracticeModal('${practice.id}')">✏️</button>
                    <button class="delete-practice-btn" onclick="event.stopPropagation(); app.deletePractice('${practice.id}')">×</button>
                </div>
            `;
            practiceCard.onclick = () => this.showEvaluationScreen(practice.id);
            practiceList.appendChild(practiceCard);
        });
        
        // 区切り線を追加（完了した練習がある場合）
        if (completedPractices.length > 0) {
            const divider = document.createElement('div');
            divider.className = 'practice-divider';
            divider.innerHTML = '<span>マスター済み</span>';
            practiceList.appendChild(divider);
        }
        
        // 完了した練習を表示
        completedPractices.forEach(practice => {
            const practiceCard = document.createElement('div');
            practiceCard.className = 'practice-card completed';
            practiceCard.innerHTML = `
                <h3>${practice.title}</h3>
                <p>${practice.description}</p>
                <div class="level-badge master">
                    マスター済み
                </div>
                <button class="reopen-btn" onclick="event.stopPropagation(); app.reopenPractice('${practice.id}')">
                    練習を再開
                </button>
            `;
            practiceCard.onclick = () => this.showEvaluationScreen(practice.id);
            practiceList.appendChild(practiceCard);
        });
    }

    showHomeScreen() {
        this.hideAllScreens();
        document.getElementById('home-screen').classList.add('active');
        this.renderSongList();
    }

    showPracticeScreen(songId) {
        this.currentSongId = songId || this.currentSongId;
        this.hideAllScreens();
        document.getElementById('practice-screen').classList.add('active');
        if (this.currentView === 'list') {
            this.renderPracticeList();
        } else {
            this.renderSkillTree();
        }
    }

    showListView() {
        this.currentView = 'list';
        document.getElementById('practice-list').style.display = 'block';
        document.getElementById('skill-tree-container').style.display = 'none';
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[onclick="app.showListView()"]').classList.add('active');
        this.renderPracticeList();
    }

    showSkillTreeView() {
        this.currentView = 'tree';
        document.getElementById('practice-list').style.display = 'none';
        document.getElementById('skill-tree-container').style.display = 'block';
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[onclick="app.showSkillTreeView()"]').classList.add('active');
        
        // アニメーションキューを処理
        this.processAnimationQueue();
        
        this.renderSkillTree();
    }

    showCharacterBookView() {
        this.currentView = 'character-book';
        document.getElementById('practice-list').style.display = 'none';
        document.getElementById('skill-tree-container').style.display = 'none';
        document.getElementById('character-book-container').style.display = 'block';
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[onclick="app.showCharacterBookView()"]').classList.add('active');
        this.renderCharacterBook();
    }

    renderCharacterBook() {
        const grid = document.getElementById('character-grid');
        const completionRate = document.getElementById('completion-rate');
        
        if (!grid || !completionRate) return;
        
        // Clear existing content
        grid.innerHTML = '';
        
        if (!this.CHARACTER_DATABASE) {
            grid.innerHTML = '<div class="loading-message">キャラクターデータ読み込み中...</div>';
            return;
        }
        
        // 全キャラクターを表示
        const allCharacters = [
            ...this.CHARACTER_DATABASE.common,
            ...this.CHARACTER_DATABASE.rare,
            ...this.CHARACTER_DATABASE.superRare,
            ...this.CHARACTER_DATABASE.legendary
        ];
        
        // コンプリート率を計算
        const collectedCount = this.collectedCharacters.size;
        const totalCount = allCharacters.length;
        const completionPercentage = totalCount > 0 ? Math.round((collectedCount / totalCount) * 100) : 0;
        
        completionRate.textContent = `${collectedCount}/${totalCount} (${completionPercentage}%)`;
        
        // キャラクターカードを生成
        allCharacters.forEach(character => {
            const isCollected = this.collectedCharacters.has(character.id);
            const characterCard = document.createElement('div');
            characterCard.className = `character-card ${character.rarity} ${isCollected ? 'collected' : 'character-mystery'}`;
            
            if (isCollected) {
                characterCard.innerHTML = `
                    <div class="character-image" style="background-image: url('${character.image}')"></div>
                    <div class="character-name">${character.name}</div>
                    <div class="character-rarity">${character.rarity}</div>
                `;
                characterCard.onclick = () => this.showCharacterDetail(character);
            } else {
                characterCard.innerHTML = `
                    <div class="character-image">❓</div>
                    <div class="character-name">???</div>
                    <div class="character-rarity">${character.rarity}</div>
                `;
            }
            
            grid.appendChild(characterCard);
        });
    }

    showCharacterDetail(character) {
        // キャラクター詳細モーダルを表示
        const modal = document.createElement('div');
        modal.className = 'character-detail-modal';
        modal.innerHTML = `
            <div class="character-detail-content">
                <div class="character-detail-image" style="background-image: url('${character.image}')"></div>
                <div class="character-detail-name">${character.name}</div>
                <div class="character-detail-species">${character.species} - ${character.attribute}</div>
                <div class="character-detail-description">${character.description}</div>
                <div class="character-detail-stats">
                    <div class="character-stat">
                        <span class="character-stat-label">性格</span>
                        ${character.personality}
                    </div>
                    <div class="character-stat">
                        <span class="character-stat-label">生息地</span>
                        ${character.habitat}
                    </div>
                    <div class="character-stat">
                        <span class="character-stat-label">好きな調</span>
                        ${character.favoriteScale}
                    </div>
                    <div class="character-stat">
                        <span class="character-stat-label">能力</span>
                        ${character.ability}
                    </div>
                </div>
                <div class="detail-catchphrase">${character.catchphrase}</div>
                <button class="close-detail-btn" onclick="this.parentElement.parentElement.remove()">とじる</button>
            </div>
        `;
        
        // クリックで閉じる
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
        
        document.body.appendChild(modal);
    }

    renderSkillTree() {
        const canvas = document.getElementById('skill-tree-canvas');
        const ctx = canvas.getContext('2d');
        const song = this.data.songs[this.currentSongId];
        
        // Canvasのサイズを設定
        const container = canvas.parentElement;
        canvas.width = container.clientWidth - 40;
        canvas.height = 700;
        
        // 背景をクリア（空のグラデーション）
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#e6f3ff');
        gradient.addColorStop(1, '#f0f8ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (!song || song.practices.length === 0) return;
        
        // 曲全体のレベルを計算（全練習項目のレベル合計）
        const totalLevel = song.practices.reduce((sum, practice) => sum + practice.level, 0);
        const masteredPractices = song.practices.filter(p => p.isCompleted);
        
        // 1曲1本の大きな木を中央に描画
        const centerX = canvas.width / 2;
        const treeData = {
            x: centerX,
            y: canvas.height - 50,
            level: totalLevel,
            masteredCount: masteredPractices.length,
            totalPractices: song.practices.length,
            song: song
        };
        
        this.drawSongTree(ctx, treeData);
        
        // 練習項目のリストを木の下に表示
        this.drawPracticeLabels(ctx, song, canvas.height - 50);
        
        // クリックイベントの設定（木全体がクリック可能）
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 木のエリア内でのクリックを判定
            if (x > centerX - 100 && x < centerX + 100 && y < canvas.height - 20) {
                // 練習項目リストをポップアップで表示
                this.showPracticeSelector();
            }
        };
    }

    drawSongTree(ctx, treeData) {
        const { x, y, level, masteredCount, totalPractices, song } = treeData;
        
        // アニメーション中の場合はアニメーションレベルを使用
        const displayLevel = this.animationLevel !== null && this.animationLevel !== undefined ? this.animationLevel : level;
        
        // 地面を豪華に描画
        const groundGradient = ctx.createLinearGradient(x - 150, y, x + 150, y + 30);
        groundGradient.addColorStop(0, '#654321');
        groundGradient.addColorStop(0.5, '#8B4513');
        groundGradient.addColorStop(1, '#654321');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(x - 150, y, 300, 30);
        
        // 草を描画
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        for (let i = -140; i < 140; i += 10) {
            ctx.beginPath();
            ctx.moveTo(x + i, y);
            ctx.lineTo(x + i + 3, y - 8);
            ctx.stroke();
        }
        
        // 木を描画
        if (displayLevel === 0) {
            // 種
            this.drawSeed(ctx, x, y);
        } else if (displayLevel <= 10) {
            // 苗木
            this.drawLargeSprout(ctx, x, y, displayLevel);
        } else if (displayLevel <= 30) {
            // 若木
            this.drawLargeYoungTree(ctx, x, y, displayLevel);
        } else {
            // 成木
            const allMastered = masteredCount === totalPractices;
            this.drawLargeMatureTree(ctx, x, y, displayLevel, masteredCount, allMastered);
        }
        
        // 曲名と全体レベル表示
        ctx.fillStyle = '#333';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(song.title, x, y + 40);
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`トータル Lv.${Math.floor(level)}`, x, y + 60);
        
        // マスター進捗表示
        if (masteredCount > 0) {
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(`★ ${masteredCount}/${totalPractices} マスター`, x, y + 80);
        }
    }
    
    drawPracticeLabels(ctx, song, baseY) {
        // 練習項目のリストを小さく表示
        ctx.fillStyle = '#666';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        
        const startX = 20;
        let currentY = baseY + 140;
        
        song.practices.forEach((practice, index) => {
            const status = practice.isCompleted ? '★' : '○';
            const color = practice.isCompleted ? '#ffd700' : '#666';
            ctx.fillStyle = color;
            ctx.fillText(`${status} ${practice.title} (Lv.${Math.floor(practice.level)})`, startX, currentY);
            currentY += 18;
        });
    }
    
    drawLargeSprout(ctx, x, y, level) {
        // 壮大な苗木
        const height = 50 + level * 8;
        
        // 影を描画
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(x, y + 5, 30, 10, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        
        // 幹のグラデーション
        const trunkGradient = ctx.createLinearGradient(x - 5, y, x + 5, y);
        trunkGradient.addColorStop(0, '#7CB87C');
        trunkGradient.addColorStop(0.5, '#90EE90');
        trunkGradient.addColorStop(1, '#7CB87C');
        
        ctx.strokeStyle = trunkGradient;
        ctx.lineWidth = 5 + level;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - height);
        ctx.stroke();
        
        // 複数の大きな葉
        const leafGradient = ctx.createRadialGradient(x, y - height, 0, x, y - height, 25);
        leafGradient.addColorStop(0, '#3CB371');
        leafGradient.addColorStop(1, '#228B22');
        ctx.fillStyle = leafGradient;
        
        const leafSize = 20 + level * 2;
        // 左の葉
        ctx.beginPath();
        ctx.ellipse(x - leafSize, y - height, leafSize, leafSize * 0.8, -0.5, 0, 2 * Math.PI);
        ctx.fill();
        // 右の葉
        ctx.beginPath();
        ctx.ellipse(x + leafSize, y - height, leafSize, leafSize * 0.8, 0.5, 0, 2 * Math.PI);
        ctx.fill();
        // 中央の葉
        ctx.beginPath();
        ctx.ellipse(x, y - height - 10, leafSize * 0.8, leafSize * 0.6, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    drawLargeYoungTree(ctx, x, y, level) {
        const trunkHeight = 120 + (level - 10) * 6;
        const trunkWidth = 15 + (level - 10) / 3;
        
        // 影
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(x, y + 10, 60, 20, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        
        // 幹のグラデーション
        const trunkGradient = ctx.createLinearGradient(x - trunkWidth/2, y, x + trunkWidth/2, y);
        trunkGradient.addColorStop(0, '#654321');
        trunkGradient.addColorStop(0.3, '#8B4513');
        trunkGradient.addColorStop(0.7, '#8B4513');
        trunkGradient.addColorStop(1, '#654321');
        
        ctx.fillStyle = trunkGradient;
        ctx.fillRect(x - trunkWidth/2, y - trunkHeight, trunkWidth, trunkHeight);
        
        // 枝を複数描画
        ctx.strokeStyle = '#654321';
        const branches = [
            { y: 0.3, x: -50, angle: -0.4, width: 5 },
            { y: 0.35, x: 50, angle: 0.4, width: 5 },
            { y: 0.5, x: -45, angle: -0.5, width: 4 },
            { y: 0.55, x: 45, angle: 0.5, width: 4 },
            { y: 0.7, x: -40, angle: -0.3, width: 3 },
            { y: 0.75, x: 40, angle: 0.3, width: 3 }
        ];
        
        branches.forEach(branch => {
            if (level >= 15 || branch.y < 0.6) {
                ctx.lineWidth = branch.width;
                ctx.beginPath();
                ctx.moveTo(x, y - trunkHeight * branch.y);
                const endX = x + branch.x;
                const endY = y - trunkHeight * branch.y - Math.abs(branch.x) * 0.3;
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        });
        
        // 葉の塊を複数グラデーションで描画
        const leafRadius = 40 + (level - 10) * 1.5;
        
        const leafPositions = [
            { x: 0, y: -trunkHeight - 20, radius: leafRadius },
            { x: -45, y: -trunkHeight * 0.7, radius: leafRadius * 0.8 },
            { x: 45, y: -trunkHeight * 0.7, radius: leafRadius * 0.8 },
            { x: -40, y: -trunkHeight * 0.5, radius: leafRadius * 0.7 },
            { x: 40, y: -trunkHeight * 0.5, radius: leafRadius * 0.7 }
        ];
        
        leafPositions.forEach(leaf => {
            const leafGradient = ctx.createRadialGradient(
                x + leaf.x, y + leaf.y, 0,
                x + leaf.x, y + leaf.y, leaf.radius
            );
            leafGradient.addColorStop(0, '#3CB371');
            leafGradient.addColorStop(0.7, '#228B22');
            leafGradient.addColorStop(1, '#1F6B1F');
            
            ctx.fillStyle = leafGradient;
            ctx.beginPath();
            ctx.arc(x + leaf.x, y + leaf.y, leaf.radius, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    drawLargeMatureTree(ctx, x, y, level, masteredCount, allMastered) {
        const trunkHeight = 350;
        const trunkWidth = 40;
        
        // 影を描画
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(x, y + 15, 120, 40, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        
        // 根元を太く
        const rootGradient = ctx.createLinearGradient(x - trunkWidth, y, x + trunkWidth, y);
        rootGradient.addColorStop(0, '#4a3520');
        rootGradient.addColorStop(0.3, '#654321');
        rootGradient.addColorStop(0.7, '#654321');
        rootGradient.addColorStop(1, '#4a3520');
        
        // 根を描画
        ctx.fillStyle = rootGradient;
        ctx.beginPath();
        ctx.moveTo(x - trunkWidth * 1.5, y);
        ctx.lineTo(x - trunkWidth/2, y - 30);
        ctx.lineTo(x + trunkWidth/2, y - 30);
        ctx.lineTo(x + trunkWidth * 1.5, y);
        ctx.closePath();
        ctx.fill();
        
        // 幹のグラデーション
        const trunkGradient = ctx.createLinearGradient(x - trunkWidth/2, y, x + trunkWidth/2, y);
        trunkGradient.addColorStop(0, '#4a3520');
        trunkGradient.addColorStop(0.2, '#654321');
        trunkGradient.addColorStop(0.8, '#654321');
        trunkGradient.addColorStop(1, '#4a3520');
        
        ctx.fillStyle = trunkGradient;
        ctx.fillRect(x - trunkWidth/2, y - trunkHeight, trunkWidth, trunkHeight);
        
        // 幹のテクスチャ（縦の筋）
        ctx.strokeStyle = '#3a2515';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const offset = (i - 4) * 5;
            ctx.beginPath();
            ctx.moveTo(x + offset, y - trunkHeight);
            ctx.bezierCurveTo(
                x + offset + Math.sin(i) * 3, y - trunkHeight * 0.7,
                x + offset - Math.sin(i) * 3, y - trunkHeight * 0.3,
                x + offset, y
            );
            ctx.stroke();
        }
        
        // 大きな枝
        this.drawComplexBranches(ctx, x, y, trunkHeight);
        
        // 豊かな葉
        this.drawComplexFoliage(ctx, x, y, trunkHeight, level);
        
        // 花（レベルが高い場合）
        if (level >= 40) {
            this.drawFlowers(ctx, x, y - trunkHeight + 100);
        }
        
        // 金色の実（マスターした練習項目の数だけ）
        if (masteredCount > 0) {
            this.drawGoldenFruits(ctx, x, y - trunkHeight + 100, masteredCount);
        }
        
        // 通常の実（レベルに応じて）
        if (level >= 50) {
            const normalFruitCount = Math.floor((level - 40) / 10);
            this.drawNormalFruits(ctx, x, y - trunkHeight + 100, normalFruitCount);
        }
    }
    
    drawComplexBranches(ctx, x, y, trunkHeight) {
        // 複雑な枝構造
        const branches = [
            { start: 0.2, angle: -0.8, length: 100, width: 15 },
            { start: 0.25, angle: 0.8, length: 100, width: 15 },
            { start: 0.35, angle: -0.6, length: 90, width: 12 },
            { start: 0.4, angle: 0.6, length: 90, width: 12 },
            { start: 0.5, angle: -0.7, length: 80, width: 10 },
            { start: 0.55, angle: 0.7, length: 80, width: 10 },
            { start: 0.65, angle: -0.5, length: 70, width: 8 },
            { start: 0.7, angle: 0.5, length: 70, width: 8 },
            { start: 0.8, angle: -0.4, length: 60, width: 6 },
            { start: 0.85, angle: 0.4, length: 60, width: 6 }
        ];
        
        branches.forEach(branch => {
            const startY = y - trunkHeight * (1 - branch.start);
            
            // 枝のグラデーション
            const branchGradient = ctx.createLinearGradient(
                x, startY,
                x + Math.sin(branch.angle) * branch.length,
                startY - Math.cos(branch.angle) * branch.length
            );
            branchGradient.addColorStop(0, '#654321');
            branchGradient.addColorStop(1, '#8B4513');
            
            ctx.strokeStyle = branchGradient;
            ctx.lineWidth = branch.width;
            ctx.lineCap = 'round';
            
            // メインの枝
            ctx.beginPath();
            ctx.moveTo(x, startY);
            const cp1x = x + Math.sin(branch.angle) * branch.length * 0.3;
            const cp1y = startY - 20;
            const cp2x = x + Math.sin(branch.angle) * branch.length * 0.7;
            const cp2y = startY - Math.cos(branch.angle) * branch.length * 0.7;
            const endX = x + Math.sin(branch.angle) * branch.length;
            const endY = startY - Math.cos(branch.angle) * branch.length;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
            ctx.stroke();
            
            // 小枝を複数追加
            for (let i = 0.3; i < 0.9; i += 0.2) {
                const subX = x + Math.sin(branch.angle) * branch.length * i;
                const subY = startY - Math.cos(branch.angle) * branch.length * i;
                const subAngle = branch.angle + (Math.random() - 0.5) * 0.5;
                const subLength = branch.length * 0.3;
                
                ctx.lineWidth = branch.width * 0.3;
                ctx.beginPath();
                ctx.moveTo(subX, subY);
                ctx.lineTo(
                    subX + Math.sin(subAngle) * subLength,
                    subY - Math.cos(subAngle) * subLength
                );
                ctx.stroke();
            }
        });
    }
    
    drawComplexFoliage(ctx, x, y, trunkHeight, level) {
        // 葉の塊を大きく豪華に
        const foliageGroups = [
            { x: 0, y: -trunkHeight - 40, radius: 80, depth: 0 },
            { x: -70, y: -trunkHeight + 50, radius: 70, depth: 1 },
            { x: 70, y: -trunkHeight + 50, radius: 70, depth: 1 },
            { x: -100, y: -trunkHeight + 120, radius: 65, depth: 2 },
            { x: 100, y: -trunkHeight + 120, radius: 65, depth: 2 },
            { x: -50, y: -trunkHeight + 20, radius: 60, depth: 1 },
            { x: 50, y: -trunkHeight + 20, radius: 60, depth: 1 },
            { x: 0, y: -trunkHeight + 80, radius: 75, depth: 0 },
            { x: -80, y: -trunkHeight + 180, radius: 55, depth: 2 },
            { x: 80, y: -trunkHeight + 180, radius: 55, depth: 2 },
            { x: -30, y: -trunkHeight - 10, radius: 50, depth: 1 },
            { x: 30, y: -trunkHeight - 10, radius: 50, depth: 1 }
        ];
        
        // レベルに応じて葉の量を調整
        const foliageCount = Math.min(foliageGroups.length, 6 + Math.floor(level / 8));
        
        // 深度別にソートして奥から描画
        const sortedGroups = foliageGroups.slice(0, foliageCount).sort((a, b) => b.depth - a.depth);
        
        sortedGroups.forEach(group => {
            // グラデーションで立体感を出す
            const foliageGradient = ctx.createRadialGradient(
                x + group.x - group.radius * 0.3, 
                y + group.y - group.radius * 0.3, 
                0,
                x + group.x, 
                y + group.y, 
                group.radius
            );
            
            // 深度によって色を調整
            const brightness = 1 - (group.depth * 0.15);
            const lightColor = `rgb(${Math.floor(92 * brightness)}, ${Math.floor(179 * brightness)}, ${Math.floor(113 * brightness)})`;
            const darkColor = `rgb(${Math.floor(34 * brightness)}, ${Math.floor(139 * brightness)}, ${Math.floor(34 * brightness)})`;
            
            foliageGradient.addColorStop(0, lightColor);
            foliageGradient.addColorStop(0.7, darkColor);
            foliageGradient.addColorStop(1, `rgb(${Math.floor(31 * brightness)}, ${Math.floor(107 * brightness)}, ${Math.floor(31 * brightness)})`);
            
            ctx.fillStyle = foliageGradient;
            
            // 不規則な形でより自然に
            ctx.beginPath();
            for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                const variation = 1 + Math.sin(angle * 3 + group.x) * 0.1 + Math.cos(angle * 5) * 0.05;
                const r = group.radius * variation;
                const px = x + group.x + Math.cos(angle) * r;
                const py = y + group.y + Math.sin(angle) * r;
                if (angle === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();
            ctx.fill();
            
            // ハイライトを追加
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#90EE90';
            ctx.beginPath();
            ctx.arc(x + group.x - group.radius * 0.3, y + group.y - group.radius * 0.3, group.radius * 0.4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        });
    }
    
    drawGoldenFruits(ctx, x, y, count) {
        const positions = [
            {x: -40, y: 20}, {x: 40, y: 25}, {x: 0, y: -10},
            {x: -25, y: 40}, {x: 25, y: 15}, {x: -45, y: 5},
            {x: 45, y: 35}, {x: -15, y: 25}, {x: 15, y: 45}
        ];
        
        // 新しい実の追加アニメーション
        if (this.newFruitAnimation && count > 0) {
            // 既存の実を描画
            for (let i = 0; i < count - 1; i++) {
                const pos = positions[i];
                this.drawSingleGoldenFruit(ctx, x + pos.x, y + pos.y);
            }
            
            // 新しい実をアニメーション付きで描画
            if (count <= positions.length) {
                const newPos = positions[count - 1];
                const progress = this.newFruitAnimation.progress;
                const scale = progress;
                const opacity = progress;
                
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.translate(x + newPos.x, y + newPos.y);
                ctx.scale(scale, scale);
                
                // 金色の実
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(0, 0, 6, 0, 2 * Math.PI);
                ctx.fill();
                
                // キラキラエフェクト
                if (progress > 0.5) {
                    const sparkleProgress = (progress - 0.5) * 2;
                    ctx.fillStyle = `rgba(255, 255, 255, ${1 - sparkleProgress})`;
                    ctx.beginPath();
                    ctx.arc(0, 0, 10 * sparkleProgress, 0, 2 * Math.PI);
                    ctx.fill();
                }
                
                ctx.restore();
            }
            return;
        }
        
        // 収穫アニメーション中の特別な描画
        if (this.harvestAnimating) {
            for (let i = 0; i < Math.min(count, positions.length); i++) {
                const pos = positions[i];
                
                if (this.harvestType === 'single' && i === count - 1) {
                    // 最後の実（最新のマスター）をアニメーション
                    const animProgress = this.harvestAnimationProgress;
                    const fallY = pos.y + (animProgress * 80);
                    const size = 6 + animProgress * 3;
                    const opacity = Math.max(0, 1 - animProgress * 0.5);
                    
                    ctx.save();
                    ctx.globalAlpha = opacity;
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(x + pos.x, y + fallY, size, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.restore();
                } else if (this.harvestType === 'grand') {
                    // 大収穫祭 - 全ての実が落ちる
                    const animProgress = this.harvestAnimationProgress;
                    const fallY = pos.y + (animProgress * 100) + (i * 10);
                    const rotation = animProgress * Math.PI * 2;
                    const size = 6 + animProgress * 2;
                    
                    ctx.save();
                    ctx.translate(x + pos.x, y + fallY);
                    ctx.rotate(rotation);
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(0, 0, size, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.restore();
                } else {
                    // 通常の金色の実
                    this.drawSingleGoldenFruit(ctx, x + pos.x, y + pos.y);
                }
            }
        } else {
            // 通常時
            for (let i = 0; i < Math.min(count, positions.length); i++) {
                const pos = positions[i];
                this.drawSingleGoldenFruit(ctx, x + pos.x, y + pos.y);
            }
        }
    }
    
    drawSingleGoldenFruit(ctx, x, y) {
        // 金色の実
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // 光沢
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(x - 2, y - 2, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // 星のエフェクト
        ctx.fillStyle = '#FFF';
        ctx.font = '8px sans-serif';
        ctx.fillText('★', x - 3, y + 3);
    }
    
    drawNormalFruits(ctx, x, y, count) {
        const positions = [
            {x: -50, y: 60}, {x: 50, y: 55}, {x: 10, y: 65},
            {x: -10, y: 70}, {x: 35, y: 65}, {x: -35, y: 70}
        ];
        
        for (let i = 0; i < Math.min(count, positions.length); i++) {
            const pos = positions[i];
            
            // 通常の実（赤みがかった色）
            ctx.fillStyle = '#FF6347';
            ctx.beginPath();
            ctx.arc(x + pos.x, y + pos.y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // 光沢
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(x + pos.x - 1, y + pos.y - 1, 1.5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    
    calculateGrowthStage(level) {
        if (level === 0) return 'seed';
        if (level <= 2) return 'sprout';
        if (level <= 5) return 'sapling';
        if (level <= 8) return 'young_trunk';
        if (level <= 11) return 'first_branch';
        if (level <= 15) return 'multi_branch';
        if (level <= 20) return 'leafy';
        if (level <= 25) return 'flowering';
        if (level <= 30) return 'first_fruit';
        return 'fruitful';
    }
    
    drawSeed(ctx, x, y) {
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(x, y - 5, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    drawSprout(ctx, x, y, level) {
        // 茎
        ctx.strokeStyle = '#90EE90';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 10 - level * 3);
        ctx.stroke();
        
        // 葉
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.ellipse(x - 5, y - 10 - level * 3, 5, 3, -0.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + 5, y - 10 - level * 3, 5, 3, 0.5, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    drawYoungTree(ctx, x, y, level) {
        const trunkHeight = 30 + (level - 6) * 5;
        
        // 幹
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 3, y - trunkHeight, 6, trunkHeight);
        
        // 枝
        if (level >= 9) {
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y - trunkHeight + 20);
            ctx.lineTo(x - 15, y - trunkHeight + 10);
            ctx.stroke();
            
            if (level >= 12) {
                ctx.beginPath();
                ctx.moveTo(x, y - trunkHeight + 15);
                ctx.lineTo(x + 15, y - trunkHeight + 5);
                ctx.stroke();
            }
        }
        
        // 葉っぱ
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x, y - trunkHeight, 15, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    drawMatureTree(ctx, x, y, level, isCompleted) {
        const trunkHeight = 80;
        
        // 幹
        ctx.fillStyle = '#654321';
        ctx.fillRect(x - 5, y - trunkHeight, 10, trunkHeight);
        
        // 枝と葉
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(x - 20, y - trunkHeight + 20, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 20, y - trunkHeight + 20, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y - trunkHeight, 25, 0, 2 * Math.PI);
        ctx.fill();
        
        // 花（レベル21-25）
        if (level >= 21 && level <= 25) {
            this.drawFlowers(ctx, x, y - trunkHeight);
        }
        
        // 実を描画（レベル26以降）
        if (level >= 26) {
            const fruitCount = Math.floor((level - 25) / 5) * 2 + 1;
            this.drawFruits(ctx, x, y - trunkHeight, fruitCount, isCompleted);
        }
    }
    
    drawFlowers(ctx, x, y) {
        // より多くの花を大きく描画
        const flowerPositions = [
            {x: -30, y: 20}, {x: 30, y: 15}, {x: 0, y: 0},
            {x: -45, y: 40}, {x: 45, y: 35}, {x: -15, y: 30},
            {x: 15, y: 25}, {x: -25, y: 10}, {x: 25, y: 45}
        ];
        
        flowerPositions.forEach(pos => {
            // 花びら
            ctx.fillStyle = '#FFB6C1';
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * 2 * Math.PI;
                const petalX = x + pos.x + Math.cos(angle) * 8;
                const petalY = y + pos.y + Math.sin(angle) * 8;
                ctx.beginPath();
                ctx.arc(petalX, petalY, 4, 0, 2 * Math.PI);
                ctx.fill();
            }
            // 花の中心
            ctx.fillStyle = '#FFFF99';
            ctx.beginPath();
            ctx.arc(x + pos.x, y + pos.y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    drawFruits(ctx, x, y, count, isCompleted) {
        const positions = [
            {x: -15, y: 10}, {x: 15, y: 15}, {x: 0, y: 5},
            {x: -10, y: 20}, {x: 10, y: 8}, {x: -5, y: 12},
            {x: 5, y: 18}, {x: -18, y: 5}, {x: 18, y: 10}
        ];
        
        // アニメーション中は実を描画しない（または特別な描画）
        if (this.harvestAnimating && this.harvestPracticeId === this.findPracticeIdByTreeData(x, y)) {
            // アニメーション中の実を描画
            for (let i = 0; i < Math.min(count, positions.length); i++) {
                const pos = positions[i];
                const animProgress = this.harvestAnimationProgress || 0;
                
                // 落下する実
                const fallY = pos.y + (animProgress * 100);
                const opacity = Math.max(0, 1 - animProgress);
                
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(x + pos.x, y + fallY, 4 + animProgress * 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.restore();
            }
            return;
        }
        
        for (let i = 0; i < Math.min(count, positions.length); i++) {
            const pos = positions[i];
            // 実の色（成熟度で変化）
            if (isCompleted) {
                ctx.fillStyle = '#FFD700'; // 金色
            } else if (i < count / 3) {
                ctx.fillStyle = '#90EE90'; // 緑
            } else if (i < count * 2 / 3) {
                ctx.fillStyle = '#FFD700'; // 黄
            } else {
                ctx.fillStyle = '#FF6347'; // 赤
            }
            
            ctx.beginPath();
            ctx.arc(x + pos.x, y + pos.y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // 実の光沢
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(x + pos.x - 1, y + pos.y - 1, 1.5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    showEvaluationScreen(practiceId) {
        this.currentPracticeId = practiceId;
        const song = this.data.songs[this.currentSongId];
        const practice = song.practices.find(p => p.id === practiceId);
        
        document.getElementById('practice-title').textContent = practice.title;
        document.getElementById('current-level').textContent = Math.floor(practice.level);
        this.selectedLevel = 0;
        this.selectedAttitude = 0;
        
        // レベル内訳を表示
        this.updateLevelBreakdown(practice);
        
        // トータル練習時間を表示
        const totalMinutes = Math.floor(practice.practiceTime / 60);
        document.getElementById('total-practice-time').textContent = totalMinutes;
        
        // タイマーをリセット
        this.resetTimer();
        
        this.hideAllScreens();
        document.getElementById('evaluation-screen').classList.add('active');
        this.setupLevelOptions();
        this.setupAttitudeOptions();
        this.renderCheckPoints();
    }

    setupLevelOptions() {
        const options = document.querySelectorAll('.level-option');
        options.forEach(option => {
            option.classList.remove('selected');
            const handler = option._clickHandler;
            if (handler) {
                option.removeEventListener('click', handler);
            }
            option._clickHandler = (e) => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedLevel = parseInt(option.dataset.level);
            };
            option.addEventListener('click', option._clickHandler);
        });
    }
    
    setupAttitudeOptions() {
        const options = document.querySelectorAll('.attitude-option');
        options.forEach(option => {
            option.classList.remove('selected');
            const handler = option._clickHandler;
            if (handler) {
                option.removeEventListener('click', handler);
            }
            option._clickHandler = (e) => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedAttitude = parseInt(option.dataset.attitude);
            };
            option.addEventListener('click', option._clickHandler);
        });
    }
    
    updateLevelBreakdown(practice) {
        const breakdown = practice.levelBreakdown || { timePoints: 0, performancePoints: 0, attitudePoints: 0 };
        document.getElementById('time-points').textContent = `${breakdown.timePoints}pt`;
        document.getElementById('performance-points').textContent = `${breakdown.performancePoints}pt`;
        document.getElementById('attitude-points').textContent = `${breakdown.attitudePoints}pt`;
    }

    showSettingsScreen() {
        document.getElementById('gemini-api-key').value = this.settings.geminiApiKey;
        document.getElementById('elevenlabs-api-key').value = this.settings.elevenLabsApiKey;
        document.getElementById('openai-api-key').value = this.settings.openaiApiKey;
        
        this.hideAllScreens();
        document.getElementById('settings-screen').classList.add('active');
    }
    
    showCollectionScreen() {
        this.hideAllScreens();
        document.getElementById('collection-screen').classList.add('active');
        this.renderCollection();
    }
    
    renderCollection() {
        const grid = document.getElementById('collection-grid');
        grid.innerHTML = '';
        
        const collectionCount = Object.keys(this.characterCollection).length;
        document.getElementById('collection-count').textContent = collectionCount;
        
        // キャラクターを日付順にソート
        const sortedCharacters = Object.entries(this.characterCollection)
            .sort((a, b) => new Date(b[1].date) - new Date(a[1].date));
        
        sortedCharacters.forEach(([id, character]) => {
            const card = document.createElement('div');
            card.className = 'collection-card';
            card.onclick = () => this.showCharacterDetail(id);
            
            const imageHtml = character.imageUrl 
                ? `<img src="${character.imageUrl}" alt="${character.name}">` 
                : `<div class="placeholder-image">🎵</div>`;
            
            card.innerHTML = `
                <div class="collection-image">
                    ${imageHtml}
                </div>
                <h4>${character.name}</h4>
                <p class="collection-species">${character.species}</p>
                <p class="collection-rarity">${character.rarity}</p>
                <span class="new-badge" style="display: ${this.isNewCharacter(id) ? 'block' : 'none'};">NEW!</span>
            `;
            
            grid.appendChild(card);
        });
        
        // 未発見キャラクターのヒント
        if (collectionCount < 10) {
            const hint = document.createElement('div');
            hint.className = 'collection-card locked';
            hint.innerHTML = `
                <div class="collection-image">
                    <div class="placeholder-image">🔒</div>
                </div>
                <h4>???</h4>
                <p class="collection-hint">もっとレベルをあげてみよう！</p>
            `;
            grid.appendChild(hint);
        }
    }
    
    isNewCharacter(characterId) {
        const viewedCharacters = JSON.parse(localStorage.getItem('viewedCharacters') || '[]');
        return !viewedCharacters.includes(characterId);
    }
    
    showCharacterDetail(characterId) {
        const character = this.characterCollection[characterId];
        if (!character) return;
        
        // 既読マーク
        const viewedCharacters = JSON.parse(localStorage.getItem('viewedCharacters') || '[]');
        if (!viewedCharacters.includes(characterId)) {
            viewedCharacters.push(characterId);
            localStorage.setItem('viewedCharacters', JSON.stringify(viewedCharacters));
        }
        
        // 詳細情報を表示
        document.getElementById('detail-name').textContent = character.name;
        document.getElementById('detail-species').textContent = character.species;
        document.getElementById('detail-date').textContent = character.date;
        document.getElementById('detail-rarity').textContent = character.rarity;
        document.getElementById('detail-ability').textContent = character.ability;
        document.getElementById('detail-catchphrase').textContent = character.catchphrase;
        document.getElementById('detail-message').textContent = character.message || 'メッセージなし';
        
        const detailImage = document.getElementById('detail-image');
        if (character.imageUrl) {
            detailImage.innerHTML = `<img src="${character.imageUrl}" alt="${character.name}">`;
        } else {
            detailImage.innerHTML = `<div class="placeholder-image large">🎵</div>`;
        }
        
        this.currentDetailCharacter = character;
        document.getElementById('character-detail-modal').classList.add('active');
    }
    
    closeCharacterDetail() {
        document.getElementById('character-detail-modal').classList.remove('active');
        this.renderCollection(); // NEW!バッジを更新
    }
    
    playCharacterVoice() {
        // キャラクターの声を再生（今後実装予定）
        if (this.currentDetailCharacter && this.currentDetailCharacter.audioUrl) {
            const audio = new Audio(this.currentDetailCharacter.audioUrl);
            audio.play();
        }
    }

    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    saveEvaluation() {
        const song = this.data.songs[this.currentSongId];
        const practice = song.practices.find(p => p.id === this.currentPracticeId);
        const oldLevel = practice.level;
        
        // タイマーが動いている場合は停止
        if (this.timerRunning) {
            this.stopTimer();
        }
        
        const practiceSeconds = this.timerSeconds;
        const practiceMinutes = Math.floor(practiceSeconds / 60);
        
        // ポイント計算（全体的に抑えめに調整）
        const timePoints = Math.floor(practiceMinutes / 2); // 2分ごとに1ポイント
        
        // 出来栄えポイント（間違えないでできたを高めに）
        const performanceMap = {
            0: 0,   // やるまえ
            3: 2,   // がんばりちゅう
            6: 4,   // まちがえるけどできてきた
            9: 8,   // まちがえないでできた（2番目に高い）
            10: 10  // マスター
        };
        const performancePoints = performanceMap[this.selectedLevel] || 0;
        
        // 取り組み姿勢ポイント（自分で考えて改善を最高に）
        const attitudeMap = {
            0: 0,   // 未選択
            1: 1,   // あまりしゅうちゅうできなかった
            2: 3,   // おやにいわれてがんばれた
            3: 10   // じぶんでかんがえてかいぜんできた（最高ポイント）
        };
        const attitudePoints = attitudeMap[this.selectedAttitude] || 0;
        
        // レベル内訳を保存
        if (!practice.levelBreakdown) {
            practice.levelBreakdown = { timePoints: 0, performancePoints: 0, attitudePoints: 0 };
        }
        
        // 累積時間ポイントを計算（2分ごとに1ポイント）
        const totalTimePoints = Math.floor((practice.practiceTime + practiceSeconds) / 120);
        
        // ポイントを累積
        practice.levelBreakdown.timePoints = totalTimePoints;
        practice.levelBreakdown.performancePoints = (practice.levelBreakdown.performancePoints || 0) + performancePoints;
        practice.levelBreakdown.attitudePoints = (practice.levelBreakdown.attitudePoints || 0) + attitudePoints;
        
        // 新しいレベルを計算
        const newLevel = practice.levelBreakdown.timePoints + practice.levelBreakdown.performancePoints + practice.levelBreakdown.attitudePoints;
        
        practice.level = newLevel;
        practice.practiceTime += practiceSeconds;
        practice.lastPracticed = new Date().toISOString();
        
        // マスター評価の場合は完了フラグを立てる
        if (this.selectedLevel === 10) {
            practice.isCompleted = true;
            // スキルツリー表示の場合は収穫アニメーションを後で開始
            this.shouldShowHarvestAnimation = this.currentView === 'tree';
        }
        
        this.saveData();
        
        // アニメーションをキューに追加
        if (newLevel > oldLevel) {
            this.addToAnimationQueue({
                type: 'growth',
                songId: this.currentSongId,
                fromLevel: oldLevel,
                toLevel: newLevel
            });
        }
        
        if (this.selectedLevel === 10) {
            this.addToAnimationQueue({
                type: 'fruitAdd',
                songId: this.currentSongId,
                practiceId: practice.id,
                practiceTitle: practice.title
            });
        }
        
        if (newLevel > oldLevel || this.selectedLevel === 10) {
            this.showLevelUpModal(practice, Math.floor(oldLevel), Math.floor(newLevel));
        } else {
            this.showPracticeScreen();
        }
    }

    showLevelUpModal(practice, oldLevel, newLevel) {
        const modal = document.getElementById('level-up-modal');
        const message = document.getElementById('level-up-message');
        
        if (practice.isCompleted) {
            message.textContent = `${practice.title}を マスターしたよ！すごい！`;
        } else {
            message.textContent = `${practice.title}が レベル${oldLevel}から レベル${newLevel}に あがったよ！`;
        }
        
        modal.classList.add('active');
        
        // AI機能を実行（Vercel環境では常に実行）
        this.generateFantasyCharacter(practice, oldLevel, newLevel);
    }

    closeLevelUpModal() {
        document.getElementById('level-up-modal').classList.remove('active');
        
        // 収穫アニメーションが予約されている場合
        if (this.shouldShowHarvestAnimation) {
            this.shouldShowHarvestAnimation = false;
            this.showPracticeScreen();
            // スキルツリー表示に切り替えてアニメーションを開始
            setTimeout(() => {
                this.showSkillTreeView();
                setTimeout(() => {
                    const song = this.data.songs[this.currentSongId];
                    const practice = song.practices.find(p => p.id === this.currentPracticeId);
                    if (practice && practice.isCompleted) {
                        this.startSingleFruitHarvest(practice);
                    }
                }, 500);
            }, 100);
        } else {
            this.showPracticeScreen();
        }
    }

    async generateFantasyCharacter(practice, oldLevel, newLevel) {
        console.log('=== generateFantasyCharacter開始 ===');
        console.log('practice:', practice);
        console.log('oldLevel:', oldLevel, 'newLevel:', newLevel);
        
        try {
            // キャラクター情報を生成
            const characterData = await this.createCharacterConcept(practice, oldLevel, newLevel);
            
            // キャラクター情報を表示
            this.displayCharacterInfo(characterData);
            
            // Gemini APIでメッセージ生成
            try {
                const aiMessage = await this.generateAIMessage(characterData, practice, newLevel);
                if (aiMessage) {
                    document.getElementById('ai-message').textContent = aiMessage;
                    
                    // 11Labsで音声生成
                    try {
                        await this.generateVoice(aiMessage);
                    } catch (error) {
                        console.error('音声生成エラー:', error);
                    }
                } else {
                    console.warn('AIメッセージが生成されませんでした');
                    document.getElementById('ai-message').textContent = 'メッセージの生成に失敗しました';
                }
            } catch (error) {
                console.error('メッセージ生成エラー:', error);
                document.getElementById('ai-message').textContent = 'メッセージの生成に失敗しました';
            }
            
            // OpenAI DALL-Eでイラスト生成
            try {
                await this.generateCharacterImage(characterData);
            } catch (error) {
                console.error('画像生成エラー:', error);
                document.getElementById('character-image').innerHTML = '<div class="placeholder-image large">🎨</div>';
            }
            
            // キャラクターをコレクションに保存
            this.saveToCollection(characterData);
            
        } catch (error) {
            console.error('Character generation error:', error);
        }
    }
    
    async createCharacterConcept(practice, oldLevel, newLevel) {
        // CHARACTER_DATABASEから未取得のキャラクターをランダム選択
        const excludeIds = [...this.collectedCharacters];
        const selectedCharacter = this.selectRandomCharacter(excludeIds);
        
        if (!selectedCharacter) {
            // 全てのキャラクターが取得済みの場合は、任意のキャラクターを選択
            const allCharacters = [
                ...this.CHARACTER_DATABASE.common,
                ...this.CHARACTER_DATABASE.rare,
                ...this.CHARACTER_DATABASE.superRare,
                ...this.CHARACTER_DATABASE.legendary
            ];
            const randomIndex = Math.floor(Math.random() * allCharacters.length);
            const fallbackCharacter = allCharacters[randomIndex];
            
            return {
                ...fallbackCharacter,
                level: newLevel,
                date: new Date().toLocaleDateString('ja-JP'),
                isAlreadyCollected: true
            };
        }
        
        // 選択されたキャラクターを収集済みセットに追加
        this.collectedCharacters.add(selectedCharacter.id);
        
        // キャラクターデータを保存
        this.saveCharacterData();
        
        // 練習内容を分析
        const practiceAnalysis = this.analyzePractice(practice);
        
        // AIでキャッチフレーズと能力を生成
        const aiCatchphrase = await this.generateCatchphrase(selectedCharacter, practiceAnalysis);
        const aiAbility = await this.generateAbility(selectedCharacter, practiceAnalysis);
        
        return {
            ...selectedCharacter,
            level: newLevel,
            date: new Date().toLocaleDateString('ja-JP'),
            practiceContext: practiceAnalysis,
            isAlreadyCollected: false,
            dynamicCatchphrase: aiCatchphrase,
            dynamicAbility: aiAbility
        };
    }
    
    analyzePractice(practice) {
        const title = practice.title.toLowerCase();
        const description = practice.description.toLowerCase();
        
        let tempo = 'ふつう';
        let hands = 'かたて';
        let trait = '音楽の';
        
        // テンポ判定
        if (title.includes('ゆっくり') || description.includes('テンポ60')) {
            tempo = 'ゆっくり';
            trait = 'じかんをあやつる';
        } else if (title.includes('はやく') || description.includes('テンポ120')) {
            tempo = 'はやく';
            trait = 'いなずまの';
        }
        
        // 手の判定
        if (title.includes('りょうて')) {
            hands = 'りょうて';
            trait = 'ハーモニーをかなでる';
        } else if (title.includes('みぎて')) {
            hands = 'みぎて';
        } else if (title.includes('ひだりて')) {
            hands = 'ひだりて';
        }
        
        return { tempo, hands, trait, title: practice.title };
    }
    
    async generateCharacterName(analysis, creature) {
        try {
            // AI活用による動的キャラクター名生成
            const prompt = `練習情報に基づいて音楽的なキャラクター名を生成してください。

練習内容: ${analysis.title || '不明'}
特徴: ${analysis.trait || '不明'}
テンポ: ${analysis.tempo || '不明'}
手: ${analysis.hands || '不明'}
生き物: ${creature}

以下の条件でキャラクター名を1つだけ生成してください：
- 音楽用語（アンダンテ、アレグロ、メロディ、リズムなど）をベースにする
- 生き物の特徴を反映した可愛い語尾をつける
- カタカナ6文字以内
- 子供が覚えやすい響き

例：アンダンテガメ、メロディプルン、リズムピー

キャラクター名のみを回答してください。`;

            const response = await this.apiClient.generateText(prompt);
            
            if (response && response.trim()) {
                return response.trim();
            }
        } catch (error) {
            console.warn('AI character name generation failed:', error);
        }
        
        // フォールバック：従来の方式
        return this.generateFallbackCharacterName(analysis, creature);
    }

    generateFallbackCharacterName(analysis, creature) {
        const prefixes = {
            'ゆっくり': ['アンダンテ', 'レガート', 'ラルゴ'],
            'はやく': ['プレスト', 'アレグロ', 'ビバーチェ'],
            'りょうて': ['デュエット', 'ハーモニー', 'アンサンブル'],
            'ふつう': ['メロディ', 'リズム', 'ソナタ']
        };
        
        const suffixes = {
            'カメ': 'ガメ',
            'ウサギ': 'ンピョン',
            '蝶': 'ンボ',
            '竜': 'ゴン',
            'クラゲ': 'プルン',
            '鳥': 'ピー',
            'キノコ': 'シュルム',
            '花': 'フロール',
            '雲': 'モクモク',
            '星': 'キラリン',
            '結晶': 'クリスタ',
            'クワガタ': 'ガタロウ'
        };
        
        // より安全なフォールバック処理
        const defaultPrefixes = ['メロディ', 'リズム', 'ソナタ'];
        const availablePrefixes = prefixes[analysis.tempo] || prefixes['ふつう'] || defaultPrefixes;
        const selectedPrefix = availablePrefixes[Math.floor(Math.random() * availablePrefixes.length)];
        const suffix = suffixes[creature] || 'まる';
        
        return selectedPrefix + suffix;
    }
    
    async generateCatchphrase(character, analysis) {
        try {
            const prompt = `キャラクター情報と練習内容に基づいてキャッチフレーズを生成してください。

キャラクター：
名前: ${character.name}
種族: ${character.species}
属性: ${character.attribute}
性格: ${character.personality}

練習内容：
曲: ${analysis.title || '不明'}
特徴: ${analysis.trait || '不明'}
テンポ: ${analysis.tempo || '不明'}
手: ${analysis.hands || '不明'}

以下の条件でキャッチフレーズを1つ生成してください：
- キャラクターの性格と種族を反映
- 練習内容に関連した内容
- 子供向けで親しみやすい口調
- 30文字以内
- 語尾はキャラクターらしく

例：「メロディニャン♪ やさしい気持ちで弾くニャン」

キャッチフレーズのみを回答してください。`;

            const response = await this.apiClient.generateText(prompt);
            
            if (response && response.trim()) {
                return response.trim();
            }
        } catch (error) {
            console.warn('AI catchphrase generation failed:', error);
        }
        
        // フォールバック：従来の方式
        return this.generateFallbackCatchphrase(character, analysis);
    }

    generateFallbackCatchphrase(character, analysis) {
        const phrases = {
            'カメ': `のんびり♪ ${analysis.tempo}でコツコツやるガメ～`,
            'ウサギ': `ぴょんぴょん♪ ${analysis.hands}で跳ねるように弾くピョン！`,
            '蝶': `ひらひら♪ ${analysis.trait}で美しく舞うトンボ～`,
            'ネコ': `にゃーん♪ ${analysis.tempo}で気持ちよく弾くニャン`,
            'default': `${analysis.trait}で がんばるぞ～♪`
        };
        
        return phrases[character.species] || phrases['default'];
    }
    
    async generateAbility(character, analysis) {
        try {
            const prompt = `キャラクター情報と練習内容に基づいて特殊能力を生成してください。

キャラクター：
名前: ${character.name}
種族: ${character.species}
属性: ${character.attribute}
性格: ${character.personality}
既存能力: ${character.ability}

練習内容：
曲: ${analysis.title || '不明'}
特徴: ${analysis.trait || '不明'}
テンポ: ${analysis.tempo || '不明'}
手: ${analysis.hands || '不明'}

以下の条件で特殊能力を1つ生成してください：
- キャラクターの種族と属性を反映
- 練習内容に役立つ能力
- ファンタジックで楽しい名前
- 「○○の術」「○○マジック」などの形式
- 20文字以内

例：「メロディ記憶の術」「羽ばたきテンポ術」

能力名のみを回答してください。`;

            const response = await this.apiClient.generateText(prompt);
            
            if (response && response.trim()) {
                return response.trim();
            }
        } catch (error) {
            console.warn('AI ability generation failed:', error);
        }
        
        // フォールバック：従来の方式
        return this.generateFallbackAbility(character, analysis);
    }

    generateFallbackAbility(character, analysis) {
        const abilities = {
            'ゆっくり': '時間をスローにする「スローモーション音符」',
            'はやく': '指を軽くする「羽ばたき奏法」',
            'りょうて': '左右の手をシンクロさせる「鏡の術」',
            'メロディ': '美しい音色を奏でる「メロディ魔法」',
            'ハーモニー': '和音を響かせる「ハーモニー術」'
        };
        
        return abilities[analysis.tempo] || abilities[analysis.hands] || abilities[character.attribute] || '音楽の魔法';
    }
    
    calculateRarity(level, isCompleted) {
        if (isCompleted) return '★★★★'; // マスターは伝説
        if (level >= 20) return '★★★';
        if (level >= 10) return '★★';
        return '★';
    }
    
    displayCharacterInfo(characterData) {
        document.getElementById('character-name').textContent = characterData.name;
        document.getElementById('character-species').textContent = characterData.species;
        document.getElementById('character-catchphrase').textContent = `「${characterData.catchphrase}」`;
    }
    
    async generateAIMessage(characterData, practice, newLevel) {
        try {
            if (!window.apiClient) {
                console.error('API client not initialized');
                return '';
            }
            
            const prompt = `あなたは「${characterData.name}」というキャラクターです。
                            種族：${characterData.species}
                            口癖：${characterData.catchphrase}
                            
                            小学3年生の「ひなのちゃん」が「${practice.title}」の練習でレベル${newLevel}になりました。
                            ${practice.isCompleted ? 'マスター達成です！' : ''}
                            
                            キャラクターらしいユーモラスな口調で、ひなのちゃんを励ましてください。
                            次の練習のアドバイスも含めてください。
                            100文字以内で、子供にわかりやすく。`;
                            
            return await window.apiClient.generateMessage(prompt);
        } catch (error) {
            console.error('Gemini API error:', error);
            return '';
        }
    }
    
    async generateVoice(text) {
        try {
            if (!window.apiClient) {
                console.error('API client not initialized');
                return;
            }
            
            const audioDataUrl = await window.apiClient.generateVoice(text);
            this.currentAudio = new Audio(audioDataUrl);
            this.currentAudio.play();
            document.getElementById('play-audio-btn').style.display = 'block';
        } catch (error) {
            console.error('11Labs API error:', error);
        }
    }
    
    async generateCharacterImage(characterData) {
        try {
            // 絵文字ベースのキャラクター表示
            const characterImage = document.getElementById('character-image');
            
            // キャラクターの種類に基づいて絵文字を選択
            const emojiMap = {
                'カメ': '🐢',
                'チョウ': '🦋',
                'カエル': '🐸',
                'トリ': '🐦',
                'ウサギ': '🐰',
                'ネコ': '🐱',
                'イヌ': '🐕',
                'クマ': '🐻',
                'キツネ': '🦊',
                'リス': '🐿️',
                'ペンギン': '🐧',
                'フクロウ': '🦉',
                'ドラゴン': '🐉',
                'ユニコーン': '🦄',
                'フェアリー': '🧚',
                'ロボット': '🤖'
            };
            
            // 種族名から絵文字を取得
            let mainEmoji = '🎵'; // デフォルト
            for (const [key, emoji] of Object.entries(emojiMap)) {
                if (characterData.species.includes(key)) {
                    mainEmoji = emoji;
                    break;
                }
            }
            
            // 楽器や音楽要素の絵文字
            const musicEmojis = ['🎹', '🎵', '🎶', '🎼', '✨', '🌟', '💫'];
            const accentEmoji = musicEmojis[Math.floor(Math.random() * musicEmojis.length)];
            
            // 大きな絵文字でキャラクターを表示
            characterImage.innerHTML = `
                <div style="font-size: 120px; text-align: center; line-height: 1.2;">
                    ${mainEmoji}
                </div>
                <div style="font-size: 60px; text-align: center; margin-top: -20px;">
                    ${accentEmoji}
                </div>
            `;
            
            // コレクション用に絵文字を保存
            characterData.emojiDisplay = `${mainEmoji}${accentEmoji}`;
            
            // OpenAI APIを試す（オプション）
            if (window.apiClient && true) { // OpenAI APIを有効化
                try {
                    console.log('キャラクターデータ:', characterData);
                    
                    // 英語のプロンプトを生成（日本語を含まないように）
                    const speciesEnglish = this.translateSpeciesToEnglish(characterData.species);
                    // gpt-image-1は詳細なプロンプトに対応
                    const prompt = `A friendly cartoon ${speciesEnglish} character playing a grand piano in a magical forest setting. The character has a warm smile and wears a small musical note badge. Soft watercolor art style with pastel pink and blue colors. Child-friendly illustration.`;
                    
                    console.log('画像生成プロンプト:', prompt);
                    const imageUrl = await window.apiClient.generateImage(prompt);
                    characterImage.innerHTML = `<img src="${imageUrl}" alt="${characterData.name}" />`;
                    characterData.imageUrl = imageUrl;
                } catch (error) {
                    console.log('画像生成をスキップ、絵文字を使用');
                }
            }
        } catch (error) {
            console.error('Character display error:', error);
            document.getElementById('character-image').innerHTML = '<div class="placeholder-image large">🎨</div>';
        }
    }
    
    translateSpeciesToEnglish(species) {
        // 日本語の種族名を英語に翻訳
        const translations = {
            'カメ': 'turtle',
            'チョウ': 'butterfly',
            'カエル': 'frog',
            'トリ': 'bird',
            'ウサギ': 'rabbit',
            'ネコ': 'cat',
            'イヌ': 'dog',
            'クマ': 'bear',
            'キツネ': 'fox',
            'リス': 'squirrel',
            'ペンギン': 'penguin',
            'フクロウ': 'owl',
            'ドラゴン': 'dragon',
            'ユニコーン': 'unicorn',
            'フェアリー': 'fairy',
            'ロボット': 'robot'
        };
        
        // 種族名から英語を抽出
        for (const [jp, en] of Object.entries(translations)) {
            if (species.includes(jp)) {
                return en;
            }
        }
        
        // デフォルト
        return 'magical creature';
    }
    
    saveToCollection(characterData) {
        const characterId = `char_${Date.now()}`;
        this.characterCollection[characterId] = characterData;
        localStorage.setItem('characterCollection', JSON.stringify(this.characterCollection));
    }
    
    playAudioMessage() {
        if (this.currentAudio) {
            this.currentAudio.play();
        }
    }

    startTimer() {
        if (!this.timerRunning) {
            this.timerRunning = true;
            document.getElementById('timer-start').style.display = 'none';
            document.getElementById('timer-stop').style.display = 'flex';
            
            this.timerInterval = setInterval(() => {
                this.timerSeconds++;
                this.updateTimerDisplay();
            }, 1000);
        }
    }

    stopTimer() {
        if (this.timerRunning) {
            this.timerRunning = false;
            clearInterval(this.timerInterval);
            document.getElementById('timer-start').style.display = 'flex';
            document.getElementById('timer-stop').style.display = 'none';
        }
    }

    resetTimer() {
        this.stopTimer();
        this.timerSeconds = 0;
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer-display').textContent = display;
    }

    renderCheckPoints() {
        const song = this.data.songs[this.currentSongId];
        const practice = song.practices.find(p => p.id === this.currentPracticeId);
        const checkpointList = document.getElementById('checkpoint-list');
        checkpointList.innerHTML = '';
        
        if (!practice.checkPoints) {
            practice.checkPoints = [];
        }
        
        practice.checkPoints.forEach((checkpoint, index) => {
            const item = document.createElement('div');
            item.className = `checkpoint-item ${checkpoint.checked ? 'checked' : ''}`;
            item.innerHTML = `
                <input type="checkbox" id="check-${checkpoint.id}" ${checkpoint.checked ? 'checked' : ''}>
                <label for="check-${checkpoint.id}">${checkpoint.text}</label>
                <button class="delete-btn" onclick="app.deleteCheckPoint('${checkpoint.id}')">×</button>
            `;
            
            const checkbox = item.querySelector('input');
            checkbox.addEventListener('change', (e) => {
                checkpoint.checked = e.target.checked;
                item.classList.toggle('checked', e.target.checked);
                this.saveData();
            });
            
            checkpointList.appendChild(item);
        });
    }

    showAddCheckPointModal() {
        const modal = document.getElementById('add-checkpoint-modal');
        const select = document.getElementById('practice-select');
        select.innerHTML = '';
        
        const song = this.data.songs[this.currentSongId];
        song.practices.forEach(practice => {
            const option = document.createElement('option');
            option.value = practice.id;
            option.textContent = practice.title;
            select.appendChild(option);
        });
        
        // デフォルトで現在の練習を選択
        if (this.currentPracticeId) {
            select.value = this.currentPracticeId;
        }
        
        document.getElementById('checkpoint-text').value = '';
        modal.classList.add('active');
    }

    closeAddCheckPointModal() {
        document.getElementById('add-checkpoint-modal').classList.remove('active');
    }

    addCheckPoint() {
        const practiceId = document.getElementById('practice-select').value;
        const text = document.getElementById('checkpoint-text').value.trim();
        
        if (!text) return;
        
        const song = this.data.songs[this.currentSongId];
        const practice = song.practices.find(p => p.id === practiceId);
        
        if (!practice.checkPoints) {
            practice.checkPoints = [];
        }
        
        const newCheckPoint = {
            id: `cp_${Date.now()}`,
            text: text,
            checked: false
        };
        
        practice.checkPoints.push(newCheckPoint);
        this.saveData();
        this.closeAddCheckPointModal();
        
        // 現在の評価画面が該当の練習なら更新
        if (this.currentPracticeId === practiceId) {
            this.renderCheckPoints();
        }
    }

    deleteCheckPoint(checkpointId) {
        const song = this.data.songs[this.currentSongId];
        const practice = song.practices.find(p => p.id === this.currentPracticeId);
        
        if (practice.checkPoints) {
            practice.checkPoints = practice.checkPoints.filter(cp => cp.id !== checkpointId);
            this.saveData();
            this.renderCheckPoints();
        }
    }

    clearPracticeData() {
        if (!confirm('このれんしゅうのデータをすべてけします。よろしいですか？')) {
            return;
        }
        
        const song = this.data.songs[this.currentSongId];
        const practice = song.practices.find(p => p.id === this.currentPracticeId);
        
        // データをリセット
        practice.level = 0;
        practice.practiceTime = 0;
        practice.lastPracticed = null;
        practice.isCompleted = false;
        if (practice.levelBreakdown) {
            practice.levelBreakdown = {
                timePoints: 0,
                performancePoints: 0,
                attitudePoints: 0
            };
        }
        if (practice.checkPoints) {
            practice.checkPoints.forEach(cp => {
                cp.checked = false;
            });
        }
        
        this.saveData();
        this.showPracticeScreen();
    }

    reopenPractice(practiceId) {
        const song = this.data.songs[this.currentSongId];
        const practice = song.practices.find(p => p.id === practiceId);
        
        if (practice) {
            practice.isCompleted = false;
            this.saveData();
            this.renderPracticeList();
        }
    }

    showAddSongModal() {
        document.getElementById('new-song-title').value = '';
        document.getElementById('add-song-modal').classList.add('active');
    }

    closeAddSongModal() {
        document.getElementById('add-song-modal').classList.remove('active');
    }

    addSong() {
        const title = document.getElementById('new-song-title').value.trim();
        
        if (!title) return;
        
        const newSongId = `song_${Date.now()}`;
        const newSong = {
            id: newSongId,
            title: title,
            practices: []
        };
        
        this.data.songs[newSongId] = newSong;
        this.saveData();
        this.closeAddSongModal();
        this.renderSongList();
    }

    showAddPracticeModal() {
        document.getElementById('new-practice-title').value = '';
        document.getElementById('new-practice-description').value = '';
        document.getElementById('add-practice-modal').classList.add('active');
    }

    closeAddPracticeModal() {
        document.getElementById('add-practice-modal').classList.remove('active');
    }

    addPractice() {
        const title = document.getElementById('new-practice-title').value.trim();
        const description = document.getElementById('new-practice-description').value.trim();
        
        if (!title) return;
        
        const song = this.data.songs[this.currentSongId];
        const newPractice = {
            id: `practice_${Date.now()}`,
            title: title,
            description: description || '',
            level: 0,
            isCompleted: false,
            levelBreakdown: {
                timePoints: 0,
                performancePoints: 0,
                attitudePoints: 0
            },
            practiceTime: 0,
            lastPracticed: null,
            checkPoints: []
        };
        
        song.practices.push(newPractice);
        this.saveData();
        this.closeAddPracticeModal();
        if (this.currentView === 'list') {
            this.renderPracticeList();
        } else {
            this.renderSkillTree();
        }
    }

    deleteSong(songId) {
        const song = this.data.songs[songId];
        if (!song) return;
        
        const practiceCount = song.practices.length;
        const message = practiceCount > 0 
            ? `「${song.title}」をけしますか？\n${practiceCount}このれんしゅうこうもくもけされます。`
            : `「${song.title}」をけしますか？`;
            
        if (confirm(message)) {
            delete this.data.songs[songId];
            this.saveData();
            this.renderSongList();
        }
    }

    deletePractice(practiceId) {
        const song = this.data.songs[this.currentSongId];
        const practice = song.practices.find(p => p.id === practiceId);
        
        if (!practice) return;
        
        if (confirm(`「${practice.title}」をけしますか？\nレベル${Math.floor(practice.level)}のきろくもけされます。`)) {
            song.practices = song.practices.filter(p => p.id !== practiceId);
            this.saveData();
            if (this.currentView === 'list') {
                this.renderPracticeList();
            } else {
                this.renderSkillTree();
            }
        }
    }

    showEditPracticeModal(practiceId) {
        const song = this.data.songs[this.currentSongId];
        const practice = song.practices.find(p => p.id === practiceId);
        
        if (!practice) return;
        
        this.editingPracticeId = practiceId;
        document.getElementById('edit-practice-title').value = practice.title;
        document.getElementById('edit-practice-description').value = practice.description;
        document.getElementById('edit-practice-modal').classList.add('active');
    }

    closeEditPracticeModal() {
        document.getElementById('edit-practice-modal').classList.remove('active');
        this.editingPracticeId = null;
    }

    updatePractice() {
        if (!this.editingPracticeId) return;
        
        const title = document.getElementById('edit-practice-title').value.trim();
        const description = document.getElementById('edit-practice-description').value.trim();
        
        if (!title) return;
        
        const song = this.data.songs[this.currentSongId];
        const practice = song.practices.find(p => p.id === this.editingPracticeId);
        
        if (practice) {
            practice.title = title;
            practice.description = description;
            this.saveData();
            this.closeEditPracticeModal();
            if (this.currentView === 'list') {
                this.renderPracticeList();
            } else {
                this.renderSkillTree();
            }
        }
    }
    
    startSingleFruitHarvest(practice) {
        // 個別の金色の実の収穫アニメーション
        this.harvestAnimating = true;
        this.harvestPracticeId = practice.id;
        this.harvestAnimationProgress = 0;
        this.harvestType = 'single';
        
        const animationDuration = 1500; // 1.5秒間
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            this.harvestAnimationProgress = Math.min(elapsed / animationDuration, 1);
            
            // スキルツリーを再描画
            if (this.currentView === 'tree') {
                this.renderSkillTree();
            }
            
            if (this.harvestAnimationProgress < 1) {
                requestAnimationFrame(animate);
            } else {
                // アニメーション終了
                this.harvestAnimating = false;
                this.harvestAnimationProgress = 0;
                this.harvestPracticeId = null;
                this.harvestType = null;
                this.renderSkillTree();
                
                // 収穫完了メッセージを表示
                this.showSingleHarvestMessage(practice);
                
                // 全項目マスターのチェック
                const song = this.data.songs[this.currentSongId];
                const allMastered = song.practices.every(p => p.isCompleted);
                if (allMastered) {
                    setTimeout(() => {
                        this.startGrandHarvestAnimation();
                    }, 2000);
                }
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    startGrandHarvestAnimation() {
        // 全項目マスター時の大収穫祭
        this.harvestAnimating = true;
        this.harvestAnimationProgress = 0;
        this.harvestType = 'grand';
        
        const animationDuration = 3000; // 3秒間
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            this.harvestAnimationProgress = Math.min(elapsed / animationDuration, 1);
            
            // スキルツリーを再描画
            if (this.currentView === 'tree') {
                this.renderSkillTree();
            }
            
            if (this.harvestAnimationProgress < 1) {
                requestAnimationFrame(animate);
            } else {
                // アニメーション終了
                this.harvestAnimating = false;
                this.harvestAnimationProgress = 0;
                this.harvestType = null;
                this.renderSkillTree();
                
                // 大収穫祭メッセージを表示
                this.showGrandHarvestMessage();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    findPracticeIdByTreeData(x, y) {
        // 木の位置から練習IDを逆引き
        const song = this.data.songs[this.currentSongId];
        const width = 360;
        const treeSpacing = width / (song.practices.filter(p => !p.isCompleted).length + 1);
        
        let index = 0;
        for (const practice of song.practices) {
            if (!practice.isCompleted) {
                index++;
                const treeX = treeSpacing * index;
                if (Math.abs(treeX - x) < 30) {
                    return practice.id;
                }
            }
        }
        return null;
    }
    
    showSingleHarvestMessage(practice) {
        // 個別の実の収穫メッセージ
        const modal = document.createElement('div');
        modal.className = 'harvest-complete-modal';
        modal.innerHTML = `
            <div class="harvest-message">
                <div class="harvest-emoji">🍎✨</div>
                <h3>${practice.title}</h3>
                <p>マスターおめでとう！きんいろのみができたよ！</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 100);
        
        setTimeout(() => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }, 2500);
    }
    
    showGrandHarvestMessage() {
        // 大収穫祭のメッセージ
        const song = this.data.songs[this.currentSongId];
        const modal = document.createElement('div');
        modal.className = 'harvest-complete-modal grand-harvest';
        modal.innerHTML = `
            <div class="harvest-message grand">
                <div class="harvest-emoji">🎆🎉🍎🎊🎆</div>
                <h3>大収穫祭！</h3>
                <p>「${song.title}」をかんぺきにマスターしたよ！</p>
                <p class="grand-message">すごい！すごい！ほんとうによくがんばったね！</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 100);
        
        setTimeout(() => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }, 4000);
    }
    
    showPracticeSelector() {
        // 練習項目選択のポップアップを表示
        const modal = document.createElement('div');
        modal.className = 'practice-selector-modal';
        const song = this.data.songs[this.currentSongId];
        
        let practiceListHTML = '';
        song.practices.forEach(practice => {
            const status = practice.isCompleted ? '★' : '';
            const className = practice.isCompleted ? 'completed' : '';
            practiceListHTML += `
                <div class="practice-selector-item ${className}" onclick="app.selectPracticeFromTree('${practice.id}')">
                    <span class="practice-status">${status}</span>
                    <span class="practice-name">${practice.title}</span>
                    <span class="practice-level">Lv.${Math.floor(practice.level)}</span>
                </div>
            `;
        });
        
        modal.innerHTML = `
            <div class="practice-selector-content">
                <h3>練習するこうもくをえらんでね</h3>
                <div class="practice-selector-list">
                    ${practiceListHTML}
                </div>
                <button class="close-selector-btn" onclick="app.closePracticeSelector()">とじる</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        this.practiceSelectorModal = modal;
    }
    
    selectPracticeFromTree(practiceId) {
        this.closePracticeSelector();
        this.showEvaluationScreen(practiceId);
    }
    
    closePracticeSelector() {
        if (this.practiceSelectorModal) {
            this.practiceSelectorModal.classList.remove('active');
            setTimeout(() => {
                this.practiceSelectorModal.remove();
                this.practiceSelectorModal = null;
            }, 300);
        }
    }
    
    addToAnimationQueue(animation) {
        // localStorageにアニメーションキューを保存
        const queue = JSON.parse(localStorage.getItem('animationQueue') || '[]');
        queue.push(animation);
        localStorage.setItem('animationQueue', JSON.stringify(queue));
    }
    
    processAnimationQueue() {
        // 保存されたアニメーションキューを取得
        const queue = JSON.parse(localStorage.getItem('animationQueue') || '[]');
        
        // 現在の曲に関連するアニメーションのみフィルタリング
        const currentSongAnimations = queue.filter(anim => anim.songId === this.currentSongId);
        
        if (currentSongAnimations.length === 0) return;
        
        // キューをクリア
        const remainingQueue = queue.filter(anim => anim.songId !== this.currentSongId);
        localStorage.setItem('animationQueue', JSON.stringify(remainingQueue));
        
        // アニメーションを順番に実行
        this.playQueuedAnimations(currentSongAnimations);
    }
    
    async playQueuedAnimations(animations) {
        for (const animation of animations) {
            await this.playAnimation(animation);
            // アニメーション間に少し待機
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    playAnimation(animation) {
        return new Promise(resolve => {
            if (animation.type === 'growth') {
                this.playGrowthAnimation(animation.fromLevel, animation.toLevel, resolve);
            } else if (animation.type === 'fruitAdd') {
                this.playFruitAddAnimation(animation.practiceTitle, resolve);
            } else {
                resolve();
            }
        });
    }
    
    playGrowthAnimation(fromLevel, toLevel, onComplete) {
        // 木の成長アニメーション
        const animationDuration = 1500;
        const startTime = performance.now();
        const levelDiff = toLevel - fromLevel;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            // 一時的に現在のレベルをアニメーション用に調整
            this.animationLevel = fromLevel + (levelDiff * this.easeOutCubic(progress));
            
            this.renderSkillTree();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.animationLevel = null;
                this.renderSkillTree();
                onComplete();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    playFruitAddAnimation(practiceTitle, onComplete) {
        // 金色の実が追加されるアニメーション
        const animationDuration = 1000;
        const startTime = performance.now();
        
        this.newFruitAnimation = {
            practiceTitle: practiceTitle,
            progress: 0
        };
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            this.newFruitAnimation.progress = progress;
            this.renderSkillTree();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.newFruitAnimation = null;
                this.renderSkillTree();
                
                // 実追加完了メッセージ
                this.showFruitAddedMessage(practiceTitle);
                setTimeout(onComplete, 1500);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    showFruitAddedMessage(practiceTitle) {
        const message = document.createElement('div');
        message.className = 'fruit-added-message';
        message.innerHTML = `
            <span class="fruit-icon">🍎</span>
            <span class="message-text">${practiceTitle} のきんいろのみができた！</span>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('active');
        }, 10);
        
        setTimeout(() => {
            message.classList.remove('active');
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 2000);
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

const app = new PianoPracticeApp();