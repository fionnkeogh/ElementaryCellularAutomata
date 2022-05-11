export class Cell<T>{
    private value: T;
    private color: string;
    private id: number;

    constructor(value: T, color: string, id: number) {
        this.value = value;
        this.color = color;
        this.id = id;
    }

    getId(): number {
        return this.id;
    }

    getValue(): T {
        return this.value;
    }

    setValue(): void {
        this.value = this.value;
    }

    getColor(): string {
        return this.color;
    }

    setColor(color: string): void {
        this.color = color;
    }

    toString(): String {
        return this.getValue().toString();
    }
}