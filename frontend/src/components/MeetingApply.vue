<template>
  <div id="base_meeting">

    <el-form :model="MeetingApplicationForm" :rules="rules" class="meeting_container" label-position="left"
              label-width="0px" v-loading="loading">
      //标题
      <h3 class="meeting_title">会议开设申请Meetings Application</h3>
      //会议简称
      <el-form-item prop="shortname">
        <el-input type="text"
                  v-model="MeetingApplicationForm.shortname"
                  auto-complete="off"
                  placeholder="shortname"></el-input>
      </el-form-item>
      //会议全称
      <el-form-item prop="fullname">
        <el-input type="text"
                  v-model="MeetingApplicationForm.fullname"
                  auto-complete="off"
                  placeholder="fullname"></el-input>
      </el-form-item>
      //举办时间
      <el-form-item prop="holding time">
        <el-input type="text"
                  v-model="MeetingApplicationForm.holdingtime"
                  auto-complete="off"
                  placeholder="when to hold it?"></el-input>
      </el-form-item>
      //举办地点
      <el-form-item prop="place">
        <el-input type="text"
                  v-model="MeetingApplicationForm.place"
                  auto-complete="off"
                  placeholder="where to hold it?"></el-input>
      </el-form-item>
      //投稿截止日期
      <el-form-item prop="deadline for contributions">
        <el-input type="text"
                  v-model="MeetingApplicationForm.contributiondeadline"
                  auto-complete="off"
                  placeholder="deadline for contributions"></el-input>
      </el-form-item>
      //评审结果发布日期
      <el-form-item prop="release time of review results">
        <el-input type="text"
                  v-model="MeetingApplicationForm.releasetime"
                  auto-complete="off"
                  placeholder="release time of review results"></el-input>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  export default {
    name: 'MeetingApplication',
    data () {
      return {
        MeetingApplicationForm: {
          shortname: '',
          fullname: '',
          holdingtime:'',
          place:'';
          contributiondeadline:'',
          releasetime:''
        },
        rules: {
          shortname: [{required: true, message: '', trigger: 'blur'}],
          fullname: [{required: true, message: '', trigger: 'blur'}],
          holdingtime: [{required: true, message: '', trigger: 'blur'}],
          place: [{required: true, message: '', trigger: 'blur'}],
          contributiondeadline: [{required: true, message: '', trigger: 'blur'}],
          releasetime: [{required: true, message: '', trigger: 'blur'}],
        },
        loading: false
      }
    },
    methods: {
      login () {
        this.$axios.post('/MeetingApply', {
          shortname: this.MeetingApplicationForm.shortname,
          fullname: this.MeetingApplicationForm.fullname,
          holdingtime: this.MeetingApplicationForm.holdingtime,
          place: this.MeetingApplicationForm.place,
          contributiondeadline: this.MeetingApplicationForm.contributiondeadline,
          releasetime: this.MeetingApplicationForm.releasetime,
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              this.$store.commit('login', resp.data)
              this.$router.replace({path: '/'})
            } else{
              alert('提交失败！')
            }
          })
          .catch(error => {
            console.log(error)
            alert('服务器后端出现错误！')
          })
      }
    }
  }
</script>

<style scoped>
  #base_meeting{
    background: url("../assets/background/checkerboard-cross.png") repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }
  .meeting_container{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .meeting_title{
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
</style>
