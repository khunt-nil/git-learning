class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

function dfs(node, visited = []) {
    if (node !== null) {
        visited.push(node.value); // Process the current node
        
        dfs(node.left, visited);  // Recursively visit the left subtree
        dfs(node.right, visited); // Recursively visit the right subtree
    }
    
    return visited;
}

// Example usage:

// Create a binary tree
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.left = new TreeNode(6);
root.right.right = new TreeNode(7);

// Perform DFS traversal
const result = dfs(root);
console.log(result); // Output: [1, 2, 4, 5, 3, 6, 7]

