<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.applyPhone" placeholder="申请号码" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contactName" placeholder="申请人姓名" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.contactPhone" placeholder="申请人联系电话" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.applyStatus" placeholder="渠道状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in applyStatusData" :key="item.applyStatus" :label="item.applyStatusName" :value="item.applyStatus" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleResetApply">
        手动批量提交 {{multipleSelection.length}}
      </el-button>


    </div>
    <div style="margin-bottom: 15px"></div>
    <el-table
      ref="deficiencyTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      :row-key="getRowKeys"
      >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="45"
        align="center"
        :selectable="checkSelectable"
        fixed="left"></el-table-column>
<!--      <el-table-column label="applyId" prop="id" sortable="custom" align="center" width="120">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.applyId }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="申请人姓名"min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人身份证号" width="180px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.idNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人联系电话"min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.contactPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份名称" width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.provinceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市名称" width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.cityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县名称" width="140px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.districtName }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="申请号码省份名称" width="140px" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span class="link-type">{{ row.applyProvinceName }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="申请号码城市名称" width="140px" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span class="link-type">{{ row.applyCityName }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="收件详细地址"  min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新号码"min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{row.applyPhone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="选号"min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
<!--          <el-button type="primary" size="mini" @click="handleUpdate(row)">预占号</el-button>-->
          <el-button type="primary" size="mini" @click="handleUpdate(row)">预占号码</el-button>
        </template>
      </el-table-column>
      <el-table-column label="平台标识"  min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道标识"  min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号标识"  min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称"  min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营商"  min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.operatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营销组"  min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{row.groupName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="营销员"  min-width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span class="link-type">{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="260px" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" fixed="right" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
            <el-tag type="info" v-if="row.applyStatus == 0">待提交</el-tag>
            <el-tag type="success" v-else-if="row.applyStatus == 1">已提交</el-tag>
          <el-tag type="danger" v-else-if="row.applyStatus == 2">提交失败</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" fixed="right" align="center" width="120px" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="{row, $index}">-->
<!--          <el-button type="primary" size="mini" @click="handleUpdate(row)">-->
<!--            预占号-->
<!--          </el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="6"
                v-for="(item,index) in preemptPhoneData"
                style="padding: 10px 0;text-align: center"
                :key="index"
                v-loading="listLoading"
                :class="{active:currentIndex === index}"
                @click.native="liClick(index,item)"
        >{{item}}</el-col>
      </el-row>
      <el-row>
        <p style="text-align: center" @click="ChangeNumber">换一批</p>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getapplyList, PostResetApply, PostsubmitApply, getPhones ,PostpreemptPhone } from '@/api/apply'
