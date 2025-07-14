---
title: C++ 鏈結串列基礎與應用
date: 2025-07-09
summary: 本文介紹 C++ 鏈結串列的概念，包括循序串列與鏈結串列的比較、動態記憶體配置、節點操作（建立、插入、刪除）、以及鏈結堆疊與佇列的實現。
tags: C++, 進階, Linked List, 鏈結串列
category: information
---

# C++ 鏈結串列（Linked List）

## 串列簡介

### 1. 循序串列（Sequential List）
- **定義**：資料儲存在連續的記憶體位置，屬於有序串列，例如陣列。
- **優點**：
  1. 搜尋方便，可隨機存取資料。
  2. 資料結構簡單，易於實現。
- **缺點**：
  1. 需預先宣告固定記憶體空間，彈性低。
  2. 插入或刪除資料需移動大量資料。
- **圖示**：循序串列記憶體結構（待補充圖示，展示連續記憶體分配）。

### 2. 鏈結串列（Linked List）
- **定義**：資料儲存在非連續記憶體，利用指標串接節點，最後節點指向 `NULL`，屬於無序串列。
- **優點**：
  1. 記憶體配置靈活，動態分配。
  2. 串列分裂與合併操作簡單。
- **缺點**：
  1. 搜尋元素耗時，需逐節點遍歷。
  2. 可靠度較低，若指標斷裂可能導致資料遺失。
- **圖示**：鏈結串列結構（待補充圖示，展示節點與指標關係）。

## 動態記憶體配置

### 1. 定義
- **動態記憶體配置**：在程式執行時向作業系統申請記憶體空間。
- **靜態記憶體配置**：在編譯時預先分配固定記憶體。
- **應用**：鏈結串列利用動態記憶體配置解決資料量未知的問題。

### 2. C 語言中的動態記憶體配置
- **配置**：
  ```cpp
  指標變數 = (資料型態*)malloc(sizeof(資料型態));
  ```
  **範例**：
  ```cpp
  int *pt = (int*)malloc(sizeof(int)); // 配置整數記憶體
  *pt = 10; // 賦值
  ```
- **釋放**：
  ```cpp
  free(指標變數);
  ```
  **範例**：
  ```cpp
  free(pt); // 釋放記憶體
  ```

### 3. C++ 中的動態記憶體配置
- **配置**：
  ```cpp
  資料型態 *指標名稱 = new 資料型態;
  ```
  **範例**：
  ```cpp
  int *pt = new int; // 配置整數記憶體
  *pt = 10; // 賦值
  ```
- **釋放**：
  ```cpp
  delete 指標名稱;
  ```
  **範例**：
  ```cpp
  delete pt; // 釋放記憶體
  pt = nullptr; // 避免野指標
  ```

### 4. 動態 vs 靜態資料結構
| **特性** | **靜態資料結構** | **動態資料結構** |
|----------|------------------|------------------|
| 記憶體使用 | 節省空間 | 需額外指標，較浪費空間 |
| 插入/刪除 | 需移動大量資料 | 只需修改指標 |
| 存取方式 | 可直接存取 | 需逐節點遍歷 |
| 搜尋方式 | 支援二分搜尋 | 不支援二分搜尋 |

## 鏈結串列基本概念

### 1. 節點結構
每個節點包含：
- `data`：儲存資料（例如整數、字元等）。
- `next`：指向下一個節點的指標，型態為節點結構的指標。

**範例**：
```cpp
struct Node {
    int data;
    Node* next; // 指向下一個節點
};
```

### 2. 首節點（Head/Front）
- **定義**：鏈結串列的起點，透過 `head` 可遍歷整個串列。
- **初始化**：
  ```cpp
  Node* head = new Node;
  head->next = nullptr; // 初始為空串列
  ```

### 3. 尾節點（Tail/Rear）
- **定義**：串列的最後節點，`next` 指向 `nullptr`，視情況可宣告 `rear` 標示。
- **初始化**：
  ```cpp
  Node* rear = new Node;
  rear->next = nullptr;
  ```
- **單節點情況**：
  ```cpp
  Node* head = new Node;
  head->next = nullptr;
  Node* rear = head; // 首尾相同
  ```

