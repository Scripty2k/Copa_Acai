<script setup>
defineProps({
  title: String
});
</script>

<template>
  <div class="post-card">
    <h2>{{ title }}</h2>
  </div>
</template>

<style scoped>
.post-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: #fff;
}
.post-card h2 {
  margin-top: 0;
}
.post-card a {
  color: var(--primary-color, #f5ead7);
  text-decoration: underline;
}
</style>