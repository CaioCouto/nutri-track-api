// User Related Errors
class UserSigninError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserSigninError";
  }
}

class UserAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserAlreadyExistsError";
  }
}

class UserWeakPasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserWeakPasswordError";
  }
}

class UserRequestLimitExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserRequestLimitExceededError";
  }
}

class UserNotAuthorized extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotAuthorized";
  }
}

// Fetching Data From DB Errors

class DataNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataNotFoundError";
  }
}

class DuplicatedDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicatedDataError";
  }
}

class DietFormattingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DietFormattingError";
  }
}


export {
  DataNotFoundError,
  DietFormattingError,
  DuplicatedDataError,
  UserSigninError,
  UserAlreadyExistsError,
  UserWeakPasswordError,
  UserRequestLimitExceededError,
  UserNotAuthorized,
};