import { Box, styled, Text } from '@ignite-ui/react'

export const ProfileBox = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',

  label: {
    gap: '$2',
    display: 'flex',
    flexDirection: 'column',
  },
})

export const FormAnnotation = styled(Text, {
  color: '$gray200',
})
