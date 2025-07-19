---
title: "Left & Right View of a Binary Tree"
description: "Given a Binary Tree, return its right & left views."
author: "Siva"
date: 2025-07-02
tags: ["Competitive Programming", "Tree"]
canonical_url: "https://bysiva.vercel.app/blog/cp-07"
---

# Left & Right View of a Binary Tree
## Problem Statement
Given a Binary Tree, return its right & left views.
- The right view of a binary tree is the set of nodes visible when the tree is viewed from the right side.
- The left view of a binary tree is the set of nodes visible when the tree is viewed from the left side.
- The right view includes the rightmost nodes at each level, while the left view includes the leftmost nodes at each level.

### Tree Structure
```go
type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}
```

### Example
```tree
        1
       / \
      2   3
     / \   \
    4   5   6
       / \
      7   8
      
- Left View: [1, 2, 4, 7]
- Right View: [1, 3, 6, 8]
```

## Approach (BFS)
- We can use a level-order traversal (BFS) to traverse the tree level by level.
- For each level, we will keep track of the first and last nodes encountered to determine the left and right views, respectively.
- To track the left and right views, we can use two lists: `leftView` and `rightView`.
- For each level:
  - Add the first node to `leftView`.
  - Add the last node to `rightView`.
- We update the leftView with leftMost node i.e first node when we entered a new level.
- We update the rightView with rightMost node i.e last node when we entered a new level. To do that,
    - First we made a new entry in the rightView list when we entered a new level with the first node of that level.
    - Then each time we encounter a node at that level, we update rightView[level] with the current node to ensure it contains the rightmost node at that level.

## Code 
```go
func completeBfs(root *TreeNode, level int, leftView, rightView *[]int) {
    if root == nil {
        return 
    }

    if level == len(*leftView) {
        // Add to left view if this is the first node at this level
        *leftView = append(*leftView, root.Val) 
    }

    if level == len(*rightView) {
        // Add to right view if this is the first node at this level
        *rightView = append(*rightView, root.Val) 
    } else {
        // Update the right view with the current node's value
        // This ensures that the rightmost node at each level is captured
        (*rightView)[level] = root.Val
    }

    // Traverse left and right children
    completeBfs(root.Left, level+1, leftView, rightView)
    completeBfs(root.Right, level+1, leftView, rightView)
}
```

## Complexity Analysis
- **Time Complexity**: O(n), where n is the number of nodes in the binary tree. We visit each node exactly once.
- **Space Complexity**: O(h), where h is the height of the tree. This is due to the recursive stack space used during the traversal.

## Example Usage
```go
func main() {
    root := &TreeNode{
        Val: 1,
        Left: &TreeNode{
            Val: 2,
            Left: &TreeNode{
                Val: 4,
                Right: &TreeNode{
                    Val: 5,
                    Right: &TreeNode{
                        Val: 6,
                    },
                },
            },
            Right: &TreeNode{
                Val: 10,
            },
        },
        Right: &TreeNode{
            Val: 3,
            Left: &TreeNode{
                Val: 9,
            },
            Right: &TreeNode{
                Val: 11,
            },
        },
    }   

    var leftView, rightView []int
    completeBfs(root, 0, &leftView, &rightView)

    fmt.Println("Left View:", leftView)   // Output: Left View: [1 2 4 5 6]
    fmt.Println("Right View:", rightView) // Output: Right View: [1 3 11 5 6]
}
```

