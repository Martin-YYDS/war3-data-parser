import * as fs from 'fs';
import * as path from 'path';
import { Unit, Ability, Item, Buff } from './types';

/**
 * Excel转JSON转换器
 * 将原始Excel数据转换为JSON格式，便于npm包使用
 */
export class ExcelConverter {
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  /**
   * 读取CSV文件并转换为JSON
   */
  private csvToJson<T>(filePath: string): T[] {
    if (!fs.existsSync(filePath)) {
      console.warn(`文件不存在: ${filePath}`);
      return [];
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    if (lines.length < 2) return [];

    // 解析表头
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

    // 解析数据行
    const data: T[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const values = this.parseCSVLine(line);
      const obj: any = {};

      headers.forEach((header, index) => {
        let value = values[index] || '';
        // 移除引号并处理空值
        value = value.trim().replace(/^"|"$/g, '');

        // 尝试转换为数字
        if (value !== '' && !isNaN(Number(value))) {
          obj[header] = Number(value);
        } else if (value === '') {
          obj[header] = null;
        } else {
          obj[header] = value;
        }
      });

      data.push(obj as T);
    }

    return data;
  }

  /**
   * 解析CSV行（处理包含逗号的字段）
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
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

  /**
   * 转换单位数据
   */
  convertUnits(): Unit[] {
    const csvPath = path.join(this.dataDir, 'unit.csv');
    return this.csvToJson<Unit>(csvPath);
  }

  /**
   * 转换技能数据
   */
  convertAbilities(): Ability[] {
    const csvPath = path.join(this.dataDir, 'ability.csv');
    return this.csvToJson<Ability>(csvPath);
  }

  /**
   * 转换物品数据
   */
  convertItems(): Item[] {
    const csvPath = path.join(this.dataDir, 'item.csv');
    return this.csvToJson<Item>(csvPath);
  }

  /**
   * 转换Buff数据
   */
  convertBuffs(): Buff[] {
    const csvPath = path.join(this.dataDir, 'buff.csv');
    return this.csvToJson<Buff>(csvPath);
  }

  /**
   * 转换其他数据（通用方法）
   */
  convertGeneric<T>(filename: string): T[] {
    const csvPath = path.join(this.dataDir, filename);
    return this.csvToJson<T>(csvPath);
  }

  /**
   * 转换所有数据并保存为JSON文件
   */
  convertAll(outputDir: string): void {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('开始转换数据...');

    // 转换单位
    const units = this.convertUnits();
    fs.writeFileSync(path.join(outputDir, 'units.json'), JSON.stringify(units, null, 2));
    console.log(`✓ 转换单位数据: ${units.length} 条`);

    // 转换技能
    const abilities = this.convertAbilities();
    fs.writeFileSync(path.join(outputDir, 'abilities.json'), JSON.stringify(abilities, null, 2));
    console.log(`✓ 转换技能数据: ${abilities.length} 条`);

    // 转换物品
    const items = this.convertItems();
    fs.writeFileSync(path.join(outputDir, 'items.json'), JSON.stringify(items, null, 2));
    console.log(`✓ 转换物品数据: ${items.length} 条`);

    // 转换Buff
    const buffs = this.convertBuffs();
    fs.writeFileSync(path.join(outputDir, 'buffs.json'), JSON.stringify(buffs, null, 2));
    console.log(`✓ 转换Buff数据: ${buffs.length} 条`);

    // 转换其他数据
    const otherFiles = ['destructable.csv', 'doodad.csv', 'misc.csv', 'txt.csv', 'upgrade.csv'];
    otherFiles.forEach(file => {
      const name = path.parse(file).name;
      const data = this.convertGeneric<any>(file);
      fs.writeFileSync(path.join(outputDir, `${name}.json`), JSON.stringify(data, null, 2));
      console.log(`✓ 转换${name}数据: ${data.length} 条`);
    });

    console.log('\n所有数据转换完成！');
  }
}
