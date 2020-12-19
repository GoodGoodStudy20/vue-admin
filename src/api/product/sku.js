import request from "@/utils/request"

const api_name = "/admin/product"
export default {
  saveSku ( sku ) {
    return request( {
      method: "POST",
      url: `${ api_name }/saveSkuInfo`,
      data: sku
    } )
  }
}
