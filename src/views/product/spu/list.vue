<template>
  <div>
    <SkuList v-if="isShowSkuList" :spuItem="spuItem" @showList="showList" />
    <div v-else>
      <AttrList :disabled="!isShowSpuList" />
      <SpuShowList
        v-if="isShowSpuList"
        @updateShowList="updateShowList"
        @showSpuList="showSpuList"
      />
      <SpuUpdateList v-else :item="item" @showList="showList" />
    </div>
  </div>
</template>

<script>
// import { category } from "@/api";
import AttrList from "../attr/AttrList";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SkuList from "./skuList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowSpuList: true,
      item: {},
      isShowSkuList: false,
      spuItem: {},
    };
  },
  methods: {
    showSpuList(row) {
      this.isShowSkuList = true;
      this.spuItem = { ...row };
    },
    updateShowList(row) {
      this.isShowSpuList = false;
      this.item = { ...row };
    },
    showList(category) {
      this.isShowSpuList = true;
      // this.$nextTick(() => {
      // this.$bus.$emit("change", { category3Id });
      // });
    },
  },
  components: {
    AttrList,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },
};
</script>
