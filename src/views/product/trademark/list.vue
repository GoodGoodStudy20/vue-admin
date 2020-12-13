<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>

    <el-table
      :data="trademark"
      border
      style="width: 100%; margin: 20px 0"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="warning" icon="el-icon-edit" @click="update(row)"
            >修改</el-button
          >
          <el-popconfirm
            @onConfirm="delTrademark(row)"
            title="这是一段内容确定删除吗？"
          >
            <el-button slot="reference" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      class="trademark-pagination"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>

    <!-- 点击添加弹出的弹框 -->
    <el-dialog
      :title="`${trademarkForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="50%"
    >
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- 上传端口 -->
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过100kb</span>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { trademark } from "@/api";
export default {
  name: "TrademarkList",
  data() {
    return {
      loading: true,
      trademark: [], //总数据
      total: 0, //总条数
      page: 1, //页码
      limit: 3, //每条页数
      visible: false, //添加窗口显示隐藏
      //初始化添加的品牌图片信息
      trademarkForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请上传品牌LOGO" }],
      },
    };
  },
  methods: {
    //请求分页列表数据，封装复用
    async getPageList(page, limit) {
      this.loading = true;
      const result = await this.$API.product.getPageList(page, limit);
      if (result.code === 200) {
        // this.$message.success("获取品牌数据成功")
        this.trademark = result.data.records; //获取列表数据
        this.total = result.data.total; // 总数
        this.page = result.data.current; // 代表当前页码
        this.limit = result.data.size; // 代表每页显示的条数
      } else {
        this.$message.error("获取品牌数据失败");
      }
      this.loading = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        //如果表单校验通过
        if (valid) {
          const isUpdate = !!this.trademarkForm.id;
          if (isUpdate) {
            const re = this.trademark.find(
              (tm) => tm.id === this.trademarkForm.id
            );
            if (
              re.tmName === this.trademarkForm.tmName &&
              re.logoUrl === this.trademarkForm.logoUrl
            ) {
              this.$message.warning("请不要提交未修改的数据");
              return;
            }
          }
          let result;
          if (isUpdate) {
            result = await this.$API.product.updatePageList(this.trademarkForm);
          } else {
            result = await this.$API.product.addPageList(this.trademarkForm);
          }
          //表单验证通过发送请求，并传入数据

          console.log(result);
          if (result.code === 200) {
            //当添加成功，隐藏弹窗，并且更新列表数据。
            this.$message.success(`${isUpdate ? `修改` : `添加`}品牌数据成功`);
            this.visible = false;
            this.getPageList(this.page, this.limit);
          } else {
            this.$message.erros("添加品牌数据失败");
          }
        }
      });
    },
    //上传图片成功的回调
    handleAvatarSuccess(res) {
      //将图片转换为URL地址
      // this.imageUrl = URL.createObjectURL(file.raw);
      //res.data可获得图片地址
      this.trademarkForm.logoUrl = res.data;
    },
    //上传图片之前的验证回调
    beforeAvatarUpload(file) {
      //判断图片类型
      const imgType = ["image/jpg", "image/png", "image/jpeg"];
      const isValidType = imgType.indexOf(file.type) > -1;
      //判断图片的大小
      const isLimit = file.size / 1024 < 100;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG,PNG,JPEG 格式!");
      }
      if (!isLimit) {
        this.$message.error("上传图片大小不能超过 100KB!");
      }
      return isValidType && isLimit;
    },
    async delTrademark(row) {
      const result = await this.$API.product.deletePageList(row.id);
      if (result.code === 200) {
        this.$message.success("删除品牌数据成功");
        this.getPageList(this.page, this.limit);
      }
    },
    //更新数据，传入row，每一行的数据
    update(row) {
      this.visible = true;
      //解构为row，如果直接赋值，因为赋值是引用地址赋值，由于双向数据绑定，会修改数据。
      this.trademarkForm = { ...row };
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
    },
    //点击添加数据，显示弹框，让弹框内容为空
    add() {
      this.visible = true;
      this.trademarkForm = {
        tmName: "",
        logoUrl: "",
      };
      this.$refs.trademarkForm.clearValidate();
    },
  },
  mounted() {
    //加载列表数据
    this.getPageList(this.page, this.limit);
  },
};
</script>
<style lang="sass" scoped>
.trademark-img
  width: 100px
  height: 80px
.trademark-pagination
  text-align: right
/deep/.el-pagination__sizes
  margin-left: 150px
>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
>>>.avatar-uploader .el-upload:hover
  border-color: #409EFF
>>>.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center
>>>.avatar
  width: 178px
  height: 178px
  display: block
</style>
