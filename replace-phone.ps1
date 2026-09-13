$files = Get-ChildItem -Recurse -Include *.tsx,*.ts,*.json,*.md,*.html | 
    Where-Object { $_.FullName -notmatch '\\node_modules\\|\\\.next\\|\\terminals\\' }

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $newContent = $content -replace '\+84\s*765\s*452\s*515', '+1925 582 0779'
        $newContent = $newContent -replace '\+84765452515', '+1925 582 0779'
        
        if ($content -ne $newContent) {
            Set-Content $file.FullName -Value $newContent -NoNewline
            Write-Host "Updated: $($file.Name)"
        }
    }
    catch {
        # Skip files that can't be read
    }
}

Write-Host "Phone number replacement complete!"
