# Vercelデプロイガイド 🚀

## なぜVercelが簡単なのか

1. **環境変数の管理** - Web UIで簡単設定、コードに書く必要なし
2. **自動HTTPS** - 証明書の設定不要
3. **GitHubと連携** - pushするだけで自動デプロイ
4. **無料枠が充実** - 個人利用には十分
5. **設定がシンプル** - 数分でデプロイ完了

## 📋 デプロイ手順

### 1. Vercelアカウント作成
[vercel.com](https://vercel.com) でアカウントを作成（GitHubアカウントでログイン可能）

### 2. プロジェクトのアップロード

#### 方法A: GitHub経由（推奨）
1. GitHubにプロジェクトをpush
2. Vercelダッシュボードで「New Project」
3. GitHubリポジトリを選択
4. 「Deploy」をクリック

#### 方法B: Vercel CLI
```bash
# Vercel CLIをインストール
npm i -g vercel

# プロジェクトディレクトリで実行
vercel

# 指示に従って進める
```

### 3. 環境変数の設定

Vercelダッシュボードで：
1. プロジェクトを選択
2. 「Settings」タブ
3. 「Environment Variables」
4. 以下を追加：

```
GEMINI_API_KEY = your-gemini-api-key
ELEVENLABS_API_KEY = your-elevenlabs-api-key
OPENAI_API_KEY = your-openai-api-key
```

### 4. index.htmlの修正

`api-client.js`を`api-client-vercel.js`に変更：

```html
<!-- 変更前 -->
<script src="api-client.js"></script>

<!-- 変更後 -->
<script src="api-client-vercel.js"></script>
```

### 5. デプロイ完了！

これだけです！URLは以下のような形式になります：
- `https://your-project-name.vercel.app`

## 🔧 ローカル開発

```bash
# Vercel開発サーバーを起動
vercel dev

# http://localhost:3000 でアクセス可能
# 環境変数も自動で読み込まれる
```

## 📊 レンタルサーバーとの比較

| 項目 | Vercel | レンタルサーバー |
|------|--------|----------------|
| セットアップ時間 | 5分 | 30分〜1時間 |
| 環境変数管理 | Web UI | 設定ファイル |
| HTTPS | 自動 | 設定必要 |
| デプロイ | git push | FTPアップロード |
| 料金 | 無料〜 | 月額数百円〜 |
| サーバー管理 | 不要 | 必要 |

## 🎯 メリット

1. **開発効率** - GitHubにpushするだけで自動デプロイ
2. **セキュリティ** - 環境変数はVercelが安全に管理
3. **パフォーマンス** - エッジ配信で高速
4. **スケーラビリティ** - アクセスが増えても自動対応
5. **監視** - エラーログやアクセス統計が見れる

## ⚠️ 注意点

### 無料枠の制限
- API実行時間: 10秒まで
- 月間実行回数: 制限あり（個人利用には十分）
- 帯域幅: 100GB/月

### 商用利用
- 商用利用の場合はProプラン（$20/月）が必要

## 🚀 まとめ

Vercelを使えば：
1. APIキーの管理が安全で簡単
2. デプロイが自動化される
3. HTTPSやCORSの設定が不要
4. 開発に集中できる

レンタルサーバーより圧倒的に簡単で、セキュリティも高い！