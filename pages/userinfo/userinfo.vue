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
			<list-cell  @eventClick="editName()" icon="icon-weixin" title="名称" :tips="userInfo.UserName" navigateType=""></list-cell>
			<list-cell   icon="icon-dianhua-copy" title="账号" :tips="userInfo.UserCode" navigateType=""></list-cell>
			<list-cell  @eventClick="goPay()" icon="icon-iconfontweixin"  title="会员信息" tips="您还不是会员" navigateType=""></list-cell>
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
			...mapState(['userInfo']),
		},
		onShow: function() {
			this.init();
		},
		methods: {
			init: function() {

			},
			editImg: function() {
				this.$api.msg("修改图片")
			},
			editName: function() {
				this.$api.msg("修改名称")
			},
			goPay:function(){
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
