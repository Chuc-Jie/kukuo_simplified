// ==UserScript==
// @name         Kukuo 工具站繁转简
// @namespace    https://github.com/Chuc-Jie/kukuo-simplified
// @version      1.0.0
// @description  使用精确匹配词典将 kukuo.tw 网站上的繁体中文转换为简体中文，避免混合翻译，适用于 Minecraft 物品编辑器。
// @author       友野YouyEr
// @icon         https://kukuo.tw/favicon.ico
// @match        *://kukuo.tw/*
// @grant        none
// @noframes
// @license      GPL-3.0
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ======================= 忽略区域配置 =======================
    const ignoredSelectors = [
        'code', 'pre', 'script', 'style', 'textarea', 'kbd',
        '.CodeMirror', '.monaco-editor', '.cm-editor', '.codemirror-textarea',
        'input[type="text"]', 'input[type="password"]', 'input[type="email"]',
        '[data-do-not-translate]', '[data-translation-ignore]'
        // 可针对 kukuo 网站添加额外忽略选择器
    ];

    const ignoredClassesSet = new Set([
        'CodeBlock', 'gitSha', 'monospace', 'file-list', 'version-info'
        // 如有需要可补充
    ]);

    // ======================= 翻译词典（繁体 → 简体） =======================
    const i18n = new Map([
        
        // ----- 导航栏 -----
        ['地圖', '地图'],
        ['數據包', '数据包'],
        ['小工具', '小工具'],
        ['指令教學', '指令教学'],

        // 地图
        ['Java版地圖', 'Java版地图'],

        // 数据包
        ['Java版資料包', 'Java版数据包'],


        // 小工具
            // ----- 小工具页-导航栏 -----
            ['頭顱指令產生器', '头颅指令生成器'],
            ['物品指令產生器', '物品指令生成器'],
            ['藥水指令產生器', '药水指令生成器'],
            ['生物指令產生器', '生物指令生成器'],
            ['生怪磚指令產生器', '刷怪笼指令生成器'],
            ['商店指令產生器', '商店指令生成器'],

            // 工具版本标题
            ['Minecrat 工具：自訂物品指令產生器 (1.21.1)', '【1.21.1】自定义物品生成器'],

            // 左侧卡片
            ['累計生成：','累计生成：'],
            ['今日生成：','今日生成：'],
            ['顏色代碼：','颜色代码：'],
            ['格式代碼：','格式代码：'],
            ['粗體：&L','粗体：&L'],
            ['斜體：&O','斜体：&O'],
            ['底線：&N','底线：&N'],
            ['刪除：&M','删除：&M'],
            ['亂碼：&K','乱码：&K'],
            ['重設：&R','重置：&R'],

            // 中间\右侧按钮
            ['儲存','保存'],
            ['套用','套用'],
            ['匯入','导入'],
            ['匯出','导出'],
            ['生成指令碼', '生成指令'],
            ['複製指令碼', '复制指令'],

            // 输入框提示文本
            ['物品名稱', '物品名称'],
            ['物品敘述', '物品描述'],

            // ----- 属性 -----
            ['屬性：', '属性：'],

            ['屬性名稱','属性名称'],
            ['觸發部位','触发部位'],
            ['屬性數值','属性数值'],
            ['數值類型','数值类型'],
            ['删除','删除'],

            // ----- 装备位置（触发条件）-----
            ['在任意部位時', '在任意部位时'],
            ['在手上時', '在手上时'],
            ['在慣用手時', '在惯用手时'],
            ['在非慣用手時', '在非惯用手时'],
            ['在任意盔甲時', '在任意盔甲时'],
            ['在頭上時', '在头上时'],
            ['在身上時', '在身上时'],
            ['在腿上時', '在腿上时'],
            ['在腳上時', '在脚上时'],
            ['在動物身上時', '在动物身上时'],

            // ----- 数值类型 -----
            ['數值', '数值'],
            ['% (單利)', '% (单利)'],
            ['% (複利)', '% (复利)'],

            ['新增屬性','新增属性'],
            ['生命值', '最大生命值'],
            ['攻擊力', '攻击伤害'],
            ['盔甲值', '护甲值'],
            ['盔甲韌性', '盔甲韧性'],
            ['攻擊速度', '攻击速度'],
            ['移動速度', '速度'],
            ['擊退抗性', '击退抗性'],
            ['擊退力', '击退'],
            ['體型', '尺寸'],
            ['行走高度', '最大行走高度'],
            ['跳躍力', '跳跃力度'],
            ['移動效率', '移动效率'],
            ['方塊互動距離', '方块交互距离'],
            ['實體互動距離', '实体交互距离'],
            ['挖掘速度', '方块破坏速度'],
            ['挖掘效率', '挖掘效率'],
            ['潛行移動效率', '潜行速度'],
            ['水中挖掘速度', '水下挖掘速度'],
            ['橫掃傷害倍率', '横扫伤害比率'],
            ['額外氧氣時間', '额外氧气'],
            ['水中移動效率', '水中移动效率'],
            ['重力', '重力'],
            ['安全摔落高度', '安全摔落高度'],
            ['摔落傷害倍率', '摔落伤害倍数'],
            ['燃燒時間倍率', '着火时间'],
            ['爆炸擊退抗性', '爆炸击退抗性'],
            ['飛行速度', '飞行速度'],
            ['最大護盾', '最大伤害吸收值'],
            ['尋路距離', '生物跟随距离'],
            ['召喚增援機率', '僵尸增援概率'],

            // ----- 附魔 -----
            ['附魔：', '附魔：'],

            ['附魔名稱','附魔名称'],
            ['附魔等級','附魔等级'],
            ['删除','删除'],

            ['新增附魔效果','新增附魔效果'],
            ['保護', '保护【头盔、胸甲、护腿、靴子、海龟壳】'],
            ['抗火性', '抗火性【头盔、胸甲、护腿、靴子、海龟壳】'],
            ['輕盈', '摔落缓冲【靴子】'],
            ['防爆', '爆炸保护【头盔、胸甲、护腿、靴子、海龟壳】'],
            ['防彈', '弹射物保护【头盔、胸甲、护腿、靴子、海龟壳】'],
            ['水中呼吸', '水中呼吸【头盔、海龟壳】'],
            ['水中挖掘', '水中挖掘【头盔、海龟壳】'],
            ['尖刺', '荆棘【头盔、胸甲、护腿、靴子、海龟壳】'],
            ['深海漫遊', '深海漫游【靴子】'],
            ['冰霜行者', '冰霜行者【靴子】'],
            ['綁定詛咒', '绑定诅咒【所有】'],
            ['鋒利', '锋利【剑、斧】'],
            ['不死剋星', '亡灵杀手【剑、斧】'],
            ['節肢剋星', '节肢杀手【剑、斧】'],
            ['擊退', '击退【剑、斧】'],
            ['燃燒', '火焰附加【剑】'],
            ['掠奪', '掠夺【剑】'],
            ['橫掃之刃', '横扫之刃【剑】'],
            ['效率', '效率【镐、斧、锹、剪刀】'],
            ['絲綢之觸', '精准采集【所有】'],
            ['耐久', '耐久【所有】'],
            ['幸運', '时运【镐、斧、锹】'],
            ['強力', '力量【弓】'],
            ['擊退(弓)', '冲击【弓】'],
            ['火焰', '火矢【弓】'],
            ['無限', '无限【弓】'],
            ['海洋的祝福', '海之眷顾【钓鱼竿】'],
            ['魚餌', '钓饵【钓鱼竿】'],
            ['忠誠', '忠诚【三叉戟】'],
            ['魚叉', '穿刺【三叉戟】'],
            ['波濤', '激流【三叉戟】'],
            ['引雷', '引雷【三叉戟】'],
            ['經驗修補', '经验修补【所有】'],
            ['消失詛咒', '消失诅咒【所有】'],
            ['三重射擊', '多重射击【弩】'],
            ['穿透', '穿透【弩】'],
            ['快速裝填', '快速装填【弩】'],
            ['靈魂疾走', '灵魂疾行【靴子】'],
            ['迅捷潛行', '迅捷潜行【护腿】'],
            ['緻密', '致密【重锤】'],
            ['風爆', '风爆【重锤】'],
            ['破甲', '破甲【重锤】'],

            // ----- 复选框标签 -----
            ['無限耐久', '无限耐久'],
            ['隱藏附魔標籤', '隐藏附魔标签'],
            ['隱藏屬性標籤', '隐藏属性标签'],
            ['隱藏無限耐久標籤', '隐藏无限耐久标签'],
            ['隱藏可破壞標籤', '隐藏可破坏标签'],
            ['隱藏可放置標籤', '隐藏可放置标签'],
            ['隱藏其他標籤', '隐藏其他标签'],
            ['隱藏皮革顏色標籤', '隐藏皮革颜色标签'],
            ['隱藏盔甲紋飾標籤', '隐藏盔甲纹饰标签'],

            // ----- 进阶选项 -----
            ['進階選項', '进阶选项'],
            ['可放置在：', '可放置在：'],
            ['可破壞：', '可破坏'],
            ['修復成本：', '修复成本'],
            ['自訂模型：', '自定义模型'],
            ['損壞值：', '已掉耐久值'],
            ['最大損壞值：', '最大耐久值'],
            ['最大堆疊：', '最大堆叠'],
            ['虛擬NBT：', '虚拟NBT'],

        //  ----- 指令教学 -----
        ['Java版教學', 'Java版教学'],

        // ----- 其他可能出现的界面文字（可根据需要自行添加）-----
        ['確認', '确认'],
        ['取消', '取消'],
        ['儲存', '保存'],
        ['刪除', '删除'],
        ['編輯', '编辑'],
        ['新增', '新增'],
        ['複製', '复制'],
        ['貼上', '粘贴'],
        ['重新整理', '刷新'],
        ['載入中', '加载中'],
        ['請選擇', '请选择'],
        ['搜尋', '搜索'],
        ['重置', '重置'],
        ['關閉', '关闭'],
        ['上一頁', '上一页'],
        ['下一頁', '下一页'],
        ['確定', '确定'],
        ['返回', '返回'],
        ['首頁', '首页'],
        ['設定', '设置'],
        ['說明', '说明'],
        ['關於', '关于'],
    ]);

    // ---------- 构建完全匹配映射 ----------
    const fullMatchMap = new Map(); // 键 -> 译文（大小写敏感）
    for (const [key, value] of i18n.entries()) {
        fullMatchMap.set(key, value);
    }

    // ---------- 忽略节点检查（带缓存）----------
    const ignoreCache = new WeakMap();

    function shouldIgnoreNode(node) {
        if (!node || node.nodeType !== 1) return false;
        if (ignoreCache.has(node)) return ignoreCache.get(node);

        if (ignoredSelectors.some(selector => node.matches && node.matches(selector))) {
            ignoreCache.set(node, true);
            return true;
        }
        if (node.classList) {
            for (let cls of node.classList) {
                if (ignoredClassesSet.has(cls)) {
                    ignoreCache.set(node, true);
                    return true;
                }
            }
        }
        let parent = node.parentNode;
        while (parent && parent !== document.body && parent.nodeType === 1) {
            if (ignoredSelectors.some(selector => parent.matches && parent.matches(selector))) {
                ignoreCache.set(node, true);
                return true;
            }
            if (parent.classList) {
                for (let cls of parent.classList) {
                    if (ignoredClassesSet.has(cls)) {
                        ignoreCache.set(node, true);
                        return true;
                    }
                }
            }
            parent = parent.parentNode;
        }
        ignoreCache.set(node, false);
        return false;
    }

    // ---------- 核心翻译函数（仅完全匹配）----------
    function translateTextNode(node) {
        if (!node || node.nodeType !== 3) return;
        const original = node.nodeValue;
        if (!original || original.trim() === '') return;
        // 避免翻译纯数字
        if (/^\d+$/.test(original.trim())) return;

        const trimmed = original.trim();
        if (fullMatchMap.has(trimmed)) {
            const translation = fullMatchMap.get(trimmed);
            // 保留原文本前后的空白
            const leading = original.match(/^\s*/)[0];
            const trailing = original.match(/\s*$/)[0];
            node.nodeValue = leading + translation + trailing;
        }
    }

    function translateAttribute(element, attrName) {
        if (!element || !element.hasAttribute(attrName)) return;
        const attrValue = element.getAttribute(attrName);
        if (!attrValue || attrValue.trim() === '') return;
        if (/^\d+$/.test(attrValue.trim())) return;

        const trimmed = attrValue.trim();
        if (fullMatchMap.has(trimmed)) {
            element.setAttribute(attrName, fullMatchMap.get(trimmed));
        }
    }

    // 翻译一个节点及其后代（增量）
    function translateNode(node) {
        if (!node) return;
        if (node.nodeType === 3) {
            translateTextNode(node);
            return;
        }
        if (node.nodeType !== 1) return;
        if (shouldIgnoreNode(node)) return;

        // 翻译属性
        if (node.hasAttribute('title')) translateAttribute(node, 'title');
        if (node.hasAttribute('placeholder')) translateAttribute(node, 'placeholder');
        if (node.hasAttribute('aria-label')) translateAttribute(node, 'aria-label');
        if ((node.tagName === 'INPUT' || node.tagName === 'BUTTON') &&
            node.hasAttribute('value') &&
            node.getAttribute('type') !== 'password') {
            translateAttribute(node, 'value');
        }

        // 遍历子节点
        const children = node.childNodes;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.nodeType === 3) {
                translateTextNode(child);
            } else if (child.nodeType === 1 && !shouldIgnoreNode(child)) {
                translateNode(child);
            }
        }
    }

    // 全量翻译（用于初始化、路由变化）
    function fullTranslate() {
        translateNode(document.body);
    }

    // ---------- 监听动态内容 ----------
    let translationTimer = null;

    const observer = new MutationObserver(mutations => {
        clearTimeout(translationTimer);
        translationTimer = setTimeout(() => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        translateNode(node);
                    } else if (node.nodeType === 3 && node.nodeValue.trim()) {
                        translateTextNode(node);
                    }
                }
                if (mutation.type === 'attributes' &&
                    ['title', 'placeholder', 'aria-label'].includes(mutation.attributeName)) {
                    translateAttribute(mutation.target, mutation.attributeName);
                }
                if (mutation.type === 'characterData' && mutation.target) {
                    translateTextNode(mutation.target);
                }
            }
        }, 80);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['title', 'placeholder', 'aria-label']
    });

    // ---------- 监听 SPA 路由变化 ----------
    function onUrlChange() {
        setTimeout(fullTranslate, 200);
    }

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        onUrlChange();
    };
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        onUrlChange();
    };

    window.addEventListener('popstate', onUrlChange);
    window.addEventListener('hashchange', onUrlChange);

    // 点击处理：针对动态弹窗、下拉菜单
    document.addEventListener('click', (e) => {
        setTimeout(() => {
            const target = e.target;
            if (target && (target.closest('button') || target.closest('[role="button"]') || target.closest('a'))) {
                setTimeout(() => {
                    document.querySelectorAll('.modal, .dropdown-menu, .popover, .dialog, .el-select-dropdown').forEach(el => {
                        if (el.style.display !== 'none') translateNode(el);
                    });
                }, 150);
            }
        }, 100);
    }, true);

    // ---------- 初始化 ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            fullTranslate();
        });
    } else {
        fullTranslate();
    }
    window.addEventListener('load', () => {
        setTimeout(fullTranslate, 300);
    });

    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });
})();