import { getProductList } from '@/api/product'
import { getgetAccounts, PostcreateChannel } from '@/api/channel'
import { getGetTouches } from '@/api/operator'
import { PostCreatePackage } from '@/api/package'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { Message } from 'element-ui'

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: 'packageListSelection',
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
        applyPhone: undefined,
        contactName: undefined,
        contactPhone: undefined,
        applyStatus: undefined,
        packageId: ''
      },
      multipleSelection: [],
      importanceOptions: [1, 2, 3],
      channelStatusData: [
        { channelStatus: '0', channelStatusName: '待审核' },
        { channelStatus: '1', channelStatusName: '审核成功' },
        { channelStatus: '2', channelStatusName: '审核失败' }
      ],
      channelTypeData: [
        { channelType: '1', channelTypeName: '自运营' },
        { channelType: '2', channelTypeName: '代运营' }

      ],
      getUserListData: '',
      platformData: '',
      Rolelist: '',
      groupList: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        applyIds: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '选择号码',
        create: '打包'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        channelName: [{ required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }],
        userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
        platformId: [{ required: true, message: '请选择平台', trigger: 'change' }],
        channelType: [{ required: true, message: '请选择状态', trigger: 'change' }],
        channelStatus: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      downloadLoading: false,
      applyStatusData: [
        {applyStatus: 0, applyStatusName: '待提交'},
        {applyStatus: 1, applyStatusName: '已提交'},
        {applyStatus: 2, applyStatusName: '提交失败'}
      ],
      preemptPhoneData: [],
      ChangeNumberlistQuery: {
        landingId:'',
        provinceId:'',
        cityId:'',
        pageNo: 1,
        pageSize: 12
      },
      ActiveNumber: {
        applyId: undefined,
        applyPhone: undefined
      },
      currentIndex: 0,
      accountsData: '',
      getProductData : '',
      touchData: ''
    }
  },
  created() {
    this.listQuery.packageId = this.$route.params.packageId
    this.getList();
    this.getgetAccountsDataFun();
    this.getProductListDataFun();
    this.getGetTouchesDataFun()
  },
  methods: {
    getList() {
      this.listLoading = true
      getapplyList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.page.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 500)
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    checkSelectable(row) {
      if(row.applyStatus == 1 ){
        return false // 禁止选中
      }else{
        return true  // 允许选中
      }
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        userId: undefined,
      }
    },
    handleUpdate(row) {  //显示预选号码
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.ChangeNumberlistQuery.pageNo = 1
      this.ChangeNumberlistQuery.landingId = row.landingId
      this.ChangeNumberlistQuery.provinceId = row.provinceId
      this.ChangeNumberlistQuery.cityId = row.cityId
      this.ActiveNumber.applyId = row.applyId
      this.ChangeNumber() //获取号码池 号码
    },
    liClick(index,tel){
      this.currentIndex = index
      this.ActiveNumber.applyPhone = tel
    },
    updateData() {
      // alert('你选中的号码是'+ this.ActiveNumber.applyPhone + '你的applyId是='+this.ActiveNumber.applyId );
      if(this.ActiveNumber.applyPhone!= ''){
        this.$confirm(`你当前选着的号码是${this.ActiveNumber.applyPhone},是否预占当前号码`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          PostpreemptPhone(this.ActiveNumber).then(response => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      }else{
        this.$message({
          type: 'warning',
          message: '请选择手机号!!!!!!!!'
        });
      }

      this.dialogFormVisible = false
    },
    handleResetApply() {
      if (!this.multipleSelection.length) {
        Message({
          message: '请选择订单',
          type: 'error',
          duration: 3 * 1000
        })
      }else{
        let excelList = this.copyArr(this.multipleSelection);
        let ids = []; // 获取选中的applyId
        for (let item of excelList) {
          ids.push(item.applyId);
        }
        this.temp.applyIds = ids;
        this.$confirm(`是否确定手动批量提交`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          PostsubmitApply(this.temp.applyIds).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '成功提交',
              type: 'success',
              duration: 2000
            })
            this.$refs.deficiencyTable.clearSelection();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });

      }
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
            this.$refs.deficiencyTable.clearSelection();
          })
        }
      })
    },
    toggleDeficiencySelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.deficiencyTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.deficiencyTable.clearSelection();
      }
    },
    getRowKeys(row) {
      return row.applyId;
    },
    handleSelectionChange: function (val) {
      this.multipleSelection = val;
    },
    handleaccount(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    PostResetApplyFun(ids) { // 二次分配
      this.$confirm('是否确认二次分配操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          console.log(ids)
        PostResetApply(ids).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    PostsubmitApplyFun(ids) { // 手动批量提交
      this.$confirm('是否确认手动批量提交操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(ids)
        PostsubmitApply(ids).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    ChangeNumber() { // 请求预选号码池
      this.ActiveNumber.applyPhone = ''
      this.currentIndex = ''
      getPhones(this.ChangeNumberlistQuery).then(response => {
        this.preemptPhoneData = response.data // 获取手机号
        this.ChangeNumberlistQuery.pageNo ++
      })
    },
    copyArr(arr) {
      return arr.map(e => {
        if (typeof e === "object") {
          return Object.assign({}, e);
        } else {
          return e;
        }
      });
    },
    getgetAccountsDataFun() {
      getgetAccounts({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.accountsData = response.data // 获取账号
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
        pageSize: 10000
      }).then(response => {
        this.touchData = response.data // 获取触点码
      })
    }

  }
}
</script>
<style scoped>
.active{
  color: red;;
}
</style>
