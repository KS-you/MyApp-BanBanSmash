# MyApp-BanBanSmash
ストレス解消オブジェクト破壊ゲームアプリ

---

# 使用技術
## フロントエンド
<img src="https://img.shields.io/badge/Node.js-black.svg?logo=Node.js&style=bold&logoColor=white">
<img src="https://img.shields.io/badge/Next.js-black.svg?logo=Next.js&style=bold&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-black.svg?logo=TypeScript&style=bold&logoColor=white">

## バックエンド
<img src="https://img.shields.io/badge/FastAPI-blue.svg?logo=FastAPI&style=bold&logoColor=black">
<img src="https://img.shields.io/badge/Python-green.svg?logo=Python&style=bold&logoColor=white">

## ミドルウェア
<img src="https://img.shields.io/badge/MySQL-blue.svg?logo=MySQL&style=bold&logoColor=black">

## インフラ
<img src="https://img.shields.io/badge/Docker-blue.svg?logo=Docker&style=bold&logoColor=black">

---

# 環境

## 環境情報
本アプリでは、**FastAPI (Python)** をバックエンドに、**Next.js (React)** をフロントエンドとして構築しています。
インフラ構成は、**Docker / docker-compose** によりコンテナ化されています。

---

## バックエンド（FastAPI）
| 項目 | 内容 |
|------|-----|
| **言語** | Python 3.10 |
| **ベースイメージ** | `python:3.10-slim` |
| **フレームワーク** | FastAPI |
| **アプリサーバ**  | Uvicorn |
| **パッケージマネージャ** | pip（ビルド時に最新版へ更新）|
| **主要ライブラリ** | FastAPI / SQLAlchemy / passlib[bcript] / uvicorn |
| **データベース** | MySQL 8.0 |
| **環境変数** | `PYTHONDONTWRITEBYTECODE=1`, `PYTHONBUFFERD=1`, `PYTHONPATH=/app` |
| **アプリ起動コマンド** | `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` |
| **公開ポート** | 8000 |

---

## フロントエンド(Next.js / React)
| 項目 | 内容 |
|------|------|
| **言語** | TypeScript / JavaScript |
| **ランタイム** | Node.js 18.x |
| **ベースイメージ** | `node:18` |
| **パッケージマネージャ** | npm（v9.x） |
| **フレームワーク** | Next.js |
| **主要ライブラリ** | React / Tailwind CSS |
| **作業ディレクトリ** | `/app` |
| **公開ポート** | 3000 |
| **実行コマンド** | `npm run dev` |

---

## インフラ（Docker）
| 項目 | 内容 |
|------|-----|
| **Docker Engine** | 27.x 以降推奨 |
| **docker-compose** | 2.x 以降推奨 |
| **ベースイメージ（バックエンド）** | `python:3.10-slim` |
| **ベースイメージ（フロントエンド）** | `node:18` |
| **ネットワーク構成** | Docker Compose 内で連携（バックエンド ↔︎ フロントエンド ↔︎ MySQL）|
| **データベース** | MySQL 8.0 |
| **起動コマンド** | `docker compose up -d --build` |

---

## 動作環境
| 項目 | 内容 |
|------|-----|
| **OS** | macOS 15.6.1（Apple Silicon）|
| **ブラウザ** | Google Chrome 129.0+ |
| **最終動作確認日** | 2025/11/2 |

---

# 補足
- 依存関係の詳細は以下を参照してください。
 - バックエンド: [`requirements.txt`](./backend/requirements.txt)
 - フロントエンド: [`package.json`](./frontend/package.json)
- 開発モードでは、`--reload` により FastAPI がホットリロードされます。
- Next.js は `npm run dev ` により自動ビルド/ブラウザリロードが有効です。

# 備考
この構成はローカル開発・検証環境を想定しています。