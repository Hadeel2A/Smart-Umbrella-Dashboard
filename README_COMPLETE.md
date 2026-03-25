# Smart Umbrella Dashboard - Complete Integration Guide

## 🎯 Project Overview

This is a professional **React + Node.js + DynamoDB** dashboard for monitoring Smart Umbrella IoT devices. It provides real-time environmental monitoring, device status tracking, and intelligent alert management.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)               │
│  - Professional dashboard UI                               │
│  - Real-time device monitoring                             │
│  - Interactive charts and visualizations                   │
│  - Responsive design (mobile, tablet, desktop)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    tRPC API Calls
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Node.js Backend (tRPC)                     │
│  - API endpoints for device data                           │
│  - Statistics calculation                                   │
│  - Alert generation                                         │
│  - DynamoDB integration                                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    AWS SDK Queries
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  AWS DynamoDB                               │
│  - Table: UmbrellaDebug (or custom)                        │
│  - Device data storage                                      │
│  - Real-time metrics                                        │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
smart-umbrella-dashboard/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   └── Home.tsx            # Main dashboard
│   │   ├── components/
│   │   │   └── ui/                 # shadcn/ui components
│   │   ├── lib/
│   │   │   └── trpc.ts             # tRPC client
│   │   ├── App.tsx                 # App routing
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── index.html
│   └── public/
├── server/                          # Node.js Backend
│   ├── dynamodb.ts                 # DynamoDB integration
│   ├── routers.ts                  # tRPC procedures
│   ├── db.ts                       # Database helpers
│   └── _core/                      # Framework internals
├── drizzle/                         # Database schema
│   └── schema.ts
├── shared/                          # Shared types
│   └── const.ts
├── DYNAMODB_SETUP.md               # DynamoDB setup guide
├── README_COMPLETE.md              # This file
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- pnpm (or npm/yarn)
- AWS account with DynamoDB table

### Installation

```bash
# Navigate to project
cd /home/ubuntu/smart-umbrella-dashboard

# Install dependencies
pnpm install

# Set up environment variables
# Copy configuration from DYNAMODB_SETUP.md

# Start development server
pnpm dev
```

The dashboard will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Required variables for DynamoDB integration:

```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=eu-north-1
DYNAMODB_TABLE=UmbrellaDebug
```

See `DYNAMODB_SETUP.md` for complete configuration guide.

## 📊 Features

### Dashboard Components

1. **KPI Cards** - Key performance indicators
   - Total Fleet Count
   - Deployment Rate
   - Active Cooling Systems
   - Safety Triggers

2. **Charts & Visualizations**
   - Temperature Trend (Area Chart)
   - Deployment Status (Pie Chart)
   - Wind Speed Analysis (Bar Chart)
   - Sunlight Exposure (Line Chart)

3. **Fleet Status Details**
   - Individual device cards
   - Real-time metrics
   - Status indicators
   - System status badges

4. **System Alerts**
   - Critical alerts (high priority)
   - Warnings (medium priority)
   - Info messages (low priority)
   - Timestamps and device references

### Data Endpoints

#### Get All Devices
```typescript
GET /api/trpc/devices.getAll
Response: DeviceData[]
```

#### Get Device Statistics
```typescript
GET /api/trpc/devices.getStats
Response: {
  totalDevices: number,
  activeDevices: number,
  coolingActive: number,
  safetyTriggered: number,
  avgTemp: number,
  avgWind: string,
  avgSunlight: number
}
```

## 🔌 DynamoDB Integration

### Enabling Real Data

1. **Install AWS SDK**
   ```bash
   pnpm add @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb
   ```

2. **Set Environment Variables**
   ```env
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=eu-north-1
   DYNAMODB_TABLE=UmbrellaDebug
   ```

3. **Enable DynamoDB Code**
   - Open `server/dynamodb.ts`
   - Uncomment the AWS SDK implementation
   - Comment out the mock data

4. **Restart Server**
   ```bash
   pnpm dev
   ```

### Expected Data Format

Your DynamoDB table should have this structure:

```json
{
  "deviceId": "umbrella-01",
  "payload": {
    "temperature": 25,
    "windSpeed": 12.5,
    "sunlight": 75,
    "umbrellaState": "OPEN",
    "mistStatus": "ON",
    "safetyMode": "OFF"
  },
  "timestamp": "2026-03-15T20:35:00Z"
}
```

## 🧪 Testing

### Run Tests
```bash
pnpm test
```

### Development Commands
```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type check
pnpm check

# Format code
pnpm format
```

## 📱 Responsive Design

The dashboard is fully responsive:

- **Desktop**: Full layout with all features
- **Tablet**: Optimized grid layout
- **Mobile**: Stacked cards and simplified charts

## 🎨 Design System

- **Colors**: Deep blues, teals, and professional grays
- **Typography**: Modern sans-serif (Sora font)
- **Components**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts

## 🔐 Security

- JWT-based authentication
- Environment variable secrets
- HTTPS in production
- AWS IAM role-based access (recommended)
- Secure cookie handling

## 📈 Performance

- Optimized React rendering
- Lazy-loaded charts
- Efficient tRPC data fetching
- CSS-in-JS optimization
- Production builds minified

## 🐛 Troubleshooting

### Dashboard Not Loading
- Check browser console for errors
- Verify backend is running: `pnpm dev`
- Check network tab for failed requests

### DynamoDB Connection Failed
- Verify AWS credentials
- Check region matches table location
- Ensure table name is correct
- Verify IAM permissions

### Charts Not Displaying
- Check browser console for errors
- Verify Recharts is installed
- Check data format matches expected schema

### Slow Performance
- Enable browser DevTools Performance tab
- Check network requests
- Consider adding DynamoDB indexes
- Implement caching if needed

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [tRPC Documentation](https://trpc.io)
- [AWS DynamoDB Guide](https://docs.aws.amazon.com/dynamodb/)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org)

## 🤝 Development Workflow

1. **Frontend Changes**
   - Edit files in `client/src/`
   - Hot reload automatically
   - Test in browser

2. **Backend Changes**
   - Edit files in `server/`
   - Server restarts automatically
   - Test with tRPC client

3. **Database Changes**
   - Update schema in `drizzle/schema.ts`
   - Run `pnpm db:push`
   - Update backend queries

4. **Testing**
   - Write tests in `server/*.test.ts`
   - Run `pnpm test`
   - Ensure coverage

## 📦 Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Environment Setup
- Set all required environment variables
- Use AWS IAM roles instead of access keys
- Enable HTTPS
- Configure CORS if needed
- Set up monitoring and logging

## 📝 License

This project is part of the Smart Umbrella IoT System.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review DYNAMODB_SETUP.md
3. Check browser console for errors
4. Review server logs

## 🎓 Learning Resources

### Understanding the Stack

1. **React** - UI framework
2. **tRPC** - End-to-end type-safe APIs
3. **Node.js** - Backend runtime
4. **DynamoDB** - NoSQL database
5. **Tailwind CSS** - Utility-first CSS
6. **TypeScript** - Type safety

### Key Concepts

- **tRPC Procedures**: Server functions called from client
- **React Hooks**: useState, useEffect for state management
- **DynamoDB Scan**: Query all items from table
- **Responsive Design**: Mobile-first approach

---

**Last Updated**: March 15, 2026
**Version**: 3.0.0-ENTERPRISE
