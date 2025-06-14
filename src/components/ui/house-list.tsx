import { SetStateAction, useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { p } from "aws-amplify";
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

const client = generateClient<Schema>();

type PropsType = { providerName: string }

const HouseList = ({ providerName }: PropsType ) => {

  const [houses, sethouses] = useState<Array<Schema["HouseLocation"]["type"]>>([]);
  const [houseValue, setHouseValue] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => setHouseValue(event.target.value);

  useEffect(() => {
    client.models.HouseLocation.observeQuery({
      filter: {
        userIds: {
          contains: providerName,
        },
      },
    }).subscribe({
      next: (data) => {
        sethouses([...data.items])
        setAddLoading(false);
      },
    });
  }, []);

  const addHouse = () => {
    setAddLoading(true);
    client.models.HouseLocation.create({ name: houseValue, userIds: [ providerName ] });
    setHouseValue('');
  }

  return (
    <>
      <Accordion defaultIndex={[0]} allowToggle>
        {houses.map((house) => (
          <HouseItem key={house.id} house={house} />
        ))}
      </Accordion>

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
    </>
  )
}

export default HouseList;