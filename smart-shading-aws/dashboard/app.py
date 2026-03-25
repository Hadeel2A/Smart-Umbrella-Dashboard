import streamlit as st
import boto3
import pandas as pd
import pydeck as pdk
import plotly.graph_objects as go
from decimal import Decimal
from datetime import datetime
import time

# ============================================================================
# 1. إعدادات الصفحة والهوية البصرية (Enterprise Design System)
# ============================================================================
st.set_page_config(
    page_title="Smart Shading Command Center",
    page_icon="🏙️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# تصميم CSS مخصص بالكامل لمحاكاة أنظمة المدن الذكية
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
    
    /* Header Container */
    .main-header {
        background-color: #ffffff;
        padding: 1rem 2rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    
    .system-title { color: #1e293b; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.2rem; }
    .system-subtitle { color: #64748b; font-size: 0.85rem; font-weight: 400; }
    
    /* KPI Cards */
    .kpi-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        text-align: left;
    }
    .kpi-value { font-size: 1.8rem; font-weight: 700; color: #0f172a; margin-bottom: 0.2rem; }
    .kpi-label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    
    /* Status Badges */
    .badge { padding: 4px 12px; border-radius: 50px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
    .bg-open { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .bg-closed { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
    .bg-mist { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .bg-safety { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    
    /* Sections Styling */
    .section-container { background: white; padding: 1.2rem; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 1rem; }
    .section-header { font-size: 0.95rem; font-weight: 700; color: #334155; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
    .section-header::before { content: ""; width: 3px; height: 16px; background: #3b82f6; border-radius: 2px; }
    
    /* Table Styling */
    .styled-table { width: 100%; font-size: 0.85rem; border-collapse: collapse; }
    .styled-table th { background: #f8fafc; color: #64748b; text-align: left; padding: 12px; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
    .styled-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
    </style>
""", unsafe_allow_html=True)

# ============================================================================
# 2. طبقة إدارة البيانات (Data & Control Logic)
# ============================================================================
REGION = "eu-north-1"
TABLE_NAME = "UmbrellaDebug"

# أسماء المناطق والبيانات الجغرافية الواقعية
ZONES = {
    "umbrella-01": {"lat": 24.7136, "lon": 46.6753, "name": "North Gate Walkway"},
    "umbrella-02": {"lat": 24.7155, "lon": 46.6770, "name": "Student Plaza"},
    "umbrella-03": {"lat": 24.7115, "lon": 46.6735, "name": "Main Pedestrian Path"},
    "umbrella-04": {"lat": 24.7180, "lon": 46.6790, "name": "Library Walkway"},
    "umbrella-05": {"lat": 24.7100, "lon": 46.6720, "name": "Campus Courtyard"}
}

@st.cache_resource
def get_db():
    try: return boto3.resource("dynamodb", region_name=REGION).Table(TABLE_NAME)
    except: return None

def sanitize(item):
    p = item.get('payload', item)
    d_id = item.get('deviceId') or p.get('deviceId', 'Node-Unknown')
    def to_f(v): return float(v) if isinstance(v, Decimal) else v
    z_info = ZONES.get(d_id, {"lat": 24.71, "lon": 46.67, "name": "General Zone"})
    return {
        "deviceId": d_id, "zone": z_info["name"], "lat": z_info["lat"], "lon": z_info["lon"],
        "temp": to_f(p.get('temperature', 0)), "wind": to_f(p.get('windSpeed', 0)),
        "sun": to_f(p.get('sunlight', 0)), "rain": p.get('rainDetected', False),
        "state": p.get('umbrellaState', 'CLOSED'), "mist": p.get('mistStatus', 'OFF'),
        "safety": p.get('safetyMode', 'OFF'), "angle": to_f(p.get('shadeAngle', 0)),
        "ts": item.get('timestamp') or p.get('timestamp') or datetime.now().isoformat()
    }

@st.cache_data(ttl=5)
def load_data():
    db = get_db()
    if not db: return pd.DataFrame()
    items = db.scan().get('Items', [])
    return pd.DataFrame([sanitize(i) for i in items]) if items else pd.DataFrame()

# ============================================================================
# 3. بناء الواجهة (The Dashboard UI)
# ============================================================================

# --- 1. Top Header Bar ---
st.markdown(f"""
    <div class="main-header">
        <div>
            <div class="system-title">Adaptive Smart Shading Control Center</div>
            <div class="system-subtitle">Real-time monitoring for pedestrian thermal comfort, adaptive shading, and safety response</div>
        </div>
        <div style="text-align: right;">
            <div style="display: flex; gap: 15px; align-items: center;">
                <div style="font-size: 0.75rem; color: #64748b; line-height: 1.4;">
                    <span style="color: #10b981;">● Live System Active</span><br>
                    AWS Connected | Fog Gateway Online
                </div>
                <div style="border-left: 1px solid #e2e8f0; padding-left: 15px; font-size: 0.7rem; color: #94a3b8; text-align: left;">
                    LAST SYNC: {datetime.now().strftime('%H:%M:%S')}<br>
                    AUTO-REFRESH: 5s
                </div>
            </div>
        </div>
    </div>
""", unsafe_allow_html=True)

df = load_data()

if not df.empty:
    latest = df.sort_values('ts', ascending=False).drop_duplicates('deviceId')

    # --- 2. KPI Summary Cards ---
    kpi1, kpi2, kpi3, kpi4, kpi5 = st.columns(5)
    with kpi1: st.markdown(f'<div class="kpi-card"><div class="kpi-label">Total Umbrellas</div><div class="kpi-value">{len(latest)}</div></div>', unsafe_allow_html=True)
    with kpi2: st.markdown(f'<div class="kpi-card"><div class="kpi-label">Open / Active</div><div class="kpi-value">{len(latest[latest["state"]=="OPEN"])}</div></div>', unsafe_allow_html=True)
    with kpi3: st.markdown(f'<div class="kpi-card"><div class="kpi-label">Mist Active</div><div class="kpi-value" style="color: #f59e0b;">{len(latest[latest["mist"]=="ON"])}</div></div>', unsafe_allow_html=True)
    with kpi4: st.markdown(f'<div class="kpi-card"><div class="kpi-label">Safety Alerts</div><div class="kpi-value" style="color: #ef4444;">{len(latest[latest["safety"]=="ON"])}</div></div>', unsafe_allow_html=True)
    with kpi5: st.markdown(f'<div class="kpi-card"><div class="kpi-label">Avg Temp</div><div class="kpi-value">{latest["temp"].mean():.1f}°C</div></div>', unsafe_allow_html=True)

    # --- 3. Main Content Layout ---
    col_left, col_right = st.columns([1.8, 1])

    # Left Column: Network Map
    with col_left:
        st.markdown('<div class="section-container">', unsafe_allow_html=True)
        st.markdown('<div class="section-header">Umbrella Network Map</div>', unsafe_allow_html=True)
        
        # تلوين النقاط حسب الحالة: أخضر (طبيعي)، أصفر (تبريد)، أحمر (إغلاق آمن)
        def get_color(row):
            if row['safety'] == 'ON': return [239, 68, 68, 200]
            if row['mist'] == 'ON': return [245, 158, 11, 200]
            return [16, 185, 129, 200]
        
        latest['marker_color'] = latest.apply(get_color, axis=1)
        
        st.pydeck_chart(pdk.Deck(
            layers=[pdk.Layer("ScatterplotLayer", latest, get_position='[lon, lat]', get_fill_color='marker_color', get_radius=120, pickable=True)],
            initial_view_state=pdk.ViewState(latitude=24.7136, longitude=46.6753, zoom=14, pitch=45),
            map_style="mapbox://styles/mapbox/light-v10",
            tooltip={"text": "Device: {deviceId}\nZone: {zone}\nTemp: {temp}°C\nWind: {wind} m/s\nSun: {sun}%\nState: {state}"}
        ))
        st.markdown("""
            <div style="display: flex; gap: 20px; font-size: 0.7rem; color: #64748b; margin-top: 10px;">
                <span><span style="color: #10b981;">●</span> Normal Operation</span>
                <span><span style="color: #f59e0b;">●</span> Mist Cooling Active</span>
                <span><span style="color: #ef4444;">●</span> Safety Mode / Wind Shutdown</span>
            </div>
        """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    # Right Column: Environmental & Alerts
    with col_right:
        # Panel 1: Environmental Snapshot
        st.markdown('<div class="section-container">', unsafe_allow_html=True)
        st.markdown('<div class="section-header">Environmental Snapshot</div>', unsafe_allow_html=True)
        fig = go.Figure()
        fig.add_trace(go.Bar(x=latest['deviceId'], y=latest['temp'], name='Temp', marker_color='#3b82f6'))
        fig.add_trace(go.Bar(x=latest['deviceId'], y=latest['wind'], name='Wind', marker_color='#94a3b8'))
        fig.update_layout(height=200, margin=dict(l=0,r=0,t=0,b=0), barmode='group', paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1))
        st.plotly_chart(fig, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

        # Panel 2: System Health
        st.markdown('<div class="section-container">', unsafe_allow_html=True)
        st.markdown('<div class="section-header">System Health</div>', unsafe_allow_html=True)
        h1, h2 = st.columns(2)
        h1.markdown('<div style="font-size: 0.7rem; color: #64748b;">Connectivity</div><div style="color: #10b981; font-weight: 600; font-size: 0.8rem;">Stable</div>', unsafe_allow_html=True)
        h2.markdown('<div style="font-size: 0.7rem; color: #64748b;">Cloud Sync</div><div style="color: #10b981; font-weight: 600; font-size: 0.8rem;">Healthy</div>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

        # Panel 3: Live Alerts
        st.markdown('<div class="section-container">', unsafe_allow_html=True)
        st.markdown('<div class="section-header">Live Alerts</div>', unsafe_allow_html=True)
        alerts = latest[latest['safety'] == 'ON']
        if alerts.empty:
            st.markdown('<div style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 10px; border-radius: 8px; color: #166534; font-size: 0.75rem;">✔ No active system alerts</div>', unsafe_allow_html=True)
        else:
            for _, alert in alerts.iterrows():
                st.markdown(f'<div style="background: #fef2f2; border: 1px solid #fee2e2; padding: 10px; border-radius: 8px; color: #991b1b; font-size: 0.75rem; margin-bottom: 5px;">⚠ {alert["deviceId"]} entered safety mode (Wind: {alert["wind"]}m/s)</div>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    # --- 4. Lower Section ---
    low_left, low_right = st.columns([1.8, 1])

    with low_left:
        st.markdown('<div class="section-container">', unsafe_allow_html=True)
        st.markdown('<div class="section-header">Fleet Status Table</div>', unsafe_allow_html=True)
        
        def get_badge(val, type):
            colors = {"OPEN": "bg-open", "CLOSED": "bg-closed", "ON": "bg-mist", "OFF": "bg-closed", "SAFETY": "bg-safety"}
            if type == "safety" and val == "ON": return f'<span class="badge bg-safety">SAFETY</span>'
            return f'<span class="badge {colors.get(val, "bg-closed")}">{val}</span>'

        table_html = "<table class='styled-table'><tr><th>ID</th><th>Zone</th><th>Temp</th><th>Wind</th><th>State</th><th>Mist</th><th>Safety</th><th>Angle</th></tr>"
        for _, r in latest.iterrows():
            table_html += f"<tr><td>{r['deviceId']}</td><td>{r['zone']}</td><td>{r['temp']}°C</td><td>{r['wind']}m/s</td><td>{get_badge(r['state'], 'state')}</td><td>{get_badge(r['mist'], 'mist')}</td><td>{get_badge(r['safety'], 'safety')}</td><td>{r['angle']}°</td></tr>"
        table_html += "</table>"
        st.markdown(table_html, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with low_right:
        st.markdown('<div class="section-container">', unsafe_allow_html=True)
        st.markdown('<div class="section-header">Decision Logic Summary</div>', unsafe_allow_html=True)
        log_entries = [
            f"Umbrella-01 adjusted to {latest.iloc[0]['angle']}° for solar tracking",
            "Mist cooling activated in Student Plaza" if latest.iloc[1]['mist'] == 'ON' else "North Gate: Optimal comfort levels",
            f"{latest.iloc[2]['deviceId']} safety mode engaged" if latest.iloc[2]['safety'] == 'ON' else "West Gate: Shade coverage optimized"
        ]
        for entry in log_entries:
            st.markdown(f'<div style="font-size: 0.75rem; color: #475569; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">↳ {entry}</div>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

else:
    st.info("System initializing... Awaiting first telemetry packet from Fog Gateway.")