import{r as n,j as s,H as N,L as e,a as y}from"./app-o3g2YfXQ.js";const k=({auth:g,initialStats:c})=>{const[l,m]=n.useState(c||{totalUsers:0,activeUsers:0,totalNinVerifications:0,todayVerifications:0}),[d,x]=n.useState(!1),[f,t]=n.useState(!1),[p,h]=n.useState(!1),[a,o]=n.useState(null);n.useEffect(()=>{c?m(c):u()},[c]);const u=async()=>{try{x(!0);const i=await fetch(route("admin.stats"),{headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")}});if(i.ok){const r=await i.json();m(r),console.log(r)}}catch(i){console.error("Failed to fetch admin stats:",i)}finally{x(!1)}},b=i=>{i.preventDefault(),confirm("Are you sure you want to logout?")&&y.post(route("logout"))},j=async()=>{if(confirm("Are you sure you want to verify all pending transactions with Paystack? This will check the status of pending payments and update them accordingly."))try{h(!0),o(null);const i=await fetch(route("admin.verify-pending-transactions"),{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")}}),r=await i.json();i.ok?o({success:!0,message:r.message,verifiedCount:r.verified_count,successfulCount:r.successful_count,failedCount:r.failed_count,errors:r.errors}):o({success:!1,message:r.message||"Verification failed"})}catch(i){o({success:!1,message:"Network error: "+i.message})}finally{h(!1)}};return s.jsxs(s.Fragment,{children:[s.jsx(N,{title:"Admin Dashboard"}),s.jsxs("div",{className:"dashboard-layout",children:[f&&s.jsx("div",{className:"sidebar-overlay",onClick:()=>t(!1)}),s.jsxs("aside",{className:`sidebar ${f?"open":""}`,children:[s.jsxs("div",{className:"sidebar-logo",children:[s.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[s.jsx("div",{className:"logo-image"}),s.jsx("span",{children:"IDENTIFYAM"})]}),s.jsx("button",{className:"sidebar-close-btn",onClick:()=>t(!1),"aria-label":"Close sidebar",children:s.jsx("i",{className:"fas fa-times"})})]}),s.jsxs("nav",{className:"sidebar-menu",children:[s.jsxs(e,{href:route("admin.dashboard"),className:"sidebar-link active",onClick:()=>t(!1),children:[s.jsx("i",{className:"fas fa-tachometer-alt"}),"Dashboard"]}),s.jsxs(e,{href:"lagacy-nin",className:"sidebar-link",onClick:()=>t(!1),children:[s.jsx("i",{className:"fas fa-history"})," Lagacy NIN"]}),s.jsxs(e,{href:route("exam.cards"),className:"sidebar-link",onClick:()=>t(!1),children:[s.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),s.jsxs(e,{href:"/admin/users",className:"sidebar-link",onClick:()=>t(!1),children:[s.jsx("i",{className:"fas fa-credit-card"})," Manage Users"]}),s.jsxs(e,{href:"/admin/send-email",className:"sidebar-link",onClick:()=>t(!1),children:[s.jsx("i",{className:"fas fa-envelope"})," Send Email"]}),s.jsxs(e,{href:"history",className:"sidebar-link",onClick:()=>t(!1),children:[s.jsx("i",{className:"fas fa-history"}),"History"]}),s.jsxs(e,{href:"profile",className:"sidebar-link",onClick:()=>t(!1),children:[s.jsx("i",{className:"fas fa-user-edit"}),"Profile Edit"]}),s.jsxs(e,{href:route("admin.nin-profit"),className:"sidebar-link",onClick:()=>t(!1),children:[s.jsx("i",{className:"fas fa-chart-line"})," NIN Profit"]}),s.jsxs(e,{href:route("admin.exam-profit"),className:"sidebar-link",onClick:()=>t(!1),children:[s.jsx("i",{className:"fas fa-chart-pie"})," Exam Profit"]}),s.jsxs("button",{onClick:b,style:{padding:"15px 20px",backgroundColor:"red",color:"#fff",fontSize:"15px",border:"none",borderRadius:"20px",cursor:"pointer",marginTop:"15px"},children:[s.jsx("i",{className:"fas fa-sign-out"})," Logout"]})]})]}),s.jsxs("div",{className:"dashboard-main",children:[s.jsxs("header",{className:"topbar",children:[s.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[s.jsx("button",{className:"sidebar-toggle-btn",onClick:()=>t(!0),"aria-label":"Toggle sidebar",children:s.jsx("i",{className:"fas fa-bars"})}),s.jsx("h3",{children:"Admin Dashboard"})]}),s.jsx("div",{className:"topbar-right",children:s.jsx("div",{className:"user-profile",children:s.jsx("span",{children:g.user?.name})})})]}),s.jsxs("div",{className:"dashboard-content",children:[s.jsxs("div",{className:"stats-grid",children:[s.jsxs("div",{className:"stat-card",children:[s.jsx("div",{className:"stat-icon",children:s.jsx("i",{className:"fas fa-users"})}),s.jsxs("div",{className:"stat-info",children:[s.jsx("h4",{children:"Total Users"}),s.jsx("span",{className:"stat-number",children:d?"...":l.totalUsers})]})]}),s.jsxs("div",{className:"stat-card",children:[s.jsx("div",{className:"stat-icon",children:s.jsx("i",{className:"fas fa-user-check"})}),s.jsxs("div",{className:"stat-info",children:[s.jsx("h4",{children:"Active Users"}),s.jsx("span",{className:"stat-number",children:d?"...":l.activeUsers})]})]}),s.jsxs("div",{className:"stat-card",children:[s.jsx("div",{className:"stat-icon",children:s.jsx("i",{className:"fas fa-id-card"})}),s.jsxs("div",{className:"stat-info",children:[s.jsx("h4",{children:"Total NIN Verifications"}),s.jsx("span",{className:"stat-number",children:d?"...":l.totalNinVerifications})]})]}),s.jsxs("div",{className:"stat-card",children:[s.jsx("div",{className:"stat-icon",children:s.jsx("i",{className:"fas fa-calendar-day"})}),s.jsxs("div",{className:"stat-info",children:[s.jsx("h4",{children:"Today's Verifications"}),s.jsx("span",{className:"stat-number",children:d?"...":l.todayVerifications})]})]})]}),s.jsxs("div",{className:"admin-actions",children:[s.jsx("h3",{children:"Quick Actions"}),s.jsxs("div",{className:"action-grid",children:[s.jsxs(e,{href:"/admin/users",className:"action-card",children:[s.jsx("i",{className:"fas fa-users"}),s.jsx("span",{children:"Manage Users"})]}),s.jsxs(e,{href:"/admin/nin-requests",className:"action-card",children:[s.jsx("i",{className:"fas fa-search"}),s.jsx("span",{children:"NIN Requests"})]}),s.jsxs(e,{href:"/admin/system-logs",className:"action-card",children:[s.jsx("i",{className:"fas fa-file-alt"}),s.jsx("span",{children:"System Logs"})]}),s.jsxs(e,{href:"/admin/nin-profit",className:"action-card",children:[s.jsx("i",{className:"fas fa-cog"}),s.jsx("span",{children:"Nin profit"})]}),s.jsxs(e,{href:"/admin/settings",className:"action-card",children:[s.jsx("i",{className:"fas fa-cog"}),s.jsx("span",{children:"System Settings"})]}),s.jsxs("button",{onClick:j,disabled:p,className:"action-card",style:{cursor:p?"not-allowed":"pointer",opacity:p?.6:1},children:[s.jsx("i",{className:"fas fa-check-circle"}),s.jsx("span",{children:p?"Verifying...":"Verify Pending Transactions"})]})]}),a&&s.jsxs("div",{style:{marginTop:"20px",padding:"15px",borderRadius:"8px",backgroundColor:a.success?"#d1fae5":"#fee2e2",border:`1px solid ${a.success?"#10b981":"#ef4444"}`},children:[s.jsx("h4",{style:{margin:"0 0 10px 0",color:a.success?"#065f46":"#991b1b"},children:a.success?"✓ Verification Complete":"✗ Verification Failed"}),s.jsx("p",{style:{margin:"0 0 10px 0",color:"#374151"},children:a.message}),a.success&&a.verifiedCount>0&&s.jsxs("div",{style:{fontSize:"14px",color:"#374151"},children:[s.jsxs("p",{style:{margin:"5px 0"},children:[s.jsx("strong",{children:"Total Verified:"})," ",a.verifiedCount]}),s.jsxs("p",{style:{margin:"5px 0",color:"#059669"},children:[s.jsx("strong",{children:"Successful:"})," ",a.successfulCount]}),s.jsxs("p",{style:{margin:"5px 0",color:"#dc2626"},children:[s.jsx("strong",{children:"Failed:"})," ",a.failedCount]}),a.errors&&a.errors.length>0&&s.jsxs("details",{style:{marginTop:"10px"},children:[s.jsxs("summary",{style:{cursor:"pointer",color:"#6b7280"},children:["View Errors (",a.errors.length,")"]}),s.jsx("ul",{style:{marginTop:"10px",paddingLeft:"20px",color:"#dc2626"},children:a.errors.map((i,r)=>s.jsx("li",{style:{marginBottom:"5px"},children:i},r))})]})]}),s.jsx("button",{onClick:()=>o(null),style:{marginTop:"10px",padding:"5px 10px",backgroundColor:"#374151",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Close"})]})]})]})]})]}),s.jsx("style",{children:`
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
            `})]})};export{k as default};
