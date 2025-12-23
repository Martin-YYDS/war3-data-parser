/**
 * 压缩数据加载器 - 简化版本
 * 支持加载压缩JSON和Gzip压缩数据
 */

import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

/**
 * 解析Gzip压缩的JSON文件
 */
export function parseGzipFile<T>(filePath: string): T[] {
  const compressed = fs.readFileSync(filePath);
  const decompressed = zlib.gunzipSync(compressed);
  return JSON.parse(decompressed.toString()) as T[];
}

/**
 * 解析普通压缩JSON文件
 */
export function parseCompressedFile<T>(filePath: string): T[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T[];
}

/**
 * 字段映射 - 压缩字段名到原始字段名的映射
 */
const FIELD_DECOMPRESS_MAP: Record<string, string> = {
  // 核心字段
  's': 'section',
  'i': '_id',
  't': '_type',
  'n': 'name',
  'c': '_code',
  'ml': '_max_level',

  // 编辑器相关
  'es': 'editorsuffix',
  'a': 'art',
  'hk': 'hotkey',
  'tp': 'tip',
  'ut': 'ubertip',
  'bp1': 'buttonpos_1',
  'bp2': 'buttonpos_2',
  'd': 'description',

  // 属性字段
  'rc': 'race',
  'lv': 'level',
  'hp': 'hp',
  'm0': 'mana0',
  'mn': 'manan',
  'gc': 'goldcost',
  'lc': 'lumbercost',
  'pr': 'prio',
  'sc': 'scale',
  'ar': 'armor',

  // 战斗相关
  'c1': 'cool1',
  'c2': 'cool2',
  'dg1': 'dmgplus1',
  'dg2': 'dmgplus2',
  'dc1': 'dice1',
  'dc2': 'dice2',
  'rn1': 'rangeN1',
  'rn2': 'rangeN2',
  'at1': 'atktype1',
  'at2': 'atktype2',

  // 技能列表
  'al': 'abillist',
  'hal': 'heroabillist',

  // 其他字段
  'acq': 'acquire',
  'ag': 'agility',
  'agp': 'agilitygain',
  'aap': 'animprops',
  'awt': 'awt',
  'bs1': 'backswing1',
  'bs2': 'backswing2',
  'bt': 'buildtime',
  'blnd': 'blend',
  'bl': 'blood',
  'bd': 'bloodexplosion',
  'bp': 'bloodprime',
  'bs': 'builds',
  'br': 'bounty',
  'cp': 'cancast',
  'canbuildon': 'canbuildon',
  'cf': 'castpt',
  'cs': 'castpt',
  'csz': 'collision',
  'cbs': 'collisionbox',
  'cpt': 'collisiontype',
  'col': 'color',
  'ctc': 'ctc',
  'dl1': 'damage1',
  'dl2': 'damage2',
  'de': 'death',
  'dt': 'deathtype',
  'df': 'def',
  'dft': 'defType',
  'dfu': 'defup',
  'ev': 'evasion',
  'fr': 'fused',
  'f': 'faction',
  'g': 'gold',
  'h': 'hero',
  'l': 'lumber',
  'm': 'mana',
  'mg': 'magdef',
  'ms': 'movespeed',
  'mx': 'max',
  'mi': 'min',
  'o': 'owner',
  'p': 'priority',
  'rg': 'range',
  'rm': 'range',
  's1': 'spill1',
  's2': 'spill2',
  'st': 'stock',
  't1': 'type1',
  't2': 'type2',
  'u': 'unit',
  'v': 'version',
  'w': 'weap1',
  'x': 'x',
  'y': 'y',
  'z': 'z',
};

/**
 * 解压缩单个对象 - 将压缩字段名转换回原始字段名
 */
function decompressObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(decompressObject);

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // 查找映射，如果找到则使用原始字段名，否则保持原样
    const originalKey = FIELD_DECOMPRESS_MAP[key] || key;

    // 递归处理嵌套对象和数组
    if (value && typeof value === 'object') {
      result[originalKey] = decompressObject(value);
    } else {
      result[originalKey] = value;
    }
  }
  return result;
}

