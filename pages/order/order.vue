<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time">{{item.CreateDate}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.State}}</text>
							<text v-if="item.State=='已关闭'" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(item.OrderNo)"></text>
						</view>

						<!-- <scroll-view v-if="item.Detail.length > 1" class="goods-box" scroll-x>
							<view v-for="(goodsItem, goodsIndex) in item.Detail" :key="goodsIndex" class="goods-item">
								<image class="goods-img" :src="url+goodsItem.Url" mode="aspectFill"></image>
							</view>
						</scroll-view> -->
						<view  class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.Detail"
						 :key="goodsIndex">
							<image class="goods-img" :src="url+(goodsItem.Url || '/images/errorImage.jpg')" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.ProductName}}</text>
								<text class="attr-box">{{goodsItem.UnitName}} x {{goodsItem.Amount}}</text>
								<text class="price">{{goodsItem.Price}}</text>
							</view>
						</view>

						<view class="price-box">
							共
							<text class="num">{{item.Amount}}</text>
							件商品 实付款
							<text class="price">{{item.Money}}</text>
						</view>
						<view class="price-box">							
							<text v-if="item.SendType=='自取'" class="num">送货方式：{{item.SendType}}</text>							
							<text v-else class="num">收货地址：{{item.Address}}</text>
						</view>
						<view class="action-box b-t" v-if="item.State == '待付款'">
							<button class="action-btn" @click="cancelOrder(item.OrderNo)">取消订单</button>
							<button @click="topay(item)" class="action-btn recom">立即支付</button>
						</view>
					</view>

					<uni-load-more :status="tabItem.loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	var config = require('../../common/config.js');
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 1,
				url: config.url,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '待评价',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 4,
						text: '售后',
						loadingType: 'more',
						orderList: []
					}
				],
			};
		},

		onShow() {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			var state = uni.getStorageSync("order_state");
			this.tabCurrentIndex = state ? state : 0;
			this.loadData();

		},

		methods: {
			//获取订单列表
			loadData(source) {
				var ths = this;
				//这里是将订单挂载到tab列表下
				let index = ths.tabCurrentIndex;
				let navItem = ths.navList[index];
				let state = navItem.state;

				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				navItem.loadingType = 'loading';

				let node = ths.orderStateExp(index);
				ths.$api.ajax({
					url: "/api/order/GetOrders/state",
					method: "POST",
					data: {
						page: 0,
						Type: node.stateTip,
						rows: 10
					},
					success: function(json) {
						var res = json.data;
						console.log(res);
						navItem.orderList = res.rows;
						//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
						ths.$set(navItem, 'loaded', true);
						//判断是否还有数据， 有改为 more， 没有改为noMore 
						navItem.loadingType = 'more';
					}
				});
				// setTimeout(()=>{
				// 	let orderList = Json.orderList.filter(item=>{
				// 		//添加不同状态下订单的表现形式
				// 		item = Object.assign(item, this.orderStateExp(item.state));
				// 		//演示数据所以自己进行状态筛选
				// 		if(state === 0){
				// 			//0为全部订单
				// 			return item;
				// 		}
				// 		return item.state === state
				// 	});
				// 	orderList.forEach(item=>{
				// 		navItem.orderList.push(item);
				// 	})
				// 	//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
				// 	this.$set(navItem, 'loaded', true);

				// 	//判断是否还有数据， 有改为 more， 没有改为noMore 
				// 	navItem.loadingType = 'more';
				// }, 600);	
			},

			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				uni.setStorageSync("order_state", index)
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(orderNo) {
                let ths=this;
                ths.$api.ajax({
                	url: "/api/order/DelOrder/"+orderNo,
                	method: "POST",
                	data: {},
                	success: function(json) {
                		var res = json.data;
                        if(res.Success)
                            ths.loadData();
                        else  
                            ths.$api.msg(res.Msg);
                	}
                });
			},
			//取消订单
			cancelOrder(orderNo) {
				let ths=this;
				ths.$api.ajax({
					url: "/api/order/CloseOrder/"+orderNo,
					method: "POST",
					data: {},
					success: function(json) {
						var res = json.data;
				        if(res.Success)
				            ths.loadData();
				        else  
				            ths.$api.msg(res.Msg);
					}
				});
			},
			topay(item){
				uni.redirectTo({
				    url: '/pages/money/pay?orderno=' + item.OrderNo + '&money=' + item.Money+ '&pmoney=' + item.PMoney+ '&type=order'
				});
			},
			//订单状态文字和颜色
			orderStateExp(state) {
				state = Number(state);
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch (state) {
					case 0:
						stateTip = '全部';
						break;
					case 1:
						stateTip = '待付款';
						break;
					case 2:
						stateTip = '待收货';
						break;
					case 3:
						stateTip = '待评价';
						stateTipColor = '#909399';
						break;
					case 4:
						stateTip = '已关闭';
						stateTipColor = '#909399';
						break;

						//更多自定义
				}
				return {
					stateTip,
					stateTipColor
				};
			}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;

		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				color: $base-color;
			}

			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}

				.price {
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
