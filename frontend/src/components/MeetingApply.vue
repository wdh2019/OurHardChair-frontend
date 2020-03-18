<template>
  <div id="base_meeting">
     <!--用户信息框-->
    <div class="userinfo">
      <ul>
        <h3>User Information</h3>
        <dl>user: {{info.username}}</dl>
        <dl>password:{{info.password}}</dl>
        <dl>email:{{info.email}}</dl>
        <dl>company:{{info.company}}</dl>
        <dl>country:{{info.country}}</dl>
      </ul>
    </div>
     <!--申请提交表单-->
    <el-form :model="MeetingApplicationForm" :rules="rules" class="meeting_container" label-position="center" label-width="0px" v-loading="loading">
      <!--标题-->
      <h3 class="meeting_title">Meetings Application</h3>
      <!--会议简称-->
      <el-form-item label="Meeting shortname" class="item" prop="shortname">
        <el-input type="text"
                  v-model="MeetingApplicationForm.shortname"
                  auto-complete="off"
                  placeholder="shortname"></el-input>
      </el-form-item>
      <!--会议全称-->
      <el-form-item label="Meeting fullname" class="item" prop="fullname">
        <el-input type="text"
                  v-model="MeetingApplicationForm.fullname"
                  auto-complete="off"
                  placeholder="fullname"></el-input>
      </el-form-item>
      <!--举办时间-->
      <el-form-item label="Holding time" class="item" prop="holdingtime">
        <!--月-->
        <el-select v-model="MeetingApplicationForm.month" v-on:change="getMonthSelected($event)">
          <el-option v-for="month in months" v-bind:key="month.name">{{month.name}}
          </el-option>
        </el-select>
        <!--日-->
        <el-input type="text"
                  v-model="MeetingApplicationForm.day"
                  auto-complete="off"
                  placeholder="day"></el-input>
        <!--年-->
        <el-input type="text"
                  v-model="MeetingApplicationForm.year"
                  auto-complete="off"
                  placeholder="year"></el-input>
      </el-form-item>
      <!--举办地点-->
      <el-form-item label="Holding place" class="item" prop="place">
        <el-input type="text"
                  v-model="MeetingApplicationForm.place"
                  auto-complete="off"
                  placeholder="where to hold it?"></el-input>
      </el-form-item>
      <!--投稿截止日期-->
      <el-form-item label="Deadline for submissions" class="item" prop="submitdeadline">
        <el-input type="text"
                  v-model="MeetingApplicationForm.submitdeadline"
                  auto-complete="off"
                  placeholder="deadline for submissions"></el-input>
      </el-form-item>
      <!--评审结果发布日期-->
      <el-form-item label="Release date of review results" class="item" prop="releasetime">
        <el-input type="text"
                  v-model="MeetingApplicationForm.releasetime"
                  auto-complete="off"
                  placeholder="release time of review results"></el-input>
      </el-form-item>

      <el-form-item class="item" style="width: 100%">
        <el-button type="primary"
                 style="width: 40%;background: #afb4db;border: none"
                 v-on:click="apply">apply</el-button>
        </el-form-item>
      <!--登出-->  
        <p>I want to logout.
        <router-link to="register">
        logout
        </router-link>
      </p>
      </el-form>

  </div>

</template>

<script>
  export default {
    name: 'MeetingApplication',
    data () {
      return {
        //月份
        months:[{name:"January",id:1},
                {name:"February",id:2},
                {name:"March",id:3},
                {name:"April",id:4},
                {name:"May",id:5},
                {name:"June",id:6},
                {name:"July",id:7},
                {name:"August",id:8},
                {name:"September",id:9},
                {name:"October",id:10},
                {name:"November",id:11},
                {name:"December",id:12}],
        //用户信息
        info:{
          username:"xiaoming",
          password:"xiaoming666",
          email:"1830000000@fudan.edu.cn",
          company:"Fudan University",
          country:"China"
        },
        MeetingApplicationForm: {
          shortname: '',
          fullname: '',
          holdingtime:'',
          place:'',
          submitdeadline:'',
          releasetime:''
        },
        rules: {
          shortname:   [{required: true, message: '', trigger: 'blur'}],
          fullname:    [{required: true, message: '', trigger: 'blur'}],
          holdingtime: [{required: true, message: 'holdingtime is required', trigger: 'blur'}],
          place:       [{required: true, message: '', trigger: 'blur'}],
          submitdeadline: [{required: true, message: '', trigger: 'blur'}],
          releasetime: [{required: true, message: '', trigger: 'blur'}],
        },
        loading: false
      }
    },
    created(){this.MeetingApplicationForm.month=this.months[0].name;},
    methods: {
      getMonthSelected(e){
        console.log(e.target);
      },
      apply () {
        this.$axios.post('/', {
          shortname: this.MeetingApplicationForm.shortname,
          fullname: this.MeetingApplicationForm.fullname,
          //注意这里举办时间的拼接
          holdingtime: this.MeetingApplicationForm.month+" "+this.MeetingApplicationForm.day+" "+this.MeetingApplicationForm.year,
          place: this.MeetingApplicationForm.place,
          submitdeadline: this.MeetingApplicationForm.submitdeadline,
          releasetime: this.MeetingApplicationForm.releasetime,
        })
          .then(resp => {
            if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
              this.$store.commit('login', resp.data)
              this.$router.replace({path: '/'})
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
    text-align: left;
    border-radius: 15px;
    background-clip: padding-box;
    width: 350px;
    padding: 15px 15px 15px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .userinfo h3{
    text-align: center;
  }
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
    width: 600px;
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
  /*输入框间距*/
  .el-form-item{
    margin-bottom: 10px;
  }
</style>
