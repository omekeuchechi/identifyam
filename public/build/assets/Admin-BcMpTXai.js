import{r as o,j as a,H as h,L as s,a as b}from"./app-DnIgUz87.js";const j=({auth:m,initialStats:e})=>{const[r,d]=o.useState(e||{totalUsers:0,activeUsers:0,totalNinVerifications:0,todayVerifications:0}),[n,c]=o.useState(!1),[l,i]=o.useState(!1);o.useEffect(()=>{e?d(e):x()},[e]);const x=async()=>{try{c(!0);const t=await fetch(route("admin.stats"),{headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")}});if(t.ok){const p=await t.json();d(p),console.log(p)}}catch(t){console.error("Failed to fetch admin stats:",t)}finally{c(!1)}},f=t=>{t.preventDefault(),confirm("Are you sure you want to logout?")&&b.post(route("logout"))};return a.jsxs(a.Fragment,{children:[a.jsx(h,{title:"Admin Dashboard"}),a.jsxs("div",{className:"dashboard-layout",children:[l&&a.jsx("div",{className:"sidebar-overlay",onClick:()=>i(!1)}),a.jsxs("aside",{className:`sidebar ${l?"open":""}`,children:[a.jsxs("div",{className:"sidebar-logo",children:[a.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[a.jsx("div",{className:"logo-image"}),a.jsx("span",{children:"IDENTIFYAM"})]}),a.jsx("button",{className:"sidebar-close-btn",onClick:()=>i(!1),"aria-label":"Close sidebar",children:a.jsx("i",{className:"fas fa-times"})})]}),a.jsxs("nav",{className:"sidebar-menu",children:[a.jsxs(s,{href:route("admin.dashboard"),className:"sidebar-link active",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-tachometer-alt"}),"Dashboard"]}),a.jsxs(s,{href:"lagacy-nin",className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-history"})," Lagacy NIN"]}),a.jsxs(s,{href:route("exam.cards"),className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),a.jsxs(s,{href:"/admin/users",className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-credit-card"})," Manage Users"]}),a.jsxs(s,{href:"/admin/send-email",className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-envelope"})," Send Email"]}),a.jsxs(s,{href:"history",className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-history"}),"History"]}),a.jsxs(s,{href:"profile",className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-user-edit"}),"Profile Edit"]}),a.jsxs(s,{href:route("admin.nin-profit"),className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-chart-line"})," NIN Profit"]}),a.jsxs(s,{href:route("admin.exam-profit"),className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-chart-pie"})," Exam Profit"]}),a.jsxs("button",{onClick:f,style:{padding:"15px 20px",backgroundColor:"red",color:"#fff",fontSize:"15px",border:"none",borderRadius:"20px",cursor:"pointer",marginTop:"15px"},children:[a.jsx("i",{className:"fas fa-sign-out"})," Logout"]})]})]}),a.jsxs("div",{className:"dashboard-main",children:[a.jsxs("header",{className:"topbar",children:[a.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[a.jsx("button",{className:"sidebar-toggle-btn",onClick:()=>i(!0),"aria-label":"Toggle sidebar",children:a.jsx("i",{className:"fas fa-bars"})}),a.jsx("h3",{children:"Admin Dashboard"})]}),a.jsx("div",{className:"topbar-right",children:a.jsx("div",{className:"user-profile",children:a.jsx("span",{children:m.user?.name})})})]}),a.jsxs("div",{className:"dashboard-content",children:[a.jsxs("div",{className:"stats-grid",children:[a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-users"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Users"}),a.jsx("span",{className:"stat-number",children:n?"...":r.totalUsers})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-user-check"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Active Users"}),a.jsx("span",{className:"stat-number",children:n?"...":r.activeUsers})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-id-card"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total NIN Verifications"}),a.jsx("span",{className:"stat-number",children:n?"...":r.totalNinVerifications})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-calendar-day"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Today's Verifications"}),a.jsx("span",{className:"stat-number",children:n?"...":r.todayVerifications})]})]})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"Quick Actions"}),a.jsxs("div",{className:"action-grid",children:[a.jsxs(s,{href:"/admin/users",className:"action-card",children:[a.jsx("i",{className:"fas fa-users"}),a.jsx("span",{children:"Manage Users"})]}),a.jsxs(s,{href:"/admin/nin-requests",className:"action-card",children:[a.jsx("i",{className:"fas fa-search"}),a.jsx("span",{children:"NIN Requests"})]}),a.jsxs(s,{href:"/admin/system-logs",className:"action-card",children:[a.jsx("i",{className:"fas fa-file-alt"}),a.jsx("span",{children:"System Logs"})]}),a.jsxs(s,{href:"/admin/nin-profit",className:"action-card",children:[a.jsx("i",{className:"fas fa-cog"}),a.jsx("span",{children:"Nin profit"})]}),a.jsxs(s,{href:"/admin/settings",className:"action-card",children:[a.jsx("i",{className:"fas fa-cog"}),a.jsx("span",{children:"System Settings"})]})]})]})]})]})]}),a.jsx("style",{children:`
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
                    background: linear-gradient(135deg, #0B6B3A 0%, #10B981 100%);
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

                .action-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }

                .action-card {
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    text-decoration: none;
                    color: #374151;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .action-card:hover {
                    background: #f3f4f6;
                    border-color: #d1d5db;
                    transform: translateY(-1px);
                }

                .action-card i {
                    font-size: 20px;
                    color: #6b7280;
                }

                .action-card span {
                    font-weight: 500;
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
                        left: -270px !important;
                        width: 260px !important;
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
                        grid-template-columns: 1fr !important;
                        gap: 15px !important;
                    }

                    .stat-card {
                        padding: 20px !important;
                    }

                    .admin-actions {
                        padding: 20px 15px !important;
                    }

                    .action-grid {
                        grid-template-columns: 1fr !important;
                        gap: 10px !important;
                    }
                    
                    .action-card {
                        padding: 15px !important;
                    }
                }

                @media (min-width: 992px) {
                    .sidebar-toggle-btn {
                        display: none !important;
                    }
                }
            `})]})};export{j as default};
