// Next.js sends this boundary along with every React page, so it stays tiny.
// Unknown URLs get the full WordPress 404 page from app/global-not-found.tsx.
export default function NotFound() {
  return (
    <main style={{ padding: '120px 24px', textAlign: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>Page not found</h1>
      <p>
        <a href="/">Back to homepage</a>
      </p>
    </main>
  );
}
