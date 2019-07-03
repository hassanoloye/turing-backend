## Turing Backend API

### Description
This is a re-implementation project of the <a href="https://backendapi.turing.com/docs/">Turing Commerce API</a>.

### Tools/Technology used
- Node
- Express
- Stripe
- Sequelieze
- MySql

### API Documentation
The API documentation is available <a href="https://turingapi.herokuapp.com/docs/">here</a>.

### API Error codes
<table>
<thead>
  <tr>
  <th> Error Code </th>
  <th> Description</th>
  <th> Status Code </th>
  </tr>
  </thead>
  <tbody>
   <tr>
  <td>AUT_01</td>
  <td>Authorization code is empty</td>
  <td>401</td>
  </tr>
  <tr>
  <td>AUT_02</td>
  <td>Access Unauthorized. Invalid key provided</td>
  <td>401</td>
  </tr>
   <tr>
  <td>AUT_03</td>
  <td>Access token has expired</td>
  <td>401</td>
  </tr>
  <tr>
  <td>AUT_04</td>
  <td>Missing auth key. key should be provided in headers.USER-KEY </td>
  <td>401</td>
  </tr>
  <tr>
  <td>ATT_01</td>
  <td>Provided attribute_id is not a number</td>
  <td>400</td>
  </tr>
  <tr>
  <td>ATT_02</td>
  <td>Attribute with provided attribute_id does not exist</td>
  <td>404</td>
  </tr>
  <tr>
  <td>CAT_01</td>
  <td>Provided category_id is not a number</td>
  <td>400</td>
  </tr>
  <tr>
  <td>CAT_02</td>
  <td>Category with provided category_id does not exist</td>
  <td>404</td>
  </tr>
  <tr>
  <td>DEP_01</td>
  <td>Provided department_id is not a number</td>
  <td>400</td>
  </tr>
  <tr>
  <td>DEP_02</td>
  <td>Department with provided department_id does not exist</td>
  <td>404</td>
  </tr>
  <tr>
  <td>ORD_01</td>
  <td>Provided order_id is not a number</td>
  <td>400</td>
  </tr>
  <tr>
  <td>ORD_02</td>
  <td>Order with provided order_id does not exist</td>
  <td>404</td>
  </tr>
  <tr>
  <td>PRD_01</td>
  <td>Provided product_id is not a number</td>
  <td>400</td>
  </tr>
  <tr>
  <td>PRD_02</td>
  <td>Product with provided product_id does not exist</td>
  <td>404</td>
  </tr>
  <tr>
  <td>SHC_01</td>
  <td>Provided id is not a number</td>
  <td>400</td>
  </tr>
  <tr>
  <td>SHC_02</td>
  <td>Shopping cart with provided id does not exist</td>
  <td>404</td>
  </tr>
  <tr>
  <td>SHR_01</td>
  <td>Provided shipping_region_id is not a number</td>
  <td>400</td>
  </tr>
  <tr>
  <td>SHR_02</td>
  <td>Shipping region with provided shipping_region_id does not exist</td>
  <td>404</td>
  </tr>
  <tr>
  <td>TAX_01</td>
  <td>Provided tax_id is not a number</td>
  <td>400</td>
  </tr>
  <tr>
  <td>TAX_02</td>
  <td>TAX with provided tax_id does not exist</td>
  <td>404</td>
  </tr>
  <tr>
  <td>USR_01</td>
  <td>Email/password provided during user login is invalid.</td>
  <td>409</td>
  </tr>
  <tr>
  <td>USR_04</td>
  <td>Email provided for user registration already exists.</td>
  <td>409</td>
  </tr>
  <tr>
  <td>USR_05</td>
  <td>Email provided during user login does not exists.</td>
  <td>404</td>
  </tr>
    </tbody>
  </table>

### Running locally
1. Clone the repo by running`git clone https://github.com/hassanoloye/turing-backend.git/` and navigate to the project directory

2. Install dependencies with `npm install`

3. Set up the database
   - Create a mysql database using MySql Workbench or any other possible methods.

4. Populate environment variables
 	- Create a .env file in the project root with the following contents
	```
	DATABASE_URL=DATABASE_URL // url for created mysql database 
	JWT_SECRET=JWT_SECRET // secret value for jwt token
	JWT_EXPIRES=24h // duration for which token is active
	STRIPE_API_KEY=STRIPE_API_KEY  // stripe api key. gotten from stripe
	STRIPE_ENDPOINT_SECRET=STRIPE_ENDPOINT_SECRET // stripe endpoint secret. gotten from stripe
	```

5. From the project root directory, start the server
  	-  Run `npm start` or `npm run watch` and `npm run dev` in separate terminals to run in development mode

### Author
Hassan Oyeboade
