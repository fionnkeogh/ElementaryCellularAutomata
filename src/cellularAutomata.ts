import { Cell } from "./cell";
import type { Rule } from "./Rule";

export class CellularAutomata<T=boolean> {
    private r: number;
    private K: number;
    private values: Array<T>;
    private initVal: Cell<T>;
    private colors: Array<string>;

    private cells: Array<Cell<T>>;
    private rules: Map<String, Rule<T>>;

    constructor(colors:Array<string> ,K:Array<T>, r=1, defaultIndex=0, size=8) {
        this.r = r;
        this.K = K.length;
        this.colors = colors;
        this.values = K;
        this.initVal = new Cell(this.values[defaultIndex], this.colors[defaultIndex], -1);

        this.cells = new Array<Cell<T>>(size);
        for(let i = 0; i < this.cells.length; i++) {
            this.cells[i] = new Cell(this.values[defaultIndex], this.colors[defaultIndex], i);
        }
        this.rules = new Map<String,Rule<T>>();
    }

    initRandom(): void {
        for(let i = 0; i < this.cells.length; i++) {
            let num = Math.round(Math.random()*(this.values.length-1));
            this.cells[i] = new Cell(this.values[num], this.colors[num], i);
        }
    }

    toggelCell(index: number) {
        let num = (this.values.indexOf(this.cells[index].getValue())+1)%this.K;
        this.cells[index] = new Cell(this.values[num], this.colors[num], index);
    }

    addCell() {
        this.cells = this.cells.concat(new Cell(this.initVal.getValue(), this.initVal.getColor(), this.cells.length));
    }

    setCells(size: number) {
        this.cells = new Array<Cell<T>>(size);
        for(let i = 0; i < this.cells.length; i++) {
            this.cells[i] = new Cell(this.initVal.getValue(), this.initVal.getColor(), i);
        }
    }

    removeCell():boolean {
        if(this.cells.length <= 1) {
            return false;
        }
        this.cells.pop();
        return true;
    }

    addRule(rule: Rule<T>): boolean {
        if (this.rules.has(rule.toString())) {
            return false;
        }
        this.rules = this.rules.set(rule.toString(), rule);
        return true;
    }

    removeRule(rule: string):boolean {
        if (this.rules.has(rule)) {
            this.rules.delete(rule);
            return true;
        }
        return false;
    }

    addRules(rules: Array<Rule<T>>): boolean {
        let _rules = new Map<String,Rule<T>>(this.rules);
        
        for(let i = 0; i < rules.length; i++) {
            let bool = this.addRule(rules[i]);
            if(bool == false) {
                this.rules = _rules;
                return false;
            }
        }
        return true;
    }

    getRules() {
        return this.rules;
    }

    getCells(): Array<Cell<T>> {
        return this.cells;
    }

    simulate(): Array<Cell<T>> {
        let next = new Array<Cell<T>>(...this.cells);
        for(let i = 0; i < this.cells.length; i++) {
            let left = i-this.r;
            let right = i+this.r;
            let neighborhood = new Array<Cell<T>>();
            if(left < 0) {
                let k = left+this.cells.length;
                neighborhood.push(...this.cells.slice(k));
                neighborhood.push(...this.cells.slice(0,right+1))
            } else {
                if(right >= this.cells.length) {
                    let k = right-this.cells.length;
                    neighborhood.push(...this.cells.slice(left));
                    neighborhood.push(...this.cells.slice(0,k+1));
                } else {
                    neighborhood.push(...this.cells.slice(left,right+1));
                }
            }
            
            let rule = this.rules.get(neighborhood.toString());
            let app = rule.apply(neighborhood);
            let color = this.colors[this.values.indexOf(app)];
            
            next[i] = this.rules.has(neighborhood.toString()) ? new Cell(app, color, next[i].getId()) : next[i];
        }

        this.cells = next;
        return next;
    }
}