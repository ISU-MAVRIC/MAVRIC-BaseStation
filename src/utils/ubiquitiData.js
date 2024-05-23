const { readFileSync } = require('fs')
const { Client } = require('ssh2');

class RadioDataHandler {
    uptime() {
        const radio = new Client();
        radio.on('ready', () => {
            console.log("Connected to Ubiquiti");
            radio.exec('uptime',(err, stream) => {
                if (err) throw err;
                stream.on('close', (code, signal) => {
                    console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
            })
        }).connect({
            host: '192.168.1.21',
            port: 22,
            username: 'mavric',
            password: 'mavric'
        });
        return;
    }
}
