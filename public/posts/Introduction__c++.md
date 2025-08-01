---
title: C++ - 簡單介紹
date: 2025-07-08
summary: 本文介紹 C++ 的歷史、特色、結構等...。
tags: C++, 初學, 簡介
category: information
---

# C++ 程式語言介紹

## 歷史
1. **C語言**：1972年由丹尼斯·里奇（Dennis Ritchie）在貝爾實驗室開發，是一種結構化程式語言。
2. **C++語言**：1980年代由比雅尼·斯特勞斯特魯普（Bjarne Stroustrup）開始發展。
   - 將物件導向（Object-Oriented Programming, OOP）概念融入C語言。
   - 最初稱為「C with Classes」。

## 特色
C++ 是由 C 語言延伸而來的通用程式語言，具有以下主要特色：

1. **向下相容 C 語言**：
   - C++ 包含 C 語言的所有功能，幾乎所有的 C 程式碼都可以在 C++ 中執行。
2. **物件導向程式設計（OOP）**：
   - **封裝**：將資料與操作資料的函式封裝成類別，保護資料並提高程式模組化。
   - **繼承**：允許新類別基於現有類別擴展功能，實現程式碼重用。
   - **多型**：同一操作可應用於不同類型的物件，增加程式靈活性。
3. **靈活的流程控制**：
   - 提供多種控制結構（如條件語句、迴圈），支援複雜的程式邏輯。
4. **高效能與可攜性**：
   - C++ 程式需經過編譯（Compile），執行效率高於直譯式語言（如 Basic）。
   - 可攜性佳，僅需少量修改即可在不同作業系統上執行。
5. **程式碼重用**：
   - 透過繼承與模板，程式碼可被重複使用，減少開發時間與成本。

## 流程圖
流程圖是用來表示程式執行流程的圖形化工具，常用於設計與理解程式邏輯。

### 1. 常用符號
| 符號形狀 | 意義 |
|----------|------|
| 橢圓 | 程式開始或結束 |
| 矩形 | 處理步驟 |
| 菱形 | 條件判斷 |
| 箭頭 | 流程方向 |

### 2. 範例
以下是一個簡單流程圖，展示檢查數字是否為正數的邏輯：
```
開始 → 輸入數字 → 數字 > 0？ → 是：顯示「正數」 / 否：顯示「非正數」 → 結束
```

## 程式的編譯與執行
1. **編譯**：C++ 程式需透過編譯器轉換為機器碼，生成可執行檔案。
2. **執行**：執行編譯後的可執行檔案，顯示程式結果。
3. **工具**：常見編譯器包括 GCC、Clang、MSVC 等。

## 程式基本結構

### 1. 主函數 `main()`
- 每個 C++ 程式必須有且僅有一個 `main()` 函數，作為程式執行入口。
- 語法：
  ```cpp
  int main() {
      // 程式碼
      return 0; // 表示程式正常結束
  }
  ```
- `return 0` 表示程式成功執行，非零值表示異常。

### 2. 預處理指令 `#`
- 以 `#` 開頭的指令由前置處理器在編譯前處理。
- 常見指令：
  - `#include <iostream>`：包含輸入輸出流相關函數。
  - `#include <cstdlib>`：包含標準函數庫（如 `system()`）。

### 3. 命名空間 `std`
- `std` 是 C++ 標準庫的命名空間，包含 `cin`、`cout` 等功能。
- 使用方式：
  - 直接使用：`std::cout`。
  - 宣告命名空間：`using namespace std;` 後可省略 `std::`。
  - 示例：
    ```cpp
    #include <iostream>
    using namespace std;
    int main() {
        cout << "Hello, World!" << endl;
        return 0;
    }
    ```

### 4. 標頭檔（Header Files）
- 標頭檔包含函數、類別等定義，位於程式碼開頭。
- 比較：
  | 狀態 | 範例 |
  |------|------|
  | 含括前 | 無法使用 `cout`、`cin` 等功能 |
  | 含括後 | 可使用標準庫功能，如 `std::cout << "Hello";` |

### 5. 註解
- 註解用於說明程式邏輯或暫時停用程式碼，不會被編譯。
- 類型：
  - 單行註解：`// 這是單行註解`
  - 多行註解：
    ```cpp
    /* 這是
       多行註解 */
    ```

### 6. 大括號與區塊
- 區塊由 `{` 開始，`}` 結束，包含一組指令。
- 每條指令以分號 `;` 結尾。

### 7. 暫停指令 `system("pause")`
- **用途**：在程式結束前暫停，允許使用者查看執行結果。
- **語法**：
  ```cpp
  system("pause"); // 等待使用者按鍵後關閉視窗
  ```
- **注意**：僅適用於 Windows 環境，其他系統可能需要替代方案（如 `cin.get()`）。

## 錯誤分類
1. **語法錯誤（Syntax Error）**：
   - 程式碼不符合 C++ 語法規則，如缺少分號、括號不匹配。
   - 範例：`cout << "Hello"`（缺少 `;`）。
2. **語意錯誤（Semantic Error）**：
   - 語法正確，但執行結果不符合預期。
   - 範例：計算 `a + b` 時，誤用 `a - b`。

## ANSI/ISO C++ 標準
C++ 標頭檔類型：
1. **C 語言標頭檔**：以 `.h` 結尾（如 `<stdio.h>`）。
2. **C++ 標頭檔**：以 `.h` 結尾（如 `<iostream.h>`，早期使用）。
3. **新標準標頭檔**：無副檔名（如 `<iostream>`）。
4. **C 語言移植標頭檔**：無副檔名，字首加 `c`（如 `<cstdio>`）。

新版 C++ 需使用 `using namespace std;` 來指定命名空間。
