<template>
  <div>
    <AttrList />
    <SpuShowList v-if="isShowSpuList" @updateShowList="updateShowList" />
    <SpuUpdateList v-else :item="item" @showList="showList"/>
  </div>
</template>

<script>
import { category } from "@/api";
import AttrList from "../attr/AttrList";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowSpuList: true,
      item: {},
    };
  },
  methods: {
    updateShowList(row) {
      this.isShowSpuList = false;
      this.item = { ...row };
    },
    showList(category3Id) {
      this.isShowSpuList = true;
      this.$nextTick(() => {
        this.$bus.$emit("change", {category3Id});
      });
    },
  },
  components: {
    AttrList,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
