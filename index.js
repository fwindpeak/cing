#!/usr/bin/env node

const fs = require('fs')
const { program } = require('commander')
const got = require('got')

program.version('1.0.1')

const CONFIG_FILE_PATH = '/usr/local/etc/cing.json'

POST_URL = 'https://ing.cnblogs.com/ajax/ing/Publish'
HEADERS = {
  accept: 'application/json, text/javascript, */*; q=0.01',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9',
  'content-type': 'application/x-www-form-urlencoded',
  cookie: '',
  dnt: '1',
  origin: 'https://ing.cnblogs.com',
  referer: 'https://ing.cnblogs.com/',
  'sec-ch-ua': '"Not A;Brand";v="99", "Chromium";v="6"',
  'sec-ch-ua-mobile': '?0',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
  'x-requested-with': 'XMLHttpRequest'
}

CONTENT = {
  content: '',
  publicFlag: 1
}

function readCookie() {
  try {
    const data = fs.readFileSync(CONFIG_FILE_PATH)
    return JSON.parse(data).cookie
  } catch (error) {
    return ''
  }
}

function writeCookie(cookie) {
  const data = JSON.stringify({ cookie: cookie })
  fs.writeFile(CONFIG_FILE_PATH, data, (err) => {
    if (err) {
      console.log('write error', err.message)
    } else {
      console.log('cookie write success')
    }
  })
}

if (process.argv.length < 3) {
  program.help()
}

program
  .description('set a cookie')
  .command('init <cookie>')
  .action((cookie) => {
    writeCookie(cookie)
  })

program
  .description('An application for publish cnblogs 闪存')
  .arguments('<content>')
  .option('-p, --private', 'private post')
  .option('-c, --cookie <cookie>', 'set cookie string')
  .action((content, options, command) => {
    CONTENT.publicFlag = options.private ? 0 : 1
    CONTENT.content = content
    const cookie = readCookie()
    if (options.cookie) {
      cookie = options.cookie
      writeCookie(cookie)
    }
    HEADERS.cookie = cookie
    if (cookie) {
      publish()
    } else {
      console.log('cookie is empty')
    }
  })
  .parse()

function publish() {
  got
    .post(POST_URL, {
      form: CONTENT,
      responseType: 'json',
      headers: HEADERS,
      https: {
        rejectUnauthorized: false
      }
    })
    .then((res) => {
      console.log(res.body)
    })
    .catch((err) => {
      console.log(err.message)
    })
}
