---
title: C++ 陣列基礎與應用
date: 2025-07-08
summary: 本文介紹 C++ 陣列的基本概念，包括一維、多維陣列的宣告與使用、記憶體表示法、字串、多項式與矩陣應用，以及陣列與指標的關係。
tags: C++, Array, 陣列
category: information
---

# C++ 陣列（Array）

## 本章重點
1. 認識一維與多維陣列
2. 使用一維與多維陣列
3. 陣列與函數的結合
4. 了解陣列在記憶體中的表示法
5. 認識陣列的其他應用（如字串、多項式、矩陣）

## 簡介
陣列是一種儲存相同型態元素的容器，佔用連續記憶體空間。每個元素透過索引值（index）存取，索引從 0 開始，方便尋找與操作。陣列類似於水杯或書架，但每個儲存空間有編號，且記憶體位置連續。

**圖示**：陣列連續記憶體示意圖（來源：<https://back.tobosu.com/ke_file/2018-06-20/m_5b2a0e42d1c08.png>）

## 陣列的特性與優點
1. **連續記憶體**：佔用連續記憶體空間，存取效率高。
2. **有序結構**：表示有序資料序列。
3. **統一型態**：所有元素資料型態相同。
4. **存取方式**：支援隨機存取（透過索引）與循序存取（逐元素遍歷）。
5. **插入/刪除困難**：需挪移元素，效率較低。
6. **快速輸入/輸出**：透過索引與迴圈快速存取或輸出大量資料。

**範例：輸出陣列元素**
```cpp
#include <iostream>
using namespace std;
int main() {
    int A[5] = {1, 2, 3, 4, 5};
    for (int i = 0; i < 5; i++) {
        cout << A[i] << ' ';
    }
    cout << endl;
    return 0;
}
```

## 陣列的使用

### 1. 宣告
陣列與一般變數的差異在於記憶體配置方式。

| 變數宣告 | 陣列宣告 |
|----------|----------|
| 非連續記憶體配置 | 連續記憶體配置，按順序排列 |

**不同維度陣列的宣告**：

| 一維陣列 | 二維陣列 | 多維陣列（以三維為例） |
|----------|----------|------------------------|
| `陣列名稱[大小];` | `陣列名稱[列數][行數];` | `陣列名稱[二維陣列數][列數][行數];` |

### 2. 陣列初始值設定

#### 2.1 一維陣列
```cpp
int a[3] = {1, 2, 3};       // 明確指定元素
int b[] = {1, 2, 3};        // 省略大小，自動推斷
int c[5] = {0};             // 所有元素初始化為 0
```

#### 2.2 二維陣列
```cpp
int a[2][3] = {{1, 2, 3}, {4, 5, 6}}; // 2x3 陣列
int b[][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}; // 省略列數
int c[2][3] = {0}; // 所有元素初始化為 0
```

#### 2.3 多維陣列
```cpp
int a[2][3][4] = {
    {{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}},
    {{12, 11, 10, 9}, {8, 7, 6, 5}, {4, 3, 2, 1}}
};
int b[][3][4] = {
    {{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}},
    {{12, 11, 10, 9}, {8, 7, 6, 5}, {4, 3, 2, 1}}
}; // 省略第一維大小
int c[2][3][4] = {0}; // 所有元素初始化為 0
```

**其他初始化方法**：
- **迴圈初始化**：
  ```cpp
  int arr[5];
  for (int i = 0; i < 5; i++) {
      arr[i] = 0;
  }
  ```
- **memset**：
  ```cpp
  #include <cstring>
  int arr[5];
  memset(arr, 0, sizeof(arr)); // 將陣列初始化為 0
  ```

### 3. 陣列儲存方式
使用索引值指定儲存位置，索引可以是：
- 常數：`A[0] = 30;`
- 變數：`int x = 1; A[x] = 20;`
- 運算式：`A[x * 2] = 20;`
- 陣列元素：`int B[1] = {1}; A[B[0]] = 20;`

**範例**：
```cpp
#include <iostream>
using namespace std;
int main() {
    int A[3];
    A[0] = 30; // 第一個位置存入 30
    int x = 1;
    A[x] = 20; // 第二個位置存入 20
    cout << A[0] << ' ' << A[1] << endl;
    return 0;
}
```

