---
title: C++ 指標與參照
date: 2025-07-08
summary: 本文介紹 C++ 指標與參照的概念，包括指標的宣告與運算、函數指標、陣列與雙重指標、靜態與動態記憶體配置。
tags: C++, 初學, Pointers, 指標
category: information
---

# C++ 指標與參照

## 指標（Pointer）

### 1. 宣告指標變數
指標用於儲存變數的記憶體位址。

**語法**：
```cpp
資料型態 *指標變數;
```

**範例**：
```cpp
int *ptr; // 宣告整數指標
```

**指向變數**：
```cpp
int num = 20;
int *ptr = &num; // ptr 指向 num 的位址
// 或
int *ptr;
ptr = &num;
```

### 2. 介紹
1. **指標儲存位址**：指標儲存變數的記憶體位址，`ptr` 指向變數 `a` 表示 `ptr` 儲存 `a` 的位址。
2. **指標自身有位址**：指標變數本身也有記憶體位址，與其指向的變數位址無關。
3. **重新指向**：指標可指向另一同型態變數。
4. **固定大小**：指標本身佔 4 byte（32 位系統）或 8 byte（64 位系統），與指向的資料型態無關。

**範例：指標大小**：
```cpp
#include <iostream>
using namespace std;

int main() {
    int *iptr;
    char *cptr;
    cout << "sizeof(iptr)=" << sizeof(iptr) << endl; // 指標大小
    cout << "sizeof(cptr)=" << sizeof(cptr) << endl; // 指標大小
    cout << "sizeof(*iptr)=" << sizeof(*iptr) << endl; // 整數大小
    cout << "sizeof(*cptr)=" << sizeof(*cptr) << endl; // 字元大小
    return 0;
}
```

**圖示**：
- 指標指向變數的記憶體位址（待補充圖示）。
- 指標自身的記憶體位址（待補充圖示）。

### 3. 運算子
1. **位址運算子 `&`**：取得變數的記憶體位址。
2. **取值運算子 `*`**：取得指標指向變數的內容。

**範例**：
```cpp
int num = 20;
int *ptr = &num; // &num 取得 num 位址
cout << *ptr;    // *ptr 取得 num 的值（20）
```

### 4. 指標與函數的應用

#### 4.1 傳遞指標到函數
**語法**：
```cpp
傳回值型態 函數名稱(資料型態 *指標變數) {
    // 函數內容
}
```

**呼叫方式**：
```cpp
int a = 10;
int *ptr = &a;
func(&a); // 傳遞 a 的位址
func(ptr); // 傳遞指標
```

#### 4.2 回傳指標
**語法**：
```cpp
傳回值型態 *函數名稱(資料型態 引數) {
    // 函數內容
    return 指標;
}
```

**練習：回傳兩數最大值的指標**：
```cpp
#include <iostream>
using namespace std;

int *max(int *p1, int *p2) {
    if (*p1 > *p2) {
        return p1;
    } else {
        return p2;
    }
}

int main() {
    int a = 12, b = 19, *ptr;
    ptr = max(&a, &b);
    cout << "max=" << *ptr << endl; // 輸出 19
    return 0;
}
```

#### 4.3 傳值與傳址的差異
- **傳值（Pass by Value）**：傳遞變數副本，函數內修改不影響原變數。
- **傳址（Pass by Address）**：傳遞變數位址，函數內修改影響原變數。

**傳值範例**（無效交換）：
```cpp
#include <iostream>
using namespace std;

void swap(int x, int y) {
    int tmp = x;
    x = y;
    y = tmp;
}

int main() {
    int a = 5, b = 20;
    cout << "交換之前 a=" << a << ", b=" << b << endl;
    swap(a, b);
    cout << "交換之後 a=" << a << ", b=" << b << endl; // a=5, b=20
    return 0;
}
```

**傳址範例**（有效交換）：
```cpp
#include <iostream>
using namespace std;

void swap(int *p1, int *p2) {
    int tmp = *p1;
    *p1 = *p2;
    *p2 = tmp;
}

int main() {
    int a = 5, b = 20;
    cout << "交換之前 a=" << a << ", b=" << b << endl;
    swap(&a, &b);
    cout << "交換之後 a=" << a << ", b=" << b << endl; // a=20, b=5
    return 0;
}
```

**狀況說明**（原文件中的 `!` 標記）：
- 傳值：函數內操作副本，原變數不變。
- 傳址：函數內操作原變數位址，修改生效。
- 注意：傳址需小心，避免意外修改或空指標（null pointer）問題。
- 指標操作需確保指向有效記憶體。

### 5. 函數指標（Function Pointer）
函數名稱儲存函數的起始位址，可用函數指標指向並呼叫。

