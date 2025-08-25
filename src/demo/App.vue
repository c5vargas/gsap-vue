<template>
  <div ref="containerRef" class="demo-container">
    <h1>Vue GSAP Composable Demo</h1>
    <p>Ejemplo de uso del composable <code>useGSAP</code> con animaciones sencillas.</p>

    <div ref="box" class="box"></div>

    <div class="controls">
      <button @click="playAnimation">Animar</button>
      <button @click="revertAnimation">Revertir</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useGSAP } from "../index.js";
import gsap from "gsap";

const box = ref(null);
const containerRef = ref(null)

const { contextSafe } = useGSAP(() => {
  gsap.to(box.value, {
    x: 300,
    rotation: 360,
    backgroundColor: "#ff4f4f",
    duration: 2,
    ease: "power2.inOut"
  });
}, { scope: containerRef });

const playAnimation = contextSafe(() => {  
  gsap.to(box.value, {
    x: 300,
    rotation: 360,
    backgroundColor: "#ff4f4f",
    duration: 2,
    ease: "power2.inOut"
  });
});

const revertAnimation = contextSafe(() => {
  gsap.to(box.value, {
    x: 0,
    rotation: 0,
    backgroundColor: "#4f46e5",
    duration: 1.5,
    ease: "power2.inOut"
  });
});
</script>

<style>
.demo-container {
  font-family: "Inter", sans-serif;
  padding: 2rem;
  text-align: center;
}

h1 {
  margin-bottom: 0.5rem;
  color: #333;
}

p {
  margin-bottom: 2rem;
  color: #555;
}

.box {
  width: 100px;
  height: 100px;
  background-color: #4f46e5;
  margin: 0 auto 2rem auto;
  border-radius: 12px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #4f46e5;
  color: white;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #3730a3;
}
</style>
