Write-Host "Updating Version to 1.0.1"
Set-Content -Path ./.dist/task.json -Value (Get-Content ./.dist/task.json).replace('#{GitVersion.Major}#', '1')
Set-Content -Path ./.dist/task.json -Value (Get-Content ./.dist/task.json).replace('#{GitVersion.Minor}#', '0')
Set-Content -Path ./.dist/task.json -Value (Get-Content ./.dist/task.json).replace('#{GitVersion.Patch}#', '1')