import{r as l,j as e,H as f,L as x}from"./app-CFrM_OD2.js";const y=({users:t,securityStats:o})=>{const[n,p]=l.useState(""),[m,r]=l.useState(t.data||[]),[a,h]=l.useState(null),[g,d]=l.useState(!1);l.useEffect(()=>{t?.data&&r(t.data)},[t]),l.useEffect(()=>{if(n){const s=t.data.filter(i=>i.name.toLowerCase().includes(n.toLowerCase())||i.email.toLowerCase().includes(n.toLowerCase())||i.last_login_ip?.includes(n.toLowerCase()));r(s)}else r(t.data||[])},[n,t]);const c=s=>s.suspicious_activities>5?{level:"critical",color:"#dc2626",icon:"🚨"}:s.suspicious_activities>2?{level:"high",color:"#f59e0b",icon:"⚠️"}:s.suspicious_activities>0?{level:"medium",color:"#3b82f6",icon:"⚡"}:{level:"safe",color:"#10b981",icon:"✅"},u=s=>{h(s),d(!0)},b=()=>{fetch(route("admin.log-ip"),{method:"POST",headers:{"X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').content,"Content-Type":"application/json"}}).then(s=>{if(!s.ok)throw new Error(`HTTP error! status: ${s.status}`);return s.json()}).then(s=>{s.success?(alert(`IP logged: ${s.ip}`),window.location.reload()):alert("Error: "+s.message)}).catch(s=>{console.error("Error logging IP:",s),alert("Failed to log IP. Please check console for details.")})};return e.jsxs(e.Fragment,{children:[e.jsx(f,{title:"Manage Users - Admin"}),e.jsxs("div",{className:"admin-page",children:[e.jsxs("div",{className:"admin-header",children:[e.jsx("h2",{children:"Manage Users"}),e.jsxs("div",{className:"admin-actions",children:[e.jsx("input",{type:"text",placeholder:"Search users, IPs...",value:n,onChange:s=>p(s.target.value),className:"search-input"}),e.jsxs(x,{href:route("admin.security"),className:"btn btn-security",children:[e.jsx("i",{className:"fas fa-shield-alt"})," Security Monitor"]}),e.jsxs("button",{className:"btn btn-info",onClick:b,children:[e.jsx("i",{className:"fas fa-map-marker-alt"})," Log Current IP"]}),e.jsxs(x,{href:route("admin.users",{},!1),className:"btn btn-primary",children:[e.jsx("i",{className:"fas fa-refresh"})," Refresh"]})]})]}),e.jsxs("div",{className:"security-overview",children:[e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon security",children:e.jsx("i",{className:"fas fa-shield-alt"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("h3",{children:o?.totalSecurityLogs||0}),e.jsx("p",{children:"Total Security Logs"})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon high-risk",children:e.jsx("i",{className:"fas fa-exclamation-triangle"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("h3",{children:o?.highSeverityLogs||0}),e.jsx("p",{children:"High Severity Alerts"})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon critical",children:e.jsx("i",{className:"fas fa-bomb"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("h3",{children:o?.criticalSeverityLogs||0}),e.jsx("p",{children:"Critical Alerts"})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon today",children:e.jsx("i",{className:"fas fa-calendar-day"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("h3",{children:o?.todayLogs||0}),e.jsx("p",{children:"Today's Activities"})]})]})]}),e.jsxs("div",{className:"users-table-container",children:[e.jsxs("table",{className:"admin-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ID"}),e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"Role"}),e.jsx("th",{children:"Wallet"}),e.jsx("th",{children:"IP Address"}),e.jsx("th",{children:"Security"}),e.jsx("th",{children:"Last Login"}),e.jsx("th",{children:"Actions"})]})}),e.jsx("tbody",{children:m.map(s=>{const i=c(s);return e.jsxs("tr",{className:i.level!=="safe"?"suspicious-row":"",children:[e.jsx("td",{children:s.id}),e.jsx("td",{children:e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",children:s.name}),s.suspicious_activities>0&&e.jsx("span",{className:"suspicious-badge",title:`${s.suspicious_activities} suspicious activities`,children:"⚠️"})]})}),e.jsx("td",{children:s.email}),e.jsx("td",{children:e.jsx("span",{className:s.isAdmin?"role-badge admin":"role-badge user",children:s.isAdmin?"Admin":"User"})}),e.jsx("td",{children:e.jsxs("div",{className:"wallet-info",children:[e.jsxs("span",{className:"wallet-amount",children:["₦",s.walletAmount?.toLocaleString()||0]}),s.walletAmount>5e4&&e.jsx("span",{className:"high-wallet",title:"High wallet balance",children:"💰"})]})}),e.jsx("td",{children:e.jsxs("div",{className:"ip-info",children:[e.jsx("span",{className:"ip-address",children:s.last_login_ip||"Unknown"}),s.last_login_ip&&e.jsx("button",{className:"btn-locate",onClick:()=>window.open(`https://www.ipinfo.io/${s.last_login_ip}`,"_blank"),title:"Locate IP",children:"📍"})]})}),e.jsx("td",{children:e.jsxs("div",{className:"security-indicator",children:[e.jsxs("span",{className:"security-badge",style:{backgroundColor:i.color},title:`Security Level: ${i.level}`,children:[i.icon," ",i.level.toUpperCase()]}),e.jsxs("div",{className:"security-count",children:[s.suspicious_activities," alerts"]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"login-info",children:[e.jsx("span",{children:s.last_login_at?new Date(s.last_login_at).toLocaleDateString():"Never"}),s.last_login_at&&e.jsx("span",{className:"login-time",children:new Date(s.last_login_at).toLocaleTimeString()})]})}),e.jsx("td",{children:e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{className:"btn btn-sm btn-security",onClick:()=>u(s),title:"View Security Details",children:e.jsx("i",{className:"fas fa-shield-alt"})}),e.jsx("button",{className:"btn btn-sm btn-secondary",title:"Edit User",children:e.jsx("i",{className:"fas fa-edit"})}),e.jsx("button",{className:"btn btn-sm btn-danger",title:"Delete User",children:e.jsx("i",{className:"fas fa-trash"})})]})})]},s.id)})})]}),t?.links&&e.jsx("div",{className:"pagination",children:t.links.map((s,i)=>e.jsx(x,{href:s.url||"#",className:s.active?"pagination-link active":"pagination-link",dangerouslySetInnerHTML:{__html:s.label}},i))})]}),g&&a&&e.jsx("div",{className:"modal-overlay",onClick:()=>d(!1),children:e.jsxs("div",{className:"modal-content security-modal",onClick:s=>s.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsxs("h3",{children:["Security Details - ",a.name]}),e.jsx("button",{className:"modal-close",onClick:()=>d(!1),children:"×"})]}),e.jsxs("div",{className:"modal-body",children:[e.jsxs("div",{className:"security-summary",children:[e.jsxs("div",{className:"summary-item",children:[e.jsx("label",{children:"Security Level:"}),e.jsxs("span",{className:`security-level ${c(a).level}`,children:[c(a).icon," ",c(a).level.toUpperCase()]})]}),e.jsxs("div",{className:"summary-item",children:[e.jsx("label",{children:"Suspicious Activities:"}),e.jsx("span",{className:"alert-count",children:a.suspicious_activities})]}),e.jsxs("div",{className:"summary-item",children:[e.jsx("label",{children:"Last Login IP:"}),e.jsx("span",{className:"ip-address",children:a.last_login_ip||"Unknown"})]}),e.jsxs("div",{className:"summary-item",children:[e.jsx("label",{children:"Wallet Balance:"}),e.jsxs("span",{className:"wallet-balance",children:["₦",a.walletAmount?.toLocaleString()||0]})]})]}),e.jsxs("div",{className:"recent-logs",children:[e.jsx("h4",{children:"Recent Security Logs"}),a.recent_security_logs&&a.recent_security_logs.length>0?e.jsx("div",{className:"logs-list",children:a.recent_security_logs.map(s=>e.jsxs("div",{className:"log-item",children:[e.jsxs("div",{className:"log-header",children:[e.jsx("span",{className:"log-type",children:s.activity_type||"General Activity"}),e.jsx("span",{className:"log-time",children:new Date(s.created_at).toLocaleString()})]}),e.jsxs("div",{className:"log-details",children:[e.jsxs("span",{className:"log-ip",children:["IP: ",s.ip_address]}),e.jsx("span",{className:"log-severity",style:{color:getSeverityColor(s.severity)},children:s.severity?.toUpperCase()})]}),s.location&&e.jsxs("div",{className:"log-location",children:["📍 ",s.location.city,", ",s.location.country]})]},s.id))}):e.jsx("p",{className:"no-logs",children:"No recent security logs found"})]}),e.jsxs("div",{className:"security-actions",children:[e.jsxs("button",{className:"btn btn-danger",children:[e.jsx("i",{className:"fas fa-ban"})," Block User"]}),e.jsxs("button",{className:"btn btn-warning",children:[e.jsx("i",{className:"fas fa-exclamation-triangle"})," Flag for Review"]}),e.jsxs("button",{className:"btn btn-secondary",children:[e.jsx("i",{className:"fas fa-envelope"})," Send Warning"]})]})]})]})})]}),e.jsx("style",{children:`
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

                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    text-decoration: none;
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }

                .btn-primary {
                    background: #10b981;
                }

                .btn-security {
                    background: #3b82f6;
                }

                .btn-info {
                    background: #0ea5e9;
                }

                .btn-warning {
                    background: #f59e0b;
                }

                .btn-danger {
                    background: #dc2626;
                }

                .btn-secondary {
                    background: #6b7280;
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

                .security-overview {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                }

                .stat-icon.security { background: #3b82f6; }
                .stat-icon.high-risk { background: #f59e0b; }
                .stat-icon.critical { background: #dc2626; }
                .stat-icon.today { background: #10b981; }

                .stat-content h3 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .stat-content p {
                    margin: 5px 0 0 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .users-table-container {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .admin-table th {
                    background: #f8fafc;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 2px solid #e5e7eb;
                }

                .admin-table td {
                    padding: 12px;
                    border-bottom: 1px solid #f3f4f6;
                }

                .admin-table tr:hover {
                    background: #f9fafb;
                }

                .suspicious-row {
                    background: #fef2f2 !important;
                }

                .suspicious-row:hover {
                    background: #fecaca !important;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .suspicious-badge {
                    background: #f59e0b;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 10px;
                }

                .wallet-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .wallet-amount {
                    font-weight: 600;
                    color: #10b981;
                }

                .high-wallet {
                    font-size: 16px;
                }

                .ip-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .ip-address {
                    font-family: monospace;
                    font-size: 12px;
                    color: #6b7280;
                }

                .btn-locate {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 12px;
                }

                .security-indicator {
                    text-align: center;
                }

                .security-badge {
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                    display: inline-block;
                    margin-bottom: 4px;
                }

                .security-count {
                    font-size: 11px;
                    color: #6b7280;
                }

                .login-info {
                    display: flex;
                    flex-direction: column;
                }

                .login-time {
                    font-size: 11px;
                    color: #6b7280;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .btn-sm {
                    padding: 6px 12px;
                    font-size: 12px;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                }

                .modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
                    margin: 20px;
                }

                .security-modal {
                    max-width: 800px;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                }

                .modal-body {
                    padding: 20px;
                }

                .security-summary {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin-bottom: 30px;
                }

                .summary-item {
                    display: flex;
                    flex-direction: column;
                }

                .summary-item label {
                    font-weight: 600;
                    color: #6b7280;
                    margin-bottom: 5px;
                }

                .security-level {
                    padding: 6px 12px;
                    border-radius: 15px;
                    color: white;
                    font-weight: 600;
                    text-align: center;
                }

                .security-level.safe { background: #10b981; }
                .security-level.medium { background: #3b82f6; }
                .security-level.high { background: #f59e0b; }
                .security-level.critical { background: #dc2626; }

                .alert-count {
                    font-size: 18px;
                    font-weight: 700;
                    color: #f59e0b;
                }

                .wallet-balance {
                    font-size: 18px;
                    font-weight: 700;
                    color: #10b981;
                }

                .recent-logs h4 {
                    margin-bottom: 15px;
                    color: #1f2937;
                }

                .logs-list {
                    max-height: 300px;
                    overflow-y: auto;
                }

                .log-item {
                    background: #f8fafc;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 10px;
                }

                .log-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .log-type {
                    font-weight: 600;
                    color: #1f2937;
                }

                .log-time {
                    font-size: 12px;
                    color: #6b7280;
                }

                .log-details {
                    display: flex;
                    gap: 15px;
                    font-size: 14px;
                    color: #6b7280;
                    margin-bottom: 8px;
                }

                .log-location {
                    font-size: 12px;
                    color: #6b7280;
                }

                .no-logs {
                    text-align: center;
                    color: #6b7280;
                    padding: 20px;
                }

                .security-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                    justify-content: center;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                }

                .pagination-link {
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    text-decoration: none;
                    color: #374151;
                }

                .pagination-link.active {
                    background: #10b981;
                    color: white;
                }

                .pagination-link:hover {
                    background: #f3f4f6;
                }

                @media (max-width: 768px) {
                    .security-overview {
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    }
                    
                    .security-summary {
                        grid-template-columns: 1fr;
                    }
                    
                    .security-actions {
                        flex-direction: column;
                    }
                }
            `})]})};export{y as default};
