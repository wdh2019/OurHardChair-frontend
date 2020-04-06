<template>
  <div class="base">
    <div class="container">
      <div class="title_section">
      <h1 class="title">消息中心</h1>
      <p class="description">在此查看近期收到的消息</p>
      </div>
      <div class="body_section" v-for="anews in news" :key="anews.index">
        <p>{{analyseNews(anews.sender,anews.type,anews.meeting)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
	export default{
		data(){
			return{
         news:[{
           sender: "胡图图",
           type: "邀请",
           meeting: "第一会议",
         },
         {
           sender: "胡图图",
           type: "邀请",
           meeting: "第二会议",
         },
         {
           sender: "胡图图",
           type: "邀请",
           meeting: "第三会议",
         },
         ]
			}
		},
    methods:{
        analyseNews(sender,type,meeting){
          if(type=="邀请"){
            return "您收到了来自 "+sender+" 的邀请消息：邀请您作为 PC member 参加 "+meeting;
          }
        }
    },
    created(){
      //一开始就向后端请求消息
    /*
	  const _this = this;
	  this.$axios.post('/NewsCenter')
      .then(resp => {
        if (resp.status === 200 && resp.data.hasOwnProperty("token")) {
            _this.news = resp.data.news;
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
      */
    }
	}
</script>

<style scoped>
  .container {
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
  .body_section{
    margin-top: 40px;
    padding-left:20px;
    text-align: left;
  }
</style>
