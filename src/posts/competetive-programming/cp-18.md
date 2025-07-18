# Find the LCA in BST
## Problem Statement
Given the root node of a Binary Search Tree (BST) and node values of p & q. Find the lowest common ancestor (LCA) of the two nodes.

### Tree Node
```python
class Node:
	def __init__(self, key):
		self.key = key
		self.left = None 
		self.right = None 
```

### Example
```tree
        10
       /  \
      5    30
     / \   /
    1   8 20

p = 1 and q = 8 => LCA = 5
p = 1 and q = 20 => LCA = 10
```

## Approach (Iterative)
- To find the Lowest Common Ancestor (LCA) in a Binary Search Tree (BST), we leverage the key property of BSTs:
    - All nodes in the left subtree of a node are less than the node's key.
    - All nodes in the right subtree are greater than the node's key.
- Using this, we follow these steps:
    - If `root.key > p` and `root.key > q`:
        - Both target nodes lie in the left subtree of the current node. So, we search in the left subtree.
    - If `root.key < p` and `root.key < q`:
        - Both target nodes lie in the right subtree of the current node. So, we search in the right subtree.
    - If neither of the above conditions is true:
        - This means one node lies in the left subtree and the other in the right, or the current node matches one of the target nodes.
        - In this case, the current node is the Lowest Common Ancestor of `p` and `q`.

```python
def findLowestCommonAncestorsIterative(root, p, q):
    if root == None:
        return None 

    while root:
        if root.key > p and root.key > q:
            root = root.left 
        elif root.key < p and root.key < q:
            root = root.right 
        else:
            return root.key 
    
    return None
```

## Complexity Analysis
- **Time Complexity** - O(h)
- **Space Complexity** - O(1)