import { useEffect, useState } from "react";
import type { Schema } from "../../../amplify/data/resource";

import {
  Button,
  Flex,
  Spacer,
  Box,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  HStack,
  Divider,
  Center
} from '@chakra-ui/react';

import Identification from "./identification"
import HouseLocation from "../../api/HouseLocation";
import ConsumerList from "./consumer-list";
import ClientFactory from "../../api/clientFactory";
import ConsumerConsume from "./consumerConsume";


type PropsType = {
    clientFactory: ClientFactory,
    houseLocationClient: HouseLocation,
    house: Schema["HouseLocation"]["type"],
    consumptions: Array<Schema["Consumption"]["type"]>,
    providerId: string,
    isProvider: boolean,
    editable: boolean
  };

const HouseItem = ({ clientFactory, houseLocationClient, house, consumptions, providerId, isProvider, editable } : PropsType) => {

  const [consumption, setConsumption] = useState<Schema['Consumption']['type']>();
  const [delLoading, setDelLoading] = useState(false);
  const consumptionClient = clientFactory.createConsumptionClient();

  if (! isProvider) {
    useEffect(()=> {
      consumptionClient.subscribeWithHouseLocationId(house.id, (data: any) => {
        setConsumption(data);
      });
    }, []);
  }

  const deleteHouse = () => {
    setDelLoading(true);
    houseLocationClient.delete(house.id);
  }

  return (
    <AccordionItem>
      <HStack>
        { isProvider ? (
          <>
            <Button isLoading={delLoading} colorScheme='red' size='xs' onClick={deleteHouse}>Delete</Button>
            <Center height='150px'>
              <Divider orientation='vertical' />
            </Center>
          </>
          ) : '' }
        <Box width='100%'>
          <AccordionButton width='100%'>
            <Flex alignItems='center' width='100%'>
              <Box pl='4'>
                <Identification actor={house} />
              </Box>
              <Spacer/>
              <AccordionIcon />
            </Flex>
          </AccordionButton>
          <AccordionPanel>
            { isProvider ? 
              (
                <ConsumerList clientFactory={clientFactory} houseLocationId={house.id} providerId={providerId} editable={editable} />
              ) :
              consumption != undefined ? (
                consumptions.map(consumption => (
                  <ConsumerConsume key={consumption.id} actor={null} consumption={consumption} consumptionClient={consumptionClient} isProvider={isProvider} />
                ))
              ) : ''
            }
          </AccordionPanel>
        </Box>
      </HStack>
    </AccordionItem>
  )
}

export default HouseItem;