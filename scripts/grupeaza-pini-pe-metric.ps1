param(
    [string]$Source = 'C:\Users\laure\OneDrive\Work\Website\welding\ZK\dwg\pini - Copie',

    [string]$Destination = 'C:\Users\laure\OneDrive\Work\Website\welding\ZK\dwg\pini - Copie - metric',

    [switch]$Move
)

$ErrorActionPreference = 'Stop'

function Get-PinClassification {
    param([string]$Reference)

    if ($Reference -notmatch '^8228ZK(\d{5})$') {
        return $null
    }

    $number = [int]$Matches[1]
    $ranges = @(
        @{ From = 10000; To = 10015; Metric = 'M4';  Type = 'long' },
        @{ From = 10016; To = 10031; Metric = 'M5';  Type = 'long' },
        @{ From = 10032; To = 10052; Metric = 'M6';  Type = 'long' },
        @{ From = 10053; To = 10078; Metric = 'M8';  Type = 'long' },
        @{ From = 10079; To = 10099; Metric = 'M10'; Type = 'long' },
        @{ From = 10100; To = 10120; Metric = 'M12'; Type = 'long' },

        @{ From = 10300; To = 10315; Metric = 'M4';  Type = 'collar' },
        @{ From = 10316; To = 10331; Metric = 'M5';  Type = 'collar' },
        @{ From = 10332; To = 10352; Metric = 'M6';  Type = 'collar' },
        @{ From = 10353; To = 10378; Metric = 'M8';  Type = 'collar' },
        @{ From = 10379; To = 10399; Metric = 'M10'; Type = 'collar' },
        @{ From = 10400; To = 10420; Metric = 'M12'; Type = 'collar' },

        @{ From = 11000; To = 11015; Metric = 'M4';  Type = 'short' },
        @{ From = 11016; To = 11031; Metric = 'M5';  Type = 'short' },
        @{ From = 11032; To = 11052; Metric = 'M6';  Type = 'short' },
        @{ From = 11053; To = 11078; Metric = 'M8';  Type = 'short' },
        @{ From = 11079; To = 11099; Metric = 'M10'; Type = 'short' },
        @{ From = 11100; To = 11120; Metric = 'M12'; Type = 'short' }
    )

    foreach ($range in $ranges) {
        if ($number -ge $range.From -and $number -le $range.To) {
            return [pscustomobject]@{
                Reference = $Reference
                Metric    = $range.Metric
                Type      = $range.Type
            }
        }
    }

    return $null
}

$sourcePath = (Resolve-Path -LiteralPath $Source).Path
$destinationPath = [IO.Path]::GetFullPath($Destination)

if ($sourcePath -eq $destinationPath) {
    throw 'Source si Destination trebuie sa fie directoare diferite.'
}

New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null

$files = Get-ChildItem -LiteralPath $sourcePath -File -Recurse
$copied = 0
$skipped = [System.Collections.Generic.List[string]]::new()

foreach ($file in $files) {
    $match = [regex]::Match($file.FullName, '8228ZK\d{5}')
    if (-not $match.Success) {
        $skipped.Add($file.FullName)
        continue
    }

    $classification = Get-PinClassification -Reference $match.Value
    if ($null -eq $classification) {
        # Include aici seriile 7/16-20 UNF si orice reper din afara M4-M12.
        $skipped.Add($file.FullName)
        continue
    }

    $targetFolder = Join-Path $destinationPath $classification.Metric
    $targetFolder = Join-Path $targetFolder $classification.Type
    $targetFolder = Join-Path $targetFolder $classification.Reference
    New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null

    $targetFile = Join-Path $targetFolder $file.Name
    if ($Move) {
        Move-Item -LiteralPath $file.FullName -Destination $targetFile -Force
    }
    else {
        Copy-Item -LiteralPath $file.FullName -Destination $targetFile -Force
    }
    $copied++
}

Write-Host "Fisiere procesate: $copied"
Write-Host "Fisiere ignorate: $($skipped.Count)"
Write-Host "Rezultat: $destinationPath"

if ($skipped.Count -gt 0) {
    $reportPath = Join-Path $destinationPath '_fisiere_ignorate.txt'
    $skipped | Sort-Object -Unique | Set-Content -LiteralPath $reportPath -Encoding utf8
    Write-Host "Raport ignorate: $reportPath"
}
