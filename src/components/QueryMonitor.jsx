import { useState, useEffect, useRef } from "react";
import { api } from "../api/client";

const methodColor = {
  GET:    "text-[#00f5ff] bg-[#00f5ff]/10",
  POST:   "text-[#7b2ff7] bg-[#7b2ff7]/10",
  PUT:    "text-yellow-400 bg-yellow-400/10",
  PATCH:  "text-yellow-400 bg-yellow-400/10",
  DELETE: "text-red-400 bg-red-400/10",
};

function highlightSql(sql) {
  const keywords = ["SELECT", "INSERT INTO", "UPDATE", "DELETE FROM", "WHERE", "JOIN", "ORDER BY", "SET", "VALUES", "FROM", "AND", "LIMIT"];
  let highlighted = sql;
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    highlighted = highlighted.replace(regex, `<span class="text-[#ff2d9b] font-semibold">${kw}</span>`);
  });
  return highlighted;
}

export default function QueryMonitor() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [live, setLive] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const pollRef = useRef(null);

  const fetchLogs = () => {
    api.getQueryLogs()
      .then(setLogs)
      .catch(() => {}); // silent fail — this is a dev tool, don't spam errors
  };

  useEffect(() => {
    fetchLogs();
    if (live) {
      pollRef.current = setInterval(fetchLogs, 1500);
    }
    return () => clearInterval(pollRef.current);
  }, [live]);

  const handleClear = async () => {
    try {
      await api.clearQueryLogs();
      setLogs([]);
    } catch {
      // silent
    }
  };

  const errorCount = logs.filter((l) => l.error).length;

  return (
    <div className="fixed bottom-5 right-5 z-[999] font-sans">
      {/* Collapsed pill */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#0d0d3b] border border-[#00f5ff]/30
                     rounded-full shadow-[0_0_20px_#00f5ff30] hover:border-[#00f5ff]/60
                     transition text-white text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse" />
          <span>DB Queries</span>
          <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
            {logs.length}
          </span>
          {errorCount > 0 && (
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
              {errorCount} err
            </span>
          )}
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div
          className={`bg-[#0d0d3b] border border-[#00f5ff]/20 rounded-2xl shadow-2xl
                      w-[420px] flex flex-col overflow-hidden
                      ${minimized ? "h-14" : "h-[480px]"} transition-all duration-200`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#05051a] shrink-0">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${live ? "bg-[#00f5ff] animate-pulse" : "bg-gray-600"}`} />
              <span className="text-white text-sm font-bold">Database Query Monitor</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(!minimized)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition text-sm"
                title={minimized ? "Expand" : "Minimize"}
              >
                {minimized ? "▲" : "▼"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition text-sm"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0a0a2e] shrink-0">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-400">
                    <span className="text-white font-semibold">{logs.length}</span> queries
                  </span>
                  {errorCount > 0 && (
                    <span className="text-red-400">
                      <span className="font-semibold">{errorCount}</span> errors
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLive(!live)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition
                      ${live
                        ? "bg-[#00f5ff]/10 text-[#00f5ff] border border-[#00f5ff]/30"
                        : "bg-white/5 text-gray-400 border border-white/10"}`}
                  >
                    {live ? "● Live" : "○ Paused"}
                  </button>
                  <button
                    onClick={fetchLogs}
                    className="px-2 py-1 rounded-lg text-xs font-medium bg-white/5 text-gray-400
                               border border-white/10 hover:text-white transition"
                  >
                    ↻ Refresh
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-400
                               border border-red-500/20 hover:bg-red-500/20 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Query list */}
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm py-10">
                    <span className="text-3xl mb-2">🗄️</span>
                    <p>No queries yet.</p>
                    <p className="text-xs text-gray-600 mt-1">Interact with the app to see live SQL.</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className={`rounded-xl border p-3 text-xs
                        ${log.error
                          ? "border-red-500/30 bg-red-500/5"
                          : "border-white/5 bg-[#0a0a2e] hover:border-[#00f5ff]/20"} transition`}
                    >
                      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                        <div className="flex items-center gap-2">
                          {log.method && (
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${methodColor[log.method] || "text-gray-400 bg-white/5"}`}>
                              {log.method}
                            </span>
                          )}
                          {log.endpoint && (
                            <span className="text-gray-500 truncate max-w-[180px]">{log.endpoint}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`font-mono ${log.duration > 100 ? "text-yellow-400" : "text-gray-500"}`}>
                            {log.duration}ms
                          </span>
                          <span className="text-gray-600">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>

                      <pre
                        className="font-mono text-[11px] text-gray-300 whitespace-pre-wrap break-all leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: highlightSql(log.sql) }}
                      />

                      {log.params && log.params.length > 0 && (
                        <p className="text-gray-500 mt-1.5 font-mono text-[10px]">
                          params: [{log.params.map((p) => JSON.stringify(p)).join(", ")}]
                        </p>
                      )}

                      {log.error && (
                        <p className="text-red-400 mt-1.5 font-medium">
                          ⚠ {log.error}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}