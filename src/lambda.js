const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const listsTable = "shoppingLists";
const itemsTable = "shoppingListItems";

exports.handler = async function (event) {
  let response;

  switch (true) {
    //LOGIC FOR LISTS
    case event.httpMethod === "GET" && event.path === "/lists":
      response = await getLists();
      break;
    case event.httpMethod === "POST" && event.path === "/lists":
      response = await addList(JSON.parse(event.body));
      break;
    case event.httpMethod === "PATCH" && event.path === "/lists":
      const requestList = JSON.parse(event.body);
      response = await updateList(
        requestList.id,
        requestList.updateKey,
        requestList.updateValue
      );
      break;
    case event.httpMethod === "DELETE" && event.path === "/lists":
      response = await deleteList(JSON.parse(event.body).id);
      break;
    //LOGIC FOR ITEMS
    case event.httpMethod === "GET" && event.path === "/items":
      response = await getItems(event.queryStringParameters.listId);
      break;
    case event.httpMethod === "POST" && event.path === "/items":
      response = await addItem(JSON.parse(event.body));
      break;
    case event.httpMethod === "DELETE" && event.path === "/items":
      response = await deleteItem(JSON.parse(event.body).id);
      break;
    default:
      response = buildResponse(404, "404 Not Found");
  }
  return response;
};

async function scanRecords(scanParams, itemArray) {
  try {
    const dynamoData = await db.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch (error) {
    console.error("Something went wrong: ", error);
  }
}

//FUNCTIONS FOR LISTS
async function getLists() {
  const params = {
    TableName: listsTable,
  };
  const allLists = await scanRecords(params, []);
  const body = allLists;

  return buildResponse(200, body);
}

async function addList(requestBody) {
  const params = {
    TableName: listsTable,
    Item: requestBody,
  };
  return await db
    .put(params)
    .promise()
    .then(
      () => {
        const body = {
          Item: requestBody,
        };
        return buildResponse(200, body);
      },
      (error) => {
        console.error("Something went wrong: ", error);
      }
    );
}

async function updateList(id, updateKey, updateValue) {
  const params = {
    TableName: listsTable,
    Key: { id },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ":value": updateValue,
    },
    ReturnValues: "UPDATED_NEW",
  };
  return await db
    .update(params)
    .promise()
    .then(
      (response) => {
        const body = {
          UpdatedAttributes: response,
        };
        return buildResponse(200, body);
      },
      (error) => {
        console.error("Something went wrong: ", error);
      }
    );
}

async function deleteList(id) {
  const params = {
    TableName: listsTable,
    Key: { id },
    ReturnValues: "ALL_OLD",
  };
  return await db
    .delete(params)
    .promise()
    .then(
      (response) => {
        const body = {
          Item: response,
        };
        return buildResponse(200, body);
      },
      (error) => {
        console.error("Something went wrong: ", error);
      }
    );
}

//FUNCTIONS FOR ITEMS
async function getItems(listId) {
  const params = {
    TableName: itemsTable,
    FilterExpression: "#id = :listId",
    ExpressionAttributeNames: {
      "#id": "listId",
    },
    ExpressionAttributeValues: {
      ":listId": listId,
    },
  };
  const allLists = await scanRecords(params, []);
  const body = allLists;

  return buildResponse(200, body);
}

async function addItem(requestBody) {
  const params = {
    TableName: itemsTable,
    Item: requestBody,
  };
  return await db
    .put(params)
    .promise()
    .then(
      () => {
        const body = {
          Item: requestBody,
        };
        return buildResponse(200, body);
      },
      (error) => {
        console.error("Something went wrong: ", error);
      }
    );
}

async function deleteItem(id) {
  const params = {
    TableName: itemsTable,
    Key: { id },
    ReturnValues: "ALL_OLD",
  };
  return await db
    .delete(params)
    .promise()
    .then(
      (response) => {
        const body = {
          Item: response,
        };
        return buildResponse(200, body);
      },
      (error) => {
        console.error("Something went wrong: ", error);
      }
    );
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(body),
  };
}
