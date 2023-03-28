<!-- <template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="#">king of bots</a>
        <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="#">对战</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">对局列表</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Princing</a>
                </li>
            </ul>
            <span class="navbar-text">
                Navbar 
            </span>
        </div>
    </div>
</nav>
</template>
<script>
</script> -->
<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">King Of Bots</a>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link :class="route_name == 'pk_index' ? 'nav-link active' : 'nav-link'" :to="{name: 'pk_index'}">对战</router-link>
            </li>
            <li class="nav-item">
              <router-link :class = "route_name == 'RecordIndex' ? 'nav-link active' : 'nav-link'" :to="{name: 'RecordIndex'}">对局列表</router-link>
            </li>
            <li class="nav-item">
              <router-link :class = "route_name == 'RanklistIndex' ? 'nav-link active' :  'nav-link' " :to="{name: 'RanklistIndex'}">排行榜</router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                dmd
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><router-link class="dropdown-item" :to="{name: 'UserBotIndex'}">我的Bot</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click="logout">退出</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </template>
    
    <script>
    import { useRoute } from 'vue-router'
    import { computed } from 'vue'
    import { useStore } from 'vuex';
    
    export default {
        setup() {
            const store = useStore();
            const route = useRoute();
            let route_name = computed(() => route.name)
    
            const logout = () => {
              store.dispatch("logout");
            }
    
            return {
                route_name,
                logout
            }
        }
    }
    </script>
    
    <style scoped>
    
    </style>
    