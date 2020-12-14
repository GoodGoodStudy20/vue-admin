<template>
  <div>
    <AttrList />
    <SpuShowList v-show="isShowSpuList" />
    <SpuUpdateList v-show="!isShowSpuList" />
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
    };
  },
  components: {
    AttrList,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
