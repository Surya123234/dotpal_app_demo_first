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
   * Get list of available (previously opened) serial ports
   */
  async getAvailablePorts(): Promise<SerialPort[]> {
    try {
      return await navigator.serial.getPorts();
    } catch (error) {
      console.error("Failed to get available ports:", error);
      return [];
    }
  }

  /**
   * Request user to select a port (shows browser's port picker dialog)
   */
  async requestPortFromUser(): Promise<SerialPort> {
    try {
      return await navigator.serial.requestPort();
    } catch (error) {
      console.error("User cancelled port selection:", error);
      throw error;
    }
  }

  /**
   * Connect to Arduino via Web Serial API
   * If no port is provided, will request user to select one via browser dialog
   */
  async connect(port?: SerialPort) {
    try {
      // If no port provided, request user to select one
      if (!port) {
        this.port = await this.requestPortFromUser();
      } else {
        this.port = port;
      }

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
   * Supported formats:
   * - Single letters (A-Z): letter selected
   * - "X, UP" or "X, DOWN" where X is 1..6: dot X pressed/released
   * - "SUBMIT": submit button pressed
   */
  private parseInput(input: string): ArduinoInputEvent {
    const trimmed = input.trim().toUpperCase();

    // Single letter (A-Z)
    if (trimmed.length === 1 && /^[A-Z]$/.test(trimmed)) {
      return { type: "letter", value: trimmed };
    }

    // Submit
    if (trimmed === "SUBMIT") {
      return { type: "submit" };
    }

    // Match formats like "3, UP" or "6, DOWN" (allow spaces)
    const dotMatch = trimmed.match(/^([1-6])\s*,\s*(UP|DOWN)$/);
    if (dotMatch) {
      const dot = Number(dotMatch[1]);
      const action = dotMatch[2];
      const pressed = action === "UP";
      return { type: "dot", dot, pressed };
    }

    // Unknown input
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
