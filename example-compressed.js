/**
 * 压缩数据使用示例
 * 演示如何使用压缩后的数据（节省96%空间）
 */

const { War3DataParser, createParser, getCompressedStats } = require('./dist/index');

console.log('=== War3压缩数据使用示例 ===\n');

// 示例1: 使用原始数据（7.58 MB）
console.log('1️⃣ 原始数据 (7.58 MB)');
try {
  const parserOriginal = new War3DataParser('./data');
  parserOriginal.load();
  const unit = parserOriginal.query.findUnitById('Edem');
  console.log(`   加载成功: ${unit.name} (${unit.hp} HP)`);
  console.log(`   数据大小: ~7.58 MB\n`);
} catch (error) {
  console.log(`   ❌ ${error.message}\n`);
}

// 示例2: 使用字段映射压缩数据 (3.42 MB - 节省55%)
console.log('2️⃣ 字段映射压缩 (3.42 MB - 节省55%)');
try {
  const parserCompressed = new War3DataParser('./data_compressed', true);
  parserCompressed.load();
  const unit = parserCompressed.query.findUnitById('Edem');
  console.log(`   加载成功: ${unit.name} (${unit.hp} HP)`);
  console.log(`   数据大小: ~3.42 MB`);
  console.log(`   ⚡ 节省: 4.16 MB\n`);
} catch (error) {
  console.log(`   ❌ ${error.message}\n`);
}

// 示例3: 使用Gzip压缩数据 (0.30 MB - 节省96%) ⭐ 推荐
console.log('3️⃣ Gzip压缩 (0.30 MB - 节省96%) ⭐ 推荐');
try {
  const parserGzip = new War3DataParser('./data_gzip', true, true);
  parserGzip.load();
  const unit = parserGzip.query.findUnitById('Edem');
  console.log(`   加载成功: ${unit.name} (${unit.hp} HP)`);
  console.log(`   数据大小: ~0.30 MB`);
  console.log(`   ⚡ 节省: 7.28 MB (96%)\n`);
} catch (error) {
  console.log(`   ❌ ${error.message}\n`);
}

// 示例4: 使用快捷函数
console.log('4️⃣ 快捷函数 - 一行代码加载');
try {
  const parser = createParser('./data_gzip', true, true);
  const demonHunter = parser.query.findUnitById('Edem');
  const manaBurn = parser.query.findAbilitiesByName('法力燃烧');

  console.log(`   英雄: ${demonHunter.name}`);
  console.log(`   生命: ${demonHunter.hp}, 金: ${demonHunter.goldcost}`);
  console.log(`   技能: ${manaBurn.data[0].name} (${manaBurn.data[0].hotkey})`);
  console.log(`   描述: ${manaBurn.data[0].ubertip}\n`);
} catch (error) {
  console.log(`   ❌ ${error.message}\n`);
}

// 示例5: 获取压缩统计
console.log('5️⃣ 压缩数据统计');
try {
  const stats = getCompressedStats('./data_gzip');
  if (stats.error) {
    console.log(`   ❌ ${stats.error}\n`);
  } else {
    console.log(`   文件大小:`);
    Object.entries(stats.sizes).forEach(([name, size]) => {
      console.log(`     - ${name}: ${size}`);
    });
    console.log(`   总计: ${stats.totalSize.toFixed(1)} MB`);
    console.log(`   数据条目: ${stats.stats.units} 单位, ${stats.stats.abilities} 技能, ${stats.stats.items} 物品\n`);
  }
} catch (error) {
  console.log(`   ❌ ${error.message}\n`);
}

// 示例6: 性能对比
console.log('6️⃣ 性能对比测试');
async function performanceTest() {
  const iterations = 100;

  // 测试原始数据
  console.log(`   测试 ${iterations} 次查询...`);

  const startOriginal = Date.now();
  const parserOriginal = new War3DataParser('./data');
  parserOriginal.load();
  for (let i = 0; i < iterations; i++) {
    parserOriginal.query.findUnitById('Edem');
  }
  const timeOriginal = Date.now() - startOriginal;

  // 测试压缩数据
  const startCompressed = Date.now();
  const parserCompressed = new War3DataParser('./data_gzip', true, true);
  parserCompressed.load();
  for (let i = 0; i < iterations; i++) {
    parserCompressed.query.findUnitById('Edem');
  }
  const timeCompressed = Date.now() - startCompressed;

  console.log(`   原始数据: ${timeOriginal}ms`);
  console.log(`   压缩数据: ${timeCompressed}ms`);
  console.log(`   性能差异: ${((timeCompressed / timeOriginal - 1) * 100).toFixed(1)}%`);
}

performanceTest().catch(console.error);

// 示例7: 完整查询演示
setTimeout(() => {
  console.log('\n7️⃣ 完整查询演示 (使用压缩数据)');
  try {
    const parser = createParser('./data_gzip', true, true);

    // 查询5级英雄
    const heroes = parser.query.findUnits({
      filter: { level: 5 },
      limit: 5
    });

    console.log(`   5级英雄 (${heroes.total}个):`);
    heroes.data.forEach(hero => {
      console.log(`     - ${hero.name} (${hero.race}) HP:${hero.hp} 金:${hero.goldcost}`);
    });

    // 搜索召唤类物品
    const items = parser.query.searchItemsByKeyword('召唤');
    console.log(`\n   召唤类物品 (${items.total}个):`);
    items.data.slice(0, 3).forEach(item => {
      console.log(`     - ${item.name} (${item.goldcost}金): ${item.description.substring(0, 20)}...`);
    });

    // 获取单位技能
    const dh = parser.query.findUnitById('Edem');
    const abilities = parser.query.getUnitAbilities(dh);
    console.log(`\n   恶魔猎手技能 (${abilities.length}个):`);
    abilities.forEach(ability => {
      if (ability) {
        console.log(`     - ${ability.name} (${ability.hotkey})`);
      }
    });

    console.log('\n✅ 所有示例运行完成！');
  } catch (error) {
    console.log(`\n❌ 错误: ${error.message}`);
  }
}, 1000);
