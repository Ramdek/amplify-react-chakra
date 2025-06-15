import { SetStateAction, useEffect, useState } from 'react';

import {
  Button,
  Flex,
  Spacer,
  Divider,
  Input,
  InputGroup,
  InputLeftAddon,
  Center,
  Spinner,
  Box
} from '@chakra-ui/react';

import { Schema } from '../../../amplify/data/resource';
import ClientFactory from '../../api/clientFactory';
import ConsumerCredits from './consumerCredits';


type PropsType = { clientFactory: ClientFactory, houseLocationId: string, providerId: string, editable: boolean };

const ConsumerList = ({ clientFactory, houseLocationId, providerId, editable }: PropsType) => {

  type consumerConsumptionList = Array<{ consumer: Schema["Consumer"]["type"], consumption: Schema["Consumption"]["type"] }>

  const consumptionClient = clientFactory.createConsumptionClient();
  const [consumersConsumptions, setConsumersConsumptions] = useState<consumerConsumptionList>([]);
  const [userValue, setUserValue] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  const handleChangeUser = (event: { target: { value: SetStateAction<string>; }; }) => setUserValue(event.target.value);
  const handleChangeTag = (event: { target: { value: SetStateAction<string>; }; }) => setTagValue(event.target.value);

  useEffect(() => {
    consumptionClient.subscribeWithHouseLocationId(houseLocationId, async (data: { items: any; }) => {

        let consumptions = [...data.items];
        let customList = [];

        for (const consumption of consumptions) {

          const consumer = await consumptionClient.getConsumer(consumption);
  
          customList.push({
            consumer: consumer as Schema["Consumer"]["type"],
            consumption: consumption as Schema["Consumption"]["type"]
          });
        }

        setConsumersConsumptions(customList);
        setLoading(false);
      });
  }, []);

  const addConsumption = async () => {
    setAddLoading(true);
    await consumptionClient.create(houseLocationId, providerId, userValue, tagValue.slice(0, 4)).finally(() => setAddLoading(false));
    setUserValue('');
    setTagValue('');
  }

  return (
    <>
      { ! loading ? consumersConsumptions.map(consumerConsumption => (
        <Box key={consumerConsumption.consumption.id}>
          <ConsumerCredits actor={consumerConsumption.consumer} consumption={consumerConsumption.consumption} consumptionClient={consumptionClient} isAdmin={true} />
          <Divider marginY='5' />
        </Box>
      )) : (
        <Center marginBlock='6'>
          <Spinner/>
        </Center>
      )}

      {editable ? (
        <Flex>
          <InputGroup size='sm' w='70%'>
            <Input value={userValue} onChange={handleChangeUser} mr='2' placeholder='User' />
            <InputLeftAddon>#</InputLeftAddon>
            <Input value={tagValue} onChange={handleChangeTag} placeholder='Tag' />
          </InputGroup>
          <Spacer/>
          <Button isLoading={addLoading} size='sm' colorScheme='green' onClick={addConsumption} >Add</Button>
        </Flex>
      ) : ''}
    </>
  )
}

export default ConsumerList;