### 4. 建立新節點
```cpp
Node* node1 = new Node;
node1->data = 10;
node1->next = nullptr;
```

### 5. 加入新節點
將新節點插入串列，例如在 `nodeB` 與 `nodeC` 之間插入 `nodeE`：
```cpp
nodeB->next = nodeE;
nodeE->next = nodeC;
```

### 6. 刪除節點
刪除節點（如 `nodeC`），需將前一節點指向後一節點，並釋放記憶體：
```cpp
nodeB->next = nodeD;
delete nodeC;
```

**練習：刪除節點圖示**
- **題目**：建立含四個節點的鏈結串列（儲存字元 `A`、`B`、`C`、`D`），刪除節點 `C`。
- **解答**：
  - **初始結構**：`head -> A -> B -> C -> D -> nullptr`
  - **刪除 C**：`B->next = D; delete C;`
  - **結果結構**：`head -> A -> B -> D -> nullptr`
  - **圖示**（待補充圖示，展示節點 `C` 被移除前後的鏈結變化）。

**程式碼**：
```cpp
#include <iostream>
using namespace std;

struct Node {
    char data;
    Node* next;
};

int main() {
    // 建立串列 A -> B -> C -> D
    Node* head = new Node{'A', new Node{'B', new Node{'C', new Node{'D', nullptr}}}};
    
    // 列印原始串列
    Node* current = head;
    cout << "原始串列：";
    while (current) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;

    // 刪除節點 C
    Node* temp = head->next; // 指向 B
    Node* toDelete = temp->next; // 指向 C
    temp->next = toDelete->next; // B 指向 D
    delete toDelete; // 釋放 C

    // 列印結果
    current = head;
    cout << "刪除 C 後：";
    while (current) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;

    // 釋放串列
    while (head) {
        temp = head;
        head = head->next;
        delete temp;
    }
    return 0;
}
```

**輸出**：
```
原始串列：A B C D
刪除 C 後：A B D
```

## 鏈結串列進階處理

### 1. 建立鏈結串列
將陣列轉為鏈結串列，使用 `first`（首節點）、`current`（當前節點）、`previous`（前一節點）管理串列。

**範例**：
```cpp
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

Node* createList(int arr[], int len) {
    Node *first = nullptr, *current = nullptr, *previous = nullptr;
    for (int i = 0; i < len; i++) {
        current = new Node;
        current->data = arr[i];
        current->next = nullptr;
        if (i == 0) {
            first = current;
        } else {
            previous->next = current;
        }
        previous = current;
    }
    return first;
}

void printList(Node* first) {
    Node* current = first;
    while (current) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}

int main() {
    int arr[] = {1, 2, 3, 4};
    Node* list = createList(arr, 4);
    printList(list); // 輸出：1 2 3 4

    // 釋放串列
    while (list) {
        Node* temp = list;
        list = list->next;
        delete temp;
    }
    return 0;
}
```

### 2. 插入節點
在符合條件的節點間插入新節點（例如按升序插入）。

**範例**：
```cpp
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

Node* insert(Node* first, int target) {
    Node* newNode = new Node{target, nullptr};
    if (!first || first->data >= target) { // 插入到首節點或空串列
        newNode->next = first;
        return newNode;
    }

    Node *current = first->next, *previous = first;
    while (current && current->data < target) {
        previous = current;
        current = current->next;
    }
    newNode->next = current;
    previous->next = newNode;
    return first;
}

void printList(Node* first) {
    Node* current = first;
    while (current) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}

int main() {
    int arr[] = {1, 3, 5};
    Node* list = createList(arr, 3); // 使用前述 createList
    cout << "原始串列：";
    printList(list);

    list = insert(list, 4);
    cout << "插入 4 後：";
    printList(list); // 輸出：1 3 4 5

    // 釋放串列
    while (list) {
        Node* temp = list;
        list = list->next;
        delete temp;
    }
    return 0;
}
```

### 3. 刪除節點
刪除特定節點或整個串列。

