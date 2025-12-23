# 📦 npm发布前检查清单

## ✅ 配置检查结果

### package.json 配置状态：✅ 良好

**已优化项目：**
- ✅ 包名：`war3-data-parser` (需确认唯一性)
- ✅ 版本：`1.0.0`
- ✅ 主入口：`dist/index.js`
- ✅ 类型定义：`dist/index.d.ts`
- ✅ 文件列表：包含 dist/, README.md, QUICKSTART.md
- ✅ 关键词：10个相关关键词
- ✅ 脚本：build, test, example, convert
- ✅ 引擎要求：Node.js >= 14.0.0

### 需要手动更新的配置

**⚠️ 重要 - 发布前必须修改：**

1. **作者信息** (`package.json` 第28-31行)
```json
"author": {
  "name": "您的名字",        // ← 修改为您的真实姓名
  "email": "您的邮箱"        // ← 修改为您的邮箱
}
```

2. **仓库地址** (`package.json` 第43-46行)
```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/您的用户名/war3-data-parser.git"  // ← 修改
}
```

3. **主页和Bug地址** (`package.json` 第47-50行)
```json
"homepage": "https://github.com/您的用户名/war3-data-parser#readme",  // ← 修改
"bugs": {
  "url": "https://github.com/您的用户名/war3-data-parser/issues"      // ← 修改
}
```

## 📋 发布前检查清单

### 1. 账号准备
- [ ] 已注册npm账号
- [ ] 已验证邮箱
- [ ] 已登录 (`npm login`)

### 2. 包名检查
- [ ] 检查包名是否可用

```bash
npm search war3-data-parser
# 或访问: https://www.npmjs.com/package/war3-data-parser
```

**如果包名已被占用，修改方案：**
```bash
# 编辑 package.json，修改 name 字段
# 例如：
"name": "war3-hd-parser"
"name": "war3-game-data"
"name": "wc3-data-parser"
```

### 3. 代码质量检查
- [ ] dist目录存在且文件完整 ✅
- [ ] TypeScript编译无错误 ✅
- [ ] 测试通过 ✅
- [ ] 示例代码可运行 ✅

### 4. 文档完整性
- [ ] README.md 包含完整API文档 ✅
- [ ] QUICKSTART.md 包含快速开始 ✅
- [ ] 包含使用示例 ✅

### 5. 文件配置
- [ ] package.json的files字段正确 ✅
- [ ] 不需要发布的文件已排除
- [ ] 版本号合理 (1.0.0) ✅

## 🚀 发布步骤

### 方式一：手动发布

```bash
# 1. 进入包目录
cd /Users/hetao/Downloads/war3_xlsx版本数据/war3-data-parser

# 2. 更新package.json（根据上面的提示修改作者和仓库信息）
# 编辑 package.json 文件

# 3. 确保已编译
npm run build

# 4. 检查打包内容
npm pack --dry-run

# 5. 登录npm（如果未登录）
npm login

# 6. 发布
npm publish

# 7. 验证
npm view war3-data-parser
```

### 方式二：使用发布脚本

创建 `publish.sh`：

```bash
#!/bin/bash
set -e

echo "🚀 开始发布到npm..."

# 检查package.json中的作者信息是否已修改
AUTHOR=$(node -p "require('./package.json').author.name")
if [ "$AUTHOR" = "war3-data-parser" ]; then
    echo "❌ 请先修改 package.json 中的作者信息！"
    exit 1
fi

# 清理和编译
echo "📦 清理和编译..."
rm -rf dist/
npm run build

# 检查
echo "🔍 检查打包内容..."
npm pack --dry-run

# 确认
echo ""
read -p "确认发布吗？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消发布"
    exit 1
fi

# 发布
echo "📤 发布中..."
npm publish

echo ""
echo "✅ 发布成功！"
echo "📦 查看: https://www.npmjs.com/package/$(node -p "require('./package.json').name")"
```

使用：
```bash
chmod +x publish.sh
./publish.sh
```

## 🎯 发布后验证

### 检查发布结果

```bash
# 查看包信息
npm view war3-data-parser

# 查看所有版本
npm view war3-data-parser versions --json

# 查看最新版本详情
npm view war3-data-parser@1.0.0
```

### 测试安装

```bash
# 创建测试目录
cd /tmp
mkdir test-war3-parser && cd test-war3-parser

# 初始化
npm init -y

# 安装您的包
npm install war3-data-parser

# 测试使用
node -e "const {War3DataParser} = require('war3-data-parser'); console.log('✅ 安装成功！');"
```

## 🔄 版本更新

### 发布新版本

```bash
# 修复bug (1.0.0 → 1.0.1)
npm version patch
npm publish

# 新功能 (1.0.0 → 1.1.0)
npm version minor
npm publish

# 重大更新 (1.0.0 → 2.0.0)
npm version major
npm publish
```

## ⚠️ 常见问题

### 问题1：包名已被占用
**解决：**
```bash
# 修改 package.json
"name": "your-unique-package-name"

# 重新发布
npm publish
```

### 问题2：版本号已存在
**解决：**
```bash
# 升级版本号
npm version patch

# 重新发布
npm publish
```

### 问题3：未登录
**解决：**
```bash
npm login
# 然后输入用户名、密码、邮箱
```

### 问题4：权限错误
**解决：**
- 确保包名没有被他人占用
- 确保您有权限发布该包名

## 📊 预期发布结果

**包大小：** ~20KB (压缩后)
**包含文件：** 14个
**依赖：** 0个（零依赖）
**支持：** Node.js >= 14, TypeScript

## 🎯 下一步

1. **修改package.json**中的作者和仓库信息
2. **检查包名**是否可用
3. **执行发布**命令
4. **验证发布**结果

---

**准备好了吗？** 修改完package.json后，就可以执行发布命令了！
