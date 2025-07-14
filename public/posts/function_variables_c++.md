---
title: C++ 函數與變數等級
date: 2025-07-08
summary: 本文介紹 C++ 函數的優點、宣告方式、回傳值、呼叫方法、inline 函數、變數等級以及遞迴概念，包含程式碼範例與遞迴階乘實作，適合初學者學習。
tags: C++, 初學, 函式, 變數
category: information
---

# C++ 函數與變數等級

## 函數的優點

### 1. 模組化
- 函數將程式分割為獨立模組，每個模組負責特定任務。
- 提高程式可讀性、易於除錯和維護，問題排查只需聚焦特定函數。

### 2. 程式碼重用
- 定義一次函數，可在程式多處呼叫，避免重複編寫相同程式碼。
- 減少冗余，提高可讀性與可維護性。

### 3. 抽象化
- 將複雜操作封裝為簡單函數呼叫，隱藏實現細節。
- 提供清晰介面，降低程式複雜度。

### 4. 組織與結構化
- 按邏輯任務組織程式碼，增強可讀性與可擴展性。
- 透過參數與回傳值傳遞資料，提升靈活性。

## 函數宣告

### 1. 函數寫在主函數後
需在主函數前宣告函數原型（prototype），以告知編譯器函數的存在。

**語法**：
```cpp
傳回值型態 函數名稱(引數型態1, 引數型態2, ...); // 函數原型

int main() {
    // 主函數內容
}

傳回值型態 函數名稱(引數型態1 引數1, 引數型態2 引數2, ...) {
    // 變數宣告
    // 語句主體
    return 運算式;
}
```

### 2. 函數寫在主函數前
無需額外宣告原型，直接定義函數。

**語法**：
```cpp
傳回值型態 函數名稱(引數型態1 引數1, 引數型態2 引數2, ...) {
    // 變數宣告
    // 語句主體
    return 運算式;
}

int main() {
    // 主函數內容
}
```

## 回傳值
函數可返回變數、常數或運算式。

**語法**：
```cpp
return 運算式; // 返回值
return;        // 無回傳值，適用於 void 函數
```

## 函數呼叫

### 1. 基本語法
```cpp
變數 = 函數名稱(參數); // 有回傳值的函數
函數名稱(參數);         // 無回傳值的函數
```

### 2. 主函數呼叫其他函數
```cpp
#include <iostream>
using namespace std;

void func1() {
    cout << "Function 1 called" << endl;
}

int main() {
    func1();
    return 0;
}
```

### 3. 函數間相互呼叫
函數可彼此呼叫，但需注意定義順序或使用原型。

**正確範例（使用原型）**：
```cpp
#include <iostream>
using namespace std;

void func1(); // 函數原型
void func2();

void func1() {
    cout << "Function 1 called" << endl;
    func2();
}

void func2() {
    cout << "Function 2 called" << endl;
}

int main() {
    func1();
    return 0;
}
```

**錯誤範例（順序錯誤）**：
```cpp
#include <iostream>
using namespace std;

void func1() {
    cout << "Function 1 called" << endl;
    func2(); // 錯誤：func2 未定義
}

void func2() {
    cout << "Function 2 called" << endl;
}

int main() {
    func1();
    return 0;
}
```

## inline 函數

### 1. 功能
- `inline` 函數類似巨集，編譯器將函數程式碼直接嵌入呼叫處，提升執行效率。
- 適合短小、頻繁呼叫的函數。

### 2. 定義格式
```cpp
inline 傳回值型態 函數名稱(型態1 引數1, 型態2 引數2, ...) {
    // 語句主體
}
```

### 3. 編譯器忽略 inline 的情況
- 函數內容過於複雜。
- 函數包含遞迴呼叫。
- 編譯器不支援 `inline`。

**範例**：
```cpp
#include <iostream>
using namespace std;

inline void print_star() {
    cout << "*************" << endl;
}

int main() {
    print_star();
    return 0;
}
```

## 變數等級
C++ 提供五種變數等級：`auto`、`static auto`、`extern`、`static extern` 和 `register`。

**範例宣告**：
```cpp
auto int i;        // 區域整數變數
extern char ch;    // 外部字元變數
static float f;    // 靜態浮點數變數
```

### 1. 區域變數（Local Variable）
- 也稱為自動變數（`automatic variable`）。
- 宣告於函數或區塊內，使用堆疊（stack）儲存，屬於動態變數。
- 生命週期：區塊開始時創建，結束時銷毀。

**範例**：
```cpp
void func() {
    int i;    // 區域變數，省略 auto
    char ch;  // 區域變數
}
```

