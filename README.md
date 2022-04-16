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
    - To create user using [post method]  via http://127.0.0.1:3000/auth/register 
    - To login user using [post method] via http://127.0.0.1:3000/auth/login 
    - To create another user  using [token required] [post method] via  http://127.0.0.1:3000/users 
    - To show user using [token required] [get method]  via http://127.0.0.1:3000/users/:id  
    - To index users using [token required][get method] via  http://127.0.0.1:3000/users 
    - To delete user  using [token required] [delete method] via  http://127.0.0.1:3000/users/:id 

 -  Product end points via 
    
    - To create  product  using [token required] [post method] via  http://127.0.0.1:3000/prosucts 
    - To show product  using [get method] via  http://127.0.0.1:3000/prosucts/:id  
    - To index product  using  [get method] via  http://127.0.0.1:3000/prosucts    
    - To delete product using [token required] [delete method] via  http://127.0.0.1:3000/prosucts/:id  

 -  Order end points via 
    
    - To create  order  using [token required] [post method] via  http://127.0.0.1:3000/orders 
    - To show order  using [token required]  [get method] via  http://127.0.0.1:3000/orders/:id 
    - To index orders  using [token required]  [get method] via  http://127.0.0.1:3000/orders    
    - To get all  orders for user using [token required] [get method] via  http://127.0.0.1:3000/orders/:id  
    - To delete order  using [token required] [delete method] via  http://127.0.0.1:3000/orders/user_orders/:id  



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

