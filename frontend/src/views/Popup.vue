<template>
  <div v-if="modelValue" class="popup-overlay" @click.self="$emit('update:modelValue', false)">
    <div class="popup-content">
      <slot></slot>
      <button @click="$emit('update:modelValue', false)" class="close-button">
        Fermer
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
});
defineEmits(['update:modelValue']);
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.close-button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
