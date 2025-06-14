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

const AdminMenu = () => {

  const actorTypes = ['Provider', 'Consumer']

  return (
    <>
      <Heading size='sm' textAlign='center' paddingY='4'>Add and remove providers or customers</Heading>
      <Accordion defaultIndex={[0]} allowToggle>
        {actorTypes.map(actorType => (
          <AccordionItem key={actorType}>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
              {actorType}s
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <ActorList actorType={actorType}/>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}

export default AdminMenu;