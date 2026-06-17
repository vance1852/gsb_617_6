// 模拟参数与阶段数据（纯数据，无副作用）
export const Config = {
  progress: 0,
  subsidenceDepth: 2.0,
  waterLevel: 1.5,
  sedimentThickness: 1.0,
  aridRate: 1.0, // 干旱化速率
  erosionIntensity: 1.0,
  ridgeDensity: 10,
};

// 阶段说明 - 温度和湿度会根据干旱化速率动态调整
export const stageData = [
  {
    name: "初始平原",
    baseTemp: 18,
    baseHumid: 45,
    wind: 0,
    text: "平坦地表，古老基岩构成。即将经历剧烈构造运动。",
  },
  {
    name: "地壳下沉",
    baseTemp: 16,
    baseHumid: 50,
    wind: 2,
    text: '构造运动使地壳<b>断裂下沉</b>，形成低洼<b class="highlight">断陷盆地</b>，为湖泊形成创造条件。',
  },
  {
    name: "湖泊沉积",
    baseTemp: 14,
    baseHumid: 75,
    wind: 3,
    text: '降水汇入形成<b>内陆湖泊</b>。粉砂、黏土、盐类逐层沉积，形成<b class="highlight">湖相沉积岩</b>。',
  },
  {
    name: "气候干裂",
    baseTemp: 28,
    baseHumid: 20,
    wind: 5,
    text: '气候<b>暖干化</b>，湖泊萎缩干涸。湖床裸露产生<b class="highlight">龟裂纹</b>，成为侵蚀突破口。',
  },
  {
    name: "风力侵蚀",
    baseTemp: 35,
    baseHumid: 10,
    wind: 12,
    text: '强劲定向风沿裂隙<b>磨蚀吹蚀</b>。沟槽加深，坚硬层形成<b class="highlight">垄脊</b>，软弱层成<b class="highlight">沟槽</b>。',
  },
];
