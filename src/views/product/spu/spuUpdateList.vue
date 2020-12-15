<template>
  <el-card style="margin: 20px 0">
    <!-- :rules="rules" -->
    <el-form
      :model="spu"
      ref="spuForm"
      label-width="100px"
      class="demo-ruleForm"
      :rules="rules"
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
      <el-form-item label="SPU图片" prop="imageList">
        <el-upload
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="formatImageList"
          class="avatar-uploader"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          list-type="picture-card"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="销售属性" prop="sale">
        <el-select
          :placeholder="`还有${filterSaleAttrList.length}条未选择`"
          v-model="spu.sale"
        >
          <el-option
            v-for="sale in filterSaleAttrList"
            :label="sale.name"
            :value="`${sale.id}-${sale.name}`"
            :key="sale.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!spu.sale"
          @click="addSpuAttrList"
          >添加销售属性</el-button
        >
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
            <template v-slot="{ row, $index }">
              <el-tag
                style="margin-right: 5px"
                v-for="(attrVal, i) in row.spuSaleAttrValueList"
                :key="attrVal.id"
                closable
                @close="handleClose(i, row)"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >
              <el-input
                v-if="row.edit"
                size="mini"
                style="width: 100px"
                ref="input"
                autofocus
                v-model="saleAttrValueText"
                @blur="editCompleted(row, $index)"
                @keyup.enter.native="editCompleted(row, $index)"
              ></el-input>
              <el-button
                icon="el-icon-plus"
                size="mini"
                v-else
                @click="edit(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.saleAttrName}吗？`"
                @onConfirm="delSpuValue($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSaleAttr">保存</el-button>
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
      saleAttrValueText: "", //输入框内容
      rules: {
        spuName: [{ required: true, message: "请输入SPU名称" }],
        tmId: [{ required: true, message: "请选择品牌名称" }],
        description: [{ required: true, message: "请输入SPU描述" }],
        imageList: [{ validator: this.spuImgListValidator, required: true }],
        sale: [{ validator: this.saleAttrListValidator, required: true }],
      },
    };
  },
  computed: {
    //计算销售属性
    filterSaleAttrList() {
      return this.AllSaleAttrList.filter((sale) => {
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        );
      });
    },
    //计算格式化图片列表数据
    formatImageList() {
      return this.spuImgList.map((img) => {
        return {
          name: img.imgName,
          url: img.imgUrl,
          uid: img.uid || img.id,
        };
      });
    },
  },
  methods: {
    //获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("获取品牌数据成功");
        this.trademarkList = result.data;
      } else {
        this.$message.error(result.$message);
      }
    },
    //获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取图片数据成功");
        this.spuImgList = result.data;
      } else {
        this.$message.error(result.$message);
      }
    },
    //处理图片删除功能
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.spuImgList = this.spuImgList.filter(
        (img) => img.imgUrl !== file.url
      );
    },
    //处理图片预览功能
    handlePictureCardPreview(file) {
      // console.log(file);
      this.previewImgUrl = file.url;
      this.visible = true;
    },
    //获取当前SPU销售属性
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取SPU销售属性成功");
        this.spuSaleAttrList = result.data;
        // console.log(result);
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
        // console.log(result);
      } else {
        this.$message.error(result.$message);
      }
    },
    //处理图片的验证
    beforeAvatarUpload(file) {
      //判断图片类型
      const imgType = ["image/jpg", "image/png", "image/jpeg"];
      const isValidType = imgType.indexOf(file.type) > -1;
      //判断图片的大小
      const isLimit = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传轮播图处的图片只能是 JPG,PNG,JPEG 格式!");
      }
      if (!isLimit) {
        this.$message.error("上传图片大小不能超过 50KB!");
      }
      return isValidType && isLimit;
    },
    //上传图片成功的回调，往后面Push,但是因为数据中图片的数据格式不一样，需要改变数据
    handleAvatarSuccess(res, file) {
      this.spuImgList.push({
        imgName: file.name,
        imgUrl: res.data,
        spuId: this.spu.id,
        uid: file.uid,
      });
    },
    /*
baseSaleAttrId:1
id:7577
saleAttrName:"选择颜色"
spuId:2263


    */
    addSpuAttrList() {
      const { sale, id } = this.spu;
      const [baseSaleAttrId, saleAttrName] = sale.split("-");
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId,
        saleAttrName,
        spuId: id,
        spuSaleAttrValueList: [],
      });
      //清除saleAttrId可以清除选择属性
      this.spu.sale = "";
    },
    // addSpuAttrList() {
    //   const { saleAttrId, id } = this.spu;
    //   const sale = this.AllSaleAttrList.find((sale) => sale.id === saleAttrId);
    //   this.spuSaleAttrList.push({
    //     baseSaleAttrId: sale.id,
    //     saleAttrName: sale.name,
    //     spuId: id,
    //     spuSaleAttrValueList: [],
    //   });
    //   //清除saleAttrId可以清除选择属性
    //   this.spu.saleAttrId = "";
    // },
    //上传图片校验
    spuImgListValidator(rule, value, callback) {
      //判断至少有一张图片
      if (this.spuImgList.length > 0) {
        callback();
        return;
      }
      callback(new Error("请上传至少一张照片"));
    },
    //表单验证销售属性
    saleAttrListValidator(rule, value, callback) {
      if (this.spuSaleAttrList.length === 0) {
        callback(new Error("请选择至少一个销售属性"));
        return;
      }
      const isNo = this.spuSaleAttrList.some(
        (sale) => sale.spuSaleAttrValueList.length === 0
      );
      if (isNo) {
        callback(new Error("请填写至少一个销售属性值"));
        return;
      }
      callback()
    },
    //获取焦点，显示编辑输入框
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //失去焦点,添加属性
    editCompleted(row, index) {
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValueText,
          spuId: row.spuId,
        });
        this.saleAttrValueText = "";
      }
      row.edit = false;
    },
    //删除单个销售属性值
    handleClose(i, row) {
      row.spuSaleAttrValueList.splice(i, 1);
    },
    //删除销售属性行
    delSpuValue(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    saveSaleAttr() {
      this.$refs.spuForm.validate(async (valid) => {
        //如果表单校验通过
        if (valid) {
          const spu = {
            ...this.spu,
            spuImageList: this.spuImageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };
          const result = await this.$API.spu.updateSpu(spu);
          if (result.code === 200) {
            this.$message.success("数据更新成功");
            this.$bus.$emit("showList",this.spu.category3Id)
          } else {
            this.$message.error(result.message);
          }
        }
      });
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
