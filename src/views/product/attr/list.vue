<template>
  <div>
    <AttrList @change="getAttrList" :disabled="!isShowList" />
    <el-card v-show="isShowList && !isShowAddAttrList" style="margin: 20px 0">
      <el-button type="primary" icon="el-icon-plus" @click="addAttr"
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
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-popconfirm title="这是一段内容确定删除吗？">
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
      <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
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

    <!-- 添加属性 -->
    <el-card v-show="isShowAddAttrList" style="margin: 20px 0">
      <el-form inline :model="attr" class="demo-form-inline">
        <el-form-item label="属性名">
          <el-input
            v-model="attr.attrName"
            placeholder="请输入属性名"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
        >添加属性值</el-button
      >
      <el-button>取消</el-button>
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
import AttrList from "./AttrList";
export default {
  name: "list",
  data() {
    return {
      attrlist: [],
      isShowList: true,
      isShowAddAttrList: false,
      attr: {
        attrName: "",
        attrValueList: [],
      },
    };
  },
  methods: {
    async getAttrList(category) {
      this.category = category;
      const result = await this.$API.attrlist.getAttrList(category);
      if (result.code === 200) {
        this.attrlist = result.data;
        console.log(result);
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
      const result = await this.$API.attrlist.saveAttrInfo(this.attr);
      if (result.code === 200) {
        this.$message.success("属性值保存成功");
        this.getAttrList(this.category);
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
    addAttr() {
      this.isShowAddAttrList = true;
    },
  },
  mounted() {},
  components: {
    AttrList,
  },
};
</script>