**生命週期範例**：
```cpp
#include <iostream>
using namespace std;

void func() {
    // cout << a; // 錯誤：a 未定義
    int a = 1;
    cout << "a=" << a << endl; // 可使用 a
}

int main() {
    func();
    // cout << a; // 錯誤：a 未定義
    return 0;
}
```

**練習：觀察區域變數行為**
```cpp
#include <iostream>
using namespace std;

void func1() {
    int i = 10;
    cout << "in func1(), i=" << i << endl;
}

int main() {
    int i = 1;
    cout << "in main(), i=" << i << endl;
    func1();
    cout << "in main(), i=" << i << endl; // i 不受 func1 影響
    return 0;
}
```

### 2. 靜態區域變數
- 在編譯時分配固定記憶體，生命週期持續整個程式執行。
- 區塊結束後，值不會消失，保留至下次呼叫。

**範例**：
```cpp
static int i;
```

**練習：觀察靜態區域變數**
```cpp
#include <iostream>
using namespace std;

void func1() {
    static int i = 10;
    cout << "in func1(), i=" << i << endl;
    i += 10;
}

int main() {
    func1(); // i=10
    func1(); // i=20
    func1(); // i=30
    return 0;
}
```

### 3. 外部變數（External Variable）
- 也稱全域變數，宣告於函數外，作用範圍為整個程式。
- 可使用 `extern` 宣告，引用其他檔案或後續定義的變數。

**範例**：
```cpp
#include <iostream>
using namespace std;

int a = 1; // 全域變數

void func1() {
    a += 5;
    cout << "in func1(), a=" << a << endl;
}

void func2() {
    a += 10;
    cout << "in func2(), a=" << a << endl;
}

int main() {
    func1();
    func2();
    cout << "in main(), a=" << a << endl;
    return 0;
}
```

**注意**：
- 全域變數若宣告於所有函數之前，可省略 `extern`。
- `extern` 宣告不可包含初始值。

**錯誤範例**：
```cpp
void func1() {
    extern int a = 1; // 錯誤：extern 不可有初始值
    cout << "in func1(), a=" << a << endl;
}
```

**練習：區域變數與全域變數優先級**
```cpp
#include <iostream>
using namespace std;

int a = 0; // 全域變數

void func1() {
    a += 5;
    cout << "in func1(), a=" << a << endl; // 使用全域變數
}

void func2() {
    a += 10;
    cout << "in func2(), a=" << a << endl; // 使用全域變數
}

int main() {
    int a = 1000; // 區域變數優先
    func1();
    func2();
    cout << "in main(), a=" << a << endl; // 使用區域變數
    return 0;
}
```

### 4. 靜態外部變數
- 限於單一程式檔案使用，無法被其他檔案引用。

**範例**：
```cpp
#include <iostream>
using namespace std;

static int a;

void func1() {
    a = 10;
    if (a % 2 == 1) {
        cout << "is odd" << endl;
    } else {
        cout << "is even" << endl;
    }
}

int main() {
    func1();
    cout << "a=" << a << endl;
    return 0;
}
```

### 5. 暫存器變數
- 使用 CPU 暫存器儲存，提升存取速度。
- 由編譯器決定是否實際使用暫存器，通常可省略 `register` 關鍵字。

**範例**：
```cpp
register int i; // 建議編譯器使用暫存器
```

## 遞迴（Recursion）

### 1. 定義
遞迴函數是指函數呼叫自身，用於解決可分解為相似子問題的問題。

### 2. 原理
- **基本情況（Base Case）**：終止遞迴的條件，直接返回結果。
- **遞迴呼叫（Recursive Call）**：呼叫自身，處理較小規模的子問題。
- **問題分解**：將大問題拆解為相似但規模較小的子問題。
- **問題組合**：合併子問題的解以獲得最終結果。

**注意**：缺少基本情況可能導致無限遞迴，造成堆疊溢位（stack overflow）。

**圖示**：無限遞迴示意圖（來源：<https://www.freecodecamp.org/news/content/images/2019/09/is-this-you-need-to-be-stopped-2.png>）

### 3. 範例：階乘
計算 n!（n 的階乘）是遞迴的經典範例。

**正確範例**：
```cpp
#include <iostream>
using namespace std;

int fact(int a) {
    if (a <= 1) { // 基本情況
        return 1;
    }
    return a * fact(a - 1); // 遞迴呼叫
}

int main() {
    int a;
    do {
        cout << "輸入整數：";
        cin >> a;
    } while (a <= 0);
    cout << "1*2*...*" << a << "=" << fact(a) << endl;
    return 0;
}
```

**錯誤範例（原範例問題）**：
- 原範例 `fact(a * fact(a-1))` 語法錯誤，正確應為 `a * fact(a-1)`。
- 無明確基本情況，可能導致無限遞迴。