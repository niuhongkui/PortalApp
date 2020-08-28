<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{ active: item.id === currentId }" @click="tabtap(item)">{{ item.name }}</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="(item, index) in slist" :key="item.ID" class="s-list" :id="'main-' + item.ID">
				<view class="t-list">
					<view @click="navToList(item.ID)" class="t-item">
						<image :src="config.url + (item.Url || '/images/missing-face.png')"></image>
					</view>
					<view class="t-item-text">
						<text class="item-title">{{ item.Name }}</text>
						<text>单位: {{ item.UnitName }}</text>
						<text>库存: {{ item.Amount }}</text>
						<view class="item-price">
							会员价:{{ item.MemberPrice }}¥
							<text class="item-oriprice">({{ item.Price }}¥)</text>
						</view>
					</view>
					<view class="t-item-text" style="position:relative;width: 174upx;">
						<uni-number-box :min="0" :max="item.Amount" :value="item.SelectAmount" :isMax="true" :isMin="true" :index="index"
						 @eventChange="numberChange"></uni-number-box>
					</view>
				</view>
			</view>
			<view class="s-list">
				<view class="t-list">
					<text></text>
					<text></text>
				</view>
			</view>
		</scroll-view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/cart/cart" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-text">
				<view class="p-b-price">¥{{ money +"  " }} <text class="p-b-ori"> ¥{{ oriMoney }}</text></text></view>
				<view>另需配送费¥{{sendMoney}}</view>
			</view>
			<view class="action-btn-group"><button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">去结算</button></view>
		</view>
	</view>
</template>

<script>
	var config = require('../../common/config.js');
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue';
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				flist: [],
				slist: [],
				money: 0,
				oriMoney: 0,
				config: config,
				sendMoney:4
			};
		},
		onLoad() {
			this.loadData();
		},
		computed: {
			...mapState(['userInfo', 'hasLogin']),
		},
		methods: {
			...mapMutations(['login', 'logout']),
			async loadData() {
				var ths = this;
				this.$api.ajax({
					url: '/api/product/getcate/type',
					success: function(json) {
						var res = json.data;
						var list = res.Data;
						ths.flist = list;
					}
				});
				this.$api.ajax({
					url: '/api/product/GetAllGood/all',
					success: function(json) {
						var res = json.data;
						var list = res.Data;
						ths.slist = list;
						
						let cartlist = ths.slist.filter(item => item.SelectAmount > 0);
						cartlist.forEach(n => {
							ths.oriMoney = ths.oriMoney + n.Price*n.SelectAmount;
							if(ths.hasLogin){								
								ths.money = ths.money +(ths.userInfo.IsMember>0?n.MemberPrice:n.Price)*n.SelectAmount;
							}else{
								ths.money=ths.oriMoney;
							}
						});
						if (ths.money >= 100) {
						    ths.sendMoney = 0;
						}else if (ths.money < 100 &&ths.money>=50) {
						    ths.sendMoney = 2;
						} else if (ths.money < 50 &&ths.money >= 20) {
						    ths.sendMoney = 3;
						}else{
						    ths.sendMoney = 4;
						}
					}
				});
			},
			//一级分类点击
			tabtap(item) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}

				this.currentId = item.id;
				let index = this.slist.findIndex(sitem => sitem.TypeID === item.id);
				this.tabScrollTop = this.slist[index].top;
			},
			//右侧栏滚动
			asideScroll(e) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item => item.top <= scrollTop).reverse();
				if (tabs.length > 0) {
					this.currentId = tabs[0].TypeID;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				this.slist.forEach(item => {
					let view = uni.createSelectorQuery().select('#main-' + item.ID);
					view.fields({
							size: true
						},
						data => {
							item.top = h;
							h += data.height;
							item.bottom = h;
						}
					).exec();
				});
				this.sizeCalcState = true;
			},
			navToList(id) {
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				});
			},
			numberChange(data) {
				var ths = this;
				if(!ths.hasLogin){
					uni.navigateTo({
						url: `/pages/public/login?back=1`
					})
					return;
				}
				ths.slist[data.index].SelectAmount = data.number;
				let list = ths.slist.filter(item => item.SelectAmount > 0);
				var node=ths.slist[data.index];
				ths.$api.ajax({
					url: "/api/order/AddCart/pro",
					data:{
						ProductID:node.ID,
						UnitID:node.UnitID,
						ProductName:node.Name,
						UnitName:node.UnitName,
						Amount:node.SelectAmount,
					},
					method: "POST",
					success: function(json) {
						// var res = json.data;
						// uni.showToast({
						// 	icon: 'none',
						// 	title: res.Msg
						// });						
					}
				})
				
				ths.money=0;
				ths.oriMoney =0;
				list.forEach(n => {
					ths.money = ths.money +(this.userInfo.IsMember>0?n.MemberPrice:n.Price)*n.SelectAmount;
					ths.oriMoney = ths.oriMoney + n.Price*n.SelectAmount;
				});	
                
                if (ths.money >= 100) {
                    ths.sendMoney = 0;
                }else if (ths.money < 100 &&ths.money>=50) {
                    ths.sendMoney = 2;
                } else if (ths.money < 50 &&ths.money >= 20) {
                    ths.sendMoney = 3;
                }else{
                    ths.sendMoney = 4;
                }
			},
			buy() {
				if (this.money == 0) {
					this.$api.msg("请选择商品！");
					return;
				}
				
				if(!this.hasLogin){
					uni.navigateTo({
						url: `/pages/public/login`
					})
					return;
				}
				let list = this.slist.filter(item => item.SelectAmount > 0);
				let goodsData = [];
				list.forEach(item=>{
					goodsData.push({
						Amount: item.SelectAmount,
						ProductID: item.ID,
						UnitID:item.UnitID
					})
				})
				
				uni.navigateTo({
					url: `/pages/order/createOrder?data=${JSON.stringify({
						GoodsData: goodsData
					})}`
				})
			}
		}
	};
</script>

<style lang="scss">
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}

	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;

		&.active {
			color: $base-color;
			background: #f8f8f8;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: 0.8;
			}
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}

	.s-item {
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 10upx;

		image {
			width: 140upx;
			height: 140upx;
		}
	}

	.t-item-text {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		width: 176upx;
		font-size: 20upx;
		color: #666;
		padding-bottom: 10upx;
	}

	.t-item-btn {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		width: 176upx;
		font-size: 20upx;
		color: #666;
		padding-bottom: 10upx;
	}

	.item-title {
		font-size: 30upx;
		font-weight: bold;
	}

	.item-price {
		color: red;
		font-size: 20upx;
	}

	.item-oriprice {
		color: #666;
		font-size: 18upx !important;
		text-decoration: line-through;
		-webkit-text-size-adjust: none;
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 10upx;
		// #ifdef H5
		bottom: 100upx;
		// #endif
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.p-b-text {
			width: 350upx;
			height: 80upx;
			font-size: 20upx;
			padding: 2upx;

			.p-b-price {
				font-size: 35upx !important;

				.p-b-ori {
					font-size: 20upx !important;
					text-decoration: line-through;
				}
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, 0.5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
</style>
