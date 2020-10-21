<template>
  <div class="home">
    <div class="swiper-div">
      <van-swipe :show-indicators=false :autoplay="5000" style="border-radius: .2rem;">
        <van-swipe-item>
          <img src="./../assets/img/01.png" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="./../assets/img/02.png" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="./../assets/img/03.png" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="main">
      <div class="title dpf"><img src="./../assets/img/logo-bg.png" alt=""><div>停车缴费</div><div></div></div>
      <div class="card">
        <div class="card-title"><span style="color: #d80100;">*</span>车牌号码</div>
        <div class="card-numbers dpf">
          <div class="number dpf" @click="handleChange">{{str0}}</div>
          <div class="number dpf" @click="handleChange">{{str1}}</div>
          <span style="font-size: .5rem;font-weight: 700;">·</span>
          <div class="number dpf" @click="handleChange">{{str2}}</div>
          <div class="number dpf" @click="handleChange">{{str3}}</div>
          <div class="number dpf" @click="handleChange">{{str4}}</div>
          <div class="number dpf" @click="handleChange">{{str5}}</div>
          <div class="number dpf" @click="handleChange">{{str6}}</div>
          <div class="number dpf" @click="handleChange" v-if="str7">{{str7}}</div>
          <div class="number number-last" @click="handleChange" v-else><span style="color: #009664; font-size: .5rem;line-height: .6rem;">+</span><br>新能源</div>
        </div>
      </div>
      <div class="btn" @click="searchDetail">查询</div>
      <div class="card" v-if="detail">
        <div class="card-title">车牌号码<span style="color: #009664; margin-left: .3rem;">{{str}}</span></div>
        <div class="card-title">订单号码<span style="color: #009664; margin-left: .3rem;">{{detail.orderNo}}</span></div>
        <div class="card-title">驶入时间<span style="color: #009664; margin-left: .3rem;">{{detail.enterTime}}</span></div>
      </div>
      <div>
      </div>
    </div>
    <keyword :isShow="keyState" @exit="exit" @inputchange="inputchange" :oinp="str" @ok="confirm" :type="type"/>
    <div class="footer-other" v-if="detail && totalAmount !== '0.00'"><span><span>金额：</span><b>{{detail.totalAmount}}</b></span>
      <div class="toOrder" @click="handleValidate">确定支付</div>
    </div>
  </div>
</template>

<script>
  import keyword from './keyword'
  export default {
    name: "home",
    components:{
      keyword
    },
    data() {
      return {
        keyState:false,
        str:"京",
        str0: '京',
        str1: '',
        str2: '',
        str3: '',
        str4: '',
        str5: '',
        str6: '',
        str7: '',
        index: 0,
        type: "",
        detail: null,
        payData: null,
        requestid: 2,
        code: '',
        totalAmount: '0.00'
      }
    },
    mounted() {
      this.getCode()
      this.$store.commit('update', {'isLoading': false})
    },
    methods: {
      async searchDetail() {
        if(this.str.length >= 7) {
          this.$store.commit('update', {'isLoading': true})
          let data = await this.$post('/parking/GetCarNoOrderFee', {carNo: this.str})
          this.detail = null
          this.totalAmount = '0.00'
          if (data.code === '200') {
            this.$store.commit('update', {'isLoading': false})
            this.detail = {
              orderNo: data.orderNo,
              totalAmount: data.totalAmount,
              enterTime: data.enterTime
            }
            this.totalAmount = this.detail.totalAmount
          } else {
            this.$store.commit('update', {'isLoading': false})
            // this.detail = {
            //   orderNo: '202010150000002453',
            //   totalAmount: '24.00',
            //   enterTime: '2020-10-15 08:24'
            // }

            this.$toast(data.message);
          }
        } else {
          this.$toast("车牌号码输入有误！");
        }

      },
      handleChange() {
        this.keyState = true
      },
      getCode() {
        if(this.$globalVariable.isWx && this.requestid===2) {
          this.code = this.$globalVariable.getUrlParam('code')
          let _local = encodeURIComponent(window.location.href)
          if (this.code == null || this.code === '' ) {
            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.$globalVariable.appId}&redirect_uri=${_local}&response_type=code&scope=snsapi_base&state=1#wechat_redirect`
          }
        }
      },
      handleValidate() {
        this.$dialog.confirm({
          message: `车牌号码： ${this.str}\n支付金额： ${this.detail.totalAmount}`,
          closeOnClickOverlay: true,
          showCancelButton: true
        }).then(()=> {
          this.toPay()
        }).catch(() => {
          this.$dialog.close
        });
      },
      async toPay() {
        this.$store.commit('update', {'isLoading': true})
        let _data = null
        if(this.requestid===2) {
          if(this.code == null || this.code === '' ) {
            this.code = this.$globalVariable.getUrlParam('code')
          }
          _data = await this.$post('/parking/OrderPayCreate', {usid: this.code, orderNo: this.detail.orderNo, orderAmount: this.detail.totalAmount, carNo: this.str})
        } else {
          _data = await this.$post('/wx/wxpay', {orderNo: this.detail.orderNo})
        }
        if(_data.code==='200') {
          this.payData = JSON.parse(_data.result)
          if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
              document.addEventListener('WeixinJSBridgeReady',this.onBridgeReady, false);
            }else if (document.attachEvent){
              document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
              document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
            }
          }else{
            this.onBridgeReady();
          }
        } else {
          this.$toast(_data.message)
        }
        this.$store.commit('update', {'isLoading': false})
      },
      exit(){
        this.keyState = false
      },
      inputchange(val){
        if (this.str.length >= 8 && val!=="delete") {
          return false
        }
        if(val === 'delete'){
          this.str = this.str.slice(this.index, this.str.length-1)
        }else{
          this.str+=val === 'O' ? '0' : val
        }
      },
      confirm(){
        for(let i =0; i< 8; i++) {
          this[`str${i}`] = ''
        }
        this.keyState = false
        if(this.str.length>0) {
          for(let i =0; i< this.str.length; i++) {
            this[`str${i}`] = this.str[i]
          }
        }
      },
      onBridgeReady(){
        this.$toast(this.payData.appId)
        this.$toast('唤起支付中，请稍后')
        window.WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": this.payData.appId,     //公众号名称，由商户传入
            "timeStamp": this.payData.timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr": this.payData.nonceStr, //随机串
            "package": this.payData.package,
            "signType": this.payData.signType,         //微信签名方式：
            "paySign": this.payData.paySign //微信签名
          },
          function(res){
            if(res.err_msg == "get_brand_wcpay_request:ok" ){
              alert('支付成功')
            } else {
              alert('支付失败, 请稍后重试！')
            }
          });
      }
    }
  }
