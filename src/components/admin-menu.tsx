import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Heading
} from '@chakra-ui/react';


import ActorList from './ui/actor-list';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../amplify/data/resource';
import Provider from '../api/Provider';
import Consumer from '../api/Consumer';


type PropsType = { providerClient: Provider, consumerClient: Consumer };

const AdminMenu = ({ providerClient, consumerClient }: PropsType) => {

  const actorClients = [
    providerClient,
    consumerClient
  ]

  return (
    <>
      <Heading size='sm' textAlign='center' paddingY='4'>Add and remove providers or customers</Heading>
      <Accordion defaultIndex={[0]} allowToggle>
        {actorClients.map(actorClient => (
          <AccordionItem key={actorClient.getType()}>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
              {actorClient.getType()}s
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <ActorList actorClient={actorClient} />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}

export default AdminMenu;