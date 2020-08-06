<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.IsDefault" class="tag">默认</text>
					<text class="address">{{item.Province +' '+item.City +' '+ item.County +' '+item.DetailAddr }} </text>
				</view>
				<view class="u-box">
					<text class="name">{{item.Addressee}}</text>
					<text class="mobile">{{item.Mobile}}</text>
				</view>
			</view>
            <text class="yticon icon-iconfontshanchu1" @click.stop="del(item.ID)"></text>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item.ID)"></text>
		</view>
		<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">			
		</text>		
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				source: 0,
                rows:15,
                page:1,
				addressList: [
				]
			}
		},
		onLoad(option){
			console.log(option.source);
			this.source = option.source;
		},
        onShow:function(){
            this.page=1;
            this.refreshList();
        },
		methods: {
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, id){
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&id=${id}`
				})
			},
            del(id){
				var ths=this;
                uni.showModal({
                    title: '提示',
                    content: '确认删除吗',
                    success: function (res) {
                        if (res.confirm) {
                            ths.$api.ajax({
                            	url: "/api/addr/Del/"+id,
                                method: 'POST',
                                data: {},
                            	success: function(json) {
                            		var json = json.data;
                                    ths.$api.msg(json.Msg);
                                    if(json.Success){
                                        ths.refreshList();
                                    }
                                }
                            });	 
                        } 
                    }
                });
               
            },
			//添加或修改成功之后回调
			refreshList(data, type){
				var ths=this;
				this.$api.ajax({
					url: "/api/addr/getlist/id",
				    method: 'POST',
				    data: {
				        rows:ths.rows,
				        page:ths.page,
				    },
					success: function(json) {
						var res = json.data;
				        ths.addressList =res.rows;                    
				        ths.page=res.PageIndex;
				    }
				});	
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 30upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
</style>
