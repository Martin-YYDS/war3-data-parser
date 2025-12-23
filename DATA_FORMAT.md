# 📊 数据格式说明

## 📁 数据文件结构

所有数据文件都是 **JSON数组格式**，每个元素是一个对象。

---

## 1. 单位数据 (units.json)

**字段说明：**

```json
{
  "section": "Ecen",                    // 区段标识
  "_id": "Ecen",                        // 唯一ID
  "_name": "cenarius",                  // 内部名称
  "_type": "unit",                      // 类型
  "abillist": "AInv,SCc1",              // 技能列表（逗号分隔）
  "acquire": 1000,                      // 攻击距离
  "agi": 15,                            // 敏捷
  "agiplus": 0.6,                       // 敏捷成长
  "armor": "Flesh",                     // 护甲类型
  "art": "ReplaceableTextures\\CommandButtons\\BTNKeeperOfTheGrove.blp",  // 图标路径
  "atktype1": "chaos",                  // 攻击类型1
  "atktype2": "hero",                   // 攻击类型2
  "goldcost": 425,                      // 金币消耗
  "lumbercost": 100,                    // 木材消耗
  "hp": 2675,                           // 生命值
  "mana0": 200,                         // 初始魔法值
  "manan": 55,                          // 魔法值上限
  "level": 5,                           // 等级
  "name": "半神人",                     // 显示名称
  "primary": "INT",                     // 主属性（STR/AGI/INT）
  "race": "nightelf",                   // 种族
  "regenhp": 3.0,                       // 生命恢复
  "regenmana": 2.0,                     // 魔法恢复
  "str": 17,                            // 力量
  "strplus": 4.0,                       // 力量成长
  "spd": 400,                           // 移动速度
  "sight": 1800,                        // 视野范围
  "tip": "召唤赛纳留斯(|cffffcc00C|r)", // 提示
  "ubertip": "召唤半神人赛纳留斯...",    // 详细提示
  "description": ""                     // 描述
}
```

**常用查询字段：**
- `_id` - 唯一标识符
- `name` - 显示名称
- `race` - 种族 (human/orc/nightelf/undead)
- `level` - 等级
- `hp` - 生命值
- `goldcost` - 金币消耗
- `primary` - 主属性
- `abillist` - 技能列表

---

## 2. 技能数据 (abilities.json)

**字段说明：**

```json
{
  "section": "AEmb",                    // 区段标识
  "_code": "AEmb",                      // 技能代码
  "_id": "AEmb",                        // 唯一ID
  "_max_level": 4,                      // 最大等级
  "_type": "ability",                   // 类型
  "name": "法力燃烧",                   // 显示名称
  "art": "ReplaceableTextures\\CommandButtons\\BTNManaBurn.blp",  // 图标
  "hotkey": "B",                        // 快捷键
  "cost": "50,50,50,50",                // 魔法消耗（每级）
  "cool": "7.0,6.0,5.0,4.0",            // 冷却时间（每级）
  "dataa": "50,100,150,200",            // 数据A（伤害/数值）
  "datab": "0,0,0,0",                   // 数据B
  "dur": "0,0,0,0",                     // 持续时间
  "hero": 1,                            // 是否英雄技能
  "levels": 4,                          // 等级数
  "race": "nightelf",                   // 种族
  "targs": "ground,air,enemy,organic",  // 目标类型
  "tip": "法力燃烧(|cffffcc00B|r)",     // 提示
  "ubertip": "燃烧敌人的魔法值...",     // 详细描述
  "order": "manaburn"                   // 命令
}
```

**常用查询字段：**
- `_id` - 唯一标识符
- `name` - 显示名称
- `hotkey` - 快捷键
- `hero` - 是否英雄技能 (1=是, 0=否)
- `race` - 种族
- `cost` - 魔法消耗
- `cool` - 冷却时间

---

## 3. 物品数据 (items.json)

**字段说明：**

```json
{
  "section": "amrc",                    // 区段标识
  "_id": "amrc",                        // 唯一ID
  "_type": "item",                      // 类型
  "abillist": "AIrt",                   // 技能列表
  "armor": "Wood",                      // 护甲类型
  "art": "ReplaceableTextures\\CommandButtons\\BTNAmulet.blp",  // 图标
  "buttonpos_1": 0,                     // 按钮位置X
  "buttonpos_2": 0,                     // 按钮位置Y
  "class": "Miscellaneous",             // 分类
  "cooldownid": "AIrt",                 // 冷却ID
  "description": "能将单位传送到使用者身边。",  // 描述
  "drop": 0,                            // 是否可掉落
  "droppable": 1,                       // 是否可丢弃
  "file": "Objects\\InventoryItems\\TreasureChest\\treasurechest.mdl",  // 模型
  "goldcost": 250,                      // 金币价格
  "hp": 75,                             // 生命值
  "level": 0,                           // 等级
  "lumbercost": 0,                      // 木材价格
  "name": "召唤护身符",                 // 显示名称
  "oldlevel": 0,                        // 旧等级
  "pawnable": 1,                        // 是否可典当
  "perishable": 1,                      // 是否会消失
  "powerup": 0,                         // 是否是能量符文
  "prio": 0,                            // 优先级
  "scale": 1.0,                         // 缩放
  "sellable": 1,                        // 是否可出售
  "selsize": 0.0,                       // 选择大小
  "stockmax": 2,                        // 最大库存
  "stockregen": 120,                    // 库存恢复时间
  "stockstart": 0,                      // 初始库存
  "tip": "购买召唤护身符(|cffffcc00R|r)",  // 提示
  "ubertip": "将目标区域内...",         // 详细提示
  "usable": 1,                          // 是否可使用
  "uses": 1,                            // 使用次数
  "hotkey": "R",                        // 快捷键
  "requires": ""                        // 需求
}
```

