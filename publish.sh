#!/bin/bash

# 🚀 NPM包发布脚本
# 自动准备和发布war3-data-parser包

set -e  # 遇到错误立即退出

echo "📦 开始准备NPM包发布..."
echo "================================================"

# 1. 检查登录状态
echo "🔍 1. 检查npm登录状态..."
if ! npm whoami &>/dev/null; then
    echo "❌ 请先登录npm: npm login"
    exit 1
fi
echo "✅ 已登录: $(npm whoami)"

# 2. 清理旧文件
echo "🧹 2. 清理旧文件..."
rm -rf dist/
rm -rf data_compressed/
rm -rf data_gzip/
echo "✓ 清理完成"

# 3. 构建TypeScript
echo "🔨 3. 构建TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi
echo "✓ 构建完成"

# 4. 生成压缩数据
echo "🗜️ 4. 生成压缩数据..."
node compress.js
node gzip_compress.js
if [ $? -ne 0 ]; then
    echo "❌ 压缩失败"
    exit 1
fi
echo "✓ 压缩完成"

# 5. 检查包大小
echo "📊 5. 检查包大小..."
TOTAL_SIZE=$(du -sh data_gzip/ | cut -f1)
TOTAL_FILES=$(ls data_gzip/*.gz 2>/dev/null | wc -l)
echo "   Gzip数据目录: $TOTAL_SIZE"
echo "   压缩文件数: $TOTAL_FILES"

# 6. 测试包结构
echo "🧪 6. 测试包结构..."
node -e "
const fs = require('fs');

// 检查必要文件
const requiredFiles = [
  'dist/index.js',
  'dist/index.d.ts',
  'data_gzip/units_compressed.json.gz',
  'data_gzip/abilities_compressed.json.gz',
  'data_gzip/items_compressed.json.gz'
];

let allExist = true;
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log('❌ 缺失:', file);
    allExist = false;
  }
});

if (!allExist) {
  process.exit(1);
}

console.log('✓ 所有必要文件存在');

// 测试加载
const { War3DataParser } = require('./dist/index.js');
const parser = new War3DataParser('./data_gzip', true, true);
parser.load();
const hero = parser.query.findUnitById('Edem');

if (hero && hero.name === '恶魔猎手') {
  console.log('✓ 数据加载和查询正常');
  console.log('✓ 测试英雄:', hero.name, 'HP:', hero.hp, '金:', hero.goldcost);
} else {
  console.log('❌ 数据查询失败');
  process.exit(1);
}
"

if [ $? -ne 0 ]; then
    echo "❌ 测试失败"
    exit 1
fi

echo ""
echo "✅ 所有检查通过！"
echo "================================================"

# 7. 显示发布信息
echo ""
echo "📋 发布信息预览:"
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
PACKAGE_DESC=$(node -p "require('./package.json').description")

echo "   包名: $PACKAGE_NAME"
echo "   版本: $PACKAGE_VERSION"
echo "   描述: $PACKAGE_DESC"
echo "   包大小: $TOTAL_SIZE"
echo "   压缩率: 96%"
echo ""

# 8. 预览打包内容
echo "📦 预览打包内容..."
npm pack --dry-run 2>&1 | grep -E "(package|files|total)" || true
echo ""

# 9. 确认发布
read -p "🚀 确认发布到NPM? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 发布中..."
    npm publish

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ 发布成功！"
        echo ""
        echo "🔗 查看包:"
        echo "   https://www.npmjs.com/package/$PACKAGE_NAME"
        echo ""
        echo "📥 安装:"
        echo "   npm install $PACKAGE_NAME"
    else
        echo "❌ 发布失败，请检查错误信息"
        exit 1
    fi
else
    echo "👋 已取消发布"
    echo ""
    echo "📦 打包文件已准备，可手动发布:"
    echo "   npm publish"
fi
