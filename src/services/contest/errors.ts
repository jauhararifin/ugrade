export class NoSuchContest extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, NoSuchContest.prototype);
    }
}