<template>
  <div>
    <AttrList :disabled="!isShowList" />
    <el-card v-show="isShowList" style="margin: 20px 0">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="add"
        :disabled="!category.category3Id"
        >添加属性</el-button
      >
      <el-table :data="attrlist" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150px">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-popconfirm title="您确定删除吗？" @onConfirm="delAttr(row)">
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
    </el-card>

    <!-- 添加属性值页面 -->
    <el-card v-show="!isShowList" style="margin: 20px 0">
      <el-form :inline="true" :model="attr" class="demo-form-inline">
        <el-form-item label="属性名">
          <el-input
            v-model="attr.attrName"
            placeholder="请输入属性名"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttrValue"
        :disabled="!attr.attrName"
        >添加属性值</el-button
      >
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>

        <el-table-column label="属性值名称">
          <template v-slot="{ row, $index }">
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              size="mini"
              ref="input"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
            ></el-input>
            <span
              v-else
              @click="edit(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`您确定删除${row.valueName}吗？`"
              @onConfirm="delattrValue($index)"
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
      <el-button type="primary" @click="saveValue">保存</el-button>
      <el-button @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AttrList from "./AttrList";
export default {
  name: "list",
  data() {
    return {
      attrlist: [],
      isShowList: true,
      attr: {
        attrName: "",
        attrValueList: [],
      },
      // category: {
      //   category1Id: "",
      //   category2Id: "",
      //   category3Id: "",
      // },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  watch: {
    "category.category3Id"(category3Id) {
      if (!category3Id) return;
      this.getAttrList();
    },
    "category.category1Id"() {
      this.clearList();
    },
    "category.category2Id"() {
      this.clearList();
    },
  },
  methods: {
    async delAttr(row) {
      // console.log(row);
      const result = await this.$API.attrlist.deleteAttr(row.id);
      if (result.code === 200) {
        this.getAttrList(this.category);
        // console.log(result);
        // this.isShowAddAttrList = false;
      } else {
        this.$message.error(result.message);
      }
    },
    async getAttrList() {
      const result = await this.$API.attrlist.getAttrList(this.category);
      if (result.code === 200) {
        this.attrlist = result.data;
        // console.log(result);
        // this.isShowAddAttrList = false;
      } else {
        this.$message.error(result.message);
      }
    },
    update(attr) {
      this.attr = JSON.parse(JSON.stringify(attr));
      this.isShowList = false;
    },
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    delattrValue(index) {
      this.attr.attrValueList.splice(index, 1);
    },
    async saveValue() {
      const isAdd = !this.category.id;
      const data = this.attr;
      if (isAdd) {
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }
      const result = await this.$API.attrlist.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success("属性值保存成功");
        this.getAttrList();
        this.isShowList = true;
      } else {
        this.$message.error("保存失败");
      }
    },
    editCompleted(row, index) {
      if (!row.valueName) {
        this.$message.warning("不能输入空的属性");
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    add() {
      this.isShowList = false;
      this.attr.attrName = "";
      this.attr.attrValueList = [];
      this.attr.id = ""; //清空id防止点击修改后，再点击添加还存在id，但是添加不需要id
    },
    clearList() {
      this.attrlist = [];
      this.category.category3Id = "";
    },
  },
  mounted() {
    // this.$bus.$on("change", this.getAttrList);
    // this.$bus.$on("clearList", this.clearList);
  },
  beforeDestroy() {
    // this.$bus.$off("change", this.getAttrList);
    // this.$bus.$off("clearList", this.clearList);
  },
  components: {
    AttrList,
  },
};
</script>
