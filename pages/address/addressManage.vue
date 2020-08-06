<template>
    <view class="content">
        <view class="row b-b">
            <text class="tit">联系人</text>
            <input class="input" type="text" v-model="addressData.Addressee" placeholder="收货人姓名" placeholder-class="placeholder" />
        </view>
        <view class="row b-b">
            <text class="tit">手机号</text>
            <input class="input" type="number" v-model="addressData.Mobile" placeholder="收货人手机号码" placeholder-class="placeholder" />
        </view>
        <view class="row b-b">
            <text class="tit">地址</text>
            <text class="input">{{ addressData.Province + ' ' + addressData.City + ' ' + addressData.County }}</text>
            <text class="yticon icon-shouhuodizhi"></text>
        </view>
        <view class="row b-b">
            <text class="tit">门牌号</text>
            <input class="input" type="text" v-model="addressData.DetailAddr" placeholder="楼号、门牌" placeholder-class="placeholder" />
        </view>

        <view class="row default-row">
            <text class="tit">设为默认</text>
            <switch :checked="addressData.IsDefault" color="#fa436a" @change="switchChange" />
        </view>
        <button class="add-btn" @click="confirm">提交</button>
    </view>
</template>

<script>
export default {
    data() {
        return {
            addressData: {
                ID: '',
                Addressee: '',
                Mobile: '',
                Province: '河北省',
                City: '石家庄市',
                County: '长安区',
                DetailAddr: '',
                IsDefault: false
            },
            manageType: '',
            id: ''
        };
    },
    onLoad(option) {
        this.manageType = option.type;
        this.id = option.id;
    },
    onShow() {
        let title = '新增收货地址';
        if (this.manageType === 'edit') {
            title = '编辑收货地址';
        }
        uni.setNavigationBarTitle({
            title
        });
        this.getdata();
    },
    methods: {
        getdata() {
            var ths = this;
            this.$api.ajax({
                url: '/api/addr/GetDef/' + this.id,
                method: 'POST',
                success: function(json) {
                    var res = json.data;
                    res.Data.IsDefault = res.Data.IsDefault ? true : false;
                    ths.addressData = res.Data;
                }
            });
        },
        switchChange(e) {
            this.addressData.IsDefault = e.detail;
        },
        //地图选择地址
        chooseLocation() {
            uni.chooseLocation({
                success: data => {
                    this.addressData.addressName = data.name;
                    this.addressData.address = data.name;
                }
            });
        },
        //提交
        confirm() {
            var ths = this;
            let data = JSON.parse(JSON.stringify(this.addressData));
            if (!data.Addressee) {
                this.$api.msg('请填写收货人姓名');
                return;
            }
            if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.Mobile)) {
                this.$api.msg('请输入正确的手机号码');
                return;
            }
            if (!data.DetailAddr) {
                this.$api.msg('请填写具体门牌号信息');
                return;
            }
            data.IsDefault = data.IsDefault ? 1 : 0;
            this.$api.ajax({
                url: '/api/addr/save/' + this.manageType,
                method: 'POST',
                data: data,
                success: function(json) {
                    var res = json.data;
                    if (res.Success) {
                        ths.$api.msg(`地址${this.manageType == 'edit' ? '修改' : '添加'}成功`);
                        //this.$api.prePage().refreshList(data, this.manageType);
                        uni.navigateBack();
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss">
page {
    background: $page-color-base;
    padding-top: 16upx;
}

.row {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 30upx;
    height: 110upx;
    background: #fff;

    .tit {
        flex-shrink: 0;
        width: 120upx;
        font-size: 30upx;
        color: $font-color-dark;
    }
    .input {
        flex: 1;
        font-size: 30upx;
        color: $font-color-dark;
    }
    .icon-shouhuodizhi {
        font-size: 36upx;
        color: $font-color-light;
    }
}
.default-row {
    margin-top: 16upx;
    .tit {
        flex: 1;
    }
    switch {
        transform: translateX(16upx) scale(0.9);
    }
}
.add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 690upx;
    height: 80upx;
    margin: 60upx auto;
    font-size: $font-lg;
    color: #fff;
    background-color: $base-color;
    border-radius: 10upx;
    box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
