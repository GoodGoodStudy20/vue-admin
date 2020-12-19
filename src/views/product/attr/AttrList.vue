<template>
  <div>
    <el-card class="box-card">
      <el-form inline class="demo-form-inline" :model="category">
        <el-form-item label="一级分类">
          <el-select
            placeholder="请选择"
            @change="handeChange1"
            v-model="category.category1Id"
            :disabled="disabled"
          >
            <el-option
              :label="category1.name"
              :value="category1.id"
              v-for="category1 in category1List"
              :key="category1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            placeholder="请选择"
            @change="handeChange2"
            v-model="category.category2Id"
            :disabled="disabled"
          >
            <el-option
              :label="category2.name"
              :value="category2.id"
              v-for="category2 in category2List"
              :key="category2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            placeholder="请选择"
            @change="handeChange3"
            v-model="category.category3Id"
            :disabled="disabled"
          >
            <el-option
              :label="category3.name"
              :value="category3.id"
              v-for="category3 in category3List"
              :key="category3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "AttrList",
  props: ["disabled"],
  data() {
    return {
      // category1List: [],
      // category2List: [],
      // category3List: [],
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  computed: {
    ...mapState({
      category1List: (state) => state.category.category1List,
      category2List: (state) => state.category.category2List,
      category3List: (state) => state.category.category3List,
    }),
  },
  methods: {
    ...mapActions([
      "category/getCategory1List",
      "category/getCategory2List",
      "category/getCategory3List",
    ]),
    // clearList() {
    //   this.spuList = [];
    //   this.total = 0;
    //   this.page = 1;
    //   this.limit = 3;
    //   this.category.category3Id = "";
    // },
    ...mapMutations(["category/SET_CATEGORY3_ID"]),
    async handeChange1(category1Id) {
      /* // console.log(result);
      if (result.code === 200) {
        // this.$message.success("获取商品列表成功");
        this.category2List = result.data;
      } else {
        this.$message.error("获取商品列表失败");
      } */
      this.category.category2Id = "";
      this.category.category3Id = "";
      this["category/getCategory2List"](category1Id);
      //清空父组件的数据。
      // this.$bus.$emit("clearList");
    },
    async handeChange2(category2Id) {
      /* this.category3List = [];
      this.category.category3Id = "";
      const result = await this.$API.attrlist.getCategory3(category2Id);
      // console.log(result);
      if (result.code === 200) {
        // this.$message.success("获取商品列表成功");
        this.category3List = result.data;
      } else {
        this.$message.error("获取商品列表失败");
      } */
      this.category.category3Id = "";
      this["category/getCategory3List"](category2Id);
      //清空父组件数据
      // this.$bus.$emit("clearList");
    },
    async handeChange3(category3Id) {
      /* const category = {
        ...this.category,
        category3Id,
      };
      this.$bus.$emit("change", category); */
      this["category/SET_CATEGORY3_ID"](category3Id);
    },
  },
  async mounted() {
    this["category/getCategory1List"]();
  },
};
</script>

<style lang="less" scoped>
</style>
