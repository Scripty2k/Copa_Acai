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
  border: 1px solid #e5e0d8;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  background: #fff;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: #f5ead7;
}

.post-card h2 {
  margin-top: 0;
  color: var(--text-color);
  font-size: 1.5rem;
}

.post-card a {
  color: var(--primary-color, #f5ead7);
  text-decoration: underline;
  transition: color 0.2s ease;
}

.post-card a:hover {
  color: #f5ead7;
}
</style>