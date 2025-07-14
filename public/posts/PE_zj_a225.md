---
title: 題解ZJ - a225.明明愛排列
date: 2024-02-21
summary: a225.明明愛排列的完整程式碼
tags: c++, ZJ題解
category: information
---

# 題目[a225. 明明愛排列](https://zerojudge.tw/ShowProblem?problemid=a225) 
完整程式碼:
```cpp
#include<bits/stdc++.h>
using namespace std;

int arr[100000];
int ans[100000];
int a=0,b=0;


int main()
{
  while(cin>>a)
  {
    int num=0;
    for(int i=0;i<a;i++)
    {
      cin>>arr[i];
    }
    sort(arr,arr+a,greater<int>());
    for(int i=0;i<=9;i++)
    {
          for(int j=0;j<a;j++)
          {
            if(arr[j]%10==i)
            {
            ans[num]=arr[j];
            num+=1;
            }
          }
    }

    for(int i=0;i<a;i++)
    {
      cout<<ans[i]<<" ";
    }
    cout<<'\n';
  }
return 0;
}
```