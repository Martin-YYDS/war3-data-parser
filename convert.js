#!/usr/bin/env node

/**
 * 数据转换CLI工具
 * 将CSV数据转换为JSON格式
 */

const fs = require('fs');
const path = require('path');

// 简单的CSV解析器
function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length < 2) return [];

  // 解析表头
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  // 解析数据行
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVLine(line);
    const obj = {};

    headers.forEach((header, index) => {
      let value = values[index] || '';
      value = value.trim().replace(/^"|"$/g, '');

      // 转换数字
      if (value !== '' && !isNaN(Number(value))) {
        obj[header] = Number(value);
      } else if (value === '') {
        obj[header] = null;
      } else {
        obj[header] = value;
      }
    });

    data.push(obj);
  }

  return data;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// 主转换函数
function convertData(inputDir, outputDir) {
  console.log('🚀 开始转换数据...\n');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = [
    { input: 'unit.csv', output: 'units.json', name: '单位' },
    { input: 'ability.csv', output: 'abilities.json', name: '技能' },
    { input: 'item.csv', output: 'items.json', name: '物品' },
    { input: 'buff.csv', output: 'buffs.json', name: 'Buff' },
    { input: 'destructable.csv', output: 'destructables.json', name: '可破坏物' },
    { input: 'doodad.csv', output: 'doodads.json', name: '装饰物' },
    { input: 'misc.csv', output: 'misc.json', name: '杂项' },
    { input: 'txt.csv', output: 'txt.json', name: '文本' },
    { input: 'upgrade.csv', output: 'upgrade.json', name: '升级' }
  ];

  let successCount = 0;

  files.forEach(file => {
    const inputPath = path.join(inputDir, file.input);
    const outputPath = path.join(outputDir, file.output);

    if (fs.existsSync(inputPath)) {
      try {
        const data = parseCSV(inputPath);
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
        console.log(`✅ ${file.name.padEnd(8)} (${file.input}) → ${data.length} 条数据`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${file.name} 转换失败:`, error.message);
      }
    } else {
      console.log(`⚠️  跳过 ${file.name} (${file.input} 不存在)`);
    }
  });

  console.log(`\n🎉 转换完成! 成功处理 ${successCount}/${files.length} 个文件`);
  console.log(`📁 输出目录: ${outputDir}`);
}

// CLI入口
if (require.main === module) {
  const args = process.argv.slice(2);

  let inputDir = '.';
  let outputDir = './data';

  // 解析命令行参数
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      inputDir = args[i + 1];
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      outputDir = args[i + 1];
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
War3 Data Converter
将CSV数据转换为JSON格式

用法:
  node convert.js [选项]

选项:
  --input <dir>   输入目录 (默认: 当前目录)
  --output <dir>  输出目录 (默认: ./data)
  --help, -h      显示帮助信息

示例:
  node convert.js
  node convert.js --input ../excel --output ./data
  node convert.js --input . --output ../dist/data
      `);
      process.exit(0);
    }
  }

  convertData(inputDir, outputDir);
}

module.exports = { convertData, parseCSV };
