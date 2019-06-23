<template>
    <view>    	
    	<uni-nav-bar color="#333333" background-color="#FFFFFF" :fixed="false" right-icon="scan" @click-left="showCity" @click-right="scan">
    		<block slot="left">
    			<view class="city">
    				<view>{{city}}</view>
    				<uni-icon type="arrowdown" color="#333333" size="22"></uni-icon>
    			</view>
    		</block>
    		<view class="input-view">
    			<uni-icon type="search" size="22" color="#666666"></uni-icon>
    			<input confirm-type="search" disabled="true" @tap="reToSearch" class="input" type="text" placeholder="输入搜索关键词" />
    		</view>
    	</uni-nav-bar>
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
    			city: '北京'
    		}
    	},
    	methods: {
    		showCity() {
    			uni.showToast({
    				title: '选择城市'
    			})
    		},
    		scan() {
    			uni.showToast({
    				title: '扫码'
    			})
    		},
    		reToSearch() {
    			uni.navigateTo({
    				url:"/pages/product/search"
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
    page {
    	display: flex;
    	flex-direction: column;
    	box-sizing: border-box;
    	background-color: #fff
    }
    
    view {
    	font-size: 28upx;
    	line-height: inherit
    }
    
    .example {
    	padding: 0 30upx 30upx
    }
    
    .example-title {
    	font-size: 32upx;
    	line-height: 32upx;
    	color: #777;
    	margin: 40upx 25upx;
    	position: relative
    }
    
    .example .example-title {
    	margin: 40upx 0
    }
    
    .example-body {
    	padding: 0 40upx
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
</style>
