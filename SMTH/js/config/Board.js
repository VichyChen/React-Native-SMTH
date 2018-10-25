import {
    NetworkManager,
} from '../config/Common';
import cio from 'cheerio-without-node-native';

global.boards = {
    all: {
        "Anhui": {
            "id": "d9b948edb6f83704201e5437c3004e22",
            "name": "梦里江淮·安徽"
        },
        "BeijingCulture": {
            "id": "bc83bd47259b1d4002bcd5df8a454cf1",
            "name": "京华烟云"
        },
        "BeijingSouthwest": {
            "id": "1f1239ab1f392d1b0dad969e75a4f53f",
            "name": "北京大西南联盟"
        },
        "Canada": {
            "id": "e5b2e1094975c9be9f77ba836d60cbc1",
            "name": "枫之国"
        },
        "ChangPing_line": {
            "id": "099da713ef18e5d883d09a4a0bbc991c",
            "name": "昌平线"
        },
        "Chengdu": {
            "id": "faff4f81de665a6bb0c5209bbbd0b211",
            "name": "成都"
        },
        "Chongqing": {
            "id": "00058e7a41dd465618539be387b5f72a",
            "name": "巴渝龙门阵·重庆"
        },
        "Europe": {
            "id": "9591ee50bde348112031b2808d4674fe",
            "name": "缘聚欧洲"
        },
        "Fujian": {
            "id": "f32cff1caf1d9c510c2c8d580c5a6acf",
            "name": "闽越畅怀·福建"
        },
        "Gansu": {
            "id": "77aa3c068366aabb2564afa0f2238ccf",
            "name": "千里陇原·甘肃"
        },
        "Guangdong": {
            "id": "0d9c666d454f70e1d33f81d2e5470b00",
            "name": "南粤风情·广东"
        },
        "Guangxi": {
            "id": "55a1ae7616fe6b44466dafa9465ce26e",
            "name": "八桂大地·广西"
        },
        "Guizhou": {
            "id": "426ebaa7b6d26cb8046e53f64d174230",
            "name": "山水黔情·贵州"
        },
        "Hebei": {
            "id": "b67de30b912135846e4b92cee0be770a",
            "name": "燕赵之风·河北"
        },
        "Henan": {
            "id": "1769a45640b7bf2b162d9dafe6c147d5",
            "name": "中原风采·河南"
        },
        "Hubei": {
            "id": "2c6581069b92285baf7c222f6c5543d7",
            "name": "极目楚天·湖北"
        },
        "HuiLongGuan": {
            "id": "a21e52ee270e0f093e62c626ab94ffe7",
            "name": "回龙观"
        },
        "Hunan": {
            "id": "e2d46ec11f214d02400ab847f970084d",
            "name": "三湘四水·湖南"
        },
        "JapanLife": {
            "id": "eab7fa000d5e19b86b6eaf25688b2477",
            "name": "东渡扶桑"
        },
        "Jiangsu": {
            "id": "94f02dd9463f63ce08adc639cbba7ebe",
            "name": "江海天地·江苏"
        },
        "Jiangxi": {
            "id": "a1a1c04fe75a0e53932f15c50cc1e67a",
            "name": "江南西道·江西"
        },
        "Liaoning": {
            "id": "045ada5fdd00dc2142e60b05246f6bae",
            "name": "关东龙睛·辽宁"
        },
        "Lishuiqiao": {
            "id": "71d4ac0f0cd10e64daa26b8d74a5cddf",
            "name": "立水桥"
        },
        "Nanjing": {
            "id": "c019738a4d589f8bf6b86365f32de65b",
            "name": "秦淮波绿·南京"
        },
        "NorthEast": {
            "id": "d8be3eb453d4afd9cff7367d32a11e97",
            "name": "东北老家"
        },
        "Oceania": {
            "id": "7a38016d1498bd896f03b2bba37c39f7",
            "name": "南十字星下"
        },
        "Qinghai": {
            "id": "88adb7964fc827f89c90c67d6af166a0",
            "name": "青海湖韵·青海"
        },
        "QingHe": {
            "id": "45122511c1642fe32ba4ffeee9ea8be9",
            "name": "清河"
        },
        "Shaanxi": {
            "id": "e585fc97a3eca398c21c95f5ca1986fc",
            "name": "三秦大地·陕西"
        },
        "Shandong": {
            "id": "ae50f8f97d32d583161ed7f063638afb",
            "name": "齐鲁大地·山东"
        },
        "Shanghai": {
            "id": "d7f08699c96a9800532235a0ad82577a",
            "name": "上海滩"
        },
        "ShangriLa": {
            "id": "9138dd29bc4c18ee77451c88d67d0fbe",
            "name": "大香格里拉·康青藏高原"
        },
        "Shanxi": {
            "id": "5e93b1be48060fd0753753e7cc2a00e9",
            "name": "三晋大地·山西"
        },
        "Shenzhen": {
            "id": "e5b17adcb4b7f516e81d7197b8d994bd",
            "name": "深圳特区"
        },
        "Shunyi": {
            "id": "f834736e6b2f38af1470c224e7ff42c5",
            "name": "顺义"
        },
        "Sichuan": {
            "id": "ea4c19e3160be8447ed51fb44e5d22f0",
            "name": "天府之国·四川"
        },
        "SZHK": {
            "id": "37b90a5aa8b6b3e199815aded312fcfd",
            "name": "深港生活圈"
        },
        "Tianjin": {
            "id": "6dac7e94fd49d581517ccdbfaaa52c25",
            "name": "天津卫"
        },
        "TongZhou": {
            "id": "14f463df295e59ebfa7fae14edcd7365",
            "name": "通州"
        },
        "WangJing": {
            "id": "3fe03d9aa94e0c021eb965aaeda79873",
            "name": "望京"
        },
        "Xinjiang": {
            "id": "cb35f888faec578639e3a5bdf0049628",
            "name": "丝路明珠·新疆"
        },
        "Xiongan": {
            "id": "ffecd78bcc62712edf6d8cce4a7ba5c6",
            "name": "雄安新区"
        },
        "Zhejiang": {
            "id": "67d521d7ec29af025756ff0d2f6dbeee",
            "name": "诗画之江·浙江"
        },
        "Association": {
            "id": "84329ac6b820f0aa31245a0e67c1f88d",
            "name": "协会社团"
        },
        "BIT": {
            "id": "a1ed79c3bf3bccd6472bc5346e34d63a",
            "name": "北京理工大学"
        },
        "BJSZ": {
            "id": "45c0de10ca8cf449833b73d075362718",
            "name": "北京四中"
        },
        "BJTU": {
            "id": "47cdbda61dd5ccb04d34520847f31837",
            "name": "北京交通大学"
        },
        "BJUT": {
            "id": "4ad296507229f6c734fdbd0a24e07b4d",
            "name": "北京工业大学"
        },
        "BNU": {
            "id": "8600257a35c6434a2703491091973354",
            "name": "北京师范大学"
        },
        "BUAA": {
            "id": "79986422ec96ef832aabc83e51d6c7eb",
            "name": "北京航空航天大学"
        },
        "BUPT": {
            "id": "c52b17eb32b1b5d1d5c9a32b719079be",
            "name": "北京邮电大学"
        },
        "CAS": {
            "id": "215325e07bae68842a6fe52dcd445eac",
            "name": "中国科学院"
        },
        "CAU": {
            "id": "e73a817f1e450c3645481c41303bd455",
            "name": "中国农业大学"
        },
        "CECM.THU": {
            "id": "c54fe7f77390c3343cc5af04a4782f95",
            "name": "清华土木建管"
        },
        "CSU": {
            "id": "c9e516009c3f327a2b5d4fbc100ef8dd",
            "name": "中南大学"
        },
        "DA.THU": {
            "id": "a671690071f818df8e38b6d5289fc839",
            "name": "清华自动化系"
        },
        "DAE.THU": {
            "id": "4a966b5c33bcba0e393fe197b5e9d185",
            "name": "清华汽车工程系"
        },
        "DCE.THU": {
            "id": "f59f4ba96481a7a665b33a20ee4eadc0",
            "name": "清华化学工程系"
        },
        "DEE.THU": {
            "id": "718608aab326f854723b0f0e7f32d904",
            "name": "清华电子工程系"
        },
        "DEEAET.THU": {
            "id": "d8ef470be28d23d34a6acbbe9597d225",
            "name": "清华电机系"
        },
        "DEM.THU": {
            "id": "c023a876ba28a39384289f342e2ccd5c",
            "name": "清华航天航空学院"
        },
        "DEP.THU": {
            "id": "09983c8b97a18f4c596718566bcf4b05",
            "name": "清华工程物理系"
        },
        "DHHE.THU": {
            "id": "085b1f8d7552fa1decdbe76872646e17",
            "name": "清华水利水电工程系"
        },
        "DMS.THU": {
            "id": "5f08049a34c2e237c40ff312240ac9e5",
            "name": "清华数学科学系"
        },
        "DP.THU": {
            "id": "40e6aa82adc356673f8b6151502361f6",
            "name": "清华物理系"
        },
        "DPIM.THU": {
            "id": "dc79ac9bea56f14a4c5aaa6968ff84a2",
            "name": "清华精密仪器与机械学系"
        },
        "DTE.THU": {
            "id": "780ddc6acd27758d13ad23bbcf707329",
            "name": "清华热能工程系"
        },
        "DUT": {
            "id": "0fcd3d9fd0e61e7759f9f8d3e270910a",
            "name": "大连理工大学"
        },
        "GaoKao": {
            "id": "47a1af7534a9a1e30fa9e7a32ad71b90",
            "name": "高考·大学"
        },
        "GSPBC": {
            "id": "f3e122ecab615ec4b54543c41ed036d7",
            "name": "五道口金融学院"
        },
        "HIT": {
            "id": "ff65af45fbca02c3a0c57b5e0c082bc5",
            "name": "哈尔滨工业大学"
        },
        "HUST": {
            "id": "1a61b12f69ff552a46de0107b04fc509",
            "name": "华中科技大学"
        },
        "JLU": {
            "id": "f3ba4e433de6f675a251678db0222336",
            "name": "吉林大学"
        },
        "LZU": {
            "id": "84857db6de0522125ccc89ad2a279e3c",
            "name": "兰州大学"
        },
        "NCUT": {
            "id": "f8186e9a5f929fd47a926e5cc612a13b",
            "name": "北方工业大学"
        },
        "NEU": {
            "id": "07128df800d9962ac71d22eacb46dfbc",
            "name": "东北大学"
        },
        "NJU": {
            "id": "aa3b9b8bee2cf925cfd4e977c6778dd8",
            "name": "南京大学"
        },
        "NKU": {
            "id": "82a865d3d26e9ed477e700e4684e44e0",
            "name": "南开大学"
        },
        "NWPU": {
            "id": "3ba4c7652e99aeca853f171f7906e139",
            "name": "西北工业大学"
        },
        "Orienteering": {
            "id": "0c6560aa6e8e9caaa41db999f0251937",
            "name": "定向越野"
        },
        "RUC": {
            "id": "0dc9d81d790e4e13a4b2ff7fd31d56e3",
            "name": "中国人民大学"
        },
        "SA.THU": {
            "id": "750ba8ded8e80048ab8db61c98af4e3a",
            "name": "清华建筑学院"
        },
        "SCU": {
            "id": "060351678e8392352d4b794e8dd29780",
            "name": "四川大学"
        },
        "SDU": {
            "id": "d748c292b61339bebe44e9770aff4cd3",
            "name": "山东大学"
        },
        "SJTU": {
            "id": "9c6d24283f131d95496ba15779c11275",
            "name": "上海交通大学"
        },
        "SL.THU": {
            "id": "d6c49bfbee1cec266e5ab34cedd48193",
            "name": "清华法学院"
        },
        "SMSE.THU": {
            "id": "2fa87f7b3511cf3256292e9eb3a06f1e",
            "name": "清华大学材料学院"
        },
        "SOE.THU": {
            "id": "4e17cb0bd09f5c959f26cd7fd61bc787",
            "name": "清华大学环境学院"
        },
        "SS.THU": {
            "id": "ffc7bc4b21199fa6e2169876dfdce175",
            "name": "清华大学软件学院"
        },
        "THAZEN": {
            "id": "e7e3bf43685d6f2d8fb5c09570f16515",
            "name": "禅文化研究社"
        },
        "THHighschool": {
            "id": "b2ad62225c66953ca249a5f353c09d73",
            "name": "清华附中"
        },
        "THU": {
            "id": "4477a8dc499828e674edc843032abcf5",
            "name": "清华大学"
        },
        "UESTC": {
            "id": "4c1903b4711d2206bb34751c35a4c557",
            "name": "电子科技大学"
        },
        "UIBE": {
            "id": "7057fd50c8a2fdfc8a4499873f7f796f",
            "name": "对外经济贸易大学"
        },
        "USTC": {
            "id": "bf1087fd5395864c6e3a7d9d1d209712",
            "name": "中国科学技术大学"
        },
        "XDU": {
            "id": "8ccabb70161fae7972a55bf6fbbeeeb4",
            "name": "西安电子科技大学"
        },
        "XJTU": {
            "id": "3614b6e7612005b438c7167a29729576",
            "name": "西安交通大学"
        },
        "ZJU": {
            "id": "df193bb2db87062a3be2f8cd2f367910",
            "name": "浙江大学"
        },
        "Advice": {
            "id": "e58663d368115596fe43a30e3ff1c43c",
            "name": "水木发展"
        },
        "Announce": {
            "id": "d22a2babe021d4f45a5356126b3bee4a",
            "name": "站务公告栏"
        },
        "BBSData": {
            "id": "6d4c23706030a9abe78605447eecda3e",
            "name": "社区系统数据"
        },
        "BBSDesign": {
            "id": "0b71c10c40e9dbca13ac606c58e1d121",
            "name": "社区系统美化"
        },
        "BBSHelp": {
            "id": "badb9267f3b15a79068ede1c338b76b3",
            "name": "BBS使用帮助"
        },
        "BBSLists": {
            "id": "0e14804735c4dc444116ff23ef63412c",
            "name": "BBS各类历史统计记录"
        },
        "BBSMan_Dev": {
            "id": "59bf065378a7fc3e3fd7f97d140039f7",
            "name": "BBS安装管理"
        },
        "BBSNewbie": {
            "id": "d2f70a8101ae880cbc5d18a1be39ffeb",
            "name": "新手上路"
        },
        "BBSView": {
            "id": "babb427ab0b0f411f7ce6bb9552831b4",
            "name": "BBS发展研究"
        },
        "BD": {
            "id": "335871717857aa964c39a4395a9768ab",
            "name": "商务合作部"
        },
        "Bet": {
            "id": "f2cdf6c5ef92e129b19bc3bf58f29b63",
            "name": "积分博彩"
        },
        "Blessing": {
            "id": "378de60d9c650d7108f5ccb574654b20",
            "name": "祝福"
        },
        "BM_Apply": {
            "id": "ec0ea1b6fd870afbf2102585b4467cbf",
            "name": "版主申请"
        },
        "BMManager": {
            "id": "b55366f84f223d35b7a6f38e1c696d53",
            "name": "版主管理"
        },
        "BMWork": {
            "id": "bb4d46ac8f9425b90b4bb3feff509df7",
            "name": "版主相关工作目录"
        },
        "Board_Apply": {
            "id": "8f1620ac60765b2f8de8d4f0e59fab0d",
            "name": "版面申请"
        },
        "BoardManager": {
            "id": "34fb042e9981879f25484ed3f9f5a4af",
            "name": "版面管理"
        },
        "BoardService": {
            "id": "1a38d168f0582ede6c178f5e6480bc24",
            "name": "版面服务"
        },
        "BoardWork": {
            "id": "b74727f16a3db2ff4fbb6298d66d47f6",
            "name": "版面相关工作目录"
        },
        "CleanSMTH": {
            "id": "bf6b5562f195573f4bef56c937f00f35",
            "name": "净化水木环境"
        },
        "cnAdmin": {
            "id": "48b65b412471e4b500d93393f04aadf9",
            "name": "cn.bbs.*管理与发展"
        },
        "Complain": {
            "id": "c4eefba7582e1c5a26bfbe0dd31819d2",
            "name": "投诉与举报"
        },
        "Court": {
            "id": "1314be0b9157cb743d3ee15db22cd22e",
            "name": "投诉"
        },
        "DevNewSMTH": {
            "id": "47f4510009c31a33f7b7263787e8fbf4",
            "name": "系统维护"
        },
        "Events": {
            "id": "ddda0e36b446ad8bde9ee07d18944be7",
            "name": "本站活动推荐"
        },
        "FameHall": {
            "id": "dfafa035e7889f4a08e3709a6265b69e",
            "name": "名人堂"
        },
        "Focus": {
            "id": "8ecdf2612b60f1a20afef45648431970",
            "name": "围观·打酱油"
        },
        "MaiFang": {
            "id": "42db07d05ec95e89642a0f1d53be053c",
            "name": "中介售房"
        },
        "Mall": {
            "id": "a84b594f94159e4aebefd7bf8d0853ee",
            "name": "水木积分商城"
        },
        "NewExpress": {
            "id": "c8d614e56acb8a192ec4af8b375a5eea",
            "name": "水木特快"
        },
        "NewSMTH": {
            "id": "12480c0cf3eb8d9647171a89451b6b6d",
            "name": "站史记录"
        },
        "notepad": {
            "id": "a85ede7ec68325e4a64fbd3cbe52379a",
            "name": "每日留言板备份"
        },
        "Penalty": {
            "id": "a0069345a79498c7b5d24ab6f33eac86",
            "name": "处罚公告栏"
        },
        "Progress": {
            "id": "a44a7967c959a3ff634e253c39bef261",
            "name": "社区新科技"
        },
        "Recommend": {
            "id": "e87d1bf8029de055fff248b9f5f6d796",
            "name": "站内原创推荐"
        },
        "Room": {
            "id": "f7fe4b6f536e43874c178abdb74f4ad5",
            "name": "会议室目录"
        },
        "RoomA": {
            "id": "dfaea7f0c00da8a94ddb18aade0f8f1c",
            "name": "常务会议室"
        },
        "RoomB": {
            "id": "465c65bf86e93f1bd03761996edf1caf",
            "name": "版务会议室"
        },
        "RoomC": {
            "id": "b7b8030c045c2ab10232abf6917d7166",
            "name": "普通会议室"
        },
        "RoomManager": {
            "id": "1e134db2cffb6b5d22186a3df0b72c1c",
            "name": "会议室管理"
        },
        "Score": {
            "id": "a8fd6f309a2b8d3105c87ebbdac6d5f7",
            "name": "积分"
        },
        "ScoreService": {
            "id": "b165fcf0a48543c587682e4929b0c41b",
            "name": "积分服务"
        },
        "Selene": {
            "id": "a8e8583109e1c5e466dd839f76587ea1",
            "name": "Like收录记录"
        },
        "ShiDa": {
            "id": "dcadefb586e7c3504123194e94ab3f1b",
            "name": "每日十大话题"
        },
        "SMTHApp_Dev": {
            "id": "56cf3c391e0d79e7cbd303e5971c1f7e",
            "name": "水木客户端开发"
        },
        "sysop": {
            "id": "6e708a8feccd3d22b343c78102accde2",
            "name": "本站系统讨论区"
        },
        "TeKuai": {
            "id": "3497e48bb537373d0f738b41fe53a41b",
            "name": "特快"
        },
        "Test": {
            "id": "c82c03ff780d34e0a6404a05361cb69d",
            "name": "测试专用版面"
        },
        "TOP500": {
            "id": "05f8c2f149240688199654e2f6a9de41",
            "name": "积分统计五百强"
        },
        "Usenet": {
            "id": "e781047ca0310b30783dd5b0ae82aa0d",
            "name": "转信"
        },
        "vote": {
            "id": "0a167780785a4a64e679556d206e2b5b",
            "name": "各板投票情况汇总"
        },
        "Weather": {
            "id": "1ba3f2f689c5284c141dabd308f7e199",
            "name": "天气预报"
        },
        "ZuFang": {
            "id": "f96a07e62ef191a80bae16e904350067",
            "name": "中介租房"
        },
        "Aero": {
            "id": "7737fc35eaa96e2e3653a4344e67773a",
            "name": "航空航天"
        },
        "AI": {
            "id": "a15346defc7c1a3f068c0642ef8bc8d6",
            "name": "人工智能"
        },
        "Astronomy": {
            "id": "f3d0498effefc7705221dc65d0161744",
            "name": "天文"
        },
        "Bioinformatics": {
            "id": "e78ba27fed3317a6881d6aa09da3fba7",
            "name": "生物信息学"
        },
        "Chemistry": {
            "id": "f10642d6c09f198d455e0502bd9d3f88",
            "name": "化学科学"
        },
        "ChildEducation": {
            "id": "6a1c244119558802ad9e1da41a348c4f",
            "name": "儿童教育"
        },
        "Circuit": {
            "id": "61b8c500492bd297bc0173878d1edef4",
            "name": "电路设计与调试"
        },
        "CommunTech": {
            "id": "946d25950f087c2a1d109ec0ba4720c1",
            "name": "通信技术"
        },
        "DataScience": {
            "id": "cefaead01541718a4041acce94fe3c61",
            "name": "统计·数据科学"
        },
        "Embedded": {
            "id": "0d1616d83f5af069aa960fb8d2a1bcea",
            "name": "嵌入式系统"
        },
        "FE": {
            "id": "b77db27322dc99f77c2a33543d7b598f",
            "name": "金融工程与技术"
        },
        "FEA": {
            "id": "134a66a6294ca6d4b69cb5c1c5d5eafb",
            "name": "有限元天地"
        },
        "FPGATech": {
            "id": "e41e32f770a7c71b3228c271653de334",
            "name": "可编程器件技术"
        },
        "Geography": {
            "id": "be5fa36ddd2ba9782b27d1306bdf3f11",
            "name": "地理"
        },
        "Industry": {
            "id": "879852f45c3af3da30fc18e6b6de8a5c",
            "name": "工业"
        },
        "LifeSci_Paper": {
            "id": "5f07709cb7f61b93f5cdfca14dababd8",
            "name": "生命科学文献求助与检索"
        },
        "LifeScience": {
            "id": "803ba963151f0b3e76fd07bcc8b1ac58",
            "name": "生命科学"
        },
        "Materials": {
            "id": "4c4b28fcc5adbcfe87115750a9d00756",
            "name": "材料科学"
        },
        "Mathematics": {
            "id": "03523174e48028c39bdb6b267a2b72a7",
            "name": "数学科学"
        },
        "MathTools": {
            "id": "57dfab95f54a71da11439289b6745056",
            "name": "数学工具"
        },
        "Mechanics": {
            "id": "fe9354a653ba0c946bf94ddd4e8d9e51",
            "name": "力学"
        },
        "Medicine": {
            "id": "111ac0a82bd4a2393bb2e8983de409e3",
            "name": "医药卫生"
        },
        "MedImaging": {
            "id": "b802d831c0c81e801f7d0af3ff51cae5",
            "name": "医学影像"
        },
        "Mentality": {
            "id": "f66c46b039eedfa8550e7c3693a41e7d",
            "name": "心理"
        },
        "METech": {
            "id": "14f8c89d43dcf566fa9b981325d22fa1",
            "name": "微电子技术"
        },
        "Military": {
            "id": "b53708fdd7891c69a90e4736e8131967",
            "name": "军事"
        },
        "MilitaryJoke": {
            "id": "f7c66f39831e065a83e57318ecb6a6c5",
            "name": "军苑娱乐报"
        },
        "MilitaryMovie": {
            "id": "39541425defe681ad55dca29cd4c57e7",
            "name": "军事影视"
        },
        "MilitaryPic": {
            "id": "a7b183f998beffad8bfc163615fcea63",
            "name": "军事贴图"
        },
        "MilitaryTech": {
            "id": "0203faddf7bc4470abcc86ce27f4b6ed",
            "name": "军事科学与技术"
        },
        "MilitaryView": {
            "id": "1bc1abbfea88887549f1d6de94aa8b96",
            "name": "军事瞭望"
        },
        "NLP": {
            "id": "43e2c55a2ff28f478151fb90998e97cc",
            "name": "自然语言处理"
        },
        "Nuclear": {
            "id": "cabafbba16a05af60c863b0b2c0ec65d",
            "name": "核科学与技术"
        },
        "NumComp": {
            "id": "a22f7dbdf93027fbd753af6d86f93632",
            "name": "数值计算"
        },
        "OETech": {
            "id": "f215dcd2525031b46764642a793d2963",
            "name": "光电科学技术"
        },
        "Paper": {
            "id": "268a5fb9534da7c1f56e07ce5f6e205d",
            "name": "论文"
        },
        "PowerTech": {
            "id": "b5e4eea0881cac6dfbde092b5e5a88fd",
            "name": "电力技术"
        },
        "PreUnivEdu": {
            "id": "13e9bc4f48a468c7fd446109b1649fb3",
            "name": "中小学数理化"
        },
        "Science": {
            "id": "bc7ffdf8b7f11daa1105005d3ff501e2",
            "name": "科学"
        },
        "TheoPhys": {
            "id": "8c0dc6ddbfa96f9dc3df0498caec9d0c",
            "name": "理论物理"
        },
        "V_WAR": {
            "id": "6c6d1c358421c09c73b08448806ef948",
            "name": "虚拟战争与模型"
        },
        "WildLife": {
            "id": "62ce338c44c1ace4e8994f44829e0985",
            "name": "野生动物"
        },
        "Altaic": {
            "id": "6353d0398f1c127ea66ea1abfc311ec5",
            "name": "阿尔泰语系文化"
        },
        "Art": {
            "id": "e7618d489f0a71f95cf6fcd4dfba580c",
            "name": "艺术"
        },
        "ASCIIart": {
            "id": "9855ef35892bdc30af134d4b7818a829",
            "name": "ASCII艺术"
        },
        "Bible": {
            "id": "9290616bb517c41b03b137ff73bda882",
            "name": "圣经"
        },
        "Budaixi": {
            "id": "ec82c6942db7b46d121f7aed651e8c9e",
            "name": "布袋戏及木偶艺术"
        },
        "Buddha": {
            "id": "dbc8c2c58b7df02c2e77a0b1ef79103f",
            "name": "居士林"
        },
        "Buddhist": {
            "id": "b66e1ac2715c3ff62c3b26d19e900738",
            "name": "佛理研讨"
        },
        "ClassicPoem": {
            "id": "87dc838d88bf9c60bba3ed1c813bbd5c",
            "name": "古典诗词鉴赏"
        },
        "Couplet": {
            "id": "dd700f840313fbd8d07253e945d4d9bb",
            "name": "对联天地"
        },
        "Detective": {
            "id": "749fb1439e27a2b70ff2e38e4b302ea2",
            "name": "侦探推理"
        },
        "Digest": {
            "id": "961fbd0b8cccffc4b50d52c7a156a831",
            "name": "学术文摘"
        },
        "Drama": {
            "id": "b3cf25b2fdc3caa555bd7f92b20aa20a",
            "name": "戏剧"
        },
        "Dream": {
            "id": "33e72fa7cf10c9ec48e009b051fd453e",
            "name": "释梦"
        },
        "EASTandWEST": {
            "id": "bad2e78b03a75e7a2bdda9545e64206c",
            "name": "对话东西方"
        },
        "Emprise": {
            "id": "1dcb35705dc4af41bee07bc6cd217904",
            "name": "武侠世家"
        },
        "EnglishWorld": {
            "id": "c32b6f732128c560b438df393eb3b2b9",
            "name": "英语角"
        },
        "FairCity": {
            "id": "6350aec992dd397da3cebdd4a20b9c68",
            "name": "锦绣都·言情"
        },
        "Fantasy": {
            "id": "2b3215c5ec29438a3c1fdf34b4c9b157",
            "name": "奇幻"
        },
        "GuoJiXue": {
            "id": "650d14850c94e54feec7366ff85a7bad",
            "name": "国计学"
        },
        "GuoXue": {
            "id": "3a608bba99b8f60f2a96881547ea12c3",
            "name": "国学"
        },
        "History": {
            "id": "a00736dd6ef2d77b423d4029c2ddd791",
            "name": "历史"
        },
        "HistoryClub": {
            "id": "0aecb4226a59d3ce6b2415bcc9e0d793",
            "name": "历史俱乐部"
        },
        "Horoscope": {
            "id": "c5f3f366b93ffe3aef114ed4145b3c01",
            "name": "占星"
        },
        "HuaXiaYiGuan": {
            "id": "19e6ff63f66ade2234bac14a99cec906",
            "name": "华夏衣冠"
        },
        "IP": {
            "id": "0e179b70955809e1aa9fef87c59bf568",
            "name": "知识产权"
        },
        "JapaneseCulture": {
            "id": "f262af9f16bca1d9fc1b32a4a948fb44",
            "name": "东瀛文化"
        },
        "LangHeaven": {
            "id": "0f671ebc2de39c509a6aacbf71c110eb",
            "name": "小语种天堂"
        },
        "Law": {
            "id": "d9f7a0bace38dc44eb0ce0274ca7e3ee",
            "name": "法学与法律"
        },
        "Lightnovel": {
            "id": "61ec3c134be94a7bd531cd2f3055fd27",
            "name": "轻小说"
        },
        "Linguistics": {
            "id": "b4792d870d3f12376e8e7fb197adb0c1",
            "name": "语言与语言学"
        },
        "Literature": {
            "id": "4d98b3fee6238dcce34133ecbdb2317f",
            "name": "文学艺术"
        },
        "Marvel": {
            "id": "2e2aedea872ba1bccddd041d8cf77ec3",
            "name": "聊斋鬼话"
        },
        "Metaphysics": {
            "id": "908f4b6bfe40fe3f9eee0a0f3bd1f982",
            "name": "五术玄学"
        },
        "Modern_CHN": {
            "id": "d5c6f42781731a6694fbe18631a591dc",
            "name": "中国近现代史"
        },
        "MythLegend": {
            "id": "0d9db6cf114aca5919d10b44226d366f",
            "name": "神话传说"
        },
        "NetNovel": {
            "id": "db0bbb22ae11a11c352110e2cf31ce41",
            "name": "网络小说"
        },
        "Nostalgia": {
            "id": "440039e03a7d3e75e3b0671c3be4d445",
            "name": "怀旧文化"
        },
        "OpenIching": {
            "id": "9116cfec495dddaf1d9693002aa270ba",
            "name": "开放易学"
        },
        "People": {
            "id": "50a81661b1440817e989d064ab1de174",
            "name": "人物"
        },
        "Poetry": {
            "id": "65b13af98a40c10bf7f1c219a968662c",
            "name": "诗歌"
        },
        "Railway": {
            "id": "fb39be5b6337b58d3826e4ac04c365b1",
            "name": "铁路"
        },
        "Reader": {
            "id": "b844b7f3cfb9e8e89034f0503ba81539",
            "name": "读书心得"
        },
        "Riddle": {
            "id": "d7e9e49f407983313bacc73eb8ffbde7",
            "name": "猜灯谜"
        },
        "Russia_Slavic": {
            "id": "c3622fe36e643caccdd506288a5622a2",
            "name": "俄罗斯语言与文化"
        },
        "Sanguo": {
            "id": "43b7202501cc31df301c19cea893c493",
            "name": "煮酒论英雄"
        },
        "SF": {
            "id": "0cb77e71d2b6c8eecf346ae8cce5f286",
            "name": "科学幻想"
        },
        "Southern_States": {
            "id": "34159addda2843eb909718a92816dc77",
            "name": "发展中国家研究"
        },
        "StoneStory": {
            "id": "51f9237201ba21adcec473e5de58b778",
            "name": "红楼梦"
        },
        "TaleDream": {
            "id": "715c1e533a178c5bdbfafd90c908da29",
            "name": "童话与梦"
        },
        "TCM": {
            "id": "d27bc1da2b0f9df5fe2f9fa55e53c4b9",
            "name": "中医"
        },
        "TeaArt": {
            "id": "7f159723fc9ef0cad5278baf756d1b91",
            "name": "茶艺"
        },
        "Wisdom": {
            "id": "c8314e52ffe74c3ed2f2cc9990e84188",
            "name": "儒释道"
        },
        "XiquQuyi": {
            "id": "86f98793181d9ecec721ab8487b84933",
            "name": "戏曲曲艺"
        },
        "XiYou": {
            "id": "7e9babe759b3b46cee0a74df8ee4dd08",
            "name": "西游记"
        },
        "Algorithm": {
            "id": "1ae95ffbba5fe37f06de6cc6a0ed0c8b",
            "name": "算法"
        },
        "Android": {
            "id": "b35d1bf16544c5e90bd9b31712097b3c",
            "name": "安卓系统设备"
        },
        "Apple": {
            "id": "c92119e1eb591653f232009cb8c01ebe",
            "name": "苹果"
        },
        "BlockChain": {
            "id": "543f1f795f540b0ef4785df2d6a9915c",
            "name": "区块链技术"
        },
        "Browsers": {
            "id": "d94b791b7b8027166c8bcb51e65a005a",
            "name": "浏览器"
        },
        "CPlusPlus": {
            "id": "bcd9411aa70876c09280bab6f33f7980",
            "name": "C++程序设计语言"
        },
        "CProgramming": {
            "id": "d90383196ae8ed0189a7ced43177efd7",
            "name": "C程序设计语言"
        },
        "CSArch": {
            "id": "53784206bc2e4cf3b12711697afed3c2",
            "name": "计算机体系结构"
        },
        "Database": {
            "id": "a5b655a1375d97d81c0700dc66f53647",
            "name": "数据库技术"
        },
        "DC": {
            "id": "0a004bdcee5b8f6357b6ab28f3013dcc",
            "name": "数码相机"
        },
        "Delphi": {
            "id": "b4975b039a19f03a8e0c5912a064ec35",
            "name": "Delphi与Pascal编程"
        },
        "DigiHome": {
            "id": "01bcb7fb0df0e7771ee8f25675082361",
            "name": "数字家庭"
        },
        "DigiMusic": {
            "id": "e4ceae9f6664c56dd5088560cc1de41f",
            "name": "数字音乐设备与产品"
        },
        "DOS": {
            "id": "9ea9787d9914b1562e0267dfdec09351",
            "name": "顽强生存着的DOS"
        },
        "DotNET": {
            "id": "2947c6644d8a9c1bdafc6b756753a54f",
            "name": "Microsoft.NET技术"
        },
        "DSLR": {
            "id": "7bca90083971aa4247660814cd77903f",
            "name": "数码单反"
        },
        "Emacs": {
            "id": "887d688f977cb01e757a30330c39bb78",
            "name": "Emacs编辑器"
        },
        "FreeBSD": {
            "id": "8ebdd9f7177a3aa88ef78d914e954633",
            "name": "红色小魔鬼 FreeBSD"
        },
        "FuncProgram": {
            "id": "6c56877d82c00c4a2a73f06fbf6e3103",
            "name": "函数式编程语言"
        },
        "Golang": {
            "id": "41cfb2c0a5384e2a04568adb79c078b4",
            "name": "Go 编程语言"
        },
        "Graphics": {
            "id": "1c2ed1d4dcbdb4ec09d3a6d69b609957",
            "name": "计算机图形图像学"
        },
        "Hardware": {
            "id": "289e5f2ec6bc5a0ee2a01009899c4e6a",
            "name": "电脑硬件"
        },
        "Huawei": {
            "id": "2b18f1e27249e027dfd7985774b8a35c",
            "name": "华为"
        },
        "Java": {
            "id": "2446f4dbe195a4503248184c39035af4",
            "name": "Java技术"
        },
        "KDE_Qt": {
            "id": "0f9aa58eafac793fbc4d797ab1b4da41",
            "name": "KDE与Qt编程技术"
        },
        "KernelTech": {
            "id": "7dfa82b3ea200967fe6991b11c4a6dd5",
            "name": "Linux内核技术"
        },
        "LinuxApp": {
            "id": "374ed4a2cbc5844853d8e682d2ee7fd8",
            "name": "Linux系统与应用"
        },
        "LinuxDev": {
            "id": "f04e21858850e9a5f0150d57ec7073d1",
            "name": "Linux 开发与高级讨论"
        },
        "Meizu": {
            "id": "5fb85aba24819b1ed9f90396b6b85ef3",
            "name": "魅族"
        },
        "Mobile": {
            "id": "4fdf6a2952c756a4ce5cf98e4b281018",
            "name": "手机·移动通信"
        },
        "MobileDev": {
            "id": "82a8cf081f5aa311d3d6d032bfa3ba74",
            "name": "手机开发"
        },
        "Networking": {
            "id": "db3f523f553421dc30336601117801f4",
            "name": "网络技术"
        },
        "NewSoftware": {
            "id": "033943e8359343e34e1be532624fbaa1",
            "name": "新软件介绍"
        },
        "Notebook": {
            "id": "702312d44fad610e0e72f1530c848079",
            "name": "笔记本电脑"
        },
        "OfficeSoft": {
            "id": "26239a8305d44217def92c6739cfd884",
            "name": "办公软件应用"
        },
        "Perl": {
            "id": "d1020346ef1d042407ecd1edf0e26388",
            "name": "Perl的世界"
        },
        "PHP": {
            "id": "3988627421b59bdef347a6f6c69a4a8c",
            "name": "PHP程序设计语言"
        },
        "PocketLife": {
            "id": "948e0cae3a28c4d3b3ceba97f1c68f7a",
            "name": "掌上智能"
        },
        "Programming": {
            "id": "28fd2294079d5eea79f276974bf21221",
            "name": "编程技术"
        },
        "ProgramTrading": {
            "id": "0597b256b8315fe7d2fc7f099df58abf",
            "name": "程序化交易"
        },
        "Python": {
            "id": "ade26876becef97b23c0b8f10a5e52f0",
            "name": "Python的自由天空"
        },
        "Samsung": {
            "id": "6626b9d40b594d84f8b4badfa763b8be",
            "name": "三星电子"
        },
        "Smartisan": {
            "id": "35f3a6635180d6dd2b9afea7c3e98e29",
            "name": "锤子科技"
        },
        "SmartLife": {
            "id": "3b82b6cfb7898c805a9e26521c8a192f",
            "name": "智能生活"
        },
        "SoftEng": {
            "id": "fa52aacb1ae7177a37ab6202011c0dba",
            "name": "软件工程"
        },
        "Swift": {
            "id": "ca488e81f2fe1da688d1019e98249f0b",
            "name": "Swift程序设计语言"
        },
        "TeX": {
            "id": "d9166b513efa06087e7df1260fc8e611",
            "name": "TeX和LaTeX"
        },
        "TotalCommander": {
            "id": "66acb38b0b9804ecebf2753098141d41",
            "name": "超强万能管理器"
        },
        "VIM": {
            "id": "ad2753111e7bcade4d12e185d860bb0f",
            "name": "VI编辑器"
        },
        "VisualBasic": {
            "id": "2d931777a3e866f2af9d6448f019b6f0",
            "name": "Visual Basic编程"
        },
        "WebDev": {
            "id": "5dfa20537c4da7fb06b664e22a884c84",
            "name": "Web开发"
        },
        "WindowsTech": {
            "id": "2f811054959ccb7b54fc1a339ff02a09",
            "name": "Windows 视窗操作系统"
        },
        "Xiaomi": {
            "id": "803b97b6494b8ad4e29ff94078c10488",
            "name": "小米"
        },
        "Astrology": {
            "id": "0999e6e6f34281b5ed6aa54ec2ee2f20",
            "name": "星座"
        },
        "Botany": {
            "id": "32f52452e8f0e34893ffe026d8e4bf5c",
            "name": "花木园艺"
        },
        "ChineseMusic": {
            "id": "3eb39da50aa035aad7547628c98d92c3",
            "name": "知音雅集"
        },
        "ChrisLee": {
            "id": "d2a02469b57c63c4780f1c824956a82d",
            "name": "李宇春·宇你同行"
        },
        "ClassicalMusic": {
            "id": "a3d441725acf397fd2edff0a84bfe719",
            "name": "古典音乐"
        },
        "Comic": {
            "id": "4127bceb260bc5d30c53a7f2b2924a40",
            "name": "动漫园地"
        },
        "ComicPlaza": {
            "id": "b474ca747efc970b9ff018daa3a3c5ce",
            "name": "动漫广场"
        },
        "Conan": {
            "id": "07faa207c9904a399ec538372172c30b",
            "name": "名侦探柯南"
        },
        "Dance": {
            "id": "bc01e1f6cc406329ad180de6613423b4",
            "name": "舞迷之家"
        },
        "DengLun": {
            "id": "be0a09c8f321f5170b85f1319c476063",
            "name": "邓伦"
        },
        "DragonBall": {
            "id": "6598c5d43c93fd85466dcfd808c95a21",
            "name": "七龙珠"
        },
        "Duorou": {
            "id": "deed8d9bf99c9bbd820fa6db3b395859",
            "name": "多肉植物"
        },
        "Fansub": {
            "id": "fee8e29471f9cd7d959abd1e4c31f940",
            "name": "字幕公社"
        },
        "Fish": {
            "id": "a3b3054cb870a179bc394caa2e30d8a4",
            "name": "水族"
        },
        "Fishing": {
            "id": "dcdab2f6b18bb4b163750c8406842e87",
            "name": "钓鱼"
        },
        "Gossip": {
            "id": "56a8afeeb5bb3fd7bb9106ea29fc593d",
            "name": "扒褂"
        },
        "HIFI": {
            "id": "c0323c7a3728600505d2cda465927813",
            "name": "高保真音响"
        },
        "Instrumental.Music": {
            "id": "b3057ebc79776f63e41b2cacdc917288",
            "name": "乐器·乐谱·乐理"
        },
        "IQDoor": {
            "id": "18b47cb49343ab70e15d9df29c60a18e",
            "name": "智力乐园"
        },
        "JackyCheung": {
            "id": "4abc8a4464a7ed14804853ca5e6b08b2",
            "name": "不老的传说·张学友"
        },
        "JaneZhang": {
            "id": "c95808995ec66013aceed3572b417c32",
            "name": "张靓颖·靓声靓影"
        },
        "Joke": {
            "id": "145e72e81246272cca0a610ad44edf6a",
            "name": "笑话连篇"
        },
        "JokeWorld": {
            "id": "5b95b5de018b3e2a5a93882d37419374",
            "name": "笑话天地"
        },
        "Jump": {
            "id": "c02490405f3156ec2bc7268cf0e1a96a",
            "name": "Jump系漫画"
        },
        "Karaoke": {
            "id": "be367d6468c357f362e7d900faf9da2e",
            "name": "K歌之王"
        },
        "KingKiller": {
            "id": "a1149f75ee5f815f6c34da9ddfc17c68",
            "name": "杀人游戏"
        },
        "LEGO": {
            "id": "efdf06e176ed27157ddb9d769d64fffc",
            "name": "乐高"
        },
        "LeslieCheung": {
            "id": "a2a24eabab25ddd21973d7656cebe4cb",
            "name": "张国荣·传奇"
        },
        "LordOfTheRings": {
            "id": "e91bd33a66813d34cf238f98b32bdb97",
            "name": "指环王·魔戒"
        },
        "MMJoke": {
            "id": "69fcce1b9408996bccc70871d4e92c48",
            "name": "幽默全方位"
        },
        "Movie": {
            "id": "0008ee1a42eeffb826d77a0ea48e34d0",
            "name": "电影"
        },
        "MovieClub": {
            "id": "ef73fc0cbf58cef105631b951fb0a0d6",
            "name": "Movie俱乐部"
        },
        "MyPhoto": {
            "id": "dc6cbaa1cd104bf020ec34360f3f7363",
            "name": "个人Show"
        },
        "NetResources": {
            "id": "a0e5f95aca7d9193c2a9d9e2eb664d95",
            "name": "网络资源"
        },
        "OldSongs": {
            "id": "abbd6a3fb164d45dc49565ade73bb586",
            "name": "老歌怀旧"
        },
        "OMTV": {
            "id": "2b6b73dcb09ce2cfe160b304b62d9187",
            "name": "欧美电视"
        },
        "PetsEden": {
            "id": "b3aa8b2e0f87da3764928267ce394ac2",
            "name": "宠物乐园"
        },
        "Photo": {
            "id": "f9ae20f0f01aa0fbfb426cdb07c93930",
            "name": "摄影"
        },
        "PhotoGear": {
            "id": "21e805939431ff120dc88e0faeb12f12",
            "name": "摄影世家"
        },
        "Picture": {
            "id": "e4de31c0d3855f053a6a06d50d80096c",
            "name": "贴图"
        },
        "Pictures": {
            "id": "f8e2d27a2924f14bb446f92206bb5cc6",
            "name": "图片"
        },
        "Radio": {
            "id": "a8c5fd535a5d672dec16a1fccf1581d8",
            "name": "广播与无线电"
        },
        "SaintSeiya": {
            "id": "5e9443bcbb36442ce4688c4ecbc5f22b",
            "name": "圣斗士"
        },
        "SanGuoSha": {
            "id": "8e1468cb01ab035dcabb45e9b407c26e",
            "name": "三国杀"
        },
        "Stars": {
            "id": "fc1348ae7a980cf49168a2651aedcf43",
            "name": "星光灿烂"
        },
        "TamiaLiu": {
            "id": "e7e330826b06ae1d916b967f6435b2e3",
            "name": "刘涛·涛涛不绝"
        },
        "TV": {
            "id": "b3d608a4c88114fb03ef0fd4c38e742c",
            "name": "电视"
        },
        "TVB": {
            "id": "893079d03b917c7054039d0d40cbaee1",
            "name": "TVB无线电视"
        },
        "TVShow": {
            "id": "85cd935e1d6aa5cf8a098afb21f3687e",
            "name": "电视秀"
        },
        "WallaceChung": {
            "id": "700d12e90a513e2007eb388dab6a27b8",
            "name": "钟汉良"
        },
        "WangKai": {
            "id": "08333475ede40e42735f086e2d6b5a78",
            "name": "王凯"
        },
        "XuWeiZhou": {
            "id": "7569edffabcb0120388786d98dc10ac8",
            "name": "许魏洲"
        },
        "ACMilan": {
            "id": "74d97e7a166e2bde2749749414dc4c4d",
            "name": "AC米兰"
        },
        "Arsenal": {
            "id": "18ce6d4b742cb9f882b1b8811e7b810c",
            "name": "阿森纳"
        },
        "Athletics": {
            "id": "472f8c4b90bede9e3d38b510830bfc29",
            "name": "田径运动"
        },
        "AutoTravel": {
            "id": "934236b31571c85c5e4e779a05b16018",
            "name": "自驾游"
        },
        "Badminton": {
            "id": "52c6695cab5f60e39b504e003f4d6fb6",
            "name": "羽毛球"
        },
        "Barcelona": {
            "id": "fc0becec7c58b5196df8dc3ceb52137a",
            "name": "巴塞罗那"
        },
        "Basketball": {
            "id": "c46f51b26f4927df801f130c474ef92d",
            "name": "篮球"
        },
        "BasketballForum": {
            "id": "791641d31d4be1355d76af6f1503e8df",
            "name": "篮球"
        },
        "BayernMunich": {
            "id": "0c054c7f80ac2e2e895f47e72f59f17e",
            "name": "拜仁慕尼黑"
        },
        "Beijing_GuoAn": {
            "id": "dad7084f73aa90248a4221f4fc626b56",
            "name": "国安·绿茵狂飙"
        },
        "Billiards": {
            "id": "9846dbdca95596f46633e24f31e179bb",
            "name": "台球城"
        },
        "BraveHeart": {
            "id": "f98a831568d37782711c8bde60b19569",
            "name": "探险"
        },
        "Bundesliga": {
            "id": "96265aefc4333347131897168ee02abe",
            "name": "德国足球"
        },
        "Chelsea": {
            "id": "0b9a52382882822ffa6e46c6eacdd668",
            "name": "切尔西"
        },
        "Civilization": {
            "id": "83948a965fad6fd9a544b5375a38348b",
            "name": "文明"
        },
        "CRonaldo": {
            "id": "62521eacf9bd82ab558f0b570698bcde",
            "name": "C·罗纳尔多"
        },
        "Cyclone": {
            "id": "4e9c68b6e44a04750e66d13c6670cccc",
            "name": "自行车运动"
        },
        "Diablo": {
            "id": "99a58d3e48024909754e9a14d9ceadea",
            "name": "暗黑破坏神"
        },
        "DotaAllstars": {
            "id": "533826916b6be9124fa8b761a6bb2992",
            "name": "Dota爱好者"
        },
        "Falcom": {
            "id": "ac8fc4db2baa9896da140ef135f8517e",
            "name": "Falcom之家"
        },
        "FansClub": {
            "id": "c0b059ee8401dec87d6cd83cdea8c529",
            "name": "球星球迷俱乐部"
        },
        "FitnessWorld": {
            "id": "cdceeb3c8c2d60f8dc692c8de1ad9cd2",
            "name": "健美舞台"
        },
        "Football": {
            "id": "bba0fad5e06e5010be95824b87b70103",
            "name": "绿茵世界"
        },
        "GalGame": {
            "id": "c51c7581ae98e4f74ee231a515013678",
            "name": "美少女游戏"
        },
        "Game": {
            "id": "cc5071782870d61c626c719db4953c0e",
            "name": "电脑游戏"
        },
        "GameIndustry": {
            "id": "1c309276f7fa50ccd155d679552f3b52",
            "name": "游戏圈"
        },
        "Guangzhou_FC": {
            "id": "5f68b9341418f5344aea8003a685a094",
            "name": "广州恒大·红色海洋"
        },
        "Heroes": {
            "id": "f9ac3e9bf7f55b8acc56218fa141e2b8",
            "name": "魔法门之英雄无敌"
        },
        "Inter": {
            "id": "18fa9e9732642bbedd6f237b26369db3",
            "name": "国际米兰"
        },
        "Juventus": {
            "id": "395c51ba79bf7d522724a16fac0a22db",
            "name": "青春尤文"
        },
        "KingJames": {
            "id": "0fef986a6b85561ecd183508bfc9d0f6",
            "name": "勒布朗·詹姆斯"
        },
        "KOEI": {
            "id": "7f12262a680dcfd33b371d9e03e32026",
            "name": "光荣游戏"
        },
        "Lakers": {
            "id": "793db7a54a903d331ba224fff5375779",
            "name": "洛杉矶湖人"
        },
        "Liverpool": {
            "id": "e5fcf4eccc26601affdb2619d96408f4",
            "name": "利物浦"
        },
        "LOL": {
            "id": "e2024906476bd598de4c9392320011fc",
            "name": "英雄联盟"
        },
        "LoseFat": {
            "id": "a8d3cba5519392e0693a7d664527e89d",
            "name": "健康减肥"
        },
        "ManCity": {
            "id": "5bae970ddd203f70ee9fa3fd9a795100",
            "name": "曼城FC"
        },
        "ManUtd": {
            "id": "da7edfd4b426397f957f38d389133967",
            "name": "红魔曼联"
        },
        "MobileGame": {
            "id": "cdd801c1f6f7f4fd1e6298ebcdcc5e4e",
            "name": "手机游戏"
        },
        "OnlineGame": {
            "id": "023059ad6a3bf32cc03c81d295b8412e",
            "name": "网络游戏"
        },
        "OW": {
            "id": "25449ab2ce5bb83243e7f8acd28ad586",
            "name": "守望先锋"
        },
        "PalSword": {
            "id": "a63c9c9725508a7a046da3b98b24a2e9",
            "name": "御剑江湖"
        },
        "Poker": {
            "id": "f128fd6d9f354944e51c4f2fcdacfe3b",
            "name": "德州扑克"
        },
        "RealMadrid": {
            "id": "6ec8c1cc2816b3df18f6046616c08ce3",
            "name": "皇家马德里"
        },
        "Rockets_Yao": {
            "id": "4915d05fe6992f867eedc1e1c035913d",
            "name": "休斯敦火箭·姚明"
        },
        "RunningLife": {
            "id": "3b92fc413854fa2f0451e304c488b1f7",
            "name": "跑道人生"
        },
        "Shandong_LNTS": {
            "id": "c917b6928b0758f97b2df5b8b9b9db44",
            "name": "鲁能泰山·橘红火焰"
        },
        "SimulateFlight": {
            "id": "56030e6eaff2d207ce0cbdebb7a7fe37",
            "name": "模拟飞行"
        },
        "SkiWorld": {
            "id": "9affeca25e0e9d70c907a5b6ec251d36",
            "name": "滑雪"
        },
        "Speed": {
            "id": "f6de1d658efb7bc11cacfb7131fa9b09",
            "name": "风驰电掣"
        },
        "Sports": {
            "id": "00db9f82de3c6a6c9081a8dc12301d27",
            "name": "体育综合"
        },
        "SportsGame": {
            "id": "44765e3c834f33c3ac6f86a99df16bc7",
            "name": "体育游戏"
        },
        "StarCraft": {
            "id": "a9f367222e912fa38d7ac2c47bdcdd83",
            "name": "星际争霸"
        },
        "Swimming": {
            "id": "9377e2ac137edb91f73caebd235d3daf",
            "name": "碧水情深"
        },
        "Tabletennis": {
            "id": "8727df6ab3adc7aab479705ae4a29643",
            "name": "乒乓球"
        },
        "Tennis": {
            "id": "d4e1014e95f89dff6f50f4c4594154b3",
            "name": "网球"
        },
        "Tianjin_TEDA": {
            "id": "2f5d0a96179a868bc5edc4f1cf4f7060",
            "name": "天津泰达·津门虎"
        },
        "Travel": {
            "id": "e655726d02eb374bc19326841cda24b2",
            "name": "旅游"
        },
        "Trekking": {
            "id": "a07729a733a076883ab5c99fcfb82768",
            "name": "山野穿越"
        },
        "TVGame": {
            "id": "18692950535a375184b2333aac385968",
            "name": "视频游戏"
        },
        "WarCraft": {
            "id": "25905b8c5cb1fedb855df8eacdb4fce2",
            "name": "魔兽争霸"
        },
        "Warriors": {
            "id": "823d21b507fea3110dc202056cb33223",
            "name": "金州勇士"
        },
        "WebGame": {
            "id": "99e4e6fd94b0f1cb8aef20cc3dd8f519",
            "name": "网页游戏"
        },
        "Weiqi": {
            "id": "54eee13f88786fa000c5325acfa266a2",
            "name": "纹枰论道"
        },
        "WorldSoccer": {
            "id": "d1eee779b73598a605fdd1aabd9b4006",
            "name": "国际足球"
        },
        "WoW": {
            "id": "0b495bf5740b5553222fc5aede2bf5a3",
            "name": "魔兽世界"
        },
        "XiangQi": {
            "id": "77892dc911f828b62638c8fb96e55b30",
            "name": "棋道"
        },
        "Yoga": {
            "id": "967040ffd70410dc12f38ed144563427",
            "name": "瑜伽花园"
        },
        "Age": {
            "id": "8f421bb12d259b816acd86fc4f383dcf",
            "name": "大龄男女"
        },
        "Automobile": {
            "id": "353fdfda1dfe7a714e592bab99c762cd",
            "name": "汽车"
        },
        "AutoService": {
            "id": "3092a8362193dc5b12850b5e30055b01",
            "name": "汽车后服"
        },
        "AutoWorld": {
            "id": "1c455a5dccf4242008d188f9676e3f4e",
            "name": "汽车世界"
        },
        "Baking": {
            "id": "c203221fea1751f5bc986a215827e2f9",
            "name": "烘焙坊"
        },
        "Beauty": {
            "id": "1ed8a9cd51690d214ba8f1f2805423ed",
            "name": "美丽的秘密"
        },
        "Beipiao": {
            "id": "6c363cf39e320ec344f04b5d7bbc8740",
            "name": "北漂生活"
        },
        "Book": {
            "id": "4a0c4f86e9ca558e82b42c9c55daff1f",
            "name": "书籍"
        },
        "Boy": {
            "id": "227f13a5870662fd75bece8c460a066f",
            "name": "老男孩"
        },
        "Bull": {
            "id": "fef0140cd3dbab34a6a6381b473cb66d",
            "name": "四十不惑"
        },
        "Children": {
            "id": "7fba65e45f678eb8c605d4107de04185",
            "name": "孩子"
        },
        "Coffee": {
            "id": "a880afb41b7cd514342a999a6fa139f3",
            "name": "咖啡时光"
        },
        "Coupons": {
            "id": "9499956756cb43f61f00072fe5aefad3",
            "name": "羊毛"
        },
        "CouponsExchange": {
            "id": "17ba5c2791073f7c7fe9c4ad6c1c837b",
            "name": "羊毛转让交换"
        },
        "CouponsLife": {
            "id": "d7d8264cde293439739e845c98a21675",
            "name": "辣妈羊毛党"
        },
        "Divorce": {
            "id": "c2ea7c56020eb65b0f4dfc2a867d97e7",
            "name": "离婚"
        },
        "Elite": {
            "id": "1a1a1b19b5461528c16349fbc116c3d9",
            "name": "三十而立"
        },
        "Family": {
            "id": "4ed7f0d8b621c8ccf9e11eca9991d6dc",
            "name": "家庭"
        },
        "FamilyLife": {
            "id": "e8d1470f8c33b86d8dae444090e81be4",
            "name": "家庭生活"
        },
        "FashionShow": {
            "id": "5b4966c4dc008d814fa8a88966ad727e",
            "name": "服饰搭配"
        },
        "Food": {
            "id": "5bc79d1e97dd3ee3901d3c33f413d045",
            "name": "我爱吃, 我想吃"
        },
        "Fulltimemother": {
            "id": "985e720cc5908880ddadd61e981ecb1c",
            "name": "全职辣妈"
        },
        "Funnytime": {
            "id": "b59632c2321363651e65aaf483680d77",
            "name": "杂谈趣闻"
        },
        "Futurelifestyle": {
            "id": "ef3cfdd17fdf6702df0291289a35246a",
            "name": "未来生活方式"
        },
        "Gentle_Fashion": {
            "id": "fa72de3ea8e7361bac9d0781697dd20a",
            "name": "绅士·时尚"
        },
        "Girl": {
            "id": "2b9fa74faf3cdf01bf8eb51007fa66c5",
            "name": "女孩子"
        },
        "GreenAuto": {
            "id": "447bffd6152246c2092283a0a4d49bd8",
            "name": "新能源汽车"
        },
        "HaiTao": {
            "id": "a6d125644793ef37da98243fc4a35bf8",
            "name": "海淘"
        },
        "HealthyLife": {
            "id": "b32f552c340f28360ac9d1b90a3626a0",
            "name": "健康生活"
        },
        "Heart": {
            "id": "97201208186b07346eff55e2cf289d4f",
            "name": "你今天快乐吗?"
        },
        "Jade_Jewelry": {
            "id": "b85be34bedba393c1ecdcb334b00b4da",
            "name": "珠光宝气"
        },
        "Love": {
            "id": "8902955aa4373e7e5b374c4033f7154d",
            "name": "谈情说爱"
        },
        "Memory": {
            "id": "c37256200c02d1ad2b1172622d36bee5",
            "name": "似水流年"
        },
        "Motorbike": {
            "id": "2ca135e99850ab204a93eebf27e27e57",
            "name": "摩托天地"
        },
        "MOTSS": {
            "id": "3abc899c4f050bf67e1ecd147a7da456",
            "name": "自由左岸"
        },
        "MyFamily": {
            "id": "4657ebcdd363ac7359f057f34340317d",
            "name": "我的家庭"
        },
        "Oversea": {
            "id": "b0e1fdbeb71d924ae65894026c102ee8",
            "name": "海外学人"
        },
        "PhD": {
            "id": "e66a42c8ba6105c01d966540738a10ca",
            "name": "博士生"
        },
        "Pregnancy": {
            "id": "60fc153e04faf4b4b3f82a8aa8029c29",
            "name": "怀孕"
        },
        "QingJiao": {
            "id": "a8aa2082a0b57cbda87a9138a6d592f7",
            "name": "青年教师"
        },
        "Shopping": {
            "id": "0025ac6984367203b65546e8fd26907a",
            "name": "购物"
        },
        "Shuibuzhao": {
            "id": "8fe994f6df1161273719359a3c03c5f5",
            "name": "失眠"
        },
        "Single": {
            "id": "a2858409c29e318dba60bd13dc8b842a",
            "name": "光协"
        },
        "TsinghuaCent": {
            "id": "3025fde702ee9231e9f84b0aceb68a0c",
            "name": "世纪清华"
        },
        "Universal": {
            "id": "dca16f6ff790c955773e0c99b873664d",
            "name": "特快万象"
        },
        "Wedding": {
            "id": "af5a9a6aadb1548f7b8d701b5d22402c",
            "name": "花嫁"
        },
        "Wine": {
            "id": "82dfe8c79f8b9b6895dfe41540d654cd",
            "name": "葡萄酒"
        },
        "WoodenArt": {
            "id": "77cf450cb6cbe9c676d1f6f9431ca4da",
            "name": "木艺"
        },
        "WorkLife": {
            "id": "45ff94c59bbccf733381aeebc5ad5e55",
            "name": "职业生涯"
        },
        "Yaohao": {
            "id": "5840d2ae34e9a5a1a5a587cffdd2c706",
            "name": "车牌摇号"
        },
        "AbroadStudy": {
            "id": "77349f71670788526c9288d2d062d97d",
            "name": "出国留学"
        },
        "ADAgent_HGDG": {
            "id": "b1f7657baf69bc1591fc10a6d91abea5",
            "name": "合购代购"
        },
        "ADAgent_TG": {
            "id": "e09121b763b9930e480c8a4a0e31d4c9",
            "name": "团购"
        },
        "ADAgents": {
            "id": "7351b5711db458cb353f1177c79a036b",
            "name": "商务与代理"
        },
        "AdvancedEdu": {
            "id": "709d194cfe44b906cc3c858415fc8036",
            "name": "飞跃重洋"
        },
        "BeautyExchange": {
            "id": "9fc4318db51e3251d223e6eb8ed8b6a1",
            "name": "交换美丽"
        },
        "Bond": {
            "id": "6562a90da0e1bcbe20ec893078a0215b",
            "name": "债券和互联网理财"
        },
        "Career": {
            "id": "60599c73a4fd5cde60911c248f04af23",
            "name": "求职招聘"
        },
        "Career_Campus": {
            "id": "6fe8f64403a3cc69b89aff7781a479e8",
            "name": "校园招聘信息"
        },
        "Career_Investment": {
            "id": "decbdba91e226d377af7a52ede3916af",
            "name": "求职投行"
        },
        "Career_PHD": {
            "id": "4b2fcb3bd3f425526585cb75bdb01e99",
            "name": "博士求职"
        },
        "Career_Plaza": {
            "id": "cb3e7ad6eed54d607726ce1d8bf14e8b",
            "name": "求职广场"
        },
        "Career_Servant": {
            "id": "f6502592bae54e07da7a4d3167bd65dd",
            "name": "公务员"
        },
        "Career_Upgrade": {
            "id": "6fc40705b2f2b7b591a7ee91bac72a85",
            "name": "社会招聘"
        },
        "ChildEducation.Info": {
            "id": "9a6badfcf52b2ef7352490144affd8c0",
            "name": "儿童教育信息"
        },
        "ChildrenInfo": {
            "id": "cc8aace70673b494199c88a8db8d50b5",
            "name": "二手母婴用品"
        },
        "CompMarket": {
            "id": "f0f196a9b7c30f2e24bc8547e33a931a",
            "name": "电脑市场"
        },
        "CreditCard": {
            "id": "7f33bc565bd8f42768e3b5a1e29a5bf9",
            "name": "信用卡·贷款"
        },
        "DecorationTrade": {
            "id": "7ae570a35f9ba8e7172871af8f11028b",
            "name": "装修资源"
        },
        "DrivingStudy": {
            "id": "cbd3db9f308a19847666f22ab2a29075",
            "name": "学车信息"
        },
        "Emigration": {
            "id": "743c0851a4fca0bc46c501fde072024e",
            "name": "移民"
        },
        "Entrepreneur": {
            "id": "6007d4f6ddd409d4ac140bfc369c25b1",
            "name": "创业者论坛"
        },
        "Estate": {
            "id": "4fcab28694a0be93d9297d8cede052d9",
            "name": "房产装修"
        },
        "ExecutiveSearch": {
            "id": "b5d020f60d7e61103089a593815d6785",
            "name": "猎头招聘"
        },
        "FangZhouZi": {
            "id": "10d65c8c854891fd31fa17f23b8e909a",
            "name": "方舟子"
        },
        "Fengshui": {
            "id": "8068c575a0a469958a3e671c5a555f8b",
            "name": "风水、相术和姓名学"
        },
        "Flyers": {
            "id": "b67c849c2142f8612e7f1d9b0113ea66",
            "name": "航空旅行"
        },
        "Fund": {
            "id": "8f3c852bfa1428c7b9451d4e2d3183cb",
            "name": "基金理财"
        },
        "FuturesForex": {
            "id": "e115227e160753f3b13ce5f98d1537e9",
            "name": "期货外汇"
        },
        "GOLD": {
            "id": "95c290541f8103fe5459c3bdb2acdff3",
            "name": "贵金属投资"
        },
        "HouseRent": {
            "id": "96e49d69096a5444d556bfd472d91c4f",
            "name": "房屋出租"
        },
        "IBM": {
            "id": "4cbdf97178632d1e24596d1cbf5daf48",
            "name": "IBM"
        },
        "Insurance": {
            "id": "1a1aee87e96b27cd82938e4eb82c4763",
            "name": "保险面面观"
        },
        "Intern": {
            "id": "4ae455859a94230d1aaf93812db8e759",
            "name": "工作实习"
        },
        "IPO": {
            "id": "ba703eab7231fb5e41f735c69f10f2ec",
            "name": "新股"
        },
        "ITExpress": {
            "id": "6f11d579b5a2b0e57ddebf4d45f055dc",
            "name": "IT业界特快"
        },
        "ITjob": {
            "id": "40002a5479623ac09693d9c6446ca0f0",
            "name": "IT类兼职"
        },
        "JiaJiao": {
            "id": "a7c5742a3c4960dbeabd2b3afd4baccb",
            "name": "兼职教育"
        },
        "Jifenluohu": {
            "id": "8cf40ecc56120f966034cb9bfabad460",
            "name": "积分落户"
        },
        "Job": {
            "id": "850ba080dc0b5315b9479aa64f829768",
            "name": "找工作"
        },
        "Lottery": {
            "id": "918e13dbed2782d83ca9caac98dcf36a",
            "name": "彩票"
        },
        "Metro": {
            "id": "e8712fa2b21672822b99593e9f7e9475",
            "name": "地铁"
        },
        "Microsoft": {
            "id": "708debe5e6687bfc5600f47741d2e288",
            "name": "微软"
        },
        "MyWallet": {
            "id": "1e503f888749e4223779b42929831505",
            "name": "金融产品及个人理财"
        },
        "Occupier": {
            "id": "5b634fdc9ecddf6042561c959176c077",
            "name": "业主之家"
        },
        "OurEstate": {
            "id": "a317717325f16d68583d66294fe60044",
            "name": "二手房交流"
        },
        "ParttimeJob": {
            "id": "3d1a6f8d2521f6066507f2bc3cca2bf5",
            "name": "兼职广场"
        },
        "ParttimeJobPost": {
            "id": "0a4ebc23b257432cca69a41e5bb1d8ec",
            "name": "兼职工作信息"
        },
        "PieFriends": {
            "id": "18d8880025bb0f68682b9e5a7d825a99",
            "name": "呼朋唤友"
        },
        "PieLove": {
            "id": "5168be704cd6bfd944102e59fc13f458",
            "name": "鹊桥·征男友女友"
        },
        "PolicyEstate": {
            "id": "06ac50ea4905b5ac3930d60889fb6e8e",
            "name": "政策房"
        },
        "RealEstate": {
            "id": "12af235486fde6684e4b9e83f5d2b779",
            "name": "房地产论坛"
        },
        "RealEstate_review": {
            "id": "fe08cf54d4c5e192280d34c26e590efd",
            "name": "房产观澜"
        },
        "Sales": {
            "id": "5c4d6962a611423c140c56782ac06d56",
            "name": "销售"
        },
        "SchoolEstate": {
            "id": "ae1e18cf3dd3250157f8837d45110db4",
            "name": "学区房"
        },
        "SecondBook": {
            "id": "362fa15cdcc8fb05361bee5bb4ffb48b",
            "name": "二手图书市场"
        },
        "SecondComputer": {
            "id": "e84670a68feb578166938a880e39d218",
            "name": "二手电脑市场"
        },
        "SecondDigi": {
            "id": "1e512d9b8f776824c2d1f8884c3aa91a",
            "name": "二手数码产品"
        },
        "SecondHand": {
            "id": "ddee59094260b0336fc6468429c98b74",
            "name": "二手货交易"
        },
        "SecondMarket": {
            "id": "3514abfc2ddb2a97e9e57f0eee02c432",
            "name": "二手市场主版"
        },
        "ShangHaiEstate": {
            "id": "1c59caf1fb4ee601704a82cc0390ffa6",
            "name": "上海房地产"
        },
        "ShowInfo": {
            "id": "bc2c62319640c80eb9bf6263112c3ae2",
            "name": "展演信息"
        },
        "SMIF": {
            "id": "778b7cfac8a824982d6dff756fd6a1d5",
            "name": "水木网际基金"
        },
        "Stock": {
            "id": "3bcda03dcf4ca0e36c3cc96eaa4cf6f8",
            "name": "股市"
        },
        "StockAnalysis": {
            "id": "93a3fec82435c5f8be16afda89c1863f",
            "name": "股票研究"
        },
        "Tongqin": {
            "id": "b004ad093500e3339827e5359b3ee1f0",
            "name": "共享单车·绿色出行"
        },
        "TrafficInfo": {
            "id": "fc58b1a72d7d962f918e3a889d31457c",
            "name": "交通信息"
        },
        "Travels": {
            "id": "03f0df9250262415dc81bf46e7e817e0",
            "name": "旅行"
        },
        "Tuhao": {
            "id": "9ea4163fae9dc32003b7743b5d14c995",
            "name": "土豪"
        },
        "Wealth": {
            "id": "eb8324a810531dc904815d120988e6de",
            "name": "投资理财"
        }
    }
};



