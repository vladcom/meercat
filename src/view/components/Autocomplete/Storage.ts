interface StackElement<T> {
  id: string;
  data: T;
}

export class Stack<T> {
  private readonly storageKey: string;

  private readonly limit: number;

  constructor(storageKey: string, limit: number) {
    this.storageKey = storageKey;
    this.limit = limit;
  }

  private getStackFromStorage(): StackElement<T>[] {
    const stackData = localStorage.getItem(this.storageKey);
    return stackData ? JSON.parse(stackData) : [];
  }

  private saveStackToStorage(stack: StackElement<T>[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(stack));
  }

  push(element: StackElement<T>): void {
    const stack = this.getStackFromStorage();

    const existingIndex = stack.findIndex((el) => el.id === element.id);

    if (existingIndex !== -1) {
      stack.splice(existingIndex, 1);
    }

    stack.push(element);

    if (stack.length > this.limit) {
      stack.shift();
    }

    this.saveStackToStorage(stack);
  }

  pop(): StackElement<T> | undefined {
    const stack = this.getStackFromStorage();
    const poppedElement = stack.pop();
    this.saveStackToStorage(stack);
    return poppedElement;
  }

  getStack(): T[] {
    return [...this.getStackFromStorage().map((val) => val.data)].reverse();
  }
}
