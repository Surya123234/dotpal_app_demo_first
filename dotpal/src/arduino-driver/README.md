# Arduino Driver Package

A lightweight, standalone driver for handing the heavy lifting for Arduino input processing for the DotPal toy. This package handles all low-level serial communication and input parsing, returning high-level typed events that applications can easily consume.

This Readme contains information regarding the Driver's:
- Features
- Installation Guide
- Usage Guide
- Comprehensive API Reference
- Event Types
- Serial Communication Details
- Example Integration

## Integration with Applications

This driver is intentionally separated from application-specific logic (like Braille validation). The consuming application should:

1. **Initialize** the driver with event callbacks
2. **Receive** typed events from the driver
3. **Apply Business Logic** based on the events (validation, state management, etc.)
4. **Update UI** based on application state

This separation ensures the driver can be reused across different projects without modification.


## Features

- **Completely Standalone**: No dependencies on application logic or domain-specific code
- **Simple API**: Easy to integrate and use in any React or vanilla JavaScript project
- **Automatic Input Parsing**: Converts raw serial input into typed, events
- **Connection Management**: Built-in connection lifecycle management

## Installation

The driver is located in `src/arduino-driver/` and can be imported directly:

```typescript
import { ArduinoDriver, type ArduinoInputEvent } from "./arduino-driver";
```

## Usage

### Basic Setup

```typescript
import { ArduinoDriver, type ArduinoInputEvent } from "./arduino-driver";

// Create driver instance with callbacks
const driver = new ArduinoDriver({
  onInput: (event: ArduinoInputEvent) => {
    console.log("Arduino event:", event);
  },
  onConnect: () => {
    console.log("Arduino connected");
  },
  onDisconnect: () => {
    console.log("Arduino disconnected");
  },
  baudRate: 9600, // optional, defaults to 9600
});

// Connect to Arduino
await driver.connect();

// Use the driver...

// Disconnect when done
await driver.disconnect();
```

### In React Components

```typescript
import { useEffect, useRef } from 'react';
import { ArduinoDriver, type ArduinoInputEvent } from './arduino-driver';

function MyComponent() {
  const driverRef = useRef<ArduinoDriver | null>(null);

  const handleArduinoEvent = (event: ArduinoInputEvent) => {
    if (event.type === 'letter') {
      console.log('Letter pressed:', event.value);
    } else if (event.type === 'dot') {
      console.log(`Dot ${event.dot} ${event.pressed ? 'pressed' : 'released'}`);
    } else if (event.type === 'submit') {
      console.log('Submit button pressed');
    }
  };

  const connect = async () => {
    if (!driverRef.current) {
      driverRef.current = new ArduinoDriver({
        onInput: handleArduinoEvent,
        onConnect: () => console.log('Connected'),
        onDisconnect: () => console.log('Disconnected'),
      });
    }
    await driverRef.current.connect();
  };

  useEffect(() => {
    return () => {
      driverRef.current?.disconnect();
    };
  }, []);

  return (
    <button onClick={connect}>Connect Arduino</button>
  );
}
```

## API Reference

### `ArduinoDriver` Class

#### Constructor

```typescript
new ArduinoDriver(options?: ArduinoDriverOptions)
```

#### Options

```typescript
interface ArduinoDriverOptions {
  onInput?: (event: ArduinoInputEvent) => void; // Called when input is received
  onConnect?: () => void; // Called on successful connection
  onDisconnect?: () => void; // Called on disconnect
  baudRate?: number; // Serial baud rate (default: 9600)
}
```

#### Methods

**`connect(): Promise<void>`**

- Opens a serial port connection via Web Serial API
- Starts the read loop automatically
- Throws if the user cancels the port selection or connection fails

**`disconnect(): Promise<void>`**

- Closes the serial connection
- Stops the read loop
- Safe to call multiple times

**`connected: boolean`** (getter)

- Returns whether the driver is currently connected

### `ArduinoInputEvent` Type

The driver returns typed events for all possible Arduino inputs:

```typescript
type ArduinoInputEvent =
  | { type: "letter"; value: string } // Single letter A-Z
  | { type: "dot"; dot: number; pressed: boolean } // Dot press/release
  | { type: "submit" } // Submit button pressed
  | { type: "raw"; value: string }; // Unknown input
```

#### Event Types

| Event      | Format                                    | Description               |
| ---------- | ----------------------------------------- | ------------------------- |
| **letter** | `{ type: "letter", value: "A" }`          | Single letter input (A-Z) |
| **dot**    | `{ type: "dot", dot: 1, pressed: true }`  | Dot 1 pressed             |
|            | `{ type: "dot", dot: 1, pressed: false }` | Dot 1 released            |
| **submit** | `{ type: "submit" }`                      | Submit button pressed     |
| **raw**    | `{ type: "raw", value: "xyz" }`           | Unknown input string      |

## Input Parsing Rules

The driver automatically parses raw serial input according to these rules:

| Arduino Input     | Parsed Event                              |
| ----------------- | ----------------------------------------- |
| `A`, `B`, ... `Z` | `{ type: "letter", value: "A" }` etc.     |
| `UP`              | `{ type: "dot", dot: 1, pressed: true }`  |
| `DOWN`            | `{ type: "dot", dot: 1, pressed: false }` |
| `SUBMIT`          | `{ type: "submit" }`                      |
| Other             | `{ type: "raw", value: "..." }`           |

## Serial Communication Details

- **Line Termination**: Supports `\n`, `\r\n`, and `\r` line endings
- **Buffer Management**: Automatically handles incomplete lines and buffering
- **Read Loop**: Continuous async read loop that processes complete lines as they arrive
- **Error Handling**: Gracefully handles connection errors and disconnections

## Example: Full Integration

```typescript
// driver-using component
import { useEffect, useRef, useState } from 'react';
import { ArduinoDriver, type ArduinoInputEvent } from './arduino-driver';
import { validateBraille } from './braille'; // Application-specific logic

function BrailleApp() {
  const driverRef = useRef<ArduinoDriver | null>(null);
  const [inputDots, setInputDots] = useState<number[]>([]);

  const handleEvent = (event: ArduinoInputEvent) => {
    // Driver just returns events - app decides what to do
    if (event.type === 'dot') {
      if (event.pressed) {
        setInputDots(prev => [...prev, event.dot]);
      } else {
        setInputDots(prev => prev.filter(d => d !== event.dot));
      }
    } else if (event.type === 'submit') {
      // Application applies business logic
      const isCorrect = validateBraille(inputDots);
      handleValidation(isCorrect);
    }
  };

  const connect = async () => {
    driverRef.current = new ArduinoDriver({ onInput: handleEvent });
    await driverRef.current.connect();
  };

  useEffect(() => {
    return () => driverRef.current?.disconnect();
  }, []);

  return (
    <>
      <button onClick={connect}>Connect</button>
      <p>Dots: {inputDots.join(', ')}</p>
    </>
  );
}
```

---

**Last Updated**: 2026-02-22
