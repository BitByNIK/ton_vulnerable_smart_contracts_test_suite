# ⏱️ Race Condition via Message Ordering

This contract demonstrates a **race condition vulnerability** caused by asynchronous message handling in the TON blockchain.

## 🐞 Vulnerability Overview

After receiving a withdrawal request, the contract tries to preserve the **remaining overall balance** by sending a message to itself with:

**`remaining_balance = current_balance - withdrawal_amount`**

However, this preservation message is **still in-flight** when a second withdrawal message arrives.

Because the contract has already sent out its entire balance in the first message, it has **no funds left** at the time the second withdrawal is processed. It tries to fulfill the second withdrawal with an empty balance and **self-destructs**.

## 💥 Exploit Flow

1. Deposit funds into the contract.
2. Send **two separate withdrawal messages**.
3. The first message triggers a preservation of the remaining balance (delayed).
4. The second message is processed while the contract has zero balance.
5. The contract fails to fulfill the withdrawal, sends zero, and self-destructs.
6. Attacker redeploys the contract with an empty state.
7. Deposit a small amount and withdraw the preserved funds that are now unowned.

## ⚠️ Root Cause

The contract preserves the remaining balance via a delayed message, but processes a second withdrawal **before** that message lands.  
This causes the contract to execute a withdrawal with zero balance, leading to self-destruction and enabling recovery of the preserved funds after redeployment.

---

> 📁 [Back to root](../../README.md)
