<template>
  <div style="width: 100vw; height: 100vh;overflow: hidden;">
    <navbar title="门票详情"></navbar>
    <div class="order-detail" v-if="torder">
      <div class="order-status">
        <div style="display: flex; justify-content: space-between;align-items: center; height: 1.2rem; line-height: 1.2rem;">
          <div style="font-size: .5rem;font-weight: bold;">{{$UTIL.returnOrderStatus(torder.ddzt)}}</div>
          <div><span>￥</span><span style="font-size: .4rem;">{{torder.mont}}</span></div>
        </div>
        <div>订单号码: {{torder.orid}}</div>
      </div>
      <div class="order-header">
        <div class="header-title">{{torder.szscenicname}}</div>
        <div class="header-li"><span>游玩日期 </span>{{torder.dtstartdate}}-{{torder.dtenddate}}</div>
        <div class="header-li"><span>购票人员 </span>{{torder.ornm}}</div>
        <div class="header-li"><span>证件号码 </span>{{torder.orhm}}</div>
        <div class="header-li"><span>手机号码 </span>{{torder.orph}}</div>
      </div>
    </div>
    <div class="detail-items" v-if="torderlist">
      <scroll>
        <div class="item-order">
          <div class="title">订单明细</div>
          <div class="table">
            <div class="t-header">
              <div class="td1">票名</div>
              <div class="td2">票类</div>
              <div class="td3">数量</div>
              <div class="td4">单价</div>
            </div>
            <div class="t-body" v-for="(item,index) in torderlist" :key="index">
              <div class="td1">{{item.sztickettypename}}</div>
              <div class="td2">{{item.szcrowdkindname}}</div>
              <div class="td3">{{item.numb}}</div>
              <div class="td4">￥{{item.pric}}</div>
            </div>
            <div class="t-footer">
              <div class="td1">总计: <span class="td4">{{torder.mont}}元</span></div>
              <div class="td1" >已付金额: <span class="td4">{{torder.zfmont}}元</span></div>
            </div>
          </div>
        </div>
        <div class="item-order">
          <div class="title">门票信息</div>
          <div class="table-realname" v-for="(item, index) in torderlist" :key="index">
            <div class="title" style="padding: .2rem 0;display: flex; justify-content: space-between;">
              <div>{{item.sztickettypename}}</div>
              <div style="background-color: #5bb85d;color: #fff;">&nbsp;&nbsp;{{item.numb}}人&nbsp;&nbsp;</div>
            </div>
            <div class="realname-list" v-for="(obj, index) in item.realnames" :key="index">
              <div class="td1">
                <div style="color: #333333;">{{obj.szcrowdkindname}}</div>
                <div>{{obj.cname}}</div>
                <div>{{obj.idcard}}</div>
              </div>
              <div class="td3"  @click="setQRCode(obj.ticketNoBase64)">
                <div>二维码</div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <van-dialog v-model="showQRCode" :showConfirmButton=false closeOnClickOverlay>
      <div style="text-align: center;margin: .5rem 0;">
        <img width="200px" height="200px" :src="QRCode" />
      </div>
    </van-dialog>
  </div>
</template>
<script>
  import 'vant/lib/dialog/style';
  export default {
    data() {
      return {
        torder: null,
        torderlist: null,
        realnames: null,
        showQRCode: false,
        QRCode: '',
        params: {}
      };
    },
    mounted() {
      let url = window.location.href;
      if(url.indexOf('?') !== -1 && url.indexOf('&') !==-1) {
        let _arr = url.split('#')[1].split('?')[1].split('&')
        for(let i=0; i<_arr.length; i++) {
          this.params[_arr[i].split('=')[0]] = _arr[i].split('=')[1]
        }
        this.getOrderDetail()
      } else {
        alert('链接或者二维码已失效')
        this.$router.push('/error')
      }
    },
    methods: {
      setQRCode(str) {
        if(str) {
          this.QRCode = 'data:image/png;base64,'+str
          this.showQRCode = true
        } else {
          this.$notify('二维码有误，请联系管理员')
        }
      },
      async getOrderDetail() {
        this.data = null
        this.$store.commit('update', {'isLoading': true})
        let _data = await this.$get('/orderview.action', this.params)
        this.$store.commit('update', {'isLoading': false})
        if(_data.status) {
          this.torder = _data.data.torder
          this.realnames = _data.data.realnames
          this.torderlist = _data.data.torderlist.map(item => {
            item.realnames = []
            this.realnames.forEach(obj => {
              if(item.itickettypeid === obj.itickettypeid) {
                item.realnames.push(obj)
              }
            })
            return item
          })
        } else  {
          this.$notify('系统超时，请稍后再试')
          setTimeout(()=> this.$router.push('/error'), 2000)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .order-detail {
    width: 100%;
    height: 40%;
    font-size: .3rem;
    margin-top .85rem;
    overflow hidden;
    border-bottom .2rem solid #eeeeee;
    .order-status, .order-header {
      padding 0 .4rem;
    }
    .order-status {
      height: 60%;
      background-color #189bf3;
      color: #fff;
    }
    .order-header {
      height: 60%;
      margin-top -15%;
      background-color #ffffff;
      border-radius .3rem;
      .header-title {
        text-align center
        line-height .7rem;
        height: .7rem;
        font-size: .4rem;
        border-bottom 1px solid #dddddd;
      }
      .header-li {
        height: .6rem;
        line-height .6rem;
        color: #333333;
        span {
          color: #9a9a9a
        }
      }
    }
  }
  .detail-items {
    width: 100%;
    height: 50%
    overflow hidden
    .item-order {
      border-top .4rem solid #f7f7f7;
      .title {
        padding-left .4rem;
        height: .7rem;
        font-size: .36rem;
        line-height: .7rem;
        border-bottom 1px solid #eeeeee;
      }
      .table {
        padding .2rem;
        font-size: .32rem;
        line-height: .7rem;
        border-bottom .2rem solid #eeeeee;
        .td1 {
          flex 1
        }
        .td2, .td3 {
          width: 18%;
          font-size: .28rem;
        }
        .td4 {
          width: 15%;
          color: #f68020;
        }
        .t-header, .t-body, .t-footer {
          display flex
          justify-content space-between
        }
        .t-body {
          font-size .28rem;
          background-color #f5f5f5
        }
        .t-footer {
          font-size: .32rem;
        }
      }
      .table-realname {
        padding .2rem;
        font-size: .3rem;
        .title {
          height: .6rem;
          line-height .6rem;
        }
        .realname-list{
          display flex;
          justify-content space-between;
          padding .2rem;
          height: 1.5rem;
          border 1px solid #dddddd;
          border-radius .1rem;
          margin-bottom .2rem;
          .td1{
            width: 55%;
            div{
              line-height .5rem;
              height: .5rem;
              color: #999999;
            }

          }
          .td2,.td3 {
            width: 22.5%;
            text-align center;
            padding .5rem .1rem;
            color: #ffffff;
          }
          .td2 {
            border-right 1px dotted #dddddd;
            div{
              background-color #777777;
              border-radius .2rem;
              padding .05rem;
            }

          }
          .td3 {
            div{
              padding .05rem;
              background-color #5bc0de;
              border-radius .1rem;
            }
          }
        }
      }
    }
  }
</style>