</script>

<style scoped lang="stylus">
  .home{
    width: 100vw;
    height: 100vh;
    background-image: url("./../assets/img/bg.jpg");
    background-size: cover;
  }
  .swiper-div {
    width: 96%;
    height: 30%;
    margin 0 auto;
    border-radius .1rem;
  }
  img {
    width: 100%;
    height: 30vh;
  }
  .main {
    width: 96%;
    border-radius .2rem;
    margin .4rem auto;
    padding-bottom: .3rem;
    background-color #fff;
    .title {
      height: 1.2rem;
      font-size .4rem;
      color: #d80100;
      border-radius .2rem;
      justify-content space-around
      img {
        width: auto;
        height: 1rem;
      }
      div {
        width: 25%;
        font-weight 600;
      }
    }
    .card {
      margin .2rem auto;
      background-color #f6f6f6;
      width: 96%;
      height: 2rem;
      border-radius .2rem;
      .card-title {
        margin-left .2rem;
        height: .7rem;
        line-height .6rem;
        font-size .3rem;
      }
      .card-numbers {
        height: 1.3rem;
        width: 100%;
        justify-content space-around;
        .number {
          height: .9rem;
          width: 10%;
          font-size: .4rem;
          font-weight 600;
          color: #666666;
          background-color #fff;
        }
        .number-last{
          text-align center;
          font-size: .1rem;
          color: #666666;
          background-color rgba(0,150, 100, .2);
        }
      }
    }
  }
  .btn {
      text-align: center;
      font-size: .3rem;
      margin: 0 auto;
      width: 3rem;
      height: .72rem;
      line-height: .72rem;
      margin-top: .4rem;
      color: #fff;
      border-radius: .08rem;
      letter-spacing .05rem;
      background-color #009664
    }
  .footer-other {
    position: fixed;
    width: 100vw;
    bottom: 0;
    height: .98rem;
    line-height: .98rem;
    background-color: #6eb9a0;
    color: #fff;
    font-size: .36rem;
    span{
      padding-left: .24rem;
      font-size: .26rem;
      b {
        font-size: .4rem;
        font-weight: 700
      }
    }
    .toOrder {
      width: 2.5rem;
      height: 100%;
      text-align: center;
      background-color: #d80100;
      float: right
    }
  }
  .dpf {
    display flex;
    justify-content center;
    align-items center;
  }
</style>
