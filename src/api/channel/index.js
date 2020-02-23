//导入axios实例对象
import myRequest from '@/untils/request'

//获取用户频道列表
function getChannelRequest() {
    return myRequest({
        url: "/app/v1_0/user/channels",
             method: 'GET',
    })
    
}

//获取所有的用户数据
function getAllChannelRequest() {
    return myRequest({
        url: "/app/v1_0/channels",
             method: 'GET',
    })
    
}

//重置频道数据
function resetChannels({channels}) {
    return myRequest({
        url: "/app/v1_0/user/channels",
             method: 'PUT',
             data: {
                channels:channels
             }     
    })
}


export {getChannelRequest, getAllChannelRequest, resetChannels}






