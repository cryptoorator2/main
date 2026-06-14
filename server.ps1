$ports = 8080..8090
$listener = New-Object System.Net.HttpListener
$started = $false
$port = 8080

foreach ($p in $ports) {
    try {
        $listener.Prefixes.Clear()
        $listener.Prefixes.Add("http://localhost:$p/")
        $listener.Start()
        $port = $p
        $started = $true
        break
    } catch {
        # Port taken, try next one
    }
}

if (-not $started) {
    Write-Host "Error: Could not find an open port from 8080 to 8090."
    exit
}

Write-Host "Server successfully started on http://localhost:$port/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $rawUrl = $request.RawUrl.Split('?')[0]
        if ($rawUrl -eq "/") { $rawUrl = "/index.html" }
        
        $cleanUrl = $rawUrl.Replace("/", "\")
        if ($cleanUrl.StartsWith("\")) { $cleanUrl = $cleanUrl.Substring(1) }
        $filePath = Join-Path "C:\Users\pubgx\.gemini\antigravity\scratch\crypto-orator-3d" $cleanUrl
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            if ($filePath -like "*.html") { $response.ContentType = "text/html; charset=utf-8" }
            elseif ($filePath -like "*.css") { $response.ContentType = "text/css" }
            elseif ($filePath -like "*.js") { $response.ContentType = "application/javascript" }
            elseif ($filePath -like "*.svg") { $response.ContentType = "image/svg+xml" }
            else { $response.ContentType = "application/octet-stream" }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $response.StatusDescription = "Not Found"
        }
        $response.Close()
    } catch {
        # Handle exceptions gracefully to keep server running
    }
}
