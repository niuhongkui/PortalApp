<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input class="m-input" :maxlength="11" type="text" clearable focus v-model="UserCode" placeholder="请输入账号(手机号)"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="PassWord" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="bindLogin">登 录</button>
		</view>
		<view class="action-row">
			<navigator url="/pages/user/reg">注册账号</navigator>
			<text>|</text>
			<navigator url="/pages/user/pwd">忘记密码</navigator>
		</view>
		<view class="oauth-row" v-if="false" v-bind:style="{top: positionTop + 'px'}">
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<image :src="provider.image" @tap="oauth(provider.value)"></image>
			</view>
		</view>
	</view>
</template>

<script>	
	var service = require('../../common/service.js');	
	var util = require('../../common/util.js');
	import mInput from '@/components/m-input.vue'

	export default {
		components: {
			mInput
		},
		data() {
			return {
				providerList: [],
				hasProvider: false,
				UserCode: '',
				PassWord: '',
				positionTop: 0,
				forcedLogin:true
			}
		},
		methods: {
			initPosition() {
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			bindLogin() {
				var ths=this;
				if (!util.isPoneAvailable(ths.UserCode)) {
					uni.showToast({
						icon: 'none',
						title: '账号输入有误'
					});
					return;
				}
				if (this.PassWord.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				var data = {
					UserCode: this.UserCode,
					PassWord: this.PassWord
				};
				service.ajax({
					url:"/api/userinfo/loginon/in",
					data:data,
					method:"POST",
					success:function(json){
						var res=json.data;
						if(res.Success){
							service.login(res.Data)
							ths.toMain();
						}else{							
							uni.showToast({								
								title:res.Msg,
								icon:"none"
							});
						}
					}
				})
			},
			oauth(value) {
				uni.login({
					provider: value,
					success: (res) => {
						uni.getUserInfo({
							provider: value,
							success: (infoRes) => {
								this.toMain(infoRes.userInfo.nickName);
							}
						});
					},
					fail: (err) => {
						console.error('授权登录失败：' + JSON.stringify(err));
					}
				});
			},
			toMain() {
				uni.switchTab({
					url: '/pages/main/main',
				});
			}
		},
		onBackPress: function(options) {			
			uni.switchTab({
				url:"/pages/main/main"
			})
			return true;
		},
		onReady() {
			this.initPosition();
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
	body,
	uni-page-body {
		min-height: 100%;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
	}

	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		min-height: 100%;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
	}

	.content {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
		background-color: #efeff4;
		padding: 10px;
	}

	.input-group {
		background-color: #ffffff;
		margin-top: 21px;
		position: relative;
	}

	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		-ms-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		-ms-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-row {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		-webkit-flex-direction: row;
		-ms-flex-direction: row;
		flex-direction: row;
		position: relative;
	}

	.input-row .title {
		width: 20%;
		height: 26px;
		min-height: 26px;
		padding: 8px 0;
		padding-left: 16px;
		line-height: 26px;
	}

	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 8px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		-ms-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.btn-row {
		margin-top: 26px;
		padding: 10px;
	}

	uni-button.primary {
		background-color: #0faeff;
	}

	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #007aff;
		padding: 0 20upx;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		width: 100upx;
		height: 100upx;
		border: 1upx solid #dddddd;
		border-radius: 100upx;
		margin: 0 40upx;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 60upx;
		height: 60upx;
		margin: 20upx;
	}
</style>
