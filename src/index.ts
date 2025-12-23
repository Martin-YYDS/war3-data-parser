import { DataLoader } from './data-loader';
import { Query } from './query';
import { ExcelConverter } from './converter';
import { Unit, Ability, Item, Buff, QueryOptions, SearchResult } from './types';
import { CompressedDataLoader } from './compressed-loader';

/**
 * War3数据解析器主类
 *
 * @example
 * ```typescript
 * // 方式1: 使用原始JSON数据
 * const parser = new War3DataParser('./data');
 * parser.load();
 *
 * // 方式2: 使用压缩数据（推荐 - 节省55%空间）
 * const parser = new War3DataParser('./data_compressed', true);
 * parser.load();
 *
 * // 方式3: 使用Gzip压缩数据（推荐 - 节省96%空间）
 * const parser = new War3DataParser('./data_gzip', true, true);
 * parser.load();
 *
 * // 查询单位
 * const hero = parser.query.findUnitById('Edem');
 * console.log(hero?.name); // "恶魔猎手"
 *
 * // 搜索物品
 * const items = parser.query.searchItemsByKeyword('笛');
 * console.log(items.data);
 * ```
 */
export class War3DataParser {
  private dataLoader: DataLoader | CompressedDataLoader;
  private _query: Query | null = null;
  private useCompressed: boolean;

  /**
   * @param dataDir 数据目录路径，默认为当前目录下的data文件夹
   * @param useCompressed 是否使用压缩数据（默认false）
   * @param useGzip 是否使用Gzip压缩（仅在useCompressed=true时有效）
   */
  constructor(dataDir?: string, useCompressed: boolean = false, useGzip: boolean = false) {
    this.useCompressed = useCompressed;

    if (useCompressed) {
      this.dataLoader = new CompressedDataLoader(dataDir, useGzip);
    } else {
      this.dataLoader = new DataLoader(dataDir);
    }
  }

  /**
   * 加载数据
   */
  load(): void {
    this.dataLoader.load();
    this._query = new Query(this.dataLoader.getDataset());
  }

  /**
   * 获取查询实例
   */
  get query(): Query {
    if (!this._query) {
      throw new Error('数据尚未加载，请先调用 load() 方法');
    }
    return this._query;
  }

  /**
   * 获取数据统计
   */
  getStats(): Record<string, number> {
    return this.dataLoader.getStats();
  }

  /**
   * 检查是否已加载
   */
  isLoaded(): boolean {
    return this.dataLoader.isLoaded();
  }

  /**
   * 获取原始数据集
   */
  getDataset() {
    return this.dataLoader.getDataset();
  }
}

// 导出转换器
export { ExcelConverter };

// 导出类型定义
export * from './types';

// 导出查询类（方便直接使用）
export { Query };

// 导出压缩相关工具
export { CompressedDataLoader } from './compressed-loader';

// 默认导出
export default War3DataParser;

/**
 * 快捷函数 - 无需实例化类即可使用
 */

/**
 * 快速创建解析器并加载数据
 */
export function createParser(dataDir?: string, useCompressed: boolean = false, useGzip: boolean = false): War3DataParser {
  const parser = new War3DataParser(dataDir, useCompressed, useGzip);
  parser.load();
  return parser;
}

/**
 * 快速转换Excel数据
 */
export function convertExcelData(inputDir: string, outputDir: string): void {
  const converter = new ExcelConverter(inputDir);
  converter.convertAll(outputDir);
}

/**
 * 快速创建压缩数据解析器
 */
export function createCompressedParser(dataDir?: string, useGzip: boolean = false): War3DataParser {
  return createParser(dataDir, true, useGzip);
}

/**
 * 获取压缩数据统计信息
 */
export function getCompressedStats(dataDir: string): Record<string, any> {
  const loader = new CompressedDataLoader(dataDir);
  try {
    loader.load();
    const stats = loader.getStats();
    const sizes = loader.getSizeInfo();
    return {
      stats,
      sizes,
      totalSize: Object.values(sizes).reduce((acc, size) => {
        const num = parseFloat(size);
        return acc + num;
      }, 0),
    };
  } catch (error: unknown) {
    return { error: (error as Error).message };
  }
}
