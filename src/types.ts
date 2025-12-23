/**
 * War3数据类型定义
 */

// 单位类型
export interface Unit {
  section: string;
  _id: string;
  _name: string;
  _type: string;
  abillist: string;
  acquire: number;
  agi: number;
  agiplus: number;
  armor: string;
  art: string;
  atktype1: string;
  atktype2: string;
  goldcost: number;
  lumbercost: number;
  hp: number;
  int: number;
  intplus: number;
  level: number;
  name: string;
  primary: string;
  race: string;
  regenhp: number;
  regenmana: number;
  str: number;
  strplus: number;
  spd: number;
  sight: number;
  nsight: number;
  tip: string;
  ubertip: string;
  description: string;
  [key: string]: any;
}

// 技能类型
export interface Ability {
  section: string;
  _code: string;
  _id: string;
  _max_level: number;
  _type: string;
  area: string;
  art: string;
  buffid: string;
  buttonpos_1: number;
  buttonpos_2: number;
  cast: string;
  cool: string;
  cost: string;
  dataa: string;
  datab: string;
  datae: string;
  dataf: string;
  dur: string;
  efctid: string;
  hero: number;
  herodur: string;
  hotkey: string;
  item: number;
  levels: number;
  name: string;
  race: string;
  reqlevel: number;
  rng: string;
  targs: string;
  tip: string;
  ubertip: string;
  [key: string]: any;
}

// 物品类型
export interface Item {
  section: string;
  _id: string;
  _type: string;
  abillist: string;
  armor: string;
  art: string;
  buttonpos_1: number;
  buttonpos_2: number;
  class: string;
  cooldownid: string;
  description: string;
  drop: number;
  droppable: number;
  file: string;
  goldcost: number;
  hp: number;
  level: number;
  lumbercost: number;
  name: string;
  oldlevel: number;
  pawnable: number;
  perishable: number;
  powerup: number;
  prio: number;
  scale: number;
  sellable: number;
  selsize: number;
  stockmax: number;
  stockregen: number;
  stockstart: number;
  tip: string;
  ubertip: string;
  usable: number;
  uses: number;
  hotkey: string;
  requires: string;
  [key: string]: any;
}

// Buff类型
export interface Buff {
  section: string;
  _code: string;
  _id: string;
  _type: string;
  editorname: string;
  iseffect: number;
  race: string;
  spelldetail: number;
  buffart: string;
  bufftip: string;
  buffubertip: string;
  missileart: string;
  targetart: string;
  targetattach: string;
  [key: string]: any;
}

// 数据集接口
export interface War3Dataset {
  units: Unit[];
  abilities: Ability[];
  items: Item[];
  buffs: Buff[];
  destructables: any[];
  doodads: any[];
  misc: any[];
  txt: any[];
  upgrade: any[];
}

// 查询选项
export interface QueryOptions {
  limit?: number;
  offset?: number;
  filter?: Record<string, any>;
  sort?: string | string[];
}

// 搜索结果
export interface SearchResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
