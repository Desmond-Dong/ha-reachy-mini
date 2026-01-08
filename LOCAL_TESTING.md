# 🧪 本地测试指南

## 问题: Custom element not found

如果您看到错误 `Custom element not found: reachy-mini-3d-card`,这是因为卡片还没有被 Home Assistant 加载。

## 解决方案

### 方式 1: 在 Home Assistant 中测试 (推荐)

#### 步骤 1: 等待 GitHub Release 完成

首先确认 GitHub Actions 构建成功:
1. 访问: https://github.com/Desmond-Dong/ha-reachy-mini-card/actions
2. 等待最新的构建变为绿色 ✓ (约 2-5 分钟)
3. 访问: https://github.com/Desmond-Dong/ha-reachy-mini-card/releases/tag/v2.0.0
4. 确认 Release 已创建并且有 `ha-reachy-mini-card.zip` 文件

#### 步骤 2: 通过 HACS 安装

1. 打开 Home Assistant
2. 进入 **HACS** → **Frontend** → **⋮** (右上角菜单)
3. 点击 **Custom repositories**
4. 添加仓库: `https://github.com/Desmond-Dong/ha-reachy-mini-card`
5. 类别选择: **Lovelace**
6. 点击 **Add**
7. 回到 HACS Frontend 页面,搜索 "Reachy Mini 3D Card"
8. 点击下载并等待安装完成
9. **刷新浏览器** (Ctrl+Shift+R)

#### 步骤 3: 添加到 Lovelace

创建或编辑一个 Lovelace 视图:

```yaml
type: custom:reachy-mini-3d-card
daemon_host: localhost
daemon_port: 3333
height: 400
```

#### 步骤 4: 确保 Reachy Mini Daemon 运行

```bash
# 检查 daemon 是否运行
curl http://localhost:3333/api/state/full

# 如果没有运行,启动它
# (根据您的 Reachy Mini 设置方式)
```

### 方式 2: 手动安装 (用于快速测试)

如果您想立即测试而不等待 HACS:

#### 步骤 1: 下载 Release

1. 访问: https://github.com/Desmond-Dong/ha-reachy-mini-card/releases/tag/v2.0.0
2. 下载 `ha-reachy-mini-card.zip`

#### 步骤 2: 解压到 Home Assistant

```bash
# 在 Home Assistant 的配置目录中
mkdir -p www/community/reachy-mini-3d-card
cd www/community/reachy-mini-3d-card

# 解压 zip 文件
unzip /path/to/ha-reachy-mini-card.zip
```

#### 步骤 3: 配置 Lovelace 资源

进入 Home Assistant:
1. **设置** → **仪表盘** → **⋮** → **编辑资源**
2. 点击 **添加资源**
3. 输入:
   ```
   url: /local/community/reachy-mini-3d-card/reachy-mini-3d-card.js
   type: module
   ```
4. 点击 **创建**
5. **刷新浏览器** (Ctrl+Shift+R)

#### 步骤 4: 添加卡片

创建一个测试视图:

```yaml
type: custom:reachy-mini-3d-card
daemon_host: localhost
daemon_port: 3333
height: 400
```

### 方式 3: 本地开发测试 (用于调试)

如果您正在开发中并想立即测试:

#### 步骤 1: 构建本地版本

```bash
cd C:\Users\djhui\OneDrive\Github\ha-reachy-mini-card

# 安装依赖 (如果还没有)
npm install

# 构建 V2
npm run build:v2

# 复制资源
cp -r assets dist/
mkdir -p dist/lib
cp node_modules/urdf-loader/src/URDFLoader.js dist/lib/urdf-loader.js
```

#### 步骤 2: 在本地 HTTP 服务器测试

```bash
# 使用 Python 启动简单的 HTTP 服务器
cd dist
python -m http.server 8000
```

#### 步骤 3: 创建测试 HTML 文件

创建 `test.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Reachy Mini 3D Card Test</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        #card { border: 1px solid #ccc; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>Reachy Mini 3D Card - Local Test</h1>

    <div id="card">
        <reachy-mini-3d-card
            daemon_host="localhost"
            daemon_port="3333"
            height="400">
        </reachy-mini-3d-card>
    </div>

    <!-- 加载依赖 -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/controls/OrbitControls.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/js/loaders/STLLoader.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lit@2.7.0/polyfill-support.js"></script>

    <!-- 加载卡片 -->
    <script type="module" src="http://localhost:8000/reachy-mini-3d-card.js"></script>
</body>
</html>
```

#### 步骤 4: 在浏览器中打开

```
http://localhost:8000/test.html
```

打开浏览器开发者工具 (F12) 查看控制台日志。

## 🔍 故障排查

### 问题 1: "Custom element not found" 错误

**原因**: 卡片脚本未加载

**解决**:
1. 检查浏览器控制台 (F12) 是否有脚本加载错误
2. 确认资源 URL 正确
3. 硬刷新浏览器 (Ctrl+Shift+R)
4. 清除浏览器缓存

### 问题 2: "Connection Failed" 错误

**原因**: 无法连接到 Reachy Mini daemon

**解决**:
```bash
# 测试 daemon 是否运行
curl http://localhost:3333/api/state/full

# 检查防火墙
# Windows
netsh advfirewall firewall show rule name="Reachy Mini Daemon"

# 检查端口
netstat -an | findstr 3333
```

### 问题 3: 机器人模型不显示

**原因**: URDF 或 STL 文件加载失败

**解决**:
1. 打开浏览器控制台 (F12)
2. 查看 Network 标签页
3. 检查 `.urdf` 和 `.stl` 文件是否成功加载
4. 检查文件路径是否正确

### 问题 4: 卡片显示但数据不更新

**原因**: WebSocket 连接未建立或 daemon 未发布数据

**解决**:
1. 查看控制台日志
2. 检查连接状态指示器:
   - 🟢 绿色 = 已连接
   - 🔴 红色 = 连接失败
   - 🟡 黄色 = 正在连接
3. 测试 WebSocket:
   ```javascript
   // 在浏览器控制台运行
   const ws = new WebSocket('ws://localhost:3333/api/state/ws/full');
   ws.onmessage = (e) => console.log(JSON.parse(e.data));
   ```

## 📊 验证清单

发布前请确认:

- [ ] GitHub Actions 构建成功 (绿色 ✓)
- [ ] Release 页面已创建
- [ ] `ha-reachy-mini-card.zip` 可下载
- [ ] zip 文件包含所有必需文件:
  - [ ] reachy-mini-3d-card.js
  - [ ] reachy-mini-3d-card.js.map
  - [ ] assets/reachy-mini.urdf
  - [ ] assets/meshes/*.stl (45个文件)
  - [ ] lib/urdf-loader.js
- [ ] HACS 可以搜索到项目
- [ ] HACS 可以下载安装
- [ ] 在 Home Assistant 中加载成功
- [ ] 卡片显示 3D 模型
- [ ] WebSocket 连接成功 (绿色指示器)
- [ ] 机器人数据实时更新

## 🎯 下一步

1. **等待构建完成** (2-5 分钟)
2. **验证 Release**: 检查 GitHub Release 页面
3. **安装测试**: 通过 HACS 或手动方式安装
4. **功能测试**: 测试所有功能是否正常
5. **文档更新**: 如需要,更新文档
6. **发布到 HACS 默认仓库** (可选)

---

**当前状态**: 🟢 等待 GitHub Actions 构建完成

请稍等片刻,构建完成后即可进行测试! 🚀
