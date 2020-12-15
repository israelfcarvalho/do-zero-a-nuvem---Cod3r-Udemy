import "jest";
import request from "supertest";

import { environment } from "../common/environment";
import { Server } from "../server";

const {
  server: { port },
} = environment;

const url = `http://localhost:${port}`;

let server: Server;

describe("users test", () => {
  beforeAll(() => {
    server = new Server();

    return server
      .bootstrap()
      .then(() => {
        console.log({ environment });
      })
      .catch(console.error);
  });

  describe("get /users", () => {
    it("should return an array of users", () => {
      return request(url)
        .get("/users")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.itens).toBeInstanceOf(Array);
        })
        .catch(fail);
    });
  });

  describe("post /users", () => {
    it("should save a user", () => {
      return request(url)
        .post("/users")
        .send({
          name: "teste usuario 1",
          email: "teste@teste2.com.br",
          password: "123456",
          cpf: "588.312.340-64",
        })
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body._id).toBeDefined();
          expect(response.body.name).toBe("teste usuario 1");
          expect(response.body.email).toBe("teste@teste2.com.br");
          expect(response.body.cpf).toBe("588.312.340-64");
          expect(response.body.password).toBeUndefined();
        })
        .catch(fail);
    });
  });
});
