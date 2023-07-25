const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const crypto = require('crypto');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const io = new Server(server);


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // JSON verileri için body-parser kullanın
app.use(bodyParser.urlencoded({ extended: true })); // URL kodlu veriler için body-parser kullanın




function formatAmountInUSD(amount) {
  // JavaScript Intl.NumberFormat API'sini kullanarak dolar para birimi biçimini oluşturun
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  // Fonksiyonu çağırdığınızda bakiyeyi dolar bazında belirtilen formatta döndürün
  return formatter.format(amount);
}



app.get('/', (req, res) => {

                // Veritabanı bağlantısı için gerekli bilgiler
                const connection = mysql.createConnection({
                  host: '141.136.43.101', // Veritabanı sunucu adresi
                  user: 'u167899799_viviboss',      // Kullanıcı adı
                  password: 'Jada040302!', // Şifre (eğer belirtilmişse)
                  database: 'u167899799_viviboss' // Veritabanı adı
                });

        console.log('Veritabanına başarıyla bağlandı!');



            const email = req.query.email;

          // "id" verisi varsa
              if (!email) {
                res.redirect('https://www.viviboss.com/');
              }     


                    const userData = {
                              email: email
                            };



                const sql = 'SELECT * FROM users WHERE ?';

                // Sorguyu çalıştırma
                connection.query(sql, userData , (err, results) => {


                if (err) {
                  console.error('Sorgu hatası: ' + err.stack);
                  return;
                }

                 if (results.affectedRows < 1) {
                  // Eğer sorgu başarılı bir şekilde çalıştıysa, kullanıcıyı başka bir sayfaya yönlendir
                  res.redirect('https://www.viviboss.com/');
                }


         if (results.length > 0) {
              const balance = formatAmountInUSD(results[0].balance+results[0].earning+results[0].referance_earning);
              const balance_2 = results[0].balance+results[0].earning+results[0].referance_earning;
              const username = results[0].username;
              const profil = results[0].profil;
              const id = results[0].id;
              
              // Veriyi index.html sayfasına gönderme ve sayfayı render etme
              res.render('index', { balance, username, id, balance_2, profil });
            } 


        
  });


    connection.end((err) => {
      if (err) {
        console.error('Bağlantı kapatılamadı: ' + err.stack);
        return;
      }
      console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
    });
   
});



        app.post('/bet', (req, res) => {

                // Veritabanı bağlantısı için gerekli bilgiler
                const connection = mysql.createConnection({
                  host: '141.136.43.101', // Veritabanı sunucu adresi
                  user: 'u167899799_viviboss',      // Kullanıcı adı
                  password: 'Jada040302!', // Şifre (eğer belirtilmişse)
                  database: 'u167899799_viviboss' // Veritabanı adı
                });

                console.log('Veritabanına başarıyla bağlandı!');


                var id = req.body.userid;

                const sql = 'SELECT * FROM users WHERE id='+id+'';

                 // Sorguyu çalıştırma
                connection.query(sql, (err, results) => {

                    var bet = req.body.bet;
                    var finish = req.body.finish;
                    var amount = req.body.amount;


                    if (bet==finish && amount < results[0].balance+results[0].earning+results[0].referance_earning) {

                        // Veritabanı bağlantısı için gerekli bilgiler
                            const connection = mysql.createConnection({
                              host: '141.136.43.101', // Veritabanı sunucu adresi
                              user: 'u167899799_viviboss',      // Kullanıcı adı
                              password: 'Jada040302!', // Şifre (eğer belirtilmişse)
                              database: 'u167899799_viviboss' // Veritabanı adı
                            });


                        var new_balance = Number(results[0].balance) + Number(amount);

                        const userData = {
                              amount: amount,
                              process: "0",
                              user_id: id,
                              status:"1",
                              wallet:"game"
                            };

                            const insertQuery = 'INSERT INTO transactions (amount, process, user_id, status, wallet) VALUES (?, ?, ?, ?, ?) ';

                            connection.query(insertQuery, [userData.amount, userData.process, userData.user_id, userData.status, userData.wallet], (err, results) => {
                                  if (err) {
                                    console.error('Veri ekleme hatası:', err);
                                  } else {
                                    console.log('Veri başarıyla eklendi.');
                                  }

                              });


                            connection.end();

                        const resultData = {
                            status: 'success+',
                            message: 'Congratulations You Won. +',
                            balance_2: new_balance+results[0].earning+results[0].referance_earning,
                            balance: formatAmountInUSD(new_balance+results[0].earning+results[0].referance_earning), 
                          };

                        res.json(resultData);


                    }else if(amount < results[0].balance+results[0].earning+results[0].referance_earning){


                                        // Veritabanı bağlantısı için gerekli bilgiler
                                const connection = mysql.createConnection({
                                  host: '141.136.43.101', // Veritabanı sunucu adresi
                                  user: 'u167899799_viviboss',      // Kullanıcı adı
                                  password: 'Jada040302!', // Şifre (eğer belirtilmişse)
                                  database: 'u167899799_viviboss' // Veritabanı adı
                                });


                        var new_balance = Number(results[0].balance) - Number(amount);

                            const userData = {
                              amount: amount,
                              process: "1",
                              user_id: id,
                              status:"1",
                              wallet:"game"
                            };

                            const insertQuery = 'INSERT INTO transactions (amount, process, user_id, status, wallet) VALUES (?, ?, ?, ?, ?) ';

                            connection.query(insertQuery, [userData.amount, userData.process, userData.user_id, userData.status, userData.wallet], (err, results) => {
                                  if (err) {
                                    console.error('Veri ekleme hatası:', err);
                                  } else {
                                    console.log('Veri başarıyla eklendi.');
                                  }

                              });

                                connection.end();


                        const resultData = {
                            status: 'success-',
                            message: 'Unfortunately you lost. -',
                            balance_2: new_balance+results[0].earning+results[0].referance_earning,
                            balance: formatAmountInUSD(new_balance+results[0].earning+results[0].referance_earning), 
                          };

                        res.json(resultData);

                    }else{

                        const resultData = {
                            status: 'error',
                            message: 'Balance Error Please Refresh Page!',
                            balance: formatAmountInUSD(results[0].balance+results[0].earning+results[0].referance_earning), 
                          };

                        res.json(resultData);
                    }


                            // Veritabanı bağlantısı için gerekli bilgiler
                        const connection = mysql.createConnection({
                          host: '141.136.43.101', // Veritabanı sunucu adresi
                          user: 'u167899799_viviboss',      // Kullanıcı adı
                          password: 'Jada040302!', // Şifre (eğer belirtilmişse)
                          database: 'u167899799_viviboss' // Veritabanı adı
                        });


                        const updateSql = 'UPDATE users SET balance = ? WHERE id = ?';
                        const updateValues = [new_balance, results[0].id]; // Parametreleri bir dizi olarak veriyoruz

                        // Sorguyu çalıştırma
                        connection.query(updateSql, updateValues, (err, result) => {
                          if (err) {
                            console.error('Veri güncelleme hatası: ' + err.stack);
                            return;
                          }
                          console.log('Kullanıcı başarıyla güncellendi.');
                        });




                        connection.end((err) => {
                          if (err) {
                            console.error('Bağlantı kapatılamadı: ' + err.stack);
                            return;
                          }
                          console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
                        });



            });


                connection.end((err) => {
                  if (err) {
                    console.error('Bağlantı kapatılamadı: ' + err.stack);
                    return;
                  }
                  console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
                });


        });







