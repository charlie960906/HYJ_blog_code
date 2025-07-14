---
title: C++ 排序方法介紹
date: 2025-07-08
summary: 本文介紹 C++ 中常用的排序方法，包括氣泡排序、選擇排序、插入排序、快速排序和合併排序。
tags: C++, 初學, Sorting, 排序
category: information
---
# C++ 排序（Sorting）

## 本章重點
1. 認識多種排序方法及其應用場景。
2. 理解穩定與不穩定排序的差異。
3. 比較內部排序與外部排序的適用情境。

## 簡介
排序是將資料按特定順序（例如由小到大或由大到小）排列的過程，有助於提高資料搜尋和處理效率。不同的排序方法在時間複雜度、穩定性及適用場景上各有優劣。

## 排序方法一覽表

| 排序方式 | 氣泡排序 | 選擇排序 | 插入排序 | 快速排序 | 合併排序 |
|----------|----------|----------|----------|----------|----------|
| **最壞時間** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(n \log n)$ |
| **平均時間** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(n \log n)$ | $O(n \log n)$ |
| **穩定度** | 穩定 | 不穩定 | 穩定 | 不穩定 | 穩定 |
| **備註** | 適合小規模資料 | 適合小規模資料 | 適合部分已排序資料 | 適合大規模資料 | 適用於外部排序 |

### 穩定與不穩定排序
- **穩定排序**：鍵值相同的元素在排序後保持相對順序不變。
  - 範例：
    - 排序前：`3, 5, 19, 1, 3+, 10`（兩個 `3`，第二個標為 `3+`）
    - 排序後：`1, 3, 3+, 5, 10, 19`（兩個 `3` 順序不變）
- **不穩定排序**：鍵值相同的元素在排序後相對順序可能改變。
  - 範例：
    - 排序前：`3, 5, 19, 1, 3+, 10`
    - 排序後：`1, 3+, 3, 5, 10, 19`（兩個 `3` 順序改變）

### 內部與外部排序
- **內部排序（Internal Sort）**：
  - 定義：所有資料在主記憶體（RAM）內完成排序。
  - 適用：小規模資料。
- **外部排序（External Sort）**：
  - 定義：資料量過大，需借助輔助記憶體（如硬碟）完成排序。
  - 適用：大規模資料。

---

## 1. 氣泡排序（Bubble Sort）

### 定義
氣泡排序通過逐次比較相鄰元素，若順序錯誤則交換，逐步將較大（或較小）元素「浮」到正確位置，類似氣泡上升。

### 特色
1. 回合數：資料個數減 1（$n-1$）。
2. 每回合至少將一個元素排到正確位置。
3. 穩定排序。
4. 適合小規模資料。

### 原理
- 比較相鄰元素，按排序條件交換。
- 每回合將最大（或最小）元素移到末端。
- **圖示**：氣泡排序過程（待補充圖示，展示元素交換）。

### 練習
```cpp
#include <iostream>
using namespace std;

void bubbleSort(int arr[], int size) {
    for (int i = size - 1; i >= 1; i--) {
        for (int j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    int arr[7] = {64, 34, 25, 12, 22, 11, 90};
    cout << "排序前：";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;

    bubbleSort(arr, 7);

    cout << "排序後：";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl; // 輸出：11 12 22 25 34 64 90
    return 0;
}
```

---

## 2. 選擇排序（Selection Sort）

### 定義
選擇排序從資料中選出最小（或最大）元素，與當前位置交換，逐回合確定一個元素的正確位置。

### 特色
1. 回合數：資料個數減 1（$n-1$）。
2. 每回合確定一個元素的位置。
3. 不穩定排序。
4. 適合小規模資料。

### 原理
- 每回合從未排序部分選出最小元素，與回合起始位置交換。
- **圖示**：選擇排序過程（待補充圖示，展示最小元素選擇與交換）。

### 練習
```cpp
#include <iostream>
using namespace std;

void selectionSort(int arr[], int size) {
    for (int i = 0; i < size - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < size; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        swap(arr[i], arr[minIndex]);
    }
}

int main() {
    int arr[7] = {64, 34, 25, 12, 22, 11, 90};
    cout << "排序前：";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;

    selectionSort(arr, 7);

    cout << "排序後：";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl; // 輸出：11 12 22 25 34 64 90
    return 0;
}
```

---

## 3. 插入排序（Insertion Sort）

### 定義
插入排序將未排序元素逐一插入已排序部分的適當位置，類似整理撲克牌。

