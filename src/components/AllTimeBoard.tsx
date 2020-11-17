import * as React from 'react';
import { useState, useEffect } from 'react';
import { FirebaseAppProvider, useFirestoreDocData, useFirestore, SuspenseWithPerf, useFirestoreCollection } from 'reactfire';
import { compareAsc, format } from 'date-fns'

import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import { Avatar, Grid } from '@material-ui/core';

// Generate Order Data
function createData(
  id: number,
  date: string,
  name: string,
  shipTo: string,
  paymentMethod: string,
  amount: number,
) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },  
}));

interface Board {
  leaders: any[] 
  challenge?: any
}

const LeaderBoard: React.FC<Board> = ({ leaders, challenge }) => {
  const classes = useStyles();

  const [lifeTime, setLifeTime] = useState<any[]>([])

  const challengeCollection = useFirestore().collection('challenge')
  const challenges: any = (useFirestoreCollection(challengeCollection) as any).docs.reduce(
    (acc: any, cur: any) => {
      acc[cur.id] = cur.data()
      return acc
    }, {}
  );

  useEffect (() => {
    (async () => {
      setLifeTime(Object.values(leaders?.reduce<Record<any, any>>(
        (acc: any, cur: any) => {
          if (challenge && cur.challenge.id !== challenge) {
            return acc
          }          
          const points = acc[cur.player.id]?.points ?? 0                    
          const challenges = acc[cur.player.id]?.challenges ?? new Set()
          challenges.add(cur.challenge.id)
          acc[cur.player.id] = {
            player: cur.player,
            points: points + cur.points,
            challenges
          }
          return acc
        }, {}
      )))
    })()
  }, [leaders, challenge])

  const _renderChallengesIndicator = (challengeIds: string[] | undefined) => {
    return (
      <Grid container spacing={1}>
        {challengeIds?.sort((a, b) => a > b ? 1 : -1).map(
          (challengeId: string) => {        
            const { colour } = challenges[challengeId]
            return <Grid item><Avatar className={classes.small} style={{ backgroundColor: colour }}> </Avatar></Grid>
          }
        )}
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Title>All Time</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lifeTime?.sort((a, b) => a.points > b.points? -1 : 1).map((row) => (
            <TableRow key={row.player.id}>
              <TableCell>
                <Grid container spacing={2} justify="space-between">
                  <Grid item>{row.player.name}</Grid>
                  <Grid item>{_renderChallengesIndicator(Array.from(row.challenges))}</Grid>
                </Grid>
              </TableCell>            
              <TableCell>{row.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>      
      <div className={classes.seeMore}>
        <React.Fragment/>
      </div>      
    </React.Fragment>
  );
}

export default LeaderBoard
