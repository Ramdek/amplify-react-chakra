import { useEffect, useState } from "react";
import type { Schema } from "../../amplify/data/resource";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardBody,
  Center,
  Heading,
  Spinner,
  Text
} from '@chakra-ui/react';

import ClientFactory from "../api/clientFactory";
import UserProfile from "../utils/UserProfile";
import HouseList from "./ui/house-list";
import Identification from "./ui/identification";


type PropsType = { clientFactory: ClientFactory, isProvider: boolean }

const ConsumerMenu = ({ clientFactory, isProvider } : PropsType) => {

  const consumerClient = clientFactory.createConsumerClient();
  const [consumers, setConsumers] = useState<Array<Schema["Consumer"]["type"]>>([]);
  const [idLoaded, setIdLoaded] = useState(false);

  
  if (isProvider) {
    useEffect(() => {
      consumerClient.subscribe((data: { items: any; }) => setConsumers([...data.items]));
    }, []);
  }

  const waitId = async () => {
    await UserProfile.waitIdLoaded();
    setIdLoaded(true);
  }

  waitId();

  return (
  <>
    <Heading size='sm' textAlign='center' paddingY='4'>Manage { isProvider ? 'consumers' : 'your' } consumptions</Heading>
    { isProvider ? (

      <Accordion defaultIndex={[0]} allowToggle>
        {consumers.map(consumer => (
          <AccordionItem key={consumer.id}>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Identification actor={consumer} />
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Card>
                  <CardBody p='2'>
                    <Text>Locations</Text>
                    <HouseList 
                      clientFactory={clientFactory}
                      actorId={consumer.id} 
                      actorName={consumer.userId == null ? consumer.id : consumer.userId} 
                      isProvider={false}
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
            isProvider={isProvider}
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

export default ConsumerMenu;