**語法**：
```cpp
傳回值型態 (*指標變數名稱)(引數型態1, 引數型態2, ...);
```

**範例**：
```cpp
#include <iostream>
using namespace std;

int square(int n) {
    return n * n;
}

int main() {
    int (*pf)(int);
    pf = square;
    cout << "square(5)=" << (*pf)(5) << endl; // 輸出 25
    return 0;
}
```

**傳遞函數指標**：
```cpp
#include <iostream>
using namespace std;

double triangle(double base, double height) {
    return base * height / 2;
}

void show_area(double x, double y, double (*pf)(double, double)) {
    cout << "Area=" << (*pf)(x, y) << endl;
}

int main() {
    show_area(4, 6.6, triangle); // 輸出 Area=13.2
    return 0;
}
```

### 6. 指標與陣列的關係

#### 6.1 指標的算術運算
- 指標可進行加減運算，移動單位為指向資料型態的大小（byte）。
- 陣列名稱是指標常數，指向陣列首元素。

**範例：存取陣列**：
```cpp
#include <iostream>
using namespace std;

int main() {
    int a[3] = {5, 7, 9};
    cout << "a[0]=" << a[0] << ", *(a+0)=" << *(a+0) << endl;
    cout << "a[1]=" << a[1] << ", *(a+1)=" << *(a+1) << endl;
    cout << "a[2]=" << a[2] << ", *(a+2)=" << *(a+2) << endl;
    return 0;
}
```

**練習：計算陣列總和**：
- **方法一**（使用陣列名稱）：
  ```cpp
  #include <iostream>
  using namespace std;

  int main() {
      int a[5] = {1, 2, 3, 4, 5}, sum = 0;
      for (int i = 0; i < 5; i++) {
          sum += *(a + i);
      }
      cout << "Sum=" << sum << endl; // 輸出 15
      return 0;
  }
  ```

- **方法二**（使用指標）：
  ```cpp
  #include <iostream>
  using namespace std;

  int main() {
      int a[5] = {1, 2, 3, 4, 5}, sum = 0;
      int *ptr = a;
      for (int i = 0; i < 5; i++) {
          sum += *(ptr++);
      }
      cout << "Sum=" << sum << endl; // 輸出 15
      return 0;
  }
  ```

**注意**：
- 陣列名稱（如 `a`）是**指標常數**，不可修改（`a = a + 1` 無效）。
- 指標變數（如 `ptr`）可修改（`ptr = ptr + 1` 有效）。

**練習：指標常數的位址與值**：
```cpp
#include <iostream>
using namespace std;

int main() {
    int a[5] = {32, 16, 35, 65, 52};
    cout << "a=" << a << endl; // 陣列首地址
    cout << "&a=" << &a << endl; // 陣列本身的地址
    for (int i = 0; i < 5; i++) {
        cout << "&a[" << i << "]=" << &a[i] << endl; // 各元素地址
    }
    return 0;
}
```

**傳遞陣列到函數**：
```cpp
#include <iostream>
using namespace std;

void func(int *arr, int n) {
    for (int i = 0; i < n; i++) {
        cout << arr[i] << ' ';
    }
    cout << endl;
}

int main() {
    int arr[3] = {1, 2, 3};
    func(arr, 3); // 傳遞陣列首地址
    return 0;
}
```

#### 6.2 指標陣列
儲存指標的陣列，常用於字串陣列。

**語法**：
```cpp
資料型態 *陣列名稱[元素個數];
```

**範例**：
```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 1, y = 2, z = 3;
    int *ptr[3] = {&x, &y, &z};
    for (int i = 0; i < 3; i++) {
        cout << *ptr[i] << ' ';
    }
    cout << endl;
    return 0;
}
```

#### 6.3 指標指向字串
字串可用字元陣列或字元指標表示。

**範例**：
```cpp
#include <iostream>
using namespace std;

int main() {
    char name[20];
    char *ptr = "how are you?";
    cout << "what's your name?" << endl;
    cin.getline(name, 20);
    cout << "hi, " << name << ", " << ptr << endl;
    return 0;
}
```

**字串陣列範例**：
```cpp
#include <iostream>
using namespace std;

int main() {
    char *ptr[3] = {"apple", "banana", "cherry"};
    for (int i = 0; i < 3; i++) {
        cout << ptr[i] << endl;
    }
    return 0;
}
```

#### 6.4 雙重指標（Pointer to Pointer）
指向指標的指標，儲存另一指標的位址。

**語法**：
```cpp
資料型態 **雙重指標;
資料型態 *(*雙重指標); // 可加括號
```

