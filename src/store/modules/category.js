import { Message } from "@/plugins/elements"

import * as API from "@/api"
export default {
  namespaced: true,
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: "",
    },
    category1List: [],
    category2List: [],
    category3List: [],
  },
  actions: {
    //获取一级分类列表数据
    async getCategory1List ( { commit } ) {
      const result = await API.attrlist.getCategory1();
      if ( result.code === 200 ) {
        // this.$message.success("获取商品列表成功");
        // console.log(result);
        // this.category1List = result.data;
        commit( "GET_CATEGORY1_LIST", result.data )
      } else {
        Message.error( result.message );
      }
    },
    async getCategory2List ( { commit }, category1Id ) {
      // this.category2List = [];
      // this.category3List = [];
      // this.category.category2Id = "";
      // this.category.category3Id = "";
      const result = await API.attrlist.getCategory2( category1Id );
      // console.log(result);
      if ( result.code === 200 ) {
        // this.$message.success("获取商品列表成功");
        // this.category2List = result.data;
        commit( "GET_CATEGORY2_LIST_SUCCESS",
          {
            category1Id,
            category2List: result.data
          } )
      } else {
        commit( "GET_CATEGORY2_LIST_ERROR", category1Id )
        Message.error( result.message );
      }
      //清空父组件的数据。
      // this.$bus.$emit( "clearList" );
    },
    async getCategory3List ( { commit }, category2Id ) {
      // this.category3List = [];
      // this.category.category3Id = "";
      const result = await API.attrlist.getCategory3( category2Id );
      // console.log(result);
      if ( result.code === 200 ) {
        // this.$message.success("获取商品列表成功");
        // this.category3List = result.data;
        commit( "GET_CATEGORY3_LIST_SUCCESS", {
          category2Id,
          category3List: result.data
        } )
      } else {
        commit( "GET_CATEGORY3_LIST_ERROR", category2Id )
        this.$message.error( result.message );
      }
      //清空父组件数据
      // this.$bus.$emit( "clearList" );
    },
  },
  mutations: {
    //获取一级分类列表，此时还没有一级分类
    GET_CATEGORY1_LIST ( state, category1List ) {
      state.category1List = category1List
    },
    //获取二级分类列表，此时已经有了一级分类，点击重新改动一级需要清空二级、三级分类
    GET_CATEGORY2_LIST_SUCCESS ( state, { category2List, category1Id } ) {
      state.category2List = category2List
      state.category3List = [];
      state.category.category1Id = category1Id;
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY2_LIST_ERROR ( state, category1Id ) {
      state.category2List = [];
      state.category3List = [];
      state.category.category1Id = category1Id;
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    //获取三级分类列表，此时已经有了二级分类，点击重新改动二级需要清空三级分类
    GET_CATEGORY3_LIST_SUCCESS ( state, { category3List, category2Id } ) {
      // state.category2List = category2List
      state.category3List = category3List;
      state.category.category2Id = category2Id;
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_ERROR ( state, category2Id ) {
      // state.category2List = [];
      state.category3List = [];
      state.category.category2Id = category2Id;
      // state.category2Id = "";
      state.category.category3Id = "";
    },
    SET_CATEGORY3_ID ( state, category3Id ) {
      state.category.category3Id = category3Id
    }
  },
  getters: {}
}
