<script setup>
const props = defineProps({
  id: String,
  name: String
});
</script>

<template>
  <div class="item-card">
    <div class="item-info">
      <h3>{{ name }}</h3>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid #e5e0d8;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: #f5ead7;
  }
}

.item-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
  word-break: break-word;
}

.quantity-display {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
}
</style>