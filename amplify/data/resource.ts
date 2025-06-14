import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Provider: a
    .model({
      name: a.string().required(),
      userId: a.string(),
      houses: a.hasMany('HouseLocation', 'ownerId')
    }).authorization(allow => [
      allow.group('ADMINS')
    ]),
  Consumer: a
    .model({
      name: a.string().required(),
      userId: a.string(),
      consumption: a.hasMany('Consumption', 'consumerId')
    }).authorization(allow => [
      allow.group('PROVIDERS'),
      allow.group('ADMINS')
    ]),
  HouseLocation: a
    .model({
      name: a.string().required(),
      userIds: a.string().array(),
      ownerId: a.id(),
      houseOwner: a.belongsTo('Provider', 'ownerId'),
      consumption: a.hasMany('Consumption', 'providerId')
    }).authorization(allow => [
      allow.owner(),
      allow.group('ADMINS')
    ]),
  Consumption: a
    .model({
      userIds: a.string().array(),
      availableCredits : a.integer().authorization(allow => [allow.ownerDefinedIn('providerUserId')]),
      consumedRed : a.integer().authorization(allow => [allow.ownerDefinedIn('consumerUserId')]),
      consumedGreen : a.integer().authorization(allow => [allow.ownerDefinedIn('consumerUserId')]),
      consumedBlue : a.integer().authorization(allow => [allow.ownerDefinedIn('consumerUserId')]),
      providerUserId: a.string(),
      consumerUserId: a.string(),
      providerId: a.id(),
      consumerId: a.id(),
      provider: a.belongsTo('HouseLocation', 'providerId'),
      consumer: a.belongsTo('Consumer', 'consumerId'),
    }).authorization(allow => [
      allow.ownerDefinedIn('providerUserId').to(["read"]),
      allow.ownerDefinedIn('consumerUserId').to(["read"]),
    ])
}).authorization(allow => [
  allow.group('ADMINS'),
  allow.ownerDefinedIn('userId').to(['read']),
  allow.ownersDefinedIn('userIds').to(['read'])
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
