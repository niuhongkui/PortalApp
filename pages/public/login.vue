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
					<input type="number" style="border: 1px solid #D4D4D4; border-radius: 5px;" v-model="UserCode" placeholder="请输入手机号码" maxlength="11"   />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" style="border: 1px solid #D4D4D4; border-radius: 5px;"  placeholder="6-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
					 password  v-model="PassWord"  @confirm="toLogin" />
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
			<view class="forget-section">				
				<text @click="toResetPwd">忘记密码?</text>
			</view>
		</view>
		<view class="register-section">
			还没有账号?
			<text @click="toRegist">马上注册</text>
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
				logining: false,
				back:0
			}
		},
		onLoad(opt) {
			this.back=opt.back;
		},
		methods: {
			...mapMutations(['login']),
			navBack() {
				uni.navigateBack();
			},
			toRegist() {
				uni.navigateTo({
					url: '/pages/public/reg'
				})
			},toResetPwd() {
				uni.navigateTo({
					url: '/pages/public/pwd'
				})
			},
			toLogin() {
				var ths = this;				
				/* 数据验证模块*/
				if (!util.checkPhone(ths.UserCode)) {
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
				
				this.logining = true;
				ths.$api.ajax({
					url:"/api/userinfo/loginon/in",
					data:data,
					method:"POST",
					success:function(json){
						var res=json.data;
						if(res.Success){
							ths.login(res.Data);
							uni.switchTab({
								url:'/pages/category/category'
							})
						}else{							
							ths.$api.msg(res.Msg);
						}
					},
					complete:function(){
						ths.logining = false;
					}
				})
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
