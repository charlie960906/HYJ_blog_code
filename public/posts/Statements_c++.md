---
title: C++ 程式結構
date: 2025-07-08
summary: 本文介紹 C++ 程式語言的結構，包括循序、選擇和重複結構，包括 if-else、for、while、do-while 迴圈、switch 敘述及條件運算子。
tags: C++, 初學, 程式結構
category: information
---

# C++ 程式結構

## 程式結構概覽

C++ 程式結構分為三種類型：循序結構、選擇結構和重複結構。

| 循序結構（Sequence Structure） | 選擇結構（Selection Structure） | 重複結構（Iteration Structure） |
| --- | --- | --- |
| 程式碼從上至下依序執行 | 根據條件決定執行哪些語句 | 根據條件重複執行語句，控制執行次數 |
| 簡單直接，無條件判斷 | 包括 `if`、`if-else` 和 `switch` 語句 | 包括 `for`、`while` 和 `do-while` 迴圈 |

## if-else 語句

當條件成立時，執行 `if` 語句主體；若不成立，則依序檢查 `else if` 條件；若所有條件均不成立，執行 `else` 語句主體。一旦某條件成立，後續條件不再檢查。

**語法**：

```cpp
if (判斷條件) {
    語句主體;
}
else if (判斷條件) {
    語句主體;
}
else {
    語句主體;
}
```

**練習：判斷輸入回答是否正確**

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string ans;
    cout << "50可以被5整除嗎？yes or no?" << endl;
    cin >> ans;
    if (ans == "yes") {
        cout << "答對了" << endl; // 單行語句可省略大括號
    }
    else if (ans == "no") {
        cout << "答錯了" << endl;
    }
    else {
        cout << "不符合問題的回答" << endl; // 防呆設計
    }
    return 0;
}
```

## 巢狀 if 語句

在 `if` 語句中嵌套另一個 `if` 語句，只有當外層和內層條件均成立時，才執行內層語句主體。

**語法**：

```cpp
if (判斷條件1) {
    if (判斷條件2) {
        語句主體; // 條件1和條件2均滿足時執行
    }
    // 其他語句
}
```

## for 迴圈

用於固定次數的重複執行。

**語法**：

```cpp
for (迴圈初始值; 判斷條件; 增減量) {
    迴圈主體;
}
```

**執行流程**：

1. 設定迴圈控制變數的初始值。
2. 檢查判斷條件是否成立，若成立則執行迴圈主體。
3. 根據增減量更新控制變數，回到步驟 2。

**練習：印出 1 到 100**

```cpp
#include <iostream>
using namespace std;
int main() {
    for (int i = 1; i <= 100; i++) {
        cout << i << ' ';
    }
    cout << endl;
    return 0;
}
```

## while 迴圈

在條件成立時重複執行迴圈主體。

**語法**：

```cpp
while (判斷條件) {
    迴圈主體;
    增減量; // 視條件決定是否需要
}
```

**執行流程**：

1. 在進入迴圈前設定控制變數初始值。
2. 檢查判斷條件是否成立，若成立則執行迴圈主體。
3. 更新控制變數，回到步驟 2。

**練習：改寫 for 迴圈印出 1 到 100**

```cpp
#include <iostream>
using namespace std;
int main() {
    int i = 1;
    while (i <= 100) {
        cout << i << ' ';
        i++;
    }
    cout << endl;
    return 0;
}
```

**補充：持續讀入數字並相加**

```cpp
#include <iostream>
using namespace std;
int main() {
    int a, b;
    while (cin >> a >> b) {
        cout << a + b << endl;
    }
    return 0;
}
```

**補充：持續讀入字串直到遇到 EOF**

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    while (cin >> s) {
        if (s == "EOF") {
            break;
        }
        cout << s << endl;
    }
    return 0;
}
```

## do-while 迴圈

先執行迴圈主體，再檢查條件，至少執行一次。

**語法**：

```cpp
do {
    迴圈主體;
    增減量;
} while (判斷條件);
```

**執行流程**：

1. 設定控制變數初始值。
2. 執行迴圈主體。
3. 檢查條件，若成立則更新控制變數並回到步驟 2。

**練習：從 0 累加到 n**

```cpp
#include <iostream>
using namespace std;
int main() {
    int i = 0, sum = 0, n;
    cin >> n;
    do {
        sum += i;
        i++;
    } while (i <= n);
    cout << "sum=" << sum << endl;
    return 0;
}
```

## 巢狀迴圈

迴圈中嵌套另一個迴圈。

**語法**：

```cpp
for (...) {
    for (...) {
        // 語句
    }
}
```

**練習：九九乘法表**

```cpp
#include <iostream>
using namespace std;
int main() {
    for (int i = 1; i < 10; i++) {
        for (int j = 1; j < 10; j++) {
            cout << i << "*" << j << "=" << i * j << " ";
        }
        cout << endl;
    }
    return 0;
}
```

## break 與 continue 語句

### break 語句

立即跳出迴圈，執行迴圈外的語句。

**練習：印出 1 到 n（n 不確定，假設小於 100）**

```cpp
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= 100; i++) {
        if (i == n) {
            break;
        }
        cout << i << ' ';
    }
    cout << endl;
    return 0;
}
```

### continue 語句

跳過當前迴圈剩餘語句，進入下一次迴圈。

**練習：印出 1 到 10，跳過 4 的倍數**

```cpp
#include <iostream>
using namespace std;
int main() {
    for (int i = 1; i <= 10; i++) {
        if (i % 4 == 0) {
            continue;
        }
        cout << i << ' ';
    }
    cout << endl;
    return 0;
}
```

## switch 語句

根據運算式結果選擇對應的 `case` 執行，需用 `break` 終止，否則繼續執行後續 `case`。各 `case` 的選擇值不可重複。

**語法**：

```cpp
switch (運算式) {
    case 選擇值1:
        語句主體;
        break;
    case 選擇值2:
        語句主體;
        break;
    // ...
    default:
        語句主體;
}
```

**註記**：`switch` 可由 `if-else` 替代，後者更直觀且無需 `break`。

**練習：根據農曆月份判斷季節**

```cpp
#include <iostream>
using namespace std;
int main() {
    int month;
    cin >> month;
    switch (month) {
        case 1:
        case 2:
        case 3:
            cout << "春天" << endl;
            break;
        case 4:
        case 5:
        case 6:
            cout << "夏天" << endl;
            break;
        case 7:
        case 8:
        case 9:
            cout << "秋天" << endl;
            break;
        case 10:
        case 11:
        case 12:
            cout << "冬天" << endl;
            break;
        default:
            cout << "無效的月份" << endl;
    }
    return 0;
}
```

## 條件運算子（Conditional Operator）

簡化 `if-else` 的三元運算子。

**語法**：

```cpp
傳回值 = (判斷條件) ? 運算式1 : 運算式2;
```

- 若條件為 `true`，執行運算式1；否則執行運算式2。

**練習：找出 a 和 b 的最小值**

```cpp
#include iostream;
using namespace std;
int main() {
int a = 2, b = 10;
int min = (a &lt; b) ? a : b;
cout &lt;&lt; "min=" &lt;&lt; min &lt;&lt; endl;
return 0;
}
```