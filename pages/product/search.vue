<template>
	<view class="wrapper">
		<view v-if="isHistory" class="history-box">
			<view v-if="historyList.length > 0">
				<view class="history-title">
					<text>搜索历史</text>
					<text class="uni-icon uni-icon-trash" @click="clearSearch"></text>
				</view>
				<view class="history-content">
					<view class="history-item" v-for="(item, index) in historyList" :key="index">
						{{ item.name }}
					</view>
				</view>
			</view>
			<view v-else class="no-data">您还没有历史记录</view>
		</view>
		<view v-else class="page">
			<view class="uni-product-list">
				<view class="uni-product" v-for="(product,index) in productList" :key="index">
					<view class="image-view">
						<image v-if="renderImage" class="uni-product-image" :src="product.image"></image>
					</view>
					<view class="uni-product-title">{{product.title}}</view>
					<view class="uni-product-price">
						<text class="uni-product-price-favour">￥{{product.originalPrice}}</text>
						<text class="uni-product-price-original">￥{{product.favourPrice}}</text>
						<text class="uni-product-tip">{{product.tip}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
		export default {
		components: {
			uniIcon
		},
		data() {
			return {
				productList: [],
				renderImage: false,
				historyList: [],
				isHistory: true,
				list: [],
				flng: true,
				timer: null
			}
		},
		onLoad() {
			// 本示例用的是高德 sdk ，请根据具体需求换成自己的服务器接口。
			this.amapPlugin = util.mapInit();
			this.historyList = uni.getStorageSync('search:history');
		},
		methods: {
			goback() {
				uni.navigateBack({
					delta: 1
				})
			},
			search() {
				uni.showToast({
					title: '搜索'
				})
			},
			/**
			 * 列表点击
			 */
			listTap(item) {
				item = JSON.parse(JSON.stringify(item));
				// 如果当前是历史搜索页面 ，那么点击不储存,直接 跳转
				if (this.history) {
					return;
				} else {
					this.isHistory = true;

					// 去做一些相关搜索功能 ，这里直接返回到上一个页面
					// 点击列表存储搜索数据
					util.setHistory(item);
					uni.navigateBack();
				}
			},
			/**
			 * 清理历史搜索数据
			 */
			clearSearch() {
				uni.showModal({
					title: '提示',
					content: '是否清理全部搜索历史？该操作不可逆。',
					success: res => {
						if (res.confirm) {
							this.historyList = util.removeHistory();
						}
					}
				});
			},
			/**
			 * 关键字搜索
			 * 调用高德地图关键字搜索api
			 */
			getInputtips(val) {
				let _this = this;
				this.amapPlugin.getInputtips({
					keywords: val,
					city: '北京',
					success: data => {
						let dataObj = data.tips;
						// 处理返回数据文字高亮
						dataObj.map(item => {
							return util.dataHandle(item, val);
						});
						//成功回调
						_this.historyList = dataObj;
					},
					fail: info => {
						//失败回调
						console.log(info);
					}
				});
			},
			loadData(action = 'add') {
				const data = [{
						image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product1.jpg',
						title: 'Apple iPhone X 256GB 深空灰色 移动联通电信4G手机',
						originalPrice: 9999,
						favourPrice: 8888,
						tip: '自营'
					},
					{
						image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product2.jpg',
						title: 'Apple iPad 平板电脑 2018年新款9.7英寸',
						originalPrice: 3499,
						favourPrice: 3399,
						tip: '优惠'
					},
					{
						image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product3.jpg',
						title: 'Apple MacBook Pro 13.3英寸笔记本电脑（2017款Core i5处理器/8GB内存/256GB硬盘 MupxT2CH/A）',
						originalPrice: 12999,
						favourPrice: 10688,
						tip: '秒杀'
					},
					{
						image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product4.jpg',
						title: 'Kindle Paperwhite电纸书阅读器 电子书墨水屏 6英寸wifi 黑色',
						originalPrice: 999,
						favourPrice: 958,
						tip: '秒杀'
					},
					{
						image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product5.jpg',
						title: '微软（Microsoft）新Surface Pro 二合一平板电脑笔记本 12.3英寸（i5 8G内存 256G存储）',
						originalPrice: 8888,
						favourPrice: 8288,
						tip: '优惠'
					},
					{
						image: 'https://img-cdn-qiniu.dcloud.net.cn/uploads/example/product6.jpg',
						title: 'Apple Watch Series 3智能手表（GPS款 42毫米 深空灰色铝金属表壳 黑色运动型表带 MQL12CH/A）',
						originalPrice: 2899,
						favourPrice: 2799,
						tip: '自营'
					}
				];

				if (action === 'refresh') {
					this.productList = [];
				}

				data.forEach(item => {
					this.productList.push(item);
				});
			}
		},
		onLoad() {
			setTimeout(() => {
				this.renderImage = true;
			}, 300);
		},
		onPullDownRefresh() {
			this.loadData('refresh');
			// 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		onReachBottom() {
			this.loadData();
		},
		/**
		 * 当 searchInput 输入时触发
		 */
		onNavigationBarSearchInputChanged(e) {
			let text = e.text;
			if (!text) {
				this.productList=[];
				this.isHistory = true;
				this.historyList = [];
				this.historyList = uni.getStorageSync('search:history');

				return;
			} else {
				this.isHistory = false;
				this.getInputtips(text);
			}
		},
		/**
		 * 点击软键盘搜索按键触发
		 */
		onNavigationBarSearchInputConfirmed(e) {
			let text = e.text;
			if (!text) {
				this.isHistory = true;
				this.historyList = [];
				this.historyList = uni.getStorageSync('search:history');
				return;
			} else {
				util.setHistory(text);
				// 				
				this.loadData();
			}
		},
		/**
		 *  点击导航栏 buttons 时触发
		 */
		onNavigationBarButtonTap() {
			uni.showModal({
				title: '提示',
				content: '点击确定，修改输入框的内容为abc',
				success: res => {
					if (res.confirm) {
						const currentWebview = this.$mp.page.$getAppWebview();
						currentWebview.setTitleNViewSearchInputText("abc");
					}
				}
			});
		}
	}
</script>

<style>
	.input-view {
		width: 100%;
		display: flex;
		background-color: #e7e7e7;
		height: 30px;
		border-radius: 15px;
		padding: 0;
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
		width: 100%;
		padding: 0;
	}

	.uni-navbar__header-btns {
		width: 20upx;
	}

	.history-title {
		display: flex;
		justify-content: space-between;
		padding: 20upx 30upx;
		padding-bottom: 0;
		font-size: 34upx;
		color: #333;
	}

	.history-title .uni-icon {
		font-size: 40upx;
	}

	.history-content {
		display: flex;
		flex-wrap: wrap;
		padding: 15upx;
	}

	.history-item {
		padding: 4upx 35upx;
		border: 1px #f1f1f1 solid;
		background: #fff;
		border-radius: 50upx;
		margin: 12upx 10upx;
		color: #999;
	}

	.history-list-box {
		/* margin: 10upx 0; */
	}

	.history-list-item {
		padding: 30upx 0;
		margin-left: 30upx;
		border-bottom: 1px #EEEEEE solid;
		font-size: 28upx;
	}

	.no-data {
		text-align: center;
		color: #999;
		margin: 100upx;
	}
</style>
