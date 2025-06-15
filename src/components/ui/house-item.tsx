import { useState } from "react";
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
  HStack
} from '@chakra-ui/react';

import Identification from "./identification"
import HouseLocation from "../../api/HouseLocation";


type PropsType = |
  { houseLocationApi: HouseLocation, house: Schema["HouseLocation"]["type"] };

const HouseItem = ({ houseLocationApi, house } : PropsType) => {

  const [delLoading, setDelLoading] = useState(false);

  const deleteHouse = () => {
    setDelLoading(true);
    houseLocationApi.delete(house.id);
  }

  return (
    <AccordionItem>
      <HStack>
        <Button isLoading={delLoading} colorScheme='red' size='xs' onClick={deleteHouse}>Delete</Button>
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
            test
          </AccordionPanel>
        </Box>
      </HStack>
    </AccordionItem>
  )
}

export default HouseItem;