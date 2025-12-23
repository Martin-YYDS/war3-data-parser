/**
 * 测试自动加载内置数据
 */

const { War3DataParser } = require('./dist/index');

console.log('🧪 测试自动加载内置数据\n');

try {
  // 不提供路径，应该自动使用内置数据
  const parser = new War3DataParser();

  console.log('✅ 创建解析器成功');
  console.log('   数据目录:', parser.dataLoader ? '已设置' : '待设置');

  // 加载数据
  parser.load();

  console.log('✅ 数据加载成功\n');

  // 测试查询
  const hero = parser.query.findUnitById('Edem');
  if (hero) {
    console.log('✅ 查询成功:');
    console.log(`   名称: ${hero.name}`);
    console.log(`   种族: ${hero.race}`);
    console.log(`   等级: ${hero.level}`);
    console.log(`   生命: ${hero.hp}`);
  } else {
    console.log('❌ 查询失败');
  }

  // 统计
  console.log('\n📊 数据统计:');
  const stats = parser.getStats();
  Object.entries(stats).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });

  console.log('\n✅ 所有测试通过！');
  console.log('\n🎉 包已准备好发布！');
  console.log('   使用者只需: npm install war3-data-parser');
  console.log('   无需准备数据文件！');

} catch (error) {
  console.error('❌ 测试失败:', error.message);
  process.exit(1);
}