### 特色
1. 回合數：資料個數減 1（$n-1$）。
2. 每回合將一個元素插入正確位置。
3. 穩定排序。
4. 適合部分已排序的資料。

### 原理
- 將未排序元素與已排序部分比較，插入適當位置。
- **圖示**：插入排序過程（來源：<https://www.geeksforgeeks.org/insertion-sort/>）。

### 練習
```cpp
#include <iostream>
using namespace std;

void insertionSort(int arr[], int size) {
    for (int i = 1; i < size; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int arr[5] = {12, 11, 13, 5, 6};
    cout << "排序前：";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;

    insertionSort(arr, 5);

    cout << "排序後：";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl; // 輸出：5 6 11 12 13
    return 0;
}
```

---

## 4. 快速排序（Quick Sort）

### 定義
快速排序通過選取一個基準值（pivot），將資料分為小於和大于基準值的兩部分，遞迴排序子集合。

### 特色
1. 回合數：最多資料個數減 1（$n-1$）。
2. 需要額外堆疊空間（遞迴）。
3. 不穩定排序。
4. 平均效率高，適合大規模資料。

### 原理
1. 選取基準值（pivot，通常取最後元素）。
2. 分割：將小於 pivot 的元素放左邊，大於 pivot 的放右邊。
3. 遞迴：對左右子集合重複步驟 1 和 2。
- **圖示**：快速排序過程（來源：<https://www.geeksforgeeks.org/quick-sort/>）。

**範例**（原始資料：`26, 5, 37, 1, 61, 11, 59, 15, 48, 19`）：
1. 選 `pivot = 19`，從左找大於 19 的 `Ki`，從右找小於 19 的 `Kj`，交換。
2. 重複直到 `i >= j`，將 `pivot` 與 `Kj` 交換。
3. 以分割點遞迴處理左右子集合。

### 練習
```cpp
#include <iostream>
using namespace std;

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int arr[6] = {10, 7, 8, 9, 1, 5};
    cout << "排序前：";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;

    quickSort(arr, 0, 5);

    cout << "排序後：";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl; // 輸出：1 5 7 8 9 10
    return 0;
}
```

---

## 5. 合併排序（Merge Sort）

### 定義
合併排序採用「分而治之」策略，將陣列分割至最小單位（長度為 1），再逐對合併並排序。

### 特色
1. 回合數：取決於分割層次，約 $\log n$ 層。
2. 需要額外記憶體空間（用於合併）。
3. 穩定排序。
4. 適合內部與外部排序，特別是大規模資料。

### 原理
1. 分割：將陣列分為長度為 1 的子陣列。
2. 合併：將子陣列成對合併，保持排序順序。
3. 重複合併直到形成完整排序陣列。
- **圖示**：合併排序過程（待補充圖示，展示分割與合併）。

**範例：偶數個資料**（`25, 57, 48, 37, 12, 92, 86, 33`）：
- 準備：`[25, 57][48, 37][12, 92][86, 33]`
- 第一回合：`[25, 57][37, 48][12, 92][33, 86]`
- 第二回合：`[25, 37, 48, 57][12, 33, 86, 92]`
- 第三回合：`[12, 25, 33, 37, 48, 57, 86, 92]`

**範例：奇數個資料**（`37, 57, 32, 23, 15`）：
- 準備：`[37, 57][32, 23][15]`
- 第一回合：`[37, 57][23, 32][15]`
- 第二回合：`[23, 32, 37, 57][15]`
- 第三回合：`[15, 23, 32, 37, 57]`

### 練習
```cpp
#include <iostream>
using namespace std;

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int leftArr[n1], rightArr[n2];

    for (int i = 0; i < n1; i++) leftArr[i] = arr[left + i];
    for (int i = 0; i < n2; i++) rightArr[i] = arr[mid + 1 + i];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (leftArr[i] <= rightArr[j]) {
            arr[k++] = leftArr[i++];
        } else {
            arr[k++] = rightArr[j++];
        }
    }
    while (i < n1) arr[k++] = leftArr[i++];
    while (j < n2) arr[k++] = rightArr[j++];
}

void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

int main() {
    int arr[6] = {12, 11, 13, 5, 6, 7};
    cout << "排序前：";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl;

    mergeSort(arr, 0, 5);

    cout << "排序後：";
    for (int num : arr) {
        cout << num << " ";
    }
    cout << endl; // 輸出：5 6 7 11 12 13
    return 0;
}
```
