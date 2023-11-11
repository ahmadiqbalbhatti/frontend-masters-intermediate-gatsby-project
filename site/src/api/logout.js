export default function handler(_req, res) {
  res.setHeader('set-cookie', 'frontend-masters-auth=true; path=/;'
                              + ' expires=Thu, 01 Jan 1970 00:00:00 GMT');
  res.json({ status: 'ok' });
}
