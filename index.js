import { faker } from "@faker-js/faker";
import express from "express";

const app = express();
const port = 3000;

// Next two function calls are just there so we can parse JSON from the request body.
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// This is the endpoint you'll call from the React form. Must be passed a username and password
// in the request body. Otherwise it has a 80/20 chance of returning a 200 response (simulating
// successful login) or a 401 response (simulating invalid credentials).
app.get("/login", (req, res) => {
  // Ensure request is valid (i.e. has username and password) otherwise returns 400 response.
  if (!req.body.username || !req.body.password) {
    res.status(400);
    res.send({ message: "Bad request" });
  }

  // Otherwise, send a 200 or 401 response
  const successful = Math.random() < 0.8;

  if (successful) {
    res.status(200);
    res.header("X-Auth-Token", faker.datatype.uuid().split("-").join(""));

    // Just for fun, send back some fake random user data. I can't remember whether the response
    // body shows up in the tool (I'm sure it does), otherwise you won't see this. Either way
    // the status codes **do** show up, and they are highlighted different colors, so the random
    // response codes will look more realistic.
    res.send({
      user: {
        id: faker.datatype.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
      },
    });
  } else {
    res.status(401);
    res.send({ message: "Invalid credentials" });
  }
});

app.listen(port, () => {
  console.log(`Auth server listening on port ${port}`);
});
