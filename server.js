const http = require('http');
const fs = require('fs');

// ngasih file index.html ke tiap2 unit yang konek
const server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});


const io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    
    // ngasih kabar ke unit kalau sudah konek ke pusat
    socket.emit('pusatMessage', 'Kau udah Konek ke Server Pusat!');
    // Jika ada unit baru yang konek broadcast ke unit yang lama
    socket.broadcast.emit('pusatMessage', 'Unit lain ada yang terhubung ke server pusat');
    // setelah masukkan nama unit, jadikan sebuah session (nanti simpan ke DB)
    socket.on('unitMessage', function(namaUnit) {
        socket.namaUnit = namaUnit;
      });

    // saat ada kabar update dari unit yang terkonek
    socket.on('pusatMessage', function (message) {
        //ambil dari session yang udah terkonek
        console.log('Unit '+socket.namaUnit + ' ngomong: ' + message+ ' Simpenen');
    }); 
});

//port
server.listen(8012);