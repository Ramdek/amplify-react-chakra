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
      allow.ownerDefinedIn('userId').to(['read']),
      allow.group('ADMINS'),
      allow.guest().to(['read'])
    ]),
  Consumer: a
    .model({
      name: a.string().required(),
      userId: a.string(),
      consumption: a.hasMany('Consumption', 'consumerId')
    }).authorization(allow => [
      allow.group('PROVIDERS'),
      allow.group('ADMINS'),
      allow.ownerDefinedIn('userId')
    ]),
  HouseLocation: a
    .model({
      name: a.string().required(),
      providerId: a.string(),
      userIds: a.string().array(),
      ownerId: a.id(),
      houseOwner: a.belongsTo('Provider', 'ownerId'),
      consumption: a.hasMany('Consumption', 'providerId')
    }).authorization(allow => [
      allow.ownerDefinedIn('providerId'),
      allow.group('ADMINS'),
      allow.authenticated().to(['read'])
    ]),
  Consumption: a
    .model({
      availableCredits : a.integer().authorization(allow => [
        allow.ownerDefinedIn('providerUserId'),
        allow.ownerDefinedIn('consumerUserId').to(['read']),
        allow.group('ADMINS')
      ]),
      consumedRed : a.integer().authorization(allow => [
        allow.ownerDefinedIn('consumerUserId'),
        allow.ownerDefinedIn('providerUserId'),
        allow.group('ADMINS')
      ]),
      consumedGreen : a.integer().authorization(allow => [
        allow.ownerDefinedIn('consumerUserId'),
        allow.ownerDefinedIn('providerUserId'),
        allow.group('ADMINS')
      ]),
      consumedBlue : a.integer().authorization(allow => [
        allow.ownerDefinedIn('consumerUserId'),
        allow.ownerDefinedIn('providerUserId'),
        allow.group('ADMINS')
      ]),
      providerUserId: a.string(),
      consumerUserId: a.string(),
      providerId: a.id(),
      consumerId: a.id(),
      provider: a.belongsTo('HouseLocation', 'providerId'),
      consumer: a.belongsTo('Consumer', 'consumerId'),
    }).authorization(allow => [
      allow.ownerDefinedIn('consumerUserId').to(["read"]),
      allow.group('PROVIDERS').to(['create', 'delete']),
      allow.ownerDefinedIn('providerUserId'),
      allow.group('ADMINS')
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
