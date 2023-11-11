export default function handler(_req, res){
  res.setHeader('set-cookie', 'frontend-masters-auth=true; path=/;');
  res.json({status: 'ok'});
}
