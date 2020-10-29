const request = require( 'request' )
const sign = require( './' )
const event = require( './lib/event' )

const Service = sign.Service
const service = sign.service
const createJar = sign.createJar

const BDUSS = process.env.BDUSS || ''
const PUSH_KEY = process.env.PUSH_KEY

// 信息统计
const count = {
  success: 0,
  alreadySigned: 0,
  failed: 0,
  notSupported: 0,
}
event.on( 'sign:success', function ( data ) {
  count.success++
} )
event.on( 'sign:already-signed', function ( data ) {
  count.alreadySigned++
} )
event.on( 'sign:failed', function ( data ) {
  count.failed++
} )
event.on( 'sign:not-support', function ( data ) {
  count.notSupported++
} )

const startTime = Date.now()
event.on( 'sign:end', function ( data ) {
  const title = `[贴吧签到] - ${ new Date().toLocaleDateString() }`

  const report = []
  report.push( '本次签到耗时：' + ( Date.now() - startTime ) / 1000 + 's' )
  report.push( '签到成功/已签到：' + ( count.success + count.alreadySigned ) )
  report.push( '不支持签到：' + count.notSupported )
  report.push( '签到失败：' + count.failed )
  const reportString = report.join( '\n\n' )

  if ( PUSH_KEY ) {
    request( {
      uri:  `https://sc.ftqq.com/${ PUSH_KEY }.send`,
      form: { text: title, desp: reportString },
      json: true,
      method: 'POST'
    } )
  }
} )

;( async function () {
  // setup Service
  Service.jar( createJar( [
    [
      'BDUSS=' + BDUSS,
      'http://tieba.baidu.com'
    ],
    [
      'novel_client_guide=1',
      'http://tieba.baidu.com'
    ],
  ] ) )

  try {
    await service.skipAd()

    const profile = await service.getProfile( BDUSS )
    const username = profile.username
    if ( username ) {
      console.log( '开始用户 ' + username + ' 的签到' )
    } else {
      console.log( '开始签到' )
    }

    const likes = ( await service.getlikesFast( BDUSS ) ) || []
    console.log( '共', likes.length, '个贴吧\n' )
    await service.sign( likes )
  } catch( e ) {
    throw e
  }
} )()
