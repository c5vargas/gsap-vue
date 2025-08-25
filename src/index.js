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
  const mounted = ref(false);
  const context = ref(_gsap.context(() => {}, scopeRef.value));

  const contextSafe = (func) => (...args) => context.value.add(() => func(...args));

  const deferCleanup = dependencies.length > 0 && !config.revertOnUpdate;

  const safeRevert = () => {
    if (!context.value) return;

    try {
      const timelines = context.value.timeline?.getChildren(false, true, true) || [];
      timelines.forEach((child) => {
        if (child.scrollTrigger) {
          child.scrollTrigger.kill();
          child.scrollTrigger = null;
        }
        if (child.kill) {
          child.kill();
        }
      });

      if (context.value.revert) {
        context.value.revert();
      }

    } catch (e) {
      if (config.debug) {
        console.warn("useGSAP: error during safeRevert()", e);
      }
    }
  };

  onMounted(() => {
    scopeRef.value = normalizeScope(config.scope);
    mounted.value = true;

    if (callback) {
      context.value.add(() => {
        if (scopeRef.value) callback();
      }, scopeRef.value);
    }
  });

  onBeforeUnmount(() => safeRevert());

  if (dependencies.length > 0) {
    watch(
      dependencies,
      () => {
        if (!deferCleanup || !mounted.value) safeRevert();
        if (callback) context.value.add(() => callback(), scopeRef.value);
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
