<!-- <template>
  <div>Bot昵称：{{ bot_name }}</div>
  <div>Bot战力：{{ bot_rating }}</div>
  <router-view/>
</template>

<script>
import $ from 'jquery'
import {ref} from 'vue'

export default{
  name:"App",
  setup:()=>{
    let bot_name=ref("")
    let bot_rating=ref("");

    $.ajax({
      url: "http://localhost:8080/pk/",
      type: "get",
      success: resp => {
        console.log(resp);
      }
    });
    return {
      bot_name,
      bot_rating
    }
  }
}
</script>
<style>

</style> -->
<template>
  <NavBar/>
  <router-view/>
</template>

<script>
import NavBar from './components/NavBar.vue'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap"

export default {
  components: {
    NavBar
  }
}
    
</script>

<style>
body {
  background-image: url("./assets/background.png");
  background-size: cover;
}
</style>
