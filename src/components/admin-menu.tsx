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
import ClientFactory from '../api/clientFactory';


type PropsType = { clientFactory: ClientFactory };

const AdminMenu = ({ clientFactory }: PropsType) => {

  const actorClients = [
    clientFactory.createProviderClient(),
    clientFactory.createConsumerClient()
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