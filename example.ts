/**
 * 使用示例 - TypeScript版本
 */

import { War3DataParser, createParser, Unit, Ability, Item } from './src/index';

// 示例1: 基本使用
function basicUsage() {
  console.log('=== 示例1: 基本使用 ===\n');

  const parser = new War3DataParser('./data');
  parser.load();

  // 查找单位
  const unit = parser.query.findUnitById('Edem');
  if (unit) {
    console.log(`找到单位: ${unit.name} (${unit.race})`);
    console.log(`等级: ${unit.level}, HP: ${unit.hp}, 金: ${unit.goldcost}`);
  }

  // 查找技能
  const ability = parser.query.findAbilityById('AEmb');
  if (ability) {
    console.log(`找到技能: ${ability.name} (${ability.hotkey})`);
  }

  // 查找物品
  const item = parser.query.findItemById('amrc');
  if (item) {
    console.log(`找到物品: ${item.name} (${item.goldcost}金币)`);
  }
  console.log();
}

// 示例2: 高级查询
function advancedQuery() {
  console.log('=== 示例2: 高级查询 ===\n');

  const parser = createParser('./data');

  // 查询所有暗夜精灵英雄
  const nightelfHeroes = parser.query.findUnits({
    filter: { race: 'nightelf', level: 5 },
    limit: 10,
    sort: ['name']
  });

  console.log(`找到 ${nightelfHeroes.total} 个暗夜精灵5级单位`);
  nightelfHeroes.data.slice(0, 5).forEach((unit: Unit) => {
    console.log(`  - ${unit.name} (HP: ${unit.hp}, 攻: ${unit.dmgplus1})`);
  });
  console.log();
}

// 示例3: 模糊搜索
function fuzzySearch() {
  console.log('=== 示例3: 模糊搜索 ===\n');

  const parser = createParser('./data');

  // 搜索包含"召唤"的物品
  const items = parser.query.searchItemsByKeyword('召唤');
  console.log(`搜索"召唤"找到 ${items.total} 个物品:`);
  items.data.slice(0, 5).forEach((item: Item) => {
    console.log(`  - ${item.name} (${item.goldcost}金币)`);
  });

  // 搜索包含"燃烧"的技能
  const abilities = parser.query.findAbilitiesByName('燃烧');
  console.log(`\n搜索"燃烧"找到 ${abilities.total} 个技能:`);
  abilities.data.slice(0, 3).forEach((ability: Ability) => {
    console.log(`  - ${ability.name} (${ability.hotkey})`);
  });
  console.log();
}

// 示例4: 关联查询
function relationalQuery() {
  console.log('=== 示例4: 关联查询 ===\n');

  const parser = createParser('./data');

  // 获取恶魔猎手及其技能
  const dh = parser.query.findUnitById('Edem');
  if (dh) {
    const abilities = parser.query.getUnitAbilities(dh);
    console.log(`${dh.name} 的技能列表:`);
    abilities.forEach((ability: Ability) => {
      console.log(`  - ${ability.name} (${ability.hotkey})`);
      console.log(`    消耗: ${ability.cost}`);
      console.log(`    描述: ${ability.ubertip?.substring(0, 50)}...`);
    });
  }
  console.log();
}

// 示例5: 数据分析
function dataAnalysis() {
  console.log('=== 示例5: 数据分析 ===\n');

  const parser = createParser('./data');

  // 物品价格分布
  const items = parser.query.findItems();
  const cheap = items.data.filter(i => i.goldcost < 200).length;
  const mid = items.data.filter(i => i.goldcost >= 200 && i.goldcost < 500).length;
  const expensive = items.data.filter(i => i.goldcost >= 500).length;

  console.log('物品价格分布:');
  console.log(`  便宜 (<200): ${cheap} 个 (${(cheap/items.total*100).toFixed(1)}%)`);
  console.log(`  中等 (200-500): ${mid} 个 (${(mid/items.total*100).toFixed(1)}%)`);
  console.log(`  昂贵 (>=500): ${expensive} 个 (${(expensive/items.total*100).toFixed(1)}%)`);

  // 种族分布
  const races = ['human', 'orc', 'nightelf', 'undead'];
  console.log('\n种族单位分布:');
  races.forEach(race => {
    const units = parser.query.findUnitsByRace(race);
    console.log(`  ${race}: ${units.total} 个`);
  });

  // 统计信息
  console.log('\n总体统计:');
  const stats = parser.getStats();
  Object.entries(stats).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.log();
}

// 主函数
function main() {
  console.log('🧪 War3 Data Parser - TypeScript 示例\n');

  try {
    basicUsage();
    advancedQuery();
    fuzzySearch();
    relationalQuery();
    dataAnalysis();

    console.log('✅ 所有示例运行完成！');
  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main();
}

export { main };
