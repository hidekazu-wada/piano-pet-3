# ローカルでのAPI動作確認ガイド

## 📋 セットアップ手順

### 1. Vercel CLIのインストール

```bash
# npmを使う場合
npm install -g vercel

# または、プロジェクトローカルにインストール
npm install --save-dev vercel
```

### 2. APIキーの設定

`.env.local`ファイルを編集して、実際のAPIキーを設定：

```bash
GEMINI_API_KEY=あなたのGemini APIキー
ELEVENLABS_API_KEY=あなたの11Labs APIキー
OPENAI_API_KEY=あなたのOpenAI APIキー
```

### 3. ローカルサーバーの起動

```bash
# プロジェクトディレクトリで直接実行
vercel dev

# ポートを指定する場合
vercel dev --listen 3000
```

デフォルトで http://localhost:3000 でアクセス可能になります。

**注意**: `npm run dev`は使用しないでください（再帰エラーを避けるため）

## 🔑 APIキーの取得方法

### Gemini API
1. [Google AI Studio](https://makersuite.google.com/app/apikey) にアクセス
2. 「Get API key」をクリック
3. 新しいAPIキーを作成

### 11Labs API
1. [11Labs](https://elevenlabs.io/) でアカウント作成
2. Profile → API Keysでキーを取得
3. 無料プランでも利用可能

### OpenAI API
1. [OpenAI Platform](https://platform.openai.com/) でアカウント作成
2. API keys → Create new secret keyでキーを作成
3. 使用量に応じて課金（少額のクレジットが最初に付与される）

## 🧪 動作確認の手順

### 1. 基本機能の確認
1. ブラウザで http://localhost:3000 を開く
2. 曲と練習項目を追加
3. 練習を評価してレベルアップ

### 2. AI機能の確認
レベルアップ時に以下が動作することを確認：
- ✅ ファンタジーキャラクターの生成
- ✅ メッセージの表示（Gemini API）
- ✅ 音声の再生（11Labs API）
- ✅ イラストの生成（OpenAI DALL-E 3）

### 3. エラーの確認方法

ブラウザの開発者ツール（F12）でコンソールを確認：

```javascript
// よくあるエラー
"API key not configured" // APIキーが設定されていない
"Failed to generate message" // API呼び出しエラー
```

Vercelのターミナルでサーバー側のログも確認できます。

## 🚨 トラブルシューティング

### ポート3000が使用中の場合

```bash
# 別のポートを指定
vercel dev --listen 3001
```

### APIキーが読み込まれない場合

1. `.env.local`ファイルが正しい場所にあるか確認
2. ファイル名が正確か確認（`.env`ではなく`.env.local`）
3. サーバーを再起動

### CORS エラーが出る場合

Vercel devサーバーはCORSを自動で処理するので、通常は発生しません。
もし発生した場合は、ブラウザのキャッシュをクリアしてください。

## 💡 開発のヒント

### APIレスポンスの確認

Network タブで API 呼び出しを確認：
- `/api/gemini` - メッセージ生成
- `/api/elevenlabs` - 音声生成
- `/api/openai` - 画像生成

### ローカル開発の利点

1. **即座に変更を確認** - ファイル保存で自動リロード
2. **詳細なエラーログ** - ターミナルでエラーを確認
3. **APIキーの安全な管理** - 環境変数で管理

## 📝 注意事項

- `.env.local`ファイルは絶対にGitにコミットしない（.gitignoreに含まれています）
- APIの使用量に注意（特にOpenAI）
- 11Labsは月間の文字数制限があるので注意

## 🎯 確認ポイントチェックリスト

- [ ] Vercel CLIがインストールされている
- [ ] `.env.local`にAPIキーが設定されている
- [ ] `vercel dev`でサーバーが起動する
- [ ] レベルアップ時にキャラクターが表示される
- [ ] AIメッセージが生成される
- [ ] 音声が再生される
- [ ] イラストが表示される
- [ ] キャラクター図鑑に保存される

問題なく動作すれば、本番環境へのデプロイの準備完了です！