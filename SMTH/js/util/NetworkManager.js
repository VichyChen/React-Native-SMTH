import {
    DeviceEventEmitter
} from 'react-native';

import NetworkUtil from './NetworkUtil';
import AsyncStorageManger from '../storage/AsyncStorageManger';
import RNFetchBlob from "react-native-fetch-blob";

const base_url = "http://open.newsmth.net/";

const client_id = "testapp";
const client_secret = "0055a40712ee09f74f70d193c5e8dbc3";
const client_signature = "4da4774bea90f3509293d112eb6a24cd";
const libversion = 256;
const libtype = "iOS";

export default class NetworkManager {

    static get(url, params, success, failure, netError) {
        NetworkUtil.get(url, params
        ).then(result => {
            success(result);
        }).catch(error => {
            console.log(error);
            if (error.message == 'Timeout' || error.message == 'Network request failed') {
                netError('网络连接出错');
            }
            else if (error.name == 'SyntaxError') {
                failure('水木数据解析错误');
            }
            else {
                failure(error.message);
            }
        });
    }

    static async post(url, params, needLogin, success, failure, netError) {
        NetworkUtil.post(url, params
        ).then(async result => {
            //需要登陆的接口
            if (needLogin == true) {
                //{"error":0,"error_description":""}
                if (result['error'] == 0) {
                    success(result);
                }
                //{"error":10010,"error_description":"无效的access_token"}
                else if (result['error'] == 10010) {
                    var username = await AsyncStorageManger.getUsername();
                    var password = await AsyncStorageManger.getPassword();
                    if (username.length > 0 && password.length > 0) {
                        NetworkManager.login(username, password, () => {
                            //登陆成功再调用一次刚才的方法（有问题，总是登陆不成功）
                            NetworkManager.post(url, params, needLogin, success, failure);
                        }, () => {
                            //还是登陆不成功（换密码之类的），则弹出登陆界面
                            DeviceEventEmitter.emit('LoginNotification', null);
                            failure('');
                        });
                    }
                    //本地没有保存账户密码
                    else {
                        DeviceEventEmitter.emit('LoginNotification', null);
                        failure('');
                    }
                }
                //其他情况？？？
                else {
                    if (result['error'] != null && result['error_description'] != null) {
                        failure(result['error_description']);
                    }
                    else {
                        failure('未知错误');
                    }
                }

            }
            //不需要登陆，登陆接口
            else {
                //用户名密码错误
                //{"error":10099,"error_description":"Invalid username and password combination"}
                if (result['error'] != null && result['error'] == 10099) {
                    failure('账号或密码错误');
                }
                //{"error":"invalid_user","error_description":null}                
                else if (result['error'] == 'invalid_user') {
                    failure('账号或密码错误');
                }
                //登陆成功
                /*
                success!
                {
                "access_token":"5bf31029f4e2c3ae4b67e75014d41cf308efa436",
                "expires_in":"86400",
                "token_type":"bearer",
                "scope":"",
                "refresh_token":"2a060ba2ca1be73fdce4c000b12c78b04a9b3072"
                }
                */
                else {
                    success(result);
                }
            }
        }).catch(error => {
            if (error.message == 'Timeout' || error.message == 'Network request failed') {
                netError('网络连接出错');
            }
            else if (error.name == 'SyntaxError') {
                failure('水木数据解析错误');
            }
            else {
                failure(error.message);
            }
        });
    }

