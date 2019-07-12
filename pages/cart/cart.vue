<template>
	<view>
		
	</view>
</template>

<script>
	var service = require('../../common/service.js');	
	export default {
		data() {
			return {
				
			}
		},
		onShow() {
			var userinfo = service.getUser();
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
		}
	}
</script>

<style>

</style>