//random numara 
function getRandomNumber() {
  
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  return randomNumber;
}



//degerler
let userCount = 0;
let counter = 11;
let counterInterval = null; // SetInterval referansını saklamak için değişken



//donen fonskiyon
function updateCounter() {
    if (counter === 0) {

        // Sayaç 0 olduğunda 5 saniye bekle ve tekrar saymaya başla
        io.emit('finish', getRandomNumber());

        clearInterval(counterInterval);
        counterInterval = null;

        setTimeout(() => {
            counter = 11;
            counterInterval = setInterval(updateCounter, 1000);




            
        }, 5000);

            } else {
                counter--;
            }
            io.emit('counter', counter);
    }








io.on('connection', (socket) => {
    userCount++;
    console.log('A user connected. Current user count:', userCount);
    io.emit('userCount', userCount);

    if (userCount === 1) {
        // İlk kullanıcı bağlandığında ve setInterval başlatılmamışsa
        if (!counterInterval) {
            counterInterval = setInterval(updateCounter, 1000);
        }

        userCount++;
    }



    socket.on('disconnect', () => {
        userCount--;
        console.log('A user disconnected. Current user count:', userCount);
        io.emit('userCount', userCount);

        if (userCount === 0) {
            // Son kullanıcı ayrıldığında setInterval'i durdur
            clearInterval(counterInterval);
            counterInterval = null; // setInterval'i sıfırla
        }
    });


});











// Sunucuyu başlatma

server.listen(3000, () => {
    console.log('listening on *:3000');
});
