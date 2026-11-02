import { SchoolCelebrationData, AlbumLink, HomeCardConfig } from '../types';

export const DEFAULT_HOME_CARDS: Record<string, HomeCardConfig> = {
  activities: {
    title: '賽事活動簡介',
    desc: '田徑、拔河與趣味競賽詳情，探索各年級精彩競技項目與熱血運動會規範。',
    buttonText: '查看賽事',
    imageUrl: '/src/assets/images/hero_kghs_celebration_1792325750838.jpg'
  },
  schedule: {
    title: '運動會賽程表',
    desc: '精準掌握 11/6 運動會各項賽事與檢錄精準時間表，即時鎖定參賽時段。',
    buttonText: '瀏覽賽程',
    imageUrl: '/src/assets/images/hero_kghs_celebration_1792325750838.jpg'
  },
  honor: {
    title: '校慶榮譽榜',
    desc: '各項決賽成績、獲獎班級與大會紀錄名單即時榜單公布，見證光榮時刻。',
    buttonText: '查看榮譽榜',
    imageUrl: '/src/assets/images/hero_kghs_celebration_1792325750838.jpg'
  },
  interviews: {
    title: '校慶專題採訪',
    desc: '走訪運動員與籌辦班級的熱血心路，真實記錄最動人的雄女青春印記。',
    buttonText: '閱讀報導',
    imageUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg'
  },
  liveNews: {
    title: '現場快報',
    desc: '第一時間掌握賽場即時花絮與精彩速報，捕捉各年級最熱血的現場瞬間。',
    buttonText: '查看快報',
    imageUrl: '/src/assets/images/hero_kghs_celebration_1792325750838.jpg'
  },
  weekActivities: {
    title: '校慶週活動',
    desc: '系列主題慶祝活動、特色講座與動靜態展覽時程，共度雄女 102 歲生日。',
    buttonText: '探索活動',
    imageUrl: '/src/assets/images/fair_game_flyer_1792325751300.jpg'
  },
  albums: {
    title: '校慶相簿專區',
    desc: '雲端高畫質相片連結回顧，完整典藏創意進場、大隊接力與歡笑盛況。',
    buttonText: '相片下載',
    imageUrl: '/src/assets/images/fair_game_flyer_1792325751300.jpg'
  },
  booths: {
    title: '各班攤位一覽',
    desc: '探索 11/7 園遊會全校各班美食甜點、清涼冷飲與文創娛樂攤位傳單海報。',
    buttonText: '立即逛攤位',
    imageUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg'
  }
};

