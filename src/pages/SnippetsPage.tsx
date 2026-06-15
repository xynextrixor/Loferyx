import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { Editor } from '../components/Editor';
import { useTheme } from '../hooks/useTheme';

interface Snippet {
  id: string;
  title: string;
  category: string;
  code: Record<string, string>;
}

const SNIPPETS: Snippet[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    category: 'Basics',
    code: {
      python: `print("Hello, World!")`,
      javascript: `console.log("Hello, World!");`,
      java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
      cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
      csharp: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`
    }
  },
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'Sorting Algorithms',
    code: {
      python: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\narr = [64, 34, 25, 12, 22, 11, 90]\nbubble_sort(arr)\nprint("Sorted array is:", arr)`,
      javascript: `function bubbleSort(arr) {\n    let n = arr.length;\n    for (let i = 0; i < n - 1; i++) {\n        for (let j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                let temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n    return arr;\n}\n\nlet arr = [64, 34, 25, 12, 22, 11, 90];\nconsole.log("Sorted array is:", bubbleSort(arr));`,
      java: `import java.util.Arrays;\n\npublic class Main {\n    void bubbleSort(int arr[]) {\n        int n = arr.length;\n        for (int i = 0; i < n-1; i++)\n            for (int j = 0; j < n-i-1; j++)\n                if (arr[j] > arr[j+1]) {\n                    int temp = arr[j];\n                    arr[j] = arr[j+1];\n                    arr[j+1] = temp;\n                }\n    }\n\n    public static void main(String args[]) {\n        Main ob = new Main();\n        int arr[] = {64, 34, 25, 12, 22, 11, 90};\n        ob.bubbleSort(arr);\n        System.out.println("Sorted array: " + Arrays.toString(arr));\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - i - 1; j++)\n            if (arr[j] > arr[j + 1])\n                swap(arr[j], arr[j + 1]);\n}\n\nvoid printArray(int arr[], int size) {\n    for (int i = 0; i < size; i++)\n        cout << arr[i] << " ";\n    cout << endl;\n}\n\nint main() {\n    int arr[] = { 64, 34, 25, 12, 22, 11, 90 };\n    int N = sizeof(arr) / sizeof(arr[0]);\n    bubbleSort(arr, N);\n    cout << "Sorted array: \\n";\n    printArray(arr, N);\n    return 0;\n}`,
      csharp: `using System;\n\nclass Program {\n    static void bubbleSort(int[] arr) {\n        int n = arr.Length;\n        for (int i = 0; i < n - 1; i++)\n            for (int j = 0; j < n - i - 1; j++)\n                if (arr[j] > arr[j + 1]) {\n                    int temp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = temp;\n                }\n    }\n\n    static void Main() {\n        int[] arr = { 64, 34, 25, 12, 22, 11, 90 };\n        bubbleSort(arr);\n        Console.WriteLine("Sorted array:");\n        foreach (int val in arr) {\n            Console.Write(val + " ");\n        }\n    }\n}`
    }
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    category: 'Sorting Algorithms',
    code: {
      python: `def partition(arr, low, high):\n    i = (low-1)\n    pivot = arr[high]\n    for j in range(low, high):\n        if arr[j] <= pivot:\n            i = i+1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i+1], arr[high] = arr[high], arr[i+1]\n    return (i+1)\n\ndef quick_sort(arr, low, high):\n    if len(arr) == 1:\n        return arr\n    if low < high:\n        pi = partition(arr, low, high)\n        quick_sort(arr, low, pi-1)\n        quick_sort(arr, pi+1, high)\n\narr = [10, 7, 8, 9, 1, 5]\nquick_sort(arr, 0, len(arr)-1)\nprint("Sorted array:", arr)`,
      javascript: `function partition(arr, low, high) {\n    let pivot = arr[high];\n    let i = (low - 1);\n    for (let j = low; j <= high - 1; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            let temp = arr[i];\n            arr[i] = arr[j];\n            arr[j] = temp;\n        }\n    }\n    let temp = arr[i + 1];\n    arr[i + 1] = arr[high];\n    arr[high] = temp;\n    return (i + 1);\n}\n\nfunction quickSort(arr, low, high) {\n    if (low < high) {\n        let pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}\n\nlet arr = [10, 7, 8, 9, 1, 5];\nquickSort(arr, 0, arr.length - 1);\nconsole.log("Sorted array:", arr);`,
      java: `import java.util.Arrays;\n\nclass Main {\n    int partition(int arr[], int low, int high) {\n        int pivot = arr[high];\n        int i = (low-1);\n        for (int j=low; j<high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n        int temp = arr[i+1];\n        arr[i+1] = arr[high];\n        arr[high] = temp;\n        return i+1;\n    }\n\n    void sort(int arr[], int low, int high) {\n        if (low < high) {\n            int pi = partition(arr, low, high);\n            sort(arr, low, pi-1);\n            sort(arr, pi+1, high);\n        }\n    }\n\n    public static void main(String args[]) {\n        int arr[] = {10, 7, 8, 9, 1, 5};\n        int n = arr.length;\n        Main ob = new Main();\n        ob.sort(arr, 0, n-1);\n        System.out.println("Sorted array: " + Arrays.toString(arr));\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint partition(int arr[], int low, int high) {\n    int pivot = arr[high];\n    int i = (low - 1);\n    for (int j = low; j <= high - 1; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            swap(arr[i], arr[j]);\n        }\n    }\n    swap(arr[i + 1], arr[high]);\n    return (i + 1);\n}\n\nvoid quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}\n\nint main() {\n    int arr[] = {10, 7, 8, 9, 1, 5};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    quickSort(arr, 0, n - 1);\n    cout << "Sorted array: \\n";\n    for (int i = 0; i < n; i++) {\n        cout << arr[i] << " ";\n    }\n    return 0;\n}`,
      csharp: `using System;\n\nclass Program {\n    static int Partition(int[] arr, int low, int high) {\n        int pivot = arr[high];\n        int i = (low - 1);\n        for (int j = low; j < high; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n        int temp1 = arr[i + 1];\n        arr[i + 1] = arr[high];\n        arr[high] = temp1;\n        return i + 1;\n    }\n\n    static void QuickSort(int[] arr, int low, int high) {\n        if (low < high) {\n            int pi = Partition(arr, low, high);\n            QuickSort(arr, low, pi - 1);\n            QuickSort(arr, pi + 1, high);\n        }\n    }\n\n    static void Main() {\n        int[] arr = { 10, 7, 8, 9, 1, 5 };\n        int n = arr.Length;\n        QuickSort(arr, 0, n - 1);\n        Console.WriteLine("Sorted array:");\n        foreach (int val in arr) {\n            Console.Write(val + " ");\n        }\n    }\n}`
    }
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    category: 'Sorting Algorithms',
    code: {
      python: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i-1\n        while j >= 0 and key < arr[j] :\n                arr[j + 1] = arr[j]\n                j -= 1\n        arr[j + 1] = key\n\narr = [12, 11, 13, 5, 6]\ninsertion_sort(arr)\nprint("Sorted array is:", arr)`,
      javascript: `function insertionSort(arr) {\n    let n = arr.length;\n    for (let i = 1; i < n; i++) {\n        let key = arr[i];\n        let j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j = j - 1;\n        }\n        arr[j + 1] = key;\n    }\n    return arr;\n}\n\nlet arr = [12, 11, 13, 5, 6];\nconsole.log("Sorted array is:", insertionSort(arr));`,
      java: `import java.util.Arrays;\n\nclass Main {\n    void insertionSort(int arr[]) {\n        int n = arr.length;\n        for (int i = 1; i < n; ++i) {\n            int key = arr[i];\n            int j = i - 1;\n\n            while (j >= 0 && arr[j] > key) {\n                arr[j + 1] = arr[j];\n                j = j - 1;\n            }\n            arr[j + 1] = key;\n        }\n    }\n\n    public static void main(String args[]) {\n        int arr[] = { 12, 11, 13, 5, 6 };\n        Main ob = new Main();\n        ob.insertionSort(arr);\n        System.out.println("Sorted array: " + Arrays.toString(arr));\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nvoid insertionSort(int arr[], int n) {\n    int i, key, j;\n    for (i = 1; i < n; i++) {\n        key = arr[i];\n        j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j = j - 1;\n        }\n        arr[j + 1] = key;\n    }\n}\n\nint main() {\n    int arr[] = { 12, 11, 13, 5, 6 };\n    int n = sizeof(arr) / sizeof(arr[0]);\n    insertionSort(arr, n);\n    cout << "Sorted array: \\n";\n    for (int i = 0; i < n; i++)\n        cout << arr[i] << " ";\n    return 0;\n}`,
      csharp: `using System;\n\nclass Program {\n    static void insertionSort(int[] arr) {\n        int n = arr.Length;\n        for (int i = 1; i < n; ++i) {\n            int key = arr[i];\n            int j = i - 1;\n            while (j >= 0 && arr[j] > key) {\n                arr[j + 1] = arr[j];\n                j = j - 1;\n            }\n            arr[j + 1] = key;\n        }\n    }\n\n    static void Main() {\n        int[] arr = { 12, 11, 13, 5, 6 };\n        insertionSort(arr);\n        Console.WriteLine("Sorted array:");\n        foreach (int val in arr) {\n            Console.Write(val + " ");\n        }\n    }\n}`
    }
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'Sorting Algorithms',
    code: {
      python: `def merge_sort(arr):\n    if len(arr) > 1:\n        mid = len(arr)//2\n        L = arr[:mid]\n        R = arr[mid:]\n        merge_sort(L)\n        merge_sort(R)\n        i = j = k = 0\n        while i < len(L) and j < len(R):\n            if L[i] < R[j]:\n                arr[k] = L[i]\n                i += 1\n            else:\n                arr[k] = R[j]\n                j += 1\n            k += 1\n        while i < len(L):\n            arr[k] = L[i]\n            i += 1\n            k += 1\n        while j < len(R):\n            arr[k] = R[j]\n            j += 1\n            k += 1\n\narr = [12, 11, 13, 5, 6, 7]\nmerge_sort(arr)\nprint("Sorted array is:", arr)`,
      javascript: `function merge(left, right) {\n    let arr = []\n    while (left.length && right.length) {\n        if (left[0] < right[0]) arr.push(left.shift())  \n        else arr.push(right.shift()) \n    }\n    return [ ...arr, ...left, ...right ]\n}\n\nfunction mergeSort(array) {\n    const half = array.length / 2\n    if (array.length < 2) return array\n    const left = array.splice(0, half)\n    return merge(mergeSort(left),mergeSort(array))\n}\n\nlet arr = [12, 11, 13, 5, 6, 7];\nconsole.log("Sorted array is:", mergeSort(arr));`,
      java: `import java.util.Arrays;\n\nclass Main {\n    void merge(int arr[], int l, int m, int r) {\n        int n1 = m - l + 1;\n        int n2 = r - m;\n\n        int L[] = new int[n1];\n        int R[] = new int[n2];\n\n        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];\n        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];\n\n        int i = 0, j = 0;\n        int k = l;\n        while (i < n1 && j < n2) {\n            if (L[i] <= R[j]) {\n                arr[k] = L[i];\n                i++;\n            } else {\n                arr[k] = R[j];\n                j++;\n            }\n            k++;\n        }\n\n        while (i < n1) {\n            arr[k] = L[i];\n            i++;\n            k++;\n        }\n\n        while (j < n2) {\n            arr[k] = R[j];\n            j++;\n            k++;\n        }\n    }\n\n    void sort(int arr[], int l, int r) {\n        if (l < r) {\n            int m =l+ (r-l)/2;\n            sort(arr, l, m);\n            sort(arr, m + 1, r);\n            merge(arr, l, m, r);\n        }\n    }\n\n    public static void main(String args[]) {\n        int arr[] = {12, 11, 13, 5, 6, 7};\n        Main ob = new Main();\n        ob.sort(arr, 0, arr.length - 1);\n        System.out.println("Sorted array: " + Arrays.toString(arr));\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nvoid merge(int arr[], int l, int m, int r) {\n    int n1 = m - l + 1;\n    int n2 = r - m;\n    int L[n1], R[n2];\n    for (int i = 0; i < n1; i++) L[i] = arr[l + i];\n    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];\n    int i = 0, j = 0, k = l;\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) { arr[k] = L[i]; i++; }\n        else { arr[k] = R[j]; j++; }\n        k++;\n    }\n    while (i < n1) { arr[k] = L[i]; i++; k++; }\n    while (j < n2) { arr[k] = R[j]; j++; k++; }\n}\n\nvoid mergeSort(int arr[],int l,int r){\n    if(l>=r) return;\n    int m =l+ (r-l)/2;\n    mergeSort(arr,l,m);\n    mergeSort(arr,m+1,r);\n    merge(arr,l,m,r);\n}\n\nint main() {\n    int arr[] = { 12, 11, 13, 5, 6, 7 };\n    int arr_size = sizeof(arr) / sizeof(arr[0]);\n    mergeSort(arr, 0, arr_size - 1);\n    cout << "Sorted array: \\n";\n    for (int i = 0; i < arr_size; i++) cout << arr[i] << " ";\n    return 0;\n}`,
      csharp: `using System;\n\nclass Program {\n    static void Merge(int[] arr, int l, int m, int r) {\n        int n1 = m - l + 1;\n        int n2 = r - m;\n        int[] left = new int[n1];\n        int[] right = new int[n2];\n\n        for (int i = 0; i < n1; i++) left[i] = arr[l + i];\n        for (int j = 0; j < n2; j++) right[j] = arr[m + 1 + j];\n\n        int i_idx = 0; int j_idx = 0; int k = l;\n        while (i_idx < n1 && j_idx < n2) {\n            if (left[i_idx] <= right[j_idx]) {\n                arr[k] = left[i_idx];\n                i_idx++;\n            } else {\n                arr[k] = right[j_idx];\n                j_idx++;\n            }\n            k++;\n        }\n\n        while (i_idx < n1) {\n            arr[k] = left[i_idx];\n            i_idx++; k++;\n        }\n        while (j_idx < n2) {\n            arr[k] = right[j_idx];\n            j_idx++; k++;\n        }\n    }\n\n    static void MergeSort(int[] arr, int l, int r) {\n        if (l < r) {\n            int m = l + (r - l) / 2;\n            MergeSort(arr, l, m);\n            MergeSort(arr, m + 1, r);\n            Merge(arr, l, m, r);\n        }\n    }\n\n    static void Main() {\n        int[] arr = { 12, 11, 13, 5, 6, 7 };\n        MergeSort(arr, 0, arr.Length - 1);\n        Console.WriteLine("Sorted array:");\n        foreach (int val in arr) {\n            Console.Write(val + " ");\n        }\n    }\n}`
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Algorithms',
    code: {
      python: `def binary_search(arr, low, high, x):\n    if high >= low:\n        mid = (high + low) // 2\n        if arr[mid] == x:\n            return mid\n        elif arr[mid] > x:\n            return binary_search(arr, low, mid - 1, x)\n        else:\n            return binary_search(arr, mid + 1, high, x)\n    else:\n        return -1\n\narr = [ 2, 3, 4, 10, 40 ]\nx = 10\nresult = binary_search(arr, 0, len(arr)-1, x)\nif result != -1:\n    print("Element is present at index", str(result))\nelse:\n    print("Element is not present in array")`,
      javascript: `function binarySearch(arr, l, r, x) {\n    if (r >= l) {\n        let mid = l + Math.floor((r - l) / 2);\n        if (arr[mid] == x)\n            return mid;\n        if (arr[mid] > x)\n            return binarySearch(arr, l, mid - 1, x);\n        return binarySearch(arr, mid + 1, r, x);\n    }\n    return -1;\n}\n\nlet arr = [2, 3, 4, 10, 40];\nlet x = 10;\nlet result = binarySearch(arr, 0, arr.length - 1, x);\n(result == -1) ? console.log("Element is not present in array")\n               : console.log("Element is present at index " + result);`,
      java: `class Main {\n    int binarySearch(int arr[], int l, int r, int x) {\n        if (r >= l) {\n            int mid = l + (r - l) / 2;\n            if (arr[mid] == x)\n                return mid;\n            if (arr[mid] > x)\n                return binarySearch(arr, l, mid - 1, x);\n            return binarySearch(arr, mid + 1, r, x);\n        }\n        return -1;\n    }\n\n    public static void main(String args[]) {\n        Main ob = new Main();\n        int arr[] = { 2, 3, 4, 10, 40 };\n        int n = arr.length;\n        int x = 10;\n        int result = ob.binarySearch(arr, 0, n - 1, x);\n        if (result == -1)\n            System.out.println("Element not present");\n        else\n            System.out.println("Element found at index " + result);\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint binarySearch(int arr[], int l, int r, int x) {\n    if (r >= l) {\n        int mid = l + (r - l) / 2;\n        if (arr[mid] == x)\n            return mid;\n        if (arr[mid] > x)\n            return binarySearch(arr, l, mid - 1, x);\n        return binarySearch(arr, mid + 1, r, x);\n    }\n    return -1;\n}\n\nint main(void) {\n    int arr[] = { 2, 3, 4, 10, 40 };\n    int x = 10;\n    int n = sizeof(arr) / sizeof(arr[0]);\n    int result = binarySearch(arr, 0, n - 1, x);\n    (result == -1)\n        ? cout << "Element is not present in array"\n        : cout << "Element is present at index " << result;\n    return 0;\n}`,
      csharp: `using System;\n\nclass Program {\n    static int binarySearch(int[] arr, int l, int r, int x) {\n        if (r >= l) {\n            int mid = l + (r - l) / 2;\n            if (arr[mid] == x)\n                return mid;\n            if (arr[mid] > x)\n                return binarySearch(arr, l, mid - 1, x);\n            return binarySearch(arr, mid + 1, r, x);\n        }\n        return -1;\n    }\n\n    static void Main() {\n        int[] arr = { 2, 3, 4, 10, 40 };\n        int n = arr.Length;\n        int x = 10;\n        int result = binarySearch(arr, 0, n - 1, x);\n        if (result == -1)\n            Console.WriteLine("Element not present");\n        else\n            Console.WriteLine("Element found at index " + result);\n    }\n}`
    }
  }
];

