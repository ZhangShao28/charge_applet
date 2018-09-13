/**
 * 小程序配置文件
 */
var qcloud = require('./vendor/wafer-client-sdk/index.js');
var checkNetWork = require("./utils/CheckNetWork.js");
// 此处主机域名修改成腾讯云解决方案分配的域名
// var host = 'tsc.ixmcd.com';                     //测试服务器zxc
var host = 'c.ixmcd.com';                           //正式服务器
var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `https://${host}/user/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `https://${host}/user/login`,

        // 测试的信道服务地址
        tunnelUrl: `https://${host}/user/login`,
        // hostUrl:'https://tsc.ixmcd.com/'            //测试服务器zxc
        hostUrl: 'https://c.ixmcd.com/'                //正式服务器
    },
    up_formid: function (form_id){
      // console.log(this.service.hostUrl,  JSON.stringify(form_id))
      qcloud.request({
        url: this.service.hostUrl + 'user/save_formid',
        data: {
          form_data: form_id
        },
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (response) {
          console.log(response);

        },
        fail: function (err) {
          console.log(err);
        }
      });
    }
};

module.exports = config;