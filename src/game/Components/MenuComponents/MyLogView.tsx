// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isNullOrUndefined } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { FetchWalletLog } from '../../../hooks/ApiCaller';

const BackDrop = styled.div`
  width: 100%;
  
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: black;
  margin-top: 50px;
  margin: 2%;
    table-layout: fixed;
  
`;

const Th = styled.th`
  padding: 1px;
  border: 1px solid #42eacb;
  text-align: center;
  
`;


const Td = styled.td`
  color: #31bca3;
  font-size: 1vw;
  font-family: 'Cooper Black', sans-serif;
  border: 1px solid #42eacb;
  padding: 1;
  background-color: #000000;
  text-align: center;
  white-space: nowrap;
     @media only screen and (max-width: 640px){
      font-size: 2vw;
    }
`;

const Thead = styled.thead`
  background-color: black;
  color: #31bca3;
  font-style: bold;
  font-size: 1.3vw;
  font-family: 'Cooper Black', sans-serif;
  position: sticky; /* Keep the header visible when scrolling */
  top: 0;
  z-index: 1;
    @media only screen and (max-width: 640px){
      font-size: 2vw;
    }
`;

const Tbody = styled.tbody`
  max-height: 55vh;
  overflow-y: auto; /* Allows body content to scroll */
  
`;

interface LogEntry {
  balance_change: number;
  created_at: number;
  group: string;
  message: string;
  user_wallet_address: string;
}

export default function MyLogView() {
  const [log, setLog] = useState<LogEntry[] | null>(null);

  const loopFunctionUpdater = async () => {
    try {
      const logData = await FetchWalletLog();
      if (Array.isArray(logData.data)) {
        setLog(logData.data);
      }
    } catch (error) {
      console.error("Error fetching log data:", error);
    }
  }

  useEffect(() => {
    loopFunctionUpdater();
  }, []);

  return (
    <BackDrop key={uuidv4()}>
      <Table>
        <Thead>
          <tr>
            <Th>Date</Th>
            <Th>Bits</Th>
            <Th>Event</Th>
          </tr>
        </Thead>
        <Tbody>
          {
            !isNullOrUndefined(log) && log.length > 0 &&
            log.map((entry, index) => {
              const date = new Date(entry.created_at);
              const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
              return (
                <tr key={uuidv4()}>
                  <Td>{formattedDate}</Td>
                  <Td style={{ color: entry.balance_change > 0 ? 'green' : 'red' }}>
                    {entry.balance_change}
                  </Td>
                  <Td>{entry.group}</Td>
                </tr>
              );
            })
          }
        </Tbody>
      </Table>
    </BackDrop>
  );
}

