const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

describe('Archivos de Configuración SEO, IA y Despliegue', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('robots.txt debe existir y permitir indexación con referencia al sitemap', () => {
    const robotsPath = path.join(rootDir, 'robots.txt');
    assert.ok(fs.existsSync(robotsPath), 'robots.txt debe existir');

    const content = fs.readFileSync(robotsPath, 'utf8');
    assert.ok(content.includes('User-agent: *'), 'robots.txt debe declarar User-agent: *');
    assert.ok(content.includes('Allow: /'), 'robots.txt debe permitir acceso');
    assert.ok(content.includes('Sitemap:'), 'robots.txt debe enlazar a sitemap.xml');
  });

  it('sitemap.xml debe existir y ser un XML válido con la URL principal', () => {
    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml debe existir');

    const content = fs.readFileSync(sitemapPath, 'utf8');
    assert.ok(content.startsWith('<?xml'), 'sitemap.xml debe comenzar con la declaración XML');
    assert.ok(content.includes('<urlset'), 'sitemap.xml debe contener <urlset>');
    assert.ok(content.includes('<loc>'), 'sitemap.xml debe contener <loc>');
  });

  it('llms.txt debe existir para navegadores basados en IA (Agentic Browsing)', () => {
    const llmsPath = path.join(rootDir, 'llms.txt');
    assert.ok(fs.existsSync(llmsPath), 'llms.txt debe existir');

    const content = fs.readFileSync(llmsPath, 'utf8');
    assert.ok(content.includes('Real Alto'), 'llms.txt debe tener información de Real Alto');
    assert.ok(content.includes('WebAR'), 'llms.txt debe describir el recorrido WebAR');
  });

  it('_headers de Cloudflare Pages debe existir con reglas de caché inmutable', () => {
    const headersPath = path.join(rootDir, '_headers');
    assert.ok(fs.existsSync(headersPath), '_headers debe existir');

    const content = fs.readFileSync(headersPath, 'utf8');
    assert.ok(content.includes('/assets/*'), '_headers debe configurar caché para /assets/*');
    assert.ok(content.includes('max-age=31536000, immutable'), '_headers debe tener caché inmutable');
  });

  it('index.html debe tener doctype, lang, meta description, viewport y Open Graph', () => {
    const htmlPath = path.join(rootDir, 'index.html');
    assert.ok(fs.existsSync(htmlPath), 'index.html debe existir');

    const html = fs.readFileSync(htmlPath, 'utf8');
    assert.ok(html.includes('<!DOCTYPE html>'), 'Debe tener doctype HTML5');
    assert.ok(html.includes('<html lang="es">'), 'Debe definir el idioma del documento');
    assert.ok(html.includes('<meta name="description"'), 'Debe tener meta description');
    assert.ok(html.includes('<meta name="viewport"'), 'Debe tener viewport meta');
    assert.ok(html.includes('<meta property="og:title"'), 'Debe tener Open Graph title');
    assert.ok(html.includes('id="ar-scene-container"'), 'Debe contener el contenedor WebAR modular');
  });
});
