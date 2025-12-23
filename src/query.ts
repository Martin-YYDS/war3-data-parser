import { Unit, Ability, Item, Buff, QueryOptions, SearchResult } from './types';

/**
 * 查询工具类 - 提供便捷的数据查询功能
 */
export class Query {
  constructor(private dataset: any) {}

  /**
   * 通用查询方法
   */
  private search<T>(data: T[], options: QueryOptions = {}): SearchResult<T> {
    let result = [...data];

    // 过滤
    if (options.filter) {
      result = result.filter(item => {
        return Object.entries(options.filter!).every(([key, value]) => {
          if (value === undefined || value === null) return true;

          const itemValue = (item as any)[key];
          if (itemValue === undefined || itemValue === null) return false;

          // 支持模糊字符串匹配
          if (typeof value === 'string' && typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }

          // 精确匹配
          return itemValue === value;
        });
      });
    }

    // 排序
    if (options.sort) {
      const sortFields = Array.isArray(options.sort) ? options.sort : [options.sort];
      result.sort((a, b) => {
        for (const field of sortFields) {
          const aVal = (a as any)[field];
          const bVal = (b as any)[field];
          if (aVal < bVal) return -1;
          if (aVal > bVal) return 1;
        }
        return 0;
      });
    }

    // 分页
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    const paginated = result.slice(offset, offset + limit);

    return {
      data: paginated,
      total: result.length,
      limit,
      offset,
    };
  }

  /**
   * 查询单位
   */
  findUnits(options?: QueryOptions): SearchResult<Unit> {
    return this.search<Unit>(this.dataset.units, options);
  }

  /**
   * 按ID查询单位
   */
  findUnitById(id: string): Unit | undefined {
    return this.dataset.units.find((u: Unit) => u._id === id || u.section === id);
  }

  /**
   * 按名称查询单位（支持模糊匹配）
   */
  findUnitsByName(name: string, options?: QueryOptions): SearchResult<Unit> {
    return this.findUnits({
      ...options,
      filter: { ...(options?.filter || {}), name },
    });
  }

  /**
   * 按种族查询单位
   */
  findUnitsByRace(race: string, options?: QueryOptions): SearchResult<Unit> {
    return this.findUnits({
      ...options,
      filter: { ...(options?.filter || {}), race },
    });
  }

  /**
   * 查询技能
   */
  findAbilities(options?: QueryOptions): SearchResult<Ability> {
    return this.search<Ability>(this.dataset.abilities, options);
  }

  /**
   * 按ID查询技能
   */
  findAbilityById(id: string): Ability | undefined {
    return this.dataset.abilities.find((a: Ability) => a._id === id || a.section === id);
  }

  /**
   * 按名称查询技能
   */
  findAbilitiesByName(name: string, options?: QueryOptions): SearchResult<Ability> {
    return this.findAbilities({
      ...options,
      filter: { ...(options?.filter || {}), name },
    });
  }

  /**
   * 查询物品
   */
  findItems(options?: QueryOptions): SearchResult<Item> {
    return this.search<Item>(this.dataset.items, options);
  }

  /**
   * 按ID查询物品
   */
  findItemById(id: string): Item | undefined {
    return this.dataset.items.find((i: Item) => i._id === id || i.section === id);
  }

  /**
   * 按名称查询物品
   */
  findItemsByName(name: string, options?: QueryOptions): SearchResult<Item> {
    return this.findItems({
      ...options,
      filter: { ...(options?.filter || {}), name },
    });
  }

  /**
   * 查询Buff
   */
  findBuffs(options?: QueryOptions): SearchResult<Buff> {
    return this.search<Buff>(this.dataset.buffs, options);
  }

  /**
   * 按ID查询Buff
   */
  findBuffById(id: string): Buff | undefined {
    return this.dataset.buffs.find((b: Buff) => b._id === id || b.section === id);
  }

  /**
   * 高级搜索 - 在多个字段中搜索关键词
   */
  searchUnitsByKeyword(keyword: string, fields: string[] = ['name', '_name', 'tip', 'ubertip']): SearchResult<Unit> {
    const filtered = this.dataset.units.filter((unit: Unit) => {
      return fields.some(field => {
        const value = (unit as any)[field];
        return value && typeof value === 'string' && value.toLowerCase().includes(keyword.toLowerCase());
      });
    });

    return {
      data: filtered,
      total: filtered.length,
      limit: filtered.length,
      offset: 0,
    };
  }

  /**
   * 搜索物品按关键词
   */
  searchItemsByKeyword(keyword: string, fields: string[] = ['name', 'tip', 'ubertip', 'description']): SearchResult<Item> {
    const filtered = this.dataset.items.filter((item: Item) => {
      return fields.some(field => {
        const value = (item as any)[field];
        return value && typeof value === 'string' && value.toLowerCase().includes(keyword.toLowerCase());
      });
    });

    return {
      data: filtered,
      total: filtered.length,
      limit: filtered.length,
      offset: 0,
    };
  }

  /**
   * 获取单位的技能列表
   */
  getUnitAbilities(unit: Unit): Ability[] {
    if (!unit.abillist) return [];

    const abilityIds = unit.abillist.split(',').map(id => id.trim()).filter(id => id);
    return abilityIds
      .map(id => this.findAbilityById(id))
      .filter((ability): ability is Ability => ability !== undefined);
  }

  /**
   * 获取物品的技能列表
   */
  getItemAbilities(item: Item): Ability[] {
    if (!item.abillist) return [];

    const abilityIds = item.abillist.split(',').map(id => id.trim()).filter(id => id);
    return abilityIds
      .map(id => this.findAbilityById(id))
      .filter((ability): ability is Ability => ability !== undefined);
  }
}
