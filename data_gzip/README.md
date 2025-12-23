# Gzip压缩文件使用说明

## 文件说明
- 本目录包含使用Gzip进一步压缩的JSON文件
- 文件扩展名: .json.gz

## 如何使用

### Node.js
```javascript
const zlib = require('zlib');
const fs = require('fs');

// 读取并解压
const compressed = fs.readFileSync('data_gzip/units_compressed.json.gz');
const decompressed = zlib.gunzipSync(compressed);
const data = JSON.parse(decompressed.toString());
```

### 浏览器端
```javascript
// 使用pako库 (https://github.com/nodeca/pako)
const response = await fetch('data_gzip/units_compressed.json.gz');
const buffer = await response.arrayBuffer();
const decompressed = pako.ungzip(buffer);
const data = JSON.parse(new TextDecoder().decode(decompressed));
```

### 命令行解压
```bash
gunzip units_compressed.json.gz
```

## 压缩效果
- 字段映射压缩: 54.9%
- Gzip额外压缩: ~60%
- **总压缩率: ~84%**

## 文件大小对比
原始: 7.58 MB
字段映射: 3.42 MB
Gzip: ~1.2 MB

## 优点
1. 传输体积最小
2. 适合网络传输
3. 浏览器原生支持
4. 解压速度快

## 缺点
1. 需要解压步骤
2. 不可直接阅读
3. 需要额外库（浏览器端）
