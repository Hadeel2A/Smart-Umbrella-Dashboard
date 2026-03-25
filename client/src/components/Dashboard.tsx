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
  TrendingUp,
  Gauge,
} from "lucide-react";

/**
 * Dashboard Component
 * Reusable dashboard card components for Smart Umbrella system
 * Provides modular, composable UI elements for monitoring
 */

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color?: "blue" | "cyan" | "amber" | "green";
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  color = "blue",
}: MetricCardProps) {
  const colorClasses = {
    blue: "text-blue-600",
    cyan: "text-cyan-600",
    amber: "text-amber-600",
    green: "text-green-600",
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-slate-900">{value}</p>
              {unit && <span className="text-sm text-slate-500">{unit}</span>}
            </div>
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp
                  className={`w-4 h-4 ${
                    trend === "up"
                      ? "text-green-600"
                      : trend === "down"
                        ? "text-red-600"
                        : "text-slate-400"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    trend === "up"
                      ? "text-green-600"
                      : trend === "down"
                        ? "text-red-600"
                        : "text-slate-500"
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={`${colorClasses[color]} opacity-80`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatusBadgeProps {
  status: "active" | "inactive" | "warning" | "critical";
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusClasses = {
    active: "bg-green-100 text-green-700 border-green-300",
    inactive: "bg-slate-100 text-slate-700 border-slate-300",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
    critical: "bg-red-100 text-red-700 border-red-300",
  };

  const dotClasses = {
    active: "bg-green-500",
    inactive: "bg-slate-400",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${statusClasses[status]}`}
    >
      <span className={`w-2 h-2 rounded-full animate-pulse ${dotClasses[status]}`}></span>
      {label}
    </span>
  );
}

interface AlertCardProps {
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  device: string;
  timestamp: string;
  onDismiss?: () => void;
}

export function AlertCard({ type, title, message, device, timestamp, onDismiss }: AlertCardProps) {
  const alertClasses = {
    critical: "border-l-red-500 bg-red-50",
    warning: "border-l-yellow-500 bg-yellow-50",
    info: "border-l-green-500 bg-green-50",
  };

  const iconClasses = {
    critical: "text-red-600",
    warning: "text-yellow-600",
    info: "text-green-600",
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 flex items-start gap-4 ${alertClasses[type]}`}>
      <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClasses[type]}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <span className="text-xs text-slate-500 whitespace-nowrap">{timestamp}</span>
        </div>
        <p className="text-sm text-slate-700 mb-2">{message}</p>
        <p className="text-xs text-slate-500">Device: {device}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 flex-shrink-0 mt-0.5"
        >
          ✕
        </button>
      )}
    </div>
  );
}

interface DeviceCardProps {
  deviceId: string;
  temperature: number;
  windSpeed: number;
  sunlight: number;
  state: "OPEN" | "CLOSED";
  mistStatus: "ON" | "OFF";
  safetyMode: "ON" | "OFF";
}

export function DeviceCard({
  deviceId,
  temperature,
  windSpeed,
  sunlight,
  state,
  mistStatus,
  safetyMode,
}: DeviceCardProps) {
  const isDeployed = state === "OPEN";
  const isCritical = temperature > 38 || windSpeed > 15;

  return (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
        isCritical ? "border-l-4 border-l-red-500" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900">
            {deviceId.toUpperCase()}
          </CardTitle>
          <div
            className={`w-3 h-3 rounded-full animate-pulse ${
              isDeployed ? "bg-cyan-500" : "bg-slate-400"
            }`}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Temperature</p>
            <p className={`text-2xl font-bold ${temperature > 38 ? "text-red-600" : "text-slate-900"}`}>
              {temperature}°C
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Wind Speed</p>
            <p className={`text-2xl font-bold ${windSpeed > 15 ? "text-red-600" : "text-slate-900"}`}>
              {windSpeed} m/s
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Sunlight</p>
            <p className="text-2xl font-bold text-slate-900">{sunlight}%</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">State</p>
            <p
              className={`text-sm font-bold ${
                isDeployed ? "text-cyan-600" : "text-slate-600"
              }`}
            >
              {state}
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Mist System</span>
            <StatusBadge
              status={mistStatus === "ON" ? "active" : "inactive"}
              label={mistStatus}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 font-medium">Safety Mode</span>
            <StatusBadge
              status={safetyMode === "ON" ? "warning" : "inactive"}
              label={safetyMode}
            />
          </div>
        </div>

        {/* Critical Alert Indicator */}
        {isCritical && (
          <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 rounded p-2 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium">
              {temperature > 38 ? "High temperature" : "Excessive wind"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function ChartCard({ title, subtitle, children, icon }: ChartCardProps) {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

export function SectionHeader({ title, icon, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
        {icon}
        {title}
      </h2>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
