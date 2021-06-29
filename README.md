# Express exercise (v8.3.0)
This is an express practice exercise.

To run the server simply write the following in your terminal:

    npm start

Now head into http://localhost:3000 from a browser. You will see an empty list of products. You should be able to **signup** from the navbar. Once you do, **log in** and you will se an option to **Create a new product** on the homepage of the app\
On the `new-product` page you should be able to **Create a product** just by submitting on the form. This should redirect you back to the product list page with your new product in it!\
You can also **Add products to your cart**, **order**, and **delete them**.

## Versions:
* **(1.0.0)** Created the project.
* **(1.1.0)** ~~Added [body parser](https://www.npmjs.com/package/body-parser) dependency~~. [**1.2.0**]
* **(1.2.0)** Removed [body parser](https://www.npmjs.com/package/body-parser) dependency since it was deprecated ([docs](http://expressjs.com/en/5x/api.html#express.urlencoded)).
* **(1.3.0)** Added `(POST)/new-user` url for simulating user creation.
* **(1.3.1)** Added comment card for examples on [routing methods](https://expressjs.com/en/api.html#routing-methods).
* **(1.3.2)** Made the example middleware as a comment card.
* **(2.0.0)** Changed project from a user database to a shop website.
* **(2.1.0)** Refactor routes.
* **(2.2.0)** Routes changes: Added filter to /admin routes and created 404 page for unlisted routes.
* **(2.2.1)** Comments updates.
* **(2.3.0)** Serving HTML files on pages instead of sending the HTML as a string.
* **(2.3.1)** Added styling and static files middleware.
* **(2.4.0)** Added temporary dynamic data storage.
* **(2.5.0)** Dynamic data and templating engine ([ejs](https://www.npmjs.com/package/ejs) - [docs](https://ejs.co/#docs)).
* **(2.6.0)** Added partials for layout elements.
* **(3.0.0)** Restructured the app in a MVC pattern.
* **(4.0.0)** Refactor of view files.
* **(4.1.0)** Added new product fields.
* **(4.2.0)** Added product details page.
* **(4.3.0)** Added cart model and functionality.
* **(4.3.1)** Added cart list and styling.
* **(4.3.2)** Added cart "delete" product functionality.
* **(5.0.0)** Added [mysql2](https://www.npmjs.com/package/mysql2) dependency for database functionality.
* **(5.1.0)** Added [sequelize](https://www.npmjs.com/package/sequelize) dependency ([docs](https://sequelize.org/master/)).
* **(5.2.0)** Retrieving products with Sequelize.
* **(5.2.1)** Added product editing functionality.
* **(5.2.2)** Product deletion.
* **(5.3.0)** Added User model and functionality.
* **(5.4.0)** Added cart model and functionality.
* **(5.5.0)** Added order model and functionality.
* **(6.0.0)** Added [express-session](https://www.npmjs.com/package/express-session) dependency.
* **(6.1.0)** Added [connect-session-sequelize](https://www.npmjs.com/package/connect-session-sequelize) dependency (for storing session on the db: [docs](https://github.com/expressjs/session)) and user cookie logic.
* **(7.0.0)** Authentication functionality (user signup and login).
* **(7.0.1)** Added [bcryptjs](https://www.npmjs.com/package/bcryptjs) dependency for password encription.
* **(7.1.0 )** Authentication middleware.
* **(7.2.0)** Added [csurf](https://www.npmjs.com/package/csurf) dependency for CSRF protection.
* **(7.2.1)** Implemented locals.
* **(7.2.2)** Fixed user creation.
* **(7.2.3)** Added [connect-flash](https://www.npmjs.com/package/connect-flash) dependency for storing flash messages in session.
* **(7.3.0)** Added [nodemailer](https://www.npmjs.com/package/nodemailer) dependency for email management ([docs](https://nodemailer.com/usage/)).
* **(7.3.1)** Setup mailtrap and mailing config.
* **(7.4.0)** Password resetting.
* **(7.4.1)** Authorization updates.
* **(8.0.0)** Added [express-validator](https://www.npmjs.com/package/express-validator) dependency for user input validation ([docs](https://express-validator.github.io/docs/)).
* **(8.0.1)** Improved user experience with validation.
* **(8.1.0)** Improved error handling.
* **(8.2.0)** Added [multer](https://www.npmjs.com/package/multer) dependency for file uploading.
* **(8.3.0)** Added invoice download on checkout.

## Dependencies:
* [Express](https://www.npmjs.com/package/express)
* [mysql2](https://www.npmjs.com/package/mysql2)
* [sequelize](https://www.npmjs.com/package/sequelize) 
* [express-session](https://www.npmjs.com/package/express-session)
* [connect-session-sequelize](https://www.npmjs.com/package/connect-session-sequelize)
* [ejs](https://www.npmjs.com/package/ejs)
* [bcryptjs](https://www.npmjs.com/package/bcryptjs)
* [csurf](https://www.npmjs.com/package/csurf)
* [connect-flash](https://www.npmjs.com/package/connect-flash)
* [nodemailer](https://www.npmjs.com/package/nodemailer)
* [express-validator](https://www.npmjs.com/package/express-validator)
* [multer](https://www.npmjs.com/package/multer)
## Dev Dependencies:
* [Nodemon](https://www.npmjs.com/package/nodemon)

## Debug dependencies:
* **(global)** [Nodemon](https://www.npmjs.com/package/nodemon)

## Database setup:
On `/utils/database.js` you can find all the database configuration. By default I'm using a MySQL Schema called "**express-practice**".
