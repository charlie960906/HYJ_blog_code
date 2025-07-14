---
title: C++ 結構（Struct）基礎與應用
date: 2025-07-09
summary: 本文介紹 C++ 結構（struct）的概念，包括定義、宣告、別名（typedef）、成員存取、初始化，以及結構與函數的應用。
tags: C++, 進階, Struct, 結構
category: information
---

# C++ 結構（Struct）

## 本章重點
1. 認識結構（`struct`）的概念與用途。
2. 理解 `typedef` 的使用方式。
3. 分辨有無 `typedef` 的結構宣告形式。
4. 探索結構在函數中的應用。

## 簡介
結構（`struct`）是一種自定義資料型態，允許儲存不同型態的資料，與陣列或向量（僅限單一型態）不同。結構類似製造餃子的模具（定義格式），而結構體（結構變數）則是依模具製作的餃子（實例，內含不同資料）。

| **結構（模具）** | **結構體（餃子）** |
|------------------|--------------------|
| 定義資料格式，決定結構體的欄位 | 實際儲存資料的實例 |

**圖示**：結構與結構體類比（來源：<https://pic.pimg.tw/abcjcba/1622209265-791097763-g_wn.jpg>）

**與類別（class）的比較**：
- 結構和類別功能相似，但結構預設成員為公用（`public`），類別預設為私有（`private`）。
- 結構通常用於簡單資料聚合，類別則包含更多物件導向特性（如方法、繼承）。

## 宣告與建立變數

### 1. 建立結構後宣告變數
**語法**：
```cpp
struct 結構名稱 {
    資料型態1 欄位名稱1;
    資料型態2 欄位名稱2;
    // ...
}; // 注意分號

struct 結構名稱 變數名稱1, 變數名稱2, ...;
```

**範例**：
```cpp
#include <string>
struct Car {
    int price;
    std::string brand;
};

int main() {
    Car car1; // 宣告結構變數
    car1.price = 10000;
    car1.brand = "Toyota";
    return 0;
}
```

### 2. 建立結構同時宣告變數
**語法**：
```cpp
struct 結構名稱 {
    資料型態1 欄位名稱1;
    資料型態2 欄位名稱2;
    // ...
} 變數名稱1, 變數名稱2, ...;
```

**範例**：
```cpp
#include <string>
struct Car {
    int price;
    std::string brand;
} car1, car2;

int main() {
    car1.price = 10000;
    car1.brand = "Toyota";
    car2.price = 15000;
    car2.brand = "Honda";
    return 0;
}
```

### 3. 宣告結構別名（使用 `typedef`）
**語法**：
```cpp
struct 結構名稱 {
    資料型態1 欄位名稱1;
    資料型態2 欄位名稱2;
    // ...
};
typedef struct 結構名稱 新結構名稱;
```

**範例**：
```cpp
#include <string>
struct Student {
    int id;
    std::string name;
    int chinese;
    int english;
    int math;
};
typedef struct Student StudentAlias;

int main() {
    StudentAlias stu1; // 使用別名宣告變數
    stu1.id = 1;
    stu1.name = "Alice";
    return 0;
}
```

### 4. 定義結構同時取別名
**語法**：
```cpp
typedef struct {
    資料型態1 欄位名稱1;
    資料型態2 欄位名稱2;
    // ...
} 新結構名稱;
```

**範例**：
```cpp
#include <string>
typedef struct {
    int id;
    std::string name;
    int chinese;
    int english;
    int math;
} Student;

int main() {
    Student stu1; // 直接使用別名
    stu1.id = 1;
    stu1.name = "Bob";
    return 0;
}
```

## 結構成員的使用

### 1. 使用點運算子（`.`）
直接通過結構變數存取成員。

**語法**：
```cpp
結構變數名稱.欄位名稱
```

**範例**：
```cpp
#include <iostream>
#include <string>
using namespace std;

struct Car {
    int price;
    string brand;
};

int main() {
    Car car1;
    car1.price = 10000;
    car1.brand = "Toyota";
    cout << car1.brand << ": $" << car1.price << endl; // 輸出：Toyota: $10000
    return 0;
}
```

