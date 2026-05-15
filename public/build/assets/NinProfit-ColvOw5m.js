import{u as y,r as o,j as a,H as w,L as n}from"./app-DuO5hM3s.js";const s=c=>{if(c==null)return"₦0";const d=parseFloat(c);return isNaN(d)?"₦0":new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",minimumFractionDigits:0,maximumFractionDigits:0}).format(d)},D=({auth:c})=>{const{props:d}=y(),[i,p]=o.useState({totalRequests:0,totalRevenue:0,totalProfit:0,avgDailyProfit:0,avgMonthlyProfit:0,avgYearlyProfit:0,totalWalletBalance:0}),[x,g]=o.useState([]),[u,b]=o.useState([]),[r,h]=o.useState(!1);o.useEffect(()=>{j()},[]);const j=async()=>{try{h(!0);const e=await fetch(route("admin.nin-profit"),{headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")}});if(e.ok){const t=await e.json();p(t.analytics),g(t.profitData),b(t.requests.data)}}catch(e){console.error("Failed to fetch NIN profit data:",e)}finally{h(!1)}},[N,m]=o.useState(!1),v=e=>{if(e.preventDefault(),N){const t=document.createElement("form");t.method="POST",t.action=route("logout");const f=document.querySelector('meta[name="csrf-token"]');if(f){const l=document.createElement("input");l.type="hidden",l.name="_token",l.value=f.getAttribute("content"),t.appendChild(l)}document.body.appendChild(t),confirm("Do you want to logout")&&t.submit()}else m(!0),setTimeout(()=>m(!1),3e3)};return a.jsxs(a.Fragment,{children:[a.jsx(w,{title:"NIN Profit Analytics"}),a.jsxs("div",{className:"dashboard-layout",children:[a.jsxs("aside",{className:"sidebar",children:[a.jsxs("div",{className:"sidebar-logo",children:[a.jsx("div",{className:"logo-image"}),a.jsx("span",{children:"IDENTIFYAM"})]}),a.jsxs("nav",{className:"sidebar-menu",children:[a.jsxs(n,{href:route("admin.dashboard"),className:"sidebar-link",children:[a.jsx("i",{className:"fas fa-tachometer-alt"}),"Dashboard"]}),a.jsxs(n,{href:"lagacy-nin",className:"sidebar-link",children:[a.jsx("i",{className:"fas fa-history"})," Lagacy NIN"]}),a.jsxs(n,{href:route("exam.cards"),className:"sidebar-link",children:[a.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),a.jsxs(n,{href:"/admin/users",className:"sidebar-link",children:[a.jsx("i",{className:"fas fa-credit-card"})," Manage Users"]}),a.jsxs(n,{href:"history",className:"sidebar-link",children:[a.jsx("i",{className:"fas fa-history"}),"History"]}),a.jsxs(n,{href:"profile",className:"sidebar-link",children:[a.jsx("i",{className:"fas fa-user-edit"}),"Profile Edit"]}),a.jsxs(n,{href:route("admin.nin-profit"),className:"sidebar-link active",children:[a.jsx("i",{className:"fas fa-chart-line"})," NIN Profit"]}),a.jsxs("button",{onClick:v,style:{padding:"15px 20px",backgroundColor:"red",color:"#fff",fontSize:"15px",border:"none",borderRadius:"20px",cursor:"pointer"},children:[a.jsx("i",{className:"fas fa-sign-out"})," Logout"]})]})]}),a.jsxs("div",{className:"dashboard-main",children:[a.jsxs("header",{className:"topbar",children:[a.jsx("h3",{children:"NIN Profit Analytics"}),a.jsxs("div",{className:"topbar-right",children:[a.jsx("span",{className:"notification",children:a.jsx("i",{className:"fas fa-bell"})}),a.jsxs("div",{className:"user-profile",children:[a.jsx("img",{src:"/assets/img/user_profile.png",alt:"avatar"}),a.jsx("span",{children:c.user?.name})]})]})]}),a.jsxs("div",{className:"dashboard-content",children:[a.jsxs("div",{className:"stats-grid",children:[a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-money-bill-wave"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Revenue"}),a.jsx("span",{className:"stat-number",children:r?"...":s(i.totalRevenue)})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-chart-line"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Profit"}),a.jsx("span",{className:"stat-number",children:r?"...":s(i.totalProfit)})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-wallet"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Wallet Balance"}),a.jsx("span",{className:"stat-number",children:r?"...":s(i.totalWalletBalance)})]})]}),a.jsxs("div",{className:"stat-card",children:[a.jsx("div",{className:"stat-icon",children:a.jsx("i",{className:"fas fa-users"})}),a.jsxs("div",{className:"stat-info",children:[a.jsx("h4",{children:"Total Requests"}),a.jsx("span",{className:"stat-number",children:r?"...":i.totalRequests})]})]})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"Profit Projections"}),a.jsxs("div",{className:"action-grid",children:[a.jsxs("div",{className:"projection-card",children:[a.jsx("h4",{children:"Daily Average"}),a.jsx("span",{className:"projection-amount",children:r?"...":s(i.avgDailyProfit)})]}),a.jsxs("div",{className:"projection-card",children:[a.jsx("h4",{children:"Monthly Average"}),a.jsx("span",{className:"projection-amount",children:r?"...":s(i.avgMonthlyProfit)})]}),a.jsxs("div",{className:"projection-card",children:[a.jsx("h4",{children:"Yearly Average"}),a.jsx("span",{className:"projection-amount",children:r?"...":s(i.avgYearlyProfit)})]})]})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"30-Day Profit Trend"}),a.jsx("div",{className:"chart-container",children:a.jsx("canvas",{id:"profitChart",width:"400",height:"200"})})]}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("h3",{children:"Recent NIN Requests"}),a.jsx("div",{className:"table-responsive",children:a.jsxs("table",{className:"admin-table",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"User"}),a.jsx("th",{children:"NIN"}),a.jsx("th",{children:"Amount"}),a.jsx("th",{children:"Profit"}),a.jsx("th",{children:"Date"})]})}),a.jsx("tbody",{children:u.slice(0,10).map(e=>a.jsxs("tr",{children:[a.jsx("td",{children:e.user?.name||"N/A"}),a.jsx("td",{children:e.nin}),a.jsx("td",{children:s(e.amount||1e3)}),a.jsx("td",{className:"profit-positive",children:s((e.amount||1e3)-140)}),a.jsx("td",{children:new Date(e.created_at).toLocaleDateString()})]},e.id))})]})})]})]})]})]}),a.jsx("style",{children:`
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
                    
                    .action-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}),a.jsx("script",{dangerouslySetInnerHTML:{__html:`
                    ${x.length>0?`
                        const canvas = document.getElementById('profitChart');
                        const ctx = canvas.getContext('2d');
                        
                        // Simple bar chart implementation
                        const data = ${JSON.stringify(x)};
                        const maxProfit = Math.max(...data.map(d => d.profit));
                        const chartHeight = 200;
                        const chartWidth = canvas.width;
                        const barWidth = chartWidth / data.length - 10;
                        
                        // Clear canvas
                        ctx.clearRect(0, 0, chartWidth, chartHeight);
                        
                        // Draw bars
                        data.forEach((item, index) => {
                            const barHeight = (item.profit / maxProfit) * chartHeight;
                            const x = index * (barWidth + 10) + 5;
                            const y = chartHeight - barHeight;
                            
                            // Draw bar
                            ctx.fillStyle = '#10b981';
                            ctx.fillRect(x, y, barWidth, barHeight);
                            
                            // Draw value on top
                            ctx.fillStyle = '#1f2937';
                            ctx.font = '10px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText('₦' + item.profit.toFixed(0), x + barWidth/2, y - 5);
                            
                            // Draw date label
                            ctx.save();
                            ctx.translate(x + barWidth/2, chartHeight + 15);
                            ctx.rotate(-45 * Math.PI / 180);
                            ctx.fillText(new Date(item.date).toLocaleDateString(), 0, 0);
                            ctx.restore();
                        });
                    `:""}
                `}})]})};export{D as default};
