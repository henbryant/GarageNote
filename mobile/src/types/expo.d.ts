declare module 'expo' {
  import type { ComponentType } from 'react';

  export function registerRootComponent<P extends object>(
    component: ComponentType<P>,
  ): void;
}
