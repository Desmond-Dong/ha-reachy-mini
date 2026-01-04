# ⚠️ 重要:需要生成 package-lock.json

## 问题
GitHub Actions 构建失败,因为缺少 `package-lock.json` 文件。

## 解决方法

### 方法 1:在本地生成(推荐)

在你的终端中执行:

```bash
cd C:\Users\djhui\OneDrive\Github\ha-reachy-mini-card
npm install
npm run build
git add package-lock.json reachy-mini-3d-card.js
git commit -m "Add build artifacts and lock file"
git push
```

### 方法 2:在 GitHub Actions 中禁用缓存

如果无法在本地运行 npm,可以修改 `.github/workflows/build-release.yml`:

找到第 32 行:
```yaml
cache: 'npm'
```

改为:
```yaml
# cache: 'npm'  # 暂时禁用缓存
```

然后提交并推送。

## 文件说明

- `package-lock.json`: npm 自动生成的依赖锁定文件
- `reachy-mini-3d-card.js`: 构建后的卡片主文件(HACS 必需)

## HACS 要求

HACS 需要根目录有以下文件:
- ✅ `hacs.json`
- ✅ `README.md`
- ❌ `reachy-mini-3d-card.js` (需要构建)
- ❌ `package-lock.json` (需要生成)

构建完成后,你的仓库将完全符合 HACS 要求!
