import type { DefineComponent } from 'vue'

export type ComponentRef<T extends DefineComponent<any, any, any>> = T | null

export type Mode = 'logIn' | 'signUp'
