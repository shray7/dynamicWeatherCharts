export class Interval {
    start: number;
    end: number;
}

export class IntervalNode {
    i: Interval;
    max: number;
    left: IntervalNode;
    right: IntervalNode;
}

export class IntervalTree {

    insert(root: IntervalNode, i: Interval): IntervalNode {
        if (root == null) {
            let temp = new IntervalNode();
            temp.i = i;
            temp.max = i.end;
            temp.left = null;
            temp.right = null;
            return temp;
        }

        let low = root.i.start;

        if (i.start < low) {
            root.left = this.insert(root.left, i);
        }
        else {
            root.right = this.insert(root.right, i);
        }

        if (root.max < i.end) {
            root.max = i.end;
        }
        return root;

    }

    searchOverlap(root: IntervalNode, i: Interval): Interval {
        if (root == null) return null;

        if (this.doIntervalsOverlap(root.i, i)) {
            return root.i;
        }

        if (root.left != null && root.left.max >= i.start) {
            return this.searchOverlap(root.left, i);
        }

        return this.searchOverlap(root.right, i);

    }

    doIntervalsOverlap(n: Interval, m: Interval): boolean {
        if (n.start <= m.end && m.start <= n.end) {
            return true;
        }
        return false;
    }

}