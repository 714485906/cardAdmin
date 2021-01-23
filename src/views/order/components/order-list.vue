<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="dateTime1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="下单开始日期"
        end-placeholder="下单结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="min-width: 300px"
      />
      <el-date-picker
        v-model="dateTime2"
        type="datetimerange"
        range-separator="至"
        start-placeholder="激活开始日期"
        end-placeholder="激活结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="min-width: 300px;margin: 5px 5px"
      />
      <el-date-picker
        v-model="dateTime3"
        type="datetimerange"
        range-separator="至"
        start-placeholder="充值开始日期"
        end-placeholder="充值结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="min-width: 300px;margin: 5px 5px"
      />
      <el-select v-model="listQuery.platformId" placeholder="平台" clearable class="filter-item" style="width: 130px;margin:5px 5px">
        <el-option v-for="item in platformIdData" :key="item.platformId" :label="item.platformName" :value="item.platformId" />
      </el-select>
      <el-select v-model="listQuery.channelId" placeholder="渠道名称" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in channelIdData" :key="item.channelId" :label="item.channelName" :value="item.channelId" />
      </el-select>
      <el-select v-model="listQuery.accountId" placeholder="账号名称" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in accountIdData" :key="item.accountId" :label="item.accountName" :value="item.accountId" />
      </el-select>

      <el-select v-model="listQuery.operatorId" placeholder="运营商" clearable class="filter-item" style="width: 130px;margin:5px 5px">
        <el-option v-for="item in operatorIdData" :key="item.operatorId" :label="item.operatorName" :value="item.operatorId" />
      </el-select>
      <el-select v-model="listQuery.productId" placeholder="商品" clearable class="filter-item" style="width: 130px;margin:5px 5px" @change="queryproduct">
        <el-option v-for="item in getProductData" :key="item.productId" :label="item.productName" :value="item.productId" />
      </el-select>
      <el-select v-model="listQuery.logisticsStatus" placeholder="物流状态" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in logisticsStatusData" :key="item.logisticsStatus" :label="item.name" :value="item.logisticsStatus" />
      </el-select>
      <el-select v-model="listQuery.orderStatus" placeholder="订单状态" clearable class="filter-item" style="width: 130px;margin: 5px 5px">
        <el-option v-for="item in orderStatusData" :key="item.orderStatus" :label="item.name" :value="item.orderStatus" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-show="packageShow" class="filter-item" style="margin-left: 10px;" type="primary" @click="handleResetApply(3)">
        二次分配{{ multipleSelection.length }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleResetApply(2)">
        导出数据{{ multipleSelection.length }}
      </el-button>
    </div>
    <div style="margin-bottom: 15px" />
    <el-table
      ref="deficiencyTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
      :header-cell-style="{background:'#eee',color:'#000'}"
    >

      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="45"
        align="center"
        disabled
        :selectable="checkSelectable"
        fixed="left"
      />
      <!--      <el-table-column type="selection"  :reserve-selection="true"  width="45" align="center" disabled fixed="left" ></el-table-column>-->
      <el-table-column type="index" width="70" label="序号" align="center" />
      <!--      <el-table-column label="orderId" prop="id" sortable="custom" align="center" width="120">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.orderId }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="系统单号" min-width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.systemOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营商订单" min-width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.operatorOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" min-width="100px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请号码" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.applyPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份" min-width="90px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.provinceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市" min-width="90px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县" width="90px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.districtName }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="申请号码省份" width="120px" align="center" show-overflow-tooltip>-->
