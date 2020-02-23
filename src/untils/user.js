//存储用户数据
function setUserKey(val) {
    window.localStorage.setItem('userKey', JSON.stringify(val))
}

//获取用户数据
function getUserKey() {
  return JSON.parse(window.localStorage.getItem("userKey"))
}

//清除用户数据
function removeUserKey() {
   window.localStorage.removeItem('userKey')
}

export {setUserKey, getUserKey, removeUserKey}