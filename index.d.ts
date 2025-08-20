import { Ref } from 'vue';
import gsap from 'gsap';

export interface UseGSAPContext {
  context: any;
  contextSafe: (func: (...args: any[]) => any) => void;
}

export function useGSAP(
  callback?: (...args: any[]) => any,
  config?: {
    scope?: Element | string | object | Ref<Element | null>;
    dependencies?: any[];
    revertOnUpdate?: boolean;
  }
): UseGSAPContext;

export namespace useGSAP {
  function register(core: typeof gsap): void;
  let headless: boolean;
}
