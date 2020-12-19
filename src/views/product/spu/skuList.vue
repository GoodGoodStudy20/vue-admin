<template>
  <el-card>
    <el-form
      :model="sku"
      ref="skuForm"
      label-width="100px"
      class="demo-ruleForm"
      :rules="rules"
    >
      <el-form-item label="SPU 名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>
      <el-form-item label="SKU 名称" prop="skuName">
        <el-input placeholder="请输入SKU名称" v-model="sku.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" min="0" prop="price">
        <el-input-number
          placeholder="SKU 价格"
          v-model="sku.price"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          placeholder="SKU 重量"
          v-model="sku.weight"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="规格描述" prop="description">
        <el-input
          type="textarea"
          placeholder="SKU规格描述"
          v-model="sku.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div
          v-for="(attr, index) in attrList"
          :key="attr.id"
          class="skulist-select-container"
        >
          <el-form-item :label="attr.attrName">
            <el-select
              placeholder="请选择"
              v-model="sku.skuAttrValueList[index]"
              @change="clearValidate('skuAttrValueList')"
            >
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <!--  v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="attrValue.id" -->
      <el-form-item label="销售属性" prop="skuSaleAttrList">
        <div
          v-for="(spuSaleAttr, index) in spuSaleAttrList"
          :key="spuSaleAttr.id"
          class="skulist-select-container"
        >
          <el-form-item :label="spuSaleAttr.saleAttrName">
            <el-select
              placeholder="请选择"
              v-model="sku.skuSaleAttrValueList[index]"
              @change="clearValidate('skuSaleAttrValueList')"
            >
              <el-option
                v-for="saleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="图片列表" prop="skuImageList">
        <el-table
          border
          :data="imageList"
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          row-key="id"
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
            <template v-slot="{ row }">
              <el-button
                v-if="!row.isDefault"
                size="mini"
                type="primary"
                @click="setDefault(row.id)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
            </template></el-table-column
          ></el-table
        ></el-form-item
      >
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form></el-card
  >
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
      attrList: [],
      rules: {},
      sku: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
      rules: {
        skuName: [
          { required: true, message: "请输入SKU名称", trigger: "change" },
        ],
        price: [{ required: true, message: "请输入价格", trigger: "change" }],
        weight: [
          { required: true, message: "请输入商品重量", trigger: "change" },
        ],
        description: [
          { required: true, message: "请输入商品规格描述", trigger: "change" },
        ],
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueListValidator },
        ],
        skuSaleAttrList: [
          { required: true, validator: this.skuSaleAttrListValidator },
        ],
        skuImageList: [
          { required: true, validator: this.skuImageListValidator },
        ],
      },
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
        this.imageList = result.data.map((img) => {
          return {
            ...img,
            isCheck: true,
          };
        });
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
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    skuAttrValueListValidator(rule, value, callback) {
      const {
        sku: { skuAttrValueList },
        attrList,
      } = this;
      if (
        skuAttrValueList.length !== this.attrList.length ||
        skuAttrValueList.some((attr) => !attr)
      ) {
        callback(new Error("请对所有平台属性进行选择~"));
      }
    },
    skuSaleAttrListValidator(rule, value, callback) {
      const {
        sku: { skuSaleAttrValueList },
        spuSaleAttrList,
      } = this;
      if (
        skuSaleAttrValueList.length !== spuSaleAttrList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback(new Error("请对所有销售属性进行选择~"));
        return;
      }
      callback();
    },
    skuImageListValidator(rule, value, callback) {
      const {
        sku: { skuImageList },
        imageList,
      } = this;
      if (skuImageList.length === 0) {
        callback(new Error("请选择至少一张照片"));
        return;
      }
      if (!skuImageList.some((img) => img.isDefault)) {
        callback(new Error("请设置一张默认照片"));
        return;
      }
      callback();
    },
    handleSelectionChange(skuImageList) {
      this.sku.skuImageList = skuImageList;
    },
    setDefault(id) {
      // this.clearValidate("skuImageList");
      this.imageList = this.imageList.map((img, index) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
      this.sku.skuImageList = this.sku.skuImageList.map((img, index) => {
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
    },
    clearValidate(prop) {
      //清空表单校验
      this.$refs.skuForm.clearValidate(prop);
    },
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          console.log(111);
          const { category3Id, id: spuId, tmId } = this.spu;
          const skuAttrValueList = this.sku.skuAttrValueList.map((attr) => {
            const [attrId, valueId] = attr.split("-");
            return {
              attrId,
              valueId,
            };
          });
          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                spuId,
              };
            }
          );
          skuDefaultImg;
          const skuDefaultImg = this.sku.skuImageList.find(
            (img) => img.isDefault
          ).imgUrl;
          const result = await this.$API.sku.saveSku({
            ...this.sku,
            category3Id,
            spuId,
            tmId,
            skuAttrValueList,
            skuSaleAttrValueList,
          });
          if (result.code === 200) {
            this.$message.success("保存数据成功");
            this.$emit("showList");
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    cancel() {
      this.$emit("showList");
    },
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
  width: 30%
  text-align: right
  margin-right: 20px
  margin-bottom: 20px
.skulist-imageList
  width: 100px
</style>
