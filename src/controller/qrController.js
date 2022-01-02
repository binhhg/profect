const app = require('express')()
const session = require('express-session')
const {nanoid} = require("nanoid")
module.exports = (container) => {
    const logger = container.resolve('logger')
    const ObjectId = container.resolve('ObjectId')
    const {
        schemaValidator,
        schemas: {
            Qr
        }
    } = container.resolve('models')
    let number = 0
    const {httpCode, serverHelper} = container.resolve('config')
    const {qrRepo, queueRepo} = container.resolve('repo')
    const addQr = async (req, res) => { // đăng ký, nếu đã tồn tại thì sẽ trả lại số và vị trí mới trong hạng đợi
        try {
            const test = await queueRepo.getQueueAgg([
                {
                    $match: {
                        isActive: 0,
                        deleted: 0
                    }
                },
                {
                    $lookup: {
                        from: 'qrs',
                        let: {id: '$_id'},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$queueId', '$$id']
                                    }
                                }
                            },
                            {
                                $match: {
                                    'state': 1
                                }
                            }

                        ],
                        as: 'qrs'
                    }
                }
            ])
            if (test.length === 0) {
                return res.status(httpCode.BAD_REQUEST).send("khong co hang doi nao")
            }
            let queueid = test[0]
            test.forEach(value => {
                if (queueid.qrs.length > value.qrs.length) {
                    queueid = value
                }
            })
            const id = req.session.cc
            if (!id) {
                req.session.cc = nanoid(16)
                const body = {
                    guestId: req.session.cc,
                    number: ++number,
                    queueId: queueid._id,
                    stt: ++queueid.qrs.length,
                    state: 1
                }
                const data = await qrRepo.addQr(body)
                return res.status(httpCode.CREATED).send(data)
            } else {
                const data = await qrRepo.findOne({guestId: id})
                if(data){
                    data.toObject()
                } else {
                    return res.status(httpCode.BAD_REQUEST).send('không tìm thấy thông tin!')
                }
                test.forEach(queue => {
                    if(queue._id.toString() === data.queueId.toString()){
                            const index = queue.qrs.map(i => i.guestId).indexOf(id)
                        if(index > -1) {
                            data.stt = index + 1
                        }
                    }
                })
                return res.status(httpCode.CREATED).send(data)
            }

        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).end()
        }
    }
    const deleteQr = async (req, res) => { // hủy. Trạng thái: CANCEL và xóa sesionid
        try {
            const y = req.session.cc
            if(y) {
                await qrRepo.updateQr({guestId: y}, {state: 4})
                req.session.destroy()
                res.status(httpCode.SUCCESS).send({ok: true})
            } else {
                res.status(httpCode.BAD_REQUEST).send("ban chua dang ki")
             }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const getQrById = async (req, res) => {
        try {
            const {id} = req.params
            if (id) {
                const qr = await qrRepo.getQrById(id)
                res.status(httpCode.SUCCESS).send(qr)
            } else {
                res.status(httpCode.BAD_REQUEST).end()
            }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const updateQr = async (req, res) => { // cập nhật trạng thái: 2: hoàn thành, 3, từ chối
        try {
            const { id } = req.params
            const body = req.body
            if (id ) {
                const data = await queueRepo.updateQueue(id,body )
                res.status(httpCode.SUCCESS).send(data)
            } else {
                res.status(httpCode.BAD_REQUEST).end()
            }
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    const getQr = async (req, res) => {
        try {
            let {
                page,
                perPage,
                sort,
                ids
            } = req.query
            page = +page || 1
            perPage = +perPage || 10
            sort = +sort === 0 ? {_id: 1} : +sort || {_id: -1}
            const skip = (page - 1) * perPage
            const search = {...req.query}
            if (ids) {
                if (ids.constructor === Array) {
                    search.id = {$in: ids}
                } else if (ids.constructor === String) {
                    search.id = {$in: ids.split(',')}
                }
            }
            delete search.ids
            delete search.page
            delete search.perPage
            delete search.sort
            const pipe = {}
            Object.keys(search).forEach(i => {
                const vl = search[i]
                const pathType = (Qr.schema.path(i) || {}).instance || ''
                if (pathType.toLowerCase() === 'objectid') {
                    pipe[i] = ObjectId(vl)
                } else if (pathType === 'Number') {
                    pipe[i] = +vl
                } else if (pathType === 'String' && vl.constructor === String) {
                    pipe[i] = new RegExp(vl, 'gi')
                } else {
                    pipe[i] = vl
                }
            })
            const data = await qrRepo.getQr(pipe, perPage, skip, sort)
            const total = await qrRepo.getCount(pipe)
            res.status(httpCode.SUCCESS).send({
                perPage,
                skip,
                sort,
                data,
                total,
                page
            })
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).send({ok: false})
        }
    }
    return {
        addQr,
        getQr,
        getQrById,
        updateQr,
        deleteQr
    }
}
