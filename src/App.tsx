import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Spinner,
  Stack,
  Text
  } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { LuUser } from "react-icons/lu";

import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';

import ProviderMenu from "./components/provider-menu";
import ConsumerMenu from "./components/consumer-menu";
import AdminMenu from "./components/admin-menu";

import UserProfile from "./utils/UserProfile";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";
import ClientFactory from "./api/clientFactory";


const client = generateClient<Schema>();

function App() {

  const [groups, setGroups] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndGroups = async () => {
      const { tokens } = await fetchAuthSession();

      const username = tokens?.accessToken.payload.username as string;
      const groups = tokens?.accessToken.payload["cognito:groups"] as Array<string>;
      setGroups(groups === undefined ? [] : groups);
      
      if (username != null) {
        UserProfile.setCredentials(tokens?.accessToken as { payload: { sub: string; username: string; }; }, groups);
      }
      
      setLoading(false);
    };

    fetchUserAndGroups();
  }, []);

  const isAdmin = () => groups.includes('ADMINS');
  const isProvider = () => groups.includes('PROVIDERS');

  const clientFactory = new ClientFactory(client);

  const { signOut } = useAuthenticator();

  let defaultIndex = 2;

  if (isProvider()) {
    defaultIndex= 1;
  }

  return (
      <Stack>
        <Box boxSize="700px" height='600px' p='6' borderWidth='1px' borderRadius='lg' overflow='hidden' bg='white'>
          
          <Heading size='md' textAlign="center">Provider / Consumer App</Heading>
          
          <Divider pt='4' />

          { ! loading ? (
              <Tabs pt='4' isFitted position='relative' variant='soft-rounded' defaultIndex={defaultIndex}>
                <TabList gap='6'>
                  
                  <Tab isDisabled={ ! isAdmin() }>
                    <HStack spacing='4px'>
                      <LuUser/>
                      <p>Admin</p>
                    </HStack>
                  </Tab>
                  <Tab isDisabled={ ! isProvider() && ! isAdmin() }>
                    <HStack spacing='4px'>
                      <LuUser/>
                      <p>Provider{ isAdmin() ? "s" : "" }</p>
                    </HStack>
                  </Tab>
                  <Tab isDisabled={ isProvider() }>
                    <HStack spacing='4px'>
                      <LuUser/>
                      <p>Consumer{ isAdmin() || isProvider() ? "s" : "" }</p>
                    </HStack>
                  </Tab>
                </TabList>

                <TabPanels mt='2' maxHeight='480px' overflow='scroll'>
                  <TabPanel>

                    { isAdmin() ? (
                      <AdminMenu clientFactory={clientFactory} />
                    ) : '' }

                  </TabPanel>
                  <TabPanel>


                    { isProvider() || isAdmin() ? (
                      <ProviderMenu clientFactory={clientFactory} isAdmin={isAdmin()} />
                    ) : '' }

                  </TabPanel>
                  <TabPanel>

                    { ! isProvider() ? (
                      <ConsumerMenu clientFactory={clientFactory} isProvider={isAdmin()} />
                    ) : '' }

                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              <Center minHeight="50%">
               <Spinner/>
              </Center>
            )
          }
          
        </Box>
        <Flex alignItems='center' justifyContent='space-between'>
          <Text as='i' fontSize='sm' color='grey' >Made by Jonathan Sling</Text>
          <Button onClick={signOut} variant='outline' bg='whiteAlpha.600'>Sign out</Button>
        </Flex>
      </Stack>
  );
}

export default App;
