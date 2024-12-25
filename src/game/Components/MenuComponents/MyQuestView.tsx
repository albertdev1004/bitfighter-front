// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { FetchWalletLog } from '../../../hooks/ApiCaller';

interface LogEntry {
  balance_change: number;
  created_at: number;
  group: string;
}

export default function MyChartView() {
  const [log, setLog] = useState<LogEntry[]>([]);

  // Fetch the wallet log data
  const loopFunctionUpdater = async () => {
    try {
      const logData = await FetchWalletLog();
      if (Array.isArray(logData.data)) {
        setLog(logData.data);
      }
    } catch (error) {
      console.error("Error fetching log data:", error);
    }
  };

  useEffect(() => {
    loopFunctionUpdater();
  }, []);

  // Prepare data for the chart
  const xAxisData = log.map((entry) => ({
    x: new Date(entry.created_at).getTime(), // Timestamps for x-axis
    y: entry.balance_change // Balance changes for y-axis
  }));

  // Log axis data for debugging
  useEffect(() => {
 //   console.log('xAxisData:', xAxisData);
  }, [xAxisData]);

  // Check if data is valid
  if (xAxisData.length === 0) {
    return <p>Loading chart data...</p>;
  }

//I cant get past this error. Tried many things
//   ERROR
// inAxis?.map is not a function
// TypeError: inAxis?.map is not a function



  return (
    <div style={{ height: '400px', width: '100%', color: 'white'}}>
        Coming Soon
      {/* <LineChart
        xAxis={{
          type: 'time', // X-axis as a time-based axis
          data: xAxisData.map(d => d.x), // Extract X values (timestamps)
          tickFormat: (timestamp) => {
            const date = new Date(timestamp);
            return `${date.getMonth() + 1}/${date.getDate()}`; // Format as MM/DD
          },
          label: 'Date',
        }}
        yAxis={{
          label: 'Balance Change (Bits)',
        }}
        series={[
          {
            id: 'balance-change-series', // Unique id for the series
            data: xAxisData.map(d => d.y), // Extract Y values (balance changes)
            label: 'Balance Change Over Time',
          },
        ]}
      /> */}
    </div>
  );
}
