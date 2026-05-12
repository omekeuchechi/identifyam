<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #ff4757, #c44569);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
            margin: -30px -30px 30px -30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .alert-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .alert-details {
            background: #f8f9fa;
            padding: 20px;
            border-left: 4px solid #ff4757;
            margin: 20px 0;
            border-radius: 5px;
        }
        .detail-item {
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 5px;
        }
        .detail-label {
            font-weight: bold;
            color: #666;
            display: inline-block;
            width: 150px;
        }
        .detail-value {
            color: #333;
        }
        .user-info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .action-buttons {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #ff4757;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 0 10px;
        }
        .btn-secondary {
            background: #6c757d;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
        .high-severity {
            color: #ff4757;
            font-weight: bold;
        }
        .medium-severity {
            color: #ffa502;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="alert-icon">🚨</div>
            <h1>SECURITY ALERT</h1>
            <p>{{ $alertType }}</p>
        </div>

        <div class="user-info">
            <h3>User Information</h3>
            <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ $user->name }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ $user->email }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">User ID:</span>
                <span class="detail-value">#{{ $user->id }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Admin Status:</span>
                <span class="detail-value">{{ $user->isAdmin ? 'Yes' : 'No' }}</span>
            </div>
        </div>

        <div class="alert-details">
            <h3>Alert Details</h3>
            @foreach($details as $key => $value)
                <div class="detail-item">
                    <span class="detail-label">{{ ucwords(str_replace('_', ' ', $key)) }}:</span>
                    <span class="detail-value">
                        @if(is_array($value))
                            {{ json_encode($value) }}
                        @else
                            {{ $value }}
                        @endif
                    </span>
                </div>
            @endforeach
        </div>

        <div class="alert-details">
            <h3>System Information</h3>
            <div class="detail-item">
                <span class="detail-label">Timestamp:</span>
                <span class="detail-value">{{ now()->format('Y-m-d H:i:s') }}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Server:</span>
                <span class="detail-value">{{ request()->getHost() }}</span>
            </div>
        </div>

        <div class="action-buttons">
            <a href="{{ config('app.url') }}/admin/security-logs" class="btn">View Security Logs</a>
            <a href="{{ config('app.url') }}/admin/users/{{ $user->id }}/edit" class="btn btn-secondary">Review User</a>
        </div>

        <div class="footer">
            <p>This is an automated security alert from IdentifyAM.</p>
            <p>If you believe this is a false positive, please review the security logs.</p>
            <p>Generated at: {{ now()->format('Y-m-d H:i:s') }}</p>
        </div>
    </div>
</body>
</html>