**範例：刪除整個串列**：
```cpp
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

void freeList(Node* first) {
    Node* current = first;
    while (current) {
        Node* temp = current;
        current = current->next;
        delete temp;
    }
}

int main() {
    int arr[] = {1, 2, 3};
    Node* list = createList(arr, 3);
    cout << "原始串列：";
    printList(list);

    freeList(list);
    cout << "串列已釋放" << endl;
    return 0;
}
```

### 4. 列印所有節點
**範例**（見上方 `printList` 函數）。

## 鏈結堆疊（Stack Using Linked List）

### 1. 特色
- 使用鏈結實現堆疊，無容量限制（不像陣列堆疊）。
- 後進先出（LIFO），操作在頂端（`top`）進行。
- **圖示**：鏈結堆疊 push/pop（待補充圖示，展示頂端節點變化）。

### 2. 加入新節點（Push）
將新節點加入頂端，更新 `top`。

**範例**：
```cpp
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

void push(Node*& top, int data) {
    Node* newNode = new Node{data, top};
    top = newNode;
}

void printStack(Node* top) {
    Node* current = top;
    while (current) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}

int main() {
    Node* top = nullptr;
    push(top, 10);
    push(top, 20);
    push(top, 30);
    cout << "堆疊：";
    printStack(top); // 輸出：30 20 10

    // 釋放堆疊
    while (top) {
        Node* temp = top;
        top = top->next;
        delete temp;
    }
    return 0;
}
```

### 3. 刪除節點（Pop）
移除頂端節點，更新 `top`。

**範例**：
```cpp
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

void pop(Node*& top) {
    if (!top) return;
    Node* temp = top;
    top = top->next;
    delete temp;
}

void printStack(Node* top) {
    Node* current = top;
    while (current) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}

int main() {
    Node* top = nullptr;
    push(top, 10);
    push(top, 20);
    cout << "原始堆疊：";
    printStack(top); // 20 10

    pop(top);
    cout << "移除頂端後：";
    printStack(top); // 10

    // 釋放堆疊
    while (top) {
        Node* temp = top;
        top = top->next;
        delete temp;
    }
    return 0;
}
```

## 鏈結佇列（Queue Using Linked List）

### 1. 特色
- 使用鏈結實現佇列，無容量限制。
- 先進先出（FIFO），加入在尾端（`rear`），移除在頭端（`front`）。
- 需維護 `front` 和 `rear` 指標。
- **圖示**：鏈結佇列 enqueue/dequeue（待補充圖示，展示頭尾節點變化）。

### 2. 加入新節點（Enqueue）
將新節點加入尾端，更新 `rear`。

**範例**：
```cpp
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

void enqueue(Node*& front, Node*& rear, int data) {
    Node* newNode = new Node{data, nullptr};
    if (!front) {
        front = rear = newNode;
    } else {
        rear->next = newNode;
        rear = newNode;
    }
}

void printQueue(Node* front) {
    Node* current = front;
    while (current) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}

int main() {
    Node *front = nullptr, *rear = nullptr;
    enqueue(front, rear, 10);
    enqueue(front, rear, 20);
    enqueue(front, rear, 30);
    cout << "佇列：";
    printQueue(front); // 輸出：10 20 30

    // 釋放佇列
    while (front) {
        Node* temp = front;
        front = front->next;
        delete temp;
    }
    return 0;
}
```

### 3. 刪除節點（Dequeue）
移除頭端節點，更新 `front`。

**範例**：
```cpp
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

void dequeue(Node*& front, Node*& rear) {
    if (!front) return;
    Node* temp = front;
    front = front->next;
    if (!front) rear = nullptr; // 若佇列變空，更新 rear
    delete temp;
}

void printQueue(Node* front) {
    Node* current = front;
    while (current) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}

int main() {
    Node *front = nullptr, *rear = nullptr;
    enqueue(front, rear, 10);
    enqueue(front, rear, 20);
    cout << "原始佇列：";
    printQueue(front); // 10 20

    dequeue(front, rear);
    cout << "移除頭端後：";
    printQueue(front); // 20

    // 釋放佇列
    while (front) {
        Node* temp = front;
        front = front->next;
        delete temp;
    }
    return 0;
}
```
