import { SetStateAction, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Editable,
  EditablePreview,
  EditableInput,
  useColorModeValue,
  Flex,
  Spacer,
  useToast,
  Tooltip
} from '@chakra-ui/react';

import Identification from "./identification"

const client = generateClient<Schema>();

type PropsType = |
  { actor: Schema["Consumer"]["type"], actorType: string } |
  { actor: Schema["Provider"]["type"], actorType: string }

const ActorCard = ({ actor, actorType } : PropsType) => {

  const [userValue, setUserValue] = useState(actor.userId);
  const [delLoading, setDelLoading] = useState(false);
  const toast = useToast({ position: 'top' })
  
  const handleChange = (event: { target: { value: SetStateAction<string | null | undefined>; }; }) => setUserValue(event.target.value);

  const assignUserName = () => {

    // TODO: handle empty value (print None after update)
    if (userValue != actor.userId) {

      let promise = client.models[actorType].update({ userId: userValue });
      toast.promise(promise, {
        success: { title: 'Updated successfully', description: `${actor.name} #${actor.id.toUpperCase().slice(0, 4)} associated account updated` },
        error: { title: 'Update failed', description: 'Something went wrong :(' },
        loading: { title: 'Updating associated account', description: 'Please wait' },
      });
    }
  }

  const deleteActor = (id: string) => {
    setDelLoading(true);
    client.models[actorType].delete({ id });
  }

  return (
    <Card mt='4' key={actor.id}>
      <CardBody p='2'>
      <Flex alignItems='center' key={actor.id}>
        <Box pl='4'>
          <Identification actor={actor} />
        </Box>

        <Spacer/>

        <Badge mr='2' colorScheme='blue' >account</Badge>
        <Editable mr='4' defaultValue={ ! actor.userId ? "None" : actor.userId }>
          <Tooltip label='Click to edit' shouldWrapChildren={true}>
            <EditablePreview paddingInline='2' _hover={{
            background: useColorModeValue('gray.100', 'gray.700'),
          }}/>
          </Tooltip>
          <EditableInput paddingInline='2' value={userValue} onChange={handleChange} onBlur={assignUserName} />
        </Editable>
        

        <Button isLoading={delLoading} colorScheme='red' size='sm' onClick={() => deleteActor(actor.id)}>Delete</Button>
      </Flex>
      </CardBody>
    </Card>
  )
}

export default ActorCard;