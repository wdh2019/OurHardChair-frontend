<template>
  <div class="base">
    <div class="container">
      <div class="title_section">
      <h1 class="title">消息中心</h1>
      <p class="description">在此查看近期收到的消息</p>
      </div>
    </div>
  </div>
</template>

<script>
	export default{
		data(){
			return{

			}
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
</style>
