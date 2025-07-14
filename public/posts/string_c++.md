---
title: C++ 字串基礎與應用
date: 2025-07-08
summary: 本文介紹 C++ 字串的定義、宣告、輸入輸出方式、緩衝區處理、字串長度計算、轉數字以及分割字串的方法。
tags: C++, 初學, Strings, 字串
category: information
---

# C++ 字串（String）

## 定義
1. **字串常數**：以雙引號（`"`）包圍的資料，例如 `"Hello"`。
2. **結束字元**：字串儲存於記憶體時，自動在結尾添加空字元 `'\0'`（ASCII 0），標記字串結束。

**圖示**：字串儲存示意（待補充圖示，展示 `"Hello"` 與 `'\0'` 的記憶體結構）。

## 宣告方式
```cpp
#include <string> // 使用 string 型態需包含
string 字串名稱 = ""; // 字串物件
char 字元陣列名稱[字串長度]; // 未初始化
char 字元陣列名稱[字串長度] = ""; // 初始化為空字串
```

**其他宣告方式**：
```cpp
char 字元陣列名稱[] = "Hello"; // 自動推斷長度（包含 '\0'）
string 字串名稱 = "Hello"; // 直接賦值
char *字元指標 = "Hello"; // 指標指向字串常數
```

## 字串的輸入與輸出

### 1. 標準資料流
C++ 使用資料流（Data Streams）處理輸入與輸出，標準資料流物件包括：
- `std::cin`：標準輸入流，從鍵盤讀取資料。
- `std::cout`：標準輸出流，輸出到控制台。
- `std::cerr`：標準錯誤流，輸出錯誤訊息。

### 2. 輸出
使用 `cout` 與資料流插入運算子 `<<` 輸出字串。

**範例**：
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "Hello, world!";
    cout << s << endl; // 輸出字串物件
    cout << "C++" << endl; // 輸出字串常數
    return 0;
}
```

### 3. 輸入

#### 3.1 `cin`
- 使用資料流擷取運算子 `>>` 讀取字串。
- 遇到空白、回車（Enter）或 Tab 會終止輸入。

**範例：輸入含空白的字串**：
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cout << "請輸入：";
    cin >> s;
    cout << "您輸入的是：" << s << endl;
    return 0;
}
```

**情況**：
```
請輸入：hello world
您輸入的是：hello // 僅讀取空白前的字串
```

**緩衝區影響**：
- `cin` 讀取時，將輸入存入緩衝區。
- 遇到空白或回車時停止讀取，剩餘內容留在緩衝區，可能影響後續輸入。

**範例：緩衝區問題**：
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s1, s2;
    cout << "輸入 s1：";
    cin >> s1;
    cout << s1 << endl;
    cout << "輸入 s2：";
    cin >> s2;
    cout << s2 << endl;
    return 0;
}
```

**情況**：
```
輸入 s1：hello world
hello
輸入 s2：world // 未要求輸入，直接從緩衝區讀取
```

**範例：年齡與姓名輸入**：
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int age;
    string name;
    cout << "how old are you?" << endl;
    cin >> age;
    cout << "what is your name?" << endl;
    cin >> name; // 僅讀取空白前的字串
    cout << name << " is " << age << " years old." << endl;
    return 0;
}
```

**情況**：
```
how old are you?
8
what is your name?
kiki lee
kiki is 8 years old. // 未讀取 "lee"
```

#### 3.2 `cin.getline()`
- 讀取整行字串，包括空白，適用於字元陣列（`char[]`）。
- 語法：
  ```cpp
  cin.getline(字元陣列, 接收字元數, 結束字元); // 可指定結束字元
  cin.getline(字元陣列, 接收字元數); // 預設結束字元為 '\n'
  ```

**範例：字元陣列輸入**：
```cpp
#include <iostream>
using namespace std;

int main() {
    int age;
    char name[20];
    cout << "how old are you?" << endl;
    cin >> age;
    cout << "what is your name?" << endl;
    cin.getline(name, 15); // 可能因緩衝區回車失敗
    cout << name << " is " << age << " years old." << endl;
    return 0;
}
```

**情況 1**：
```
how old are you?
8
what is your name?
 is 8 years old. // 未讀取名稱，因緩衝區回車
```

**情況 2**：
```
how old are you?
8 kiki lee
what is your name?
 kiki lee is 8 years old. // 讀取空白後內容
```

**問題**：`cin` 讀取年齡後，緩衝區殘留回車，導致 `cin.getline()` 直接終止。