<!--        <template slot-scope="{row}">-->
<!--          <span class="link-type">{{ row.applyProvinceName }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="申请号码城市" width="120px" align="center" show-overflow-tooltip>-->
<!--        <template slot-scope="{row}">-->
<!--          <span class="link-type">{{ row.applyCityName }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="触点名称" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.touchName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营商名" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.operatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道账号名" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台名称" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营销员" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道名称" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.channelName }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="运营商侧单号" min-width="120px" align="center" show-overflow-tooltip>-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span class="link-type">{{ row.operatorOrderNo }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="物流单号" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.logisticsNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物流公司" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.logisticsCompany }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物流状态" class-name="status-col" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag v-if="row.logisticsStatus == 0" type="info">待发货</el-tag>
          <el-tag v-if="row.logisticsStatus == 1" type="warning">已发货</el-tag>
          <el-tag v-if="row.logisticsStatus == 2" type="success">已签收</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发货时间" width="230px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.deliveryTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="激活时间" width="230px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.activateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值时间" width="230px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.rechargeTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="packageShow" label="失败原因" width="300px" align="center" >
        <template slot-scope="{row}">
          <span class="orderMessage">{{ row.orderMessage }}</span>
        </template>
      </el-table-column>
            <el-table-column label="充值金额/(元)" fixed="right" min-width="120px" align="center" show-overflow-tooltip>
              <template slot-scope="{row}">
                <span class="link-type">{{ row.rechargeFee * 100 }}</span>
              </template>
            </el-table-column>
      <el-table-column label="订单状态" fixed="right" class-name="status-col" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag v-if="row.orderStatus == 0" type="info">待回调</el-tag>
          <el-tag v-if="row.orderStatus == 1">已回调</el-tag>
          <el-tag v-if="row.orderStatus == 2" type="danger" @click="orderErrFun(row.orderId)">提交失败</el-tag>
          <el-tag v-if="row.orderStatus == 3" type="success">已激活</el-tag>
          <el-tag v-if="row.orderStatus == 4" type="warning">已充值</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="打包名称" prop="packageName">
          <el-input v-model="temp.packageName" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productId">
          <el-select v-model="temp.productId" placeholder="请输入平台名称" clearable class="filter-item" @change="queryproduct">
            <el-option v-for="item in getProductData" :key="item.productId" :label="item.productName" :value="item.productId" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="渠道账号" prop="accountId">-->
        <!--          <el-select v-model="temp.accountId" placeholder="请输入平台名称" clearable class="filter-item" >-->
        <!--            <el-option v-for="item in accountIdData" :key="item.accountId" :label="item.accountName" :value="item.accountId"  />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->

        <el-form-item label="触点码" prop="touchId">
          <el-select v-model="temp.touchId" placeholder="请输入触点码" clearable class="filter-item">
            <el-option v-for="item in touchData" :key="item.touchId" :label="item.touchName" :value="item.touchId" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="失败原因" :visible.sync="ErrInfoShow">
      <div v-for="(item,index) in errText">
        <h3>第{{ index + 1 }}次</h3>
        <p>请求报文&nbsp: <span style="color: red">{{ item.requestMessage }}</span></p>
        <p>响应报文&nbsp: <span style="color: red">{{ item.responseMessage }}</span></p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getorderList, getOrderDetails } from '@/api/order'