export const SnippetsPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [loadingLanguage, setLoadingLanguage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLanguageClick = (langId: string) => {
    setLoadingLanguage(langId);
    setTimeout(() => {
      setSelectedLanguage(langId);
      setLoadingLanguage(null);
    }, 500);
  };

  const categories = Array.from(new Set(SNIPPETS.map(s => s.category)));

  const languages = [
    { id: 'python', label: 'Python' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'java', label: 'Java' },
    { id: 'cpp', label: 'C++' },
    { id: 'csharp', label: 'C#' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col font-body-md">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-headline-md text-lg font-bold">Code Snippets Collection</h1>
            <button onClick={toggleTheme} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white transition-colors ml-2" title="Toggle Theme">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
             {languages.map(lang => (
               <button
                 key={lang.id}
                 onClick={() => handleLanguageClick(lang.id)}
                 className={"px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center min-w-[80px] " + (selectedLanguage === lang.id ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-white')}
               >
                 {loadingLanguage === lang.id ? (
                   <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                 ) : (
                   lang.label
                 )}
               </button>
             ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <div className="space-y-12">
          {categories.map(category => (
            <div key={category} className="space-y-6">
              <h2 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-2">{category}</h2>
              <motion.div
                  key={selectedLanguage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                {SNIPPETS.filter(s => s.category === category).map(snippet => {
                  const code = snippet.code[selectedLanguage] || '// No snippet available for this language yet';
                  const isCopied = copiedId === snippet.id;

                  return (
                    <div key={snippet.id} className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex flex-col">
                      <div className="bg-zinc-50 dark:bg-zinc-950 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="font-medium">{snippet.title}</h3>
                        <button
                          onClick={() => handleCopy(code, snippet.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-white bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 px-2.5 py-1.5 rounded transition-all"
                        >
                          {isCopied ? (
                            <>
                              <Check size={14} className="text-green-500" />
                              <span className="text-green-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex-1 relative h-64">
                         <div className="absolute inset-0">
                           <Editor
                            language={selectedLanguage}
                            code={code}
                            onChange={() => {}}
                            disabled={true}
                           />
                         </div>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-950 px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                         <Link 
                           to={`/compiler?lang=${selectedLanguage}`} 
                           onClick={() => sessionStorage.setItem('temp_snippet_code', code)}
                           className="text-xs text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider font-bold"
                         >
                           Open in Compiler
                         </Link>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
