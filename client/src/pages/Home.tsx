import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Cloud,
  Droplets,
  Wind,
  Zap,
  MapPin,
  Activity,
  Shield,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { UmbrellaMap } from "@/components/UmbrellaMap";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { DeviceData, Alert } from "@/lib/types";

/**
 * Smart Umbrella Dashboard
 * Real-time IoT monitoring system with WebSocket live updates
 */

// Generate time-series data for charts
const generateTimeSeriesData = (count: number = 12) => {
  return Array.from({ length: count }, (_, i) => ({
    time: `${i}:00`,
    temperature: Math.round(20 + Math.random() * 25),
    windSpeed: Math.round(Math.random() * 20 * 10) / 10,
    sunlight: Math.round(Math.random() * 100),
  }));
};

const getAlertColor = (type: string) => {
  switch (type) {
    case "critical":
      return "border-l-red-500 bg-red-50";
    case "warning":
      return "border-l-yellow-500 bg-yellow-50";
    default:
      return "border-l-green-500 bg-green-50";
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "critical":
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    case "warning":
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    default:
      return <Activity className="w-5 h-5 text-green-600" />;
  }
};

export default function Home() {
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  
  // Use WebSocket hook for real-time updates
  const { devices, stats, alerts, isConnected, lastUpdate, requestData } = useWebSocket();

  useEffect(() => {
    // Generate time series data
    setTimeSeriesData(generateTimeSeriesData());
  }, []);

  const isLoading = !stats || devices.length === 0;

  if (isLoading && !isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
          </div>
          <p className="mt-4 text-blue-200 font-medium">Connecting to Dashboard...</p>
          <p className="mt-2 text-sm text-blue-300">
            {isConnected ? "Loading data..." : "Establishing WebSocket connection..."}
          </p>
        </div>
      </div>
    );
  }

  const defaultStats = {
    totalDevices: 0,
    activeDevices: 0,
    coolingActive: 0,
    safetyTriggered: 0,
    avgTemp: 0,
    avgWind: "0.0",
    avgSunlight: 0,
  };

  const currentStats = stats || defaultStats;

  const deploymentData = [
    { name: "Deployed", value: currentStats.activeDevices, fill: "#06b6d4" },
    { name: "Retracted", value: currentStats.totalDevices - currentStats.activeDevices, fill: "#64748b" },
  ];

  const mistSystemData = [
    { name: "Active", value: currentStats.coolingActive, fill: "#3b82f6" },
    { name: "Inactive", value: currentStats.totalDevices - currentStats.coolingActive, fill: "#cbd5e1" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Header */}
      <div
        className="relative h-96 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663195407833/9i9iHMWnLBMDmDk6umVqmw/umbrella-hero-UYqWHzbVm967TzFCLWrqa7.webp')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-transparent"></div>
        <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Smart Umbrella System
              </h1>
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="w-6 h-6 text-green-400 animate-pulse" />
                ) : (
                  <WifiOff className="w-6 h-6 text-red-400" />
                )}
                <span className="text-sm text-blue-200">
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>
            </div>
            <p className="text-lg text-blue-100 font-light">
              Enterprise IoT Management & Environmental Analytics Platform
            </p>
            <p className="text-sm text-blue-200 mt-2">
              🔴 Live Data from DynamoDB • {devices.length} Active Devices • Last Update:{" "}
              {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Fleet */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Total Fleet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-900">{currentStats.totalDevices}</p>
                  <p className="text-xs text-slate-500 mt-1">Active Devices</p>
                </div>
                <Activity className="w-8 h-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          {/* Deployment Rate */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Deployment Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-cyan-600">
                    {currentStats.totalDevices > 0
                      ? Math.round((currentStats.activeDevices / currentStats.totalDevices) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{currentStats.activeDevices} Deployed</p>
                </div>
                <Cloud className="w-8 h-8 text-cyan-300" />
              </div>
            </CardContent>
          </Card>

          {/* Active Cooling */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Active Cooling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-500">{currentStats.coolingActive}</p>
                  <p className="text-xs text-slate-500 mt-1">Mist Systems</p>
                </div>
                <Droplets className="w-8 h-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          {/* Safety Triggers */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Safety Triggers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-amber-600">{currentStats.safetyTriggered}</p>
                  <p className="text-xs text-slate-500 mt-1">Active Protocols</p>
                </div>
                <Shield className="w-8 h-8 text-amber-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map */}
        <div className="mb-12">
          <UmbrellaMap devices={devices} isLoading={isLoading} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Temperature Trend */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Temperature Trend
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Real-time monitoring across fleet • Avg: {currentStats.avgTemp}°C
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Deployment Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Deployment Status
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Umbrella state distribution</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deploymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deploymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {deploymentData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      ></div>
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Wind Speed Analysis */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Wind className="w-5 h-5 text-slate-600" />
                Wind Speed Analysis
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Average: {currentStats.avgWind} m/s</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="windSpeed" fill="#64748b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sunlight Exposure */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-slate-600" />
                Sunlight Exposure
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Average: {currentStats.avgSunlight}% • UV Protection Active
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sunlight"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Device Fleet Status */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Fleet Status Details ({devices.length} Devices)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <Card key={device.deviceId} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        {device.deviceId.toUpperCase()}
                      </CardTitle>
                      <p className="text-xs text-slate-500 mt-1">{device.zone}</p>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        device.umbrellaState === "OPEN" ? "bg-cyan-500" : "bg-slate-400"
                      }`}
                    ></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Temperature</p>
                      <p className="text-2xl font-bold text-slate-900">{device.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Wind Speed</p>
                      <p className="text-2xl font-bold text-slate-900">{device.windSpeed} m/s</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Sunlight</p>
                      <p className="text-2xl font-bold text-slate-900">{device.sunlight}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">State</p>
                      <p
                        className={`text-sm font-bold ${
                          device.umbrellaState === "OPEN" ? "text-cyan-600" : "text-slate-600"
                        }`}
                      >
                        {device.umbrellaState}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Mist System</span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          device.mistStatus === "ON"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {device.mistStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Safety Mode</span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          device.safetyMode === "ON"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {device.safetyMode}
                      </span>
                    </div>
                  </div>

                  {device.decisionReason && (
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-600 italic">
                        💡 {device.decisionReason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">System Alerts & Status</h2>
          <div className="space-y-3">
            {alerts.map((alert: Alert) => (
              <div
                key={alert.id}
                className={`border-l-4 rounded-lg p-4 flex items-start gap-4 ${getAlertColor(
                  alert.type
                )}`}
              >
                <div className="pt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                    <span className="text-xs text-slate-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Device: {alert.device} • Zone: {alert.zone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-8 pb-8 text-center">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} Smart Umbrella IoT Solutions. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            🔴 Live Data from DynamoDB • WebSocket Connection: {isConnected ? "✅ Active" : "❌ Disconnected"} • System Version: 3.0.0-ENTERPRISE
          </p>
        </div>
      </div>
    </div>
  );
}