#### 3.3 `getline()`
- 讀取整行字串，包括空白，適用於 `string` 型態。
- 語法：
  ```cpp
  getline(cin, 字串變數);
  ```

**範例：字串型態輸入**：
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int age;
    string name;
    cout << "how old are you?" << endl;
    cin >> age;
    cout << "what is your name?" << endl;
    getline(cin, name); // 可能因緩衝區回車失敗
    cout << name << " is " << age << " years old." << endl;
    return 0;
}
```

**情況 1**：
```
how old are you?
8
what is your name?
 is 8 years old. // 未讀取名稱
```

**情況 2**：
```
how old are you?
8 kiki lee
what is your name?
 kiki lee is 8 years old. // 讀取完整名稱
```

#### 3.4 解決緩衝區問題
在 `cin` 後使用 `cin.getline()` 或 `getline()` 時，需清除緩衝區的回車。

**解決方法**：
- 讀取並捨棄緩衝區內容：
  ```cpp
  cin.ignore(); // 捨棄一個字元（通常是回車）
  // 或
  cin.ignore(numeric_limits<streamsize>::max(), '\n'); // 捨棄直到回車
  ```

**範例：字串型態（清除緩衝區）**：
```cpp
#include <iostream>
#include <string>
#include <limits>
using namespace std;

int main() {
    int age;
    string name, str;
    cout << "how old are you?" << endl;
    cin >> age;
    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // 清除緩衝區
    cout << "what is your name?" << endl;
    getline(cin, name);
    cout << name << " is " << age << " years old." << endl;
    return 0;
}
```

**情況**：
```
how old are you?
8
what is your name?
kiki lee
kiki lee is 8 years old.
```

**範例：字元陣列型態（清除緩衝區）**：
```cpp
#include <iostream>
#include <limits>
using namespace std;

int main() {
    int age;
    char name[20], str[10];
    cout << "how old are you?" << endl;
    cin >> age;
    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // 清除緩衝區
    cout << "what is your name?" << endl;
    cin.getline(name, 15);
    cout << name << " is " << age << " years old." << endl;
    return 0;
}
```

**情況**：
```
how old are you?
8
what is your name?
kiki lee
kiki lee is 8 years old.
```

#### 3.5 `cin.get()`
- 用於讀取單一字元，可接收空白。
- 語法：
  ```cpp
  int ch = cin.get(); // 返回字元 ASCII 或 EOF
  cin.get(char &ch); // 將字元存入 ch
  ```

**範例：讀取字串**：
```cpp
#include <iostream>
using namespace std;

int main() {
    char ch;
    int count = 0;
    cin.get(ch);
    while (cin.fail() == false) {
        cout << ch;
        count++;
        cin.get(ch);
    }
    cout << "\nCount: " << count << endl;
    return 0;
}
```

**範例：捨棄不需要的字元**：
```cpp
#include <iostream>
using namespace std;

int main() {
    char a[20];
    cin.get(a, 20); // 讀取最多 19 個字元（保留 '\0'）
    cout << a << endl;
    return 0;
}
```

**`cin.get(ch)` vs `ch = cin.get()`**：

| 屬性 | `cin.get(ch)` | `ch = cin.get()` |
|------|---------------|------------------|
| 傳遞方式 | 賦值給參數 `ch` | 函數返回值賦給 `ch` |
| 字元輸入返回值 | `istream` 物件（布林轉換為 `true`） | `int`（字元 ASCII 碼） |
| EOF 返回值 | `istream` 物件（布林轉換為 `false`） | `EOF` |

### 4. 練習題解答

#### 練習 1：輸入日期與天氣（回車分隔）
**要求**：輸入日期（`20230101`）與天氣（`Sunny`），用回車分隔，輸出 `It is sunny day on 20230101.`。

**解答**：
```cpp
#include <iostream>
#include <string>
#include <limits>
using namespace std;

int main() {
    string date, weather;
    cout << "輸入日期與天氣（回車分隔）：" << endl;
    cin >> date;
    cin.ignore(numeric_limits<streamsize>::max(), '\n'); // 清除回車
    getline(cin, weather);
    cout << "It is " << weather << " day on " << date << "." << endl;
    return 0;
}
```

**輸入**：
```
20230101
Sunny
```

**輸出**：
```
It is Sunny day on 20230101.
```

#### 練習 2：輸入日期與天氣（逗號分隔）
**要求**：輸入 `20230101,Sunny`，用逗號分隔，輸出 `It is sunny day on 20230101.`。

**解答**：
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    char date[20], weather[20];
    cout << "輸入日期與天氣（逗號分隔）：" << endl;
    cin.getline(date, 20, ','); // 讀取逗號前內容
    cin.getline(weather, 20); // 讀取逗號後內容
    cout << "It is " << weather << " day on " << date << "." << endl;
    return 0;
}
```

