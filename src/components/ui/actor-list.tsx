import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

import {
  Button,
  Card,
  CardBody,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  Spacer,
  Box
} from '@chakra-ui/react';

import ActorCard from "./actor-card";

const client = generateClient<Schema>();

type PropsType = |
  { actorType: string };

const ActorList = ({ actorType } : PropsType) => {

  const [actors, setActors] = useState<Array<Schema[actorType]["type"]>>([]);
  const [actorValue, setActorValue] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const handleChange = (event) => setActorValue(event.target.value);

  useEffect(() => {
    client.models[actorType].observeQuery().subscribe({
      next: (data) => setActors([...data.items]),
    });
  }, []);

  const addActor = () => {
    setAddLoading(true);
    client.models[actorType].create({ name: actorValue });
    setAddLoading(false);
    setActorValue('');
  }

  return (
    <>
      {actors.map((actor) => (
        <ActorCard key={actor.id} actor={actor} actorType={actorType} />
      ))}
      
      <Center pt='4'>
      <InputGroup size='md'>
        <Input variant='outline' placeholder={`${actorType} name`}
          value={actorValue}
          onChange={handleChange}/>
        <InputRightElement width='4.5rem'>
        <Button isLoading={addLoading} colorScheme='green' size='sm' onClick={addActor}>Add</Button>
        </InputRightElement>
      </InputGroup>
      </Center>
    </>
  )
}

export default ActorList;