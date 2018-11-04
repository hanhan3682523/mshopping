import axios from 'axios'
import qs from 'qs'
//全局默认配置
axios.defaults.timeout = 5000;

//POST传参序列化
axios.interceptors.request.use((config) => {
    config.data = JSON.stringify(config.data);
    config.headers = {
        'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8;'
    };
    return config;
},error =>{
    return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use(res => { 
    return res;
}, error => { 
    return Promise.reject(error.response.data);
});

//get请求
export function get(url, params = {}) { 
    return new Promise((resolve, reject) => { 
        axios.get(url, { params: params })
        .then(res => { 
            resolve(res.data);
        })
        .catch(err => { 
            reject(err);
        })
    })
}

//post请求
export function post(url, params = {}) { 
    return new Promise((resolve, reject) => { 
        // axios.post(url,qs.stringify(params)).then(res => { 
        //     resolve(res.data);
        // }).catch(err => { 
        //     reject(err);
        // })
        $.ajax({
            type: 'POST',
            url: url,
            data: params,
            success: function(res){
                resolve(res);
            }
          }).fail(function(err){
            reject(err);
          });
    })
}
