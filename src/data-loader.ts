import * as fs from 'fs';
import * as path from 'path';
import { War3Dataset, Unit, Ability, Item, Buff } from './types';

/**
 * 数据加载器 - 负责从JSON文件加载War3数据
 */
export class DataLoader {
  private dataDir: string;
  private dataset: War3Dataset | null = null;

  constructor(dataDir?: string) {
    // 如果提供了dataDir，使用提供的路径
    // 否则尝试使用包内的data目录
    if (dataDir) {
      this.dataDir = dataDir;
    } else {
      // 尝试多个可能的路径
      const possiblePaths = [
        path.join(__dirname, '..', 'data'),      // dist/../data
        path.join(__dirname, 'data'),            // dist/data
        path.join(process.cwd(), 'data'),        // 当前目录/data
        path.join(__dirname, '..', '..', 'data') // 更上层目录
      ];

      // 找到第一个存在的路径
      this.dataDir = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
    }
  }

  /**
   * 检查数据目录是否存在
   */
  private checkDataDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      throw new Error(
        `数据目录不存在: ${this.dataDir}\n` +
        `请确保:\n` +
        `1. 使用了正确的路径\n` +
        `2. 或者重新安装包: npm install war3-data-parser\n` +
        `3. 或者手动指定数据目录: new War3DataParser('./path/to/data')`
      );
    }
  }

  /**
   * 从JSON文件读取数据
   */
  private loadJSONFile<T>(filename: string): T[] {
    const filePath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`文件不存在: ${filePath}`);
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T[];
  }

  /**
   * 加载所有数据
   */
  load(): War3Dataset {
    this.checkDataDir();

    this.dataset = {
      units: this.loadJSONFile<Unit>('units.json'),
      abilities: this.loadJSONFile<Ability>('abilities.json'),
      items: this.loadJSONFile<Item>('items.json'),
      buffs: this.loadJSONFile<Buff>('buffs.json'),
      destructables: this.loadJSONFile<any>('destructables.json'),
      doodads: this.loadJSONFile<any>('doodads.json'),
      misc: this.loadJSONFile<any>('misc.json'),
      txt: this.loadJSONFile<any>('txt.json'),
      upgrade: this.loadJSONFile<any>('upgrade.json'),
    };

    return this.dataset;
  }

  /**
   * 获取已加载的数据集
   */
  getDataset(): War3Dataset {
    if (!this.dataset) {
      throw new Error('数据尚未加载，请先调用 load() 方法');
    }
    return this.dataset;
  }

  /**
   * 检查数据是否已加载
   */
  isLoaded(): boolean {
    return this.dataset !== null;
  }

  /**
   * 获取数据统计信息
   */
  getStats(): Record<string, number> {
    const dataset = this.getDataset();
    return {
      units: dataset.units.length,
      abilities: dataset.abilities.length,
      items: dataset.items.length,
      buffs: dataset.buffs.length,
      destructables: dataset.destructables.length,
      doodads: dataset.doodads.length,
      misc: dataset.misc.length,
      txt: dataset.txt.length,
      upgrade: dataset.upgrade.length,
    };
  }
}
