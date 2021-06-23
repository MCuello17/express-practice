# Express exercise (v1.3.2)
This is an express practice exercise.

To run the server simply write the following in your terminal:

    npm start

Now head into http://localhost:3000 from a browser. You will see a link to the users page.\
On the users page you should be able to simulate a user creation just by submitting on the form. This should refresh your browser and on your terminal you will have your input information!

**Example output:**
> `{ name: 'Michael Cuello' }`

## Versions:
* **(1.0.0)** Created the project.
* **(1.1.0)** Added [body parser](https://www.npmjs.com/package/body-parser) dependency.
* **(1.2.0)** Removed [body parser](https://www.npmjs.com/package/body-parser) dependency since it was deprecated ([docs](http://expressjs.com/en/5x/api.html#express.urlencoded)).
* **(1.3.0)** Added `(POST)/new-user` url for simulating user creation.
* **(1.3.1)** Added comment card for examples on [routing methods](https://expressjs.com/en/api.html#routing-methods).
* **(1.3.2)** Made the example middleware as a comment card.

## Dependencies:
* [Express](https://www.npmjs.com/package/express)
* [Nodemon](https://www.npmjs.com/package/nodemon)

## Debug dependencies:
* **(global)** [Nodemon](https://www.npmjs.com/package/nodemon)