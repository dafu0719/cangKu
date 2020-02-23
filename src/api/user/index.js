//导入axios实例对象
import myRequest from '@/untils/request'

//这里的括号.单括号只可以写属性值. 大括号可以写属性名和属性值
function userRegister({mobile, code}) {
    return myRequest({
        url: '/app/v1_0/authorizations',
             method: 'post',
             data: {
               mobile:mobile,
               code:code
             }
    })
    
}
//关注用户
function focusUser(target) {
    return myRequest({
        url: '/app/v1_0/user/followings',
             method: 'post',
             data: {
              target:target
             }
    })
    
}
//取消关注用户
function deleteFocusUser(target) {
    return myRequest({
        url: `/app/v1_0/user/followings/${target}`,
             method: 'DELETE'
    })
    
}


export {userRegister, focusUser,deleteFocusUser}






