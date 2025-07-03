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
        this.initializeData();
        this.loadSettings();
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
            elevenLabsApiKey: localStorage.getItem('elevenLabsApiKey') || ''
        };
    }

    saveSettings() {
        const geminiKey = document.getElementById('gemini-api-key').value;
        const elevenLabsKey = document.getElementById('elevenlabs-api-key').value;
        
        if (geminiKey) {
            localStorage.setItem('geminiApiKey', geminiKey);
            this.settings.geminiApiKey = geminiKey;
        }
        if (elevenLabsKey) {
            localStorage.setItem('elevenLabsApiKey', elevenLabsKey);
            this.settings.elevenLabsApiKey = elevenLabsKey;
        }
        
        alert('せっていをほぞんしました！');
        this.showHomeScreen();
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
        this.renderSkillTree();
    }

    renderSkillTree() {
        const canvas = document.getElementById('skill-tree-canvas');
        const ctx = canvas.getContext('2d');
        const song = this.data.songs[this.currentSongId];
        
        // Canvasのサイズを設定
        const container = canvas.parentElement;
        canvas.width = container.clientWidth - 40;
        canvas.height = 400;
        
        // 背景をクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!song || song.practices.length === 0) return;
        
        // ノードの配置を計算
        const nodes = this.calculateNodePositions(song.practices, canvas.width, canvas.height);
        
        // 接続線を描画
        this.drawConnections(ctx, nodes);
        
        // ノードを描画
        nodes.forEach(node => {
            this.drawNode(ctx, node);
        });
        
        // クリックイベントの設定
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            nodes.forEach(node => {
                const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
                if (distance < node.radius) {
                    this.showEvaluationScreen(node.practice.id);
                }
            });
        };
    }

    calculateNodePositions(practices, width, height) {
        const nodes = [];
        const cols = Math.ceil(Math.sqrt(practices.length));
        const rows = Math.ceil(practices.length / cols);
        const cellWidth = width / (cols + 1);
        const cellHeight = height / (rows + 1);
        
        practices.forEach((practice, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            nodes.push({
                practice: practice,
                x: cellWidth * (col + 1),
                y: cellHeight * (row + 1),
                radius: 40,
                level: practice.level,
                isCompleted: practice.isCompleted
            });
        });
        
        return nodes;
    }

    drawConnections(ctx, nodes) {
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 3;
        
        for (let i = 0; i < nodes.length - 1; i++) {
            const current = nodes[i];
            const next = nodes[i + 1];
            
            ctx.beginPath();
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
        }
    }

    drawNode(ctx, node) {
        const { x, y, radius, practice, level, isCompleted } = node;
        
        // ノードの色を決定
        let fillColor = '#e0e0e0'; // グレー（レベル0）
        if (isCompleted) {
            fillColor = '#ffd700'; // ゴールド（マスター）
        } else if (level > 0) {
            const intensity = Math.min(level / 50, 1);
            const r = Math.floor(74 + (255 - 74) * intensity);
            const g = Math.floor(105 + (215 - 105) * intensity);
            const b = Math.floor(255 - 255 * intensity);
            fillColor = `rgb(${r}, ${g}, ${b})`;
        }
        
        // 外側の円（進捗リング）
        ctx.beginPath();
        ctx.arc(x, y, radius + 5, 0, 2 * Math.PI);
        ctx.fillStyle = isCompleted ? '#ffed4e' : '#f0f4ff';
        ctx.fill();
        
        // メインの円
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = fillColor;
        ctx.fill();
        
        // 境界線
        ctx.strokeStyle = isCompleted ? '#ffd700' : '#4a69ff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // テキスト（レベル）
        ctx.fillStyle = level > 30 ? 'white' : '#333';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Lv.${Math.floor(level)}`, x, y);
        
        // タイトル
        ctx.fillStyle = '#333';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        const title = practice.title.length > 10 ? practice.title.substring(0, 10) + '...' : practice.title;
        ctx.fillText(title, x, y + radius + 20);
        
        // 完了アイコン
        if (isCompleted) {
            ctx.font = '24px sans-serif';
            ctx.fillText('👑', x, y - radius - 15);
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
        
        this.hideAllScreens();
        document.getElementById('settings-screen').classList.add('active');
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
        }
        
        this.saveData();
        
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
        
        if (this.settings.geminiApiKey && this.settings.elevenLabsApiKey) {
            this.generateAIMessage(practice, oldLevel, newLevel);
        }
    }

    closeLevelUpModal() {
        document.getElementById('level-up-modal').classList.remove('active');
        this.showPracticeScreen();
    }

    async generateAIMessage(practice, oldLevel, newLevel) {
        // この機能は Step 4 で実装します
        console.log('AI message generation will be implemented in Step 4');
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
}

const app = new PianoPracticeApp();