import { SetStateAction, useState } from "react";
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
import ActorClient from "../../api/Actor";


type PropsType = |
  { actor: Schema["Consumer"]["type"], actorClient: ActorClient } |
  { actor: Schema["Provider"]["type"], actorClient: ActorClient }

const ActorCard = ({ actor, actorClient } : PropsType) => {

  const [userValue, setUserValue] = useState(actor.userId);
  const [delLoading, setDelLoading] = useState(false);
  const toast = useToast({ position: 'top' });
  
  const handleChange = (event: { target: { value: SetStateAction<string | null | undefined>; }; }) => setUserValue(event.target.value);

  const assignUserName = () => {

    if (userValue != actor.userId) {

      let promise = new Promise<void>(res => res());
      actorClient.updateAssociatedUser(actor, userValue);
      
      toast.promise(promise, {
        success: { title: 'Updated successfully', description: `${actor.name} #${actor.id.toUpperCase().slice(0, 4)} associated account updated` },
        error: { title: 'Update failed', description: 'Something went wrong :(' },
        loading: { title: 'Updating associated account', description: 'Please wait' },
      });
    }
  }

  const deleteActor = (id: string) => {
    setDelLoading(true);
    actorClient.delete(id);
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
        <Editable mr='4' placeholder='None' defaultValue={actor.userId}>
          <Tooltip label='Click to edit' shouldWrapChildren={true}>
            <EditablePreview paddingInline='2' _hover={{
            background: useColorModeValue('gray.100', 'gray.700'),
          }}/>
          </Tooltip>
          <EditableInput paddingInline='2' value={! userValue ? "None" : userValue} onChange={handleChange} onBlur={assignUserName} />
        </Editable>
        

        <Button isLoading={delLoading} colorScheme='red' size='sm' onClick={() => deleteActor(actor.id)}>Delete</Button>
      </Flex>
      </CardBody>
    </Card>
  )
}

export default ActorCard;