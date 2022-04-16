# Storefront Backend Project


## Create Databases
 create the dev and test database.
 
- connect to the default postgres database as the server's root user `psql -U postgres`
- In psql run the following to create a user 
    - `CREATE USER your_user WITH PASSWORD 'your_password';`
- In psql run the following to create the dev and test database
    - `CREATE DATABASE newstore;`
    - `CREATE DATABASE newstore_test;`
- Connect to the databases and grant all privileges
    - Grant for dev database
        - `\c newstore`
        - `GRANT ALL PRIVILEGES ON DATABASE newstore TO your_user;`
    - Grant for test database
        - `\c newstore_test`
        - `GRANT ALL PRIVILEGES ON DATABASE newstore_test TO your_user;`

## Prepare env
- ADD a `.env` file in the root directory and set the missing `*****` environment parameters
```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=newstore
POSTGRES_TEST_DB=newstore_test
POSTGRES_USER=*****
POSTGRES_PASSWORD=*****
BCRYPT_PASSWORD=*****
SALT_ROUNDS=10
TOKEN_SECRET=*****
ENV=dev

```
        

## Set up

- `npm install` to install all dependencies
- `npm run db-migrate up` to set up the database 
- `npm run build` to build the app

## Start the app
- `npm run start` to start the app and get access via http://127.0.0.1:3000
-  User end points via 
 ```
    - To create user  via http://127.0.0.1:3000/auth/register [post method]
    - To login user via http://127.0.0.1:3000/auth/login [post method]
    - To create another user via  http://127.0.0.1:3000/users [token required] [post method]
    - To show user via  http://127.0.0.1:3000/users/:id  [token required] [get method]
    - To index users via  http://127.0.0.1:3000/users [token required][get method]
    - To delete user via  http://127.0.0.1:3000/users/:id  [token required] [delete method]

 ```
 -  Product end points via 
 ```
    
    - To create  product via  http://127.0.0.1:3000/prosucts [token required] [post method]
    - To show product via  http://127.0.0.1:3000/prosucts/:id  [get method]
    - To index product via  http://127.0.0.1:3000/prosucts     [get method]
    - To delete product via  http://127.0.0.1:3000/prosucts/:id  [token required] [delete method]

 ```
 -  Order end points via 
 ```
    
    - To create  order via  http://127.0.0.1:3000/orders [token required] [post method]
    - To show order via  http://127.0.0.1:3000/orders/:id [token required]  [get method]
    - To index orders via  http://127.0.0.1:3000/orders    [token required]  [get method]
    - To get all  orders for user  http://127.0.0.1:3000/orders/:id  [token required] [get method]
    - To delete order via  http://127.0.0.1:3000/orders/user_orders/:id  [token required] [delete method]

 ```


## Test the app
- ADD a `database.json` file in the root directory and set the missing `*****` parameters
```
{
    "dev": {
        "driver": "pg",
        "host": "127.0.0.1",
        "database": "newstore",
        "user": "*****",
        "password": "*****"
    },
    "test": {
        "driver": "pg",
        "host": "127.0.0.1",
        "database": "newstore_test",
        "user": "*****",
        "password": "*****"
    }
}

```

## Run the tests
- `npm run test` to run all tests

