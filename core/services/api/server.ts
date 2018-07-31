import cors from 'kcors'
import koa from 'koa'
import koaBody from 'koa-bodyparser'
import router from './router'

const server = new koa()

server.use(cors())
server.use(koaBody())
server.use(router.routes())
server.use(router.allowedMethods())

export default server
