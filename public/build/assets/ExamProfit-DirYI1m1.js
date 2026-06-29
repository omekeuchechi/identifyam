import{r as l,j as a,H as C,L as t,a as w}from"./app-PIKjSbX3.js";import{f as i,L as P,B as S,C as D,a as E,b as A,P as L,c as z,d as R,p as T,e as _,g as I,A as Y}from"./index-Dpw1PQPJ.js";D.register(E,A,L,z,R,T,_,I,Y);const U=({auth:m,purchases:d,analytics:c,profitData:x})=>{const[r,f]=l.useState(c||{totalPurchases:0,totalRevenue:0,totalProfit:0,totalCardsSold:0,avgDailyProfit:0,avgMonthlyProfit:0,avgYearlyProfit:0,totalWalletBalance:0}),[o,b]=l.useState(x||[]),[g,j]=l.useState(d?.data||[]),[n,M]=l.useState(!1),[h,s]=l.useState(!1);l.useEffect(()=>{c&&f(c),x&&b(x),d&&j(d.data)},[c,x,d]);const u=e=>{e.preventDefault(),confirm("Are you sure you want to logout?")&&w.post(route("logout"))},N={labels:o.map(e=>new Date(e.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})),datasets:[{label:"Revenue",data:o.map(e=>e.revenue),borderColor:"rgba(54, 162, 235, 1)",backgroundColor:"rgba(54, 162, 235, 0.1)",tension:.4,fill:!0},{label:"Profit",data:o.map(e=>e.profit),borderColor:"rgba(75, 192, 192, 1)",backgroundColor:"rgba(75, 192, 192, 0.1)",tension:.4,fill:!0}]},v={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top"},tooltip:{callbacks:{label:function(e){let p=e.dataset.label||"";return p&&(p+=": "),e.parsed.y!==null&&(p+=i(e.parsed.y)),p}}}},scales:{y:{beginAtZero:!0,ticks:{callback:function(e){return"₦"+e.toLocaleString()}}}}},y={labels:o.map(e=>new Date(e.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})),datasets:[{label:"Cards Sold",data:o.map(e=>e.cards_sold),backgroundColor:"rgba(255, 99, 132, 0.6)",borderColor:"rgba(255, 99, 132, 1)",borderWidth:1},{label:"Purchases",data:o.map(e=>e.purchases),backgroundColor:"rgba(54, 162, 235, 0.6)",borderColor:"rgba(54, 162, 235, 1)",borderWidth:1}]},k={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top"}},scales:{y:{beginAtZero:!0,ticks:{stepSize:1}}}};return a.jsxs(a.Fragment,{children:[a.jsx(C,{title:"Exam Card Profit Analytics"}),a.jsxs("div",{className:"dashboard-layout",children:[h&&a.jsx("div",{className:"sidebar-overlay",onClick:()=>s(!1)}),a.jsxs("aside",{className:`sidebar ${h?"open":""}`,children:[a.jsxs("div",{className:"sidebar-logo",children:[a.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[a.jsx("div",{className:"logo-image"}),a.jsx("span",{children:"IDENTIFYAM"})]}),a.jsx("button",{className:"sidebar-close-btn",onClick:()=>s(!1),"aria-label":"Close sidebar",children:a.jsx("i",{className:"fas fa-times"})})]}),a.jsxs("nav",{className:"sidebar-menu",children:[a.jsxs(t,{href:route("admin.dashboard"),className:"sidebar-link",onClick:()=>s(!1),children:[a.jsx("i",{className:"fas fa-tachometer-alt"}),"Dashboard"]}),a.jsxs(t,{href:"lagacy-nin",className:"sidebar-link",onClick:()=>s(!1),children:[a.jsx("i",{className:"fas fa-history"})," Lagacy NIN"]}),a.jsxs(t,{href:route("exam.cards"),className:"sidebar-link",onClick:()=>s(!1),children:[a.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),a.jsxs(t,{href:"/admin/users",className:"sidebar-link",onClick:()=>s(!1),children:[a.jsx("i",{className:"fas fa-users"})," Manage Users"]}),a.jsxs(t,{href:"history",className:"sidebar-link",onClick:()=>s(!1),children:[a.jsx("i",{className:"fas fa-history"}),"History"]}),a.jsxs(t,{href:"profile",className:"sidebar-link",onClick:()=>s(!1),children:[a.jsx("i",{className:"fas fa-user-edit"}),"Profile Edit"]}),a.jsxs(t,{href:route("admin.nin-profit"),className:"sidebar-link",onClick:()=>s(!1),children:[a.jsx("i",{className:"fas fa-chart-line"})," NIN Profit"]}),a.jsxs(t,{href:route("admin.exam-profit"),className:"sidebar-link active",onClick:()=>s(!1),children:[a.jsx("i",{className:"fas fa-chart-pie"})," Exam Profit"]}),a.jsxs("button",{onClick:u,style:{padding:"15px 20px",backgroundColor:"red",color:"#fff",fontSize:"15px",border:"none",borderRadius:"20px",cursor:"pointer",marginTop:"15px"},children:[a.jsx("i",{className:"fas fa-sign-out"})," Logout"]})]})]}),a.jsxs("div",{className:"dashboard-main",children:[a.jsxs("header",{className:"topbar",children:[a.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[a.jsx("button",{className:"sidebar-toggle-btn",onClick:()=>s(!0),"aria-label":"Toggle sidebar",children:a.jsx("i",{className:"fas fa-bars"})}),a.jsx("h3",{children:"Exam Card Profit Analytics"})]}),a.jsx("div",{className:"topbar-right",children:a.jsx("div",{className:"user-profile",children:a.jsx("span",{children:m.user?.name})})})]}),a.jsxs("div",{className:"dashboard-content",children:[a.jsxs("div",{className:"stats-grid",children:[a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-money-bill-wave"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Revenue"}),a.jsx("span",{className:"stat-number",children:n?"...":i(r.totalRevenue)})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-chart-line"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Profit"}),a.jsx("span",{className:"stat-number",children:n?"...":i(r.totalProfit)})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-credit-card"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Cards Sold"}),a.jsx("span",{className:"stat-number",children:n?"...":r.totalCardsSold})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-shopping-cart"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Purchases"}),a.jsx("span",{className:"stat-number",children:n?"...":r.totalPurchases})]})]})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"Profit Projections"}),a.jsxs("div",{className:"action-grid",children:[a.jsxs("div",{className:"projection-card",children:[a.jsx("h4",{children:"Daily Average"}),a.jsx("span",{className:"projection-amount",children:n?"...":i(r.avgDailyProfit)})]}),a.jsxs("div",{className:"projection-card",children:[a.jsx("h4",{children:"Monthly Average"}),a.jsx("span",{className:"projection-amount",children:n?"...":i(r.avgMonthlyProfit)})]}),a.jsxs("div",{className:"projection-card",children:[a.jsx("h4",{children:"Yearly Average"}),a.jsx("span",{className:"projection-amount",children:n?"...":i(r.avgYearlyProfit)})]})]})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"30-Day Revenue & Profit Trend"}),a.jsx("div",{className:"chart-container",style:{height:"300px"},children:a.jsx(P,{data:N,options:v})})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"30-Day Cards Sold & Purchases"}),a.jsx("div",{className:"chart-container",style:{height:"300px"},children:a.jsx(S,{data:y,options:k})})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"Recent Exam Card Purchases"}),a.jsx("div",{className:"table-responsive",children:a.jsxs("table",{className:"admin-table",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"User"}),a.jsx("th",{children:"Card Type"}),a.jsx("th",{children:"Quantity"}),a.jsx("th",{children:"Amount"}),a.jsx("th",{children:"Profit"}),a.jsx("th",{children:"Date"})]})}),a.jsx("tbody",{children:g.slice(0,10).map(e=>a.jsxs("tr",{children:[a.jsx("td",{children:e.user?.name||"N/A"}),a.jsx("td",{children:e.card_type||"N/A"}),a.jsx("td",{children:e.quantity||1}),a.jsx("td",{children:i(e.amount||0)}),a.jsx("td",{className:"profit-positive",children:i((e.amount||0)-(e.quantity||1)*r.costPerCard)}),a.jsx("td",{children:new Date(e.created_at).toLocaleDateString()})]},e.id))})]})})]})]})]})]}),a.jsx("style",{children:`
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

                .sidebar-link:hover {
                    background: #f3f4f6;
                    color: #1f2937;
                }

                .sidebar-link.active {
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .sidebar-close-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    font-size: 18px;
                    margin-left: auto;
                }

                .sidebar-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 999;
                }

                .dashboard-main {
                    flex: 1;
                    margin-left: 280px;
                }

                .topbar {
                    background: white;
                    padding: 15px 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .sidebar-toggle-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    font-size: 20px;
                    margin-right: 15px;
                }

                .topbar h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: #1f2937;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #6b7280;
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
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .stat-info h4 {
                    margin: 0 0 5px 0;
                    font-size: 14px;
                    color: #6b7280;
                }

                .stat-number {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .admin-actions {
                    background: white;
                    border-radius: 12px;
                    padding: 25px;
                    margin-bottom: 25px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                }

                .admin-actions h3 {
                    margin: 0 0 20px 0;
                    font-size: 18px;
                    color: #1f2937;
                }

                .action-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }

                .projection-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    padding: 20px;
                    color: white;
                    transition: transform 0.2s ease;
                }

                .projection-card:hover {
                    transform: translateY(-2px);
                }

                .projection-card h4 {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    opacity: 0.9;
                }

                .projection-amount {
                    font-size: 24px;
                    font-weight: 700;
                }

                .chart-container {
                    position: relative;
                    background: #fafafa;
                    border-radius: 8px;
                    padding: 15px;
                }

                .table-responsive {
                    overflow-x: auto;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .admin-table th {
                    background: #f9fafb;
                    padding: 12px 15px;
                    text-align: left;
                    font-weight: 600;
                    color: #6b7280;
                    border-bottom: 2px solid #e5e7eb;
                }

                .admin-table td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .admin-table tr:hover {
                    background: #f9fafb;
                }

                .profit-positive {
                    color: #10b981;
                    font-weight: 600;
                }

                /* Responsive styles */
                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                    }

                    .sidebar.open {
                        transform: translateX(0);
                    }

                    .sidebar-overlay {
                        display: block;
                    }

                    .sidebar-overlay:not(:has(+ .sidebar.open)) {
                        display: none;
                    }

                    .dashboard-main {
                        margin-left: 0;
                    }

                    .sidebar-toggle-btn {
                        display: block;
                    }

                    .sidebar-close-btn {
                        display: block;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .dashboard-content {
                        padding: 15px;
                    }
                }
            `})]})};export{U as default};
