import { Ref } from "vue";
import gsap from "gsap";

export interface UseGSAPContext {
  context: gsap.Context;
  contextSafe: (func: () => void) => void;
}

export interface UseGSAPConfig {
  scope?: HTMLElement | string | Ref<HTMLElement | null>;
  dependencies?: unknown[];
  revertOnUpdate?: boolean;
}

export function useGSAP(
  callback?: (() => void) | null,
  config?: UseGSAPConfig | unknown[]
): UseGSAPContext;

export namespace useGSAP {
  function register(core: typeof gsap): void;
  let headless: boolean;
}
