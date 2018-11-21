<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard },
  data () {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created () {
    var flag = false
    for (var i = 0; i < this.roles.length; i++) {
      if (this.roles[i] === 'admin') {
        flag = true
      }
    }
    if (!flag) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
