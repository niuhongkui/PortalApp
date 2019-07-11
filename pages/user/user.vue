<template>
	<view class="content">
		<view class="btn-row">
			<button type="primary" class="primary" @tap="bindLogout">退出</button>
		</view>
	</view>
</template>

<script>
	var service = require('../../common/service.js');	

	export default {
		computed: {

		},
		onShow() {
			var userinfo = service.getState();
			if (!userinfo) {
				this.bindLogin();
			}
		},
		methods: {
			bindLogin() {
				uni.navigateTo({
					url: '/pages/user/login',
				});
			},
			bindLogout() {
				service.loginOut();
				uni.reLaunch({
					url: '../user/login',
				});
			}
		}
	}
</script>

<style>

</style>
