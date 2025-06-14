import { useState } from "react";
import { generateClient } from "aws-amplify/data";
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

const client = generateClient<Schema>();

type PropsType = |
  { house: Schema["HouseLocation"]["type"] };

const HouseItem = ({ house } : PropsType) => {

  const [delLoading, setDelLoading] = useState(false);

  const deleteHouse = () => {
    setDelLoading(true);
    client.models.HouseLocation.delete({ id: house.id });
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