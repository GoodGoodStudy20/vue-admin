<template>
  <!-- 0:
category3Id: 61
description: "这是雪碧牌的雪碧"
id: 2219
spuImageList: null
spuName: "雪碧"
spuSaleAttrList: null
tmId: 246 -->
  <el-card style="margin: 20px 0">
    <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
    <el-table :data="spuList" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column prop="description" label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="update(row)"
          ></el-button>
          <el-button
            slot="reference"
            type="info"
            icon="el-icon-info"
            size="mini"
          ></el-button>
          <el-button
            slot="reference"
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="getShowList(page, $event)"
      @current-change="getShowList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "SpuShowList",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      spuList: [],
      loading: false,
    };
  },
  methods: {
    async getShowList(page, limit) {
      this.loading = true;
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        page,
        limit,
        category3Id,
      });
      if (result.code === 200) {
        this.$message.success("获取分页信息数据成功");
        console.log(result);
        this.spuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    handleCategoryChange(category) {
      this.category = category;
      this.getShowList(this.page, this.limit);
    },
    clearList() {
      (this.spuList = []),
        (this.total = 0),
        (this.page = 1),
        (this.limit = 3),
        (this.category.category3Id = "");
    },
  },
  mounted() {
    this.$bus.$on("change", this.handleCategoryChange);
    this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    this.$bus.$off("change", this.handleCategoryChange);
    this.$bus.$off("clearList", this.clearList);
  },
};
</script>

<style lang="less" scoped>
</style>
