import { SetStateAction, useEffect, useState } from "react";
import type { Schema } from "../../../amplify/data/resource";

import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';

import ActorCard from "./actor-card";


type PropsType = { actorClient: Actor };

const ActorList = ({ actorClient } : PropsType) => {

  const actorType: string = actorClient.getType();
  const [actors, setActors] = useState<Array<Schema[actorType]["type"]>>([]);
  const [actorValue, setActorValue] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => setActorValue(event.target.value);

  useEffect(() => {

    const subscribeCallback = (data: { items: any; }) => {
      setActors([...data.items]);
      setAddLoading(false);
      setActorValue('');
    }

    actorClient.subscribe(subscribeCallback);
  }, []);

  const addActor = () => {
    setAddLoading(true);
    actorClient.create(actorValue);
  }

  return (
    <>
      {actors.map((actor) => (
        <ActorCard key={actor.id} actor={actor} actorClient={actorClient} />
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