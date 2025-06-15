import { useEffect, useState } from 'react';
import { Schema } from '../../amplify/data/resource';

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Spinner,
  Center
} from '@chakra-ui/react';

import Identification from './ui/identification';
import HouseList from './ui/house-list';
import UserProfile from '../utils/UserProfile';
import ClientFactory from '../api/clientFactory';


type PropsType = { 
  clientFactory: ClientFactory,
  isAdmin: boolean
};

const ProviderMenu = ({ clientFactory, isAdmin } : PropsType) => {

  const providerClient = clientFactory.createProviderClient();
  const [providers, setProviders] = useState<Array<Schema["Provider"]["type"]>>([]);
  const [idLoaded, setIdLoaded] = useState(false);

  if (isAdmin) {
    useEffect(() => {
      providerClient.subscribe((data: { items: any; }) => setProviders([...data.items]));
    }, []);
  }

  const waitId = async () => {
    await UserProfile.waitIdLoaded();
    setIdLoaded(true);
  }

  waitId();

  return (
    <>
      <Heading size='sm' textAlign='center' paddingY='4'>Manage { isAdmin ? 'providers' : 'your' } locations</Heading>
      { isAdmin ? (

        <Accordion defaultIndex={[0]} allowToggle>
          {providers.map(provider => (
            <AccordionItem key={provider.id}>
                <AccordionButton>
                  <Box as='span' flex='1' textAlign='left'>
                    <Identification actor={provider} />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Card>
                    <CardBody p='2'>
                      <Text>Locations</Text>
                      <HouseList 
                        clientFactory={clientFactory}
                        actorId={provider.id} 
                        actorName={provider.userId == null ? provider.id : provider.userId} 
                        isProvider={true}
                        editable={true}
                      />
                    </CardBody>
                  </Card>
                </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <>
          {idLoaded ? 
            <HouseList 
              clientFactory={clientFactory}
              actorId={UserProfile.getId()} 
              actorName={UserProfile.getName()}
              isProvider={true}
              isAdmin={isAdmin}
              editable={true}
            />
          : 
            <Center minHeight="50%">
              <Spinner/>
            </Center>
          }
        </>
      )}
    </>
  )
}

export default ProviderMenu;