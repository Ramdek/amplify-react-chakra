import {
  Badge,
  Flex,
  Box,
  HStack,
  Text,
  Spacer
} from '@chakra-ui/react';


type PropsType = { red: number, green: number, blue: number }

const Consumption = ({red, green, blue}: PropsType) => {

  const tot = red + green + blue;

  const toPercent = (amount: number) => {
    return tot > 0 ? `${((amount/tot) * 100).toFixed(1)}%` : '- %'
  }

  const formatBadge = (colorName: string, amount: number) => {
    return (
      <Flex mr='1'>
        <Badge mr='1' colorScheme={colorName}>{colorName}</Badge>
        <Text fontSize='xs'>
          {amount ? amount : 0} ( {toPercent(amount)})
        </Text>
      </Flex>
    )
  }

  return (
    <>
      <Flex mt='4' mb='2'>
        <Text as='b' mr='2'>
          Consumption
        </Text>
        <Spacer/>
        <HStack> {formatBadge('red', red)} {formatBadge('green', green)} {formatBadge('blue', blue)} </HStack>
      </Flex>
      <HStack h='2' width='50'>
        <Box h='100%' bg='red.200' width={toPercent(red)} />
        <Box h='100%' bg='green.200' width={toPercent(green)} />
        <Box h='100%' bg='blue.200' width={toPercent(blue)} />
      </HStack>
    </>
  )
}

export default Consumption;