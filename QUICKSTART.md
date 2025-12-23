# 快速开始指南

## 安装和使用

### 1. 安装依赖

```bash
npm install
```

### 2. 转换数据（如果还没有JSON数据）

```bash
# 将CSV转换为JSON
npm run convert

# 或者指定输入输出目录
npm run convert -- --input ../ --output ./data
```

### 3. 运行测试

```bash
npm test
```

### 4. 运行示例

```bash
# JavaScript示例
npm run example

# TypeScript示例（需要安装ts-node）
npm run example:ts
```

## 快速使用

### JavaScript

```javascript
const { War3DataParser } = require('./dist/index');

const parser = new War3DataParser('./data');
parser.load();

// 查找单位
const hero = parser.query.findUnitById('Edem');
console.log(hero.name); // "恶魔猎手"

// 搜索物品
const items = parser.query.searchItemsByKeyword('召唤');
console.log(items.data.length); // 26
```

### TypeScript

```typescript
import { War3DataParser } from './dist/index';

const parser = new War3DataParser('./data');
parser.load();

// 类型安全的查询
const hero = parser.query.findUnitById('Edem');
if (hero) {
  console.log(`${hero.name} - HP: ${hero.hp}`);
}
```

## 项目结构

```
war3-data-parser/
├── src/                    # TypeScript源代码
│   ├── index.ts           # 主入口
│   ├── types.ts           # 类型定义
│   ├── data-loader.ts     # 数据加载器
│   ├── query.ts           # 查询工具
│   └── converter.ts       # 转换器
├── data/                  # JSON数据文件
│   ├── units.json
│   ├── abilities.json
│   ├── items.json
│   ├── buffs.json
│   └── ...
├── dist/                  # 编译后的JavaScript
├── convert.js             # CSV转JSON工具
├── example.js             # JavaScript示例
├── example.ts             # TypeScript示例
├── test.ts                # 测试脚本
└── README.md              # 完整文档
```

## 数据文件说明

| 文件 | 数据量 | 说明 |
|------|--------|------|
| units.json | 836 | 单位和英雄 |
| abilities.json | 799 | 技能 |
| items.json | 273 | 物品 |
| buffs.json | 245 | Buff效果 |
| destructables.json | 247 | 可破坏物 |
| doodads.json | 469 | 装饰物 |
| misc.json | 17 | 杂项 |
| txt.json | 67 | 文本 |
| upgrade.json | 89 | 升级 |

## 常用查询示例

```typescript
// 1. 查找所有英雄
const heroes = parser.query.findUnits({
  filter: { level: 5 },
  limit: 50
});

// 2. 按种族查询
const nightelf = parser.query.findUnitsByRace('nightelf');

// 3. 模糊搜索
const fire = parser.query.searchUnitsByKeyword('火');

// 4. 获取单位技能
const unit = parser.query.findUnitById('Edem');
const abilities = parser.query.getUnitAbilities(unit);

// 5. 高级过滤
const strongCheap = parser.query.findUnits({
  filter: { hp: 500, goldcost: 425 },
  sort: ['name']
});
```

## 开发命令

```bash
npm run build      # 编译TypeScript
npm run dev        # 监听模式编译
npm run test       # 运行测试
npm run example    # 运行示例
npm run convert    # 转换数据
```

## 下一步

查看 [README.md](./README.md) 获取完整的API文档和更多示例。
