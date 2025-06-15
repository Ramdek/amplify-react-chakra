import type { Schema } from "../../../amplify/data/resource";

import {
  Badge,
  HStack,
  Text
} from '@chakra-ui/react';


type Actor = |
  { actor: Schema["Consumer"]["type"] } |
  { actor: Schema["Provider"]["type"] }

const Identification = ({ actor }: Actor) => {

  const id = actor.id.slice(0, 4);

  return (
    <HStack>
      <Text>{actor.name}</Text>
      <Badge>#{id}</Badge>
    </HStack>
  )
}

export default Identification;