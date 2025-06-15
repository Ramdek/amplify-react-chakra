import type { Schema } from "../../../amplify/data/resource";

import {
  Button,
  Flex,
  HStack,
  Input,
  Text
} from '@chakra-ui/react';
import ConsumptionClient from '../../api/Consumption';
import Consumption from "./consumption";
import CreditsDisplay from "./creditsDisplay";
import { SetStateAction, useState } from "react";


type PropsType = |
  { consumption: Schema["Consumption"]["type"], consumptionClient: ConsumptionClient }

const ConsumerConsume = ({ consumption, consumptionClient } : PropsType) => {

  const [amountValue, setAmountValue] = useState('');

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => setAmountValue(event.target.value);

  const consume = (color: string) => {
    const value = Number(amountValue);
    if (value <= consumption.availableCredits) {
      consumptionClient.addConsumption(consumption.id, color, value);
      consumptionClient.updateCredits(consumption.id, (consumption.availableCredits - value));
    }
  }

  return (
    <>
      <Consumption red={consumption.consumedRed} green={consumption.consumedGreen} blue={consumption.consumedBlue} />
      <Flex alignItems='center' justifyContent='space-between'>
        <CreditsDisplay credits={`${consumption.availableCredits}`} />
        <HStack>
          <Text>Consume :</Text>
          <Input size='xs' w='3rem' value={amountValue} onChange={handleChange}></Input>
          {['red', 'green', 'blue'].map(color => (
            <Button key={color} size='sm' variant='ghost' colorScheme={color} onClick={() => consume(color)} >{String(color).charAt(0).toUpperCase() + String(color).slice(1)}</Button>
          ))}
        </HStack>
      </Flex>
    </>
  )
}

export default ConsumerConsume;