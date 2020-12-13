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
export default {
  name: "AttrList",
  props: ["disabled"],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    async handeChange1(category1Id) {
      this.category2List = [];
      this.category3List = [];
      this.category.category2Id = "";
      this.category.category3Id = "";
      const result = await this.$API.attrlist.getCategory2(category1Id);
      // console.log(result);
      if (result.code === 200) {
        // this.$message.success("获取商品列表成功");
        this.category2List = result.data;
      } else {
        this.$message.error("获取商品列表失败");
      }
    },
    async handeChange2(category2Id) {
      this.category3List = [];
      this.category.category3Id = "";
      const result = await this.$API.attrlist.getCategory3(category2Id);
      console.log(result);
      if (result.code === 200) {
        // this.$message.success("获取商品列表成功");
        this.category3List = result.data;
      } else {
        this.$message.error("获取商品列表失败");
      }
    },
    async handeChange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };
      this.$emit("change", category);
    },
  },
  async mounted() {
    const result = await this.$API.attrlist.getCategory1();
    if (result.code === 200) {
      // this.$message.success("获取商品列表成功");
      console.log(result);
      this.category1List = result.data;
    } else {
      this.$message.error("获取商品列表失败");
    }
  },
};
</script>

<style lang="less" scoped>
</style>
