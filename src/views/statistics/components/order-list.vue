<template>
  <div class="app-container">
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
      <el-table-column label="运营商订单ID" min-width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.operatorOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人姓名" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请号码" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.applyPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份名称" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.provinceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市名称" min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县名称" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.districtName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请号码省份" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.applyProvinceName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="申请号码城市" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.applyCityName }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="发货时间" width="260px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.deliveryTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="激活时间" width="260px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.activateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值时间" width="260px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.rechargeTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="商品佣金/(分)" fixed="right" min-width="120px" align="center" show-overflow-tooltip>-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span class="link-type">{{ row.rechargeFee }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="订单状态" fixed="right" class-name="status-col" width="120" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag v-if="row.orderStatus == 0" type="info">待提交</el-tag>
          <el-tag v-if="row.orderStatus == 1">已提交</el-tag>
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
      queryResData: undefined,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
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
        { orderStatus: 0, name: '待提交' },
        { orderStatus: 1, name: '已提交' },
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
    if (this.$route.query.rowList) {
      this.queryResData = JSON.stringify(this.$route.query.rowList)
      console.log(this.queryResData)
      console.log(JSON.stringify(this.$route.query.rowList.accountId))
      this.listQuery.accountId = JSON.stringify(this.$route.query.rowList.accountId)
      const costDateTime = [this.$route.query.rowList.costDate]
      console.log(costDateTime[0])
      this.listQuery.beginCreateTime = costDateTime[0]
      this.listQuery.endCreateTime = costDateTime[0]
    }

    this.getList() // 初始数据
    // this.accountIdDataFun() // 账号名称
    // this.getOperatorListDataFun() // 获取运营商
    // this.getChannelListDataFun() // 获取渠道
    // this.getPlatformListDataFun() // 获取平台
    // this.getProductListDataFun() // 产品名称
    // this.getGetTouchesDataFun() // 触点码
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
