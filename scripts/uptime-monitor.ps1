# ChMS Uptime Monitoring Script (PowerShell)
# This script can be run as a scheduled task to monitor application health

param(
    [string]$ApiUrl = "http://localhost:8000/api/health",
    [string]$AlertEmail = "admin@churchafrica.com",
    [string]$LogFile = "C:\logs\chms-uptime.log",
    [int]$MaxRetries = 3,
    [int]$RetryDelay = 60,
    [string]$WebhookUrl = "",
    [string]$Action = "check"
)

# Ensure log directory exists
$LogDir = Split-Path $LogFile -Parent
if (!(Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

# Logging function
function Write-Log {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry
}

# Send alert function
function Send-Alert {
    param(
        [string]$Message,
        [string]$Status
    )
    
    Write-Log "ALERT: $Message"
    
    # Send email alert (requires Send-MailMessage)
    if ($AlertEmail -and $AlertEmail -ne "admin@churchafrica.com") {
        try {
            Send-MailMessage -To $AlertEmail -Subject "ChMS Health Alert - $Status" -Body $Message -SmtpServer "localhost"
        } catch {
            Write-Log "Failed to send email alert: $($_.Exception.Message)"
        }
    }
    
    # Send webhook alert (if configured)
    if ($WebhookUrl) {
        try {
            $Body = @{
                text = "ChMS Health Alert: $Message"
            } | ConvertTo-Json
            
            Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $Body -ContentType "application/json"
        } catch {
            Write-Log "Failed to send webhook alert: $($_.Exception.Message)"
        }
    }
}

# Check health endpoint
function Test-Health {
    param(
        [string]$Url,
        [int]$Attempt
    )
    
    Write-Log "Health check attempt $Attempt for $Url"
    
    try {
        $Response = Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 30 -ErrorAction Stop
        
        if ($Response.status -eq "healthy") {
            Write-Log "✅ Health check passed - Status: $($Response.status)"
            return $true
        } elseif ($Response.status -eq "degraded") {
            Write-Log "⚠️  Health check degraded - Status: $($Response.status)"
            return $false
        } else {
            Write-Log "❌ Health check failed - Status: $($Response.status)"
            return $false
        }
    } catch {
        Write-Log "❌ Health check failed - Error: $($_.Exception.Message)"
        return $false
    }
}

# Main monitoring function
function Start-Monitoring {
    param([string]$Url)
    
    $Retries = 0
    
    while ($Retries -lt $MaxRetries) {
        if (Test-Health -Url $Url -Attempt ($Retries + 1)) {
            Write-Log "✅ Service is healthy"
            return $true
        } else {
            $Retries++
            if ($Retries -lt $MaxRetries) {
                Write-Log "⏳ Retrying in $RetryDelay seconds... ($Retries/$MaxRetries)"
                Start-Sleep -Seconds $RetryDelay
            }
        }
    }
    
    # All retries failed
    Send-Alert -Message "ChMS health check failed after $MaxRetries attempts. URL: $Url" -Status "CRITICAL"
    return $false
}

# Check additional endpoints
function Test-AdditionalEndpoints {
    $BaseUrl = $ApiUrl -replace "/api/health$", ""
    $Endpoints = @(
        "/api/monitoring/health",
        "/api/monitoring/metrics"
    )
    
    foreach ($Endpoint in $Endpoints) {
        $FullUrl = "$BaseUrl$Endpoint"
        Write-Log "Checking endpoint: $FullUrl"
        
        try {
            $Response = Invoke-RestMethod -Uri $FullUrl -Method Get -TimeoutSec 10 -ErrorAction Stop
            Write-Log "✅ Endpoint $Endpoint is responding"
        } catch {
            Write-Log "⚠️  Endpoint $Endpoint is not responding"
        }
    }
}

# Performance check
function Test-Performance {
    param([string]$Url)
    
    $StartTime = Get-Date
    
    if (Test-Health -Url $Url -Attempt 1) {
        $EndTime = Get-Date
        $ResponseTime = ($EndTime - $StartTime).TotalMilliseconds
        
        Write-Log "Response time: $([math]::Round($ResponseTime))ms"
        
        # Alert on slow response
        if ($ResponseTime -gt 5000) {
            Send-Alert -Message "ChMS response time is slow: $([math]::Round($ResponseTime))ms" -Status "WARNING"
        }
    }
}

# Disk space check
function Test-DiskSpace {
    $Threshold = 90
    $Disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
    $Usage = [math]::Round((($Disk.Size - $Disk.FreeSpace) / $Disk.Size) * 100)
    
    if ($Usage -gt $Threshold) {
        Send-Alert -Message "Disk usage is high: $Usage% (threshold: $Threshold%)" -Status "WARNING"
    } else {
        Write-Log "Disk usage: $Usage%"
    }
}

# Memory check
function Test-Memory {
    $Threshold = 90
    $Memory = Get-WmiObject -Class Win32_OperatingSystem
    $Usage = [math]::Round((($Memory.TotalVisibleMemorySize - $Memory.FreePhysicalMemory) / $Memory.TotalVisibleMemorySize) * 100)
    
    if ($Usage -gt $Threshold) {
        Send-Alert -Message "Memory usage is high: $Usage% (threshold: $Threshold%)" -Status "WARNING"
    } else {
        Write-Log "Memory usage: $Usage%"
    }
}

# Main execution
function Start-Main {
    Write-Log "🚀 Starting ChMS uptime monitoring"
    Write-Log "API URL: $ApiUrl"
    Write-Log "Alert email: $AlertEmail"
    Write-Log "Max retries: $MaxRetries"
    
    # Check if API URL is accessible
    try {
        $TestResponse = Invoke-WebRequest -Uri $ApiUrl -Method Get -TimeoutSec 5 -ErrorAction Stop
    } catch {
        Send-Alert -Message "ChMS API is not accessible at $ApiUrl" -Status "CRITICAL"
        exit 1
    }
    
    # Run health checks
    if (Start-Monitoring -Url $ApiUrl) {
        Write-Log "✅ All health checks passed"
        
        # Additional checks
        Test-AdditionalEndpoints
        Test-Performance -Url $ApiUrl
        Test-DiskSpace
        Test-Memory
        
        Write-Log "🎉 Monitoring completed successfully"
    } else {
        Write-Log "❌ Health checks failed"
        exit 1
    }
}

# Handle command line arguments
switch ($Action.ToLower()) {
    "check" {
        Start-Main
    }
    "test" {
        Write-Host "Testing health endpoint: $ApiUrl"
        Test-Health -Url $ApiUrl -Attempt 1
    }
    "alerts" {
        Write-Host "Testing alert system"
        Send-Alert -Message "Test alert from ChMS monitoring" -Status "TEST"
    }
    default {
        Write-Host "Usage: .\uptime-monitor.ps1 [-Action {check|test|alerts}]"
        Write-Host ""
        Write-Host "Commands:"
        Write-Host "  check  - Run full health monitoring"
        Write-Host "  test   - Test health endpoint"
        Write-Host "  alerts - Test alert system"
        Write-Host ""
        Write-Host "Parameters:"
        Write-Host "  -ApiUrl        - API health endpoint URL"
        Write-Host "  -AlertEmail    - Email for alerts"
        Write-Host "  -LogFile       - Log file path"
        Write-Host "  -MaxRetries    - Maximum retry attempts"
        Write-Host "  -RetryDelay    - Delay between retries (seconds)"
        Write-Host "  -WebhookUrl    - Webhook URL for alerts"
        exit 1
    }
}
