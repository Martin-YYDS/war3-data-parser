# War3数据JSON包体优化完整指南

## 📊 压缩成果总结

### 已实现的压缩效果
| 文件 | 原始大小 | 压缩后 | 节省 | 压缩率 |
|------|---------|--------|------|--------|
| units.json | 4.20 MB | 1.79 MB | 2.41 MB | **58.3%** |
| abilities.json | 1.80 MB | 830 KB | 976 KB | **55.1%** |
| items.json | 295 KB | 191 KB | 104 KB | **35.2%** |
| buffs.json | 219 KB | 78 KB | 141 KB | **64.5%** |
| destructables.json | 323 KB | 211 KB | 112 KB | **34.6%** |
| doodads.json | 473 KB | 323 KB | 150 KB | **31.7%** |
| misc.json | 142 KB | 8.0 KB | 134 KB | **94.4%** |
| txt.json | 64 KB | 9.6 KB | 54 KB | **85.0%** |
| upgrade.json | 98 KB | 58 KB | 40 KB | **40.7%** |
| **总计** | **7.58 MB** | **3.42 MB** | **4.16 MB** | **54.9%** |

---

## 🎯 压缩策略详解

### 1. 字段名映射（主要压缩源）
**原理**: 将高频字段名替换为短字符串

**映射示例**:
```javascript
// 原始
{
  "section": "Ecen",
  "_id": "Ecen",
  "_type": "unit",
  "name": "半神人",
  "goldcost": 425,
  "missileart_1": "Abilities\\Weapons\\..."
}

// 压缩后
{
  "s": "Ecen",
  "i": "Ecen",
  "t": "unit",
  "n": "半神人",
  "gc": 425,
  "ma1": "Abilities/Weapons/..."
}
```

**高频字段映射表** (前20个):
- `section` → `s` (3042次)
- `_id` → `i` (2975次)
- `_type` → `t` (2975次)
- `name` → `n` (2797次)
- `editorsuffix` → `es` (2283次)
- `art` → `a` (2064次)
- `hotkey` → `hk` (2064次)
- `tip` → `tp` (2064次)
- `ubertip` → `ut` (2064次)
- `requires` → `r` (2064次)
- `buttonpos_1` → `bp1` (1997次)
- `buttonpos_2` → `bp2` (1997次)
- `race` → `rc` (1969次)
- `targetart` → `ta` (1947次)
- `specialart` → `sa` (1947次)
- `file` → `f` (1825次)

### 2. 冗余字段移除
**移除的字段**:
- `_name` - 与name重复
- `_code` - 与section/id重复
- `onUserSpecified` - 编辑器内部字段
- `raceInEditor` - 编辑器内部字段
- `valid` - 验证字段
- `sort` - 排序字段
- `tech` - 技术字段
- `unitClass` - 类别字段

### 3. 值优化
- **路径分隔符**: `\\` → `/` (减少转义字符)
- **空值处理**: 移除null和空字符串
- **数值精度**: 浮点数保留3位小数
- **空数组**: 直接移除

---

## 🚀 其他压缩方案建议

### 方案A: 二进制格式 (最高压缩率)
**推荐工具**: Protocol Buffers, MessagePack, BSON

**优势**:
- 压缩率可达 **70-80%**
- 解析速度更快
- 类型安全

**实现示例**:
```javascript
// 使用MessagePack
const msgpack = require('msgpack-lite');

// 压缩
const compressed = msgpack.encode(data);
fs.writeFileSync('data.msgpack', compressed);

// 解压
const decoded = msgpack.decode(fs.readFileSync('data.msgpack'));
```

**预期效果**: 7.58 MB → ~1.5 MB (80%压缩率)

---

### 方案B: 分片存储 + 按需加载
**原理**: 将数据按类别/种族/等级分片，只加载需要的部分

**目录结构**:
```
data/
├── units/
│   ├── nightelf.json (1.2 MB)
│   ├── human.json (800 KB)
│   ├── orc.json (750 KB)
│   └── undead.json (700 KB)
├── abilities/
│   ├── hero.json (600 KB)
│   ├── unit.json (800 KB)
│   └── item.json (400 KB)
└── items/
    └── all.json (191 KB)
```

**优势**:
- 首次加载只下载需要的数据
- 缓存更高效
- 便于增量更新

---

### 方案C: 混合压缩 (推荐)
**结合多种策略**:

1. **字段映射** (已实现) - 54.9%压缩率
2. **Gzip/Brotli压缩** - 额外 60-70%
3. **按需分片** - 减少初始加载

