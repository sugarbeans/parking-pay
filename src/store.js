import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex);

const store =  new Vuex.Store({
  state: {
    isLoading: false,
    isWeixinBrower:false,
  },
  mutations: {
    /**
     * 这里设置一个统一的方法,大部分用的vuex都是简单的改变一些状态,不需要写过多的mutations
     * 使用方法 例:
     * this.$store.commit('update', para)
     *
     *  config需要传入对象
     * @param {*} state
     * @param {*Object} config
     */
    update(state, config) {
      Object.keys(config).map((item) => {
        state[item] = config[item];
      });
    },
    upyytpList(state,array){
      state.yytpList = [...array]
    }
  },
  actions: {},
  plugins: [createPersistedState()]
});

export default store
