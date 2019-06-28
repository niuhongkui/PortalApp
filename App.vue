<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			try {
				const value = uni.getStorageSync('launchFlag');
				if (value) {
					if (value == true) {
						uni.switchTab({
							url: 'pages/main/main'
						});
					} else {
						uni.redirectTo({
							url: '/pages/guide/guide'
						});
					}
				} else {
					uni.setStorage({
						key: 'launchFlag',
						data: true
					});
					uni.redirectTo({
						url: '/pages/guide/guide'
					});
				}
			} catch (e) {
				// error 
				uni.setStorage({
					key: 'launchFlag',
					data: true
				});
				uni.redirectTo({
					url: '/pages/guide/guide'
				});
			}
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
	
	/* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
	page {
		background-color: #F4F5F6;
		height: 100%;
		font-size: 28upx;
		line-height: 1.8;
	}
	
	.uni-header-logo {
		padding: 30upx;
		text-align: center;
		margin-top: 10upx;
	}
	
	.uni-header-logo image {
		width: 140upx;
		height: 140upx;
	}
</style>
