# Smart Umbrella Enterprise Dashboard

A professional IoT monitoring and management system for smart umbrellas, featuring real-time telemetry, environmental analytics, and intelligent alert systems.

## 🎯 Project Overview

The Smart Umbrella Dashboard is an enterprise-grade IoT platform designed to monitor and manage a fleet of smart umbrellas. It provides comprehensive real-time monitoring of environmental conditions, device status, and automated safety protocols.

### Key Features

- **Real-Time Monitoring**: Live tracking of device status, temperature, wind speed, and sunlight exposure
- **Fleet Management**: Monitor multiple devices with individual status cards and metrics
- **Environmental Analytics**: Advanced charts and visualizations for environmental data
- **Intelligent Alerts**: Automated critical and warning alerts for safety conditions
- **Professional UI**: Modern, clean interface with responsive design
- **Data Visualization**: Interactive charts using Recharts for trend analysis

## 📊 Dashboard Sections

### 1. **Operational Overview (KPI Cards)**
- **Total Fleet**: Number of active devices in the system
- **Deployment Rate**: Percentage of umbrellas currently deployed (OPEN)
- **Active Cooling**: Number of devices with mist systems activated
- **Safety Triggers**: Devices operating in safety mode

### 2. **Geospatial & Environmental Monitoring**
- **Temperature Trend**: Real-time temperature monitoring across the fleet
- **Deployment Status**: Pie chart showing deployment distribution
- **Wind Speed Analysis**: Bar chart for wind speed patterns
- **Sunlight Exposure**: Line chart for UV protection monitoring

### 3. **Fleet Status Details**
Individual device cards showing:
- Current temperature with color-coded severity
- Wind speed measurements
- Sunlight exposure percentage
- Umbrella state (OPEN/CLOSED)
- Mist system status
- Safety mode status

### 4. **System Alerts & Status**
- Critical alerts (temperature > 38°C, wind > 15 m/s)
- Warning alerts (safety mode active)
- System health status
- Timestamped alert history

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Charts**: Recharts for data visualization
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **Routing**: Wouter for client-side routing

### Component Structure

```
client/src/
├── pages/
│   ├── Home.tsx          # Main dashboard page
│   └── NotFound.tsx      # 404 page
├── components/
│   ├── Dashboard.tsx     # Reusable dashboard components
│   ├── ui/               # shadcn/ui components
│   └── ErrorBoundary.tsx # Error handling
├── lib/
│   └── dashboard-utils.ts # Utility functions
├── contexts/
│   └── ThemeContext.tsx  # Theme management
└── App.tsx               # Main app component
```

## 🎨 Design Philosophy

### Visual Approach

- **Professional Enterprise Design**: Clean, modern interface suitable for enterprise environments
- **Color Palette**: Deep blues, teals, and professional grays
- **Typography**: Sora font family for modern, readable text
- **Spacing**: Generous whitespace for clarity and focus
- **Depth**: Subtle shadows and gradients for visual hierarchy

### Key Design Elements

1. **Hero Header**: Professional background with gradient overlay
2. **KPI Cards**: Clean metric cards with icons and trend indicators
3. **Charts**: Interactive visualizations with custom styling
4. **Device Cards**: Comprehensive device status with color-coded metrics
5. **Alert System**: Color-coded alerts with clear severity indicators

## 📈 Data Flow

### Mock Data Generation

The dashboard uses mock data generators for demonstration:

```typescript
// Generate device data
const devices = generateMockDevices(3);

// Generate time-series data for charts
const timeSeriesData = generateTimeSeriesData(12);

// Calculate statistics
const stats = calculateStats(devices);
```

### Real Data Integration

To integrate with real data sources:

1. Replace mock data generators with API calls
2. Update the `useEffect` hook in Home.tsx
3. Connect to your DynamoDB or API endpoint
4. Implement real-time updates using WebSockets or polling

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=your_api_endpoint
VITE_REGION=your_aws_region
VITE_TABLE_NAME=your_dynamodb_table
```

### Customization

#### Colors

Edit `client/src/index.css` to customize the color palette:

```css
:root {
  --primary: #0ea5e9;
  --accent: #06b6d4;
  /* ... other colors */
}
```

#### Thresholds

Modify alert thresholds in `client/src/lib/dashboard-utils.ts`:

```typescript
const criticalAlerts = devices.filter(
  (d) => d.temperature > 38 || d.windSpeed > 15 // Adjust values here
).length;
```

#### Device Count

Change the number of mock devices:

```typescript
const mockDevices = generateMockDevices(5); // Change from 3 to 5
```

## 🚀 Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
# Navigate to http://localhost:3000
```

### Building

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📱 Responsive Design

The dashboard is fully responsive:

- **Mobile**: Single column layout with optimized spacing
- **Tablet**: 2-column grid for charts and cards
- **Desktop**: Full 3-4 column layout with all features

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Focus indicators on all interactive elements

## 🔐 Security Considerations

When integrating with real data:

1. **API Authentication**: Implement JWT or OAuth
2. **HTTPS**: Always use secure connections
3. **Data Validation**: Validate all incoming data
4. **Rate Limiting**: Implement rate limiting on API calls
5. **CORS**: Configure proper CORS headers

## 📊 Metrics & KPIs

### Key Metrics Tracked

- **Temperature**: Average and peak temperatures across fleet
- **Wind Speed**: Real-time wind speed monitoring
- **Sunlight Exposure**: UV protection effectiveness
- **Deployment Rate**: Percentage of active devices
- **System Health**: Overall system status and alerts

### Alert Thresholds

| Metric | Warning | Critical |
| --- | --- | --- |
| Temperature | > 30°C | > 38°C |
| Wind Speed | > 10 m/s | > 15 m/s |
| Safety Mode | Active | - |

## 🐛 Troubleshooting

### Common Issues

**Charts not displaying**
- Check if Recharts is properly installed
- Verify data format matches expected structure
- Check browser console for errors

**Styling issues**
- Clear browser cache
- Restart development server
- Verify Tailwind CSS configuration

**Data not loading**
- Check mock data generation functions
- Verify API endpoints if using real data
- Check browser network tab for errors

## 📚 Additional Resources

- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

When extending the dashboard:

1. Follow the existing component structure
2. Use the utility functions in `dashboard-utils.ts`
3. Maintain consistent styling with Tailwind classes
4. Add TypeScript types for new components
5. Update this README with new features

## 📝 Version History

- **v3.0.0** (Current): Professional enterprise redesign
  - Removed emoji icons
  - Enhanced UI with professional styling
  - Improved data visualization
  - Better alert system
  - Responsive design improvements

- **v2.4.0**: Previous Streamlit version
  - Basic IoT monitoring
  - Initial alert system
  - Map visualization

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For issues or questions, please contact the development team.

---

**Last Updated**: March 15, 2026
**Dashboard Version**: 3.0.0-ENTERPRISE
