# ☂️ Smart Umbrella Dashboard

**Adaptive Outdoor Shading for Pedestrian Comfort**  
Research-Driven IoT Monitoring Platform

---

## 📌 Overview

Smart Umbrella Dashboard is a cloud-connected monitoring platform built on a research-driven concept for adaptive outdoor shading in hot climates such as Riyadh.

The project addresses a critical urban challenge:  
**extreme heat, direct sunlight, and lack of adaptive pedestrian shading.**

It implements an intelligent system where smart umbrellas respond in real time to environmental conditions and are monitored through a centralized dashboard.

---

## 📖 Table of Contents

- Overview
- Research Motivation
- Proposed Solution
- System Architecture
- Implementation
- Dashboard Features
- Technologies Used
- Why This Project Matters
- Future Improvements
- Authors

---

## 🔬 Research Motivation

Pedestrian comfort in hot urban environments is significantly affected by:

- High temperature
- Direct solar exposure
- Lack of adaptive shading

Traditional solutions (trees, fixed shades) are **static** and cannot:

- track the sun  
- react to sudden rain  
- handle strong wind conditions  

➡️ This creates a gap for **adaptive, sensor-driven shading systems**.

---

## 💡 Proposed Solution

The research proposes a **solar-powered smart umbrella system** that:

- tracks sunlight automatically ☀️  
- activates mist cooling during heat 🌡️  
- opens during rain 🌧️  
- closes under dangerous wind 🌬️  
- continuously reports real-time data 📡  

This repository implements the **cloud monitoring layer** of that system.

---

## 🧠 System Architecture

The system follows a **hybrid Edge–Fog–Cloud architecture**:

### 1️⃣ Edge Layer (Smart Umbrella)

- Sensors: LDR, DHT11/DHT22, rain sensor, anemometer  
- Actuation: motors + mist system  
- Controller: ESP32  
- Power: solar panel + battery  

---

### 2️⃣ Fog Layer (Local Gateway)

- Raspberry Pi  
- local data aggregation  
- offline operation support  

---

### 3️⃣ Cloud Layer

- AWS IoT Core  
- DynamoDB  
- Dashboard monitoring  
- analytics & visualization  

---

## ⚙️ Implementation

This repository includes:

- 🐍 Python IoT simulator (multi-umbrella system)  
- ☁️ AWS IoT Core integration (MQTT)  
- 🗄 DynamoDB telemetry storage  
- 🧠 Node.js + tRPC backend  
- 📊 React dashboard (real-time visualization)  

---

## 🔄 How It Works

1. Simulated umbrella devices generate telemetry  
2. Data is sent to AWS IoT Core  
3. Stored in DynamoDB  
4. Backend retrieves and processes data  
5. Dashboard visualizes system status  

---

## 📊 Dashboard Features

### KPI Cards

- Total Fleet  
- Deployment Rate  
- Active Cooling  
- Safety Triggers  

### Visual Analytics

- Temperature monitoring  
- Deployment status  
- environmental charts  

### Device Monitoring

Each umbrella displays:

- temperature  
- wind speed  
- sunlight level  
- umbrella state  
- mist status  
- safety mode  

### Alerts

- High temperature  
- Strong wind  
- Safety mode activation  
- Normal system status  

---

## 🛠 Technologies Used

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

### Backend
- Node.js
- tRPC
- AWS SDK

### Cloud
- AWS IoT Core
- DynamoDB

### Simulation
- Python
- AWSIoTPythonSDK

---

## 🌍 Why This Project Matters

### Urban Impact
Improves pedestrian comfort and safety in hot cities.

### Technical Value
Demonstrates integration of:
- IoT sensing  
- real-time logic  
- cloud systems  
- live dashboards  

### Research Value
Transforms a research idea into a working system.

### Smart City Vision
Supports:
- centralized monitoring  
- scalability  
- future predictive systems  

---

## 🔗 Research to Implementation Mapping

| Research Concept | Implementation |
|-----------------|---------------|
| Smart umbrella system | Multi-device simulation |
| Environmental sensing | Telemetry generation |
| Decision logic | Python rules |
| Edge–Fog–Cloud | AWS + Dashboard |
| Monitoring | Real-time UI |
| Scalability | Multi-device tracking |

---

## 🚀 Future Improvements

- Real ESP32 hardware deployment  
- Live sensor integration  
- Raspberry Pi fog layer  
- Predictive maintenance  
- Weather API integration  
- Advanced analytics  

---

## 🎯 Project Goal

To demonstrate a **real-world, research-based smart shading system** that combines:

- environmental sensing  
- intelligent decision-making  
- cloud monitoring  

to improve pedestrian comfort and safety.




**Department of Information Technology**  
King Saud University

---

## 📚 Related Research

Adaptive Outdoor Shading for Pedestrian Comfort:  
*An IoT and Microclimate-Sensing Approach*

---

## 📌 Project Status

- Research-driven prototype ✅  
- Dashboard + simulation completed ✅  
- AWS IoT integration working ✅  
- Ready for hardware expansion  
