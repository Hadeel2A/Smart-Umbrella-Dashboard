# Smart Umbrella Dashboard - DynamoDB Integration Guide

## Overview

This guide explains how to integrate your Smart Umbrella Dashboard with AWS DynamoDB to fetch real device data.

## Current Status

The application is currently running with **mock data**. All device information, statistics, and alerts are generated locally for demonstration purposes.

## Architecture

```
Frontend (React)
    ↓
Backend API (tRPC)
    ↓
DynamoDB Helper (server/dynamodb.ts)
    ↓
AWS DynamoDB
```

## Setup Instructions

### Step 1: Install AWS SDK Dependencies

```bash
cd /home/ubuntu/smart-umbrella-dashboard
pnpm add @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb
```

### Step 2: Configure Environment Variables

Add these to your `.env` file or set them in your deployment environment:

```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=eu-north-1
DYNAMODB_TABLE=UmbrellaDebug
```

### Step 3: Enable DynamoDB Integration

Open `server/dynamodb.ts` and uncomment the actual DynamoDB implementation:

1. Find the commented section starting with `import { DynamoDBClient }`
2. Uncomment the entire block (lines ~37-69)
3. Comment out the mock implementation (lines ~72-125)

Your file should look like this after:

```typescript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "eu-north-1",
});

const docClient = DynamoDBDocumentClient.from(client);

export async function fetchDevicesFromDynamoDB(): Promise<DeviceData[]> {
  // ... actual DynamoDB implementation
}

// Comment out the mock implementation below
/*
export async function fetchDevicesFromDynamoDB(): Promise<DeviceData[]> {
  // Mock implementation
}
*/
```

### Step 4: Restart the Development Server

```bash
pnpm dev
```

The application will now fetch data from your DynamoDB table instead of using mock data.

## Data Structure

Your DynamoDB table should have items with this structure:

```json
{
  "deviceId": "umbrella-01",
  "payload": {
    "temperature": 25,
    "windSpeed": 12.5,
    "sunlight": 75,
    "umbrellaState": "OPEN",
    "mistStatus": "ON",
    "safetyMode": "OFF",
    "zone": "zone-1",
    "mode": "auto",
    "rain": false,
    "shadeAngle": 45,
    "decisionReason": "High temperature detected"
  },
  "timestamp": "2026-03-15T20:35:00Z"
}
```

## Available API Endpoints

### Get All Devices

```typescript
// Frontend
const { data: devices } = trpc.devices.getAll.useQuery();
```

Response:
```typescript
DeviceData[] = [
  {
    deviceId: "umbrella-01",
    temperature: 25,
    windSpeed: 12.5,
    sunlight: 75,
    umbrellaState: "OPEN",
    mistStatus: "ON",
    safetyMode: "OFF",
    timestamp: "2026-03-15T20:35:00Z"
  },
  // ... more devices
]
```

### Get Device Statistics

```typescript
// Frontend
const { data: stats } = trpc.devices.getStats.useQuery();
```

Response:
```typescript
{
  totalDevices: 3,
  activeDevices: 2,
  coolingActive: 1,
  safetyTriggered: 0,
  avgTemp: 24,
  avgWind: "12.3",
  avgSunlight: 72
}
```

## File Structure

```
smart-umbrella-dashboard/
├── server/
│   ├── dynamodb.ts          ← DynamoDB integration logic
│   ├── routers.ts           ← API endpoints using DynamoDB
│   └── _core/
├── client/
│   └── src/
│       └── pages/
│           └── Home.tsx     ← Dashboard UI
└── DYNAMODB_SETUP.md        ← This file
```

## Troubleshooting

### Connection Issues

**Error: "Failed to fetch devices from DynamoDB"**

1. Verify AWS credentials are correctly set in environment variables
2. Check that the AWS region matches your DynamoDB table region
3. Ensure the table name is correct in `DYNAMODB_TABLE` env var
4. Verify IAM permissions allow DynamoDB access

### Data Format Issues

**Error: "Cannot read property 'temperature' of undefined"**

Your DynamoDB items might have a different structure. Update the data transformation in `server/dynamodb.ts`:

```typescript
return response.Items.map((item: any) => ({
  deviceId: item.deviceId,
  temperature: item.payload?.temperature || item.temperature || 0,
  // ... adjust field mappings as needed
}));
```

### Performance Issues

If queries are slow:

1. Add DynamoDB indexes for frequently queried fields
2. Consider caching results with TTL
3. Implement pagination for large datasets

## Next Steps

1. **Test with mock data first** - Verify the UI works correctly
2. **Set up AWS credentials** - Add to environment variables
3. **Enable DynamoDB integration** - Uncomment the code in `server/dynamodb.ts`
4. **Test with real data** - Verify data flows correctly
5. **Optimize queries** - Add indexes if needed
6. **Deploy** - Push to production

## Security Best Practices

- **Never commit credentials** - Use environment variables only
- **Use IAM roles** - In production, use AWS IAM roles instead of access keys
- **Restrict permissions** - Grant minimal DynamoDB permissions needed
- **Enable encryption** - Use AWS KMS for DynamoDB encryption
- **Monitor access** - Enable CloudTrail logging for audit trails

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review AWS DynamoDB documentation: https://docs.aws.amazon.com/dynamodb/
3. Check tRPC documentation: https://trpc.io/

## Additional Resources

- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
- [DynamoDB Query Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [tRPC Documentation](https://trpc.io/docs)
