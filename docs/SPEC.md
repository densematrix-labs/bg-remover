# BgGone — Photoroom Alternative

> AI-powered background remover. Free, fast, no signup required.

## 竞品分析

| 项目 | 值 |
|------|-----|
| 竞品 | Photoroom |
| URL | https://www.photoroom.com |
| 月流量 | 300M+ downloads |
| 定价 | Freemium (Free: 250 exports/月, Pro: $9.99/月) |
| 目标用户 | 电商卖家、Resellers、小品牌 |

## 核心功能（我们要做的）

### 必做（Core）
1. **一键背景移除** — 上传图片，AI 自动识别前景并移除背景
2. **透明/白色/自定义背景** — 支持导出透明 PNG 或指定颜色背景
3. **批量处理** — 一次上传多张图片批量处理

### 可选（Nice to have）
4. **边缘精修** — 手动调整边缘区域
5. **AI 背景生成** — 用 AI 生成新背景

## 差异化定位

我们的优势：
- ✅ **完全免费** — 每天无限次使用（vs Photoroom 250次/月）
- ✅ **无需注册** — 即用即走，无账号系统
- ✅ **无水印** — 免费也不加水印
- ✅ **本地处理选项** — 隐私友好，图片可本地处理
- ✅ **简单直接** — 无 cluttered UI，专注核心功能

## 用户痛点（我们要解决的）

| 痛点 | 来源 | 我们的方案 |
|------|------|-----------|
| "overly expensive" | Reddit r/Flipping | 完全免费 |
| "cluttering up the app with little cutesy backgrounds" | Reddit | 简洁 UI，只做核心功能 |
| "limited control over the final image" | Reddit | 提供边缘调整工具 |
| "keep messing with the UI" | Reddit | 稳定、简单的界面 |
| "需要注册才能用" | G2 Reviews | 无需注册 |

## 截流关键词

### Primary（首页 SEO）
- `photoroom alternative`
- `photoroom free`
- `free background remover`
- `remove background from image`

### Secondary（独立页面）
- `photoroom vs remove.bg`
- `photoroom vs pixelcut`
- `best photoroom alternatives 2026`

### Long-tail（Programmatic SEO）
- `photoroom alternative no watermark`
- `photoroom alternative no signup`
- `free background remover for product photos`
- `background remover for ecommerce`
- `remove background from [object] photo` (product, jewelry, shoes, etc.)

## 技术方案

### 架构
- **前端**: React + Vite (TypeScript) + TailwindCSS
- **后端**: Python FastAPI
- **AI 模型**: rembg (基于 U-2-Net)
- **部署**: Docker → langsheng
- **域名**: `bg-remover.demo.densematrix.ai`

### 后端 API
```
POST /api/v1/remove-background
  - Input: image file (multipart/form-data)
  - Output: processed image (PNG with transparent bg)
  - Headers: X-Device-Id for free trial tracking

GET /api/v1/health
  - Health check endpoint

GET /metrics
  - Prometheus metrics
```

### 端口分配
- Frontend: 30095
- Backend: 30096

## 完成标准
- [ ] 核心功能可用（上传→去背→下载）
- [ ] 部署到 bg-remover.demo.densematrix.ai
- [ ] SEO 截流关键词已覆盖
- [ ] 7 种语言 i18n
- [ ] Creem 支付集成
- [ ] Health check 通过
