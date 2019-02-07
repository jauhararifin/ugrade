export class NoSuchProblem extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, NoSuchProblem.prototype);
    }
}