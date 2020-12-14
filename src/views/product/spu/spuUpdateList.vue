<template>
  <el-card style="margin: 20px 0">
    <el-form
      :model="[]"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="SPU名称" prop="name">
        <el-input placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="region">
        <el-select placeholder="请选择品牌">
          <el-option label="品牌1" value="shanghai"></el-option>
          <el-option label="品牌2" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="desc">
        <el-input type="textarea" placeholder="SPU描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          class="avatar-uploader"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :file-list="fileList"
          list-type="picture-card"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="销售属性" prop="region">
        <el-select placeholder="还有3条未选择">
          <el-option label="品牌1" value="shanghai"></el-option>
          <el-option label="品牌2" value="beijing"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      </el-form-item>
      <el-form-item>
        <el-table :data="attrlist" border style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名" width="150px">
          </el-table-column>
          <el-table-column label="属性值名称列表"> </el-table-column>
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
  </el-card>
</template>

<script>
export default {
  name: "SpuUpdateList",
};
</script>

<style lang="less" scoped>
</style>
