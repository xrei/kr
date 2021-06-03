import React, {useEffect} from 'react'
import {useStore} from 'effector-react'
import {Grid, Typography} from '@material-ui/core'
import {makeStyles, createStyles} from '@material-ui/core/styles'
import {fetchProductsFx, $products} from './model'
import {CourseCard} from 'src/ui/CourseCard'

const pageStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: '40px',
    },
  })
)

export const Products: React.FC = () => {
  const st = pageStyles()
  useEffect(() => {
    fetchProductsFx()
  }, [])
  const products = useStore($products)

  return (
    <>
      <Typography variant="h4">Все курсы</Typography>
      <Grid container spacing={2} className={st.root}>
        {products.map((p) => {
          return <CourseCard key={p.id} course={p}></CourseCard>
        })}
      </Grid>
    </>
  )
}
