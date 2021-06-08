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
    gridItem: {
      flex: 1,
      maxWidth: '320px',
      minWidth: '260px',
      minHeight: '160px',
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
          return (
            <Grid key={p.id} item className={st.gridItem}>
              <CourseCard course={p}></CourseCard>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
