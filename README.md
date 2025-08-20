# @c5vagas/gsap-vue

[![npm version](https://img.shields.io/npm/v/gsap-vue)](https://www.npmjs.com/package/gsap-vue)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen)](https://vuejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.x-blue)](https://greensock.com/gsap/)
[![Demo Online](https://img.shields.io/badge/demo-online-brightgreen)](https://TU_USUARIO.github.io/NOMBRE_REPO/)

A Vue 3 Composable for using GSAP with context, inspired by [@gsap/react](https://github.com/greensock/react).

## Features

* Fully compatible with Vue 3 Composition API
* Easy GSAP context handling
* Supports dynamic scope
* Optional dependency tracking
* Headless mode for SSR or non-browser environments

## Installation

```bash
npm install gsap gsap-vue
# or
yarn add gsap gsap-vue
```

## Basic Usage

```vue
<script setup lang="ts">
import { useGSAP } from "gsap-vue";
import { ref } from "vue";
import gsap from "gsap";

const box = ref<HTMLDivElement | null>(null);

useGSAP(() => {
  gsap.to(box.value, { x: 100, duration: 1 });
}, { scope: box });
</script>

<template>
  <div ref="box">Animated</div>
</template>
```

## API

* `useGSAP(callback, dependencies?)` — Core composable for GSAP animations.
* `useGSAP.register(core: typeof gsap)` — Replace GSAP core if needed.
* `useGSAP.headless = true` — Enable headless mode for SSR or tests.

## Demo 🚀 [Try the live demo](https://stackblitz.com/edit/vitejs-vite-teslnzdm?file=index.html)

Check the [demo folder](./demo) for examples of usage.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

MIT License © [c5vagas](https://github.com/c5vagas)