**輸入**：
```
20230101,Sunny
```

**輸出**：
```
It is Sunny day on 20230101.
```

## 其他功能

### 1. 取得字串長度

#### `length()`
返回字串的字元數。
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string str = "Hello, world!";
    cout << "Length: " << str.length() << endl; // 輸出 13
    return 0;
}
```

#### `size()`
與 `length()` 功能相同。
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string str = "Hello, world!";
    cout << "Size: " << str.size() << endl; // 輸出 13
    return 0;
}
```

#### `sizeof()`
返回物件的記憶體大小（非字串長度）。
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string str = "Hello, world!";
    cout << "sizeof(str): " << sizeof(str) << endl; // 輸出 24（取決於實作）
    return 0;
}
```

### 2. 字串運算
- **串接**：使用 `+` 或 `+=` 合併字串。
- **比較**：使用 `==`、`!=`、`<`、`>` 等比較字串。
- **存取字元**：使用 `[index]` 或 `at(index)` 存取單字元。

**範例**：
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s1 = "Hello", s2 = "World";
    string s3 = s1 + " " + s2; // 串接
    cout << s3 << endl; // Hello World
    if (s1 < s2) {
        cout << s1 << " is less than " << s2 << endl;
    }
    cout << "First char: " << s1[0] << endl; // H
    return 0;
}
```

### 3. 字串處理
- **查找**：`find()`、`rfind()` 查找子字串。
- **取代**：`replace()` 替換部分字串。
- **子字串**：`substr()` 提取子字串。
- **大小寫轉換**：需自訂或使用庫函數（如 `<algorithm>` 的 `transform`）。

**範例**：
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "Hello, World!";
    size_t pos = s.find("World"); // 查找子串
    if (pos != string::npos) {
        cout << "Found at: " << pos << endl; // 7
    }
    s.replace(7, 5, "C++"); // 取代 World
    cout << s << endl; // Hello, C++!
    string sub = s.substr(0, 5); // 提取子串
    cout << sub << endl; // Hello
    return 0;
}
```

### 4. 去除空白符

#### `cin`
直接忽略前後空白，簡單易用。
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string str;
    while (cin >> str) {
        cout << str << endl;
    }
    return 0;
}
```

#### `istringstream`
將字串按空白分割，轉為單獨字串或數字。

**範例 1：分割字串**：
```cpp
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string str = "Hello C++ World";
    istringstream iss(str);
    string token;
    while (getline(iss, token, ' ')) {
        cout << token << endl;
    }
    return 0;
}
```

**範例 2：轉為數字**：
```cpp
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string str = "123 456 789";
    istringstream iss(str);
    int num;
    while (iss >> num) {
        cout << "整數：" << num << endl;
    }
    return 0;
}
```

#### `stringstream`
類似 `istringstream`，支援輸入與輸出。

**範例**：
```cpp
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main() {
    string str = "Hello C++ World";
    stringstream ss(str);
    string temp;
    while (ss >> temp) {
        cout << temp << endl;
    }
    return 0;
}
```

#### `strtok`
用於字元陣列，按指定分隔符分割。

**範例**：
```cpp
#include <iostream>
#include <cstring>
using namespace std;

int main() {
    string str = "Hello C++ World";
    char *s = new char[str.size() + 1];
    strcpy(s, str.c_str());
    char *token = strtok(s, " ");
    while (token) {
        cout << token << endl;
        token = strtok(NULL, " ");
    }
    delete[] s;
    return 0;
}
```

### 5. 連續輸入
使用 `getline()` 讀取多行輸入，需設置結束條件。

**範例**：
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string line;
    while (getline(cin, line)) {
        if (line.empty()) break; // 空行結束
        cout << "讀取行：" << line << endl;
    }
    return 0;
}
```

### 6. 字串轉數字
使用 `stoi()` 將字串轉為整數。

**範例**：
```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string str = "12345";
    int num = stoi(str);
    cout << "整數值：" << num << endl; // 12345
    return 0;
}
```

**其他轉換**：
- `stol`：轉為長整數。
- `stof`：轉為浮點數。
- `stod`：轉為雙精度浮點數。

## 延伸閱讀
- `istringstream` 詳細介紹：<https://blog.cckluo.com/post/112758074>