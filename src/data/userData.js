export class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

export const userData = [
  new User(1, 'John', 'john@test.com'),
  new User(2, 'Maya', 'maya@test.com'),
  new User(3, 'Bob', 'bob@test.com'),
];
