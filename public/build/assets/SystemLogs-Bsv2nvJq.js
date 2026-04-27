import{r as d,j as e,H as g}from"./app-BFN8PMyn.js";const b=({logs:s})=>{const[r,i]=d.useState(""),[l,o]=d.useState(s||[]);d.useState(()=>{s&&o(s)},[s]),d.useState(()=>{if(r){const a=s.filter(t=>t.toLowerCase().includes(r.toLowerCase()));o(a)}else o(s||[])},[r,s]);const c=a=>a.includes("ERROR")?"error":a.includes("WARNING")?"warning":(a.includes("INFO"),"info"),p=(a,t)=>{const n=c(a),x=a.match(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/)?.[1]||"",h=a.replace(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] .*?:? (.*)/,"$1")||a;return e.jsxs("tr",{className:`log-row ${n}`,children:[e.jsx("td",{className:"log-timestamp",children:x}),e.jsx("td",{className:"log-level",children:e.jsx("span",{className:`level-badge ${n}`,children:n.toUpperCase()})}),e.jsx("td",{className:"log-message",children:h})]},t)};return e.jsxs(e.Fragment,{children:[e.jsx(g,{title:"System Logs - Admin"}),e.jsxs("div",{className:"admin-page",children:[e.jsxs("div",{className:"admin-header",children:[e.jsx("h2",{children:"System Logs"}),e.jsxs("div",{className:"admin-actions",children:[e.jsx("input",{type:"text",placeholder:"Search logs...",value:r,onChange:a=>i(a.target.value),className:"search-input"}),e.jsxs("button",{className:"btn btn-secondary",children:[e.jsx("i",{className:"fas fa-download"}),"Download Logs"]})]})]}),e.jsx("div",{className:"logs-container",children:e.jsxs("table",{className:"logs-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Timestamp"}),e.jsx("th",{children:"Level"}),e.jsx("th",{children:"Message"})]})}),e.jsx("tbody",{children:l.map((a,t)=>p(a,t))})]})})]}),e.jsx("style",{jsx:!0,children:`
                .admin-page {
                    padding: 20px;
                }

                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .admin-header h2 {
                    margin: 0;
                    color: #1f2937;
                }

                .admin-actions {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }

                .search-input {
                    padding: 10px 15px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    width: 300px;
                }

                .search-input:focus {
                    border-color: #10b981;
                    outline: none;
                }

                .logs-container {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .logs-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                }

                .logs-table th {
                    background: #f8fafc;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 2px solid #e5e7eb;
                }

                .logs-table td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #f3f4f6;
                    vertical-align: top;
                    line-height: 1.4;
                }

                .log-row:hover {
                    background: #f9fafb;
                }

                .log-timestamp {
                    color: #6b7280;
                    font-weight: 500;
                    white-space: nowrap;
                    width: 150px;
                }

                .log-level {
                    width: 80px;
                    text-align: center;
                }

                .level-badge {
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .level-badge.error {
                    background: #dc2626;
                    color: white;
                }

                .level-badge.warning {
                    background: #f59e0b;
                    color: white;
                }

                .level-badge.info {
                    background: #10b981;
                    color: white;
                }

                .log-message {
                    font-family: 'Courier New', monospace;
                    word-break: break-word;
                }
            `})]})};export{b as default};
