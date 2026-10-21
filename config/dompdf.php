<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Settings
    |--------------------------------------------------------------------------
    |
    */
    'show_warnings' => false,   // Throw an Exception on warnings from dompdf
    'convert_fonts' => true,    // Convert fonts to be embedded
    'log_output_file' => storage_path('logs/dompdf.log'), // Log file destination

    /*
    |--------------------------------------------------------------------------
    | Options
    |--------------------------------------------------------------------------
    |
    */
    'options' => [
        'defaultFont' => 'Arial',
        'fontDir' => storage_path('fonts/'),
        'fontCache' => storage_path('fonts/'),
        'tempDir' => storage_path('temp/'),
        'chroot' => [public_path(), storage_path()],
        'isRemoteEnabled' => true,
        'isHtml5ParserEnabled' => true,
        'enableCssFloat' => true,
        'enablePhp' => false,
        'fontHeightRatio' => 1.1,
        'javascript' => false,
        'enableRemote' => true,
    ],
];
