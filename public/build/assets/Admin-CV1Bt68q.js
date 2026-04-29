import{u,r as c,j as s,H as j,L as a}from"./app-CHRbuAlC.js";const v=({auth:m})=>{const{props:g}=u(),[t,x]=c.useState({totalUsers:0,activeUsers:0,totalNinVerifications:0,todayVerifications:0}),[r,o]=c.useState(!1);c.useEffect(()=>{f()},[]);const f=async()=>{try{o(!0);const i=await fetch(route("admin.stats"),{headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")}});if(i.ok){const e=await i.json();x(e),console.log(e)}}catch(i){console.error("Failed to fetch admin stats:",i)}finally{o(!1)}},[h,d]=c.useState(!1),p=i=>{if(i.preventDefault(),h){const e=document.createElement("form");e.method="POST",e.action=route("logout");const l=document.querySelector('meta[name="csrf-token"]');if(l){const n=document.createElement("input");n.type="hidden",n.name="_token",n.value=l.getAttribute("content"),e.appendChild(n)}document.body.appendChild(e),confirm("Do you want to logout")&&e.submit()}else d(!0),setTimeout(()=>d(!1),3e3)};return s.jsxs(s.Fragment,{children:[s.jsx(j,{title:"Admin Dashboard"}),s.jsxs("div",{className:"dashboard-layout",children:[s.jsxs("aside",{className:"sidebar",children:[s.jsxs("div",{className:"sidebar-logo",children:[s.jsx("div",{className:"logo-image"}),s.jsx("span",{children:"IDENTIFYAM"})]}),s.jsxs("nav",{className:"sidebar-menu",children:[s.jsxs(a,{href:route("admin.dashboard"),className:"sidebar-link active",children:[s.jsx("i",{className:"fas fa-tachometer-alt"}),"Dashboard"]}),s.jsxs(a,{href:route("dashboard"),className:"sidebar-link",children:[s.jsx("i",{className:"fas fa-home"}),"User Dashboard"]}),s.jsxs(a,{href:"lagacy-nin",className:"sidebar-link",children:[s.jsx("i",{className:"fas fa-history"})," Lagacy NIN"]}),s.jsxs(a,{href:route("exam.cards"),className:"sidebar-link",children:[s.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),s.jsxs(a,{href:"/admin/users",className:"sidebar-link",children:[s.jsx("i",{className:"fas fa-credit-card"})," Manage Users"]}),s.jsxs(a,{href:"history",className:"sidebar-link",children:[s.jsx("i",{className:"fas fa-history"}),"History"]}),s.jsxs(a,{href:"profile",className:"sidebar-link",children:[s.jsx("i",{className:"fas fa-user-edit"}),"Profile Edit"]}),s.jsxs("button",{onClick:p,style:{padding:"15px 20px",backgroundColor:"red",color:"#fff",fontSize:"15px",border:"none",borderRadius:"20px",cursor:"pointer"},children:[s.jsx("i",{className:"fas fa-sign-out"})," Logout"]})]})]}),s.jsxs("div",{className:"dashboard-main",children:[s.jsxs("header",{className:"topbar",children:[s.jsx("h3",{children:"Admin Dashboard"}),s.jsxs("div",{className:"topbar-right",children:[s.jsx("span",{className:"notification",children:s.jsx("i",{className:"fas fa-bell"})}),s.jsxs("div",{className:"user-profile",children:[s.jsx("img",{src:"/assets/img/user_profile.png",alt:"avatar"}),s.jsx("span",{children:m.user?.name})]})]})]}),s.jsxs("div",{className:"dashboard-content",children:[s.jsxs("div",{className:"stats-grid",children:[s.jsxs("div",{className:"stat-card",children:[s.jsx("div",{className:"stat-icon",children:s.jsx("i",{className:"fas fa-users"})}),s.jsxs("div",{className:"stat-info",children:[s.jsx("h4",{children:"Total Users"}),s.jsx("span",{className:"stat-number",children:r?"...":t.totalUsers})]})]}),s.jsxs("div",{className:"stat-card",children:[s.jsx("div",{className:"stat-icon",children:s.jsx("i",{className:"fas fa-user-check"})}),s.jsxs("div",{className:"stat-info",children:[s.jsx("h4",{children:"Active Users"}),s.jsx("span",{className:"stat-number",children:r?"...":t.activeUsers})]})]}),s.jsxs("div",{className:"stat-card",children:[s.jsx("div",{className:"stat-icon",children:s.jsx("i",{className:"fas fa-id-card"})}),s.jsxs("div",{className:"stat-info",children:[s.jsx("h4",{children:"Total NIN Verifications"}),s.jsx("span",{className:"stat-number",children:r?"...":t.totalNinVerifications})]})]}),s.jsxs("div",{className:"stat-card",children:[s.jsx("div",{className:"stat-icon",children:s.jsx("i",{className:"fas fa-calendar-day"})}),s.jsxs("div",{className:"stat-info",children:[s.jsx("h4",{children:"Today's Verifications"}),s.jsx("span",{className:"stat-number",children:r?"...":t.todayVerifications})]})]})]}),s.jsxs("div",{className:"admin-actions",children:[s.jsx("h3",{children:"Quick Actions"}),s.jsxs("div",{className:"action-grid",children:[s.jsxs(a,{href:"/admin/users",className:"action-card",children:[s.jsx("i",{className:"fas fa-users"}),s.jsx("span",{children:"Manage Users"})]}),s.jsxs(a,{href:"/admin/nin-requests",className:"action-card",children:[s.jsx("i",{className:"fas fa-search"}),s.jsx("span",{children:"NIN Requests"})]}),s.jsxs(a,{href:"/admin/system-logs",className:"action-card",children:[s.jsx("i",{className:"fas fa-file-alt"}),s.jsx("span",{children:"System Logs"})]}),s.jsxs(a,{href:"/admin/settings",className:"action-card",children:[s.jsx("i",{className:"fas fa-cog"}),s.jsx("span",{children:"System Settings"})]})]})]})]})]})]}),s.jsx("style",{children:`
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

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }
                    
                    .action-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `})]})};export{v as default};
