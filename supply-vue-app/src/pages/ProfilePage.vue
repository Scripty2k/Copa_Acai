<script setup>
import SideBar from '../components/SideBar.vue';

</script>

<template>
  <div class="layout">
    <SideBar />
    <div class="main-content">
        <div class="profile">
            <h1>Profile Page</h1>
        </div>
    </div>
  </div>
</template>


<style scoped lang="scss">

// sidebar/layout styles

.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  border-right: 1px solid #ccc;
  padding: 2rem 1rem;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

// end sidebar/layout styles

.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

</style>