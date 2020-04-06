<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">我主持的会议</h3>
        <p class="description">在此查看已申请的会议</p>
      </div>
      <!--会议单元-->
      <div class="conference_cell" v-for="conference in conferences" v-bind:key="conference.index">
        <div class="title_section" v-bind:class="changeColor(conference.status)">
          <h3>{{conference.shortname}}</h3>
        </div>
        <div class="body_section">
          <p><span>会议简称：</span>{{conference.fullname}}</p>
          <p><span>举办地点：</span>{{conference.place}}</p>
          <p><span>举办日期：</span>{{conference.start_date}}</p>
          <p><span>截止日期：</span>{{conference.deadline_date}}</p>
          <p><span>发布日期：</span>{{conference.release_date}}</p>
          <el-tag v-bind:type="changeColor1(conference.status)">{{conference.status}}</el-tag>
        </div>
      </div>

  </div>
  </div>
</template>

<script>
    export default {
      name: "ConferenceForChair",
      data(){
        return{
          conferences:[],
        }
      },
      methods:{
        //为标题背景换色
        changeColor:function(status){
             return{
              success:status=="已通过",
              primary:status=="审核中",
              danger:status=="未通过",
            }
        },
        //为状态tag换色
        changeColor1:function(status){
            if(status=="已通过") return 'success';
            if(status=="审核中") return 'primary';
            if(status=="未通过") return 'danger';
        }
      },
      created(){
       //一开始就向后端请求已申请的会议

       const _this = this;
       this.$axios.post('/ConferenceForChair')
       .then(resp => {
         if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
             _this.conferences = resp.data.meetings;
         }else {
           this.$message({
             showClose: true,
             message: resp.data.message,
             type:'warning'
           });
         }
       })
       .catch(error => {
         console.log(error);
         this.$message({
           showClose: true,
           message: '请求我主持的会议失败',
           type:'warning'
         });
       })

      }
    }
</script>

<style scoped>
  .conference_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    width: 1500px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    clear: left;
  }
  .title {
    margin: 20px auto;
    padding-left: 20px;
    text-align: left;
    color: #494e8f;
    font-size:24px;
    font-weight: normal;
  }
  p.description{
    text-align: left;
    padding-top: 10px;
    padding-left: 20px;
    color: #999;
    line-height: 1.4285;
    font-size: 14px;
  }
  .conference_cell{
    display:inline-block;
    margin:30px 20px 30px 20px;
    width:25%;
    text-align: left;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .conference_cell .title_section.success{
    background-color: #67C23A;
  }
  .conference_cell .title_section.primary{
    background-color: #409EFF;
  }
  .conference_cell .title_section.danger{
    background-color: #F56C6C;
    color: white;
  }
  .conference_cell .title_section h3{
    margin:0;
    padding:15px 0 15px 20px;
  }
  .conference_cell .body_section{
    padding:10px 10px 10px 15px
  }
  .conference_cell .body_section p span{
    font-family:Avenir, Helvetica, Arial, sans-serif;
    font-size:1em;
    font-weight: bold;
  }
</style>
