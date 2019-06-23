<template>
	<view>
		<view style="height: 100%;" class="uni-padding-wrap">
			<view style="height: 100%;" class="page-section swiper">
				<view style="height: 100%;" class="page-section-spacing">
					<swiper style="height: 100%;" class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
					 :duration="duration">
						<swiper-item>
							<view class="swiper-item uni-bg-red"></view>
							<view class="jump-over" @tap="launchFlag()">跳过</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item uni-bg-green"></view>
							<view class="jump-over" @tap="launchFlag()">跳过</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item uni-bg-blue"></view>
							<view class="jump-over" @tap="launchFlag()">跳过</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item uni-bg-block"></view>
							<view class="jump-over" @tap="launchFlag()">进入</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: false,
				interval: 2000,
				duration: 500
			}
		},
		methods: {
			launchFlag() {
				uni.reLaunch({
					url:"/pages/main/main"
				})
			}
		}
	}
</script>

<style>
	.swiper {
		width: 750upx;
		height: 100%;
	}

	.swiper-item {
		width: 750upx;
		display: block;
		height: 100%;
		text-align: center;
	}

	.swiper-list {
		margin-top: 40upx;
		margin-bottom: 0;
	}

	.uni-common-mt {
		margin-top: 60upx;
		position: relative;
	}

	.info {
		position: absolute;
		right: 20upx;
	}

	.uni-bg-red {
		background-color: #DD524D;
	}

	.uni-bg-green {
		background-color: #09BB07;
	}

	.uni-bg-blue {
		background-color: #1482D1;
	}

	.uni-bg-block {
		background-color: #6D6D72;
	}

	.jump-over {
		position: absolute;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		color: #454343;
		border: 1px solid #454343;
		z-index: 999;
	}

	.jump-over {
		right: 45upx;
		top: 125upx;
	}
</style>
