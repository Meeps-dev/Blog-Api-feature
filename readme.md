# Blog-Api-Features === h1

## Blog-Api-Features === h2

### Blog-Api-Features === h3

#### Blog-Api-Features === h4

##### Blog-Api-Features === h5

###### Blog-Api-Features === h6

# Lists

- lists 1
  - nested
- lists 2
- lists 3

# Links

[got youtube](www.youtube)

# synthax highlighting / code formatting

```javascript
const add = () => {};
```

```html
<div>
  <h1>Learn</h1>
</div>
```

```http
POST /api/users/register
```

# TABLE

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `auth`    | `string` | token       |

# Text formatting

`formatted`
**bold**

# internal linking

[go to the aunthetication](#Authentication)

## Authentication

Indeed, Jesus may even have been a Pharisee.

Indeed, Jesus may even have been a Pharisee.

Indeed, Jesus may even have been a Pharisee.

Indeed, Jesus may even have been a Pharisee.

Indeed, Jesus may even have been a Pharisee.

Indeed, Jesus may even have been a Pharisee.

Indeed, Jesus may even have been a Pharisee.

Indeed, Jesus may even have been a Pharisee.

Indeed, Jesus may even have been a Pharisee.

# Project Title

A brief description of what this project does and who it's for

## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.

## Authors

- [@octokatherine](https://www.github.com/octokatherine)

## Appendix

Any additional information goes here

## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

## Color Reference

| Color         | Hex                                                              |
| ------------- | ---------------------------------------------------------------- |
| Example Color | ![#0a192f](https://via.placeholder.com/10/0a192f?text=+) #0a192f |
| Example Color | ![#f8f8f8](https://via.placeholder.com/10/f8f8f8?text=+) #f8f8f8 |
| Example Color | ![#00b48a](https://via.placeholder.com/10/00b48a?text=+) #00b48a |
| Example Color | ![#00d1a0](https://via.placeholder.com/10/00b48a?text=+) #00d1a0 |

## Demo

Insert gif or link to demo

## Deployment

To deploy this project run

```bash
  npm run deploy
```

## Feedback

If you have any feedback, please reach out to us at fake@fake.com

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://katherineoelsner.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)

## Other Common Github Profile Sections

👩‍💻 I'm currently working on...

🧠 I'm currently learning...

👯‍♀️ I'm looking to collaborate on...

🤔 I'm looking for help with...

💬 Ask me about...

📫 How to reach me...

😄 Pronouns...

⚡️ Fun fact...

# Blog-Api-Features

## Tech Stack

**server:** Node, Express, MongoDB, Mongoose, JWT

# API FEATURES

- Authentication & Authorization
- Post CRUD operations
- Comment functionality
- System blocking user if inactive for 30days
- Admin can block a user
- A user can block different users
- A user who block another user cannot see his/her posts
- Last date a post was created
- Check if a user is active or not
- Check last date a user was active
- Changing user award base on number of posts created by the user
- A user can follow and unfollow another user
- Get following and followers count
- Get total profile viewers count
- Get posts created count
- Get blocked counts
- Get all users who views someone’s profile
- Admin can unblock a blocked user
- Update password
- Profile photo uploaded
- A user can close his/her account

# ENDPOINTS

- [API Authentication](#API-Authentication)

  - [Register a new API client](https://www.github.com/octokatherine)
  - [login](https://www.github.com/octokatherine)

- [Users](https://www.github.com/octokatherine)

  - [Get my profile](https://www.github.com/octokatherine)
  - [Get all users](https://www.github.com/octokatherine)
  - [View a user profile Count](https://www.github.com/octokatherine)

  # API Authentication

  Some endpoints may require authentication for exaple. To create/delete/update post. you need to register your API client and obtain an access token.

  The endpoints that require authentication except a bearer token sent inthe `Authorization header`.

**Example**:

`Authorization: Bearer YOUR TOKEN`

## Register a new API client

```http
POST /api/v1/users/register
```

The request body needs to be in JSON format.
