import{r,j as e,H as j,L as t,a as y}from"./app-DEIJqhJb.js";const k=({auth:x,initialLogs:n,initialStats:l})=>{const[h,f]=r.useState(n||[]),[o,g]=r.useState(l||{totalLogs:0,highSeverity:0,criticalSeverity:0,todayLogs:0,activeUsers:0,suspiciousIPs:0}),[d,N]=r.useState(!1),[s,c]=r.useState(null),[p,i]=r.useState(!1);r.useEffect(()=>{n&&f(n),l&&g(l)},[n,l]);const b=a=>{a.preventDefault(),confirm("Are you sure you want to logout?")&&y.post(route("logout"))},m=a=>{switch(a){case"critical":return"#dc3545";case"high":return"#fd7e14";case"medium":return"#ffc107";default:return"#28a745"}},u=a=>{switch(a){case"critical":return"🚨";case"high":return"⚠️";case"medium":return"⚡";default:return"✅"}};return e.jsxs(e.Fragment,{children:[e.jsx(j,{title:"Security Monitoring"}),e.jsxs("div",{className:"dashboard-layout",children:[p&&e.jsx("div",{className:"sidebar-overlay",onClick:()=>i(!1)}),e.jsxs("aside",{className:`sidebar ${p?"open":""}`,children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[e.jsx("div",{className:"logo-image"}),e.jsx("span",{children:"IDENTIFYAM"})]}),e.jsx("button",{className:"sidebar-close-btn",onClick:()=>i(!1),"aria-label":"Close sidebar",children:e.jsx("i",{className:"fas fa-times"})})]}),e.jsxs("nav",{className:"sidebar-menu",children:[e.jsxs(t,{href:route("admin.dashboard"),className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-tachometer-alt"}),"Dashboard"]}),e.jsxs(t,{href:"lagacy-nin",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-history"})," Lagacy NIN"]}),e.jsxs(t,{href:route("exam.cards"),className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),e.jsxs(t,{href:"/admin/users",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-credit-card"})," Manage Users"]}),e.jsxs(t,{href:"/admin/nin-requests",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-search"})," NIN Requests"]}),e.jsxs(t,{href:"/admin/send-email",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-envelope"})," Send Email"]}),e.jsxs(t,{href:"history",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-history"}),"History"]}),e.jsxs(t,{href:"profile",className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-user-edit"}),"Profile Edit"]}),e.jsxs(t,{href:route("admin.nin-profit"),className:"sidebar-link",onClick:()=>i(!1),children:[e.jsx("i",{className:"fas fa-chart-line"})," NIN Profit"]}),e.jsxs("button",{onClick:b,style:{padding:"15px 20px",backgroundColor:"red",color:"#fff",fontSize:"15px",border:"none",borderRadius:"20px",cursor:"pointer",marginTop:"15px"},children:[e.jsx("i",{className:"fas fa-sign-out"})," Logout"]})]})]}),e.jsxs("div",{className:"dashboard-main",children:[e.jsxs("header",{className:"topbar",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx("button",{className:"sidebar-toggle-btn",onClick:()=>i(!0),"aria-label":"Toggle sidebar",children:e.jsx("i",{className:"fas fa-bars"})}),e.jsx("h3",{children:"Security Monitoring Center"})]}),e.jsx("div",{className:"topbar-right",children:e.jsx("div",{className:"user-profile",children:e.jsx("span",{children:x.user?.name})})})]}),e.jsxs("div",{className:"dashboard-content",children:[e.jsxs("div",{className:"stats-grid",children:[e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{background:"linear-gradient(135deg, #dc3545 0%, #c82333 100%)"},children:e.jsx("i",{className:"fas fa-exclamation-triangle"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("h4",{children:"High Severity Alerts"}),e.jsx("span",{className:"stat-number",children:d?"...":o.highSeverity})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{background:"linear-gradient(135deg, #dc3545 0%, #721c24 100%)"},children:e.jsx("i",{className:"fas fa-bomb"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("h4",{children:"Critical Alerts"}),e.jsx("span",{className:"stat-number",children:d?"...":o.criticalSeverity})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{background:"linear-gradient(135deg, #ffc107 0%, #e0a800 100%)"},children:e.jsx("i",{className:"fas fa-shield-alt"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("h4",{children:"Today's Logs"}),e.jsx("span",{className:"stat-number",children:d?"...":o.todayLogs})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{background:"linear-gradient(135deg, #17a2b8 0%, #138496 100%)"},children:e.jsx("i",{className:"fas fa-network-wired"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("h4",{children:"Suspicious IPs"}),e.jsx("span",{className:"stat-number",children:d?"...":o.suspiciousIPs})]})]})]}),e.jsxs("div",{className:"admin-actions",children:[e.jsx("h3",{children:"Live Security Feed"}),e.jsx("div",{className:"security-feed",children:h.slice(0,20).map(a=>e.jsxs("div",{className:"security-log-item",onClick:()=>c(a),children:[e.jsx("div",{className:"log-severity",style:{backgroundColor:m(a.severity)},children:u(a.severity)}),e.jsxs("div",{className:"log-content",children:[e.jsxs("div",{className:"log-header",children:[e.jsx("span",{className:"log-type",children:a.activity_type||"General Activity"}),e.jsx("span",{className:"log-time",children:new Date(a.created_at).toLocaleTimeString()})]}),e.jsxs("div",{className:"log-details",children:[e.jsx("span",{className:"log-user",children:a.user?.name||"Unknown User"}),e.jsxs("span",{className:"log-ip",children:["IP: ",a.ip_address]}),a.location&&e.jsxs("span",{className:"log-location",children:["📍 ",a.location.city,", ",a.location.country]})]})]})]},a.id))})]}),s&&e.jsx("div",{className:"modal-overlay",onClick:()=>c(null),children:e.jsxs("div",{className:"modal-content",onClick:a=>a.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Security Log Details"}),e.jsx("button",{className:"modal-close",onClick:()=>c(null),children:"×"})]}),e.jsx("div",{className:"modal-body",children:e.jsxs("div",{className:"detail-grid",children:[e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"User:"}),e.jsx("span",{children:s.user?.name||"Unknown"})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"Email:"}),e.jsx("span",{children:s.user?.email||"N/A"})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"IP Address:"}),e.jsx("span",{children:s.ip_address})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"Activity Type:"}),e.jsx("span",{children:s.activity_type||"General"})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"Severity:"}),e.jsx("span",{style:{color:m(s.severity)},children:s.severity?.toUpperCase()})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"Timestamp:"}),e.jsx("span",{children:new Date(s.created_at).toLocaleString()})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"User Agent:"}),e.jsx("span",{style:{fontSize:"12px",wordBreak:"break-all"},children:s.user_agent})]}),s.location&&e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"Location:"}),e.jsxs("span",{children:[s.location.city,", ",s.location.country,"(",s.location.isp,")"]})]}),s.details&&e.jsxs("div",{className:"detail-item full-width",children:[e.jsx("label",{children:"Additional Details:"}),e.jsx("pre",{children:JSON.stringify(s.details,null,2)})]})]})})]})})]})]})]}),e.jsx("style",{children:`
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

                .topbar h3 {
                    color: #1f2937;
                    margin: 0;
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

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: transform 0.2s ease;
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                }

                .stat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                }

                .stat-info h4 {
                    margin: 0 0 5px 0;
                    color: #6b7280;
                    font-size: 14px;
                    font-weight: 500;
                }

                .stat-number {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .admin-actions {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    margin-bottom: 25px;
                }

                .admin-actions h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 20px;
                }

                .security-feed {
                    max-height: 500px;
                    overflow-y: auto;
                }

                .security-log-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 15px;
                    border-bottom: 1px solid #e5e7eb;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .security-log-item:hover {
                    background: #f9fafb;
                }

                .log-severity {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    flex-shrink: 0;
                }

                .log-content {
                    flex: 1;
                }

                .log-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
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
                }

                .log-user {
                    font-weight: 500;
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

                .detail-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                }

                .detail-item.full-width {
                    grid-column: span 2;
                }

                .detail-item label {
                    font-weight: 600;
                    color: #6b7280;
                    margin-bottom: 5px;
                }

                .detail-item pre {
                    background: #f8f9fa;
                    padding: 10px;
                    border-radius: 5px;
                    font-size: 12px;
                    overflow-x: auto;
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

                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;
                        gap: 12px !important;
                    }

                    .stat-card {
                        padding: 15px !important;
                    }

                    .log-details {
                        flex-direction: column !important;
                        gap: 4px !important;
                    }

                    .detail-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .detail-item.full-width {
                        grid-column: span 1 !important;
                    }
                }

                @media (min-width: 992px) {
                    .sidebar-toggle-btn {
                        display: none !important;
                    }
                }
            `})]})};export{k as default};