### 4. 記憶體中的表示法
陣列佔用連續記憶體空間，便於計算元素位址。

#### 4.1 一維陣列
設起始位址為 `Lo`，元素大小為 `d`（byte），索引值為 `i`，則：
- **位址計算公式**：`A[i] = Lo + i * d`

**範例 1**：
- 問題：若整數佔 4 byte，陣列 `A` 起始位址為 100，則 `A[5]` 的位址為何？
- 解答：`Lo = 100, d = 4, i = 5`  
  `A[5] = 100 + 5 * 4 = 120`

**範例 2**：
- 問題：若陣列 `A` 索引從 `L` 到 `U`，起始位址為 `Lo`，元素大小為 `d`，則 `A[i]` 的位址為何？
- 解答：`A[i] = Lo + (i - L) * d`

**範例 3**：
- 問題：若整數佔 2 byte，`A[10]` 起始位址為 200，則 `A[20]` 的位址為何？
- 解答：`Lo = 200, d = 2, i = 20, L = 10`  
  `A[20] = 200 + (20 - 10) * 2 = 200 + 20 = 220`

#### 4.2 二維陣列
設二維陣列為 `M × N`（M 列，N 行），起始位址為 `Lo`，元素大小為 `d`。
- **Row-major（以列為主）**：按列順序儲存，`A[i][j] = Lo + (i * N + j) * d`
- **Column-major（以行為主）**：按行順序儲存，`A[i][j] = Lo + (j * M + i) * d`

#### 4.3 多維陣列
以三維陣列 `A[i][j][k]` 為例，設第一維大小為 `u1`，第二維為 `u2`，第三維為 `u3`，起始位址為 `α`，則：
- **Row-major**：`A[i][j][k] = α + ((i-1) * u2 * u3 + (j-1) * u3 + (k-1)) * d`

**取得位址**：
- 使用 `&A[i]` 或 `&A[i][j][k]` 取得記憶體位址。

## 陣列的應用

### 1. 字串
C++ 中字串可用 `string` 或 `char[]` 表示，`char[]` 需以空字元 `'\0'` 結尾。

**範例**：
```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    char text1[] = {'h', 'e', 'l', 'l', 'o', '\0'};
    char text2[] = "hello";
    string text3 = "hello";
    cout << text1 << ' ' << text2 << ' ' << text3 << endl;
    return 0;
}
```

**注意**：
- C 語言無 `string` 型態，僅用 `char[]`。
- `'\0'`（ASCII 0）標記字串結束，佔 1 byte。

### 2. 多項式（Polynomials）
多項式表示為：`P(x) = A_m * x^m + A_{m-1} * x^{m-1} + ... + A_1 * x^1 + A_0 * x^0`

**儲存方式**：
- **依指數高低儲存係數**：按指數順序儲存所有係數，適用於非零項較多情況。
- **儲存非零項的係數與指數**：僅儲存非零項，節省空間，適用於稀疏多項式。

**範例 1：依指數高低儲存係數**
- 問題：`f(x) = 7x^4 + 5x^2 + 3x`
- 解答：
  ```cpp
  int poly[5] = {0, 3, 5, 0, 7}; // 索引 0~4 對應 x^0 ~ x^4
  ```

**範例 2：儲存非零項的係數與指數**
- 問題：`f(x) = 5x^100 + 1`
- 解答：
  ```cpp
  int poly[3][2] = {{2, 0}, {5, 100}, {1, 0}}; // {非零項數, {係數, 指數}}
  ```

### 3. 矩陣（Matrices）
矩陣為 `m × n` 的二維陣列，m 表示列數，n 表示行數。

#### 3.1 矩陣轉置（Matrix Transposition）
`B[j][i] = A[i][j]`

**範例**：
```cpp
#include <iostream>
using namespace std;

void Matrix_Transpose(int m, int n, int A[][3], int B[][2]) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            B[j][i] = A[i][j];
        }
    }
}

int main() {
    int A[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int B[3][2];
    Matrix_Transpose(2, 3, A, B);
    return 0;
}
```

#### 3.2 矩陣相加（Matrix Addition）
`C[i][j] = A[i][j] + B[i][j]`

