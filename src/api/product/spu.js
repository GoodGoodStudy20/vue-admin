import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  //获取分页信息数据
  getSpuList ( { category3Id, page, limit } ) {
    return request( {
      method: "GET",
      url: `${ api_name }/${ page }/${ limit }`,
      params: {
        category3Id
      }
    } )
  },
  //获取销售列表数据
  getBaseSaleAttrList () {
    return request( {
      method: "GET",
      url: `${ api_name }/baseSaleAttrList`
    } )
  },
  //删除spu数据
  deleteSpu ( spuId ) {
    return request( {
      method: "DELETE",
      url: `${ api_name }/deleteSpu/${ spuId }`
    } )
  },
  //更新修改spu数据
  updateSpu ( spu ) {
    return request( {
      method: "POST",
      url: `${ api_name }/updateSpuInfo`,
      data: {
        spu
      }
    } )
  },
  //保存spu数据
  saveSpu ( spu ) {
    return request( {
      method: "POST",
      url: `${ api_name }/saveSpuInfo`,
      data: spu
    } )
  },
}
