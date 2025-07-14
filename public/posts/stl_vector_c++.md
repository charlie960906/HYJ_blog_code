---
title: C++ STL 與 Vector 容器
date: 2025-07-09
summary: 本文介紹 C++ 標準模板庫（STL）及其核心組成，並聚焦於 vector 容器的特色、宣告、操作（插入、刪除、遍歷等）與應用。
tags: C++, 初學, STL, Vector
category: information
---


# C++ STL 與 Vector 容器

## STL 是什麼？
**Standard Template Library (STL)** 是 C++ 標準程式庫的一部分，提供通用的模板類別和函數，主要由以下三部分組成：
1. **容器（Containers）**：用於儲存和管理資料，如 `array`、`vector`、`map`、`queue` 等。
2. **演算法（Algorithms）**：提供常見操作，如排序、搜尋、複製等（例如 `std::sort`、`std::find`）。
3. **迭代器（Iterators）**：用於遍歷容器中的元素，作為容器與演算法的橋樑。

**圖示**：
- STL 元素結構（來源：<https://d1m75rqqgidzqn.cloudfront.net/wp-data/2021/03/23180546/23-1024x332.png>）
- STL 容器介紹（來源：<https://iq.opengenus.org/content/images/2019/05/c1.JPG>）

## Vector 容器

### 1. 特色
1. **動態調整大小**：根據需要自動擴展或縮減容量。
2. **快速插入/刪除**：在末尾操作效率高，指定位置操作需移動後續元素。
3. **連續記憶體儲存**：元素在記憶體中連續排列，支援隨機存取。
4. **全域宣告初始化**：全域宣告的 `vector` 自動將元素初始化為 0。

### 2. 標頭檔
```cpp
#include <vector>
```

### 3. 宣告
**語法**：
```cpp
std::vector<元素型態> 向量名稱;
std::vector<元素型態> 向量名稱 = {值1, 值2, ...};
std::vector<std::vector<元素型態>> 向量名稱;
```

**範例**：
```cpp
#include <vector>
#include <string>
std::vector<int> vec;
std::vector<std::string> vec2;
std::vector<int> vec3 = {1, 2, 3};
std::vector<std::vector<int>> vec4;
```

### 4. 取得元素
**語法**：
```cpp
向量名稱[索引];
向量名稱.at(索引);
```

**範例**：
```cpp
#include <vector>
std::vector<int> myVector = {1, 2, 3};
int element1 = myVector[0];
int element2 = myVector.at(1);
```

### 5. 插入元素

#### 5.1 插入到尾端
- **`push_back`**：複製或移動元素到尾端。
- **`emplace_back`**：直接在尾端構造元素，效率更高。

**範例**：
```cpp
#include <vector>
std::vector<int> myVector;
myVector.push_back(1);
myVector.emplace_back(2);
```

#### 5.2 插入到特定位置
**練習**：
```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> myVector = {1, 2, 3, 4, 5};
    auto it = myVector.begin() + 2;
    myVector.insert(it, 10);
    it = myVector.begin() + 3;
    myVector.insert(it, {20, 30});
    for (int x : myVector) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}
```

**輸出**：
```
1 2 10 20 30 3 4 5
```

### 6. 刪除元素

#### 6.1 刪除尾端元素（`pop_back`）
```cpp
#include <vector>
std::vector<int> myVector = {1, 2, 3};
myVector.pop_back();
```

#### 6.2 刪除指定位置（`erase`）
**練習：刪除單一元素**：
```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> demo = {1, 2, 3, 4, 5};
    auto iter = demo.erase(demo.begin() + 1);
    cout << "size is: " << demo.size() << endl;
    for (int x : demo) {
        cout << x << " ";
    }
    cout << endl << *iter << endl;
    return 0;
}
```

**輸出**：
```
size is: 4
1 3 4 5
3
```

**練習：刪除區間**：
```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> demo = {1, 2, 3, 4, 5};
    auto iter = demo.erase(demo.begin() + 1, demo.end() - 1);
    cout << "size is: " << demo.size() << endl;
    cout << "capacity is: " << demo.capacity() << endl;
    for (int x : demo) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}
```

**輸出**：
```
size is: 2
capacity is: 5
1 5
```

#### 6.3 移除特定值（`remove`）
**練習**：
```cpp
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    vector<int> demo = {1, 3, 3, 4, 3, 5};
    auto iter = remove(demo.begin(), demo.end(), 3);
    cout << "size is: " << demo.size() << endl;
    for (auto first = demo.begin(); first < iter; ++first) {
        cout << *first << " ";
    }
    cout << endl;
    demo.erase(iter, demo.end());
    cout << "size after erase: " << demo.size() << endl;
    return 0;
}
```

**輸出**：
```
size is: 6
1 4 5
size after erase: 3
```

#### 6.4 清除所有元素（`clear`）
**練習**：
```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> demo = {1, 3, 3, 4, 3, 5};
    demo.clear();
    cout << "size is: " << demo.size() << endl;
    cout << "capacity is: " << demo.capacity() << endl;
    return 0;
}
```

**輸出**：
```
size is: 0
capacity is: 6
```

### 7. 取得大小
```cpp
#include <vector>
#include <iostream>
std::vector<int> vec = {1, 2, 3};
std::cout << vec.size();
```

**輸出**：
```
3
```

### 8. 檢查是否為空
```cpp
#include <vector>
#include <iostream>
std::vector<int> vec;
std::cout << vec.empty();
```

**輸出**：
```
1
```

### 9. 迭代器
#### 9.1 For 迴圈遍歷
```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> vec = {1, 2, 3, 4, 5};
    for (int i = 0; i < vec.size(); i++) {
        cout << vec[i] << " ";
    }
    cout << endl;
    return 0;
}
```

**輸出**：
```
1 2 3 4 5
```

#### 9.2 迭代器遍歷
```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> vec = {1, 2, 3, 4, 5};
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        cout << *it << " ";
    }
    cout << endl;
    return 0;
}
```

**輸出**：
```
1 2 3 4 5
```

#### 9.3 範圍 for 迴圈
```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> vec = {1, 2, 3, 4, 5};
    for (int x : vec) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}
```

**輸出**：
```
1 2 3 4 5
```

### 10. 改變向量大小
**練習**：
```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> vec1 = {2, 4, 6, 8, 10};
    vec1[4] = 1;
    cout << "vec1: ";
    for (int x : vec1) {
        cout << x << " ";
    }
    cout << endl;

    vector<int> vec2;
    vec2.resize(5);
    vec2[4] = 1;
    cout << "vec2: ";
    for (int x : vec2) {
        cout << x << " ";
    }
    cout << endl;
    return 0;
}
```

**輸出**：
```
vec1: 2 4 6 8 1
vec2: 0 0 0 0 1
```

**錯誤範例**：
```cpp
#include <vector>
#include <iostream>
using namespace std;

int main() {
    vector<int> vec1;
    vec1[4] = 1; // 錯誤：越界存取
    return 0;
}
```