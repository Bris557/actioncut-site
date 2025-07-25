# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Docusaurus-based website located in the `my-website/` directory. The project is a standard Docusaurus v3 site with:

- **Content**: Documentation in `docs/`, blog posts in `blog/`
- **Components**: React components in `src/components/` 
- **Pages**: Custom pages in `src/pages/`
- **Configuration**: Main config in `docusaurus.config.ts`, sidebar config in `sidebars.ts`
- **Styling**: Custom CSS in `src/css/custom.css`, component-specific CSS modules

## Development Commands

All commands should be run from the `my-website/` directory:

### Package Management
- Install dependencies: `npm install` or `yarn`

### Development
- Start development server: `npm start` or `yarn start`
- Build for production: `npm run build` or `yarn build`
- Serve production build locally: `npm run serve` or `yarn serve`
- Type checking: `npm run typecheck` or `yarn typecheck`

### Docusaurus-specific
- Clear cache: `npm run clear` or `yarn clear`
- Generate translations: `npm run write-translations`
- Generate heading IDs: `npm run write-heading-ids`
- Swizzle components: `npm run swizzle`

### Deployment
- Deploy to GitHub Pages (with SSH): `USE_SSH=true yarn deploy`
- Deploy to GitHub Pages (without SSH): `GIT_USER=<username> yarn deploy`

## Architecture

- **Framework**: Docusaurus 3.8.1 with TypeScript support
- **React Version**: 19.0.0
- **Styling**: CSS Modules + custom CSS, uses `clsx` for conditional classes
- **Content**: MDX support for enhanced markdown with React components
- **Theme**: Customizable with Prism syntax highlighting (GitHub light/Dracula dark themes)

## Key Configuration

- **docusaurus.config.ts**: Main site configuration including navigation, footer, theme settings
- **sidebars.ts**: Documentation sidebar structure (currently auto-generated from file structure)
- **tsconfig.json**: Extends Docusaurus TypeScript configuration with baseUrl set to project root

## Content Organization

- Documentation uses auto-generated sidebars from the `docs/` folder structure
- Blog supports RSS/Atom feeds, reading time estimation, and author management
- Static assets go in `static/` directory and are served at site root