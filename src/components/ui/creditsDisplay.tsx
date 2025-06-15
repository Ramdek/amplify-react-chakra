import { SetStateAction, useState } from 'react';

import {
  HStack,
  Text,
  Tag
} from '@chakra-ui/react';


type PropsType = { credits: string }

const Credits = ({ credits }: PropsType) => {

  return (
    <HStack mt='4' mb='2'>
      <Text as='b' mr='2'>
        Credits
      </Text>
      <Tag>{credits}</Tag>
    </HStack>
  )
}

export default Credits;