/// <reference types="chrome" />
/// <reference types="firefox-webext-browser" />
/// <reference types="jquery" />

declare function GM_getValue<T>(key: string, defaultValue?: T): T
declare function GM_setValue(key: string, value: unknown): void | Promise<void>
declare function GM_deleteValue(key: string): void
declare function GM_addValueChangeListener<T>(
  key: string,
  listener: (key: string, oldValue: T, newValue: T, remote: boolean) => void,
): number
declare function GM_removeValueChangeListener(listenerId: number): void
declare function GM_registerMenuCommand(name: string, callback: () => void): void
declare function GM_addStyle(css: string): HTMLElement
declare const unsafeWindow: Window & typeof globalThis
