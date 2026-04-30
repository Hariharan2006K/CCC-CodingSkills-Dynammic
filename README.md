# 🎒 Dynamic Programming — 0/1 Knapsack Solver

A clean C++ implementation of the classic **0/1 Knapsack problem** using bottom-up Dynamic Programming, with full DP table construction and item traceback. Comes with a web-based frontend for interactive exploration.

---

## 📌 Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Sample Output](#sample-output)
- [DP Table Explained](#dp-table-explained)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)

---

## Overview

The 0/1 Knapsack problem is one of the most fundamental problems in combinatorial optimisation and dynamic programming. This project solves it in **O(n × W)** time using a bottom-up tabulation approach — building up optimal sub-solutions until the full answer is reached, then tracing back through the table to identify exactly which items were selected.

---

## The Problem

Given:
- A knapsack with a maximum **weight capacity W**
- A list of **n items**, each with a `weight` and a `value`

Find the **maximum total value** that fits within the capacity, where each item can either be included (1) or excluded (0) — it cannot be split or taken more than once.

```
Maximise:   Σ value[i] × x[i]
Subject to: Σ weight[i] × x[i] ≤ W
Where:      x[i] ∈ {0, 1}
```

---

## How It Works

### 1. Build the DP table — `solveKnapsack()`

A 2D table `dp[i][w]` is filled bottom-up, where each cell stores the **maximum value achievable using the first `i` items with capacity `w`**.

```
For each item i (1 to n):
  For each capacity w (1 to W):
    If item fits (weight[i] ≤ w):
      dp[i][w] = max(
        value[i] + dp[i-1][w - weight[i]],  ← include item
        dp[i-1][w]                           ← exclude item
      )
    Else:
      dp[i][w] = dp[i-1][w]                 ← cannot fit, skip
```

The answer is `dp[n][W]`.

### 2. Traceback selected items — `getSelectedItems()`

Starting from `dp[n][W]`, the function walks backwards through the table. If `dp[i][w] != dp[i-1][w]`, item `i` was included — its weight and value are deducted and the walk continues.

```
Time complexity:  O(n × W)
Space complexity: O(n × W)
```

---

## Project Structure

```
CCC-CodingSkills-Dynammic/
├── knapsack.cpp       # Core DP implementation + demo main()
├── frontend/          # Web-based interactive UI (HTML / CSS / JS)
│   └── ...
└── README.md
```

### Key components in `knapsack.cpp`

| Component | Description |
|-----------|-------------|
| `struct Item` | Data model — holds `id`, `weight`, and `value` |
| `solveKnapsack(W, items)` | Builds the full (n+1) x (W+1) DP table; returns max value + table |
| `getSelectedItems(W, items, dp)` | Traces back through the DP table to recover chosen items |
| `main()` | Demo: 4 items, capacity 8 |

---

## Getting Started

### Prerequisites

- C++17-compatible compiler (`g++` recommended)

### Compile & Run

```bash
g++ -std=c++17 -O2 -o knapsack knapsack.cpp
./knapsack
```

**Frontend** — open `frontend/index.html` directly in any modern browser. No server needed.

---

## Usage

The `main()` function ships with a ready-to-run example:

```cpp
int capacity = 8;

vector<Item> items = {
    {1, 10, 60},   // id=1, weight=10, value=60  (exceeds capacity — will not fit)
    {2,  2, 100},  // id=2, weight=2,  value=100
    {3,  3, 120},  // id=3, weight=3,  value=120
    {4,  4, 150}   // id=4, weight=4,  value=150
};
```

To use your own data, replace the `items` vector and `capacity` in `main()`. The solver and traceback functions are self-contained and require no other changes.

```cpp
// Custom example
int capacity = 50;
vector<Item> items = {
    {1, 10, 60},
    {2, 20, 100},
    {3, 30, 120}
};

auto [maxValue, dpTable] = solveKnapsack(capacity, items);
auto selected = getSelectedItems(capacity, items, dpTable);
```

---

## Sample Output

```
Knapsack Capacity: 8

Available Items:
Item 1 - Weight: 10, Value: 60
Item 2 - Weight: 2,  Value: 100
Item 3 - Weight: 3,  Value: 120
Item 4 - Weight: 4,  Value: 150

Optimal Max Value: 270
Selected Items:
 -> Item 3 (W: 3, V: 120)
 -> Item 4 (W: 4, V: 150)
```

Item 1 is excluded because its weight (10) exceeds the knapsack capacity (8). Items 3 and 4 together use 7 units of capacity and deliver the maximum value of 270.

---

## DP Table Explained

For the demo input (capacity = 8, items 2, 3, 4 in play):

```
       w=0  w=1  w=2  w=3  w=4  w=5  w=6  w=7  w=8
i=0  [  0    0    0    0    0    0    0    0    0  ]
i=1  [  0    0    0    0    0    0    0    0    0  ]  <- Item 1 (w=10): never fits
i=2  [  0    0  100  100  100  100  100  100  100  ]  <- Item 2 (w=2, v=100)
i=3  [  0    0  100  120  120  220  220  220  220  ]  <- Item 3 (w=3, v=120)
i=4  [  0    0  100  120  150  220  250  270  270  ]  <- Item 4 (w=4, v=150)
```

`dp[4][8] = 270` is the optimal answer. Traceback reveals Items 3 and 4 were selected.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Core logic | C++17 |
| Data structures | STL (`vector`, structured bindings) |
| Frontend | HTML5, CSS3, Vanilla JavaScript |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push and open a Pull Request

Issues and suggestions are welcome via [GitHub Issues](https://github.com/Hariharan2006K/CCC-CodingSkills-Dynammic/issues).

---

## Author

**Hariharan K** — [GitHub](https://github.com/Hariharan2006K)

*Built as part of the CCC Coding Skills programme.*
