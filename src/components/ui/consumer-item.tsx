import { useState } from "react";
import type { Schema } from "../../../amplify/data/resource";

import {
  Button,
  Flex,
  Spacer
} from '@chakra-ui/react';
import Identification from "./identification";
import Credits from "./credits";
import ConsumptionClient from '../../api/Consumption';
import Consumption from "./consumption";


type PropsType = |
  { actor: Schema["Consumer"]["type"], consumption: Schema["Consumption"]["type"], consumptionClient: ConsumptionClient; isAdmin: boolean } |
  { actor: Schema["Provider"]["type"], consumption: Schema["Consumption"]["type"], consumptionClient: ConsumptionClient; isAdmin: boolean }

const ConsumerItem = ({ actor, consumption, consumptionClient, isAdmin } : PropsType) => {

  const [delLoading, setDelLoading] = useState(false);

  const deleteConsumption = () => {
    setDelLoading(true);
    consumptionClient.delete(consumption.id);
  }

  const updateCredits = (amount: string) => {
    consumptionClient.updateCredits(consumption.id, Number(amount));
  }

  return (
    <>
      {actor ? (
        <Flex>
          <Identification actor={actor} />
          <Spacer/>
          { isAdmin ? 
            (
              <Button isLoading={delLoading} size='xs' colorScheme='red' onClick={deleteConsumption} >Delete</Button>
            ): ''}
        </Flex>
      ) : ''}
      <Consumption red={consumption.consumedRed} green={consumption.consumedGreen} blue={consumption.consumedBlue} />
      <Credits updateAction={updateCredits} credits={`${consumption.availableCredits}`} />
    </>
  )
}

export default ConsumerItem;