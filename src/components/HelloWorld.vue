<template>
  <div class="home" >
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
    <div class="main" v-if="type === '2'">
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
<!--      <div class="btn" @click="toPay">支付</div>-->
      <div class="card" v-if="detail">
        <div class="card-title">车牌号码<span style="color: #009664; margin-left: .3rem;">{{str}}</span></div>
        <div class="card-title">订单号码<span style="color: #009664; margin-left: .3rem;">{{detail.orderNo}}</span></div>
        <div class="card-title">驶入时间<span style="color: #009664; margin-left: .3rem;">{{detail.enterTime}}</span></div>
      </div>
      <div>
      </div>
    </div>
    <div class="main" v-else-if="type === '1'">
      <div class="title dpf"><img src="./../assets/img/logo-bg.png" alt=""><div>停车缴费</div><div></div></div>
      <div class="card" v-if="detail">
        <div class="card-title">入口车道<span style="color: #009664; margin-left: .3rem;">{{detail.enterGateName}}</span></div>
        <div class="card-title">订单号码<span style="color: #009664; margin-left: .3rem;">{{detail.orderNo}}</span></div>
        <div class="card-title">驶入时间<span style="color: #009664; margin-left: .3rem;">{{detail.enterTime}}</span></div>
      </div>
      <div>
      </div>
    </div>
    <div v-else class="main">
      <img style="margn-top: .2rem;" src="./../assets/img/success.png" alt="" v-if=status>
      <span v-else style='margin-left: .3rem; font-size: .3rem;line-height: .5rem;'>{{message}}</span>
    </div>
    <keyword :isShow="keyState" @exit="exit" @inputchange="inputchange" :oinp="str" @ok="confirm" :type="type"/>
    <div class="footer-other" v-if="detail && totalAmount !== '0.00'"><span><span>金额：</span><b>{{detail.totalAmount}}</b></span>
      <div class="toOrder" @click="handleValidate">确定支付</div>
    </div>
    <div class="footer-other" v-if="type==='1' && totalAmount === '0.00'">
      <div class="toOrder" @click="toPay">确定出场</div>
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
        str:"",
        str0: '',
        str1: '',
        str2: '',
        str3: '',
        str4: '',
        str5: '',
        str6: '',
        str7: '',
        index: 0,
        detail: null,
        payData: null,
        requestid: 2,
        code: '',
        totalAmount: '0.00',
        params: {},
        type: '2',
        status: false,
        message: '系统异常，请重新扫码！',
        usid: '',
        pmcd: '',
        payMode: '',
        timer: null
      }
    },
    destroyed() {
      clearTimeout(this.timer)
    },
    mounted() {
      this.$store.commit('update', {'isLoading': false})
      this.params = {}
      // 物料二维码必须包含type和pmcd
      let url = window.location.href;
      if(url.indexOf('?') !== -1 && url.indexOf('&') !==-1) {
        let _arr = url.split('#')[1].split('?')[1].split('&')
        for(let i=0; i<_arr.length; i++) {
          this.params[_arr[i].split('=')[0]] = _arr[i].split('=')[1]
        }
        this.type = this.params.type ? this.params.type : '2'
        this.pmcd = this.params.pmcd ? this.params.pmcd : '01'
        this.$store.commit('update', {'paramsStr': JSON.stringify(this.params)})
        this.getCode()
      } else {
        alert('二维码已失效')
        this.$router.push('/error')
      }

    },
    methods: {
      async doSomething() {
        this.params = JSON.parse(this.$store.state.paramsStr)
        this.payMode = this.$globalVariable.payMode
        let params = this.params
        // 无牌车，入场type=0, 出场type=1
        this.$store.commit('update', {'isLoading': true})
        let _data = null
        if(this.code == null || this.code === '' ) {
          if(this.$globalVariable.isWx) {
            this.code = this.$globalVariable.getUrlParam('code')
          } else if(this.$globalVariable.isAli) {
            let url = decodeURI(location.href)
            let theRequest = {}
            if (url.indexOf('?') !== -1) {
              let str = url.substr(1);
              let strs = str.split('&');
              for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1]);
              }
            }
            this.code = theRequest.auth_code
            alert(this.code)
          } else {
            alert('请选择支付宝或者微信扫码！')
          }
        }
        if(this.type==='0') {
          _data = await this.$post('/parking/UnVehicleEnter', {ctrlNo: params.No, code: this.code, pmcd: this.pmcd, payMode: this.payMode})
          if(_data.code === '200') {
            this.status = true
          }else {
            this.message = _data.message
            this.status = false
          }
        }else if(this.type==='1') {
          _data = await this.$post('/parking/GetVehicleCarInfo', {ctrlNo: params.No, code: this.code, pmcd: this.pmcd, payMode: this.payMode})
          this.initData(_data)
        }
        this.$store.commit('update', {'isLoading': false})
      },
      async searchDetail() {
        if(this.str.length >= 7) {
          this.$store.commit('update', {'isLoading': true})
          let _data = await this.$post('/parking/GetCarNoOrderFee', {carNo: this.str, pmcd: this.pmcd})
          this.type = '2'
          this.initData(_data)
        } else {
          this.$toast("车牌号码输入有误！");
        }
      },
      initData(data) {
        this.detail = null
          this.totalAmount = '0.00'
          if (data.code === '200') {
            this.$store.commit('update', {'isLoading': false})
            this.detail = {
              orderNo: data.orderNo,
              totalAmount: data.totalAmount,
              enterTime: data.enterTime
            }
            data.enterGateName && (this.detail.enterGateName = data.enterGateName)
            data.usid && (this.usid = data.usid)
            this.totalAmount = this.detail.totalAmount
            this.toPay()
          } else {
            this.$store.commit('update', {'isLoading': false})
            // this.detail = {
            //   orderNo: '202010150000002453',
            //   totalAmount: '24.00',
            //   enterTime: '2020-10-15 08:24'
            // }
            // this.totalAmount = this.detail.totalAmount
            this.$toast(data.message);
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
        if(this.$globalVariable.isAli && this.requestid===2) {
          this.code = null
          let _url = window.location.href
          // let _local = encodeURIComponent(_url.split('?')[0])
          let _local = _url
          if (this.code == null || this.code === '' ) {
            window.location.href = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${this.$globalVariable.appId}&scope=auth_base&redirect_uri=${_local}`
          }
         // window.ap.getAuthCode({
         //   appId: this.$globalVariable.appId
         // }, res => {
         //   let _obj = JSON.stringify(res)
         //   alert(_obj)
         // })
        }
        this.code && this.doSomething()
      },
      handleValidate() {
        // let _msg = `支付金额： ${this.detail.totalAmount}`
        // this.type === '2' && (_msg = `车牌号码： ${this.str}\n` + _msg)
        // this.$dialog.confirm({
        //   message: _msg,
        //   closeOnClickOverlay: true,
        //   showCancelButton: true
        // }).then(()=> {
        //   this.toPay()
        // }).catch(() => {
        //   this.$dialog.close
        // });
        this.toPay()
      },
      async toPay() {
        if(this.type === '2' && this.str.length < 7) {
          this.$toast("车牌号码输入有误！");
          return
        }
        this.$store.commit('update', {'isLoading': true})
        let _data = null
        if(this.requestid===2) {
          if(this.$globalVariable.isWx) {
            let _params = {
              orderNo: this.detail.orderNo,
              orderAmount: this.detail.totalAmount,
              carNo: this.str,
              pmcd: this.pmcd,
              payMode: this.payMode
            }
            if(this.type === '2') {
              _params.carNo = this.str
              _params.payScene = 1
              _params.usid = this.code
            } else {
              _params.ctrlNo = this.params.No
              _params.payScene = 2
              _params.usid = this.usid
            }
            _data = await this.$post('/parking/OrderPayCreate', _params)
          }else if(this.$globalVariable.isAli) {
            alert(this.code+ 'alipay')
            _data = {
              code: '500',
              message: this.code
            }
          }
        } else {
          _data = await this.$post('/ali/alipay', {orderNo: this.detail.orderNo})
        }
        if(_data.code==='200') {
          if(this.totalAmount !== '0.00') {
            this.payData = JSON.parse(_data.result)
            if(this.$globalVariable.isWx) {
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
            } else if(this.$globalVariable.isAli) {
              if(window.AlipayJSBridge) {
                this.aliPay()
              } else {
                document.addEventListener('AlipayJSBridgeReady',this.aliPay, false);
              }
            } else {
              alert('目前仅支持支付宝或微信支付')
            }

          } else {
            this.$router.push('/open')
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
        if(this.str.length >=7) {
          this.searchDetail()
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
              this.$router.push('/payError')
            }
          });
      },
      aliPay() {
        this.$toast('唤起支付宝支付中，请稍后')
        window.AlipayJSBridge.call("tradePay",
          {tradeNO: this.payData.prepayId},
          function(res){
            if(res.resultCode === "9000" ){
              alert('支付成功')
            } else {
              alert(res.resultCode +',支付失败, 请稍后重试！')
              this.$router.push('/payError')
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
      background-color #d80100
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
