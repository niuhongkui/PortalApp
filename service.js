// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

const url = "http://localhost:81"

const getUsers = function(userinfo) {	
	uni.request({
		url: url+"/api/userinfo/loginon/1", //仅为示例，并非真实接口地址。
		data: userinfo,
		header:{
			'content-type':'application/x-www-form-urlencoded'
		},
		dataType: 'json',
		method :'POST',
		success: (res) => {
			
		}
	});
	let ret = '';
	ret = uni.getStorageSync(USERS_KEY);
	if (!ret) {
		ret = '[]';
	}
	return JSON.parse(ret);
}

const addUser = function(userInfo) {
	let users = getUsers(userInfo);
	users.push({
		UserCode: userInfo.UserCode,
		PassWord: userInfo.PassWord
	});
	uni.setStorageSync(USERS_KEY, JSON.stringify(users));
}

export default {
	getUsers,
	addUser,
	url
	
}
