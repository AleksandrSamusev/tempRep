<script setup>
  defineEmits(['close']);
</script>
<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click="$emit('close')">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="$emit('close')">&times;</button>
          <slot></slot>
        </div>
    </div>
  </Teleport>
</template>


<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px 40px;
  border-radius: 5px;
  position: relative;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>