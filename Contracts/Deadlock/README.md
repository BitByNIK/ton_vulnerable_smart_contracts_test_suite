# Deadlock Report: Circular Dependency Between Smart Contracts

This report explains a deadlock scenario caused by circular dependencies among three smart contracts (C1, C2, and C3)

---

## Overview

The system comprises three smart contracts that communicate solely by sending messages. Each contract is designed to wait for a specific confirmation message from another contract before proceeding. This creates a cyclic dependency where:

- **C1** waits for a confirmation from **C2**.
- **C2** waits for a confirmation from **C3**.
- **C3** waits for a confirmation from **C1**.

Because each contract waits on another, none of them can move forward, resulting in a deadlock.

---

## Contract Descriptions

### Contract C1

- **State Variables:**
  - `status: Bool` — Indicates whether a confirmation has been received.
  - `c2Address: Address` — Address of contract C2.
  - `c3Address: Address` — Address of contract C3.
- **Behavior:**
  - **Start:** On receiving the `"start"` message, C1 sends a request for confirmation to C2.
  - **Confirmation Handling:** Upon receiving a `Confirm` message with the detail `"request confirmed by C2 to C1"`, it sets its `status` to `true`.
  - **Forwarding:** When receiving `"sending request for confirmation by C3 to C1"`, if its status is `true`, it sends a confirmation to C3; otherwise, it re-sends the request to C2.

### Contract C2

- **State Variables:**
  - `status: Bool` — Indicates whether a confirmation from C3 has been received.
  - `c3Address: Address` — Address of contract C3.
  - `c1Address: Address` — Address of contract C1.
- **Behavior:**
  - **Request Handling:** On receiving `"sending request for confirmation by C1 to C2"`, if its status is `true`, C2 sends a confirmation back to C1; otherwise, it forwards the request to C3.
  - **Confirmation Handling:** Upon receiving a `Confirm` message with detail `"request confirmed by C3 to C2"`, C2 sets its `status` to `true`.

### Contract C3

- **State Variables:**

  - `status: Bool` — Indicates whether a confirmation from C1 has been received.
  - `c1Address: Address` — Address of contract C1.
  - `c2Address: Address` — Address of contract C2.

  - On receiving `"sending request for confirmation by C2 to C3"`, if `status` is `true`, it sent the confirmation

  - **Fallback:** If `status` is `false`, C3 sends a request to C1: `"sending request for confirmation by C3 to C1"`.

---

## How the Deadlock Occurs

1. **C1 Initiates:**

   - C1 sends a request to C2 and waits for a confirmation from C2.

2. **C2 Forwards:**

   - C2, upon receiving the request, forwards it to C3 if its confirmation status is still `false`, and then waits for a confirmation from C3.

3. **C3 Forwards:**

   - C3, upon receiving the request, forwards it to C1 if its confirmation status is still `false`, and then waits for a confirmation from C1.

4. **Circular Waiting:**

   - C1 waits for confirmation from C2.
   - C2 waits for confirmation from C3.
   - C3 waits for confirmation from C1.

5. **Resulting Deadlock:**
   - Each contract waits indefinitely for an external trigger that never arrives, causing a deadlock where no contract can progress.

---

## Conclusion

The corrected implementation now properly routes confirmation messages:

- **C1** expects confirmations from **C2**.
- **C2** expects confirmations from **C3**.
- **C3** expects confirmations from **C1**.

This example serves as an important illustration of how circular dependencies in smart contracts can lead to a deadlock, highlighting the need for careful design and robust error-handling strategies in inter-contract communication.

---

_End of Report_
