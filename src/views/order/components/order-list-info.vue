<template>
  <div>
    <h5 class="xiangqing">订单详情</h5>
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="grid-content bg-purple" style="margin-left: 50px">
          <p><span>订单号:</span>{{tableData.systemOrderNo}}</p>
          <p><span>下单时间:</span>{{tableData.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
          <p><span>订单来源:</span>{{tableData.touchName}}</p>
          <p><span>开卡人姓名:</span>{{tableData.contactName}}</p>
          <p><span>身份证号:</span> 无无无</p>

        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <p><span>联系电话:</span> 无</p>
          <p><span>收货地址:</span>无</p>
          <p><span>收货人:</span> {{tableData.contactName}}</p>
          <p><span>投放渠道名称:</span>{{tableData.accountName}}</p>
        </div>
      </el-col>
    </el-row>

    <h5 class="xiangqing">商品信息</h5>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-table
            :data="tableData"
            height="250"
            border
            style="width: 100%">
            <el-table-column
              prop="productId"
              label="商品ID"
              width="180">
            </el-table-column>
            <el-table-column
              prop="productName"
              label="商品名称">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <h5 class="xiangqing">订单生产信息</h5>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">

        </div>
      </el-col>
    </el-row>

    <h5 class="xiangqing">其他</h5>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">{{tableData.orderMessage}}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrder } from '@/api/order'
import { parseTime } from '@/utils'
export default {
  name: "order-list-info",
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  data(){
    return{
      orderId: undefined,
      tableData: undefined
    }
  },
  created() {
    this.orderId = this.$route.params.orderId
    this.getOrderFun()
  },
  methods:{
    getOrderFun() {
      getOrder({
        orderId : this.orderId
      }).then(response => {
        this.tableData = response.data // 获取触点码
      })
    },

  }
}
</script>

<style scoped>
.bg-purple{
  margin: 0 auto;
}
.bg-purple p{
  width: 100%;
  margin: 30px 0;
  font-size: 12px;
}
.bg-purple p span{
  display: inline-block;
  width: 120px;
  text-align: right;
  padding-right: 15px;
}
.xiangqing{
  margin-left: 20px;
}
</style>
