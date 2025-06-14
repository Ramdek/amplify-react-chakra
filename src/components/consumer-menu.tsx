import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';

const client = generateClient<Schema>();

const ConsumerMenu = () => {

    const [consumers, setTodos] = useState<Array<Schema["Consumer"]["type"]>>([]);
    
    useEffect(() => {
        client.models.Provider.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    return (
        <TableContainer>
            <Table variant='unstyled'>
                <TableCaption>Oui</TableCaption>
                <Thead>
                <Tr>
                    <Th>Consumer name</Th>
                    <Th>into</Th>
                    <Th isNumeric>multiply by</Th>
                </Tr>
                </Thead>
                <Tbody>
                {consumers.map((consumer) => (
                    <Tr key={consumer.id}>
                        <Th>{consumer.name}</Th>
                        <Th>into</Th>
                        <Th isNumeric>multiply by</Th>
                    </Tr>
                ))}
                </Tbody>
                {/* <Tfoot>
                <Tr>
                    <Th>To convert</Th>
                    <Th>into</Th>
                    <Th isNumeric>multiply by</Th>
                </Tr>
                </Tfoot> */}
            </Table>
        </TableContainer>
    )
}

export default ConsumerMenu;