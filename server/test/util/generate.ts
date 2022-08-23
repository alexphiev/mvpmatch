import { faker } from "@faker-js/faker";
import { Role } from "../../src/models/user";

export function generateUserData(overide = {}) {
  return {
    id: faker.datatype.number(),
    username: faker.random.alphaNumeric(),
    password: faker.random.alphaNumeric(),
    products: [],
    deposit: faker.datatype.number(),
    role: faker.helpers.arrayElement<Role>(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overide,
  };
}

export function generateUsersData(n: number = 1, overide = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateUserData({ id: i, ...overide });
    }
  );
}

export function generateUserPayload() {
  return {
    username: faker.random.alphaNumeric(),
    password: faker.random.alphaNumeric(),
    role: faker.helpers.arrayElement<Role>(),
    deposit: 0,
  };
}
