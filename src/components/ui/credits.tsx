import { SetStateAction, useState } from 'react';

import {
  Button,
  Flex,
  Spacer,
  HStack,
  Input
} from '@chakra-ui/react';
import CreditsDisplay from './creditsDisplay';


type PropsType = { credits: string, updateAction: Function }

const Credits = ({ credits, updateAction }: PropsType) => {

  const [creditValue, setCreditValue] = useState('');

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => setCreditValue(event.target.value);

  const updateCredits = (positive: boolean) => {
    const amount = (positive ? 1 : -1) * Number(creditValue);
    updateAction(Number(credits) + amount);
  }

  return (
    <>
    <Flex>
      <CreditsDisplay credits={credits} />

      <Spacer/>

      <HStack mt='4' mb='2'>
        <Input size='xs' w='3rem' value={creditValue} onChange={handleChange}></Input>
        <Button size='xs' onClick={() => updateCredits(false)} >-</Button>
        <Button size='xs' onClick={() => updateCredits(true)} >+</Button>
      </HStack>
    </Flex>
    </>
  )
}

export default Credits;