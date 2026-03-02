import React, { useEffect, useState } from "react";
import { PauseCircle, PhoneCall, Headphones, User } from "lucide-react";
import "../styles//RealTimeDashboard.css";  // import CSS file

const RealTimeDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("http://localhost:8000/real_time_agents/realtime-agents");
        const data = await response.json();
        setAgents(data.agents);
        setTimer(10);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();

    const interval = setInterval(fetchAgents, 10000);
    return () => clearInterval(interval);
  }, []);

  // countdown effect
  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  if (loading) return <p>Loading agents...</p>;


   // define priority order
    const statusOrder = ["PAUSED", "CLOSER", "INCALL"];

    const sortedAgents = [...agents].sort((a, b) => {
      const aIndex = statusOrder.indexOf(a.status);
      const bIndex = statusOrder.indexOf(b.status);

      if (aIndex !== bIndex) {
        return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
      }

      // If both are PAUSED → sort oldest first
      if (a.status === "PAUSED" && b.status === "PAUSED") {
        return new Date(a.last_call_time) - new Date(b.last_call_time);
      }

      return 0;
    });

    const pausedAgents = sortedAgents.filter(a => a.status === "PAUSED");


  // counts
  const loggedIn = agents.length;
  const paused = agents.filter(a => a.status === "PAUSED").length;
  const incall = agents.filter(a => a.status === "INCALL").length;
  const waiting = loggedIn - (paused + incall);

  const getStatusIcon = (status, agent) => {
    if (status === "PAUSED") {
    let bgColor = "rgb(255, 60, 60)"; // light red default

    if (agent.last_call_time) {
      const lastCall = new Date(agent.last_call_time);
      const now = new Date();
      const diffMins = Math.floor((now - lastCall) / 60000);

      if (diffMins < 10) {
        bgColor = "rgb(255, 30, 30)"; // light red
      } else if (diffMins < 30) {
        bgColor = "rgb(255, 0, 0)"; // medium red
      } else {
        bgColor = "rgb(180, 0, 0)"; // dark red
      }
    }

    return (
        <div className="status-circle status-paused"
            style={{ backgroundColor: bgColor }}
            title={`Paused for ${agent.last_call_time ? timeAgo(agent.last_call_time) : "N/A"}`}
        >
          <PauseCircle size={28} />
        </div>
    );
    }
    if (status === "INCALL")
      return (
        <div className="status-circle status-incall">
          <PhoneCall size={28} />
        </div>
      );
    if (status === "CLOSER")
      return (
        <div className="status-circle status-closer">
          <Headphones size={28} />
        </div>
      );
    return (
      <div className="status-circle status-default">
        <User size={28} />
      </div>
    );
  };

  const timeAgo = (lastCallTime) => {
      if (!lastCallTime) return "N/A";

      const lastCall = new Date(lastCallTime);  // assumes backend gives ISO datetime
      const now = new Date();
      const diffMs = now - lastCall;

      if (isNaN(diffMs)) return lastCallTime; // fallback if parsing fails

      const diffMins = Math.floor(diffMs / 60000); // ms → minutes
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min`;
      if (diffHours < 24) return `${diffHours} hr ${diffMins % 60} min`;
      return `${Math.floor(diffHours / 24)} days`;
  };

  const countSkills = (campaigns) => {
      if (!campaigns) return 0;
      return campaigns
        .trim()
        .split(/\s+/) // split on any whitespace
        .filter(Boolean).length;
  };





  return (
    <div className="col-12">
      {/* Top Stats */}
      <div className="flex flex-wrap gap-6 mb-6" style={{display: "flex"}}>
        <div className="stats-box stats-logged">
          <h3>Agents Logged In</h3>
          <p>{loggedIn}</p>
        </div>
        <div className="stats-box stats-incall">
          <h3>Agent In Calls / Dials</h3>
          <p>{incall}</p>
        </div>
        <div className="stats-box stats-waiting">
          <h3>Agents Waiting</h3>
          <p>{waiting}</p>
        </div>
        <div className="stats-box stats-paused">
          <h3>Paused Agents</h3>
          <p>{paused}</p>
        </div>
        <div className="refresh-timer text-gray-400 text-sm">
          Refresh in: <span className="font-bold">{timer}s</span>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="flex flex-wrap gap-6" style={{display: "flex"}}>
        {sortedAgents.map((agent, idx) => (
          <div key={idx} className="agent-card">
            <div className="agent-icon">{getStatusIcon(agent.status, agent)}</div>
            <h3 className="agent-name">{agent.full_name}</h3>
            <div className="agent-meta">
                <p className="agent-id">ID: {agent.user}</p>
                <p><span>{agent.campaign_id}</span></p>
                <p className="skills">Skills: {countSkills(agent.closer_campaigns)}</p>
            </div>
            <div className="agent-details">
              <div className="calls-row">
                  <p>Calls Today: {agent.calls_today}</p>
                  <p>Last Call: {timeAgo(agent.last_call_time)}</p>
              </div>
              <div className="status-row">
                  <p>Status: <span>{agent.status}</span></p>
                  {agent.status === "PAUSED" && (
                      <p>Pause Code: <span>{agent.pause_code}</span></p>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeDashboard;
