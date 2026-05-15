import{u as N,r as t,j as e,H as w,L as o}from"./app-DuO5hM3s.js";const C=({auth:h})=>{const{props:k}=N(),[g,f]=t.useState([]),[r,u]=t.useState({totalLogs:0,highSeverity:0,criticalSeverity:0,todayLogs:0,activeUsers:0,suspiciousIPs:0}),[n,c]=t.useState(!1),[a,d]=t.useState(null);t.useEffect(()=>{b()},[]);const b=async()=>{try{c(!0);const s=await fetch(route("admin.security-monitoring"),{headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")}});if(s.ok){const i=await s.json();f(i.logs),u(i.stats)}}catch(s){console.error("Failed to fetch security data:",s)}finally{c(!1)}},[j,x]=t.useState(!1),y=s=>{if(s.preventDefault(),j){const i=document.createElement("form");i.method="POST",i.action=route("logout");const p=document.querySelector('meta[name="csrf-token"]');if(p){const l=document.createElement("input");l.type="hidden",l.name="_token",l.value=p.getAttribute("content"),i.appendChild(l)}document.body.appendChild(i),confirm("Do you want to logout")&&i.submit()}else x(!0),setTimeout(()=>x(!1),3e3)},m=s=>{switch(s){case"critical":return"#dc3545";case"high":return"#fd7e14";case"medium":return"#ffc107";default:return"#28a745"}},v=s=>{switch(s){case"critical":return"🚨";case"high":return"⚠️";case"medium":return"⚡";default:return"✅"}};return e.jsxs(e.Fragment,{children:[e.jsx(w,{title:"Security Monitoring"}),e.jsxs("div",{className:"dashboard-layout",children:[e.jsxs("aside",{className:"sidebar",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("div",{className:"logo-image"}),e.jsx("span",{children:"IDENTIFYAM"})]}),e.jsxs("nav",{className:"sidebar-menu",children:[e.jsxs(o,{href:route("admin.dashboard"),className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-tachometer-alt"}),"Dashboard"]}),e.jsxs(o,{href:route("admin.users"),className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-users"}),"Manage Users"]}),e.jsxs(o,{href:route("admin.security-monitoring"),className:"sidebar-link active",children:[e.jsx("i",{className:"fas fa-shield-alt"}),"Security Monitor"]}),e.jsxs(o,{href:"/admin/nin-profit",className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-chart-line"})," NIN Profit"]}),e.jsxs("button",{onClick:y,style:{padding:"15px 20px",backgroundColor:"red",color:"#fff",fontSize:"15px",border:"none",borderRadius:"20px",cursor:"pointer"},children:[e.jsx("i",{className:"fas fa-sign-out"})," Logout"]})]})]}),e.jsxs("div",{className:"dashboard-main",children:[e.jsxs("header",{className:"topbar",children:[e.jsx("h3",{children:"Security Monitoring Center"}),e.jsxs("div",{className:"topbar-right",children:[e.jsx("span",{className:"notification",children:e.jsx("i",{className:"fas fa-bell"})}),e.jsxs("div",{className:"user-profile",children:[e.jsx("img",{src:"/assets/img/user_profile.png",alt:"avatar"}),e.jsx("span",{children:h.user?.name})]})]})]}),e.jsxs("div",{className:"dashboard-content",children:[e.jsxs("div",{className:"stats-grid",children:[e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{background:"linear-gradient(135deg, #dc3545 0%, #c82333 100%)"},children:e.jsx("i",{className:"fas fa-exclamation-triangle"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("h4",{children:"High Severity Alerts"}),e.jsx("span",{className:"stat-number",children:n?"...":r.highSeverity})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{background:"linear-gradient(135deg, #dc3545 0%, #721c24 100%)"},children:e.jsx("i",{className:"fas fa-bomb"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("h4",{children:"Critical Alerts"}),e.jsx("span",{className:"stat-number",children:n?"...":r.criticalSeverity})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{background:"linear-gradient(135deg, #ffc107 0%, #e0a800 100%)"},children:e.jsx("i",{className:"fas fa-shield-alt"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("h4",{children:"Today's Logs"}),e.jsx("span",{className:"stat-number",children:n?"...":r.todayLogs})]})]}),e.jsxs("div",{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{background:"linear-gradient(135deg, #17a2b8 0%, #138496 100%)"},children:e.jsx("i",{className:"fas fa-network-wired"})}),e.jsxs("div",{className:"stat-info",children:[e.jsx("h4",{children:"Suspicious IPs"}),e.jsx("span",{className:"stat-number",children:n?"...":r.suspiciousIPs})]})]})]}),e.jsxs("div",{className:"admin-actions",children:[e.jsx("h3",{children:"Live Security Feed"}),e.jsx("div",{className:"security-feed",children:g.slice(0,20).map(s=>e.jsxs("div",{className:"security-log-item",onClick:()=>d(s),children:[e.jsx("div",{className:"log-severity",style:{backgroundColor:m(s.severity)},children:v(s.severity)}),e.jsxs("div",{className:"log-content",children:[e.jsxs("div",{className:"log-header",children:[e.jsx("span",{className:"log-type",children:s.activity_type||"General Activity"}),e.jsx("span",{className:"log-time",children:new Date(s.created_at).toLocaleTimeString()})]}),e.jsxs("div",{className:"log-details",children:[e.jsx("span",{className:"log-user",children:s.user?.name||"Unknown User"}),e.jsxs("span",{className:"log-ip",children:["IP: ",s.ip_address]}),s.location&&e.jsxs("span",{className:"log-location",children:["📍 ",s.location.city,", ",s.location.country]})]})]})]},s.id))})]}),a&&e.jsx("div",{className:"modal-overlay",onClick:()=>d(null),children:e.jsxs("div",{className:"modal-content",onClick:s=>s.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Security Log Details"}),e.jsx("button",{className:"modal-close",onClick:()=>d(null),children:"×"})]}),e.jsx("div",{className:"modal-body",children:e.jsxs("div",{className:"detail-grid",children:[e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"User:"}),e.jsx("span",{children:a.user?.name||"Unknown"})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"Email:"}),e.jsx("span",{children:a.user?.email||"N/A"})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"IP Address:"}),e.jsx("span",{children:a.ip_address})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"Activity Type:"}),e.jsx("span",{children:a.activity_type||"General"})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"Severity:"}),e.jsx("span",{style:{color:m(a.severity)},children:a.severity?.toUpperCase()})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"Timestamp:"}),e.jsx("span",{children:new Date(a.created_at).toLocaleString()})]}),e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"User Agent:"}),e.jsx("span",{style:{fontSize:"12px"},children:a.user_agent})]}),a.location&&e.jsxs("div",{className:"detail-item",children:[e.jsx("label",{children:"Location:"}),e.jsxs("span",{children:[a.location.city,", ",a.location.country,"(",a.location.isp,")"]})]}),a.details&&e.jsxs("div",{className:"detail-item full-width",children:[e.jsx("label",{children:"Additional Details:"}),e.jsx("pre",{children:JSON.stringify(a.details,null,2)})]})]})})]})})]})]})]}),e.jsx("style",{children:`
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

                .notification {
                    font-size: 20px;
                    color: #6b7280;
                    cursor: pointer;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .user-profile img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
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

                @media (max-width: 768px) {
                    .sidebar {
                        width: 250px;
                    }
                    
                    .dashboard-main {
                        margin-left: 250px;
                    }
                    
                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }
                    
                    .detail-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `})]})};export{C as default};
