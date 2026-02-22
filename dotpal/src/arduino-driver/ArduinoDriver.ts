/**
 * ArduinoDriver - Standalone Arduino input driver
 *
 * This driver handles all serial communication and input parsing from Arduino.
 * It exposes simple, high-level events that the application can consume.
 *
 * The driver is completely independent and has no dependencies on application logic.
 */

/**
 * Represents a parsed input event from the Arduino
 */
export type ArduinoInputEvent =
  | { type: "letter"; value: string }
  | { type: "dot"; dot: number; pressed: boolean }
  | { type: "submit" }
  | { type: "raw"; value: string };

export interface ArduinoDriverOptions {
  onInput?: (event: ArduinoInputEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  baudRate?: number;
}

export class ArduinoDriver {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private decoder = new TextDecoder();
  private buffer = "";
  private isConnected = false;
  private options: ArduinoDriverOptions;

  constructor(options: ArduinoDriverOptions = {}) {
    this.options = options;
  }

  /**
   * Connect to Arduino via Web Serial API
   */
  async connect() {
    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: this.options.baudRate || 9600 });
      this.isConnected = true;
      this.options.onConnect?.();
      this.reader = this.port.readable.getReader();
      this.readLoop();
    } catch (error) {
      this.isConnected = false;
      this.options.onDisconnect?.();
      throw error;
    }
  }

  /**
   * Disconnect from Arduino
   */
  async disconnect() {
    this.isConnected = false;
    if (this.reader) {
      try {
        this.reader.releaseLock();
      } catch {}
      this.reader = null;
    }
    if (this.port) {
      try {
        await this.port.close();
      } catch {}
      this.port = null;
    }
    this.options.onDisconnect?.();
  }

  /**
   * Parse raw Arduino input into typed events
   * Supports:
   * - Single letters (A-Z): letter pressed
   * - "UP": dot 1 pressed
   * - "DOWN": dot 1 released
   * - "SUBMIT": submit button pressed
   */
  private parseInput(input: string): ArduinoInputEvent {
    const trimmed = input.trim().toUpperCase();

    // Check if it's a single letter (A-Z)
    if (trimmed.length === 1 && /^[A-Z]$/.test(trimmed)) {
      return { type: "letter", value: trimmed };
    }

    // Check for dot 1 press (UP)
    if (trimmed === "UP") {
      return { type: "dot", dot: 1, pressed: true };
    }

    // Check for dot 1 release (DOWN)
    if (trimmed === "DOWN") {
      return { type: "dot", dot: 1, pressed: false };
    }

    // Check for submit command
    if (trimmed === "SUBMIT") {
      return { type: "submit" };
    }

    // Unknown input, return as raw
    return { type: "raw", value: trimmed };
  }

  /**
   * Main read loop - continuously reads from serial port
   */
  private async readLoop() {
    if (!this.reader) return;
    try {
      while (this.isConnected) {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (!value) continue;

        const text = this.decoder.decode(value);
        this.buffer += text;

        // Normalize line endings
        this.buffer = this.buffer.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

        // Split by newlines
        const lines = this.buffer.split("\n");
        this.buffer = lines[lines.length - 1];

        // Process complete lines
        for (let i = 0; i < lines.length - 1; i++) {
          const trimmed = lines[i].trim();
          if (!trimmed) continue;

          const event = this.parseInput(trimmed);
          this.options.onInput?.(event);
        }
      }
    } catch (error) {
      this.isConnected = false;
      this.options.onDisconnect?.();
    }
  }

  get connected() {
    return this.isConnected;
  }
}
