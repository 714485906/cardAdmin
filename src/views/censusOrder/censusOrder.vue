<template>
   <div>
     <el-row :gutter="20">
       <el-col :span="24" style="margin: 15px 20px">
         <div class="grid-content bg-purple-dark">
           <el-radio-group v-model="listQuery.periodType" size="medium" @change="handleChange">
             <el-radio-button :label="0">全量</el-radio-button>
             <el-radio-button :label="1">上月</el-radio-button>
             <el-radio-button :label="2">本月</el-radio-button>
             <el-radio-button :label="3">上周</el-radio-button>
             <el-radio-button :label="4">本周</el-radio-button>
             <el-radio-button :label="5">昨日</el-radio-button>
             <el-radio-button :label="6">今日</el-radio-button>
           </el-radio-group>
         </div>
       </el-col>
     </el-row>
     <el-row type="flex" class="row-bg" :gutter="20">
       <el-col :span="6" style="margin-left: 20px">
         <div class="grid-content bg-purple">
           <div class="card-panel-icon-wrapper icon-people" align="center" style="padding-top: 8px">
             <svg-icon icon-class="successOrder" class-name="card-panel-icon" style="font-size: 60px" />
           </div>
           <div class="card-panel-description">
             <div class="card-panel-text" align="center">
               今日正常订单
             </div>
             <count-to :start-val="0" :end-val="census.totalSuccessCount" :duration="2600" class="card-panel-num" />
           </div>
         </div>
       </el-col>
       <el-col :span="6">
         <div class="grid-content bg-purple">
           <div class="card-panel-icon-wrapper icon-people" align="center" style="padding-top: 8px">
             <svg-icon icon-class="failOrder" class-name="card-panel-icon" style="font-size: 60px" />
           </div>
           <div class="card-panel-description">
             <div class="card-panel-text" align="center" style="color: #F16869">
               今日异常订单
             </div>
             <count-to :start-val="0" :end-val="census.totalFailCount" :duration="2600" class="card-panel-num" style="color:#F16869" />
           </div>
         </div>
       </el-col>
     </el-row>
      <!--销量-->
     <el-row :gutter="10">
       <el-col :span="12" style="padding-left: 20px">
         <p>产品销量</p>
         <el-table
           :key="tableKey"
           v-loading="listLoading"
           :data="census.productOrderCounts"
           border
           fit
           highlight-current-row
           style="width: 100%;"
         >
           <el-table-column type="index" width="70" label="序号" align="center" />
           <el-table-column label="商品"min-width="120px" align="center">
             <template slot-scope="{row}">
               <span class="link-type">{{row.productName}}</span>
             </template>
           </el-table-column>

           <el-table-column label="正常订单" min-width="100px" align="center">
             <template slot-scope="{row}">
               <span class="link-type">{{row.productSuccessCount}}</span>
             </template>
           </el-table-column>
           <el-table-column label="异常订单" width="100px" align="center">
             <template slot-scope="{row}">
               <span>{{row.productFailCount}}</span>
             </template>
           </el-table-column>
           <el-table-column label="已发货" width="90px" align="center">
             <template slot-scope="{row}">
               <span>{{row.productDeliveryCount}}</span>
             </template>
           </el-table-column>
           <el-table-column label="已激活" min-width="90px" align="center">
             <template slot-scope="{row}">
               <span class="link-type">{{row.productActivateCount}}</span>
             </template>
           </el-table-column>
         </el-table>
<!--         <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />-->
       </el-col>
       <el-col :span="12" style="padding-right: 20px">
         <p>代理商销量</p>
         <el-table
           :key="tableKey"
           v-loading="listLoading"
           :data="census.productOrderCounts"
           border
           fit
           highlight-current-row
           style="width: 100%;"
         >
           <el-table-column type="index" width="70" label="序号" align="center" />
           <el-table-column label="一级代理名称"min-width="120px" align="center">
             <template slot-scope="{row}">
               <span class="link-type">{{row.accountName}}</span>
             </template>
           </el-table-column>

           <el-table-column label="正常订单" min-width="100px" align="center">
             <template slot-scope="{row}">
               <span class="link-type">{{row.accountSuccessCount}}</span>
             </template>
           </el-table-column>
           <el-table-column label="异常订单" width="100px" align="center">
             <template slot-scope="{row}">
               <span>{{row.accountFailCount}}</span>
             </template>
           </el-table-column>
           <el-table-column label="已激活" min-width="90px" align="center">
             <template slot-scope="{row}">
               <span class="link-type">{{row.accountActivateCount}}</span>
             </template>
           </el-table-column>
           <el-table-column label="首冲量" width="90px" align="center">
             <template slot-scope="{row}">
               <span>{{row.accountRechargeCount}}</span>
             </template>
           </el-table-column>
           <el-table-column label="首冲比率" width="90px" align="center">
             <template slot-scope="{row}">
               <span>{{row.productDeliveryCount}}</span>
             </template>
           </el-table-column>
           <el-table-column label="激活比率" width="90px" align="center">
             <template slot-scope="{row}">
               <span>{{row.accountRechargeRate}}</span>
             </template>
           </el-table-column>
         </el-table>
       </el-col>
     </el-row>
   </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { transactionList } from '@/api/remote-search'
export default {
  name: "censusOrder",
  components: {
    CountTo
  },
  data(){
    return{
      tableKey: 0,
      listLoading: true,
      census:[],
      total: 0,
      listQuery: {
        periodType:6
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods:{
    handleChange(val) {
      console.log(val)
      this.dateType = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      transactionList(this.listQuery).then(response => {
        this.listLoading = false
        this.census = response.data
      })
    }
  }
}
</script>

<style scoped>

.bg-purple {
  background: #fff;
}
bg-purple-dark{
  padding: 10px 10px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.card-panel-text{
  font-size: 14px;
  margin-top: 8px;
}
.card-panel-num {
  margin: 8px 0;
  display: inline-block;
  width: 100%;
  font-size: 20px;
  text-align: center;
}
</style>
