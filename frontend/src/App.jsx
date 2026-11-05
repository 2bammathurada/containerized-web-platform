import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = "/api/health/";

function StatusCard({ title, description, status, detail, icon }) {
  const isOnline = status === "online";
  const isChecking = status === "checking";

  return (
    <article className="status-card">
      <div className="card-top">
        <div className="service-icon">{icon}</div>
        <span className={`status-badge ${status}`}>
          <span className="status-dot" />
          {isChecking ? "Checking" : isOnline ? "Online" : "Unavailable"}
        </span>
      </div>

      <h3>{title}</h3>
      <p className="card-description">{description}</p>
      <div className="card-divider" />
      <p className="card-detail">{detail}</p>
    </article>
  );
}

function App() {
  const [backendStatus, setBackendStatus] = useState("checking");
  const [databaseStatus, setDatabaseStatus] = useState("checking");
  const [lastChecked, setLastChecked] = useState(null);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initialCheckTimer = useRef(null);

  const checkHealth = useCallback(async () => {
    setIsRefreshing(true);
    setError("");
    setBackendStatus("checking");
    setDatabaseStatus("checking");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      setBackendStatus(response.ok ? "online" : "offline");
      setDatabaseStatus(
        response.ok && data.database === "connected" ? "online" : "offline",
      );

      if (!response.ok) {
        setError("Backend or database is unavailable.");
      }
    } catch {
      setBackendStatus("offline");
      setDatabaseStatus("offline");
      setError("Unable to connect to the backend service.");
    } finally {
      setLastChecked(new Date());
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    initialCheckTimer.current = setTimeout(() => {
      checkHealth();
    }, 0);

    return () => {
      if (initialCheckTimer.current !== null) {
        clearTimeout(initialCheckTimer.current);
      }
    };
  }, [checkHealth]);

  const allOnline = backendStatus === "online" && databaseStatus === "online";

  return (
    <main className="dashboard">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">C</span>
          <span>Container Platform</span>
        </a>

        <span className="environment-label">
          <span className="environment-dot" />
          Local Environment
        </span>
      </header>

      <section className="page-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">SYSTEM OVERVIEW</p>
            <h1>Infrastructure Dashboard</h1>
            <p className="page-description">
              Monitor the health and availability of your application services.
            </p>
          </div>

          <button
            className="refresh-button"
            type="button"
            onClick={checkHealth}
            disabled={isRefreshing}
          >
            <span
              className={
                isRefreshing ? "refresh-icon spinning" : "refresh-icon"
              }
            >
              ↻
            </span>
            {isRefreshing ? "Checking..." : "Refresh status"}
          </button>
        </div>

        <section className={`overview-banner ${allOnline ? "healthy" : ""}`}>
          <div>
            <p className="overview-label">OVERALL SYSTEM STATUS</p>
            <h2>
              {allOnline
                ? "All systems operational"
                : backendStatus === "checking"
                  ? "Checking system status..."
                  : "Some services need attention"}
            </h2>
            <p>
              {allOnline
                ? "All application services are responding normally."
                : "One or more services are not currently available."}
            </p>
          </div>

          <div className="overview-indicator">
            <span className="overview-indicator-dot" />
            {allOnline ? "Healthy" : "Attention"}
          </div>
        </section>

        <div className="section-heading">
          <div>
            <h2>Services</h2>
            <p>Current status of application components</p>
          </div>
          <span className="service-count">3 SERVICES</span>
        </div>

        <section className="service-grid">
          <StatusCard
            title="React Frontend"
            description="User interface and client application"
            status="online"
            detail="Vite development server"
            icon="UI"
          />

          <StatusCard
            title="Django Backend"
            description="Application logic and REST API"
            status={backendStatus}
            detail="GET /api/health/"
            icon="API"
          />

          <StatusCard
            title="PostgreSQL"
            description="Relational database service"
            status={databaseStatus}
            detail="Database connectivity check"
            icon="DB"
          />
        </section>

        {error && (
          <div className="error-message" role="alert">
            <strong>Connection issue</strong>
            <span>{error}</span>
          </div>
        )}

        <section className="details-panel">
          <div>
            <h2>System information</h2>
            <p>Environment and health check details</p>
          </div>

          <div className="detail-row">
            <span>Application</span>
            <strong>Container Platform</strong>
          </div>

          <div className="detail-row">
            <span>Frontend</span>
            <strong>React + Vite</strong>
          </div>

          <div className="detail-row">
            <span>Backend</span>
            <strong>Django 4.2</strong>
          </div>

          <div className="detail-row">
            <span>Database</span>
            <strong>PostgreSQL 15.2 (target)</strong>
          </div>

          <div className="detail-row">
            <span>Last checked</span>
            <strong>
              {lastChecked
                ? lastChecked.toLocaleTimeString()
                : "Not checked yet"}
            </strong>
          </div>
        </section>

        <footer className="footer">
          <span>Container Platform · Infrastructure Monitoring</span>
          <span>Development Environment</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
