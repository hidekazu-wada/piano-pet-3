class PianoPracticeApp {
  // 動物データの一元管理
  static ANIMAL_DATA = {
    pet1: {
      id: 'pet1',
      name: 'ハーモニカキャット',
      filename: 'cat.mp4',
      audioFilename: 'cat-sound.mp3',
      description:
        'とても かわいい ねこちゃんです。みゃーみゃー なきながら あそぶのが だいすき！やわらかい けと まるい めが とても チャーミングです。',
    },
    pet2: {
      id: 'pet2',
      name: 'ギタードッグ',
      filename: 'dog.mp4',
      audioFilename: 'dog-sound.mp3',
      description:
        'げんきいっぱいの いぬです。しっぽを ふりふり おさんぽするのが だいすき！ともだちおもいで やさしい せいかくです。',
    },
    pet3: {
      id: 'pet3',
      name: 'ドラムうさぎ',
      filename: 'rabbit.mp4',
      audioFilename: 'rabbit-sound.mp3',
      description:
        'ぴょんぴょん はねまわる かわいい うさぎです。にんじんが だいすきで ながい みみが じまんです。',
    },
    pet4: {
      id: 'pet4',
      name: 'カスタネットハムスター',
      filename: 'hamster.mp4',
      audioFilename: 'hamster-sound.mp3',
      description:
        'ちいさくて まんまるな はむすたーです。ほっぺに たべものを つめこんで くるくる まわしぐるまで あそびます。',
    },
    pet5: {
      id: 'pet5',
      name: 'フルートバード',
      filename: 'bird.mp4',
      audioFilename: 'bird-sound.mp3',
      description:
        'きれいな いろの とりです。そらを とぶのが とくいで きれいな こえで うたいます。じゆうに そらを とびまわります。',
    },
    pet6: {
      id: 'pet6',
      name: 'シンバルモンキー',
      filename: 'monkey.mp4',
      audioFilename: 'monkey-sound.mp3',
      description:
        'おもしろい さるです。しんばるを たたいて あそぶのが だーいすき！とても かしこくて、いろんな ことを おぼえます。',
    },
    pet7: {
      id: 'pet7',
      name: 'トランペットエレファント',
      filename: 'elephant.mp4',
      audioFilename: 'elephant-sound.mp3',
      description:
        'おおきな ぞうさんです。とらんぺっとの ような おおきな はなで ふんふん と おとを たてます。やさしくて おとなしい せいかくです。',
    },
  };

  constructor() {
    this.currentSongId = null;
    this.currentPracticeId = null;
    this.timerInterval = null;
    this.timerSeconds = 0;
    this.timerRunning = false;
    this.selectedLevel = 0;
    this.selectedAttitude = 0;
    this.initializeData();
    this.render();
  }

  initializeData() {
    const savedData = localStorage.getItem('practiceData');
    if (savedData) {
      this.data = JSON.parse(savedData);
      // 既存データの互換性を保つため、不足しているプロパティを追加
      if (!this.data.gachaPoints) {
        this.data.gachaPoints = 0;
      }
      if (!this.data.collection) {
        this.data.collection = {
          videos: this.createAnimalData(),
        };
      }
      // 既存データを最新の設定に更新
      if (this.data.collection && this.data.collection.videos) {
        // 既存の動物データを更新
        this.data.collection.videos.forEach((video) => {
          // 中央管理されたデータから最新の情報を取得
          const animalData = PianoPracticeApp.ANIMAL_DATA[video.id];
          if (animalData) {
            // すべての情報を強制更新（obtainedステータスは保持）
            const isObtained = video.obtained;
            Object.assign(video, animalData);
            video.obtained = isObtained;
          }
        });

        // 新しく追加された動物をチェックして追加
        const existingIds = this.data.collection.videos.map((v) => v.id);
        Object.keys(PianoPracticeApp.ANIMAL_DATA).forEach((animalId) => {
          if (!existingIds.includes(animalId)) {
            const animalData = PianoPracticeApp.ANIMAL_DATA[animalId];
            this.data.collection.videos.push({
              ...animalData,
              obtained: false,
            });
          }
        });

        // データを保存して変更を反映
        this.saveData();
      }
    } else {
      this.data = {
        gachaPoints: 0,
        collection: {
          videos: this.createAnimalData(),
        },
        songs: {
          song1: {
            id: 'song1',
            title: 'ミュゼット',
            practices: [
              {
                id: 'p1',
                title: '1だんめ りょうてでゆっくり',
                description: 'テンポ60でただしく',
                level: 0,
                isCompleted: false,
                criteria: {
                  tempo: { current: 60, target: 100 },
                  accuracy: { current: 0, target: 10 },
                },
                practiceTime: 0,
                lastPracticed: null,
                checkPoints: [
                  {
                    id: 'cp1',
                    text: 'ひだりてを ていねいに おさえる',
                    checked: false,
                  },
                  {
                    id: 'cp2',
                    text: 'みぎての おとが ちいさくならないように',
                    checked: false,
                  },
                ],
              },
              {
                id: 'p2',
                title: '2だんめ みぎてだけ',
                description: 'ゆびづかいにちゅうい',
                level: 0,
                isCompleted: false,
                criteria: {
                  tempo: { current: 80, target: 120 },
                  accuracy: { current: 0, target: 10 },
                },
                practiceTime: 0,
                lastPracticed: null,
                checkPoints: [
                  { id: 'cp3', text: 'ゆびばんごうを まもる', checked: false },
                  {
                    id: 'cp4',
                    text: 'スラーを なめらかに つなげる',
                    checked: false,
                  },
                ],
              },
              {
                id: 'p3',
                title: '2だんめ ひだりてだけ',
                description: 'リズムをただしく',
                level: 0,
                isCompleted: false,
                criteria: {
                  tempo: { current: 80, target: 120 },
                  accuracy: { current: 0, target: 10 },
                },
                practiceTime: 0,
                lastPracticed: null,
                checkPoints: [
                  { id: 'cp5', text: '8ぶおんぷうを そろえる', checked: false },
                  {
                    id: 'cp6',
                    text: 'きゅうふを ただしく やすむ',
                    checked: false,
                  },
                ],
              },
            ],
          },
          song2: {
            id: 'song2',
            title: 'ちいさなせかい',
            practices: [
              {
                id: 'p4',
                title: 'さいしょの8しょうせつ',
                description: 'メロディーをうたうように',
                level: 0,
                isCompleted: false,
                criteria: {
                  tempo: { current: 70, target: 110 },
                  accuracy: { current: 0, target: 10 },
                },
                practiceTime: 0,
                lastPracticed: null,
                checkPoints: [
                  {
                    id: 'cp7',
                    text: 'メロディーを はっきり きかせる',
                    checked: false,
                  },
                  {
                    id: 'cp8',
                    text: 'ばんそうを ちいさく ひく',
                    checked: false,
                  },
                ],
              },
              {
                id: 'p5',
                title: 'わおんのぶぶん',
                description: 'ゆびをそろえて',
                level: 0,
                isCompleted: false,
                criteria: {
                  tempo: { current: 60, target: 100 },
                  accuracy: { current: 0, target: 10 },
                },
                practiceTime: 0,
                lastPracticed: null,
                checkPoints: [
                  {
                    id: 'cp9',
                    text: '3つのおとを いっしょに おさえる',
                    checked: false,
                  },
                  {
                    id: 'cp10',
                    text: 'おとのおおきさを そろえる',
                    checked: false,
                  },
                ],
              },
            ],
          },
        },
      };
      this.saveData();
    }
  }

  saveData() {
    localStorage.setItem('practiceData', JSON.stringify(this.data));
  }

  // 動物データを生成するヘルパーメソッド
  createAnimalData() {
    return Object.values(PianoPracticeApp.ANIMAL_DATA).map((animal) => ({
      ...animal,
      obtained: false,
    }));
  }

  // 動物データを即時反映するメソッド
  updateAnimalData() {
    if (this.data.collection && this.data.collection.videos) {
      this.data.collection.videos.forEach((video) => {
        const animalData = PianoPracticeApp.ANIMAL_DATA[video.id];
        if (animalData) {
          // すべての情報を強制更新（obtainedステータスは保持）
          const isObtained = video.obtained;
          Object.assign(video, animalData);
          video.obtained = isObtained;
        }
      });
      this.saveData();
      // 画面が表示されている場合は再描画
      this.refreshCurrentScreen();
    }
  }

  // 現在表示中の画面を再描画するメソッド
  refreshCurrentScreen() {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen) {
      const screenId = activeScreen.id;
      switch (screenId) {
        case 'collection-screen':
          this.renderCollectionScreen();
          break;
        case 'gacha-screen':
          this.updateGachaDisplay();
          break;
        case 'home-screen':
          this.render();
          break;
      }
    }
  }

  render() {
    this.renderSongList();
  }

  renderSongList() {
    const songList = document.getElementById('song-list');
    songList.innerHTML = '';

    Object.values(this.data.songs).forEach((song) => {
      const totalPractices = song.practices.length;
      const completedPractices = song.practices.filter(
        (p) => p.isCompleted
      ).length;
      const progress =
        totalPractices > 0 ? (completedPractices / totalPractices) * 100 : 0;

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
    const incompletePractices = song.practices.filter((p) => !p.isCompleted);
    const completedPractices = song.practices.filter((p) => p.isCompleted);

    // 未完了の練習を表示
    incompletePractices.forEach((practice) => {
      const practiceCard = document.createElement('div');
      practiceCard.className = 'practice-card';
      practiceCard.innerHTML = `
                <h3>${practice.title}</h3>
                <p>${practice.description}</p>
                <div class="level-badge">
                    レベル ${Math.floor(practice.level)}
                </div>
                <div class="practice-actions-btns">
                    <button class="edit-practice-btn" onclick="event.stopPropagation(); app.showEditPracticeModal('${
                      practice.id
                    }')">✏️</button>
                    <button class="delete-practice-btn" onclick="event.stopPropagation(); app.deletePractice('${
                      practice.id
                    }')">×</button>
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
    completedPractices.forEach((practice) => {
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
    this.renderPracticeList();
  }

  showEvaluationScreen(practiceId) {
    this.currentPracticeId = practiceId;
    const song = this.data.songs[this.currentSongId];
    const practice = song.practices.find((p) => p.id === practiceId);

    document.getElementById('practice-title').textContent = practice.title;
    document.getElementById('current-level').textContent = Math.floor(
      practice.level
    );
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
    options.forEach((option) => {
      option.classList.remove('selected');
      const handler = option._clickHandler;
      if (handler) {
        option.removeEventListener('click', handler);
      }
      option._clickHandler = (e) => {
        options.forEach((opt) => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedLevel = parseInt(option.dataset.level);
      };
      option.addEventListener('click', option._clickHandler);
    });
  }

  setupAttitudeOptions() {
    const options = document.querySelectorAll('.attitude-option');
    options.forEach((option) => {
      option.classList.remove('selected');
      const handler = option._clickHandler;
      if (handler) {
        option.removeEventListener('click', handler);
      }
      option._clickHandler = (e) => {
        options.forEach((opt) => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedAttitude = parseInt(option.dataset.attitude);
      };
      option.addEventListener('click', option._clickHandler);
    });
  }

  updateLevelBreakdown(practice) {
    const breakdown = practice.levelBreakdown || {
      timePoints: 0,
      performancePoints: 0,
      attitudePoints: 0,
    };
    document.getElementById(
      'time-points'
    ).textContent = `${breakdown.timePoints}pt`;
    document.getElementById(
      'performance-points'
    ).textContent = `${breakdown.performancePoints}pt`;
    document.getElementById(
      'attitude-points'
    ).textContent = `${breakdown.attitudePoints}pt`;
  }

  hideAllScreens() {
    document.querySelectorAll('.screen').forEach((screen) => {
      screen.classList.remove('active');
    });
  }

  saveEvaluation() {
    const song = this.data.songs[this.currentSongId];
    const practice = song.practices.find(
      (p) => p.id === this.currentPracticeId
    );
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
      0: 0, // やるまえ
      3: 2, // がんばりちゅう
      6: 4, // まちがえるけどできてきた
      9: 8, // まちがえないでできた（2番目に高い）
      10: 10, // マスター
    };
    const performancePoints = performanceMap[this.selectedLevel] || 0;

    // 取り組み姿勢ポイント（自分で考えて改善を最高に）
    const attitudeMap = {
      0: 0, // 未選択
      1: 1, // あまりしゅうちゅうできなかった
      2: 3, // おやにいわれてがんばれた
      3: 10, // じぶんでかんがえてかいぜんできた（最高ポイント）
    };
    const attitudePoints = attitudeMap[this.selectedAttitude] || 0;

    // レベル内訳を保存
    if (!practice.levelBreakdown) {
      practice.levelBreakdown = {
        timePoints: 0,
        performancePoints: 0,
        attitudePoints: 0,
      };
    }

    // 累積時間ポイントを計算（2分ごとに1ポイント）
    const totalTimePoints = Math.floor(
      (practice.practiceTime + practiceSeconds) / 120
    );

    // ポイントを累積
    practice.levelBreakdown.timePoints = totalTimePoints;
    practice.levelBreakdown.performancePoints =
      (practice.levelBreakdown.performancePoints || 0) + performancePoints;
    practice.levelBreakdown.attitudePoints =
      (practice.levelBreakdown.attitudePoints || 0) + attitudePoints;

    // 新しいレベルを計算
    const newLevel =
      practice.levelBreakdown.timePoints +
      practice.levelBreakdown.performancePoints +
      practice.levelBreakdown.attitudePoints;

    practice.level = newLevel;
    practice.practiceTime += practiceSeconds;
    practice.lastPracticed = new Date().toISOString();

    // マスター評価の場合は完了フラグを立てる
    if (this.selectedLevel === 10) {
      practice.isCompleted = true;
    }

    this.saveData();

    if (newLevel > oldLevel || this.selectedLevel === 10) {
      // レベルアップ時にガチャポイントを付与
      const pointsEarned = this.calculateGachaPoints(
        oldLevel,
        newLevel,
        this.selectedLevel === 10
      );
      this.data.gachaPoints += pointsEarned;
      this.saveData();
      this.showLevelUpModal(
        practice,
        Math.floor(oldLevel),
        Math.floor(newLevel),
        pointsEarned
      );
    } else {
      this.showPracticeScreen();
    }
  }

  showLevelUpModal(practice, oldLevel, newLevel, pointsEarned = 0) {
    const modal = document.getElementById('level-up-modal');
    const message = document.getElementById('level-up-message');

    if (practice.isCompleted) {
      message.textContent = `${practice.title}を マスターしたよ！すごい！\n${pointsEarned}ポイント もらったよ！`;
    } else {
      message.textContent = `${practice.title}が レベル${oldLevel}から レベル${newLevel}に あがったよ！\n${pointsEarned}ポイント もらったよ！`;
    }

    modal.classList.add('active');
  }

  closeLevelUpModal() {
    document.getElementById('level-up-modal').classList.remove('active');
    this.showPracticeScreen();
  }

  calculateGachaPoints(oldLevel, newLevel, isMastered) {
    let points = 0;

    // レベルアップごとに50ポイント
    const levelDiff = Math.floor(newLevel) - Math.floor(oldLevel);
    points += levelDiff * 50;

    // マスター達成時は追加で200ポイント
    if (isMastered) {
      points += 200;
    }

    return points;
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
    const display = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
    document.getElementById('timer-display').textContent = display;
  }

  renderCheckPoints() {
    const song = this.data.songs[this.currentSongId];
    const practice = song.practices.find(
      (p) => p.id === this.currentPracticeId
    );
    const checkpointList = document.getElementById('checkpoint-list');
    checkpointList.innerHTML = '';

    if (!practice.checkPoints) {
      practice.checkPoints = [];
    }

    practice.checkPoints.forEach((checkpoint, index) => {
      const item = document.createElement('div');
      item.className = `checkpoint-item ${checkpoint.checked ? 'checked' : ''}`;
      item.innerHTML = `
                <input type="checkbox" id="check-${checkpoint.id}" ${
        checkpoint.checked ? 'checked' : ''
      }>
                <label for="check-${checkpoint.id}">${checkpoint.text}</label>
                <button class="delete-btn" onclick="app.deleteCheckPoint('${
                  checkpoint.id
                }')">×</button>
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
    song.practices.forEach((practice) => {
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
    const practice = song.practices.find((p) => p.id === practiceId);

    if (!practice.checkPoints) {
      practice.checkPoints = [];
    }

    const newCheckPoint = {
      id: `cp_${Date.now()}`,
      text: text,
      checked: false,
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
    const practice = song.practices.find(
      (p) => p.id === this.currentPracticeId
    );

    if (practice.checkPoints) {
      practice.checkPoints = practice.checkPoints.filter(
        (cp) => cp.id !== checkpointId
      );
      this.saveData();
      this.renderCheckPoints();
    }
  }

  clearPracticeData() {
    if (!confirm('このれんしゅうのデータをすべてけします。よろしいですか？')) {
      return;
    }

    const song = this.data.songs[this.currentSongId];
    const practice = song.practices.find(
      (p) => p.id === this.currentPracticeId
    );

    // データをリセット
    practice.level = 0;
    practice.practiceTime = 0;
    practice.lastPracticed = null;
    practice.isCompleted = false;
    if (practice.levelBreakdown) {
      practice.levelBreakdown = {
        timePoints: 0,
        performancePoints: 0,
        attitudePoints: 0,
      };
    }
    if (practice.checkPoints) {
      practice.checkPoints.forEach((cp) => {
        cp.checked = false;
      });
    }

    this.saveData();
    this.showPracticeScreen();
  }

  reopenPractice(practiceId) {
    const song = this.data.songs[this.currentSongId];
    const practice = song.practices.find((p) => p.id === practiceId);

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
      practices: [],
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
    const description = document
      .getElementById('new-practice-description')
      .value.trim();

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
        attitudePoints: 0,
      },
      practiceTime: 0,
      lastPracticed: null,
      checkPoints: [],
    };

    song.practices.push(newPractice);
    this.saveData();
    this.closeAddPracticeModal();
    this.renderPracticeList();
  }

  deleteSong(songId) {
    const song = this.data.songs[songId];
    if (!song) return;

    const practiceCount = song.practices.length;
    const message =
      practiceCount > 0
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
    const practice = song.practices.find((p) => p.id === practiceId);

    if (!practice) return;

    if (
      confirm(
        `「${practice.title}」をけしますか？\nレベル${Math.floor(
          practice.level
        )}のきろくもけされます。`
      )
    ) {
      song.practices = song.practices.filter((p) => p.id !== practiceId);
      this.saveData();
      this.renderPracticeList();
    }
  }

  showEditPracticeModal(practiceId) {
    const song = this.data.songs[this.currentSongId];
    const practice = song.practices.find((p) => p.id === practiceId);

    if (!practice) return;

    this.editingPracticeId = practiceId;
    document.getElementById('edit-practice-title').value = practice.title;
    document.getElementById('edit-practice-description').value =
      practice.description;
    document.getElementById('edit-practice-modal').classList.add('active');
  }

  closeEditPracticeModal() {
    document.getElementById('edit-practice-modal').classList.remove('active');
    this.editingPracticeId = null;
  }

  updatePractice() {
    if (!this.editingPracticeId) return;

    const title = document.getElementById('edit-practice-title').value.trim();
    const description = document
      .getElementById('edit-practice-description')
      .value.trim();

    if (!title) return;

    const song = this.data.songs[this.currentSongId];
    const practice = song.practices.find(
      (p) => p.id === this.editingPracticeId
    );

    if (practice) {
      practice.title = title;
      practice.description = description;
      this.saveData();
      this.closeEditPracticeModal();
      this.renderPracticeList();
    }
  }

  // ガチャとコレクション機能
  showGachaScreen() {
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('gacha-screen').classList.add('active');
    this.renderGachaScreen();
  }

  renderGachaScreen() {
    const pointsDisplay = document.getElementById('gacha-points');
    pointsDisplay.textContent = this.data.gachaPoints;

    const gachaButton = document.getElementById('gacha-button');
    const allCollected = this.isAllCharactersCollected();

    // 全キャラクター収集時はガチャボタンを無効化
    if (allCollected) {
      gachaButton.disabled = true;
      gachaButton.innerHTML = `
        <span class="gacha-text">ぜんぶあつめたよ！</span>
        <span class="gacha-animation">🎉</span>
      `;
    } else {
      gachaButton.disabled = this.data.gachaPoints < 1000;
      gachaButton.innerHTML = `
        <span class="gacha-text">ガチャをひく</span>
        <span class="gacha-animation">🎁</span>
      `;
    }

    const registeredVideos = this.data.collection.videos.filter(
      (v) => PianoPracticeApp.ANIMAL_DATA[v.id]
    );
    const collectionCount = registeredVideos.filter((v) => v.obtained).length;
    const totalCount = registeredVideos.length;
    document.getElementById(
      'collection-count'
    ).textContent = `${collectionCount}/${totalCount}`;
  }

  performGacha() {
    // ポイント不足または全キャラクター収集済みの場合は実行しない
    if (this.data.gachaPoints < 1000 || this.isAllCharactersCollected()) return;

    // ガチャボタンを無効化
    const gachaButton = document.getElementById('gacha-button');
    gachaButton.disabled = true;
    gachaButton.textContent = 'ガチャちゅう...';

    this.data.gachaPoints -= 1000;
    this.saveData();

    // ガチャ演出動画を表示
    this.showGachaAnimation();
  }

  showGachaAnimation() {
    const modal = document.getElementById('gacha-animation-modal');
    const video = document.getElementById('gacha-animation-video');

    modal.classList.add('active');

    // 音声を有効にして動画を最初から再生
    video.muted = false;
    video.currentTime = 0;
    video.play();

    // 動画が読み込まれたら、動画の長さに応じてタイマーを設定
    video.onloadedmetadata = () => {
      // 動画の長さを取得（秒）
      const videoDuration = video.duration * 1000; // ミリ秒に変換

      // 動画の長さに応じてタイマーを設定
      this.gachaTimer = setTimeout(() => {
        this.processGachaResult();
      }, videoDuration);
    };

    // 動画終了後に結果表示（フォールバック）
    video.onended = () => {
      // タイマーをクリア
      if (this.gachaTimer) {
        clearTimeout(this.gachaTimer);
        this.gachaTimer = null;
      }
      // 即座に結果を表示
      this.processGachaResult();
    };
  }

  processGachaResult() {
    // 演出動画を非表示
    document.getElementById('gacha-animation-modal').classList.remove('active');

    // 未獲得の動画からランダムに選択（登録されている動物のみ）
    const unobtainedVideos = this.data.collection.videos.filter(
      (v) => !v.obtained && PianoPracticeApp.ANIMAL_DATA[v.id]
    );

    if (unobtainedVideos.length === 0) {
      this.showGachaResult(null, '全てのペットを集めたよ！');
      return;
    }

    const randomIndex = Math.floor(Math.random() * unobtainedVideos.length);
    const selectedVideo = unobtainedVideos[randomIndex];
    selectedVideo.obtained = true;

    this.saveData();
    this.showGachaResult(selectedVideo, '新しいペットが仲間になったよ！');
  }

  showGachaResult(video, message) {
    const modal = document.getElementById('gacha-result-modal');
    const messageEl = document.getElementById('gacha-result-message');
    const videoEl = document.getElementById('gacha-result-video');
    const videoNameEl = document.getElementById('gacha-result-video-name');

    messageEl.textContent = message;

    if (video) {
      videoEl.src = `videos/${video.filename}`;
      videoEl.style.display = 'block';
      videoNameEl.textContent = video.name;
      videoNameEl.style.display = 'block';
    } else {
      videoEl.style.display = 'none';
      videoNameEl.style.display = 'none';
    }

    modal.classList.add('active');
  }

  closeGachaResult() {
    document.getElementById('gacha-result-modal').classList.remove('active');

    // ガチャ画面を再描画（全収集状態をチェック）
    this.renderGachaScreen();
  }

  showCollectionScreen() {
    document.getElementById('gacha-screen').classList.remove('active');
    document.getElementById('collection-screen').classList.add('active');
    this.renderCollectionScreen();
  }

  renderCollectionScreen() {
    const collectionGrid = document.getElementById('collection-grid');
    collectionGrid.innerHTML = '';

    // 登録されている動物のみを表示
    this.data.collection.videos
      .filter((video) => PianoPracticeApp.ANIMAL_DATA[video.id])
      .forEach((video) => {
        const item = document.createElement('div');
        item.className = `collection-item ${
          video.obtained ? 'obtained' : 'locked'
        }`;

        if (video.obtained) {
          // サムネイル用のvideo要素を作成
          const videoElement = document.createElement('video');
          videoElement.src = `videos/${video.filename}`;
          videoElement.muted = true;
          videoElement.loop = true;
          videoElement.className = 'collection-thumbnail';

          // ホバー時に再生、マウスアウト時に停止
          videoElement.addEventListener('mouseenter', () => {
            videoElement.play();
          });
          videoElement.addEventListener('mouseleave', () => {
            videoElement.pause();
            videoElement.currentTime = 0;
          });

          // クリックで詳細モーダルを表示
          item.addEventListener('click', () => {
            this.showAnimalDetail(video);
          });

          item.appendChild(videoElement);

          const nameElement = document.createElement('p');
          nameElement.textContent = video.name;
          item.appendChild(nameElement);
        } else {
          item.innerHTML = `
                      <div class="locked-icon">🔒</div>
                      <p>？？？</p>
                  `;
        }

        collectionGrid.appendChild(item);
      });
  }

  showAnimalDetail(video) {
    const modal = document.getElementById('animal-detail-modal');
    const nameEl = document.getElementById('animal-detail-name');
    const videoEl = document.getElementById('animal-detail-video');
    const descriptionEl = document.getElementById('animal-detail-description');

    // 現在表示中の動物情報を保存
    this.currentAnimal = video;

    nameEl.textContent = video.name;
    videoEl.src = `videos/${video.filename}`;
    descriptionEl.textContent = video.description;

    modal.classList.add('active');
    videoEl.play();
  }

  closeAnimalDetail() {
    const modal = document.getElementById('animal-detail-modal');
    const videoEl = document.getElementById('animal-detail-video');

    modal.classList.remove('active');
    videoEl.pause();
    videoEl.currentTime = 0;
    this.currentAnimal = null;
  }

  playAnimalSound() {
    if (!this.currentAnimal) return;

    // 中央管理されたデータから音声ファイル名を取得
    const animalData = PianoPracticeApp.ANIMAL_DATA[this.currentAnimal.id];
    if (!animalData || !animalData.audioFilename) return;

    // 既存の音声を停止（もしあれば）
    if (this.currentAnimalAudio) {
      this.currentAnimalAudio.pause();
      this.currentAnimalAudio.currentTime = 0;
    }

    // 新しい音声を再生
    this.currentAnimalAudio = new Audio(`sounds/${animalData.audioFilename}`);
    this.currentAnimalAudio.play().catch((error) => {
      console.log('音声ファイルの再生に失敗しました:', error);
    });
  }

  backToGacha() {
    document.getElementById('collection-screen').classList.remove('active');
    document.getElementById('gacha-screen').classList.add('active');
  }

  backToHome() {
    document.getElementById('gacha-screen').classList.remove('active');
    document.getElementById('home-screen').classList.add('active');
  }

  resetCollection() {
    if (
      !confirm('ずかんをリセットしますか？\n集めたペットが全てなくなります。')
    ) {
      return;
    }

    // 全ての動物を未獲得状態にする
    this.data.collection.videos.forEach((video) => {
      video.obtained = false;
    });

    this.saveData();
    this.renderCollectionScreen();

    // 成功メッセージを表示
    alert('ずかんをリセットしました！');
  }

  // 全ての登録されたキャラクターが集まっているかチェック
  isAllCharactersCollected() {
    const registeredVideos = this.data.collection.videos.filter(
      (v) => PianoPracticeApp.ANIMAL_DATA[v.id]
    );
    return registeredVideos.every((video) => video.obtained);
  }
}

const app = new PianoPracticeApp();
