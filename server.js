const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'eticaret'
});

db.connect(err => {
  if (err) console.error('Bağlantı hatası:', err);
  else console.log('MySQL bağlantısı başarılı!');
});

app.post('/api/kayit', (req, res) => {
  const { ad, email } = req.body;
  db.query('INSERT INTO kullanicilar (ad, email) VALUES (?, ?)', [ad, email], (err) => {
    if (err) return res.status(500).json({ mesaj: 'Hata oluştu' });
    res.json({ mesaj: 'Kayıt başarılı!' });
  });
});

app.post('/api/sepet', (req, res) => {
  const { kullanici_email, urun_adi, urun_fiyat, adet } = req.body;
  db.query('INSERT INTO sepet (kullanici_email, urun_adi, urun_fiyat, adet) VALUES (?, ?, ?, ?)',
    [kullanici_email, urun_adi, urun_fiyat, adet], (err) => {
    if (err) return res.status(500).json({ mesaj: 'Hata oluştu' });
    res.json({ mesaj: 'Sepete eklendi!' });
  });
});

// Kullanıcının siparişlerini getir
app.get('/api/siparisler/:email', (req, res) => {
  const email = req.params.email;
  db.query('SELECT * FROM sepet WHERE kullanici_email = ? ORDER BY created_at DESC',
    [email], (err, results) => {
    if (err) return res.status(500).json({ mesaj: 'Hata oluştu' });
    res.json(results);
  });
});

app.listen(3000, () => console.log('Server 3000 portunda çalışıyor.'));