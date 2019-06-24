<template>
	<view style="width: 750upx;">
		<uni-nav-bar color="#333333" left-text="禁用"  :fixed="true" background-color="#FFFFFF" right-text="搜索" @click-right="search">
			<view class="input-view">
				<uni-icon type="search" size="22" color="#666666"></uni-icon>
				<input confirm-type="search" @confirm="search"  class="input" type="text" placeholder="输入搜索关键词" />
			</view>
		</uni-nav-bar>
		<swiper indicator-dots="true">
			<swiper-item v-for="(img, key) in imgUrls" :key="key"><image :src="img" /></swiper-item>
		</swiper>
	</view>
	
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import uniIcon from '@/components/uni-icon/uni-icon.vue'

	export default {
		components: {
			uniNavBar,
			uniIcon
		},
		data() {
			return {
				showSwiper: false,
				imgUrls: [
					'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg',
					'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg'
				]
			}
		},
		methods: {
			search() {
				uni.showToast({
					title: '搜索'
				})
			}
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh')
			setTimeout(function() {
				uni.stopPullDownRefresh()
				console.log('stopPullDownRefresh')
			}, 1000)
		}
	}
</script>

<style>
	.input-view {
		width: 100%;
		display: flex;
		background-color: #e7e7e7;
		height: 30px;
		border-radius: 15px;
		padding: 0;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: 30px;
	}

	.input-view .uni-icon {
		line-height: 30px !important;
	}

	.input-view .input {
		height: 30px;
		line-height: 30px;
		width: 100%;
		padding: 0;
	}
</style>
