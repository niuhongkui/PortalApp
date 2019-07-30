<template>
	<view>
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<text class="bg-upload-btn yticon icon-paizhao"></text>
			<view class="portrait-box">
				<image class="portrait" @click="editImg" :src="config.url +(userInfo.ImageUrl||'/images/missing-face.png')"></image>
				<text class="pt-upload-btn yticon icon-paizhao">v</text>
			</view>
		</view>
		<view class="history-section icon">
			<list-cell @eventClick="editName()" icon="icon-weixin" title="名称" :tips="userInfo.UserName" navigateType=""></list-cell>
			<list-cell icon="icon-dianhua-copy" title="账号" :tips="userInfo.UserCode" navigateType=""></list-cell>
			<list-cell @eventClick="goPay()" icon="icon-iconfontweixin" title="会员信息" tips="您还不是会员" navigateType=""></list-cell>
		</view>
	</view>
</template>

<script>
	var config = require('../../common/config.js');
	import listCell from '@/components/mix-list-cell';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			listCell
		},
		data() {
			return {
				config: config
			};
		},
		computed: {
			...mapState(['userInfo','login']),
		},
		onShow: function() {
			this.init();
		},
		methods: {
			init: function() {

			},
			editImg: function() {
				var ths = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: config.url + '/api/userinfo/uploadimg/img', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							header: {
								"Authorization": "Auth " + ths.userInfo.Token
							},
							formData: {},
							success: (uploadFileRes) => {
								var fileRes = JSON.parse(uploadFileRes.data);
								if (fileRes.Success) {
									ths.userInfo.ImageUrl=fileRes.Data;
									ths.login(ths.userInfo);
								} else {
									ths.$api.msg(fileRes.Msg)
								}
							}
						});
					}
				});
			},
			editName: function() {
				this.$api.msg("修改名称")
			},
			goPay: function() {
				this.$api.msg("购买会员")
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.user-section {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 460upx;
		padding: 40upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}

		.portrait-box {
			width: 200upx;
			height: 200upx;
			border: 6upx solid #fff;
			border-radius: 50%;
			position: relative;
			z-index: 2;
		}

		.portrait {
			position: relative;
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}

		.yticon {
			position: absolute;
			line-height: 1;
			z-index: 5;
			font-size: 48upx;
			color: #fff;
			padding: 4upx 6upx;
			border-radius: 6upx;
			background: rgba(0, 0, 0, .4);
		}

		.pt-upload-btn {
			right: 0;
			bottom: 10upx;
		}

		.bg-upload-btn {
			right: 20upx;
			bottom: 16upx;
		}
	}
</style>
