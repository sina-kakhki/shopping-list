# Shopping Lists

This is a simple single page CRUD (Create, Reade, Update, Delete) app for shopping list

### To get started

```bash
npm install
npm start
```

You can find the server running on [http://localhost:3000](http://localhost:3000).

### To deploy

```bash
npm run build
```
Runs Craco build - [What's Craco?](https://www.npmjs.com/package/@craco/craco)

You can drag and drop the content of the build folder into the S3 bucket (NoSQL database) on AWS.

## User Stories

- [x] Users can view their lists
- [x] Users can add new lists that will be saved in the database
- [x] Users can delete lists
- [x] Users can make changes to their lists
- [x] Users can add items to their lists


## Tech Stack

**Frontend:** React, TailwindCSS, AxiosJS

**Backend:** AWS Lambda, API Gateway, S3(AWS), DynamoDB(AWS)
