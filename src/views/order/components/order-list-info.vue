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
          <p><span>身份证号:</span> {{tableData.idNumber}}</p>

        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <p><span>联系电话:</span> {{tableData.contactPhone}}</p>
          <p><span>收货地址:</span>{{tableData.provinceName}}-{{tableData.cityName}}-{{tableData.districtName}}({{tableData.address}})</p>
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
            :data="[tableData]"
            style="width: 100%;"
            border
            fit
            highlight-current-row
            :header-cell-style="{background:'#eee',color:'#000'}"
          >
            <el-table-column label="商品ID" min-width="190px" align="center">
              <template slot-scope="{row}">
                <span class="link-type">{{ row.productId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" min-width="190px" align="center">
              <template slot-scope="{row}">
                <span class="link-type">{{ row.productName }}</span>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-col>
    </el-row>

    <h5 class="xiangqing">订单生产信息</h5>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-table
            :data="[tableData]"
            style="width: 100%;"
            border
            fit
            highlight-current-row
            :header-cell-style="{background:'#eee',color:'#000'}"
          >
            <el-table-column label="物流状态" min-width="120px" align="center">
              <template slot-scope="{row}">
                <el-tag v-if="row.logisticsStatus == 0" type="info">待发货</el-tag>
                <el-tag v-if="row.logisticsStatus == 1" type="warning">已发货</el-tag>
                <el-tag v-if="row.logisticsStatus == 2" type="success">已签收</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="物流公司" min-width="120px" align="center">
              <template slot-scope="{row}">
                <span class="link-type">{{ row.logisticsCompany }}</span>
              </template>
            </el-table-column>
            <el-table-column label="物流单号" min-width="120px" align="center">
              <template slot-scope="{row}">
                <span class="link-type">{{ row.logisticsNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="发货时间" min-width="120px" align="center">
              <template slot-scope="{row}">
                <span class="link-type">{{ row.deliveryTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column><el-table-column label="开启手机号" min-width="120px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.applyPhone }}</span>
            </template>
          </el-table-column><el-table-column label="iccid" min-width="120px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">无</span>
            </template>
          </el-table-column>
            <el-table-column label="订单状态" min-width="120px" align="center">
            <template slot-scope="{row}">
              <el-tag v-if="row.orderStatus == 0" type="info">待回调</el-tag>
              <el-tag v-if="row.orderStatus == 1">已回调</el-tag>
              <el-tag v-if="row.orderStatus == 2" type="danger" @click="orderErrFun(row.orderId)">提交失败</el-tag>
              <el-tag v-if="row.orderStatus == 3" type="success">已激活</el-tag>
              <el-tag v-if="row.orderStatus == 4" type="warning">已充值</el-tag>
            </template>
          </el-table-column>
           <el-table-column label="激活时间" min-width="120px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.activateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
            <el-table-column label="首充时间" min-width="120px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.rechargeTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
            <el-table-column label="首充金额" min-width="120px" align="center">
            <template slot-scope="{row}">
              <span class="link-type">{{ row.rechargeFee / 100 }}</span>
            </template>
          </el-table-column>
          </el-table>
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
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: "order-list-info",
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  data(){
    return{
      orderId: undefined,
      tableData: []
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
        this.tableData = response.data // 获取单条数据表单
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
