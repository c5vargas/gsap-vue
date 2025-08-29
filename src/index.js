import { ref, onMounted, onBeforeUnmount, watch, isRef } from "vue";
import gsap from "gsap";

let _gsap = gsap;

const isConfig = (value) =>
  value && !Array.isArray(value) && typeof value === "object";

const emptyArray = [];
const defaultConfig = {};

function normalizeScope(scope) {
  if (!scope) return null;
  if (isRef(scope)) return scope.value;
  if (scope instanceof HTMLElement) return scope;
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

  const scopeRef = ref(normalizeScope(config.scope));
  const context = ref(null);
  const mounted = ref(false);

  const createContext = () => {
    safeRevert(); // mata cualquier contexto previo
    context.value = _gsap.context(() => {}, scopeRef.value);
    if (callback) {
      context.value.add(() => {
        if (scopeRef.value) callback();
      }, scopeRef.value);
    }
  };

  const contextSafe = (func) => (...args) =>
    context.value?.add(() => func(...args));

  const safeRevert = () => {
    if (!context.value) return;
    try {
      // limpia timelines + ScrollTriggers
      context.value.kill?.();
      context.value.revert?.();
      context.value = null;
    } catch (e) {
      if (config.debug) {
        console.warn("useGSAP: error during safeRevert()", e);
      }
    }
  };

  onMounted(() => {
    scopeRef.value = normalizeScope(config.scope);
    mounted.value = true;
    createContext();
  });

  onBeforeUnmount(() => safeRevert());

  if (dependencies.length > 0) {
    watch(
      dependencies,
      () => {
        if (!mounted.value) return;
        createContext();
      },
      { immediate: true }
    );
  }

  return { context, contextSafe };
}

useGSAP.register = (core) => {
  _gsap = core;
};

useGSAP.headless = true;
