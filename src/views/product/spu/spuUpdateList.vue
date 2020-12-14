<template>
  <el-card style="margin: 20px 0">
    <!-- :rules="rules" -->
    <el-form
      :model="spu"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="trademark.tmName"
            :value="trademark.id"
            v-for="trademark in trademarkList"
            :key="trademark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <!-- :file-list="fileList" -->
      <el-form-item label="SPU图片">
        <el-upload
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImgList"
          class="avatar-uploader"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          list-type="picture-card"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="销售属性" prop="saleAttrId">
        <el-select
          :placeholder="`还有${filterSaleAttrList.length}条未选择`"
          v-model="spu.saleAttrId"
        >
          <el-option
            v-for="sale in filterSaleAttrList"
            :label="sale.name"
            :value="sale.id"
            :key="sale.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      </el-form-item>
      <el-form-item>
        <el-table :data="spuSaleAttrList" border style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150px">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template v-slot="{ row }">
              <el-tag
                style="margin-right: 5px"
                v-for="attrVal in row.spuSaleAttrValueList"
                :key="attrVal.id"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-popconfirm title="这是一段内容确定删除吗？">
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button
              ><el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="visible">
      <img width="100%" :src="previewImgUrl" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "SpuUpdateList",
  props: {
    item: Object,
  },
  data() {
    return {
      trademarkList: [], //获取所有品牌数据
      spuImgList: [], //获取所有图片列表
      spu: this.item, //将传过来的item设置为响应式
      previewImgUrl: "", // 图片地址
      visible: false, // 图片对话框显示&隐藏
      spuSaleAttrList: [], //当前SPU销售属性
      AllSaleAttrList: [], //所有销售属性列表
    };
  },
  computed: {
    filterSaleAttrList() {
      return this.AllSaleAttrList.filter((sale) => {
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        );
      });
    },
  },
  methods: {
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("获取品牌数据成功");
        this.trademarkList = result.data;
      } else {
        this.$message.error(result.$message);
      }
    },
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取图片数据成功");
        this.spuImgList = result.data.map((img) => {
          return {
            name: img.imgName,
            url: img.imgUrl,
            id: img.id,
          };
        });
      } else {
        this.$message.error(result.$message);
      }
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.spuImgList = this.spuImgList.filter((img) => img.id !== file.id);
    },
    handlePictureCardPreview(file) {
      console.log(file);
      this.previewImgUrl = file.url;
      this.visible = true;
    },
    //获取当前SPU销售属性
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取图片数据成功");
        this.spuSaleAttrList = result.data;
        console.log(result);
      } else {
        this.$message.error(result.$message);
      }
    },
    //获取所有销售属性
    async getAllSaleAttrList() {
      const result = await this.$API.spu.getAllSaleAttrList();
      if (result.code === 200) {
        this.$message.success("获取图片数据成功");
        this.AllSaleAttrList = result.data;
        console.log(result);
      } else {
        this.$message.error(result.$message);
      }
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getAllSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>
