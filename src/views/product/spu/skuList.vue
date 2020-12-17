<template>
  <el-card>
    <el-form
      :model="sku"
      ref="skuForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="SPU 名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU 名称" prop="sKuName">
        <el-input placeholder="请输入SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="sKuPrice">
        <el-input-number
          placeholder="SKU 价格"
          v-model="num"
          controls-position="right"
          @change="handleChange"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="sKuName">
        <el-input-number
          placeholder="SKU 重量"
          v-model="num"
          controls-position="right"
          @change="handleChange"
          :min="1"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="规格描述" prop="description">
        <el-input type="textarea" placeholder="SKU规格描述"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <div
          v-for="attr in attrlist"
          :key="attr.id"
          class="skulist-select-container"
        >
          <span>{{ attr.attrName }}</span>
          <el-select placeholder="请选择">
            <el-option
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="attrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <!--  v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="attrValue.id" -->
      <el-form-item label="销售属性">
        <div
          v-for="spuSaleAttr in spuSaleAttrList"
          :key="spuSaleAttr.id"
          class="skulist-select-container"
        >
          <span>{{ spuSaleAttr.saleAttrName }}</span>
          <el-select :placeholder="`还有条未选择`">
            <el-option
              v-for="saleAttrValue in spuSaleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="saleAttrValue.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          :data="imageList"
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <!-- @selection-change="handleSelectionChange" -->
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img
                class="skulist-imageList"
                :src="scope.row.imgUrl"
                :alt="scope.row.imgName"
            /></template>
          </el-table-column>
          <el-table-column prop="name" label="名称"> </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <el-button type="primary">设为默认</el-button>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SkuList",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem,
      imageList: [], //所有图片列表
      spuSaleAttrList: [],
      attrlist: [],
      rules: {},
      sku: {},
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取图片数据成功");
        this.imageList = result.data;
      } else {
        this.$message.error(result.$message);
      }
    },
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      // console.log(this.spu);
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取SPU销售属性成功");
        this.spuSaleAttrList = result.data;
        // console.log(result);
      } else {
        this.$message.error(result.$message);
      }
    },
    async getAttrList() {
      const result = await this.$API.attrlist.getAttrList(this.category);
      if (result.code === 200) {
        this.attrlist = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    handleChange() {},
  },
  mounted() {
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getAttrList();
  },
};
</script>

<style lang="sass" scoped>
.skulist-select-container
  display: inline-block
  margin-right: 20px
.skulist-imageList
  width: 100px
</style>
