import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { Amplify } from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { ChakraProvider, Center } from "@chakra-ui/react";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <Center minHeight="100vh" bgGradient='linear(to-r, blue.200, green.200)'>
        <Authenticator>
          <App />
        </Authenticator>
      </Center>
    </ChakraProvider>
  </React.StrictMode>
);
