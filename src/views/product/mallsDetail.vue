<template>
  <el-container>
    <el-aside width="40%">
      <img v-model="temp.imgUrl" width="50%" style="display: block;margin: 20px auto" :src="temp.imgUrl" alt="">
      <el-upload
        action="http://47.99.37.96:8070/upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="successImg"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img v-model="temp.imgUrl" width="100%" :src="temp.imgUrl" alt="">
      </el-dialog>
    </el-aside>
    <el-main>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="130px" style="width: 400px; margin-left:50px;">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="temp.productName" />
        </el-form-item>
        <el-form-item label="运营商" prop="operatorId">
          <el-select v-model="temp.operatorId" placeholder="运营商名称" clearable class="filter-item">
            <el-option v-for="item in operatorData" :key="item.operatorId" :label="item.operatorName" :value="item.operatorId" />
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
            v-model="temp.productSummary"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="商品佣金(元)" prop="commission">
          <el-input v-model="temp.commission" />
        </el-form-item>
        <el-form-item label="主图链接" prop="imgUrl">
          <el-input v-model="temp.imgUrl" disabled />
        </el-form-item>
        <el-form-item label="归属地" prop="ownPlace">
          <el-input
            v-model="temp.ownPlace"
            type="text"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="配送方式" prop="deliveryMode">
          <el-input
            v-model="temp.deliveryMode"
            type="text"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="不发货地址" prop="shieldArea">
          <el-input
            v-model="temp.shieldArea"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="可发货年龄" prop="allowableAge">
          <el-input
            v-model="temp.allowableAge"
            type="text"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="结算周期" prop="settlementCycle">
          <el-input
            v-model="temp.settlementCycle"
            type="text"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="结算要求" prop="settlementRules">
          <el-input
            v-model="temp.settlementRules"
            type="text"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="优势" prop="advantage">
          <el-input
            v-model="temp.advantage"
            type="text"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="商品状态" prop="productStatus">
          <el-radio-group v-model="temp.productStatus">
            <el-radio :label="0" :value="0">禁用</el-radio>
            <el-radio :label="1" :value="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-left: 50px" @click="updateData">
        修改信息
      </el-button>
    </el-main>
  </el-container>
</template>
<script>
import { getProductList, PostCreateProduct, PostmodifyProduct } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getOperatorList } from '@/api/operator' // secondary package based on el-pagination

export default {
  name: 'MallsDetail',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  data() {
    return {
      temp: undefined,
      dialogVisible: false,
      operatorData: undefined
    }
  },
  created() {
    this.temp = JSON.parse(this.$route.query.res)
    this.temp.commission = this.temp.commission / 100
    this.getOperatorListFun()
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList) // 文件列表移除文件时的钩子
    },
    handlePictureCardPreview(file) { // 点击文件列表中已上传的文件时的钩子
      this.temp.imgUrl = file.url
      this.dialogVisible = true
    },
    successImg(response) {
      this.temp.imgUrl = response.data // 文件上传成功时的钩子
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.commission = this.temp.commission * 100
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          PostmodifyProduct(tempData).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.$router.go(-1)// 返回上一级
          })
        }
      })
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
<style>
    .info_box {
        padding: 30px
    }

    .imgDetail {
        padding: 30px 80px
    }

    .imgStyle {
        display: block;
    }
</style>
