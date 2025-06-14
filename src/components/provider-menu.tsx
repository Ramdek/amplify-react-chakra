import { useEffect, useState } from 'react';
import { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';

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
  Text
} from '@chakra-ui/react';

import Identification from './ui/identification';
import HouseList from './ui/house-list';
import UserProfile from '../utils/UserProfile';


const client = generateClient<Schema>();

type PropsType = { isAdmin: boolean };

const ProviderMenu = ({ isAdmin } : PropsType) => {

  const [providers, setProviders] = useState<Array<Schema["Provider"]["type"]>>([]);

  if (isAdmin) {
    useEffect(() => {
      client.models.Provider.observeQuery().subscribe({
        next: (data) => setProviders([...data.items]),
      });
    }, []);
  }

  console.log(providers)

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
                      <HouseList providerName={provider.userId as string} />
                    </CardBody>
                  </Card>
                </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <>
          <HouseList providerName={UserProfile.getName()}/>
        </>
      )}
    </>
  )
}

export default ProviderMenu;