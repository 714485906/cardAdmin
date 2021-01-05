<template>
  <div class="app-container">
    <div class="filter-container">
<!--      <el-input v-model="listQuery.productCode" placeholder="商品编码" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-input v-model="listQuery.productName" placeholder="商品名称" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-input v-model="listQuery.operatorProductId" placeholder="运营商侧商品" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-select v-model="listQuery.operatorId" placeholder="运营商" clearable class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in operatorData" :key="item.operatorId" :label="item.operatorName" :value="item.operatorId" />-->
<!--      </el-select>-->
<!--      <el-select v-model="listQuery.productStatus" placeholder="商品状态" clearable class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in productStatusData" :key="item.key" :label="item.name" :value="item.key" />-->
<!--      </el-select>-->
<!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
<!--        搜索-->
<!--      </el-button>-->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
<!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
<!--        导出-->
<!--      </el-button>-->
    </div>
    <div style="margin-bottom: 15px"></div>
  <div style="width: 100%;height: 100%;">
    <el-row>
      <el-col :span="4" v-for="(item) in list" :key="item.id" :offset="1">
        <router-link :to="{path:'/mallsDetail',query:{res:JSON.stringify(item)}}">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <img :src="item.imgUrl" class="image">
            <div style="padding: 12px;">
              <h4>{{item.productName}}</h4>
              <span style="font-size:12px;color:#aaa">{{item.comment2}}</span>
              <div><span>佣金：</span><span style="color:red">￥{{item.commission /1000}}</span></div>
              <div class="bottom clearfix">
                <el-button type="text" class="button">
                  <span style="color: #000;font-size: 14px">运营商:</span>{{item.operatorName}}
                </el-button>
                <br>
                <el-tag type="warning" v-if="item.productStatus == 0">不可用</el-tag>
                <el-tag type="success" v-if="item.productStatus == 1">正常</el-tag>
              </div>
            </div>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="temp.productName" />
        </el-form-item>
        <el-form-item label="运营商" prop="operatorId">
          <el-select v-model="temp.operatorId" placeholder="运营商名称" clearable class="filter-item" >
            <el-option v-for="item in operatorData" :key="item.operatorId" :label="item.operatorName" :value="item.operatorId"  />
          </el-select>
        </el-form-item>
        <el-form-item label="运营商侧商品Id" prop="operatorProductId">
          <el-input v-model="temp.operatorProductId" />
        </el-form-item>
        <el-form-item label="商品编码" prop="productCode">
          <el-input v-model="temp.productCode" />
        </el-form-item>
        <el-form-item label="商品简介" prop="productSummary">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.productSummary">
          </el-input>
        </el-form-item>
        <el-form-item label="商品佣金(元)" prop="commission">
          <el-input v-model="temp.commission" placeholder="请输入商品佣金" />
        </el-form-item>
        <el-form-item label="主图链接" prop="imgUrl">
          <el-upload
            action="http://47.99.37.96:8070/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="successImg">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-input v-model="temp.imgUrl" v-show="false"/>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="temp.imgUrl" v-model="temp.imgUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="归属地" prop="ownPlace">
          <el-input
            type="text"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.ownPlace">
          </el-input>
        </el-form-item>
        <el-form-item label="配送方式" prop="deliveryMode">
          <el-input
            type="text"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.deliveryMode">
          </el-input>
        </el-form-item>
        <el-form-item label="不发货地址" prop="shieldArea">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.shieldArea">
          </el-input>
        </el-form-item>
        <el-form-item label="可发货年龄" prop="allowableAge">
          <el-input
            type="text"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.allowableAge">
          </el-input>
        </el-form-item>
        <el-form-item label="结算周期" prop="settlementCycle">
          <el-input
            type="text"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.settlementCycle">
          </el-input>
        </el-form-item>
        <el-form-item label="结算要求" prop="settlementRules">
          <el-input
            type="text"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.settlementRules">
          </el-input>
        </el-form-item>
        <el-form-item label="优势" prop="advantage">
          <el-input
            type="text"
            :rows="2"
            placeholder="请输入内容"
            v-model="temp.advantage">
          </el-input>
        </el-form-item>
        <el-form-item label="商品状态" prop="productStatus" v-if="false">
          <el-radio-group v-model="temp.productStatus">
            <el-radio :label="0" :value="0">禁用</el-radio>
            <el-radio :label="1" :value="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProductList, PostCreateProduct, PostmodifyProduct } from '@/api/product'
import { getOperatorList } from '@/api/operator'
import { getPlatformList } from '@/api/platform'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 8,
        operatorId: undefined,
        operatorProductId: undefined,
        productCode: undefined,
        productName: undefined,
        productStatus: undefined
      },
      importanceOptions: [1, 2, 3],
      operatorData: undefined,
      productStatusData: [
        { key: '1', name: '正常' },
        { key: '0', name: '不可用' }
      ],
      getUserListData: '',
      platformData: '',
      Rolelist: '',
      groupList: '',
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        operatorId: undefined,
        operatorProductId: undefined,
        productName: undefined,
        productCode: undefined,
        productSummary: undefined,
        imgUrl: undefined,
        commission: undefined,
        ownPlace:undefined,
        deliveryMode:undefined,
        shieldArea:undefined,
        allowableAge:undefined,
        settlementCycle:undefined,
        settlementRules:undefined,
        advantage:undefined

      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑商品',
        create: '添加商品'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        operatorId: [{ required: true, message: '请选择运营商', trigger: 'change' }],
        operatorProductId: [{ required: true, message: '请输入运营商侧的商品Id', trigger: 'blur' },
          { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }],
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }],
        productCode: [{ required: true, message: '请输入商品编码', trigger: 'blur' },
          { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }],
        productStatus: [{ required: true, message: '请选择商品状态', trigger: 'change' }]
      },
      downloadLoading: false,
      data2: [],
      dialogVisible: false
    }
  },
  created() {
    this.getList()
    this.getOperatorListFun()

  },
  methods: {
    getList() {
      this.listLoading = true
      getProductList(this.listQuery).then(response => {
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
        operatorId: undefined,
        operatorProductId: undefined,
        productName: undefined,
        productCode: undefined,
        productSummary: undefined,
        commission: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //console.log(this.temp)
          this.temp.commission =  this.temp.commission *100
          PostCreateProduct(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '成功创建',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList); //文件列表移除文件时的钩子
    },
    handlePictureCardPreview(file) {  //点击文件列表中已上传的文件时的钩子
      this.temp.imgUrl = file.url;
      this.dialogVisible = true;
    },
    successImg(response){
      this.temp.imgUrl = response.data;  //文件上传成功时的钩子
    },
    getOperatorListFun() { // 获取运营商列表
      getOperatorList({
        pageNo: 1,
        pageSize: 10000
      }).then(response => {
        this.operatorData = response.data
      })
    }
  }
}
</script>
<style scoped>
.image {
  width: 100%;
  display: block;
}
.el-col{
  margin-top: 10px;
}
</style>
