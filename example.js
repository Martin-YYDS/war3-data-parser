/**
 * 使用示例 - JavaScript版本
 */

const { War3DataParser } = require('./dist/index');

// 创建解析器实例
const parser = new War3DataParser('./data');

try {
  // 加载数据
  parser.load();
  console.log('✅ 数据加载成功\n');

  // 示例1: 查找特定英雄
  console.log('=== 示例1: 查找恶魔猎手 ===');
  const demonHunter = parser.query.findUnitById('Edem');
  if (demonHunter) {
    console.log(`名称: ${demonHunter.name}`);
    console.log(`种族: ${demonHunter.race}`);
    console.log(`等级: ${demonHunter.level}`);
    console.log(`生命值: ${demonHunter.hp}`);
    console.log(`攻击力: ${demonHunter.dmgplus1}`);
    console.log(`技能: ${demonHunter.abillist}`);
    console.log(`描述: ${demonHunter.ubertip}`);
  }
  console.log();

  // 示例2: 搜索物品
  console.log('=== 示例2: 搜索召唤类物品 ===');
  const summonItems = parser.query.searchItemsByKeyword('召唤');
  console.log(`找到 ${summonItems.total} 个召唤类物品:`);
  summonItems.data.slice(0, 5).forEach(item => {
    console.log(`  - ${item.name} (${item.goldcost}金币): ${item.description}`);
  });
  console.log();

  // 示例3: 按种族统计单位
  console.log('=== 示例3: 按种族统计 ===');
  const races = ['human', 'orc', 'nightelf', 'undead'];
  races.forEach(race => {
    const units = parser.query.findUnitsByRace(race);
    console.log(`${race}: ${units.total} 个单位`);
  });
  console.log();

  // 示例4: 查找技能
  console.log('=== 示例4: 查找法力燃烧技能 ===');
  const manaBurn = parser.query.findAbilitiesByName('法力燃烧');
  manaBurn.data.slice(0, 3).forEach(ability => {
    console.log(`  - ${ability.name} (${ability.hotkey})`);
    console.log(`    消耗: ${ability.cost}`);
    console.log(`    冷却: ${ability.cool}`);
    console.log(`    描述: ${ability.ubertip}`);
  });
  console.log();

  // 示例5: 高级查询 - 高等级英雄
  console.log('=== 示例5: 5级英雄单位 ===');
  const heroes = parser.query.findUnits({
    filter: { level: 5 },
    limit: 10
  });
  console.log(`共找到 ${heroes.total} 个5级单位`);
  heroes.data.slice(0, 5).forEach(hero => {
    console.log(`  - ${hero.name} (${hero.race}) - HP:${hero.hp}, 金:${hero.goldcost}`);
  });
  console.log();

  // 示例6: 获取单位技能详情
  console.log('=== 示例6: 恶魔猎手技能详情 ===');
  const dh = parser.query.findUnitById('Edem');
  if (dh) {
    const abilities = parser.query.getUnitAbilities(dh);
    console.log(`${dh.name} 拥有 ${abilities.length} 个技能:`);
    abilities.forEach(ability => {
      if (ability) {
        console.log(`  - ${ability.name} (${ability.hotkey})`);
      }
    });
  }
  console.log();

  // 显示统计信息
  console.log('=== 数据统计 ===');
  const stats = parser.getStats();
  Object.entries(stats).forEach(([key, value]) => {
    console.log(`${key}: ${value} 条`);
  });

} catch (error) {
  console.error('❌ 错误:', error.message);
}
