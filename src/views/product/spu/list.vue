<template>
  <div>
    <AttrList />
    <SpuShowList v-if="isShowSpuList" @updateShowList="updateShowList" />
    <SpuUpdateList v-else :item="item" />
  </div>
</template>

<script>
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
  },
  components: {
    AttrList,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
