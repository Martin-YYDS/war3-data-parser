/**
 * JSON压缩工具 - 用于减小war3数据文件体积
 * 压缩策略：
 * 1. 字段名映射（短键名）
 * 2. 数组格式优化
 * 3. 移除冗余字段
 * 4. 数值类型优化
 */

const fs = require('fs');
const path = require('path');

// 高频字段名映射表（基于频率分析）
const FIELD_MAPPING = {
    // 元数据字段 (最高频)
    'section': 's',
    '_id': 'i',
    '_type': 't',
    '_code': 'c',
    '_max_level': 'ml',
    '_name': 'n',

    // UI相关字段
    'name': 'n',
    'editorsuffix': 'es',
    'art': 'a',
    'hotkey': 'hk',
    'tip': 'tp',
    'ubertip': 'ut',
    'buttonpos_1': 'bp1',
    'buttonpos_2': 'bp2',
    'description': 'd',

    // 游戏数据字段
    'race': 'rc',
    'level': 'lv',
    'hp': 'hp',
    'mana0': 'm0',
    'manan': 'mn',
    'goldcost': 'gc',
    'lumbercost': 'lc',
    'prio': 'pr',
    'scale': 'sc',
    'armor': 'ar',

    // 战斗相关
    'cool1': 'c1',
    'cool2': 'c2',
    'dmgplus1': 'dg1',
    'dmgplus2': 'dg2',
    'dice1': 'dc1',
    'dice2': 'dc2',
    'rangeN1': 'rn1',
    'rangeN2': 'rn2',
    'atktype1': 'at1',
    'atktype2': 'at2',

    // 投射物和效果
    'missileart_1': 'ma1',
    'missileart_2': 'ma2',
    'missilearc_1': 'mc1',
    'missilearc_2': 'mc2',
    'missilespeed_1': 'ms1',
    'missilespeed_2': 'ms2',
    'missilehoming_1': 'mh1',
    'missilehoming_2': 'mh2',
    'targetart': 'ta',
    'specialart': 'sa',
    'effectart': 'ea',
    'effectsound': 'es',
    'effectsoundlooped': 'esl',

    // 属性字段
    'agi': 'ag',
    'agiplus': 'agp',
    'int': 'in',
    'intplus': 'inp',
    'str': 'st',
    'strplus': 'stp',

    // 技能相关
    'abillist': 'al',
    'heroabillist': 'hal',
    'levels': 'ls',
    'requires': 'rq',
    'requiresamount': 'rqa',
    'buffid': 'bi',
    'dataa': 'da',
    'datab': 'db',
    'datac': 'dc',
    'datad': 'dd',
    'datae': 'de',
    'dataf': 'df',

    // 移动和物理
    'movetp': 'mt',
    'movespeed': 'ms',
    'maxspd': 'mxs',
    'minspd': 'mns',
    'collision': 'col',
    'collisionSize': 'cs',

    // 视觉和渲染
    'file': 'f',
    'modelscale': 'msc',
    'red': 'rd',
    'green': 'gn',
    'blue': 'bl',
    'blend': 'blnd',
    'scale': 'sc',

    // 状态和类型
    'isbldg': 'ib',
    'campaign': 'cp',
    'hero': 'hr',
    'item': 'it',
    'neutral': 'ne',
    'hostilepal': 'hp',

    // 时间和计时
    'bldtm': 'bt',
    'reptm': 'rt',
    'castpt': 'cpt',
    'castbsw': 'cbs',
    'backsw1': 'bs1',
    'backsw2': 'bs2',

    // 资源和经济
    'bountydice': 'bd',
    'bountyplus': 'bp',
    'bountysides': 'bs',
    'lumberbountydice': 'lbd',
    'lumberbountyplus': 'lbp',
    'lumberbountysides': 'lbs',

    // 库存和供应
    'stockmax': 'sm',
    'stockregen': 'sr',
    'stockstart': 'ss',
    'fused': 'fu',
    'fmade': 'fm',

    // 其他高频字段
    'requireshero': 'rh',
    'checkdep': 'cd',
    'dropitems': 'di',
    'inEditor': 'ie',
    'onUserSpecified': 'ous',
    'raceInEditor': 're',
    'sort': 'so',
    'tech': 'tc',
    'unitClass': 'uc',
    'valid': 'vd',

    // 声音相关
    'loopingsoundfadein': 'lsfi',
    'loopingsoundfadeout': 'lsfo',

    // 物理属性
    'impactz': 'iz',
    'launchz': 'lz',
    'maxpitch': 'mp',
    'maxroll': 'mr',

    // 路径和地形
    'pathtex': 'pt',
    'tilesets': 'ts',
    'tilesetspecific': 'tss',

    // 其他中频字段
    'acquire': 'acq',
    'cast': 'ca',
    'dur': 'du',
    'herodur': 'hd',
    'area': 'ar',
    'targetattach': 'ta',
    'casterattachcount': 'cac',
    'efctid': 'ei',

    // 状态标志
    'cansleep': 'cs',
    'canflee': 'cf',
    'hideherobar': 'hhb',
    'hideherodeathmsg': 'hhdm',
    'hideherominimap': 'hhmm',
    'hideonminimap': 'hom',
    'preventplace': 'pp',
    'buildingshadow': 'bs',
    'customteamcolor': 'ctc',
    'formation': 'fo',

    // 护甲和防御
    'def': 'df',
    'deftype': 'dft',
    'defup': 'dfu',

    // 移动属性
    'movefloor': 'mvf',
    'moveheight': 'mvh',
    'elevpts': 'ep',
    'elevrad': 'er',

    // 特殊属性
    'attachmentanimprops': 'aap',
    'auto': 'au',
    'awakentip': 'awt',
    'buffradius': 'br',
    'bufftype': 'bt',
    'cargosize': 'csz',
    'death': 'de',
    'deathtype': 'dt',
    'damageloss1': 'dl1',
    'damageloss2': 'dl2',
    'dmgpt1': 'dp1',
    'dmgpt2': 'dp2',
    'dmgup1': 'du1',
    'dmgup2': 'du2',
    'farea1': 'fa1',
    'farea2': 'fa2',
    'fatlos': 'fl',
    'fileverflags': 'fvf',
    'fograd': 'fg',
    'harea1': 'ha1',
    'harea2': 'ha2',
    'hfact1': 'hf1',
    'hfact2': 'hf2',
    'impactswimz': 'isz',
    'launchswimz': 'lsz',
    'launchx': 'lx',
    'launchy': 'ly',
    'loopingsoundfadein': 'lsfi',
    'loopingsoundfadeout': 'lsfo',
    'nbmmicon': 'nmi',
    'nbrandom': 'nbr',
    'nsight': 'ns',
    'occh': 'oc',
    'orientinterp': 'oi',
    'points': 'pt',
    'propernames': 'pn',
    'propwin': 'pw',
    'qarea1': 'qa1',
    'qarea2': 'qa2',
    'qfact1': 'qf1',
    'qfact2': 'qf2',
    'regenhp': 'rhp',
    'regenmana': 'rm',
    'regentype': 'rt',
    'repulse': 'rp',
    'repulsegroup': 'rg',
    'repulseparam': 'rpa',
    'sight': 'si',
    'spilldist': 'sd',
    'spillradius': 'sr',
    'stockinitial': 'si',
    'turnrate': 'tr',
    'unitSound': 'us',
    'upgradetype': 'ut',
    'useclickhelper': 'uch',
    'weap1': 'w1',
    'weap2': 'w2',
    'weaptype1': 'wt1',
    'weaptype2': 'wt2',
    'zamart': 'za',
    'zambuff': 'zb',
    'zamcount': 'zc',
    'zamdelay': 'zd',
    'zamname': 'zn',
    'zamprio': 'zp',
    'zamtarg': 'zt',
    'zamtips': 'zts',
    'zamubertip': 'zu',
    'zamunit': 'zu',
    'zamwv': 'zw',
    'zamxy': 'zx',
    'zamz': 'zz',
};

