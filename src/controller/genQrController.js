const QRCode = require("qrcode");
module.exports = (container) => {
    const logger = container.resolve('logger')
    const {httpCode, serverHelper} = container.resolve('config')
    const registerQr = async (req, res) => {
        try {
            let img='';
            let qr= await QRCode.toDataURL('192.168.0.107:8009/qr/addqr',{
                color: {
                    dark: '#00F',
                    light: '#0000'
                },
                type: 'copyLink',
                width: 300,
                margin:10,
                scale: 10
            });
            img = `<image src= " `+qr+ `" />`
            return res.send(img);
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }


    const cancelQr = async (req,res) => {
        try {
            let img='';
            let qr= await QRCode.toDataURL('192.168.0.107:8009/qr/deleteqr',{
                color: {
                    dark: '#00F',
                    light: '#0000'
                },
                type: 'copyLink',
                width: 300,
                margin:10,
                scale: 10
            });
            img = `<image src= " `+qr+ `" />`
            return res.send(img);
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    return {
        registerQr,
        cancelQr
    }
}
