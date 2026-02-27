# Freecrawl Dashboard

基于 Freecrawl 的用户界面和管理后台。

## 功能

### 用户功能
- 🔐 用户注册/登录
- 🔑 API Key 管理
- 📊 用量统计
- 📖 API 文档
- ⚙️ 账户设置

### 管理功能
- 👥 用户管理
- 📈 系统统计
- 🔧 配置管理

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 启动生产服务器
pnpm start
```

## 环境变量

```bash
# Freecrawl API
FIRECRAWL_API_URL=http://localhost:3002

# 数据库
DATABASE_URL=postgresql://freecrawl:freecrawl@localhost:5432/freecrawl

# Supabase (可选，用于认证)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key
```

## Docker

```bash
# 构建
docker build -t freecrawl-dashboard .

# 运行
docker run -p 3000:3000 freecrawl-dashboard
```