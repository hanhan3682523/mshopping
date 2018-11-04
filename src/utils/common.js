
/**
 * Created by 飘落的枫叶 on 2018/10/09.
 * 公共方法
 */
var CommonLibs = {
    /*
    判断是否为微信环境
    */
    isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/_SQ_/i) == '_sq_'){
            return true;
        } else {
            return false;
        }
    },
    /*
    获取微信数据
    */
    getSessionInfo(key) { 
        let _info = null;
        if (window.sessionStorage) { 
            var userJsonStr = window.sessionStorage.getItem(key);
            if(userJsonStr){
                _info = JSON.parse(userJsonStr);
            }
        }
        return _info;
    },
    /*
    设置微信数据
    */
    setSessionInfo(key,info) { 
        if (window.sessionStorage) { 
            if (typeof(info) == 'string') {
                window.sessionStorage.setItem(key, info);
            } else { 
                window.sessionStorage.setItem(key, JSON.stringify(info));
            }
        }
    }
};

export const Common = CommonLibs;

