import { ref, onMounted, onBeforeUnmount, watch, isRef } from "vue";
import gsap from "gsap";

let _gsap = gsap;
const isConfig = (value) =>
  value && !Array.isArray(value) && typeof value === "object";
const emptyArray = [];
const defaultConfig = {};

function normalizeScope(scope) {
  if (!scope) return null;

  // Caso 1: Vue Ref
  if (isRef(scope)) return scope.value;

  // Caso 2: HTMLElement
  if (scope instanceof HTMLElement) return scope;

  // Caso 3: string selector
  if (typeof scope === "string") return scope;

  console.warn("⚠️ Invalid scope provided to useGSAP:", scope);
  return null;
}

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

  const { revertOnUpdate } = config;
  let scope = normalizeScope(config.scope);

  const mounted = ref(false);
  const context = ref(_gsap.context(() => {}, scope));

const contextSafe = (func) => (...args) => context.value.add(() => func(...args));
  const deferCleanup = dependencies.length > 0 && !revertOnUpdate;

  onMounted(() => {
    scope = normalizeScope(config.scope);
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
        if (!deferCleanup || !mounted.value) {
          context.value.revert();
        }
        if (callback) {
          context.value.add(callback, scope);
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
