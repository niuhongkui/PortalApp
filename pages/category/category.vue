<template>
	<view class="content" style="margin-top:150upx;">
		<scroll-view scroll-with-animation scroll-y class="left-aside" :scroll-top="tabScrollTop">
			<view ref="fmenu" v-for="(item,index) in flist" :key="item.id" class="f-item b-b" :index="index" :data-id="item.id" :class="{ active: item.id === tabCur }"
			 @tap="tabtap(item,index)">{{ item.name }}</view>
			<view style="height: 200upx;"></view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scrolltolower="scrolltolower" @scrolltoupper="scrolltoupper" :scroll-into-view="'main-'+mainCur"
		 @scroll="asideScroll">
			<view v-for="(e,i) in flist" :key="e.id" class="s-list" :id="'main-'+e.id">
				<view v-for="(item, index) in slist" v-if="item.TypeID==e.id" :key="item.ID" class="s-list">
					<view class="t-list">
						<view @click="navToList(item.ID)" class="t-item">
							<image :src="config.url + (item.Url || '/images/errorImage.jpg')"></image>
						</view>
						<view class="t-item-text">
							<text class="item-title">{{ item.Name }}</text>
							<text>单位: {{ item.UnitName }}</text>
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
			</view>

			<view class="s-list" style="height:130upx">
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
				tabScrollTop:0,
				tabCur: '',
				mainCur: 0,
				flist: [],
				slist: [],
				money: 0,
				oriMoney: 0,
				config: config,
				sendMoney: 4,
				isRefresh: true,
				rows: 10,
				page: 0,
                index:0
			};
		},
		onLoad() {

		},
		onShow() {
			if (this.isRefresh)
				this.scrolltoupper();
			else
				this.isRefresh = true;
		},
		computed: {
			...mapState(['userInfo', 'hasLogin']),
		},
        // 标题栏input搜索框点击
        onNavigationBarSearchInputClicked:  function(e) {
        	// this.$api.msg('点击了搜索框');
            uni.navigateTo({
                url:"../product/list"
            })
        },
        //点击导航栏 buttons 时触发
        onNavigationBarButtonTap(e) {
        	// this.$api.msg('点击了扫描');
            uni.navigateTo({
                url:"../product/list"
            })
        },
		methods: {
			...mapMutations(['login', 'logout']),
			scrolltoupper() {
				this.sizeCalcState = false;
				this.tabScrollTop = 0;
				this.page=0;
				this.slist=[];
				this.loadData();
			},
			scrolltolower(){
				this.page=this.page+1;
				this.loadData();
			},
			getcate() {
				var ths = this;
				ths.$api.ajax({
					url: '/api/product/getcate/type',
					success: function(jsont) {
						var rest = jsont.data;
						ths.flist = rest.Data;
						if (ths.flist.length > 0) {
							ths.tabCur = ths.flist[0].id;
						}						
						ths.getpro();
					}
				});
			},
			getpro(){
				var ths = this;
				ths.$api.ajax({
					url: '/api/product/GetAllGood2/all',
					method: 'POST',
					data: {
						rows: ths.rows,
						page: ths.page,
						Type: ths.tabCur
					},
					success: function(json) {
						var res = json.data;
						var list = res.Data;
                        //返回数据为空时，加载下一级数据
                        // if(list.length==0){
                        //     if(ths.flist.length>ths.index){
                        //         let item=ths.flist[ths.index+1]
                        //         ths.tabtap(item,ths.index+1);                                
                        //     }                            
                        //     return;
                        // }
						ths.slist=ths.slist.concat(list);
						let cartlist = ths.slist.filter(item => item.SelectAmount > 0);
						ths.money = 0;
						ths.oriMoney = 0;
						ths.sendMoney = 0;
						cartlist.forEach(n => {
							ths.oriMoney = ths.oriMoney + n.Price * n.SelectAmount;
							if (ths.hasLogin) {
								ths.money = ths.money + (ths.userInfo.IsMember > 0 ? n.MemberPrice : n.Price) * n.SelectAmount;
							} else {
								ths.money = ths.oriMoney;
							}
						});
						ths.oriMoney = Number(ths.oriMoney.toFixed(2));
						ths.money = Number(ths.money.toFixed(2));
				
						if (ths.money >= 100) {
							ths.sendMoney = 0;
						} else if (ths.money < 100 && ths.money >= 50) {
							ths.sendMoney = 0;
						} else if (ths.money < 50 && ths.money >= 20) {
							ths.sendMoney = 0;
						} else {
							ths.sendMoney = 0;
						}
					}
				});
			},
			loadData() {
				var ths = this;
				if (!ths.tabCur) {
					ths.getcate()
					return;
				}
				ths.getpro();
			},
			//一级分类点击
			tabtap(item,index) {
				this.tabCur = item.id;
				//let index = this.flist.findIndex(f => f.id === item.id);
                this.index=index;
				this.tabScrollTop = 50 * index;
				
				this.slist=[];
				this.page=0;
				this.loadData();
				
			},
			//右侧栏滚动
			asideScroll(e) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}

				let scrollTop = e.detail.scrollTop;
				let tabs = this.flist.filter(item => item.top < scrollTop && item.bottom > scrollTop).reverse();

				if (tabs.length > 0) {
					this.tabCur = tabs[0].id;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				this.flist.forEach(item => {
					let view = uni.createSelectorQuery().select('#main-' + item.id);
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
				if (!ths.hasLogin) {
					uni.navigateTo({
						url: `/pages/public/login?back=1`
					})
					return;
				}
				ths.slist[data.index].SelectAmount = data.number;
				let list = ths.slist.filter(item => item.SelectAmount > 0);
				var node = ths.slist[data.index];
				if (node.SelectAmount) {
					ths.$api.ajax({
						url: "/api/order/AddCart/pro",
						data: {
							ProductID: node.ID,
							UnitID: node.UnitID,
							ProductName: node.Name,
							UnitName: node.UnitName,
							Amount: node.SelectAmount,
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
				}


				ths.money = 0;
				ths.oriMoney = 0;
				ths.sendMoney = 0;
				list.forEach(n => {
					ths.money = ths.money + (this.userInfo.IsMember > 0 ? n.MemberPrice : n.Price) * n.SelectAmount;
					ths.oriMoney = ths.oriMoney + n.Price * n.SelectAmount;
				});
				ths.oriMoney = Number(ths.oriMoney.toFixed(2));
				ths.money = Number(ths.money.toFixed(2));
				if (ths.money >= 100) {
					ths.sendMoney = 0;
				} else if (ths.money < 100 && ths.money >= 50) {
					ths.sendMoney = 0;
				} else if (ths.money < 50 && ths.money >= 20) {
					ths.sendMoney = 0;
				} else {
					ths.sendMoney = 0;
				}
			},
			buy() {
                uni.navigateTo({
                    url:"/pages/cart/cart"
                });
                return;
                //去购物车，不直接结算
				if (this.money == 0) {
					this.$api.msg("请选择商品！");
					return;
				}

				if (!this.hasLogin) {
					uni.navigateTo({
						url: `/pages/public/login`
					})
					return;
				}
				let list = this.slist.filter(item => item.SelectAmount > 0);
				let goodsData = [];
				list.forEach(item => {
					goodsData.push({
						Amount: item.SelectAmount,
						ProductID: item.ID,
						UnitID: item.UnitID
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
		height: 50px;
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
		background: #f8f8f8;
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
