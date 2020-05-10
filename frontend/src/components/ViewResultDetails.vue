<template>
  <div class="base_conference">
    <div class="conference_container">
      <div class="title_section">
        <h3 class="title">评分详情</h3>
        <p class="description">评分具体情况见下面内容</p>
      </div>
      <div class="PCMember" v-for="(temp,index) in $route.params.evaluations" :key="index">
        <h2>PCMember{{index+1}}</h2>
        <p>score:<span>{{temp.score}}</span></p>
        <br>
        <p>confidence:<span v-if="temp.confidence===-2">very low</span><span v-if="temp.confidence===-1">low</span><span
          v-if="temp.confidence===1">high</span><span v-if="temp.confidence===2">very high</span></p>
        <br>
        <p>comment:</p>
        <el-input
          type="textarea"
          readonly
          v-model="$route.params.evaluations[index].comment"
          rows="5"
          show-word-limit
        ></el-input>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: "ViewResultDetails",
    data() {
		  return{}
    },
    methods:{
      setMessageStore(){
        localStorage.removeItem("messageStore");
        localStorage.setItem("messageStore", JSON.stringify(this.$route.params));
      },
      goBack(){
        this.$router.push({
          name:'ViewSubmissionRecord',
          params: JSON.parse(localStorage.getItem('viewSubmissionRecord')),
        });
      }
    }
    created() {
      window.addEventListener("beforeunload", this.setMessageStore);
      localStorage.getItem("messageStore") && Object.assign(this.$route.params, JSON.parse(localStorage.getItem("messageStore")));
      if (window.history && window.history.pushState) {
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', this.goBack);
        }
    },
    destroyed() {
      window.removeEventListener('beforeunload',this.setMessageStore);
      window.removeEventListener('popstate', this.goBack);
    }
  }
</script>

<style scoped>
  .base_conference {
    width: 100%;
  }

  .conference_container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 10px auto;
    width: 90%;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    clear: left;
  }

  .PCMember {
    border: 1px solid black;
    padding: 20px;
    border-radius: 15px;
    margin-top: 10px;

  }

  .PCMember p {
    float: left;
    clear:both;
    font-size: 18px;
  }

  .PCMember p span {
    color: red;
    margin-left: 5px;
  }

</style>