**練習**：
```cpp
#include <iostream>
#include <string>
using namespace std;

struct Data {
    string name;
    int math;
} student;

int main() {
    cin >> student.name >> student.math;
    cout << "student " << student.name << " gets " << student.math << " points" << endl;
    return 0;
}
```

**範例輸入**：
```
Alice 90
```

**範例輸出**：
```
student Alice gets 90 points
```

### 2. 使用指標運算子（`->`）
通過結構指標存取成員。

**語法**：
```cpp
結構指標->欄位名稱
```

**範例**：
```cpp
#include <iostream>
#include <string>
using namespace std;

struct Car {
    int price;
    string brand;
};

int main() {
    Car mazda;
    Car* ptr = &mazda;
    ptr->price = 100000;
    ptr->brand = "Mazda";
    cout << ptr->brand << ": $" << ptr->price << endl; // 輸出：Mazda: $100000
    return 0;
}
```

**練習：指針方式完成學生資料輸入**：
```cpp
#include <iostream>
#include <string>
using namespace std;

struct Data {
    string name;
    int math;
};

int main() {
    Data student;
    Data* ptr = &student;
    cin >> ptr->name >> ptr->math;
    cout << "student " << ptr->name << " gets " << ptr->math << " points" << endl;
    return 0;
}
```

**範例輸入**：
```
Bob 85
```

**範例輸出**：
```
student Bob gets 85 points
```

## 設定初值

### 1. 宣告結構變數並初始化
**語法**：
```cpp
struct 結構名稱 {
    // ...
};
struct 結構名稱 結構變數名稱 = {初始化內容};
```

**範例**：
```cpp
#include <string>
struct Data {
    std::string name;
    int math;
};

int main() {
    Data student = {"Nick", 90};
    return 0;
}
```

### 2. 定義結構同時初始化
**語法**：
```cpp
struct 結構名稱 {
    // ...
} 結構變數名稱 = {初始化內容};
```

**範例**：
```cpp
#include <string>
struct Data {
    std::string name;
    int math;
} student = {"Nick", 90};

int main() {
    return 0;
}
```

## 結構與函數

### 1. 傳遞整個結構
將結構變數作為參數傳入函數。

**語法**：
```cpp
struct 結構名稱 {
    // ...
} 變數1, 變數2, ...;

回傳值型態 函數名稱(struct 結構名稱 參數名稱);

回傳值型態 函數名稱(struct 結構名稱 參數名稱) {
    // ...
}
```

**練習**：
```cpp
#include <iostream>
using namespace std;

struct Scores {
    float eng;
    float math;
    float sci;
};

float avg(struct Scores my_score) {
    return (my_score.eng + my_score.math + my_score.sci) / 3;
}

int main() {
    Scores nick = {99, 90, 88};
    cout << "Average: " << avg(nick) << endl; // 輸出：92.3333
    return 0;
}
```

### 2. 傳遞結構欄位
將結構的各欄位分別傳入函數。

**語法**：
```cpp
struct 結構名稱 {
    // ...
} 變數1, 變數2, ...;

回傳值型態 函數名稱(資料型態1, 資料型態2, ...);

回傳值型態 函數名稱(資料型態1 變數1, 資料型態2 變數2, ...) {
    // ...
}
```

**練習**：
```cpp
#include <iostream>
using namespace std;

struct Scores {
    int eng;
    int math;
    int sci;
};

float avg(int score1, int score2, int score3) {
    return (float)(score1 + score2 + score3) / 3;
}

int main() {
    Scores nick = {99, 90, 88};
    cout << "Average: " << avg(nick.eng, nick.math, nick.sci) << endl; // 輸出：92.3333
    return 0;
}
```

### 3. 傳遞結構位址
通過結構指標傳遞，節省記憶體並允許修改原結構。

**練習**：
```cpp
#include <iostream>
using namespace std;

struct Scores {
    int eng;
    int math;
    int sci;
};

float avg(Scores* ptr) {
    return (float)(ptr->eng + ptr->math + ptr->sci) / 3;
}

int main() {
    Scores nick = {99, 90, 88};
    cout << "Average: " << avg(&nick) << endl; // 輸出：92.3333
    return 0;
}
```