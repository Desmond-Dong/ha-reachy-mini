@echo off
REM Build script for Reachy Mini 3D Card - Windows version

echo Building Reachy Mini 3D Card...

REM Run rollup build
call npx rollup -c

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    exit /b 1
)

echo Creating gzip compressed files...
powershell -Command "function Create-GzipFile { param($SourceFile); $DestFile = \"$SourceFile.gz\"; $Content = Get-Content $SourceFile -Raw -Encoding Byte; $MemoryStream = New-Object System.IO.MemoryStream; $GzipStream = New-Object System.IO.Compression.GzipStream($MemoryStream, [System.IO.Compression.CompressionLevel]::Optimal); $GzipStream.Write($Content, 0, $Content.Length); $GzipStream.Close(); $MemoryStream.Close(); [System.IO.File]::WriteAllBytes($DestFile, $MemoryStream.ToArray()) }; Create-GzipFile 'ha-reachy-mini-card.js'; Create-GzipFile 'lib\three.js'; Create-GzipFile 'lib\OrbitControls.js'; Create-GzipFile 'lib\urdf-loader.js'; Create-GzipFile 'lib\URDFClasses.js'; Create-GzipFile 'lib\URDFDragControls.js'; Write-Host '✅ Gzip files created'"

echo Build completed successfully!
echo Output files:
echo   - ha-reachy-mini-card.js
echo   - ha-reachy-mini-card.js.gz
echo   - lib\*.js
echo   - lib\*.js.gz