    static login(username, password, success, failure, netError) {
        var dic = new Array();
        dic["client_id"] = client_id;
        dic["client_secret"] = client_secret;
        dic["grant_type"] = "password";
        dic["libtype"] = libtype;
        dic["libversion"] = libversion;
        dic["password"] = password;
        dic["username"] = username;

        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'password',
            libtype: libtype,
            libversion: libversion,
            password: password,
            username: username,
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'oauth2/password', params, false, result => {
            console.log('result["access_token"]=' + result["access_token"]);
            AsyncStorageManger.setAccessToken(result["access_token"]);
            AsyncStorageManger.setUsername(username);
            AsyncStorageManger.setPassword(password);
            success();
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_QueryUser(user_id, success, failure, netError) {
        var dic = new Array();
        dic["user_id"] = user_id;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            user_id: user_id,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'user/query.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //驻版
    static async net_LoadMember(user_id, from, size, success, failure, netError) {
        var dic = new Array();
        dic["user_id"] = user_id;
        dic["from"] = from;
        dic["size"] = size;
        dic["set_board"] = '1';
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            user_id: user_id,
            from: from,
            size: size,
            set_board: '1',
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'member/load_member_boards.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_JoinMember(board_id, success, failure, netError) {
        var dic = new Array();
        dic["board_id"] = board_id;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            board_id: board_id,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'member/join.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_QuitMember(board_id, success, failure, netError) {
        var dic = new Array();
        dic["board_id"] = board_id;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            board_id: board_id,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'member/quit.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_LoadSectionHot(section, success, failure, netError) {
        var dic = new Array();
        dic["section_id"] = section;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            section_id: section,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'board/load_hot.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    // 板块信息查询
    static async net_QueryBoard(query, success, failure, netError) {
        var dic = new Array();
        dic["query"] = query;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            query: query,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'board/query.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_GetThread(board_id, article_id, from, size, sort, success, failure, netError) {
        var dic = new Array();
        dic["board_id"] = board_id;
        dic["from"] = from;
        dic["size"] = size;
        dic["sort"] = sort;
        dic["thread_id"] = article_id;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            board_id: board_id,
            from: from,
            size: size,
            sort: sort,
            thread_id: article_id,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'article/show_thread.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_LoadBoards(group_id, success, failure, netError) {
        var dic = new Array();
        dic["group_id"] = group_id;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            group_id: group_id,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'board/load_boards.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_LoadSection(success, failure, netError) {
        var dic = new Array();
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'board/load_section.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_ReadSection(section_id, group_id, success, failure, netError) {
        var dic = new Array();
        dic["section_id"] = section_id;
        dic["group_id"] = group_id;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            section_id: section_id,
            group_id: group_id,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'board/read_section.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static getSection(section_id, success, failure, netError) {
        NetworkManager.get('http://m.newsmth.net/section/' + section_id, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_LoadThreadList(board_id, from, size, brcmode, success, failure, netError) {
        var dic = new Array();
        dic["board_id"] = board_id;
        dic["from"] = from;
        dic["size"] = size;
        dic["brcmode"] = brcmode;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            board_id: board_id,
            from: from,
            size: size,
            brcmode: brcmode,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'board/load_thread.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_PostArticle(board_id, title, content, success, failure, netError) {
        var dic = new Array();
        dic["board_id"] = board_id;
        dic["subject"] = title;
        dic["content"] = content;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            board_id: board_id,
            subject: title,
            content: content,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'article/post.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_ReplyArticle(board_id, reply_id, title, content, success, failure, netError) {
        var dic = new Array();
        dic["board_id"] = board_id;
        dic["reply_id"] = reply_id;
        dic["subject"] = title;
        dic["content"] = content;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            board_id: board_id,
            reply_id: reply_id,
            subject: title,
            content: content,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'article/reply.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_LoadFavorites(group_id, success, failure, netError) {
        var dic = new Array();
        dic["group_id"] = group_id;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            group_id: group_id,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'profile/load_favorites.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_AddFav(board_id, success, failure, netError) {
        var dic = new Array();
        dic["board_id"] = board_id;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            board_id: board_id,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'profile/add_favorite_board.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_DelFav(board_id, success, failure, netError) {
        var dic = new Array();
        dic["board_id"] = board_id;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            board_id: board_id,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'profile/delete_favorite_board.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    // 收件箱
    static async net_LoadMailList(from, size, success, failure, netError) {
        var dic = new Array();
        dic["from"] = from;
        dic["size"] = size;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            from: from,
            size: size,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'mail/load.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //收件数量
    static async net_GetMailCount(success, failure, netError) {
        var dic = new Array();
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'mail/count.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    // 收件详情
    static async net_GetMail(position, success, failure, netError) {
        var dic = new Array();
        dic["position"] = position;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            position: position,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'mail/get_content.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    // 发件箱
    static async net_LoadMailSentList(from, size, success, failure, netError) {
        var dic = new Array();
        dic["from"] = from;
        dic["size"] = size;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            from: from,
            size: size,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'mail/load_send.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //发件数量
    static async net_GetMailCountSent(success, failure, netError) {
        var dic = new Array();
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'mail/count_send.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    // 发件详情
    static async net_GetMailSent(position, success, failure, netError) {
        var dic = new Array();
        dic["position"] = position;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            position: position,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'mail/get_send_content.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    // 回复我的、@我的
    static async net_LoadRefer(mode, from, size, success, failure, netError) {
        var dic = new Array();
        dic["mode"] = mode;
        dic["from"] = from;
        dic["size"] = size;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            mode: mode,
            from: from,
            size: size,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'refer/load.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    // 引用数量
    static async net_GetReferCount(mode, success, failure, netError) {
        var dic = new Array();
        dic["mode"] = mode;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            mode: mode,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'refer/count.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    // 发站内信
    static async net_PostMail(receiver, title, content, success, failure, netError) {
        var dic = new Array();
        dic["recipient"] = receiver;
        dic["subject"] = title;
        dic["content"] = content;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            recipient: receiver,
            subject: title,
            content: content,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'mail/send.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static async net_SearchArticle(board_id, title, user, from, size, success, failure, netError) {
        var dic = new Array();
        // dic["board_id"] = board_id;
        dic["from"] = from;
        dic["size"] = size;
        // dic["t"] = title;
        dic["u"] = user;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            // board_id: board_id,
            from: from,
            size: size,
            // t: title,
            u: user,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        // NetworkManager.post(base_url + 'board/search_article_title.json', params, true, result => {
        NetworkManager.post(base_url + 'board/search_article_user.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //加好友
    static async net_AddUserFriend(userid, success, failure, netError) {
        var dic = new Array();
        dic["user_id"] = userid;
        dic["access_token"] = await AsyncStorageManger.getAccessToken();
        var signature = "";
        for (var key in dic) {
            signature += key + "=" + dic[key] + "&";
        }
        signature += client_signature;
        var md5 = require("crypto-js/md5");
        dic["signature"] = md5(signature);

        let params = {
            user_id: userid,
            access_token: dic["access_token"],
            signature: dic["signature"],
        }

        NetworkManager.post(base_url + 'profile/add_friend.json', params, true, result => {
            success(result);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static getUserThread(author, page, success, failure, netError) {
        NetworkManager.get('http://jinghuasoft.com/smth.jsp?board=&orderBy=date_created&asc=&d=&dm=&dc=&p=&pp=false&view=0&author=' + author + '&page=' + page, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static getUserImageThread(author, success, failure, netError) {
        NetworkManager.get('http://jinghuasoft.com/smth.jsp?board=&author=' + author + '&view=1&pp=true', null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    static net_getFace(user_id) {
        return 'https://images.newsmth.net/nForum/uploadFace/' + user_id.slice(0, 1).toUpperCase() + '/' + user_id + '.jpg';
    }

    static net_getAttachmentImage(board_id, article_id, pos) {
        return 'http://att.newsmth.net/nForum/att/' + board_id + '/' + article_id + '/' + pos;
    }


    //**************************************** https://exp.newsmth.net/ ****************************************/

    static getNew(url, params, success, failure, netError) {
        NetworkUtil.getNew(url, params
        ).then(result => {
            success(result);
        }).catch(error => {
            console.log(error);
            failure(error.message);
        });
    }

    static async postNew(url, params, success, failure, netError) {
        NetworkUtil.postNew(url, params
        ).then(async result => {
            success(result);
        }).catch(error => {
            failure(error.message);
        });
    }

    //全部、社区管理！@#¥%……&*（）
    static getNewHot(section_id, page, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/statistics/hot/' + ((section_id != null && section_id.length > 0) ? ('section/' + section_id) : 'global') + '/' + page, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //图览
    static getNewAlbum(page, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/album/global/' + page, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //版面列表
    static getNewSections(section_id, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/section/' + section_id, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //版面主题
    static getNewBoardTopics(board_id, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/board/topics/' + board_id, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //版面热点
    static getNewBoardHot(board_id, page, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/board/hot/' + board_id + '/' + page, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //版面体验
    static getNewBoardExperience(board_id, page, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/board/experience/' + board_id + '/' + page, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //帖子详情页
    static getNewTopic(type, topic_id, page, success, failure, netError) {
        var url;
        if (type == null) {
            url = 'https://exp.newsmth.net/topic/' + topic_id + (page == 1 ? '' : ('/' + page));
        }
        else {
            url = 'https://exp.newsmth.net/topic/article/' + topic_id + (page == 1 ? '' : ('/' + page));
        }
        NetworkManager.getNew(url, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    /*
    https://exp.newsmth.net/search?keyword=%E7%A5%9E%E5%B8%96&mode=Article&original=false&attachment=false 搜索帖子
    https://exp.newsmth.net/search?mode=board&keyword=%E6%88%BF%E5%9C%B0%E4%BA%A7 搜索版面
    https://exp.newsmth.net/search?mode=account&keyword=%E6%88%BF%E5%9C%B0%E4%BA%A7 搜索用户
    */
    static getNewSearch(keyword, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/topic/', null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //个人信息页+主题列表
    static getNewAccountArticles(account_id, page, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/account/articles/' + account_id + '/' + page, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //个人信息页 驻版
    static getNewAccountMembers(account_id, page, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/account/members/' + account_id + '/' + page, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //个人信息页 关注
    static getNewAccountFriends(account_id, page, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/account/friends/' + account_id + '/' + page, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //个人信息页 粉丝
    static getNewAccountFans(account_id, page, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/account/fans/' + account_id + '/' + page, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //获取登陆页面
    static getNewAuthorize(success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/authorize', null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //获取登陆验证码
    static getNewCaptcha(success, failure, netError) {
        RNFetchBlob.config({
            fileCache: false
        })
            .fetch("GET", "https://exp.newsmth.net/authorize/captcha")
            .then(resp => {
                return resp.readFile("base64");
            })
            .then(base64Data => {
                console.log('base64Data' + base64Data);
                success(base64Data);
            });
    }

    //登陆
    static postNewSignIn(username, password, captcha, success, failure, netError) {
        NetworkManager.postNew('https://exp.newsmth.net/authorize/sign-in', {
            username: username,
            password: password,
            captcha: captcha,
            url: ''
        }, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //获取回帖页面
    static getNewReply(articleId, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/compose/reply/' + articleId, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //回帖
    static postReplSave(articleId, body, success, failure, netError) {
        NetworkManager.postNew('https://exp.newsmth.net/compose/save', {
            articleId: articleId,
            body: body,
        }, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //获取发帖页面
    static getNewPost(boardId, success, failure, netError) {
        NetworkManager.getNew('https://exp.newsmth.net/compose/publish/' + boardId, null, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //发帖
    static postPostSave(boardId, subject, body, success, failure, netError) {
        NetworkManager.postNew('https://exp.newsmth.net/compose/save', {
            boardId: boardId,
            subject: subject,
            body: body,
        }, result => {
            success(result._bodyInit);
        }, error => {
            failure(error);
        }, errorMessage => {
            netError(errorMessage);
        });
    }

    //上传图片
}