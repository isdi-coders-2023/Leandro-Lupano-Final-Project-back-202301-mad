# 🎸**Guitar World** 🤘

## 💾 **Backend** 💽

### **Description:**

Backend of a guitar's e-commerce project developed with [Node.js](https://nodejs.org/es/) + [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/).

<div>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2560px-Node.js_logo.svg.png" title="NodeJS" alt="NodeJS" width="80" height="50"/>&nbsp;
  <img src="https://cdn.cdnlogo.com/logos/e/23/express.svg" title="Express" alt="Express" width="80" height="60"/>&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/2560px-MongoDB_Logo.svg.png" title="MongoDB" **alt="MongoDB" width="120" height="50"/>&nbsp;
</div>
<br>
<br>

### **Endpoints:**

**'/users’:**

- **.post(’/users/register’)** → User register.
- **.post(’/users/login’)** → User login.
- **.get(’/users/’)** → Load all users. Only for Admin.
- **.patch(’/users/add/cart/:id-guitar’)** → Add guitars to shopping cart. Need to be logged in.
- **.patch(’/users/remove/cart/:id-guitar’)** → Remove guitars to shopping cart. Need to be logged in.
- **.patch(’/users/edit/:id-user’)** → Edit a user. Only for Admin.
- **.delete(’/users/delete/:id-user’)** → Delete a user. Only for Admin.

**‘/guitars’:**

- **.get(’/guitars/:page’)** → Load all guitars. Need to be logged in.
- **.get(’/guitars/:style-guitar’)** → Guitar's filter by style. Need to be logged in.
- **.get(’/guitars/details/:id-guitar’)** → Load guitar's details. Need to be logged in.
- **.post(’/guitars/create’)** → Create a new guitar. Only for Admin.
- **.patch(’/guitars/edit/:id-guitar’)** → Edit a guitar. Only for Admin
- **.delete(’/guitars/delete/:id-guitar’)** → Delete a guitar. Only for Admin
  <br>
  <br>

### **Data model:**

- **User:**

  - id: `string`
  - userName: `string`
  - email: `string`
  - password: `string`
  - role: `string`
  - myGuitars: `Guitar[ ]`
    <br>
    <br>

- **Guitar:**
  - id: `string`
  - brand: `string`
  - model: `string`
  - picture: `string`
  - style: `string`
  - material: `string`
  - price: `number`
  - description: `string`
    <br>
    <br>

### **How to use it:**

- Fork the project.
- Install dependencies: `npm i`.
- Follow the `sample.env` instructions in order to connect the server with your MongoDB account.
- Enjoy it.
  <br>
  🥳

<br>
<br>

![rockstar](https://t3.ftcdn.net/jpg/01/70/12/02/360_F_170120287_OqdsKQSUsa5ro0uCOMVEteoZkaMJQvue.webp)
