/**
 * Web Serial API type definitions
 * Used by ArduinoDriver for serial port communication
 */

interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  close(): Promise<void>;
}

interface Navigator {
  serial: {
    requestPort(): Promise<SerialPort>;
    getPorts(): Promise<SerialPort[]>;
  };
}
