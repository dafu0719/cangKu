//导入axios实例对象
import myRequest from '@/untils/request'

//获取评论
function getComments({type, source, offset, limit}) {
    return myRequest({
        url: "/app/v1_0/comments",
             method: 'GET',
             params:{
                type:type,
                source:source,
                offset:offset || null,
                limit:limit || null
             }
    })
    
}
// 增加评论或评论回复
function addComments({target, content, art_id}) {
    return myRequest({
        url: "/app/v1_0/comments",
             method: 'post',
             data:{
                target:target,
                content:content,
                art_id:art_id || null
             }
    })
    
}


export {getComments, addComments}






