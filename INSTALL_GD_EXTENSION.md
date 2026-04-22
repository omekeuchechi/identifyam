# Installing GD Extension for PDF Generation

## Problem
The PHP GD extension is required by DomPDF for image processing and PDF generation. Without it, PDF generation will fail.

## Solution for XAMPP (Windows)

### Method 1: Enable GD Extension (Recommended)
1. Open your XAMPP installation directory
2. Navigate to `php\php.ini` (usually in `C:\xampp\php\`)
3. Find the line: `;extension=gd`
4. Remove the semicolon to uncomment it: `extension=gd`
5. Save the file
6. Restart Apache from XAMPP Control Panel

### Method 2: Verify GD is Available
Run this command in your project directory:
```bash
php -m | findstr -i gd
```

You should see `gd` in the output if it's installed.

### Method 3: Alternative for XAMPP
If GD is not available in your PHP installation:
1. Download the latest XAMPP with GD included
2. Or use a different PHP distribution that includes GD

## Solution for Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install php-gd
sudo systemctl restart apache2
```

## Solution for Linux (CentOS/RHEL)

```bash
sudo yum install php-gd
sudo systemctl restart httpd
```

## Verification
After installing, verify the extension is loaded:

```php
<?php
if (extension_loaded('gd')) {
    echo "GD extension is loaded!";
} else {
    echo "GD extension is NOT loaded.";
}
?>
```

## Current Status
Your system currently shows: "The PHP GD extension is required, but is not installed."

The application has been updated to provide HTML fallback when GD is not available, but PDF generation will work much better with GD installed.

## Benefits of Installing GD
- Proper PDF generation with images
- Better image quality in PDFs
- Faster PDF processing
- Full functionality for all PDF features

## Temporary Workaround
The application will now:
1. Detect if GD is available
2. Generate PDF if GD is installed
3. Fall back to HTML if GD is missing
4. Show a notice to users about the limitation
5. Allow users to print the HTML directly