**範例**：
```cpp
#include <iostream>
using namespace std;

void Matrix_Add(int m, int n, int A[][3], int B[][3], int C[][3]) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = A[i][j] + B[i][j];
        }
    }
}

int main() {
    int A[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int B[2][3] = {{7, 8, 9}, {10, 11, 12}};
    int C[2][3];
    Matrix_Add(2, 3, A, B, C);
    return 0;
}
```

#### 3.3 矩陣相乘（Matrix Multiplication）
`C[i][j] = Σ (A[i][k] * B[k][j])`

**範例**：
```cpp
#include <iostream>
using namespace std;

void Matrix_Mul(int m, int n, int p, int A[][3], int B[][3], int C[][3]) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < p; j++) {
            C[i][j] = 0;
            for (int k = 0; k < n; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
}

int main() {
    int A[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int B[3][2] = {{7, 8}, {9, 10}, {11, 12}};
    int C[2][2];
    Matrix_Mul(2, 3, 2, A, B, C);
    return 0;
}
```

#### 3.4 稀疏矩陣（Sparse Matrix）
多數元素為 0 的矩陣，直接用二維陣列儲存浪費空間。可用以下方式優化：
- 儲存非零項的 `{行, 列, 值}` 三元組。

**範例**（儲存稀疏矩陣）：
```cpp
#include <iostream>
using namespace std;

struct SparseElement {
    int row, col, value;
};

void StoreSparseMatrix(int m, int n, int A[][3], SparseElement sparse[], int& count) {
    count = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (A[i][j] != 0) {
                sparse[count].row = i;
                sparse[count].col = j;
                sparse[count].value = A[i][j];
                count++;
            }
        }
    }
}
```

## 其他陣列知識

### 1. 使用 `sizeof`
計算陣列或元素的大小（byte）。
```cpp
#include <iostream>
using namespace std;
int main() {
    int score[6];
    cout << sizeof(score) << endl;     // 24（6 個 int，假設 int 為 4 byte）
    cout << sizeof(score[2]) << endl; // 4（單個 int）
    return 0;
}
```

### 2. 計算陣列元素個數
```cpp
#include <iostream>
using namespace std;
int main() {
    int a[] = {3, 4, 6};
    int length = sizeof(a) / sizeof(int); // 3
    cout << "Length: " << length << endl;
    return 0;
}
```

### 3. 陣列與指標
陣列名稱是指向首元素的指標，支援指標運算。

**範例**：
```cpp
#include <iostream>
using namespace std;
int main() {
    int arr[4] = {1, 2, 3, 4};
    for (int i = 0; i < 4; i++) {
        cout << *(arr + i) << ' '; // 等同於 arr[i]
    }
    cout << endl;
    return 0;
}
```

**陣列作為函數參數**：
- 一維陣列：傳遞首元素地址。
- 二維陣列：需指定行數（第二維大小）。

**一維陣列範例**：
```cpp
#include <iostream>
using namespace std;

void print(int arr[], int len) {
    for (int i = 0; i < len; i++) {
        cout << arr[i] << ' ';
    }
    cout << endl;
}

int main() {
    int a[3] = {1, 2, 3};
    print(a, 3); // 等同於 print(&a[0], 3)
    return 0;
}
```

**二維陣列範例**：
```cpp
#include <iostream>
using namespace std;

void print(int arr[][3], int i_len, int j_len) {
    for (int i = 0; i < i_len; i++) {
        for (int j = 0; j < j_len; j++) {
            cout << arr[i][j] << ' ';
        }
    }
    cout << endl;
}

int main() {
    int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
    print(a, 2, 3);
    return 0;
}
```

**注意**：二維陣列作為參數時，行數（第二維）不可省略。

### 4. 陣列大小預留
為避免越界，宣告陣列時通常預留稍大空間。
```cpp
int arr[1005]; // 預留 1005 個元素，容納 1000 個資料
```

### 5. 陣列界限設置
C++ 不檢查索引越界，需自行確保索引有效，避免執行時錯誤（run-time error）。

**範例：使用宏定義陣列大小**：
```cpp
#define MAX 5
int arr[MAX];
```

## 延伸練習題
1. **a015. 矩陣的翻轉**：<https://zerojudge.tw/ShowProblem?problemid=a015>
2. **a022. 迴文**：<https://zerojudge.tw/ShowProblem?problemid=a022>
3. **a038. 數字翻轉**：<https://zerojudge.tw/ShowProblem?problemid=a038>

