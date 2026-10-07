import{r as o,j as a,H as v,L as i,a as y}from"./app-6MZEwRUJ.js";import{f as r,L as k,C as w,a as C,b as P,P as z,c as D,p as I,e as L,g as R,i as S}from"./index-Bp3Y89Fm.js";w.register(C,P,z,D,I,L,R,S);const B=({auth:x,requests:l,analytics:d,profitData:c})=>{const[s,h]=o.useState(d||{totalRequests:0,totalRevenue:0,totalProfit:0,avgDailyProfit:0,avgMonthlyProfit:0,avgYearlyProfit:0,totalWalletBalance:0}),[p,f]=o.useState(c||[]),[b,g]=o.useState(l?.data||[]),[n,A]=o.useState(!1),[m,e]=o.useState(!1);o.useEffect(()=>{d&&h(d),c&&f(c),l&&g(l.data)},[d,c,l]);const j=t=>{t.preventDefault(),confirm("Are you sure you want to logout?")&&y.post(route("logout"))},u={labels:p.map(t=>t.date),datasets:[{label:"Daily Profit",data:p.map(t=>t.profit),borderColor:"rgb(75, 192, 192)",backgroundColor:"rgba(75, 192, 192, 0.2)",fill:!0,tension:.4},{label:"Daily Revenue",data:p.map(t=>t.profit+(t.date?s.externalApiCost||140:0)),borderColor:"rgb(54, 162, 235)",backgroundColor:"rgba(54, 162, 235, 0.2)",fill:!0,tension:.4}]},N={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top"},title:{display:!0,text:"30-Day NIN Profit & Revenue Trend"}},scales:{y:{beginAtZero:!0,ticks:{callback:function(t){return"₦"+t.toLocaleString()}}}}};return a.jsxs(a.Fragment,{children:[a.jsx(v,{title:"NIN Profit Analytics"}),a.jsxs("div",{className:"dashboard-layout",children:[m&&a.jsx("div",{className:"sidebar-overlay",onClick:()=>e(!1)}),a.jsxs("aside",{className:`sidebar ${m?"open":""}`,children:[a.jsxs("div",{className:"sidebar-logo",children:[a.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[a.jsx("div",{className:"logo-image"}),a.jsx("span",{children:"IDENTIFYAM"})]}),a.jsx("button",{className:"sidebar-close-btn",onClick:()=>e(!1),"aria-label":"Close sidebar",children:a.jsx("i",{className:"fas fa-times"})})]}),a.jsxs("nav",{className:"sidebar-menu",children:[a.jsxs(i,{href:route("admin.dashboard"),className:"sidebar-link",onClick:()=>e(!1),children:[a.jsx("i",{className:"fas fa-tachometer-alt"}),"Dashboard"]}),a.jsxs(i,{href:"lagacy-nin",className:"sidebar-link",onClick:()=>e(!1),children:[a.jsx("i",{className:"fas fa-history"})," Lagacy NIN"]}),a.jsxs(i,{href:route("exam.cards"),className:"sidebar-link",onClick:()=>e(!1),children:[a.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),a.jsxs(i,{href:"/admin/users",className:"sidebar-link",onClick:()=>e(!1),children:[a.jsx("i",{className:"fas fa-credit-card"})," Manage Users"]}),a.jsxs(i,{href:"history",className:"sidebar-link",onClick:()=>e(!1),children:[a.jsx("i",{className:"fas fa-history"}),"History"]}),a.jsxs(i,{href:"profile",className:"sidebar-link",onClick:()=>e(!1),children:[a.jsx("i",{className:"fas fa-user-edit"}),"Profile Edit"]}),a.jsxs(i,{href:route("admin.nin-profit"),className:"sidebar-link active",onClick:()=>e(!1),children:[a.jsx("i",{className:"fas fa-chart-line"})," NIN Profit"]}),a.jsxs(i,{href:route("admin.exam-profit"),className:"sidebar-link",onClick:()=>e(!1),children:[a.jsx("i",{className:"fas fa-chart-pie"})," Exam Profit"]}),a.jsxs("button",{onClick:j,style:{padding:"15px 20px",backgroundColor:"red",color:"#fff",fontSize:"15px",border:"none",borderRadius:"20px",cursor:"pointer",marginTop:"15px"},children:[a.jsx("i",{className:"fas fa-sign-out"})," Logout"]})]})]}),a.jsxs("div",{className:"dashboard-main",children:[a.jsxs("header",{className:"topbar",children:[a.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[a.jsx("button",{className:"sidebar-toggle-btn",onClick:()=>e(!0),"aria-label":"Toggle sidebar",children:a.jsx("i",{className:"fas fa-bars"})}),a.jsx("h3",{children:"NIN Profit Analytics"})]}),a.jsx("div",{className:"topbar-right",children:a.jsx("div",{className:"user-profile",children:a.jsx("span",{children:x.user?.name})})})]}),a.jsxs("div",{className:"dashboard-content",children:[a.jsxs("div",{className:"stats-grid",children:[a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-money-bill-wave"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Revenue"}),a.jsx("span",{className:"stat-number",children:n?"...":r(s.totalRevenue)})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-chart-line"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Profit"}),a.jsx("span",{className:"stat-number",children:n?"...":r(s.totalProfit)})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-wallet"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Wallet Balance"}),a.jsx("span",{className:"stat-number",children:n?"...":r(s.totalWalletBalance)})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-users"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Requests"}),a.jsx("span",{className:"stat-number",children:n?"...":s.totalRequests})]})]})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"Profit Projections"}),a.jsxs("div",{className:"action-grid",children:[a.jsxs("div",{className:"projection-card",children:[a.jsx("h4",{children:"Daily Average"}),a.jsx("span",{className:"projection-amount",children:n?"...":r(s.avgDailyProfit)})]}),a.jsxs("div",{className:"projection-card",children:[a.jsx("h4",{children:"Monthly Average"}),a.jsx("span",{className:"projection-amount",children:n?"...":r(s.avgMonthlyProfit)})]}),a.jsxs("div",{className:"projection-card",children:[a.jsx("h4",{children:"Yearly Average"}),a.jsx("span",{className:"projection-amount",children:n?"...":r(s.avgYearlyProfit)})]})]})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"30-Day Profit Trend"}),a.jsx("div",{className:"chart-container",style:{height:"400px"},children:a.jsx(k,{data:u,options:N})})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"Recent NIN Requests"}),a.jsx("div",{className:"table-responsive",children:a.jsxs("table",{className:"admin-table",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"User"}),a.jsx("th",{children:"NIN"}),a.jsx("th",{children:"Amount"}),a.jsx("th",{children:"Profit"}),a.jsx("th",{children:"Date"})]})}),a.jsx("tbody",{children:b.slice(0,10).map(t=>a.jsxs("tr",{children:[a.jsx("td",{children:t.user?.name||"N/A"}),a.jsx("td",{children:t.nin}),a.jsx("td",{children:r(t.amount||1e3)}),a.jsx("td",{className:"profit-positive",children:r((t.amount||1e3)-140)}),a.jsx("td",{children:new Date(t.created_at).toLocaleDateString()})]},t.id))})]})})]})]})]})]}),a.jsx("style",{children:`
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

                .projection-card {
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    text-align: center;
                }

                .projection-card h4 {
                    color: #6b7280;
                    margin-bottom: 10px;
                    font-size: 14px;
                }

                .projection-amount {
                    font-size: 24px;
                    font-weight: 700;
                    color: #10b981;
                }

                .chart-container {
                    position: relative;
                    height: 300px;
                    margin: 20px 0;
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
                    color: #475569;
                    border-bottom: 2px solid #e2e8f0;
                }

                .admin-table td {
                    padding: 12px;
                    border-bottom: 1px solid #e2e8f0;
                }

                .profit-positive {
                    color: #10b981;
                    font-weight: 600;
                }

                .table-responsive {
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
                    
                    .projection-card {
                        padding: 15px !important;
                    }
                }

                @media (min-width: 992px) {
                    .sidebar-toggle-btn {
                        display: none !important;
                    }
                }
            `})]})};export{B as default};
