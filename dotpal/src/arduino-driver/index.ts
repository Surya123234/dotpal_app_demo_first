/**
 * Arduino Driver Package
 *
 * A standalone, framework-agnostic driver for handling Arduino serial input.
 *
 * Usage:
 * ```
 * import { ArduinoDriver, type ArduinoInputEvent } from './arduino-driver';
 *
 * const driver = new ArduinoDriver({
 *   onInput: (event) => {
 *     if (event.type === 'letter') {
 *       console.log('Letter pressed:', event.value);
 *     } else if (event.type === 'dot') {
 *       console.log('Dot', event.dot, event.pressed ? 'pressed' : 'released');
 *     } else if (event.type === 'submit') {
 *       console.log('Submit pressed');
 *     }
 *   },
 *   onConnect: () => console.log('Connected'),
 *   onDisconnect: () => console.log('Disconnected'),
 * });
 *
 * await driver.connect();
 * // ... use driver
 * await driver.disconnect();
 * ```
 */

export { ArduinoDriver } from "./ArduinoDriver";
export type { ArduinoInputEvent, ArduinoDriverOptions } from "./ArduinoDriver";
