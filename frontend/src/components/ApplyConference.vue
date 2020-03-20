<template>
  <div id="base_conference">

    <div class="conference_container">
      <!--标题-->
      <h3 class="conference_title">会议申请</h3>
     <!--申请提交表单-->
      <el-form :model="ruleForm" :rules="rules"  ref="ruleForm" label-position="left"
              label-width="0px" v-loading="loading">
      <!--会议简称-->
        <el-form-item class="item" prop="shortname">
          <el-input type="text"
                  v-model="ruleForm.shortname"
                  auto-complete="off"
                  placeholder="会议简称"></el-input>
        </el-form-item>
        <!--会议全称-->
        <el-form-item class="item" prop="fullname">
          <el-input type="text"
                  v-model="ruleForm.fullname"
                  auto-complete="off"
                  placeholder="会议全称"></el-input>
        </el-form-item>
        <!--举办时间-->
        <el-form-item class="item" prop="holding_time">
        <!--月-->
          <el-select v-model="ruleForm.month" placeholder="月">
            <el-option label="January" value="January"></el-option>
            <el-option label="February" value="February"></el-option>
            <el-option label="March" value="March"></el-option>
            <el-option label="April" value="April"></el-option>
            <el-option label="May" value="May"></el-option>
            <el-option label="June" value="June"></el-option>
            <el-option label="July" value="July"></el-option>
            <el-option label="August" value="August"></el-option>
            <el-option label="September" value="September"></el-option>
            <el-option label="October" value="October"></el-option>
            <el-option label="November" value="November"></el-option>
            <el-option label="December" value="December"></el-option>
          </el-select>
          <!--日-->
          <el-input type="text"
                  v-model="ruleForm.day"
                  auto-complete="off"
                  placeholder="日"></el-input>
          <!--年-->
          <el-input type="text"
                  v-model="ruleForm.year"
                  auto-complete="off"
                  placeholder="年"></el-input>
        </el-form-item>
        <!--举办地点-->
        <el-form-item class="item" prop="place">
        <el-input type="text"
                  v-model="ruleForm.place"
                  auto-complete="off"
                  placeholder="举办地点"></el-input>
        </el-form-item>
        <!--投稿截止日期-->
        <el-form-item class="item" prop="submit_deadline">
        <el-input type="text"
                  v-model="ruleForm.submit_deadline"
                  auto-complete="off"
                  placeholder="投稿截止日期"></el-input>
        </el-form-item>
        <!--评审结果发布日期-->
        <el-form-item class="item" prop="release_time">
          <el-input type="text"
                  v-model="ruleForm.release_time"
                  auto-complete="off"
                  placeholder="评审结果发布日期"></el-input>
        </el-form-item>

        <el-form-item class="item" style="width: 100%">
          <el-button type="success" round @click="submitForm(ruleForm)" class="middle_button">申请</el-button>
        </el-form-item>
      <!--登出-->
        <p class="tip">我要登出！
        <router-link to="/" class="router_link_active">
         登出
        </router-link>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ConferenceApplication',
    data () {
      return {
        ruleForm: {
          shortname: '',
          fullname: '',
          holding_time:'',
          place:'',
          submit_deadline:'',
          release_time:''
        },
        rules: {
          shortname:   [{required: true, message: '会议简称不能为空', trigger: 'blur'}],
          fullname:    [{required: true, message: '会议全称不能为空', trigger: 'blur'}],
          holding_time: [{required: true, message: '举办时间不能为空', trigger: 'blur'}],
          place:       [{required: true, message: '举办地点不能为空', trigger: 'blur'}],
          submit_deadline: [{required: true, message: '投稿截止日期不能为空', trigger: 'blur'}],
          release_time: [{required: true, message: '评审结果发布日期不能为空', trigger: 'blur'}],
        },
        loading: false
      }
    },
    methods: {
      getMonthSelected(e){
        console.log(e.target);
      },
      submitForm (formName) {
        this.$axios.post('/ApplyConference', {
          shortname: this.ruleForm.shortname,
          fullname: this.ruleForm.fullname,
          //注意这里举办时间的拼接
          holding_time: this.ruleForm.month+" "+this.ruleForm.day+","+this.ruleForm.year,
          place: this.ruleForm.place,
          submit_deadline: this.ruleForm.submit_deadline,
          release_time: this.ruleForm.release_time,
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              this.$router.replace({path: '/ApplyConference'})
            } else{
              alert('apply error！')
            }
          })
          .catch(error => {
            console.log(error)
            alert('wrong submit！')
          })
      }
    }
  }
</script>

<style scoped>
  .userinfo{
    float:left;
    text-align: left;
    border-radius: 15px;
    background-clip: padding-box;
    width: 350px;
    padding: 15px 15px 15px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .userinfo ul{
    padding:0;
  }

  .userinfo h3{
    text-align: center;
  }

  #base_conference{
    background: url("../assets/background/checkerboard-cross.png") repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .conference_container{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 600px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    clear:left;
  }

  .conference_title{
    margin: 0px auto 40px auto;
    text-align: center;
    color: #494e8f;
  }

  .conference_container .item {
    margin-bottom: 20px;
  }

  .conference_container .item .middle_button {
    width: 30%;
    border: none
  }

  .router_link_active{
    text-decoration: none;
    color: #ff5a60;

  }
  .router_link_active:hover{
    color: #55b6ff;
  }
  .tip{
    margin-top: 40px;
    font-size: 15px;
    margin-left: 300px;

  }
</style>