// 反向映射（用于解压）
const REVERSE_MAPPING = {};
for (const [key, value] of Object.entries(FIELD_MAPPING)) {
    REVERSE_MAPPING[value] = key;
}

// 需要移除的冗余字段（基于分析）
const REDUNDANT_FIELDS = [
    '_name', // 与name重复
    '_code', // 与section/id重复
    'onUserSpecified', // 编辑器内部字段
    'raceInEditor', // 编辑器内部字段
    'valid', // 验证字段
    'sort', // 排序字段
    'tech', // 技术字段
    'unitClass', // 类别字段
];

/**
 * 压缩单个JSON对象
 */
function compressObject(obj) {
    const compressed = {};

    for (const [key, value] of Object.entries(obj)) {
        // 跳过冗余字段
        if (REDUNDANT_FIELDS.includes(key)) {
            continue;
        }

        // 字段名映射
        const newKey = FIELD_MAPPING[key] || key;

        // 值处理
        let newValue = value;

        // 处理null值 - 可选：移除null字段或保留
        if (value === null) {
            continue; // 移除null字段
        }

        // 处理字符串值
        if (typeof value === 'string') {
            // 移除多余空格
            newValue = value.trim();

            // 处理路径分隔符（统一为正斜杠）
            if (newValue.includes('\\\\')) {
                newValue = newValue.replace(/\\\\/g, '/');
            }

            // 空字符串处理
            if (newValue === '') {
                continue; // 移除空字符串
            }
        }

        // 处理数值
        if (typeof value === 'number') {
            // 如果是整数，保持原样
            // 如果是浮点数，保留3位小数
            if (!Number.isInteger(value)) {
                newValue = parseFloat(value.toFixed(3));
            }
        }

        // 处理数组
        if (Array.isArray(value)) {
            // 空数组移除
            if (value.length === 0) {
                continue;
            }
            // 压缩数组元素
            newValue = value.map(item => {
                if (typeof item === 'string') {
                    return item.trim();
                }
                return item;
            });
        }

        compressed[newKey] = newValue;
    }

    return compressed;
}

