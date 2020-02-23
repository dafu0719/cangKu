//导入axios实例对象
import myRequest from '@/untils/request'

//获取文章列表
function getArticles({channel_id, timestamp, with_top}) {
    return myRequest({
        url: '/app/v1_1/articles',
        method: 'get',
        params: {
            channel_id: channel_id,
            timestamp: timestamp,
            with_top: with_top
        }
    })
}

//标识不喜欢的文章
function deleteArticles(autId) {
    return myRequest({
        url: "/app/v1_0/article/likings",
        method: 'POST',
        data: {
            target:autId
        }
    })
}

//获取联想建议
function lenove({q}) {
    return myRequest({
        url:  "/app/v1_0/suggestion",
        method: 'get',
        params: {
            q: q
        }
    })
}
// 获取搜索结果
function search({page,per_page,q}) {
    return myRequest({
        url:  "/app/v1_0/search",
        method: 'get',
        params: {
            page: page,
            per_page: per_page,
            q: q                
        }
    })
}
// 获取文章详情
function articleDetail(article_id) {
    return myRequest({
        url:  `/app/v1_0/articles/${article_id}`,
        method: 'get'
    })
}


export {getArticles, deleteArticles, lenove, search, articleDetail}






