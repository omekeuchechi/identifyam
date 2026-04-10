import{r as d,j as e,H as c,L as r}from"./app-CA6K7nOx.js";const h=({users:n})=>{const[t,l]=d.useState(""),[o,s]=d.useState(n?.data||[]);return d.useEffect(()=>{n?.data&&s(n.data)},[n]),d.useEffect(()=>{if(t){const a=n.data.filter(i=>i.name.toLowerCase().includes(t.toLowerCase())||i.email.toLowerCase().includes(t.toLowerCase()));s(a)}else s(n.data||[])},[t,n]),e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Manage Users - Admin"}),e.jsxs("div",{className:"admin-page",children:[e.jsxs("div",{className:"admin-header",children:[e.jsx("h2",{children:"Manage Users"}),e.jsxs("div",{className:"admin-actions",children:[e.jsx("input",{type:"text",placeholder:"Search users...",value:t,onChange:a=>l(a.target.value),className:"search-input"}),e.jsxs(r,{href:route("admin.users",{},!1),className:"btn btn-primary",children:[e.jsx("i",{className:"fas fa-refresh"})," Refresh"]})]})]}),e.jsxs("div",{className:"users-table-container",children:[e.jsxs("table",{className:"admin-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ID"}),e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"Roled"}),e.jsx("th",{children:"Wallet"}),e.jsx("th",{children:"Last Login"}),e.jsx("th",{children:"Actions"})]})}),e.jsx("tbody",{children:o.map(a=>e.jsxs("tr",{children:[e.jsx("td",{children:a.id}),e.jsx("td",{children:a.name}),e.jsx("td",{children:a.email}),e.jsx("td",{children:e.jsx("span",{className:a.isAdmin?"role-badge admin":"role-badge user",children:a.isAdmin?"Admin":"User"})}),e.jsxs("td",{children:["₦ ",a.walletAmount]}),e.jsx("td",{children:a.last_login_at?new Date(a.last_login_at).toLocaleDateString():"Never"}),e.jsx("td",{children:e.jsxs("div",{className:"action-buttons",children:[e.jsx("button",{className:"btn btn-sm btn-secondary",children:e.jsx("i",{className:"fas fa-edit"})}),e.jsx("button",{className:"btn btn-sm btn-danger",children:e.jsx("i",{className:"fas fa-trash"})})]})})]},a.id))})]}),n?.links&&e.jsx("div",{className:"pagination",children:n.links.map((a,i)=>e.jsx(r,{href:a.url||"#",className:a.active?"pagination-link active":"pagination-link",dangerouslySetInnerHTML:{__html:a.label}},i))})]})]}),e.jsx("style",{children:`
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

                .role-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .role-badge.admin {
                    background: #dc2626;
                    color: white;
                }

                .role-badge.user {
                    background: #10b981;
                    color: white;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .btn-sm {
                    padding: 6px 12px;
                    font-size: 12px;
                }

                .btn-secondary {
                    background: #6b7280;
                    color: white;
                }

                .btn-danger {
                    background: #dc2626;
                    color: white;
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
            `})]})};export{h as default};
