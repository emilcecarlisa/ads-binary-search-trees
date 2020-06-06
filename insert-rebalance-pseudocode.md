# Insert-Rebalance Pseudocode

def insertRebalance(node)
  while (node is red and node.parent is red)
    // fix the problem for node and parent
    // possibly create a rule 4 violation above us
    // set node to the the bottom of those two nodes
    // then continue

    parent = node.parent
    grandparent = parent.parent

    // Check if parent is the left or right child of gp
    if (parent is left child)

      uncle = grandparent.right

      if (uncle is red)
        // swap colors between generations
        set uncle and parent to black
        set grandparent to red
        node = grandparent
        // continue, possibly done, will be done at root

      else // uncle is black
        if (node is right child of parent)
          // force node to be left child
          parent = node
          node = node.parent
          left-rotate node
        end

        // node is left child of parent
        set parent to black
        set grandparent to red
        right-rotate grandparent
        // done!

      end

    else // parent is right child
      // symmetric, not shown

    end
  end

  set the root's color to black