import { getgetAccounts } from '@/api/channel'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getGetTouches, getOperatorList } from '@/api/operator'
import { getChannelList } from '@/api/channel'
import { getPlatformList } from '@/api/platform'
import { Message } from 'element-ui'
import { getProductList } from '@/api/product'
import { PostCreatePackage } from '@/api/package'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        operatorType: 2,
        beginCreateTime: undefined,
        endCreateTime: undefined,
        beginActivateTime: undefined,
        endActivateTime: undefined,
        beginRechargeTime: undefined,
        endRechargeTime: undefined,
        logisticsStatus: undefined,
        operatorId: undefined,
        channelId: undefined,
        productId: undefined

      },
      importanceOptions: [1, 2, 3],
      operatorData: undefined,
      accountIdData: undefined,
      productStatusData: [
        { key: '1', name: '正常' },
        { key: '0', name: '不可用' }
      ],
      temp: {
        productId: '',
        touchId: '',
        accountId: '',
        packageName: '',
        applyIds: ''
      },
      textMap: {
        create: '二次分配'
      },
      getUserListData: '',
      platformData: '',
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      ErrInfoShow: false,
      errText: [],
      pvData: [],
      dateTime1: '',
      dateTime2: '',
      dateTime3: '',
      multipleSelection: [],
      rules: {
        channelName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }],
        userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
        platformId: [{ required: true, message: '请选择平台', trigger: 'change' }],
        channelType: [{ required: true, message: '请选择状态', trigger: 'change' }],
        channelStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      logisticsStatusData: [
        { logisticsStatus: 0, name: '待发货' },
        { logisticsStatus: 1, name: '已发货' },
        { logisticsStatus: 2, name: '已签收' }
      ],
      orderStatusData: [
        { orderStatus: 0, name: '待回调' },
        { orderStatus: 1, name: '已回调' },
        { orderStatus: 2, name: '提交失败' },
        { orderStatus: 3, name: '已激活' },
        { orderStatus: 4, name: '已充值' },
        { orderStatus: 5, name: '退单' },
        { orderStatus: 6, name: '销户' }
      ],
      operatorIdData: '',
      channelIdData: '',
      platformIdData: '',
      accountsData: '',
      getProductData: '',
      touchData: '',
      packageShow: false,
      downloadLoading: false,
      queryList: {
        productId: undefined,
        operatorId: undefined
      }
    }
  },
  created() {

    if (this.$route.query.tab != undefined) { // 选择当前营业厅
      this.listQuery.operatorType = this.$route.query.tab
    }
    if (this.$route.name == 'orderListErr') { // 监听路由  如果为 orderListErr 进入异常订单
      this.listQuery.orderStatus = 2
      this.packageShow = true
    }
    this.getList() // 初始数据
    this.accountIdDataFun() // 账号名称
    this.getOperatorListDataFun() // 获取运营商
    this.getChannelListDataFun() // 获取渠道
    this.getPlatformListDataFun() // 获取平台
    this.getProductListDataFun() // 产品名称
    this.getGetTouchesDataFun() // 触点码
  },
  watch:{
    $route:{
      handler(val,oldval){

      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getorderList(this.listQuery).then(response => {
        if (response.data != null) {
          this.list = response.data
          this.total = response.page.total
        } else {
          this.list = []
          this.total = response.page.total
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },

    orderErrFun(orderId) {
      this.ErrInfoShow = true
      getOrderDetails({
        orderId: orderId,
        pageNo: 1,
        pageSize: 100
      }).then(response => {
        this.errText = response.data
      })
    },
    handleFilter() {
      this.listQuery.beginCreateTime = this.dateTime1[0]
      this.listQuery.endCreateTime = this.dateTime1[1]
      this.listQuery.beginActivateTime = this.dateTime2[0]
      this.listQuery.endActivateTime = this.dateTime2[1]
      this.listQuery.beginRechargeTime = this.dateTime3[0]
      this.listQuery.endRechargeTime = this.dateTime3[1]
      console.log(this.dateTime1[0])
      this.listQuery.pageNo = 1
      this.getList()
    },
    checkSelectable(row) {
      // row.isPackaged  true已经打包  false没有打包
      if (row.isPackaged == true) {
        return false // 禁止选中
      } else {
        return true // 允许选中
      }
    },
    queryproduct(val) {
      console.log(val)
      this.temp.productId = val
      let obj = {}
      obj = this.getProductData.find((item) => { // 遍历list的数据
        return item.productId === val // 筛选出匹配数据
      })
      this.queryList.operatorId = obj.operatorId // 记录当前产品运营商id
      this.getGetTouchesDataFun()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          PostCreatePackage(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '成功创建',
              type: 'success',
              duration: 2000
            })
            this.$refs.deficiencyTable.clearSelection()
          })
        }
      })
    },
    handleResetApply(type) { // 3.二次分配  2.导出数据
      if (type == 3) {
        console.log('进入二次分配')
        if (!this.multipleSelection.length) {
          Message({
            message: '请选择订单',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          const excelList = this.copyArr(this.multipleSelection)
          const ids = [] // 获取选中的applyId
          for (const item of excelList) {
            ids.push(item.applyId)
          }
          this.temp.applyIds = ids
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      } else if (type == 2) {
        console.log('进入导出数据')
        if (!this.multipleSelection.length) {
          Message({
            message: '请选择数据!!!!',
            type: 'error',
            duration: 3 * 1000
          })
        } else {
          const excelList = this.copyArr(this.multipleSelection) // 需要导出的数据
          this.$nextTick(() => {
            this.handleDownload(excelList) // 调用导出方法
          })
        }
      }
    },
    copyArr(arr) {
      return arr.map(e => {
        if (typeof e === 'object') {
          return Object.assign({}, e)
        } else {
          return e
        }
      })
    },
    toggleDeficiencySelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.deficiencyTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.deficiencyTable.clearSelection()
      }
    },
    getRowKeys(row) {
      return row.applyId
    },
    handleSelectionChange: function(val) {
      this.multipleSelection = val
    },
    accountIdDataFun() {
      getgetAccounts({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.accountIdData = response.data // 获取账号
      })
    },
    getOperatorListDataFun() {
      getOperatorList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.operatorIdData = response.data // 运营商
      })
    },
    getChannelListDataFun() {
      getChannelList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.channelIdData = response.data // 渠道
      })
    },
    getPlatformListDataFun() {
      getPlatformList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.platformIdData = response.data // 获取平台
      })
    },
    getProductListDataFun() {
      getProductList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.getProductData = response.data // 获取产品
      })
    },
    getGetTouchesDataFun() {
      getGetTouches({
        pageNo: 1,
        pageSize: 10000,
        operatorId: this.queryList.operatorId
      }).then(response => {
        this.touchData = response.data // 获取触点码
      })
    },
    handleDownload(excelList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['系统单号', '运营商订单ID', '申请人姓名', '申请号码', '省份名称', '城市名称', '区县名称', '申请号码省份', '申请号码城市', '触点名称', '运营商名', '渠道账号名', '平台名称', '物流单号', '物流状态', '发货时间', '激活时间', '充值时间', '状态']
        const filterVal = ['systemOrderNo', 'operatorOrderNo', 'contactName', 'applyCityName', 'provinceName', 'cityName', 'districtName', 'applyProvinceName', 'applyCityName', 'touchName', 'operatorName', 'accountName', 'platformName', 'logisticsNo', 'logisticsStatus', 'deliveryTime', 'activateTime', 'rechargeTime', 'orderStatus']
        const data = this.formatJson(filterVal, excelList)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, excelList) {
      return excelList.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style scoped>
.orderMessage{
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
