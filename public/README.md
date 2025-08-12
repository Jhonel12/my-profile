# Public Assets Directory

This directory contains static assets that will be served directly by the web server.

## Image Placement

### Profile Images
- Place your profile image as `profile-image.jpg` in this directory
- Recommended size: 512x512 pixels or larger (square aspect ratio)
- Supported formats: JPG, PNG, WebP
- The image will be automatically resized and optimized by the browser

### Other Images
- You can add other images here for use in your portfolio
- Reference them in your components using paths like `/image-name.jpg`

## File Structure
```
public/
├── profile-image.jpg     # Your main profile photo
├── project-screenshots/  # Screenshots of your projects
├── favicon.ico          # Website favicon
└── README.md           # This file
```

## Tips for Profile Image
- Use a professional headshot or high-quality photo
- Ensure good lighting and clear background
- Square aspect ratio works best (1:1)
- File size should be under 500KB for optimal loading
- Consider using WebP format for better compression
