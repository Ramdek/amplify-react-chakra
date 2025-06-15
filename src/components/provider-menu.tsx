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
import Provider from '../api/Provider';
import HouseLocation from '../api/HouseLocation';


type PropsType = { houseLocationClient: HouseLocation, providerClient: Provider, isAdmin: boolean };

const ProviderMenu = ({ houseLocationClient, providerClient, isAdmin } : PropsType) => {

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
                        houseLocationClient={houseLocationClient} 
                        providerId={provider.id} 
                        providerName={provider.userId == null ? provider.id : provider.userId} 
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
              houseLocationClient={houseLocationClient} 
              providerId={UserProfile.getId()} 
              providerName={UserProfile.getName()}
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