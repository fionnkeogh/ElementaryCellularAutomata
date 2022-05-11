import type { Cell } from "./cell";

export class Rule<T> {
    private left: Array<T>;
    private right: T;

    constructor(rule_str: string) {
        rule_str = rule_str.replaceAll(" ", "");
        this.left = JSON.parse(rule_str.split("->")[0]);
        this.right = JSON.parse(rule_str.split("->")[1]);
    }

    apply(neighborhood: Array<Cell<T>>): T | undefined {
        let _n = new Array<T>();
        neighborhood.forEach(n => {
            _n.push(n.getValue());
        });
        
        if(arrayComp(this.left, _n)) {
            return this.right;
        }

        return undefined;
    }

    toString():string {
        return this.left.toString();
    }
}

function arrayComp<T>(a1: Array<T>, a2: Array<T>): boolean {
    if(a1.length != a2.length) {
        return false;
    }

    for(let i = 0; i < a1.length; i++) {
        if(a1[i] != a2[i]) {
            return false;
        }
    }

    return true;
}