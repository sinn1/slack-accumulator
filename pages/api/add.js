
export default async (req, res) => {
  res.statusCode = 200;

  console.log(req);

  res.json({ name: 'John Doe' })
}
