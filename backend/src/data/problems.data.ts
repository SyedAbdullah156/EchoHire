export interface CodingProblem {
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    problem_statement: string;
    initial_code: string;
    constraints: string[];
    examples: string[];
    test_cases: { input: string; expected: string }[];
}

export const PROBLEM_BANK: CodingProblem[] = [
    {
        title: "Two Sum",
        difficulty: "Easy",
        problem_statement: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        initial_code: "function twoSum(nums, target) {\n  // Your code here\n}",
        constraints: ["2 <= nums.length <= 104"],
        examples: ["nums = [2,7,11,15], target = 9 -> [0,1]"],
        test_cases: [
            { input: "[2, 7, 11, 15], 9", expected: "[0, 1]" },
            { input: "[3, 2, 4], 6", expected: "[1, 2]" }
        ]
    },
    {
        title: "Palindrome Number",
        difficulty: "Easy",
        problem_statement: "Return true if x is a palindrome integer.",
        initial_code: "function isPalindrome(x) {\n  // Your code here\n}",
        constraints: ["-231 <= x <= 231 - 1"],
        examples: ["121 -> true", "-121 -> false"],
        test_cases: [
            { input: "121", expected: "true" },
            { input: "-121", expected: "false" }
        ]
    },
    {
        title: "Reverse Integer",
        difficulty: "Medium",
        problem_statement: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range, return 0.",
        initial_code: "function reverse(x) {\n  // Your code here\n}",
        constraints: ["-231 <= x <= 231 - 1"],
        examples: ["123 -> 321", "-123 -> -321"],
        test_cases: [
            { input: "123", expected: "321" },
            { input: "-123", expected: "-321" },
            { input: "120", expected: "21" }
        ]
    },
    {
        title: "Roman to Integer",
        difficulty: "Easy",
        problem_statement: "Convert a roman numeral string to an integer.",
        initial_code: "function romanToInt(s) {\n  // Your code here\n}",
        constraints: ["1 <= s.length <= 15"],
        examples: ["'III' -> 3", "'LVIII' -> 58"],
        test_cases: [
            { input: "'III'", expected: "3" },
            { input: "'LVIII'", expected: "58" },
            { input: "'MCMXCIV'", expected: "1994" }
        ]
    },
    {
        title: "Longest Common Prefix",
        difficulty: "Easy",
        problem_statement: "Find the longest common prefix string amongst an array of strings.",
        initial_code: "function longestCommonPrefix(strs) {\n  // Your code here\n}",
        constraints: ["1 <= strs.length <= 200"],
        examples: ["['flower','flow','flight'] -> 'fl'"],
        test_cases: [
            { input: "['flower','flow','flight']", expected: "'fl'" },
            { input: "['dog','racecar','car']", expected: "''" }
        ]
    },
    {
        title: "Valid Parentheses",
        difficulty: "Easy",
        problem_statement: "Determine if the input string containing just '(', ')', '{', '}', '[' and ']' is valid.",
        initial_code: "function isValid(s) {\n  // Your code here\n}",
        constraints: ["1 <= s.length <= 104"],
        examples: ["'()' -> true", "'()[]{}' -> true"],
        test_cases: [
            { input: "'()'", expected: "true" },
            { input: "'()[]{}'", expected: "true" },
            { input: "'(]'", expected: "false" }
        ]
    },
    {
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        problem_statement: "Merge two sorted arrays into one sorted array.",
        initial_code: "function mergeArrays(arr1, arr2) {\n  // Your code here\n}",
        constraints: ["0 <= arr1.length, arr2.length <= 50"],
        examples: ["[1,2,4], [1,3,4] -> [1,1,2,3,4,4]"],
        test_cases: [
            { input: "[1,2,4], [1,3,4]", expected: "[1, 1, 2, 3, 4, 4]" },
            { input: "[], []", expected: "[]" }
        ]
    },
    {
        title: "Remove Duplicates from Sorted Array",
        difficulty: "Easy",
        problem_statement: "Remove duplicates in-place from a sorted array and return the new length.",
        initial_code: "function removeDuplicates(nums) {\n  // Your code here\n}",
        constraints: ["1 <= nums.length <= 3 * 104"],
        examples: ["[1,1,2] -> 2"],
        test_cases: [
            { input: "[1,1,2]", expected: "2" },
            { input: "[0,0,1,1,1,2,2,3,3,4]", expected: "5" }
        ]
    },
    {
        title: "Implement strStr()",
        difficulty: "Easy",
        problem_statement: "Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.",
        initial_code: "function strStr(haystack, needle) {\n  // Your code here\n}",
        constraints: ["0 <= haystack.length, needle.length <= 5 * 104"],
        examples: ["'hello', 'll' -> 2"],
        test_cases: [
            { input: "'hello', 'll'", expected: "2" },
            { input: "'aaaaa', 'bba'", expected: "-1" }
        ]
    },
    {
        title: "Search Insert Position",
        difficulty: "Easy",
        problem_statement: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
        initial_code: "function searchInsert(nums, target) {\n  // Your code here\n}",
        constraints: ["1 <= nums.length <= 104"],
        examples: ["[1,3,5,6], 5 -> 2"],
        test_cases: [
            { input: "[1,3,5,6], 5", expected: "2" },
            { input: "[1,3,5,6], 2", expected: "1" }
        ]
    },
    {
        title: "Length of Last Word",
        difficulty: "Easy",
        problem_statement: "Given a string s consisting of words and spaces, return the length of the last word in the string.",
        initial_code: "function lengthOfLastWord(s) {\n  // Your code here\n}",
        constraints: ["1 <= s.length <= 104"],
        examples: ["'Hello World' -> 5"],
        test_cases: [
            { input: "'Hello World'", expected: "5" },
            { input: "'   fly me   to   the moon  '", expected: "4" }
        ]
    },
    {
        title: "Plus One",
        difficulty: "Easy",
        problem_statement: "Given a non-empty array of decimal digits representing a non-negative integer, increment the integer by one.",
        initial_code: "function plusOne(digits) {\n  // Your code here\n}",
        constraints: ["1 <= digits.length <= 100"],
        examples: ["[1,2,3] -> [1,2,4]"],
        test_cases: [
            { input: "[1,2,3]", expected: "[1, 2, 4]" },
            { input: "[9,9,9]", expected: "[1, 0, 0, 0]" }
        ]
    },
    {
        title: "Add Binary",
        difficulty: "Easy",
        problem_statement: "Given two binary strings a and b, return their sum as a binary string.",
        initial_code: "function addBinary(a, b) {\n  // Your code here\n}",
        constraints: ["1 <= a.length, b.length <= 104"],
        examples: ["'11', '1' -> '100'"],
        test_cases: [
            { input: "'11', '1'", expected: "'100'" },
            { input: "'1010', '1011'", expected: "'10101'" }
        ]
    },
    {
        title: "Sqrt(x)",
        difficulty: "Easy",
        problem_statement: "Given a non-negative integer x, compute and return the square root of x rounded down to the nearest integer.",
        initial_code: "function mySqrt(x) {\n  // Your code here\n}",
        constraints: ["0 <= x <= 231 - 1"],
        examples: ["4 -> 2", "8 -> 2"],
        test_cases: [
            { input: "4", expected: "2" },
            { input: "8", expected: "2" },
            { input: "1", expected: "1" }
        ]
    },
    {
        title: "Climbing Stairs",
        difficulty: "Easy",
        problem_statement: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        initial_code: "function climbStairs(n) {\n  // Your code here\n}",
        constraints: ["1 <= n <= 45"],
        examples: ["2 -> 2", "3 -> 3"],
        test_cases: [
            { input: "2", expected: "2" },
            { input: "3", expected: "3" },
            { input: "5", expected: "8" }
        ]
    },
    {
        title: "Single Number",
        difficulty: "Easy",
        problem_statement: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
        initial_code: "function singleNumber(nums) {\n  // Your code here\n}",
        constraints: ["1 <= nums.length <= 3 * 104"],
        examples: ["[2,2,1] -> 1"],
        test_cases: [
            { input: "[2,2,1]", expected: "1" },
            { input: "[4,1,2,1,2]", expected: "4" }
        ]
    },
    {
        title: "Majority Element",
        difficulty: "Easy",
        problem_statement: "Given an array nums of size n, return the majority element (appears more than n/2 times).",
        initial_code: "function majorityElement(nums) {\n  // Your code here\n}",
        constraints: ["n == nums.length", "1 <= n <= 5 * 104"],
        examples: ["[3,2,3] -> 3"],
        test_cases: [
            { input: "[3,2,3]", expected: "3" },
            { input: "[2,2,1,1,1,2,2]", expected: "2" }
        ]
    },
    {
        title: "Contains Duplicate",
        difficulty: "Easy",
        problem_statement: "Return true if any value appears at least twice in the array, and return false if every element is distinct.",
        initial_code: "function containsDuplicate(nums) {\n  // Your code here\n}",
        constraints: ["1 <= nums.length <= 105"],
        examples: ["[1,2,3,1] -> true"],
        test_cases: [
            { input: "[1,2,3,1]", expected: "true" },
            { input: "[1,2,3,4]", expected: "false" }
        ]
    },
    {
        title: "Valid Anagram",
        difficulty: "Easy",
        problem_statement: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
        initial_code: "function isAnagram(s, t) {\n  // Your code here\n}",
        constraints: ["1 <= s.length, t.length <= 5 * 104"],
        examples: ["'anagram', 'nagaram' -> true"],
        test_cases: [
            { input: "'anagram', 'nagaram'", expected: "true" },
            { input: "'rat', 'car'", expected: "false" }
        ]
    },
    {
        title: "Missing Number",
        difficulty: "Easy",
        problem_statement: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
        initial_code: "function missingNumber(nums) {\n  // Your code here\n}",
        constraints: ["n == nums.length", "1 <= n <= 104"],
        examples: ["[3,0,1] -> 2"],
        test_cases: [
            { input: "[3,0,1]", expected: "2" },
            { input: "[0,1]", expected: "2" },
            { input: "[9,6,4,2,3,5,7,0,1]", expected: "8" }
        ]
    },
    {
        title: "Move Zeroes",
        difficulty: "Easy",
        problem_statement: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.",
        initial_code: "function moveZeroes(nums) {\n  // Your code here\n}",
        constraints: ["1 <= nums.length <= 104"],
        examples: ["[0,1,0,3,12] -> [1,3,12,0,0]"],
        test_cases: [
            { input: "[0,1,0,3,12]", expected: "[1, 3, 12, 0, 0]" },
            { input: "[0]", expected: "[0]" }
        ]
    },
    {
        title: "Reverse String",
        difficulty: "Easy",
        problem_statement: "Write a function that reverses a string. The input string is given as an array of characters.",
        initial_code: "function reverseString(s) {\n  // Your code here\n}",
        constraints: ["1 <= s.length <= 105"],
        examples: ["['h','e','l','l','o'] -> ['o','l','l','e','h']"],
        test_cases: [
            { input: "['h','e','l','l','o']", expected: "['o', 'l', 'l', 'e', 'h']" },
            { input: "['H','a','n','n','a','h']", expected: "['h', 'a', 'n', 'n', 'a', 'H']" }
        ]
    },
    {
        title: "Add Two Numbers",
        difficulty: "Medium",
        problem_statement: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
        initial_code: "function addTwoNumbers(l1, l2) {\n  // Your code here\n}",
        constraints: ["The number of nodes in each linked list is in the range [1, 100].", "0 <= Node.val <= 9"],
        examples: ["l1 = [2,4,3], l2 = [5,6,4] -> [7,0,8]"],
        test_cases: [
            { input: "[2,4,3], [5,6,4]", expected: "[7, 0, 8]" },
            { input: "[0], [0]", expected: "[0]" }
        ]
    },
    {
        title: "3Sum",
        difficulty: "Medium",
        problem_statement: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
        initial_code: "function threeSum(nums) {\n  // Your code here\n}",
        constraints: ["3 <= nums.length <= 3000", "-105 <= nums[i] <= 105"],
        examples: ["nums = [-1,0,1,2,-1,-4] -> [[-1,-1,2],[-1,0,1]]"],
        test_cases: [
            { input: "[-1,0,1,2,-1,-4]", expected: "[[-1, -1, 2], [-1, 0, 1]]" },
            { input: "[]", expected: "[]" }
        ]
    },
    {
        title: "First Missing Positive",
        difficulty: "Hard",
        problem_statement: "Given an unsorted integer array nums, return the smallest missing positive integer.",
        initial_code: "function firstMissingPositive(nums) {\n  // Your code here\n}",
        constraints: ["1 <= nums.length <= 5 * 105", "-231 <= nums[i] <= 231 - 1"],
        examples: ["nums = [1,2,0] -> 3", "nums = [3,4,-1,1] -> 2"],
        test_cases: [
            { input: "[1,2,0]", expected: "3" },
            { input: "[3,4,-1,1]", expected: "2" },
            { input: "[7,8,9,11,12]", expected: "1" }
        ]
    },
    {
        title: "Trapping Rain Water",
        difficulty: "Hard",
        problem_statement: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        initial_code: "function trap(height) {\n  // Your code here\n}",
        constraints: ["n == height.length", "1 <= n <= 2 * 104", "0 <= height[i] <= 105"],
        examples: ["height = [0,1,0,2,1,0,1,3,2,1,2,1] -> 6"],
        test_cases: [
            { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" },
            { input: "[4,2,0,3,2,5]", expected: "9" }
        ]
    }
];