/**
 * 压缩JSON数组
 */
function compressJsonArray(jsonArray) {
    if (!Array.isArray(jsonArray)) {
        return jsonArray;
    }

    return jsonArray.map(obj => compressObject(obj));
}

/**
 * 保存压缩后的JSON（紧凑格式）
 */
function saveCompressedJson(data, outputPath) {
    const compressed = compressJsonArray(data);
    const jsonStr = JSON.stringify(compressed);
    fs.writeFileSync(outputPath, jsonStr, 'utf8');
    return jsonStr.length;
}

/**
 * 保存压缩后的JSON（带格式，便于阅读）
 */
function saveCompressedJsonFormatted(data, outputPath) {
    const compressed = compressJsonArray(data);
    const jsonStr = JSON.stringify(compressed, null, 2);
    fs.writeFileSync(outputPath, jsonStr, 'utf8');
    return jsonStr.length;
}

/**
 * 解压JSON（用于测试）
 */
function decompressJson(compressedArray) {
    if (!Array.isArray(compressedArray)) {
        return compressedArray;
    }

    return compressedArray.map(obj => {
        const decompressed = {};

        for (const [key, value] of Object.entries(obj)) {
            const originalKey = REVERSE_MAPPING[key] || key;
            decompressed[originalKey] = value;
        }

        return decompressed;
    });
}

/**
 * 获取文件大小信息
 */
function getFileSizeInfo(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    const stats = fs.statSync(filePath);
    return {
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2) + ' KB',
        sizeMB: (stats.size / 1024 / 1024).toFixed(2) + ' MB'
    };
}

/**
 * 主压缩函数
 */
