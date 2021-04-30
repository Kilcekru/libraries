export class BaseError extends Error {
	constructor(message) {
		super(message);
	}
	get name() {
		return this.constructor.name;
	}
	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}
	toJSON() {
		const json = {
			message: this.message,
			name: this.name,
		};
		for (const [key, value] of Object.entries(this)) {
			json[key] = value;
		}
		return json;
	}
}

export class ResponseError extends BaseError {
	constructor({ message, status }) {
		super(message);
		this.status = status;
	}
}

export class TimeoutError extends BaseError {
	constructor({ message, reason }) {
		super(message);
		this.reason = reason;
	}
}
