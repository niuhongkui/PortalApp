<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">倚民超市</view>
			<view class="welcome">
				
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<view style="display: flex;flex-direction:row;width: 100%; ">
						<input type="number" style="border: 1px solid #D4D4D4; border-radius: 5px;"  v-model="UserCode" placeholder="请输入手机号码" maxlength="11"   />
						<button @click="getVerifyCode" :disabled="disabled" style="width: 200upx;text-align: center;background-color: #fff;" class="uni-input-input"><span v-if="btnTxt>0">{{btnTxt}}s</span><span v-else>验证码</span></button>
					</view>			
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<input type="number" style="border: 1px solid #D4D4D4;border-radius: 5px;"  placeholder="请输入6位验证码"  maxlength="6" v-model="VerifyCode"  />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" style="border: 0.5px solid #D4D4D4;border-radius: 5px;"   placeholder="6-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
					 password  v-model="PassWord"  @confirm="editPwd" />
				</view>
			</view>
			<button class="confirm-btn" @click="editPwd" :disabled="logining">修改</button>
			<view class="forget-section">
			
			</view>
		</view>
		<view class="register-section">
			
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	var config = require('../../common/config.js');
	var util = require('../../common/util.js');
	export default {
		data() {
			return {
				UserCode: '',
				PassWord: '',
				VerifyCode: '',
				disabled: false,
				btnTxt: 0,
				InterValObj: {},
				logining: false
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['login']),
			navBack() {
				uni.navigateBack();
			},
			getVerifyCode() {
				var ths = this;
				if (!util.checkPhone(ths.UserCode)) {
					ths.$api.msg('手机号有误')
					return;
				}
				ths.disabled = true;
				ths.btnTxt = 120;
				ths.InterValObj = setInterval(function(){
                    if (ths.btnTxt == 0) {
                    	clearInterval(ths.InterValObj); //停止计时器
                    	ths.disabled = false;
                    } else {
                    	ths.btnTxt--;
                    }
                }, 1000); //启动计时器，1秒执行一次
				ths.$api.ajax({
					url: "/api/userinfo/VerifyCode/in?strPhone="+ths.UserCode,
					success: function(json) {
						var res = json.data;
						if(res.Success){
							uni.showToast({
								icon: 'success',
								title: res.Msg
							});
						}else{
							uni.showToast({
								icon: 'none',
								title: res.Msg
							});
						}
					}
				})
			},
			SetRemainTime() {
				var ths = this;
				if (ths.btnTxt == 0) {
					window.clearInterval(ths.InterValObj); //停止计时器
					ths.disabled = false;
				} else {
					ths.btnTxt--;
				}
			},
			editPwd() {
				var ths = this;
				if (!util.checkPhone(ths.UserCode)) {
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
				ths.logining = true;
				ths.$api.ajax({
					url: "/api/userinfo/EditPassWord/user",
					data: data,
					method: "POST",
					success: function(json) {
						var res = json.data;
						if (res.Success) {
							ths.$api.ajax({
								url: "/api/userinfo/loginon/in",
								data: data,
								method: "POST",
								success: function(ijson) {
									var ires = ijson.data;
									ths.login(ires.Data);									
									ths.logining = false;
									uni.switchTab({
										url: "/pages/category/category"
									})
								}
							})
						} else {
							ths.logining = false;
							uni.showToast({
								title: res.Msg,
								icon: "none"
							});
						}
					}
				});

			}			
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
        background-image: linear-gradient(#ff3758, #fff);
	}

	.wrapper {
		position: relative;
		z-index: 90;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
        text-align: center;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
            background-color: #fff;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
