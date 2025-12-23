/**
 * 测试脚本 - 演示War3数据解析器的使用
 */

import { War3DataParser, createParser, convertExcelData } from './index';

// 测试数据目录
const DATA_DIR = './data';

function runTests() {
  console.log('🧪 War3 Data Parser 测试\n');

  // 检查数据目录
  const fs = require('fs');
  if (!fs.existsSync(DATA_DIR)) {
    console.log('❌ 数据目录不存在，请先运行转换工具:');
    console.log('   node convert.js');
    console.log('   或');
    console.log('   npm run convert\n');
    return;
  }

  // 创建解析器
  const parser = new War3DataParser(DATA_DIR);

  try {
    parser.load();
    console.log('✅ 数据加载成功\n');
  } catch (error) {
    console.error('❌ 数据加载失败:', error);
    return;
  }

  // 显示统计
  const stats = parser.getStats();
  console.log('📊 数据统计:');
  Object.entries(stats).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  console.log();

  // 测试1: 查找英雄单位
  console.log('🔍 测试1: 查找英雄单位');
  const hero = parser.query.findUnitById('Edem');
  if (hero) {
    console.log(`   ID: ${hero._id}`);
    console.log(`   名称: ${hero.name}`);
    console.log(`   种族: ${hero.race}`);
    console.log(`   等级: ${hero.level}`);
    console.log(`   生命: ${hero.hp}`);
    console.log(`   技能: ${hero.abillist}`);
    console.log(`   提示: ${hero.tip}`);
  }
  console.log();

  // 测试2: 按种族查询单位
  console.log('🔍 测试2: 按种族查询单位 (暗夜精灵)');
  const nightelf = parser.query.findUnitsByRace('nightelf', { limit: 5 });
  console.log(`   找到 ${nightelf.total} 个单位，显示前5个:`);
  nightelf.data.forEach(unit => {
    console.log(`   - ${unit.name} (等级 ${unit.level})`);
  });
  console.log();

  // 测试3: 搜索技能
  console.log('🔍 测试3: 搜索技能 (法力)');
  const abilities = parser.query.findAbilitiesByName('法力');
  console.log(`   找到 ${abilities.total} 个技能:`);
  abilities.data.slice(0, 3).forEach(ability => {
    console.log(`   - ${ability.name} (${ability.hotkey}) - ${ability.ubertip?.substring(0, 30)}...`);
  });
  console.log();

  // 测试4: 搜索物品
  console.log('🔍 测试4: 搜索物品 (召唤)');
  const items = parser.query.searchItemsByKeyword('召唤');
  console.log(`   找到 ${items.total} 个物品:`);
  items.data.forEach(item => {
    console.log(`   - ${item.name} (${item.goldcost} 金币)`);
  });
  console.log();

  // 测试5: 获取单位技能
  console.log('🔍 测试5: 获取恶魔猎手的技能');
  const demonHunter = parser.query.findUnitById('Edem');
  if (demonHunter) {
    const abilities = parser.query.getUnitAbilities(demonHunter);
    console.log(`   ${demonHunter.name} 的技能:`);
    abilities.forEach(ability => {
      console.log(`   - ${ability.name} (${ability.hotkey}): ${ability.ubertip?.substring(0, 40)}...`);
    });
  }
  console.log();

  // 测试6: 高级查询
  console.log('🔍 测试6: 高级查询 (等级>4的英雄)');
  const highLevelHeroes = parser.query.findUnits({
    filter: { level: 5 },
    limit: 10
  });
  console.log(`   找到 ${highLevelHeroes.total} 个5级单位 (前5个):`);
  highLevelHeroes.data.slice(0, 5).forEach(unit => {
    console.log(`   - ${unit.name} (${unit.race}) - HP:${unit.hp}, 金:${unit.goldcost}`);
  });
  console.log();

  // 测试7: 物品统计
  console.log('🔍 测试7: 物品价格分布');
  const allItems = parser.query.findItems();
  const cheap = allItems.data.filter(i => i.goldcost < 200).length;
  const mid = allItems.data.filter(i => i.goldcost >= 200 && i.goldcost < 500).length;
  const expensive = allItems.data.filter(i => i.goldcost >= 500).length;
  console.log(`   便宜 (<200): ${cheap} 个`);
  console.log(`   中等 (200-500): ${mid} 个`);
  console.log(`   昂贵 (>=500): ${expensive} 个`);
  console.log();

  console.log('✅ 所有测试完成！');
}

// 如果直接运行此文件
if (require.main === module) {
  runTests();
}

export { runTests };
