
class BSTNode {
  constructor({ key, value, parent, left, right }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }

  // insert
  insert(nodeToBeInserted) {
    // is nodeToBeInserted's value >, < , or == to mine?
    if(nodeToBeInserted.key > this.key) { // the node to be inserted should go to the right
      if(this.right) { // i have a right-side node, I cannot just add the node to the tree
        return this.right.insert(nodeToBeInserted)
      } else { // this node has no right
        nodeToBeInserted.parent = this;
        this.right = nodeToBeInserted;
        return true;
      }
    } else if (nodeToBeInserted.key < this.key) { // the node to be inserted should go to the left
      if(this.left) { // i have a left-side node, I cannot just add the node to the tree
        return this.left.insert(nodeToBeInserted)
      } else { // this node has no left
        nodeToBeInserted.parent = this;
        this.left = nodeToBeInserted;
        return true;
      }
    } else { // the node to be inserted has the same value as me: should replace the value but not increase the count
      this.value = nodeToBeInserted.value;
      return false
    }
  }

  deleteByKey(keyToDelete) {
    // is nodeToFind's value >, < , or == to mine?
    if(keyToDelete > this.key) { // the node to be deleted should be to the right
      if(this.right) { // i have a right-side node, but i am not the node to be deleted
        return this.right.deleteByKey(keyToDelete)
      } else { // this node has no right but the node i am looking for is less than me - the node is not in the tree
        return undefined;
      }
    } else if (keyToDelete < this.key) { // the node to be deleteed should be to the left
      if(this.left) { // i have a left-side node, I cannot just add the node to the tree
        return this.left.deleteByKey(keyToDelete)
      } else { // this node has no left but the node i am looking for is less than me - the node is not in the tree
        return undefined;
      }
    } else { // not on right or left this has to be the node
      if(!this.left && !this.right) { // scenario 1: this is a leaf (no children); parent's child to be deleted has to be set to undefined
        if(this.parent) {
          let correctSide = ''
          if(this.parent.right && this.parent.right.key == this.key) { correctSide = "right" }
          if(this.parent.left && this.parent.left.key == this.key) { correctSide = "left" }  
          this.parent[correctSide] = undefined;
        }
        return this.value;
      } else { //scenario 2: this is not a leaf
        // if there is a left child, that child becomes the parent's right
        const returnValue = this.value;
        if(this.right && this.left) { // 2a - i have 2 children
          let replacementNode = this.right.findSmallest();
          this.key = replacementNode.key;
          this.value = replacementNode.value;
          this.left = replacementNode.left;
          this.right = replacementNode.right;
          replacementNode.deleteByKey(replacementNode.key);
          return returnValue;
        } else if (this.left) { // 2b - i have a left child
          if(this.parent) {
            let correctSide = ''
            if(this.parent.right && this.parent.right.key == this.key) { correctSide = "right" }
            if(this.parent.left && this.parent.left.key == this.key) { correctSide = "left" }  
            this.parent[correctSide] = this.left;
            this.parent = undefined; // set parent of node being deleted to null so replacement can now point to it
            this.left.parent = this.parent;
          } else {
            let replacementNode = this.left;
            this.key = replacementNode.key;
            this.value = replacementNode.value;
            this.left = replacementNode.left;
            this.right = replacementNode.right;
            replacementNode.deleteByKey(replacementNode.key);
          }          
          return returnValue;
        } else { // 2c - i have a right child
          if(this.parent) {
            let correctSide = ''
            if(this.parent.right && this.parent.right.key == this.key) { correctSide = "right" }
            if(this.parent.left && this.parent.left.key == this.key) { correctSide = "left" }  
            this.parent[correctSide] = this.right;
            this.parent = undefined;
            this.right.parent = this.parent;
          } else {
            let replacementNode = this.right;
            this.key = replacementNode.key;
            this.value = replacementNode.value;
            this.right = replacementNode.right;
            this.right = replacementNode.right;
            replacementNode.deleteByKey(replacementNode.key);
          }          
          return returnValue;
        }
      }
    }    
  }

  findSmallest() {
    // if i have a left child, find smallest
    // else i am the smallest
    if(this.left) {
      return this.left.findSmallest()
    } else {
      return this
    }
  }

  findLargest() {
    // if i have a right child, find largest
    // else i am the largest
    if(this.right) {
      return this.right.findLargest()
    } else {
      return this
    }
  }

  searchFor(nodeToFind) {
    // is nodeToFind's value >, < , or == to mine?
    if(nodeToFind.key > this.key) { // the node to be inserted should be to the right
      if(this.right) { // i have a right-side node, I cannot just add the node to the tree
        return this.right.searchFor(nodeToFind)
      } else { // this node has no right but the node i am looking for is less than me - the node is not in the tree
        return false;
      }
    } else if (nodeToFind.key < this.key) { // the node to be searchFored should be to the left
      if(this.left) { // i have a left-side node, I cannot just add the node to the tree
        return this.left.searchFor(nodeToFind)
      } else { // this node has no left but the node i am looking for is less than me - the node is not in the tree
        return false;
      }
    } else { // the node to be inserted has the same value as me: should replace the value but not increase the count
      return this;
    }
  }
}

class BinarySearchTree {
  constructor(Node = BSTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  // ✕ increases count by 1 (4ms)
  // ✕ replaces records with the same key and does not increase the count (2ms)
  // ✕ uses true as the default value (3ms)
  insert(key, value = true) {
    const newNode = new BSTNode({key, value, parent: null, left: null, right: null})
    if (this._root === undefined) {
      this._root = newNode; 
      this._count++;
    } else {
      // let target = this.lookup(key); //return which target value
      const successfulInsert = this._root.insert(newNode);
      if(successfulInsert) {
        this._count++;
      }
    }
  }

  lookup(key) {
    let node = this._root;

    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else { // equal
        return node.value;
      }
    }
  }

  delete(key) {
    // empty tree
    if(!this._root) { return undefined }
    // tree of only 1 node
    if(this._count === 1) {
      const value = this._root.value;
      if(key === value) {
        this._root = undefined;
        this._count--;
        return value;  
      } else {
        return undefined
      }
    }
    // all other tree states - begin the recursive delete starting with the root (searches for key, may find it or not)
    let deleteSuccess = this._root.deleteByKey(key); // returns either undefined (the key is not in the tree) or the value of the deleted node
    if(deleteSuccess) { this._count--; } // the key was found and deleted, so we should decrement the count
    this.forEach((node) => {
      // console.log(`node: ${node.key}`)
    })
    return deleteSuccess; // return the value of the node with the deleted key
  }

  count() {
    return this._count;
  }

  forEach(callback) {
    // This is a little different from the version presented in the video.
    // The form is similar, but it invokes the callback with more arguments
    // to match the interface for Array.forEach:
    //   callback({ key, value }, i, this)
    const visitSubtree = (node, callback, i = 0) => {
      if (node) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    }
    visitSubtree(this._root, callback)
  }
}

export default BinarySearchTree;