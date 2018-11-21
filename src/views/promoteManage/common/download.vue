<template>
  <a :href="downloadUrl">
    <el-button type="primary" size="mini">
    <i class="el-icon-download"></i>
    模版下载
    </el-button>
  </a>
</template>
<script>
export default {
  props: {
    downloadType: {
      type: Number,
      require: true
    }
  },
  data () {
    return {
      downloadHostName: ''
    }
  },
  mounted () {
    const hostname = location.hostname
    if (hostname === 'statics-stg.sdb.com.cn') {
      this.downloadHostName = 'http://portal-stg.sdb.com.cn'
    } else {
      this.downloadHostName = 'http://portal.pab.com.cn'
    }
  },
  computed: {
    downloadUrl () {
      return `${this.downloadHostName}/credit/paces-emall-admin/emp/admin/coupon/downloadTemplate.do?id=${this.downloadType}`
    }
  }
}
</script>
