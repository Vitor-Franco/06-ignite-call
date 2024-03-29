import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({
      message: 'Date not provided.',
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(404).json({
      message: 'User does not exist.',
    })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(dayjs())

  if (isPastDate) {
    return res.json({
      possibleTimes: [],
      availableTimes: [],
    })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({
      possibleTimes: [],
      availableTimes: [],
    })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = Math.floor(time_start_in_minutes / 60)
  const endHour = Math.floor(time_end_in_minutes / 60)

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, index) => {
      return startHour + index
    },
  )

  const blockedTimes = (await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })) as {
    date: Date
  }[]

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some((blockedTime) => {
      return blockedTime.date.getHours() === time
    })

    const isTimeInpast = referenceDate.set('hour', time).isBefore(new Date())

    return !isTimeBlocked && !isTimeInpast
  })

  return res.json({
    possibleTimes,
    availableTimes,
  })
}
