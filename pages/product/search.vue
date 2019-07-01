<template>
	<view class="page">
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
			<view v-else class="history-box">
				<view v-if="historyList.length > 0" class="history-list-box">
					<view
						class="history-list-item"
						v-for="(item, index) in historyList"
						:key="index"
						@click="listTap(item)"
					>
						<rich-text :nodes="item.nameNodes"></rich-text>
					</view>
				</view>
				<view v-else class="no-data">没有搜索到相关内容</view>
			</view>
		</view>
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
	
	
</template>

<script>
	
	import uniIcon from '@/components/uni-icon/uni-icon.vue'

	export default {
		components: {
			uniIcon
		},
		data() {
			return {
				showSwiper: false,
				imgUrls: [
					'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg',
					'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg'
				],
				 title: 'product-list',
				productList: [],
				renderImage: false
			}
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
			loadData(action = 'add') {
			    const data = [
			        {
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
        this.loadData();
        setTimeout(()=> {
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
	.uni-navbar__header-btns{
		width: 20upx;
	}
</style>
