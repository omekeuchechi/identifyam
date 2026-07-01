import{r as o,j as e,H as w,L as s,a as k}from"./app-CjlnaK9E.js";const _=({auth:h,users:r,securityStats:c})=>{const[l,f]=o.useState(""),[g,p]=o.useState(r.data||[]),[t,b]=o.useState(null),[u,m]=o.useState(!1),[x,i]=o.useState(!1);o.useEffect(()=>{r?.data&&p(r.data)},[r]),o.useEffect(()=>{if(l){const a=r.data.filter(n=>n.name.toLowerCase().includes(l.toLowerCase())||n.email.toLowerCase().includes(l.toLowerCase())||n.last_login_ip?.includes(l.toLowerCase()));p(a)}else p(r.data||[])},[l,r]);const d=a=>a.suspicious_activities>5?{level:"critical",color:"#dc2626",icon:"🚨"}:a.suspicious_activities>2?{level:"high",color:"#f59e0b",icon:"⚠️"}:a.suspicious_activities>0?{level:"medium",color:"#3b82f6",icon:"⚡"}:{level:"safe",color:"#10b981",icon:"✅"},j=a=>{switch(a?.toLowerCase()){case"critical":return"#dc2626";case"high":return"#f59e0b";case"medium":return"#3b82f6";default:return"#10b981"}},y=a=>{b(a),m(!0)},N=a=>{a.preventDefault(),confirm("Are you sure you want to logout?")&&k.post(route("logout"))},v=()=>{fetch(route("admin.log-ip"),{method:"POST",headers:{"X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').content,"Content-Type":"application/json"}}).then(a=>{if(!a.ok)throw new Error(`HTTP error! status: ${a.status}`);return a.json()}).then(a=>{a.success?(alert(`IP logged: ${a.ip}`),window.location.reload()):alert("Error: "+a.message)}).catch(a=>{console.error("Error logging IP:",a),alert("Failed to log IP. Please check console for details.")})};return e.jsxs(e.Fragment,{children:[e.jsx(w,{title:"Manage Users - Admin"}),e.jsxs("div",{className:"dashboard-layout",children:[x&&e.jsx("div",{className:"sidebar-overlay",onClick:()=>i(!1)}),e.jsxs("aside",{className:`sidebar ${x?"open":""}`,children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[e.jsx("div",{className:"logo-image"}),e.jsx("span",{children:"IDENTIFYAM"})]}),e.jsx("button",{className:"sidebar-close-btn",onClick:()=>i(!1),"aria-label":"Close sidebar",children:e.jsx("i",{className:"fas fa-times"})})]}),e.jsxs("nav",{className:"sidebar-menu",children:[e.jsxs(s,{href:route("admin.dashboard"),className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-tachometer-alt"}),"Dashboard"]}),e.jsxs(s,{href:"lagacy-nin",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-history"})," Lagacy NIN"]}),e.jsxs(s,{href:route("exam.cards"),className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),e.jsxs(s,{href:"/admin/users",className:"sidebar-link active",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-credit-card"})," Manage Users"]}),e.jsxs(s,{href:"/admin/nin-requests",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-search"})," NIN Requests"]}),e.jsxs(s,{href:"/admin/send-email",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-envelope"})," Send Email"]}),e.jsxs(s,{href:"history",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-history"}),"History"]}),e.jsxs(s,{href:"profile",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-user-edit"}),"Profile Edit"]}),e.jsxs(s,{href:route("admin.nin-profit"),className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-chart-line"})," NIN Profit"]}),e.jsxs(s,{href:route("admin.exam-profit"),className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-chart-pie"})," Exam Profit"]}),e.jsxs("button",{onClick:N,style:{padding:"15px 20px",backgroundColor:"red",color:"#fff",fontSize:"15px",border:"none",borderRadius:"20px",cursor:"pointer",marginTop:"15px"},children:[e.jsx("i",{className:"fas fa-sign-out"})," Logout"]})]})]}),e.jsxs("div",{className:"dashboard-main",children:[e.jsxs("header",{className:"topbar",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx("button",{className:"sidebar-toggle-btn",onClick:()=>i(!0),"aria-label":"Toggle sidebar",children:e.jsx("i",{className:"fas fa-bars"})}),e.jsx("h3",{children:"Manage Users"})]}),e.jsx("div",{className:"topbar-right",children:e.jsx("div",{className:"user-profile",children:e.jsx("span",{children:h?.user?.name})})})]}),e.jsx("div",{className:"dashboard-content",children:e.jsxs("div",{className:"admin-page",children:[e.jsxs("div",{className:"admin-header",children:[e.jsx("h2",{children:"Manage Users"}),e.jsxs("div",{className:"admin-actions",children:[e.jsx("input",{type:"text",placeholder:"Search users, IPs...",value:l,onChange:a=>f(a.target.value),className:"search-input"}),e.jsxs(s,{href:route("admin.security"),className:"btn btn-security",children:[e.jsx("i",{className:"fas fa-shield-alt"})," Security Monitor"]}),e.jsxs("button",{className:"btn btn-info",onClick:v,children:[e.jsx("i",{className:"fas fa-map-marker-alt"})," Log Current IP"]}),e.jsxs(s,{href:route("admin.users",{},!1),className:"btn btn-primary",children:[e.jsx("i",{className:"fas fa-refresh"})," Refresh"]})]})]}),e.jsxs("div",{className:"security-overview",children:[e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon security",children:e.jsx("i",{className:"fas fa-shield-alt"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("h3",{children:c?.totalSecurityLogs||0}),e.jsx("p",{children:"Total Security Logs"})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon high-risk",children:e.jsx("i",{className:"fas fa-exclamation-triangle"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("h3",{children:c?.highSeverityLogs||0}),e.jsx("p",{children:"High Severity Alerts"})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon critical",children:e.jsx("i",{className:"fas fa-bomb"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("h3",{children:c?.criticalSeverityLogs||0}),e.jsx("p",{children:"Critical Alerts"})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon today",children:e.jsx("i",{className:"fas fa-calendar-day"})}),e.jsxs("div",{className:"stat-content",children:[e.jsx("h3",{children:c?.todayLogs||0}),e.jsx("p",{children:"Today's Activities"})]})]})]}),e.jsxs("div",{className:"users-table-container",children:[e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"admin-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ID"}),e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"Role"}),e.jsx("th",{children:"Wallet"}),e.jsx("th",{children:"IP Address"}),e.jsx("th",{children:"Security"}),e.jsx("th",{children:"Last Login"}),e.jsx("th",{children:"Actions"})]})}),e.jsx("tbody",{children:g.map(a=>{const n=d(a);return e.jsxs("tr",{className:n.level!=="safe"?"suspicious-row":"",children:[e.jsx("td",{children:a.id}),e.jsx("td",{children:e.jsxs("div",{className:"user-info",children:[e.jsx("span",{className:"user-name",children:a.name}),a.suspicious_activities>0&&e.jsx("span",{className:"suspicious-badge",title:`${a.suspicious_activities} suspicious activities`,children:"⚠️"})]})}),e.jsx("td",{children:a.email}),e.jsx("td",{children:e.jsx("span",{className:a.isAdmin?"role-badge admin":"role-badge user",children:a.isAdmin?"Admin":"User"})}),e.jsx("td",{children:e.jsxs("div",{className:"wallet-info",children:[e.jsxs("span",{className:"wallet-amount",children:["₦",a.walletAmount?.toLocaleString()||0]}),a.walletAmount>5e4&&e.jsx("span",{className:"high-wallet",title:"High wallet balance",children:"💰"})]})}),e.jsx("td",{children:e.jsxs("div",{className:"ip-info",children:[e.jsx("span",{className:"ip-address",children:a.last_login_ip||"Unknown"}),a.last_login_ip&&e.jsx("button",{className:"btn-locate",onClick:()=>window.open(`https://www.ipinfo.io/${a.last_login_ip}`,"_blank"),title:"Locate IP",children:"📍"})]})}),e.jsx("td",{children:e.jsxs("div",{className:"security-indicator",children:[e.jsxs("span",{className:"security-badge",style:{backgroundColor:n.color},title:`Security Level: ${n.level}`,children:[n.icon," ",n.level.toUpperCase()]}),e.jsxs("div",{className:"security-count",children:[a.suspicious_activities," alerts"]})]})}),e.jsx("td",{children:e.jsxs("div",{className:"login-info",children:[e.jsx("span",{children:a.last_login_at?new Date(a.last_login_at).toLocaleDateString():"Never"}),a.last_login_at&&e.jsx("span",{className:"login-time",children:new Date(a.last_login_at).toLocaleTimeString()})]})}),e.jsx("td",{children:e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{className:"btn btn-sm btn-security",onClick:()=>y(a),title:"View Security Details",children:e.jsx("i",{className:"fas fa-shield-alt"})}),e.jsx("button",{className:"btn btn-sm btn-secondary",title:"Edit User",children:e.jsx("i",{className:"fas fa-edit"})}),e.jsx("button",{className:"btn btn-sm btn-danger",title:"Delete User",children:e.jsx("i",{className:"fas fa-trash"})})]})})]},a.id)})})]})}),r?.links&&e.jsx("div",{className:"pagination",children:r.links.map((a,n)=>e.jsx(s,{href:a.url||"#",className:a.active?"pagination-link active":"pagination-link",dangerouslySetInnerHTML:{__html:a.label}},n))})]})]})})]})]}),u&&t&&e.jsx("div",{className:"modal-overlay",onClick:()=>m(!1),children:e.jsxs("div",{className:"modal-content security-modal",onClick:a=>a.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsxs("h3",{children:["Security Details - ",t.name]}),e.jsx("button",{className:"modal-close",onClick:()=>m(!1),children:"×"})]}),e.jsxs("div",{className:"modal-body",children:[e.jsxs("div",{className:"security-summary",children:[e.jsxs("div",{className:"summary-item",children:[e.jsx("label",{children:"Security Level:"}),e.jsxs("span",{className:`security-level ${d(t).level}`,children:[d(t).icon," ",d(t).level.toUpperCase()]})]}),e.jsxs("div",{className:"summary-item",children:[e.jsx("label",{children:"Suspicious Activities:"}),e.jsx("span",{className:"alert-count",children:t.suspicious_activities})]}),e.jsxs("div",{className:"summary-item",children:[e.jsx("label",{children:"Last Login IP:"}),e.jsx("span",{className:"ip-address",children:t.last_login_ip||"Unknown"})]}),e.jsxs("div",{className:"summary-item",children:[e.jsx("label",{children:"Wallet Balance:"}),e.jsxs("span",{className:"wallet-balance",children:["₦",t.walletAmount?.toLocaleString()||0]})]})]}),e.jsxs("div",{className:"recent-logs",children:[e.jsx("h4",{children:"Recent Security Logs"}),t.recent_security_logs&&t.recent_security_logs.length>0?e.jsx("div",{className:"logs-list",children:t.recent_security_logs.map(a=>e.jsxs("div",{className:"log-item",children:[e.jsxs("div",{className:"log-header",children:[e.jsx("span",{className:"log-type",children:a.activity_type||"General Activity"}),e.jsx("span",{className:"log-time",children:new Date(a.created_at).toLocaleString()})]}),e.jsxs("div",{className:"log-details",children:[e.jsxs("span",{className:"log-ip",children:["IP: ",a.ip_address]}),e.jsx("span",{className:"log-severity",style:{color:j(a.severity)},children:a.severity?.toUpperCase()})]}),a.location&&e.jsxs("div",{className:"log-location",children:["📍 ",a.location.city,", ",a.location.country]})]},a.id))}):e.jsx("p",{className:"no-logs",children:"No recent security logs found"})]}),e.jsxs("div",{className:"security-actions",children:[e.jsxs("button",{className:"btn btn-danger",children:[e.jsx("i",{className:"fas fa-ban"})," Block User"]}),e.jsxs("button",{className:"btn btn-warning",children:[e.jsx("i",{className:"fas fa-exclamation-triangle"})," Flag for Review"]}),e.jsxs("button",{className:"btn btn-secondary",children:[e.jsx("i",{className:"fas fa-envelope"})," Send Warning"]})]})]})]})}),e.jsx("style",{children:`
                .dashboard-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #f8f9fa;
                }

                .sidebar {
                    width: 280px;
                    background: white;
                    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                    position: fixed;
                    height: 100vh;
                    left: 0;
                    top: 0;
                    z-index: 1000;
                }

                .sidebar-logo {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .sidebar-menu {
                    padding: 20px 0;
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px 20px;
                    color: #6b7280;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .sidebar-link:hover,
                .sidebar-link.active {
                    background: #f3f4f6;
                    color: #059669;
                }

                .dashboard-main {
                    flex: 1;
                    margin-left: 280px;
                }

                .topbar {
                    background: white;
                    padding: 20px 30px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .topbar-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .user-profile span {
                    font-weight: 500;
                    color: #374151;
                }

                .dashboard-content {
                    padding: 30px;
                }

                .admin-page {
                    padding: 0;
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
                    color: #374151;
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

                .table-responsive {
                    overflow-x: auto;
                    width: 100%;
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
                    white-space: nowrap;
                }

                .admin-table td {
                    padding: 12px;
                    border-bottom: 1px solid #f3f4f6;
                    white-space: nowrap;
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
                    width: 100%;
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

                .sidebar-close-btn {
                    display: none !important;
                }

                /* Responsive Design */
                @media (max-width: 991px) {
                    .dashboard-layout {
                        flex-direction: column !important;
                    }

                    .sidebar {
                        position: fixed !important;
                        top: 0 !important;
                        left: -290px !important;
                        width: 280px !important;
                        height: 100vh !important;
                        z-index: 1000 !important;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1) !important;
                        overflow-y: auto !important;
                        display: block !important;
                    }

                    .sidebar.open {
                        left: 0 !important;
                    }

                    .sidebar-logo {
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        width: 100% !important;
                    }

                    .sidebar-close-btn {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        background: transparent !important;
                        border: none !important;
                        font-size: 20px !important;
                        color: #ef4444 !important;
                        cursor: pointer !important;
                        padding: 4px !important;
                    }

                    .sidebar-menu {
                        position: static !important;
                        width: 100% !important;
                        padding-bottom: 30px !important;
                    }

                    .sidebar-toggle-btn {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        background: transparent !important;
                        border: none !important;
                        font-size: 20px !important;
                        color: #374151 !important;
                        cursor: pointer !important;
                        padding: 8px !important;
                        margin-right: 15px !important;
                        border-radius: 6px !important;
                        transition: background-color 0.2s !important;
                    }

                    .sidebar-toggle-btn:hover {
                        background-color: #f3f4f6 !important;
                    }

                    .sidebar-overlay {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        background: rgba(0, 0, 0, 0.4) !important;
                        z-index: 999 !important;
                        backdrop-filter: blur(2px) !important;
                    }

                    .dashboard-main {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }

                    .topbar {
                        padding: 15px 20px !important;
                        position: sticky !important;
                        top: 0 !important;
                        z-index: 100 !important;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
                    }

                    .topbar h3 {
                        font-size: 18px !important;
                    }

                    .dashboard-content {
                        padding: 20px 15px !important;
                    }

                    .admin-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 15px !important;
                        padding: 15px !important;
                    }

                    .admin-actions {
                        width: 100% !important;
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 10px !important;
                    }

                    .search-input {
                        width: 100% !important;
                    }

                    .btn {
                        width: 100% !important;
                        justify-content: center !important;
                    }

                    .security-overview {
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
                        gap: 10px !important;
                    }

                    .stat-card {
                        padding: 15px !important;
                    }

                    .action-buttons {
                        flex-direction: column !important;
                        gap: 4px !important;
                    }

                    .security-summary {
                        grid-template-columns: 1fr !important;
                    }

                    .security-actions {
                        flex-direction: column !important;
                    }
                }

                @media (min-width: 992px) {
                    .sidebar-toggle-btn {
                        display: none !important;
                    }
                }
            `})]})};export{_ as default};
