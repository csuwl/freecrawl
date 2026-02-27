# 🎉 Freecrawl Docker 部署成功！

## 📅 部署完成时间
2026-02-26 09:42

## 📍 部署位置
`/Users/wl/opencode-project/freecrawl`

---

## ✅ 服务状态

### 所有服务正常运行

| 服务 | 状态 | 端口 | 说明 |
|------|------|------|------|
| **API** | ✅ Up | 3002 | 主要 API 服务 |
| **Playwright** | ✅ Up | - | 浏览器自动化服务 |
| **Redis** | ✅ Up | 6379 | 缓存和队列 |
| **RabbitMQ** | ✅ Healthy | 5672, 15672 | 消息队列（含管理界面） |
| **PostgreSQL** | ✅ Up | 5432 | 任务队列数据库 |

### 健康检查
```bash
$ curl http://localhost:3002/v2/scrape \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com"}'

✅ 返回: {"success": true, "data": {...}}
```

---

## 🚀 使用方法

### 1. 单页爬取 (Scrape)

```bash
curl -X POST http://localhost:3002/v2/scrape \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com"}'
```

**响应示例**：
```json
{
  "success": true,
  "data": {
    "markdown": "# 页面内容",
    "metadata": {
      "title": "页面标题",
      "statusCode": 200,
      "creditsUsed": 1
    }
  }
}
```

### 2. 网站爬取 (Crawl)

```bash
curl -X POST http://localhost:3002/v2/crawl \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com", "limit": 10}'
```

**响应示例**：
```json
{
  "success": true,
  "id": "019c979c-7309-74f8-9076-4f5dbb1eef19",
  "url": "http://localhost:3002/v2/crawl/019c979c-7309-74f8-9076-4f5dbb1eef19"
}
```

### 3. 搜索 (Search)

```bash
curl -X POST http://localhost:3002/v2/search \
  -H 'Content-Type: application/json' \
  -d '{"query": "Freecrawl web scraping", "limit": 5}'
```

### 4. 批量爬取 (Batch Scrape)

```bash
curl -X POST http://localhost:3002/v2/batch/scrape \
  -H 'Content-Type: application/json' \
  -d '{
    "urls": [
      "https://example.com",
      "https://example.org"
    ]
  }'
```

---

## 🔧 管理界面

### Bull Queue 管理面板
```
URL: http://localhost:3002/admin/freecrawl-admin/queues
访问密钥: freecrawl-admin
```

### RabbitMQ 管理界面
```
URL: http://localhost:15672
用户名: guest
密码: guest
```

---

## 📊 性能配置

当前配置（`.env`）：
- **Workers**: 4 per queue
- **并发爬取**: 5 个请求
- **最大并发任务**: 3
- **浏览器池**: 3 个实例

调整性能参数：
```bash
# 编辑 .env
NUM_WORKERS_PER_QUEUE=8      # 增加 worker 数量
CRAWL_CONCURRENT_REQUESTS=10  # 增加并发爬取
MAX_CONCURRENT_JOBS=5         # 增加并发任务数
BROWSER_POOL_SIZE=5           # 增加浏览器池

# 重启服务
docker compose restart api
```

---

## 🛠️ 常用命令

### 服务管理
```bash
# 查看状态
docker compose ps

# 查看日志
docker compose logs -f api

# 重启服务
docker compose restart api

# 停止所有服务
docker compose down

# 启动所有服务
docker compose up -d
```

### 日志查看
```bash
# API 日志
docker compose logs -f api

# 所有服务日志
docker compose logs -f

# 最近 100 行日志
docker compose logs --tail=100 api
```

---

## ⚠️ 注意事项

### 当前限制
1. **无认证**：`USE_DB_AUTHENTICATION=false`，任何人都可以访问
2. **无代理**：未配置代理服务器，可能被某些网站阻止
3. **无 AI 功能**：未配置 `OPENAI_API_KEY`，无法使用 AI 提取等功能

### 启用 AI 功能（可选）
```bash
# 编辑 .env
echo "OPENAI_API_KEY=sk-你的密钥" >> .env

# 重启 API
docker compose restart api
```

### 配置代理（可选）
```bash
# 编辑 .env
echo "PROXY_SERVER=http://127.0.0.1:7890" >> .env

# 重启 Playwright 和 API
docker compose restart playwright-service api
```

---

## 📈 资源使用

### 当前镜像大小
- `ghcr.io/freecrawl/freecrawl: 853MB`
- `ghcr.io/freecrawl/playwright-service: 1.33GB`
- `postgres:17: ~250MB`
- `redis:alpine: 97MB`
- `rabbitmq:3-management: 252MB`

**总计**: 约 2.8GB

### 建议资源配置
- **最低**: 4核 8GB
- **推荐**: 8核 16GB
- **生产**: 16核 32GB

---

## 🎯 下一步

1. **测试爬取**: 使用上面的示例命令测试爬取功能
2. **配置认证**: 如需生产使用，配置 `USE_DB_AUTHENTICATION=true` 和 Supabase
3. **配置代理**: 爬取更多网站时配置代理服务器
4. **优化性能**: 根据机器配置调整 `.env` 中的参数

---

## 📚 文档链接

- **官方文档**: https://docs.freecrawl.dev
- **GitHub**: https://github.com/freecrawl/freecrawl
- **API 参考**: https://docs.freecrawl.dev/api-reference/v2-introduction

---

**部署完成！🎉 开始使用 Freecrawl 进行网页爬取吧！**
