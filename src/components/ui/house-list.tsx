import { SetStateAction, useEffect, useState } from "react";
import type { Schema } from "../../../amplify/data/resource";

import {
  Accordion,
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';

import HouseItem from "./house-item";
import ClientFactory from "../../api/clientFactory";


type PropsType = { clientFactory: ClientFactory, actorId: string, actorName: string, isProvider: boolean, editable: boolean }

const HouseList = ({ clientFactory, actorId, actorName, isProvider, editable }: PropsType ) => {

  type HouseConsumption = { house: Schema["HouseLocation"]["type"], consumptions: Array<Schema["Consumption"]["type"]> }
  type HouseConsumptionList = Array<HouseConsumption>

  const houseLocationClient = clientFactory.createHouseLocationClient();
  const [houses, sethouses] = useState<Array<Schema["HouseLocation"]["type"]>>([]);
  const [houseConsList, setHouseConsList] = useState<HouseConsumptionList>([]);
  const [houseValue, setHouseValue] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => setHouseValue(event.target.value);

  if (isProvider) {
    useEffect(() => {
      houseLocationClient.subscribeWithProviderId(actorId, (data: { items: any; }) => {
        sethouses([...data.items]);
        setAddLoading(false);
      });
    }, []);
  } else {
    useEffect(() => {
      clientFactory.createConsumptionClient().subscribeWithConsumerId(actorId, async (data: { items: any; }) => {

        try {

          let consumptions: Array<Schema["Consumption"]["type"]> = [...data.items];
          const customList: HouseConsumptionList = [];
  
          for (const consumption of consumptions) {

            let providerId = consumption.providerId as string;

            const house = await houseLocationClient.get(providerId);
            const houseMatch = customList.find((h: HouseConsumption) => h?.house?.id === house.id);
  
            if (houseMatch) {
              houseMatch.consumptions.push(consumption);
            } else {
              customList.push({
                house: house,
                consumptions: [ consumption ]
              });
            }
          };
  
          setHouseConsList(customList);
        } catch(e) {
          console.warn("Error while creating HouseConsumptions List : " + e)
        }
      });
    }, []);
  }

  const addHouse = () => {
    setAddLoading(true);
    houseLocationClient.create(houseValue, actorId, actorName);
    setHouseValue('');
  }

  return (
    <>
      <Accordion defaultIndex={[0]} allowToggle>
        { isProvider ? 
          (
            houses ? houses.map((house) => (
              <HouseItem 
                key={house.id}
                clientFactory={clientFactory}
                houseLocationClient={houseLocationClient}
                house={house}
                isProvider={isProvider}
                editable={editable} 
                consumptions={[]} 
                providerId={""}
              />
            )) : ''
          ) : (
            houseConsList ? houseConsList.map(houseCons => {
              return (
              <HouseItem 
                key={houseCons.house.id}
                clientFactory={clientFactory}
                consumptions={houseCons.consumptions}
                houseLocationClient={houseLocationClient}
                house={houseCons.house}
                isProvider={isProvider}
                providerId={""}
                editable={false}
              />
            )}) : ''
          )
        }
      </Accordion>

      {editable ? 
      (
        <Center pt='4'>
          <InputGroup size='md'>
            <Input variant='outline' placeholder='Location name'
              value={houseValue}
              onChange={handleChange}/>
            <InputRightElement width='4.5rem'>
              <Button isLoading={addLoading} colorScheme='green' size='sm' onClick={addHouse}>Add</Button>
            </InputRightElement>
          </InputGroup>
        </Center>
      ) : ''}
    </>
  )
}

export default HouseList;