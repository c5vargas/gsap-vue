import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import gsap from "gsap";

let _gsap = gsap;
const isConfig = (value) =>
  value && !Array.isArray(value) && typeof value === "object";
const emptyArray = [];
const defaultConfig = {};

export function useGSAP(callbackOrConfig, depsOrConfig) {
  let callback = null;
  let dependencies = emptyArray;
  let config = defaultConfig;

  if (isConfig(callbackOrConfig)) {
    config = callbackOrConfig;
    dependencies = config.dependencies || emptyArray;
  } else {
    callback = callbackOrConfig;
    if (isConfig(depsOrConfig)) {
      config = depsOrConfig;
      dependencies = config.dependencies || emptyArray;
    } else {
      dependencies = depsOrConfig || emptyArray;
    }
  }

  if (callback && typeof callback !== "function") {
    console.warn("First parameter must be a function or config object");
  }

  const { scope, revertOnUpdate } = config;
  const mounted = ref(false);
  const context = ref(_gsap.context(() => {}, scope));

  const contextSafe = (func) => context.value.add(func);
  const deferCleanup = dependencies.length > 0 && !revertOnUpdate;

  onMounted(() => {
    mounted.value = true;
    if (callback) {
      context.value.add(callback, scope);
    }
  });

  onBeforeUnmount(() => context.value.revert());

  if (dependencies.length > 0) {
    watch(
      dependencies,
      () => {
        if (callback) {
          context.value.add(callback, scope);
        }
        if (!deferCleanup || !mounted.value) {
          context.value.revert();
        }
      },
      { immediate: true }
    );
  }

  return { context: context.value, contextSafe };
}

useGSAP.register = (core) => {
  _gsap = core;
};
useGSAP.headless = true;
