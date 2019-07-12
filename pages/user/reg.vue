<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">手机号：</text>
				<m-input type="text" :maxlength="11" focus="true" clearable v-model="UserCode" placeholder="请输入手机号"></m-input>
				<button :disabled="disabled" @tap="getVerifyCode">验证码 {{btnTxt}}</button>
			</view>
			<view class="input-row border">
				<text class="title">验证码：</text>
				<m-input type="text" :maxlength="6" clearable v-model="VerifyCode" placeholder="请输入验证码"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="PassWord" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="register">注册</button>
		</view>
	</view>
</template>

<script>
	var service = require('../../common/service.js');
	var util = require('../../common/util.js');
	import mInput from '../../components/m-input.vue';

	export default {
		components: {
			mInput
		},
		data() {
			return {
				UserCode: '',
				PassWord: '',
				VerifyCode: '',
				disabled: false,
				btnTxt: ''
			}
		},
		methods: {
			getVerifyCode() {

			},
			register() {
				var ths = this;
				if (!util.isPoneAvailable(ths.UserCode)) {
					uni.showToast({
						icon: 'none',
						title: '手机号有误'
					});
					return;
				}
				if (ths.VerifyCode.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '验证码为 6 位数字'
					});
					return;
				}
				if (this.PassWord.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码长度至少为 6 位字符'
					});
					return;
				}

				const data = {
					UserCode: this.UserCode,
					VerifyCode: this.VerifyCode,
					PassWord: this.PassWord
				}
				service.ajax({
					url: "/api/userinfo/register/user",
					data: data,
					method: "POST",
					success: function(json) {
						var res = json.data;
						if (res.Success) {
							service.ajax({
								url: "/api/userinfo/loginon/in",
								data: data,
								method: "POST",
								success: function(ijson) {
									var ires = ijson.data;
									service.login(ires.Data)
									uni.switchTab({
										url: "/pages/main/main"
									})
								}
							})
						} else {
							uni.showToast({
								title: res.Msg,
								icon: "none"
							});
						}
					}
				});

			}
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
