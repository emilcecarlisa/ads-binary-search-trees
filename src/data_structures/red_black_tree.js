// Exported for the tests :(
export class RBTNode {
  static BLACK = 'black';
  static RED = 'red';
  static sentinel = Object.freeze({ color: RBTNode.BLACK });

  constructor(key, value,
    color = RBTNode.RED,
    parent = RBTNode.sentinel,
    left = RBTNode.sentinel,
    right = RBTNode.sentinel) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }

  insert(nodeToBeInserted) {
    // is nodeToBeInserted's key >, < , or == to mine?
    if(nodeToBeInserted.key > this.key) { // the node to be inserted should go to the right
      if(this.right !== RBTNode.sentinel) { // i have a right-side node, I cannot just add the node to the tree
        return this.right.insert(nodeToBeInserted)
      } else { // this node has no right
        nodeToBeInserted.parent = this;
        this.right = nodeToBeInserted;
        return nodeToBeInserted;
      }
    } else if (nodeToBeInserted.key < this.key) { // the node to be inserted should go to the left
      if(this.left  !== RBTNode.sentinel) { // i have a left-side node, I cannot just add the node to the tree
        return this.left.insert(nodeToBeInserted)
      } else { // this node has no left
        nodeToBeInserted.parent = this;
        this.left = nodeToBeInserted;
        return nodeToBeInserted;
      }
    } else { // the node to be inserted has the same key as me: should replace the value but not increase the count
      this.value = nodeToBeInserted.value;
      return undefined;
    }
  }

  uncle() {
    let parent = this.parent;
    if(parent === RBTNode.sentinel) { return undefined } // node's is the root, and has no uncle
    let grandparent = parent.parent;
    if(grandparent === RBTNode.sentinel) { return undefined } // node's parent is the root, therefore node has no uncle

    let directionOfUncle = (grandparent.key > parent.key) ? "right" : "left"
    return { uncle: grandparent[directionOfUncle], direction: directionOfUncle }
  }

  directionFromParent() {
    if(this.parent === RBTNode.sentinel) { return undefined } //root
    return (this.key < this.parent.key) ? "left" : "right";
  }

  search(key) {
    if(this.left !== RBTNode.sentinel && key < this.key) { this.left.search(key) }
    else if(this.right !== RBTNode.sentinel && key > this.key) { this.right.search(key) }
    else {
      return this.value
    }
    return undefined
  }

}

