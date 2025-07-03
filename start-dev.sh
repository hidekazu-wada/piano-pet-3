#!/bin/bash

# .vercelディレクトリをクリーンアップ
rm -rf .vercel

# Vercel CLIで開発サーバーを起動（プロジェクト設定なし）
vercel dev --listen 3000 --local-config ./vercel.json