**常用查询字段：**
- `_id` - 唯一标识符
- `name` - 显示名称
- `goldcost` - 金币价格
- `lumbercost` - 木材价格
- `level` - 等级
- `class` - 分类
- `usable` - 是否可使用

---

## 4. Buff数据 (buffs.json)

**字段说明：**

```json
{
  "section": "AEsd",                    // 区段标识
  "_code": "AEsd",                      // 代码
  "_id": "AEsd",                        // 唯一ID
  "_type": "buff",                      // 类型
  "editorname": "群星坠落(目标)",       // 编辑器名称
  "iseffect": 0,                        // 是否是效果
  "missilearc": 0,                      // 导弹弧度
  "missilehoming": 0,                   // 导弹追踪
  "missilespeed": 0,                    // 导弹速度
  "race": "nightelf",                   // 种族
  "spelldetail": 0,                     // 法术细节
  "targetart": "Abilities\\Spells\\NightElf\\Starfall\\StarfallTarget.mdl",  // 目标特效
  "targetattach": "origin",             // 目标附着点
  "targetattachcount": 0,               // 目标附着点数量
  "buffart": "",                        // Buff图标
  "bufftip": "",                        // Buff提示
  "buffubertip": "",                    // Buff详细提示
  "specialart": "",                     // 特殊特效
  "specialattach": "",                  // 特殊附着点
  "effectart": "",                      // 效果特效
  "effectsoundlooped": "",              // 循环音效
  "editorsuffix": "",                   // 编辑器后缀
  "missileart": "",                     // 导弹特效
  "effectsound": "",                    // 音效
  "effectattach": "",                   // 效果附着点
  "lightningeffect": "",                // 闪电效果
  "targetattach1": "",                  // 目标附着点1
  "targetattach2": "",                  // 目标附着点2
  "targetattach3": "",                  // 目标附着点3
  "targetattach4": "",                  // 目标附着点4
  "targetattach5": ""                   // 目标附着点5
}
```

**常用查询字段：**
- `_id` - 唯一标识符
- `editorname` - 编辑器名称
- `race` - 种族
- `bufftip` - Buff提示

---

## 5. 其他数据文件

### destructables.json (可破坏物)
- 类似单位数据，包含可破坏物体的信息

### doodads.json (装饰物)
- 地图装饰物数据

### misc.json (杂项)
- 杂项配置

### txt.json (文本)
- 文本资源

### upgrade.json (升级)
- 升级项目数据

---

## 🔍 数据特点

1. **所有字段都是字符串或数字**
   - 数字：直接使用
   - 字符串：可能包含逗号分隔的多级数据（如 `cost: "50,50,50,50"`）

2. **中文支持**
   - 所有名称、描述都是中文
   - 编码：UTF-8

3. **路径格式**
   - Windows风格路径：`ReplaceableTextures\CommandButtons\BTNxxx.blp`
   - 在代码中使用时可能需要转换

4. **空值处理**
   - 空字段使用 `null` 或空字符串 `""`

---

## 💡 使用示例

```javascript
const parser = new War3DataParser();
parser.load();

// 获取单位
const unit = parser.query.findUnitById('Edem');
console.log(unit.name);        // "恶魔猎手"
console.log(unit.hp);          // 100
console.log(unit.goldcost);    // 425

// 获取技能
const ability = parser.query.findAbilityById('AEmb');
console.log(ability.name);     // "法力燃烧"
console.log(ability.cost);     // "50,50,50,50"

// 获取物品
const item = parser.query.findItemById('amrc');
console.log(item.name);        // "召唤护身符"
console.log(item.goldcost);    // 250
```

---

## 📦 数据统计

| 文件 | 记录数 | 字段数 | 大小 |
|------|--------|--------|------|
| units.json | 836 | 232 | 4.4MB |
| abilities.json | 799 | 82 | 1.9MB |
| items.json | 273 | 42 | 302KB |
| buffs.json | 245 | 31 | 224KB |
| destructables.json | 247 | 50 | 331KB |
| doodads.json | 469 | 50 | 484KB |
| misc.json | 17 | 10 | 146KB |
| txt.json | 67 | 5 | 66KB |
| upgrade.json | 89 | 40 | 101KB |

**总计：2,773条记录，约7MB**
