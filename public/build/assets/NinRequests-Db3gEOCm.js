import{r as s,j as e,H as x,L as r}from"./app-CA6K7nOx.js";const h=({requests:n})=>{const[t,o]=s.useState(""),[l,d]=s.useState(n?.data||[]);s.useEffect(()=>{n?.data&&d(n.data)},[n]),s.useEffect(()=>{if(t){const a=n.data.filter(i=>i.nin?.toLowerCase().includes(t.toLowerCase())||i.user?.name?.toLowerCase().includes(t.toLowerCase()));d(a)}else d(n.data||[])},[t,n]);const c=a=>new Date(a).toLocaleDateString();return e.jsxs(e.Fragment,{children:[e.jsx(x,{title:"NIN Requests - Admin"}),e.jsxs("div",{className:"admin-page",children:[e.jsxs("div",{className:"admin-header",children:[e.jsx("h2",{children:"NIN Verification Requests"}),e.jsxs("div",{className:"admin-actions",children:[e.jsx("input",{type:"text",placeholder:"Search requests...",value:t,onChange:a=>o(a.target.value),className:"search-input"}),e.jsxs(r,{href:route("admin.nin.requests",{},!1),className:"btn btn-primary",children:[e.jsx("i",{className:"fas fa-refresh"})," Refresh"]})]})]}),e.jsxs("div",{className:"requests-table-container",children:[e.jsxs("table",{className:"admin-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"ID"}),e.jsx("th",{children:"NIN"}),e.jsx("th",{children:"User"}),e.jsx("th",{children:"API Version"}),e.jsx("th",{children:"Search Type"}),e.jsx("th",{children:"Created At"}),e.jsx("th",{children:"Actions"})]})}),e.jsx("tbody",{children:l.map(a=>e.jsxs("tr",{children:[e.jsx("td",{children:a.id}),e.jsx("td",{children:a.nin||"N/A"}),e.jsx("td",{children:a.user?.name||"N/A"}),e.jsx("td",{children:a.api_version||"N/A"}),e.jsx("td",{children:a.search_type||"N/A"}),e.jsx("td",{children:c(a.created_at)}),e.jsx("td",{children:e.jsxs("div",{className:"action-buttons",children:[e.jsxs("button",{className:"btn btn-sm btn-primary",children:[e.jsx("i",{className:"fas fa-eye"}),"View"]}),e.jsxs("button",{className:"btn btn-sm btn-secondary",children:[e.jsx("i",{className:"fas fa-download"}),"Download"]})]})})]},a.id))})]}),n?.links&&e.jsx("div",{className:"pagination",children:n.links.map((a,i)=>e.jsx(r,{href:a.url||"#",className:a.active?"pagination-link active":"pagination-link",dangerouslySetInnerHTML:{__html:a.label}},i))})]})]}),e.jsx("style",{children:`
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

                .requests-table-container {
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

                .btn-primary {
                    background: #059669;
                    color: white;
                }
            `})]})};export{h as default};