**二維陣列與雙重指標**：
- 二維陣列名稱可視為指向一維陣列的指標。
- `*(num + m) + n`：第 m+1 列，第 n+1 行的位址。
- `*(*(num + m) + n)`：第 m+1 列，第 n+1 行的值。

**練習：印出二維陣列位址與值**：
```cpp
#include <iostream>
using namespace std;

int main() {
    int num[3][4] = {{12, 23, 42, 18}, {43, 22, 16, 14}, {31, 13, 19, 28}};
    for (int m = 0; m < 3; m++) {
        for (int n = 0; n < 4; n++) {
            cout << "num[" << m << "][" << n << "]=" << *(*(num + m) + n);
            cout << ", 地址=" << *(num + m) + n << endl;
        }
    }
    return 0;
}
```

**圖示**：
- 二維陣列與指標陣列的關係（待補充圖示）。
- 雙重指標存取二維陣列的示意（待補充圖示）。

### 7. 靜態與動態記憶體配置

#### 7.1 靜態記憶體配置
- **定義**：編譯時分配固定記憶體，程式執行時使用。
- **特點**：記憶體大小固定，生命週期隨程式執行。

**圖示**：靜態記憶體配置示意（待補充圖示）。

#### 7.2 動態記憶體配置
- **定義**：執行時從堆（heap）分配記憶體。
- **特點**：靈活分配，需手動釋放。

**指標創建與釋放**：
```cpp
型態A *指標變數名稱;
指標變數名稱 = new 型態A;
delete 指標變數名稱; // 釋放記憶體
```

**範例：動態配置整數**：
```cpp
#include <iostream>
using namespace std;

int main() {
    int *a = new int; // 分配整數記憶體
    *a = 5;
    cout << "*a=" << *a << endl; // 輸出 5
    delete a; // 釋放記憶體
    a = nullptr; // 避免野指標
    // cout << "*a=" << *a << endl; // 錯誤：訪問已釋放記憶體
    return 0;
}
```

**陣列創建與釋放**：
```cpp
型態A *指標變數 = new 型態A[個數];
delete[] 指標變數; // 釋放陣列記憶體
指標變數 = nullptr;
```

**練習：動態配置整數陣列**：
```cpp
#include <iostream>
using namespace std;

int main() {
    int *a = new int[5];
    for (int i = 0; i < 5; i++) {
        a[i] = i * 2;
        cout << "a[" << i << "]=" << a[i] << " ";
    }
    cout << endl;
    delete[] a;
    a = nullptr;
    return 0;
}
```

**範例：動態配置字串**：
```cpp
#include <iostream>
#include <cstring>
using namespace std;

char *setString(const char *text) {
    char *ptr = new char[strlen(text) + 1];
    strcpy(ptr, text);
    return ptr;
}

int main() {
    char *str = setString("hello c++");
    cout << str << endl;
    delete[] str;
    str = nullptr;
    return 0;
}
```

### 8. 指標與參照

#### 8.1 指標
使用 `&`（位址運算子）和 `*`（取值運算子）操作變數位址與內容。

#### 8.2 參照
參照是變數的別名，直接操作原變數。

**語法**：
```cpp
資料型態 &參照名稱 = 變數名稱;
```

**範例**：
```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 5;
    int &ref = x; // ref 是 x 的別名
    cout << "x=" << x << ", ref=" << ref << endl; // x=5, ref=5
    ref = 10; // 修改 ref，等同修改 x
    cout << "x=" << x << ", ref=" << ref << endl; // x=10, ref=10
    return 0;
}
```

**練習：指標與參照結合**：
```cpp
#include <iostream>
using namespace std;

int main() {
    int a = 10, &ref = a;
    int b = 15, *ptr = &b;
    cout << a << "+" << b << "=" << ref + *ptr << endl; // 輸出 25
    return 0;
}
```

#### 8.3 引數傳遞方式
1. **傳值（Pass by Value）**：傳遞副本，函數內修改不影響原變數。
2. **傳址（Pass by Address）**：傳遞位址，函數內修改影響原變數。
3. **傳參照（Pass by Reference）**：傳遞別名，函數內修改影響原變數。

**傳參照範例**：
```cpp
#include <iostream>
using namespace std;

void swap(int &x, int &y) {
    int tmp = x;
    x = y;
    y = tmp;
}

int main() {
    int a = 5, b = 20;
    cout << "交換之前 a=" << a << ", b=" << b << endl;
    swap(a, b);
    cout << "交換之後 a=" << a << ", b=" << b << endl; // a=20, b=5
    return 0;
}
```

**圖示**：傳值、傳址、傳參照的比較（待補充圖示）。
