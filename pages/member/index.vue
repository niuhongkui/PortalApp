<template>
    <view class="container">
        <view class="vip-card-box">
        	<view class="tit">
        		<text class="yticon icon-iLinkapp-"></text>
        		{{userInfo.IsMember>0 ?'会员':'非会员'}}
        	</view>
            <view class="youhui">
                <text>优惠一、每天免费打印</text><br/>
                <text style="line-height: 60upx;">优惠二、购物价格直降</text>
            </view>
            <view class="other">
                 <text>会员剩余{{userInfo.IsMember}}天</text>
            </view>
        </view>
        <view class="good">
            <view @click="selected(n.ID)" :key="i" :class="{'text':true,'active':n.OptionValue3}" v-for="(n,i) in list">
                <text class="row">{{n.OptionValue1}}</text>
                <text class="row">￥{{n.OptionValue2}}</text>
            </view>
        </view>
        <button class="memberbtn" @click="topay" >去 付 款</button>
    </view>
</template>


<script>
	import listCell from '@/components/mix-list-cell';
	var config = require('../../common/config.js');
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			listCell
		},
		data() {
			return {
				config: config,
                list:[]
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
        onLoad() {
            this.init();
        },
		methods: {
            init(){
                let ths=this;
                ths.$api.ajax({
                    url: "/api/SysOpt/GetMember/state",
                    data:{},
                    success:function(json){
                        let res=json.data;
                        ths.list=res.Data;
                        ths.list[0].OptionValue3=1;
                    }
                })
            },
            selected(id){
                for(let i=0;i<this.list.length;i++ ){
                    if(this.list[i].ID==id)
                        this.list[i].OptionValue3=1;
                    else
                        this.list[i].OptionValue3='';
                }
            },
            topay(){
				var selData=this.list.filter(n=>n.OptionValue3==1);
				if(selData.length==0)
				{
					this.$api.msg("请选择购买会员类型");
					return;
				}
				selData=selData[0];
				uni.redirectTo({
				    url: '/pages/money/pay?orderno=' + selData.ID + '&money=' + selData.OptionValue2+ '&pmoney=0&type=vip'
				});
            }
		}
	}
</script>


<style lang='scss'>
    .container{
        width: 100%;
    }
    .vip-card-box {
    	display: flex;
    	flex-direction: column;
    	color: #f7d680;
    	height: 340upx;
    	background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
        border-radius: 16upx ;
        overflow: hidden;
        position: relative;
        padding: 20upx 24upx;
        margin: 24upx;
        
        .tit {
        	font-size: $font-base+2upx;
        	color: #f7d680;
        	margin-bottom: 28upx;
        
        	.yticon {
        		color: #f6e5a3;
        		margin-right: 16upx;
        	}
        }
    }
    .vip-card-box .youhui{
      font-size: 25upx !important;
      margin: 50upx 0 0 50upx;
      height: 200upx;
    }
    .vip-card-box .other{
        font-size: 25upx !important;
        text-align: right;
    }
    .good{
        margin: 24upx;
        display: flex;
        flex-direction: row;
        justify-content:space-around;
    }
    .good .text{
        width:150upx ;
        height: 150upx;        
        border-radius: 16upx ;
        border: 1upx solid #ececec;
        font-size: 25upx;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content:center;
    }
    .good .text .row{
        width: 100%;
        line-height: 50upx;
    }
    .good .active{        
        background-color: #ececec;
    }
    .memberbtn{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 630upx;
        height: 80upx;
        margin: 80upx auto 30upx;
        font-size: $font-lg;
        color: #fff;
        background-color: $base-color;
        border-radius: 10upx;
        box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
    }
    
</style>
