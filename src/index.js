require('dotenv/config')
const puppeteer = require('puppeteer-extra')
var nodemailer = require('nodemailer')
var cron = require('node-cron')

const { MAIN_URL, EMAIL, EMAIL_PASSWORD, EMAIL_PROVIDER } = process.env

var mailOptions = {
  from: EMAIL,
  to: EMAIL,
  subject: 'Berlin Anmeldung Avaialability',
  text: '',
}

var transporter = nodemailer.createTransport({
  service: EMAIL_PROVIDER,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
})

const scraping = async () => {
  const browser = await puppeteer.launch({ headless: true })

  try {
    const page = await browser.newPage()

    await page.goto(MAIN_URL)

    await page.waitForSelector('.zmstermin-multi.inner a')
    await page.click('.zmstermin-multi.inner a')

    await page.waitForSelector('h1.title')
    await page.waitForSelector('.calendar-table')

    const tableMonths = await page.$$('.calendar-month-table')

    var currentMonth = []
    var nextMonth = []

    for (let i = 0; i < tableMonths.length; i++) {
      const table = tableMonths[i]
      const availability = await table.$$eval(
        'table tbody tr td.buchbar',
        tds =>
          tds.map(td => {
            return td.innerText
          })
      )

      if (i === 0) {
        currentMonth = availability
      }

      if (i === 1) {
        nextMonth = availability
      }
    }

    await browser.close()

    if (!currentMonth.length && !nextMonth.length) {
      console.log('There is no time available')
      return 'There is no time available'
    }

    console.log(
      `For current month we've found ${currentMonth.length} day(s) (${currentMonth}) - for next month we've found ${nextMonth.length} day(s) (${nextMonth})`
    )
    return `For current month we've found ${currentMonth.length} day(s) (${currentMonth}) - for next month we've found ${nextMonth.length} day(s) (${nextMonth})`
  } catch (err) {
    await browser.close()

    console.log('Error found')
    return 'There is no time available'
  }
}

let task = cron.schedule('*/1 * * * *', async () => {
  const res = await scraping()

  if (res !== 'There is no time available') {
    task.stop()
    mailOptions.text = res
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  }
})

task.start()