export const INITIAL_DATA: SchoolCelebrationData = {
  announcement: {
    enabled: true,
    text: '🎉 賀！高雄女中 102 週年校慶暨運動會熱烈展開！11/6(五) 運動會盛大登場、11/7(六) 園遊會歡慶擺攤，歡迎全校師生與校友共襄盛舉！',
    type: 'celebrate'
  },
  activities: [

    {
      id: 'act-1',
      title: '高一／高二 創意繞場進場暨班級精神隊呼',
      category: '表演進場',
      description: '展現雄女青年無比創意與班級凝聚力！各班結合時事、動漫、文學與環保議題精心設計變裝造型與原創口號。',
      rules: '每班繞場表演時間限 90 秒，由評審團依據創意造型 40%、精神隊呼 30%、班級參與度 30% 進行評分。',
      location: '司令台前田徑場跑道',
      target: '全體高一、高二各班'
    },
    {
      id: 'act-2',
      title: '女子 100 公尺短跑計時決賽',
      category: '運動競賽',
      description: '全校速度頂尖選手在百米直道上的極速對決，爭奪「雄女最速風之女王」榮譽！',
      rules: '採分組計時決賽制，電動計時，各年級取前六名頒發獎牌與獎狀。',
      location: '田徑場直線跑道',
      target: '各班選派男女代表選手'
    },
    {
      id: 'act-3',
      title: '女子 800 公尺中長跑耐力賽',
      category: '運動競賽',
      description: '考驗配速智慧與意志力的兩圈體力爭霸，全場師生圍繞跑道齊聲吶喊加油！',
      rules: '每組上限 12 人，搶道跑法，以秒數決定年級最終排行名次。',
      location: '田徑場標準跑道',
      target: '高一、高二、高三各組選手'
    },
    {
      id: 'act-4',
      title: '4 × 100 公尺大隊高速接力',
      category: '運動競賽',
      description: '考驗四位選手的默契交接棒與團隊合作，速度與失誤僅在毫釐之間！',
      rules: '接力區內完成交接棒，掉棒可撿回但不干擾他道，取最優前四隊晉級決賽。',
      location: '標準 400 公尺田徑跑道',
      target: '各班 4 人接力代表隊'
    },
    {
      id: 'act-5',
      title: '萬眾矚目：全年級大隊接力錦標賽',
      category: '運動競賽',
      description: '校慶運動會每年度最高潮賽事！20 位同學齊心協力接力狂奔，爭取年度精神班級最高榮耀。',
      rules: '每隊 20 人，每棒次跑 100 公尺，前 10 棒為女生，後 10 棒依各班戰術排序。',
      location: '400公尺主跑道',
      target: '全校各班級'
    },
    {
      id: 'act-6',
      title: '教職員與學生趣味競賽：同心協力滾巨球',
      category: '趣味競賽',
      description: '校長、師長與班聯會同學同場競技，拉近師生情誼，笑料與驚喜不斷！',
      rules: '兩人一組背靠背夾大汽球折返跑，不可用手扶球，最快折返隊伍獲勝。',
      location: '大草坪中央區',
      target: '教職員工隊伍 & 學生代表隊'
    },
    {
      id: 'act-7',
      title: '閉幕典禮暨全校總錦標頒獎',
      category: '典禮儀式',
      description: '頒發 102 週年校慶各項競賽前三名、精神總錦標、創意隊呼特優錦旗，共同唱校歌慶祝母校生日！',
      rules: '請各班集合至司令台前指定位置就位，班旗手前列就位。',
      location: '中央大草坪司令台',
      target: '全體師生與嘉賓'
    }
  ],
  schedules: [
    {
      id: 'sch-1',
      day: '11/6',
      time: '08:00',
      title: '全體師生集合點名與進場準備'
    },
    {
      id: 'sch-2',
      day: '11/6',
      time: '08:30',
      title: '102nd 校慶開幕典禮暨各班創意繞場'
    },
    {
      id: 'sch-3',
      day: '11/6',
      time: '09:40',
      title: '高一／高二 100 公尺分組預賽'
    },
    {
      id: 'sch-4',
      day: '11/6',
      time: '10:45',
      title: '高一／高二 800 公尺計時決賽'
    },
    {
      id: 'sch-5',
      day: '11/6',
      time: '11:30',
      title: '教職員趣味競賽（同心協力滾巨球）'
    },
    {
      id: 'sch-6',
      day: '11/6',
      time: '12:00',
      title: '午餐休息與場地整理'
    },
    {
      id: 'sch-7',
      day: '11/6',
      time: '13:30',
      title: '4 × 100 公尺接力決賽'
    },
    {
      id: 'sch-8',
      day: '11/6',
      time: '14:30',
      title: '壓軸賽事：全校年級大隊接力錦標賽'
    },
    {
      id: 'sch-9',
      day: '11/6',
      time: '16:00',
      title: '閉幕典禮暨榮譽榜總錦標頒獎'
    }
  ],
  checkinSchedules: [
    {
      id: 'chk-1',
      title: '高一／高二 100 公尺分組預賽',
      time: '09:15',
      location: '司令台後方檢錄處'
    },
    {
      id: 'chk-2',
      title: '高一／高二 800 公尺計時決賽',
      time: '10:20',
      location: '體育器材室前檢錄一處'
    },
    {
      id: 'chk-3',
      title: '教職員趣味競賽（同心協力滾巨球）',
      time: '11:10',
      location: '大草坪中央檢錄站'
    },
    {
      id: 'chk-4',
      title: '4 × 100 公尺接力決賽',
      time: '13:00',
      location: '400m 跑道起點檢錄處'
    },
    {
      id: 'chk-5',
      title: '壓軸賽事：全校年級大隊接力錦標賽',
      time: '14:00',
      location: '操場南側檢錄專區'
    }
  ],
  honorRoll: [
    {
      id: 'honor-1',
      eventName: '100m 個人決賽',
      category: '徑賽',
      content: '第一名：205班 陳怡安 12.68 秒 (破大會紀錄)\n第二名：102班 林佳穎 13.12 秒\n第三名：208班 許舒婷 13.45 秒',
      awards: [
        { id: 'aw-1-1', rank: '第一名', awardee: '205班 陳怡安', score: '12.68 秒 (破大會紀錄)' },
        { id: 'aw-1-2', rank: '第二名', awardee: '102班 林佳穎', score: '13.12 秒' },
        { id: 'aw-1-3', rank: '第三名', awardee: '208班 許舒婷', score: '13.45 秒' }
      ]
    },
    {
      id: 'honor-2',
      eventName: '800m 耐力長跑',
      category: '徑賽',
      content: '第一名：201班 鄭又慈 2分24秒30\n第二名：109班 黃韻竹 2分29秒15\n第三名：104班 蔡宜臻 2分32秒80',
      awards: [
        { id: 'aw-2-1', rank: '第一名', awardee: '201班 鄭又慈', score: '2分24秒30' },
        { id: 'aw-2-2', rank: '第二名', awardee: '109班 黃韻竹', score: '2分29秒15' },
        { id: 'aw-2-3', rank: '第三名', awardee: '104班 蔡宜臻', score: '2分32秒80' }
      ]
    },
    {
      id: 'honor-3',
      eventName: '4 × 100m 班際接力',
      category: '徑賽',
      content: '第一名：205班 代表隊 52.14 秒\n第二名：201班 代表隊 53.08 秒\n第三名：102班 代表隊 53.85 秒',
      awards: [
        { id: 'aw-3-1', rank: '第一名', awardee: '205班 代表隊', score: '52.14 秒' },
        { id: 'aw-3-2', rank: '第二名', awardee: '201班 代表隊', score: '53.08 秒' },
        { id: 'aw-3-3', rank: '第三名', awardee: '102班 代表隊', score: '53.85 秒' }
      ]
    },
    {
      id: 'honor-4',
      eventName: '全年級大隊接力錦標賽',
      category: '徑賽',
      content: '第一名 (高一組)：102班 全體選手 4分28秒10\n第一名 (高二組)：201班 全體選手 4分19秒55\n第二名 (高二組)：206班 全體選手 4分22秒40\n第三名 (高二組)：205班 全體選手 4分25秒18',
      awards: [
        { id: 'aw-4-1', rank: '第一名 (高一組)', awardee: '102班 全體選手', score: '4分28秒10' },
        { id: 'aw-4-2', rank: '第一名 (高二組)', awardee: '201班 全體選手', score: '4分19秒55' },
        { id: 'aw-4-3', rank: '第二名 (高二組)', awardee: '206班 全體選手', score: '4分22秒40' },
        { id: 'aw-4-4', rank: '第三名 (高二組)', awardee: '205班 全體選手', score: '4分25秒18' }
      ]
    },
    {
      id: 'honor-5',
      eventName: '班際拔河錦標賽',
      category: '田賽',
      content: '冠軍：207班 連勝直落二\n亞軍：203班 二勝一負\n季軍：106班 逆轉勝',
      awards: [
        { id: 'aw-5-1', rank: '冠軍', awardee: '207班', score: '連勝直落二' },
        { id: 'aw-5-2', rank: '亞軍', awardee: '203班', score: '二勝一負' },
        { id: 'aw-5-3', rank: '季軍', awardee: '106班', score: '逆轉勝' }
      ]
    },
    {
      id: 'honor-6',
      eventName: '創意繞場進場評選',
      category: '團體趣味',
      content: '特優第一名：204班 「百變動漫風暴」\n特優第二名：101班 「穿越百年雄女復古潮」\n最佳人氣獎：202班 「環保科技綠未來」',
      awards: [
        { id: 'aw-6-1', rank: '特優第一名', awardee: '204班', score: '「百變動漫風暴」' },
        { id: 'aw-6-2', rank: '特優第二名', awardee: '101班', score: '「穿越百年雄女復古潮」' },
        { id: 'aw-6-3', rank: '最佳人氣獎', awardee: '202班', score: '「環保科技綠未來」' }
      ]
    },
    {
      id: 'honor-7',
      eventName: '102 週年校慶精神總錦標',
      category: '總錦標',
      content: '高一精神總錦標：102班 總積分 186 分\n高二精神總錦標：201班 總積分 204 分\n道德風範獎：108班 全場零違規環保模範',
      awards: [
        { id: 'aw-7-1', rank: '高一精神總錦標', awardee: '102班', score: '總積分 186 分' },
        { id: 'aw-7-2', rank: '高二精神總錦標', awardee: '201班', score: '總積分 204 分' },
        { id: 'aw-7-3', rank: '道德風範獎', awardee: '108班', score: '全場零違規環保模範' }
      ]
    }
  ],
  interviews: [
    {
      id: 'iv-1',
      grade: '高一',
      title: '初次迎戰雄女大隊接力！高一新生熱血直擊',
      interviewee: '高一 102 班 體育股長 林語萱 同學',
      quote: '「從開學每天早自習的傳接棒練習，到全班二十個人喊破嗓子的加油聲，我們真的做到了！」',
      content: '剛踏入雄女校園不過兩個多月，高一 102 班在本次大隊接力以 4 分 28 秒勇奪高一年級冠軍！林同學受訪時笑著表示，起初大家連起跑姿勢都手忙腳亂，但每天放學大家主動留在操場練習十次交接棒。「我們雄女人不服輸的韌性，在跑道上徹底燃燒了！」',
      imageUrl: '/src/assets/images/hero_kghs_celebration_1792325750838.jpg',
      publishTime: '2026-11-06 17:30'
    },
    {
      id: 'iv-2',
      grade: '高一',
      title: '手繪復古傳單引爆話題！101 班園遊會秘密特調揭曉',
      interviewee: '高一 101 班 美宣組長 曾品妍 同學',
      quote: '「我們想做出既有雄女紅色典雅氣質，又充滿青春少女心的甜點攤位！」',
      content: '走進 101 班的籌備教室，桌上鋪滿了手繪海報與試飲樣品。為了 11/7 園遊會，全班集思廣益研發了「斑蝶紫甘藍氣泡飲」與「手工焦糖脆香鬆餅」。曾同學說，大家分工精細，從成本試算、食材安全檢驗到 Instagram 宣傳濾鏡全由同學獨立策劃，這正是雄女獨立自主的最好證明！',
      imageUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      publishTime: '2026-11-06 18:15'
    },
    {
      id: 'iv-3',
      grade: '高二',
      title: '高二學姐的傳承與霸氣！201 班蟬聯精神總錦標心路歷程',
      interviewee: '高二 201 班 班長 吳佩珊 同學',
      quote: '「這不僅僅是獎盃，而是我們高二這一年最無可取代的青春印記。」',
      content: '連續兩年在校慶運動會表現亮眼的 201 班，今年再次以破紀錄的高分奪下高二精神總錦標。班長吳佩珊在受訪時眼眶泛紅分享：「高二課業比去年沉重許多，但校慶籌備凝聚了所有同學的心。當大隊接力最後一棒衝過終點線時，大家都衝上前相擁哭泣，這就是雄女最動人的力量。」',
      imageUrl: '/src/assets/images/hero_kghs_celebration_1792325750838.jpg',
      publishTime: '2026-11-06 18:40'
    },
    {
      id: 'iv-4',
      grade: '高二',
      title: '魔法狂歡夜！204 班大型實體復古遊戲攤位誕生記',
      interviewee: '高二 204 班 活動組長 廖亭葳 同學',
      quote: '「我們把木工工具帶進教室，自己鋸木板釘幸運轉盤，只為了讓大家玩得最盡興！」',
      content: '想要在園遊會眾多飲食攤中脫穎而出？204 班打造了長達 3 公尺的立體套圈圈與巨大幸運輪盤。廖同學透露，她們甚至為闖關成功者手工製作了雄女 102 校慶限定版紀念徽章，「希望所有蒞臨雄女的國中學妹、家長與校友，都能帶回最棒的歡笑回憶。」',
      imageUrl: '/src/assets/images/fair_game_flyer_1792325751300.jpg',
      publishTime: '2026-11-06 19:10'
    }
  ],
  liveNews: [
    {
      id: 'news-1',
      title: '田徑場破紀錄熱血沸騰！高二大隊接力預賽成績亮眼',
      content: '今日上午陽光明媚，田徑場上掌聲雷動！高二各班在女子大隊接力預賽中展現驚人速度與完美交接棒默契，數個班級跑出突破歷屆紀錄的亮眼成績，司令台旁看台加油口號響徹雲霄！選手們奮力奔馳的身影，為 102 週年校慶揭開最熱血的序幕。',
      imageUrl: '/src/assets/images/hero_kghs_celebration_1792325750838.jpg',
      publishTime: '2026-11-06 10:30'
    },
    {
      id: 'news-2',
      title: '創意進場繞場高潮迭起，師生展現無限青春活力',
      content: '運動會開幕式於司令台前盛大舉行，各班創意進場融合環保時事、動漫與傳統文化元素，精湛的原創舞蹈與整齊劃一的班級精神隊呼，博得全場師長與評審熱烈喝采！現場師生亦展現高度團隊合作精神，氣氛歡樂沸騰。',
      imageUrl: '/src/assets/images/fair_game_flyer_1792325751300.jpg',
      publishTime: '2026-11-06 09:15'
    }
  ],
  weekActivities: [
    {
      id: 'week-1',
      title: '校慶主題靜態展「斑城光景・百年風華」藝文特展',
      content: '於圖書館一樓藝文展覽區盛大展出，精選百年來雄女珍貴校史照片、歷屆校服演進與學生藝術得獎作品。現場亦設有紀念明信片蓋章集點互動區，歡迎全校師生與返校校友踴躍參觀打卡，細細品味雄女光榮歲月。',
      imageUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      publishTime: '2026-11-02 09:00'
    },
    {
      id: 'week-2',
      title: '「紅斑馬之聲」校慶週草地音樂會熱烈登場',
      content: '午間於學生活動中心旁草坪舉行，邀請吉他社、熱音社與合唱團輪番登台獻唱，帶來充滿青春朝氣的原創組曲與校慶慶祝歌曲。現場聚集眾多同學圍坐聆聽，在悠揚樂聲中一同為雄女慶生！',
      imageUrl: '/src/assets/images/hero_kghs_celebration_1792325750838.jpg',
      publishTime: '2026-11-04 12:20'
    }
  ],
  booths: [
    {
      id: 'b-101',
      grade: '高一',
      className: '101',
      category: '甜點、冷飲',
      categories: ['甜點', '冷飲'],
      flyerUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      boothNumber: 'A01',
      description: '波霸黑糖鮮奶、手作草莓窩夫鬆餅與初戀特調氣泡飲'
    },
    {
      id: 'b-102',
      grade: '高一',
      className: '102',
      category: '冷飲',
      categories: ['冷飲'],
      flyerUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      boothNumber: 'A02',
      description: '百香翡翠檸檬凍、冬瓜鮮奶茶，滿百即贈校慶限定明信片'
    },
    {
      id: 'b-103',
      grade: '高一',
      className: '103',
      category: '鹹食',
      categories: ['鹹食'],
      flyerUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      boothNumber: 'A03',
      description: '酥脆金黃美式薯條、香濃爆漿起司球、日式照燒雞肉串'
    },
    {
      id: 'b-104',
      grade: '高一',
      className: '104',
      category: '遊戲/娛樂',
      categories: ['遊戲/娛樂'],
      flyerUrl: '/src/assets/images/fair_game_flyer_1792325751300.jpg',
      boothNumber: 'A04',
      description: '水球狙擊神射手、經典復古套圈圈，過五關送超巨玩偶！'
    },
    {
      id: 'b-105',
      grade: '高一',
      className: '105',
      category: '甜點',
      categories: ['甜點'],
      flyerUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      boothNumber: 'A05',
      description: '法式現烤可麗餅、香蕉巧克力薄餅，少女午後甜蜜首選'
    },
    {
      id: 'b-201',
      grade: '高二',
      className: '201',
      category: '鹹食、冷飲',
      categories: ['鹹食', '冷飲'],
      flyerUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      boothNumber: 'B01',
      description: '韓式現炸年糕配香辣起司拉麵、現烤大熱狗'
    },
    {
      id: 'b-202',
      grade: '高二',
      className: '202',
      category: '冷飲',
      categories: ['冷飲'],
      flyerUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      boothNumber: 'B02',
      description: '多重莓果漸層氣泡飲、古法熬煮冰糖洛神花茶'
    },
    {
      id: 'b-204',
      grade: '高二',
      className: '204',
      category: '遊戲/娛樂、文創手作',
      categories: ['遊戲/娛樂', '文創手作'],
      flyerUrl: '/src/assets/images/fair_game_flyer_1792325751300.jpg',
      boothNumber: 'B04',
      description: '巨大巨型幸運大轉盤、魔法套圈贏大獎，攤位人氣王！'
    },
    {
      id: 'b-205',
      grade: '高二',
      className: '205',
      category: '文創手作',
      categories: ['文創手作'],
      flyerUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      boothNumber: 'B05',
      description: '原創手繪雄女小紅書籤、客製似顏繪、班級徽章紀念品'
    },
    {
      id: 'b-206',
      grade: '高二',
      className: '206',
      category: '甜點、冷飲',
      categories: ['甜點', '冷飲'],
      flyerUrl: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      boothNumber: 'B06',
      description: '手工雪花冰、焦糖烤布蕾，現點現炙燒！'
    }
  ],
  boothCategories: ['冷飲', '甜點', '鹹食', '遊戲/娛樂', '文創手作'],
  buttonImages: {
    activities: '',
    schedule: '',
    honor: '',
    interviews: '',
    albums: '',
    booths: ''
  },
  homeCards: DEFAULT_HOME_CARDS,
  heroImage: '/assets/aistudio/image_a4c5d4ff.png',
  boothMapImage: '/src/assets/images/booth_fair_map_1792325750409.jpg',
  albums: [
    {
      id: 'album-1',
      title: '11/6 運動會精彩瞬間與大隊接力',
      subtitle: '校慶田徑賽、創意繞場進場、破紀錄頒獎高清照片集',
      externalUrl: 'https://photos.google.com/',
      coverImage: '/src/assets/images/hero_kghs_celebration_1792325750838.jpg',
      photoCount: '680+ 張原檔照片',
      provider: 'Google Photos'
    },
    {
      id: 'album-2',
      title: '11/7 園遊會熱鬧市集與社團公演',
      subtitle: '全校各班攤位笑顏、舞台表演、貴賓校友回娘家紀實',
      externalUrl: 'https://photos.google.com/',
      coverImage: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
      photoCount: '520+ 張原檔照片',
      provider: 'Google Photos'
    },
    {
      id: 'album-3',
      title: '102 週年校慶空拍與全景紀念',
      subtitle: '雄女校園全景俯瞰、大草坪精神排字與空拍縮時錄影',
      externalUrl: 'https://onedrive.live.com/',
      coverImage: '/src/assets/images/booth_fair_map_1792325750409.jpg',
      photoCount: '120+ 影音與精修圖',
      provider: 'OneDrive'
    }
  ]
};

