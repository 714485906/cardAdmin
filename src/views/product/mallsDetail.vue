<template>
  <el-container>
    <el-aside width="40%">
      <img width="50%" style="display: block;margin: 20px auto" :src="temp.imgUrl" v-model="temp.imgUrl" alt="">
      <el-upload
        action="http://47.99.37.96:8070/upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="successImg">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="temp.imgUrl" v-model="temp.imgUrl" alt="">
      </el-dialog>
    </el-aside>
    <el-main>Main</el-main>
  </el-container>
</template>
<script>
import { getProductList, PostCreateProduct, PostmodifyProduct } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'mallsDetail',
  components: { Pagination },
  directives: { waves },
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  data() {
    return {
      temp:{
        imgUrl: 'https://mobilecard.chinawjhs.com/uzlq_12-10-1.jpg'
      },
      dialogVisible: false
    }
  },
  methods:{

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
