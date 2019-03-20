export class EmailError extends Error {
  constructor(m: string = 'Email Error') {
    super(m)
    Object.setPrototypeOf(this, EmailError.prototype)
  }
}