function init() {
    // var sectionArray = [
    //     '7fba65e45f678eb8c605d4107de04185',
    //     '4fcab28694a0be93d9297d8cede052d9',
    //     '3497e48bb537373d0f738b41fe53a41b',
    //     '353fdfda1dfe7a714e592bab99c762cd',
    //     'c8d614e56acb8a192ec4af8b375a5eea',
    //     '5b634fdc9ecddf6042561c959176c077',
    //     '1c455a5dccf4242008d188f9676e3f4e',
    //     '12af235486fde6684e4b9e83f5d2b779',
    //     '4ed7f0d8b621c8ccf9e11eca9991d6dc',
    //     '4dda79c64b3ffb61f8048d745292ff5d',
    // ];
    // var boardDictionary = {};
    // var sectionDictionary = {};
    // for (var i = 0; i < sectionArray.length; i++) {

    //     var section_id = sectionArray[i];

    //     NetworkManager.getNewSections(sectionArray[i], (result) => {
    //         this.$ = cio.load(result);
    //         this.$ = cio.load(this.$('div[class=row]').html());

    //         var array = [];

    //         this.$('div[class=board-data-summary]').each(function (i, elem) {
    //             this.$ = cio.load(elem);
    //             this.$ = cio.load(this.$('div[class=board-data-summary-name]').html());

    //             array.push({
    //                 id: this.$('a').attr('href').split('/')[2],
    //                 name: this.$('span').text(),
    //                 title: this.$('a').first().text(),
    //             })

    //             boardDictionary[this.$('a').first().text()] = {
    //                 id: this.$('a').attr('href').split('/')[2],
    //                 name: this.$('span').text(),
    //             };
    //         });
    //         sectionDictionary[section_id] = array;

    //         // console.log('JSON.stringify(boardDictionary):' + JSON.stringify(boardDictionary));
    //         console.log('JSON.stringify(sectionDictionary):' + JSON.stringify(sectionDictionary));

    //     }, (error) => {

    //     }, (errorMessage) => {

    //     });
    //     // }, 5000 * i);
    // }
}

init();
