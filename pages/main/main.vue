<template>
	<view>
		<view class="content">
			<uni-swiper-dot :info="info" :current="current" field="content" :mode="mode">
				<swiper :autoplay="true" class="swiper-box" @change="change">
					<swiper-item v-for="(item ,index) in info" :key="index">
						<view class="swiper-item">
							<image :src="item.url" mode="scaleToFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<uni-grid :options="category" @click="cateToPage" :show-out-border="false" :column-num="4"></uni-grid>
	</view>
</template>

<script>
	let oldVal = 0;
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue'
	import uniIcon from '@/components/uni-icon/uni-icon.vue'
	import uniGrid from '@/components/uni-grid/uni-grid.vue'

	export default {
		components: {
			uniIcon,
			uniSwiperDot,
			uniGrid
		},
		data() {
			return {
				city: '北京',
				info: [{
					colorClass: 'uni-bg-red',
					url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg',
					content: '内容 A'
				}, {
					colorClass: 'uni-bg-green',
					url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg',
					content: '内容 B'
				}, {
					colorClass: 'uni-bg-blue',
					url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg',
					content: '内容 C'
				}],
				modeIndex: -1,
				styleIndex: -1,
				current: 0,
				mode: 'default',
				category: [{
						image: '/static/c1.png',
						text: 'Grid'
					},
					{
						image: '/static/c2.png',
						text: 'Grid'
					},
					{
						image: '/static/c3.png',
						text: 'Grid'
					},
					{
						image: '/static/c4.png',
						text: '分类'
					}
				],
			}
		},
		methods: {
			showCity() {
				uni.showToast({
					title: '选择城市'
				})
			},
			change(e) {
				this.current = e.detail.current;
			},
			cateToPage(e) {
				if (e.index == 3) {
					uni.switchTab({
						url: "/pages/product/type"
					})
				}

			}
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh')
			setTimeout(function() {
				uni.stopPullDownRefresh()
				console.log('stopPullDownRefresh')
			}, 1000)
		},
		onNavigationBarSearchInputClicked(e) {
			uni.navigateTo({
				url: "/pages/product/search"
			});
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: "/pages/product/search"
			});
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff
	}

	.uni-common-mt {
		color: #7a7e83;
		font-size: 28upx;
		padding: 30upx;
	}

	.title {
		font-size: 15px;
		line-height: 20px;
		color: #333333;
		padding: 15px;
	}

	.city {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-left: 8px;
		white-space: nowrap;
	}

	.input-view {
		width: 92%;
		display: flex;
		background-color: #e7e7e7;
		height: 30px;
		border-radius: 15px;
		padding: 0 4%;
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
		width: 94%;
		padding: 0 3%;
	}

	.swiper-box {
		height: 400upx;
	}

	.swiper-item {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		background: #eee;
		color: #fff;
	}

	.swiper-item image {
		width: 100%;
		height: 100%;
	}
</style>
