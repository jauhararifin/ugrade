export class AuthenticationError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

export class ForbiddenActionError extends AuthenticationError {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ForbiddenActionError.prototype);
    }
}

export class UserRegistrationError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, UserRegistrationError.prototype);
    }
}