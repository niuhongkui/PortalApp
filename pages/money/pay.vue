<template>
    <view class="app">
        <view class="price-box">
            <text>支付金额</text>
            <view class="price">
                {{ money }}
                <text class="item-oriprice">(¥{{ money - -pmoney }})</text>
            </view>
        </view>

        <view class="pay-type-list">
            <view class="type-item b-b" @click="changePayType(2)">
                <text class="icon yticon icon-alipay"></text>
                <view class="con">
                    <text class="tit">支付宝支付</text>
                    <text>推荐使用支付宝支付</text>
                </view>
                <label class="radio"><radio value="" color="#fa436a" :checked="payType == 2"></radio></label>
            </view>
            <view class="type-item b-b" @click="changePayType(1)">
                <text class="icon yticon icon-weixinzhifu"></text>
                <view class="con">
                    <text class="tit">微信支付</text>
                    <text>推荐使用微信支付</text>
                </view>
                <label class="radio"><radio value="" color="#fa436a" :checked="payType == 1"></radio></label>
            </view>
        </view>

        <text class="mix-btn" @click="confirm">确认支付</text>
    </view>
</template>

<script>
export default {
    data() {
        return {
            payType: 2,
            orderInfo: {},
            orderNo: '',
            money: 0,
            type: ''
        };
    },
    computed: {},
    onLoad(options) {
        this.money = options.money;
        this.orderNo = options.orderno;
        this.pmoney = options.pmoney;
        this.type = options.type;
    },

    methods: {
        //选择支付方式
        changePayType(type) {
            this.payType = type;
        },
        //确认支付
        confirm: function() {
            var ths = this;
            let url='';
            if(ths.type==2){
                url='/api/Payment/Alipay/now';
            }else{
                url='/api/Payment/Wx/now';
            }
            
            ths.$api.ajax({
                url: url,
                method: 'POST',
                data: {
                    Type: ths.type,
                    OrderNo: ths.orderNo,
                    Money: ths.money,
                    PMoney: ths.pmoney
                },
                success: function(json) {
                    var data = json.data;
                    if (data.Success) {
                        uni.requestPayment({
                            provider: 'alipay',
                            orderInfo: data.Data,
                            success: function(res) {
                                uni.navigateTo({
                                    url: '/pages/money/paySuccess'
                                });
                            },
                            fail: function(err) {
                                console.log(JSON.stringify(err));
                                ths.$api.msg('支付失败');
                            }
                        });
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss">
.app {
    width: 100%;
}
.item-oriprice {
    color: #666;
    font-size: 28upx !important;
    text-decoration: line-through;
    -webkit-text-size-adjust: none;
}
.price-box {
    background-color: #fff;
    height: 265upx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 28upx;
    color: #909399;

    .price {
        font-size: 50upx;
        color: #303133;
        margin-top: 12upx;
        &:before {
            content: '￥';
            font-size: 40upx;
        }
    }
}

.pay-type-list {
    margin-top: 20upx;
    background-color: #fff;
    padding-left: 60upx;

    .type-item {
        height: 120upx;
        padding: 20upx 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 60upx;
        font-size: 30upx;
        position: relative;
    }

    .icon {
        width: 100upx;
        font-size: 52upx;
    }
    .icon-erjiye-yucunkuan {
        color: #fe8e2e;
    }
    .icon-weixinzhifu {
        color: #36cb59;
    }
    .icon-alipay {
        color: #01aaef;
    }
    .tit {
        font-size: $font-lg;
        color: $font-color-dark;
        margin-bottom: 4upx;
    }
    .con {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: $font-sm;
        color: $font-color-light;
    }
}
.mix-btn {
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
