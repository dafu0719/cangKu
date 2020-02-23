import axios from 'axios'

//创建一个axios对象
//这个创建出来的对象其实与axios基本一致
//创建出来的对象可以设置一些统一的设置
// baseURL
let myRequest = axios.create({
    baseURL: "http://ttapi.research.itcast.cn"
})

//创建一个专门用来刷新token的axios对象,没有拦截器的
let myTokenRequest = axios.create({
    baseURL: "http://ttapi.research.itcast.cn"
})

//axios添加请求拦截器
myRequest.interceptors.request.use((config) => {
    //在发送请求之前做些什么,config就是你这次请求的全部信息
    let user = JSON.parse(window.localStorage.getItem("userKey"))
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // console.log(config.headers.Authorization);
    return config;
}, function (error) {
    window.console.log('请求失败');
    return Promise.reject(error);
});

//axios添加响应拦截器
myRequest.interceptors.response.use((response) => {
    //对响应的内容进行过滤处理
    return response.data.data
}, async function (error) {
    window.console.log('响应失败');
    // window.console.log(error.response.status); //状态码401
    // window.console.log(error.config);      //所有发过去的请求数据
    //如果服务器响应的状态码为401
    if (error.response.status == 401) {
        let refreshToken = JSON.parse(window.localStorage.getItem("userKey")).refresh_token
        //向专门用来刷新token的axios向服务器发送请求,
        let res = await myTokenRequest({
            url: '/app/v1_0/authorizations',
            method: 'put',
            headers: {
            //授权
                Authorization: `Bearer ${refreshToken}`
            }
        })
        //得到token
        let token = res.data.data.token
        //将token存储到本地全局缓存.更新用户数据
        window.localStorage.setItem('userKey', JSON.stringify({
            token:token,
            refresh_token:refreshToken
        }))
        console.log('token刷新了');
        //用携带了拦截器的axios把所有请求数据再发一次过去给服务器
        return myRequest(error.config)
    }
    return Promise.reject(error);
});


export default myRequest