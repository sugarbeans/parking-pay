<template>
  <div v-if="Md5OrderId">
    <!--    <mp-toptips msg="{{errorMsg}}" type="error" show="{{showError}}"></mp-toptips>-->
    <div class="swiper topMargin">
        <div class="logo-box">
          <img class="logo-image" src="./../assets/img/logo-bg.png">
        </div>
        <div class="logo-info">
          <div class="logo-info-a">智慧旅游 随心而行</div>
        </div>
        <div class="home-title" @click="showPicker=true">旅游卡激活</div>
        <div class="main">
          <div class="item"><span class="label">订单号： </span><span>{{activate.orderNo}}</span></div>
          <div class="item"><span class="label">游客姓名： </span><span>{{activate.name}}</span></div>
          <div class="item"><span class="label">手机号： </span><span>{{activate.mobile}}</span></div>
          <div class="item"><span class="label">证件号码： </span><span>{{activate.cardNo}}</span></div>
          <div class="item" style="border-top: 1px solid #cccccc;"><span class="label">产品名称： </span><span>{{product}}</span></div>
          <div class="item" style="border-bottom: 1px solid #cccccc;" @click="showPicker=true"><span class="label">产品类型： </span>
            <input type="text" v-model="productType" readonly style="border: none;" placeholder="点击--选择(必选)">
          </div>
          <div class="btn" @click="submit">激  活</div>
        </div>
      <div class="home-copy revealBottom">
        <p>Copyright(C) 2004－2020 ectrip.com All Rights Reserved.</p>
        <p>
          技术支持 ©️
          <a href="//m.ectrip.com">鼎游信息</a>
        </p>
      </div>
    </div>
    <van-popup :style="{ height: '37%' }" v-model="showPicker" :overlay=false round position="bottom">
      <van-picker visible-item-count="5" show-toolbar  :columns="goodsType" @cancel="showPicker = false" @confirm="handleChangeGoodsType"
      />
    </van-popup>
  </div>
</template>
<script>
  import 'vant/lib/dialog/style';
  export default {
    data() {
      return {
        goodsType: [],
        activate: {},
        product: '',
        params: {},
        showPicker: false,
        productType: '',
        type: '',
        Md5OrderId: ''
      };
    },
    mounted() {
      let url = window.location.href;
      if(url.indexOf('?') !== -1) {
        let _arr = url.split('#')[1].split('?')[1].split('&')
        for(let i=0; i<_arr.length; i++) {
          this.params[_arr[i].split('=')[0]] = _arr[i].split('=')[1]
        }
        this.getOrderDetail()
      } else {
        alert('链接或者二维码已失效')
      }
    },
    methods: {
      async getOrderDetail() {
        this.$store.commit('update', {'isLoading': true})
        let _data = await this.$get('/activate/show.do', {orderid: this.params.orderId})
        this.$store.commit('update', {'isLoading': false})
        if(_data.success) {
          this.activate = _data.data.activate
          this.Md5OrderId = this.params.orderId
          this.product = _data.data.product
          this.initGoodsType(_data.data.goodsType)
        } else  {
          this.$toast(`${_data.info},如有疑问请联系工作人员`)
        }
      },
      handleChangeGoodsType(obj) {
        this.productType = obj.text
        this.type = obj.gLG_TYPE
        this.showPicker = false
      },
      initGoodsType(list) {
        this.goodsType = []
        list.forEach(item => {
          item.text = item.gLG_NAME
          this.goodsType.push(item)
        })
      },

      async handleActive() {
        this.$store.commit('update', {'isLoading': true})
        let _params = {
          orderId: this.Md5OrderId,
          goodtype: this.type,
          ...this.activate
        }
        let _data = await this.$post('/activate/comsume.do', _params)
        this.$store.commit('update', {'isLoading': false})
        if(_data.success) {
          this.$toast('激活成功')
          setTimeout(()=> this.$router.push('/error'), 4000)
        }else {
          this.$toast(`${_data.info},请稍后再试，或者联系工作人员`)
        }
      },
      submit() {
        if(this.productType) {
          this.$dialog.alert({message: `确认激活--${this.productType}?\n一旦激活，无法更改`, closeOnClickOverlay: true}).then(()=> {
            this.handleActive()
          }).catch(() => {
            this.$dialog.close
          });
        }else {
          this.$toast.fail('请选择一种产品类型')
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .swiper{
    width: 100%;
    height: 100vh;
    background-image: url("./../assets/img/bg.jpg")
    background-size 100% 100%;
  }
  .logo-box{
    width: 170px;
    height: .8rem;
    position: relative;
  }
  .logo-box img{
    width: 100%;
    height: 100%;
  }
  .logo-text{
    width: 70px;
    height: 70px;
    text-align: center;
    line-height: 70px;
    position: absolute;
    top: 0;
    left: 0;
    color: #ffffff;
    font-weight: bold;
    font-size: 20px;
  }
  .logo-info{
    width: 300px;
    height: 40px;
    position: absolute;
    top: 1rem;
    left: 16%;
  }
  .logo-info-a{
    font-size: 20px;
    color: #0066cc;
    font-weight: bold;
  }
  .home-copy {
    position: absolute;
    left: 0;
    bottom: .2rem;
    color: #9ca5a9;
    text-align: center;
    width: 100%;
    font-size: 0.24rem;
  }

  .home-copy a {
    color: #9ca5a9;
  }

  .home-title {
    width: 100%;
    color: #999999;
    font-weight: 600;
    font-style: normal;
    padding-top: 1rem;
    font-size: .4rem;
    text-align center;
  }
  .main {
    margin .4rem auto;
    width: 90%;
    padding .1rem;
    font-size: .32rem;
    line-height : .8rem;
    background-color #fcfcfc;
    border-radius .3rem;
  }
  .label {
    color: #666666;
    font-size: .28rem;
  }

  .btn {
    width: 60%;
    margin:.3rem auto;
    text-align: center;
    background-color: rgba(51, 153, 255, 1);
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    letter-spacing: 0.01rem;
  }
  .van-picker {
    font-size: .32rem;
  }
    .van-popup .van-popup--top .van-notify {
      color: #ad0000;
      background #ffelel
    }
</style>