function compressAllFiles() {
    const dataDir = path.join(__dirname, 'data');
    const outputDir = path.join(__dirname, 'data_compressed');

    // 创建输出目录
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = [
        'units.json',
        'abilities.json',
        'items.json',
        'buffs.json',
        'destructables.json',
        'doodads.json',
        'misc.json',
        'txt.json',
        'upgrade.json'
    ];

    console.log('=== JSON压缩工具 ===\n');
    console.log('开始压缩文件...\n');

    let totalOriginalSize = 0;
    let totalCompressedSize = 0;

    files.forEach(file => {
        const inputPath = path.join(dataDir, file);
        const outputPathCompressed = path.join(outputDir, file.replace('.json', '_compressed.json'));
        const outputPathFormatted = path.join(outputDir, file.replace('.json', '_formatted.json'));

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️  跳过不存在的文件: ${file}`);
            return;
        }

        try {
            // 读取原始文件
            const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
            const originalInfo = getFileSizeInfo(inputPath);

            // 保存压缩版本（紧凑）
            const compressedSize = saveCompressedJson(data, outputPathCompressed);

            // 保存格式化版本（便于查看）
            saveCompressedJsonFormatted(data, outputPathFormatted);

            const compressedInfo = getFileSizeInfo(outputPathCompressed);

            // 计算压缩率
            const reduction = ((originalInfo.size - compressedInfo.size) / originalInfo.size * 100).toFixed(1);

            console.log(`📄 ${file}:`);
            console.log(`   原始: ${originalInfo.sizeKB} (${originalInfo.size} 字节)`);
            console.log(`   压缩: ${compressedInfo.sizeKB} (${compressedInfo.size} 字节)`);
            console.log(`   节省: ${reduction}%`);
            console.log(`   保存至: ${path.basename(outputPathCompressed)}`);
            console.log('');

            totalOriginalSize += originalInfo.size;
            totalCompressedSize += compressedInfo.size;

        } catch (error) {
            console.log(`❌ 处理 ${file} 时出错: ${error.message}`);
        }
    });

    // 总计
    if (totalOriginalSize > 0) {
        const totalReduction = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
        console.log('=== 总计 ===');
        console.log(`原始总大小: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`压缩总大小: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`总节省: ${totalReduction}%`);
        console.log(`\n压缩文件已保存至: ${outputDir}`);
    }
}

/**
 * 生成字段映射表文档
 */
function generateMappingDocs() {
    const docs = `# JSON压缩字段映射表

## 概述
本映射表用于压缩War3数据JSON文件，通过缩短字段名来减小文件体积。

## 原理
- **高频字段**: 使用1-2字符短名
- **中频字段**: 使用2-3字符缩写
- **低频字段**: 保持原名或使用3字符缩写
- **冗余字段**: 直接移除

## 字段映射表

\`\`\`javascript
${JSON.stringify(FIELD_MAPPING, null, 2)}
\`\`\`

## 冗余字段（已移除）
\`\`\`javascript
${JSON.stringify(REDUNDANT_FIELDS, null, 2)}
\`\`\`

## 使用方法

### 压缩
\`\`\`bash
node compress.js
\`\`\`

### 解压（如果需要）
\`\`\`javascript
const { decompressJson } = require('./compress.js');
const compressed = require('./data_compressed/units_compressed.json');
const original = decompressJson(compressed);
\`\`\`

## 预期压缩率
- units.json: ~40-50%
- abilities.json: ~35-45%
- items.json: ~30-40%
- 其他文件: ~25-35%

## 注意事项
1. 压缩后的文件需要配合解压函数使用
2. 如果直接使用，需要修改读取代码中的字段名映射
3. 建议同时保留原始文件作为备份
`;

    fs.writeFileSync(path.join(__dirname, 'COMPRESS_MAPPING.md'), docs, 'utf8');
    console.log('📄 已生成字段映射文档: COMPRESS_MAPPING.md');
}

// 执行压缩
if (require.main === module) {
    compressAllFiles();
    generateMappingDocs();
}

module.exports = {
    compressObject,
    compressJsonArray,
    decompressJson,
    compressAllFiles,
    FIELD_MAPPING,
    REVERSE_MAPPING,
    REDUNDANT_FIELDS
};
