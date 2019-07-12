const USERS_KEY = 'App_User_Key';
const apiUrl = "http://localhost:81";
const ajax = (opt) => {
	opt = opt || {};
	opt.url = opt.url || '';
	opt.data = opt.data || null;
	opt.method = opt.method || 'GET';
	var token = "";
	var user = uni.getStorageSync(USERS_KEY);
	if (user) {
		token = user.Token;
	}
	opt.header = opt.header || {
		"Content-Type": "application/json",
		"Authorization": token
	};
	opt.success = opt.success || function() {};
	uni.request({
		url: apiUrl + opt.url,
		data: opt.data,
		method: opt.method,
		header: opt.header,
		dataType: 'json',
		success: function(res) {
			opt.success(res);
		},
		fail: function() {
			uni.showToast({
				title: '请稍后重试'
			});
		}
	})
}

const login = function(res) {
	uni.setStorageSync(USERS_KEY, JSON.stringify(res));
}

const loginOut = function() {
	uni.setStorageSync(USERS_KEY, undefined);
}

const getUser = function() {
	var user = uni.getStorageSync(USERS_KEY);
	return user;
}


module.exports = {
	ajax,
	apiUrl,
	login,
	loginOut,
	getUser
}