class RedBlackTree {
  constructor(Node = RBTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  lookup(key) {
    // let node = this._root;
    if(!this._root) { return undefined }
    return this._root.search(key)
    // while (node) {
    //   if (key < node.key) {
    //     node = node.left;
    //   } else if (key > node.key) {
    //     node = node.right;
    //   } else if (key === node.key) { // equal
    //     return true;
    //   }
    // }
  }

  /**
   * The two rotation functions are symetric, and could presumably
   * be collapsed into one that takes a direction 'left' or 'right',
   * calculates the opposite, and uses [] instead of . to access.
   * 
   * Felt too confusing to be worth it. Plus I bet* the JIT optimizes two
   * functions with static lookups better than one with dynamic lookups.
   * 
   * (*without any evidence whatsoever, 10 points to anyone who tries it out)
   */
  _rotateLeft(node) {
    const child = node.right;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's left subtree into node's right subtree
    node.right = child.left;
    if (child.left !== RBTNode.sentinel) {
      child.left.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.left) {
      node.parent.left = child;
    } else {
      node.parent.right = child;
    }

    // put node on child's left
    child.left = node;
    node.parent = child;

  }

  _rotateRight(node) {
    const child = node.left;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's right subtree into node's left subtree
    node.left = child.right;
    if (child.right !== RBTNode.sentinel) {
      child.right.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.right) {
      node.parent.right = child;
    } else {
      node.parent.left = child;
    }

    // put node on child's right
    child.right = node;
    node.parent = child;
  }

  _insertInternal(key, value) {
    let nodeToBeInserted = new RBTNode(
      key,
      value,
      RBTNode.RED,
      RBTNode.sentinel,
      RBTNode.sentinel,
      RBTNode.sentinel,
    ) // the node always starts as red
    let successfulInsert;
    if(!this._root) { // no root, just plunk it at the root as a black node
      this._root = nodeToBeInserted;
      this._root.color = RBTNode.BLACK;
      successfulInsert = this._root;
    } else { // this tree already has a root, so we ask the root to begin the insertion
      successfulInsert = this._root.insert(nodeToBeInserted); // RBTNode's insert should return a node if successful or undefined if not
    }
    if(successfulInsert) this._count++;
    return successfulInsert;
  }
  _insertRebalance(node) {
    
    // console.log(`Starting insertRebalance`);
    // console.log(`Looks like:`)
    // this.forEach((node) => {
    //   if(!node.key) { console.log(`This is the sentinel node`) } else {
    //     console.log(`What is node: ${JSON.stringify(node)}`)
    //     console.log(`Node: ${node.key} is currently ${node.color}`)  
    //   }
    // })

    let parent = node.parent;
    let uncleResponse = node.uncle();
    let grandparent = parent.parent;

    if(uncleResponse && uncleResponse.color === RBTNode.RED) {
      // If node has red uncle then we need to do RECOLORING.
      uncleResponse.uncle.color = RBTNode.BLACK;
      parent.color = RBTNode.BLACK;

      if (grandparent && grandparent.key === this._root.key) {
        // Recolor grand-parent to red if it is not root.
          grandparent.color = RBTNode.RED
          this._insertRebalance(grandparent)
      } else {
        // If grand-parent is black root don't do anything.
        // Since root already has two black sibling that we've just recolored.
        return;
      }
      // Now do further checking for recolored grand-parent.
      this._insertRebalance(grandparent);
    } else if(uncleResponse && uncleResponse.color === RBTNode.BLACK){ 
      if(node.directionFromParent() === "right" && parent.directionFromParent() === "right") { // SCENARIO 1
        const grandparentColor = grandparent.color;
        const parentColor = parent.color;
        grandparent.color = parentColor;
        parent.color = grandparentColor;
        this._rotateLeft(grandparent);
      } else if (node.directionFromParent() === "left" && parent.directionFromParent() === "right"){ // SCENARIO 2
        const grandparentColor = grandparent.color;
        const parentColor = parent.color;
        grandparent.color = parentColor;
        parent.color = grandparentColor;
        this._rotateRight(parent);
        this._rotateLeft(grandparent);
      } else if (node.directionFromParent() === "right" && parent.directionFromParent() === "left") {
        const grandparentColor = grandparent.color;
        const parentColor = parent.color;
        grandparent.color = parentColor;
        parent.color = grandparentColor;
        this._rotateLeft(parent);
        this._rotateRight(grandparent);
      } else if (node.directionFromParent() === "left" && parent.directionFromParent() === "left") {
        const grandparentColor = grandparent.color;
        const parentColor = parent.color;
        grandparent.color = parentColor;
        parent.color = grandparentColor;
        this._rotateRight(grandparent);
      }
      if (node.parent.parent && node.parent.parent.key) {
        this._insertRebalance(node.parent.parent); 
      } else {
        if(node.parent) {
          this._root = node.parent;
          node.parent.color = RBTNode.BLACK;

        }
      }
    } else {
      // I HAVE NO UNCLE - I am the root
      node.color = RBTNode.BLACK;
      return;
    }
    console.log(`Finished insertRebalance`);
    console.log(`Looks like:`)
  }

  insert(key, value=true) {
    const node = this._insertInternal(key, value);
    // this._insertRebalance(node);
  }

  delete(key) {

  }

  count() {
    return this._count;
  }

  forEach(callback) {
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


export default RedBlackTree;