**实现步骤**:
```javascript
const zlib = require('zlib');
const fs = require('fs');

// 1. 字段映射压缩 (已实现)
const compressed = compressJson(data);

// 2. Gzip压缩存储
const gzipped = zlib.gzipSync(JSON.stringify(compressed));
fs.writeFileSync('data.json.gz', gzipped);

// 3. 读取时解压
const data = JSON.parse(
  zlib.gunzipSync(fs.readFileSync('data.json.gz')).toString()
);
```

**预期效果**: 7.58 MB → ~1.2 MB (84%压缩率)

---

### 方案D: 数据库存储
**使用SQLite或IndexedDB**:

```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('war3.db');

// 存储为键值对
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS units (id TEXT PRIMARY KEY, data TEXT)");

  // 批量插入
  const stmt = db.prepare("INSERT OR REPLACE INTO units VALUES (?, ?)");
  data.forEach(unit => {
    stmt.run(unit.i, JSON.stringify(unit));
  });
  stmt.finalize();
});

// 查询
db.get("SELECT data FROM units WHERE id = ?", ['Ecen'], (err, row) => {
  const unit = JSON.parse(row.data);
});
```

**优势**:
- 支持复杂查询
- 内存占用低
- 天然支持索引

---

### 方案E: WebAssembly + 二进制格式
**极致性能方案**:

1. 使用Rust/C++编写解析器
2. 编译为WebAssembly
3. 自定义二进制格式

**压缩率**: 可达 **85-90%**

---

## 📈 压缩方案对比

| 方案 | 压缩率 | 速度 | 复杂度 | 推荐度 |
|------|--------|------|--------|--------|
| **字段映射** | 55% | ⭐⭐⭐⭐⭐ | 低 | ⭐⭐⭐⭐⭐ |
| **字段映射 + Gzip** | 84% | ⭐⭐⭐⭐ | 中 | ⭐⭐⭐⭐⭐ |
| **MessagePack** | 75% | ⭐⭐⭐⭐⭐ | 中 | ⭐⭐⭐⭐ |
| **分片存储** | 60%* | ⭐⭐⭐⭐ | 中 | ⭐⭐⭐⭐ |
| **数据库** | 50% | ⭐⭐⭐ | 高 | ⭐⭐⭐ |
| **WASM二进制** | 85% | ⭐⭐⭐⭐⭐ | 很高 | ⭐⭐ |

*分片存储的压缩率取决于使用频率

---

## 🛠️ 推荐实施方案

### 最佳实践: 渐进式优化

**阶段1**: ✅ 已完成 - 字段映射压缩
- 54.9%压缩率
- 保持JSON可读性
- 易于集成

**阶段2**: 推荐 - 添加Gzip压缩
```bash
# 在服务器端启用Gzip
# 或在构建时压缩
gzip -9 data_compressed/*.json
```

**阶段3**: 可选 - 按需分片
```javascript
// 只加载需要的数据
async function loadUnit(id) {
  const data = await fetch(`/api/units/${id}`);
  return data.json();
}
```

---

## 📦 使用压缩后的数据

### 方法1: 使用解压函数
```javascript
const { decompressJson } = require('./compress.js');
const compressed = require('./data_compressed/units_compressed.json');
const original = decompressJson(compressed);
```

### 方法2: 直接使用压缩字段名
```javascript
// 修改代码直接使用短字段名
const unit = compressedData[0];
console.log(unit.n);  // name
console.log(unit.gc); // goldcost
```

### 方法3: 浏览器端解压
```javascript
// 如果使用Gzip压缩
const response = await fetch('data.json.gz');
const buffer = await response.arrayBuffer();
const decompressed = pako.ungzip(buffer);
const data = JSON.parse(new TextDecoder().decode(decompressed));
```

---

## 🎯 总结建议

### 对于Web应用:
1. **立即使用**: 字段映射 + Gzip (84%压缩率)
2. **按需加载**: 分片存储
3. **缓存策略**: Service Worker + IndexedDB

### 对于本地应用:
1. **直接使用**: 字段映射压缩
2. **存储格式**: SQLite
3. **内存优化**: 流式解析

### 对于移动端:
1. **极致压缩**: MessagePack + Gzip
2. **离线支持**: 本地数据库
3. **增量更新**: 差分压缩

---

## 🔗 相关文件

- `compress.js` - 压缩脚本
- `data_compressed/` - 压缩后的数据
- `COMPRESS_MAPPING.md` - 字段映射表
- `OPTIMIZATION_GUIDE.md` - 本指南

---

**当前压缩率**: **54.9%** (7.58 MB → 3.42 MB)
**可进一步优化至**: **84%** (7.58 MB → 1.2 MB) 使用Gzip