/**
 * 解压缩数据数组
 */
export function decompressData<T>(data: any[]): T[] {
  return data.map(decompressObject) as T[];
}

/**
 * 压缩数据加载器类
 */
export class CompressedDataLoader {
  private dataDir: string;
  private useGzip: boolean = false;
  private dataset: any = null;

  constructor(dataDir?: string, useGzip: boolean = false) {
    this.useGzip = useGzip;

    if (dataDir) {
      this.dataDir = dataDir;
    } else {
      // 自动检测路径
      const possiblePaths = [
        path.join(__dirname, '..', 'data_compressed'),
        path.join(__dirname, '..', 'data_gzip'),
        path.join(__dirname, 'data_compressed'),
        path.join(__dirname, 'data_gzip'),
        path.join(process.cwd(), 'data_compressed'),
        path.join(process.cwd(), 'data_gzip'),
      ];

      this.dataDir = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
    }

    // 如果是gzip目录，自动启用gzip
    if (this.dataDir.includes('gzip')) {
      this.useGzip = true;
    }
  }

  /**
   * 检查数据目录
   */
  private checkDataDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      throw new Error(
        `压缩数据目录不存在: ${this.dataDir}\n` +
        `请确保:\n` +
        `1. 运行过压缩脚本: node compress.js\n` +
        `2. 或指定正确的路径`
      );
    }
  }

  /**
   * 获取文件扩展名
   */
  private getExtension(): string {
    return this.useGzip ? '.json.gz' : '_compressed.json';
  }

  /**
   * 加载单个文件
   */
  private loadFile<T>(filename: string): T[] {
    const baseName = filename.replace('.json', '');
    const extension = this.getExtension();

    // 对于gzip压缩，需要添加_compressed前缀
    const finalName = this.useGzip ? baseName + '_compressed' + extension : baseName + extension;
    const filePath = path.join(this.dataDir, finalName);

    if (!fs.existsSync(filePath)) {
      console.warn(`文件不存在: ${filePath}`);
      return [];
    }

    try {
      let data: T[];
      if (this.useGzip) {
        data = parseGzipFile<T>(filePath);
      } else {
        data = parseCompressedFile<T>(filePath);
      }

      // 解压缩字段名
      return decompressData<T>(data);
    } catch (error) {
      console.error(`加载文件失败: ${filePath}`, error);
      return [];
    }
  }

  /**
   * 加载所有数据
   */
  load(): any {
    this.checkDataDir();

    this.dataset = {
      units: this.loadFile('units.json'),
      abilities: this.loadFile('abilities.json'),
      items: this.loadFile('items.json'),
      buffs: this.loadFile('buffs.json'),
      destructables: this.loadFile('destructables.json'),
      doodads: this.loadFile('doodads.json'),
      misc: this.loadFile('misc.json'),
      txt: this.loadFile('txt.json'),
      upgrade: this.loadFile('upgrade.json'),
    };

    return this.dataset;
  }

  /**
   * 获取数据集
   */
  getDataset(): any {
    if (!this.dataset) {
      throw new Error('数据尚未加载，请先调用 load() 方法');
    }
    return this.dataset;
  }

  /**
   * 检查是否已加载
   */
  isLoaded(): boolean {
    return this.dataset !== null;
  }

  /**
   * 获取统计信息
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

  /**
   * 获取文件大小信息
   */
  getSizeInfo(): Record<string, string> {
    const stats: Record<string, string> = {};
    const ext = this.getExtension();

    ['units', 'abilities', 'items', 'buffs', 'destructables', 'doodads', 'misc', 'txt', 'upgrade'].forEach(name => {
      const filePath = path.join(this.dataDir, name + ext);
      if (fs.existsSync(filePath)) {
        const size = fs.statSync(filePath).size;
        stats[name] = `${(size / 1024).toFixed(1)} KB`;
      }
    });

    return stats;
  }
}
