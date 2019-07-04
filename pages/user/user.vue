<template>
	<view class="content">
		
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		computed: {

		},
		onShow() {
			var userinfo = uni.getStorageSync('userinfo');
			if (!userinfo) {
				uni.navigateTo({
					url: '/pages/user/login',
				});
			}
		},
		methods: {
			bindLogin() {
				uni.navigateTo({
					url: '/pages/user/login',
				});
			},
			bindLogout() {
				/**
				 * 如果需要强制登录跳转回登录页面
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../login/login',
					});
				}
			}
		}
	}
</script>

<style>

</style>
