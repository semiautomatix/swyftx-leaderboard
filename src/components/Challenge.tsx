import * as React from 'react';
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';
import { useFirestore, useFirestoreCollection } from 'reactfire';
import { Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper } from '@material-ui/core';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

const Challenge: React.FC = () => {
  const [teamOne, setTeamOne] = useState<Set<any>>(new Set())
  const [teamTwo, setTeamTwo] = useState<Set<any>>(new Set())
  const [challenge, setChallenge] = useState<any>(undefined)

  const challengeCollection = useFirestore().collection('challenge')
  const challenges: any = (useFirestoreCollection(challengeCollection) as any).docs.map(
    (challenge: any) => ({
      id: challenge.id,
      ...challenge.data()
    })
  );

  const playerCollection = useFirestore().collection('player')
  const players: any = (useFirestoreCollection(playerCollection) as any).docs.map(
    (player: any) => ({
      id: player.id,
      ...player.data()
    })
  );
  
  const periodCollection = useFirestore().collection('period')
  const pointsCollection = useFirestore().collection('points')

  const addToTeamOne = (event: any, value: any) => {
    const teamMates: Set<any> = new Set(teamOne)
    teamMates.add(value)
    setTeamOne(teamMates)
  }

  const addToTeamTwo = (event: any, value: any) => {
    const teamMates: Set<any> = new Set(teamTwo)
    teamMates.add(value)
    setTeamTwo(teamMates)
  }

  const deleteFromTeamOne = (value: string) => {
    const teamMates: Array<any> = Array.from(teamOne).filter(
      (teamMate: any) => teamMate.id !== value
    )
    setTeamOne(new Set(teamMates))
  }

  const deleteFromTeamTwo = (value: string) => {
    const teamMates: Array<any> = Array.from(teamTwo).filter(
      (teamMate: any) => teamMate.id !== value
    )
    setTeamTwo(new Set(teamMates))
  }

  const declareWinner = async (winner: number) => {
    if (challenge?.id && teamTwo.size > 0 && teamOne.size > 0) {
      const periodRef = (await periodCollection
        .where('month', '==', format(new Date(), "MMMM"))
        .where('year', '==', Number(format(new Date(), "yyyy")))
        .get()).docs[0].ref
      const team = winner ? teamTwo : teamOne    
      team.forEach(
        (teamMate) => {
          pointsCollection.add({
            challenge: challengeCollection.doc(challenge.id),
            period: periodRef,
            player: playerCollection.doc(teamMate.id),
            points: 1,
            metaData: JSON.stringify({
              teamOne,
              teamTwo,
              winner,
              created: Date.now()
            })
          })       
        }
      )    
      setTeamOne(new Set())
      setTeamTwo(new Set())
    } // otherwise show error
  }

  const filterPlayers = (players: any[]) => {
    return players.filter(
      (player) => {
        let assigned = false
        Array.from(teamOne).concat(Array.from(teamTwo)).forEach(
          (teamMate) => {
            if (teamMate.id === player.id) {
              assigned = true
            }
          }
        )
        return !assigned
      }
    )
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Challenge
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Autocomplete
            id="combo-box-challenge"
            options={challenges.sort(
              (a: any, b: any) => a.name > b.name ? 1 : -1
            )}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.id === value.id}
            renderOption={(option: any, props: any) => {
              return (
                <li key={option.id} {...props}>
                  {option.name}
                </li>
              )
            }}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Challenge" variant="outlined" />
            )}
            onChange={(event: any, value: any) => setChallenge(value)}
            value={challenge?.id}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '5%' }}>
            <Typography variant="h6">
              Team One
            </Typography>
            <Autocomplete
              id="combo-box-teamone"
              options={filterPlayers(players)}
              getOptionLabel={(option) => option.name}
              renderOption={(option: any, props: any) => {
                return (
                  <li key={option.id} {...props}>
                    {option.name}
                  </li>
                )
              }}

              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Team One" variant="outlined" />
              )}
              onChange={addToTeamOne}
              key={Math.random()}
            />
            <div>
              <List dense={true}>
                {Array.from(teamOne).map(
                  (player: any) =>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={player.name}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteFromTeamOne(player.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                )}
              </List>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} style={{ padding: '5% 10% 5% 10%' }}>
                <Button variant="contained" color="primary" style={{ width: '100%' }} onClick={() => declareWinner(1)}>
                  Winner
                </Button>
              </Grid>
            </Grid>              
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '5%' }}>
            <Typography variant="h6">
              Team Two
            </Typography>
            <Autocomplete
              id="combo-box-teamtwo"
              options={filterPlayers(players)}
              getOptionLabel={(option) => option.name}
              renderOption={(option: any, props: any) => {
                return (
                  <li key={option.id} {...props}>
                    {option.name}
                  </li>
                )
              }}

              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Team Two" variant="outlined" />
              )}
              onChange={addToTeamTwo}
              key={Math.random()}
            />
            <div>
              <List dense={true}>
                {Array.from(teamTwo).map(
                  (player: any) =>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={player.name}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteFromTeamTwo(player.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                )}
              </List>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} style={{ padding: '5% 10% 5% 10%' }}>
                <Button variant="contained" color="primary" style={{ width: '100%' }} onClick={() => declareWinner(1)}>
                  Winner
                </Button>
              </Grid>
            </Grid>            
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Challenge