export const DEFAULT_BOOTH_CATEGORIES: string[] = ['冷飲', '甜點', '鹹食', '遊戲/娛樂', '文創手作'];


// e. 相簿 (純雲端外部連結展示，依 SRD 規範不可在後台維護或修改)
export const OFFICIAL_ALBUMS: AlbumLink[] = [
  {
    id: 'album-1',
    title: '11/6 運動會精彩瞬間與大隊接力',
    subtitle: '校慶田徑賽、創意繞場進場、破紀錄頒獎高清照片集',
    externalUrl: 'https://photos.google.com/',
    coverImage: '/src/assets/images/hero_kghs_celebration_1792325750838.jpg',
    photoCount: '680+ 張原檔照片',
    provider: 'Google Photos'
  },
  {
    id: 'album-2',
    title: '11/7 園遊會熱鬧市集與社團公演',
    subtitle: '全校各班攤位笑顏、舞台表演、貴賓校友回娘家紀實',
    externalUrl: 'https://photos.google.com/',
    coverImage: '/src/assets/images/fair_food_flyer_1792325751416.jpg',
    photoCount: '520+ 張原檔照片',
    provider: 'Google Photos'
  },
  {
    id: 'album-3',
    title: '102 週年校慶空拍與全景紀念',
    subtitle: '雄女校園全景俯瞰、大草坪精神排字與空拍縮時錄影',
    externalUrl: 'https://onedrive.live.com/',
    coverImage: '/src/assets/images/booth_fair_map_1792325750409.jpg',
    photoCount: '120+ 影音與精修圖',
    provider: 'OneDrive'
  }
];

export const BOOTH_MAP_IMAGE = '/src/assets/images/booth_fair_map_1792325750409.jpg';
