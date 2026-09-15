$files = Get-ChildItem -Path *.html -Exclude 'index.html', 'placeholder.html'
$scripts = "    <script src=`"https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js`"></script>`r`n    <script src=`"https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js`"></script>`r`n    <script src=`"firebase-sync.js`" defer></script>`r`n</head>"
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw
    if ($c -notmatch 'firebase-sync.js') {
        $c = $c -replace '</head>', $scripts
        Set-Content -Path $f.FullName -Value $c -NoNewline
    }
}
