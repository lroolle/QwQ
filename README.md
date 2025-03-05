# Static Topic Explorer for Cloudflare Pages

A simple static site project that can serve multiple topic pages with automatic routing. This project is designed to be deployed on Cloudflare Pages.

## Project Structure

```
.
├── index.html          # Main entry point with auto-routing
├── public/             # Static assets
│   ├── css/
│   │   └── styles.css  # Main stylesheet
│   ├── js/             # JavaScript files (if needed)
│   └── assets/         # Images, fonts, etc.
└── pages/              # Content pages
    ├── topic1.html     # Sample topic page
    └── topic2.html     # Another sample topic page
```

## Features

- **Auto-routing**: The main index.html file automatically discovers and routes to content pages
- **No Framework Required**: Built with vanilla HTML, CSS, and JavaScript
- **Responsive Design**: Looks great on all devices
- **Easy to Extend**: Just add new HTML files to the pages directory

## How to Use

### Local Development

1. Clone this repository:
   ```
   git clone <repository-url>
   cd static-topic-explorer
   ```

2. Serve the project locally using any static file server. For example:
   ```
   # Using Python
   python -m http.server
   
   # Or using Node.js's http-server
   npx http-server
   ```

3. Open your browser and navigate to `http://localhost:8000` (or whatever port your server uses)

### Adding New Topics

To add a new topic page:

1. Create a new HTML file in the `pages` directory
2. Follow the structure of the existing topic pages
3. Your new topic will be automatically discovered by the main index

Example of a minimal topic page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Topic - Topic Explorer</title>
    <link rel="stylesheet" href="/public/css/styles.css">
</head>
<body>
    <main>
        <div class="container">
            <h2>Your Topic Title</h2>
            <p>Description of your topic.</p>
            
            <!-- Your content here -->
        </div>
    </main>
</body>
</html>
```

### Deployment to Cloudflare Pages

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Log in to the Cloudflare dashboard and navigate to Pages

3. Click "Create a project" and select your repository

4. Configure your build settings:
   - Build command: (leave empty for static sites)
   - Build output directory: (leave as root or specify `.`)
   - Root directory: (leave empty)

5. Click "Save and Deploy"

6. Your site will be deployed to a `*.pages.dev` domain

## Customization

- **Styles**: Edit `public/css/styles.css` to change the appearance
- **Auto-discovery**: For more advanced page discovery in production, consider implementing a build process to generate a manifest file

## Notes for Production Use

In a real production environment, you might want to:

1. Implement a build step to generate a pages manifest
2. Add SEO optimization
3. Implement analytics
4. Add a custom domain

## License

[MIT License](LICENSE) 