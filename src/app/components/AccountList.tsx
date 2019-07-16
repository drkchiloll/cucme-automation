import * as React from 'react';
import { Component } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Tooltip,
  colors
} from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/styles/createStyles';
import { GroupAdd, Delete } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
  root: {
    color: 'red'
  },
  acctList: { padding: theme.spacing(2) },
  list: {
    overflow: 'auto',
    minHeight: 400,
    maxHeight: 400
  },
  addIcon: {
    color: colors.blueGrey[300]
  },
  label: {
    color: 'red' 
  }
})
class AcctList extends Component<any, any> {
  render() {
    const { accounts, classes, activeAccount } = this.props;
    return (
      <Paper className={classes.acctList} elevation={2}>
        <List dense={true} className={classes.list}>
          {
            accounts.map((account, idx) => (
              <ListItem
                key={idx}
                button
                selected={activeAccount === idx}
                onClick={() => this.props.selectAccount(idx)} 
              >
                <ListItemText>{account.name}</ListItemText>
              </ListItem>

            ))
          }
        </List>
        <BottomNavigation
          value={0}
          onChange={(event, newValue) => {}}
          showLabels
        >
          <BottomNavigationAction
            className={classes.root}
            label='Add Account'
            icon={
              <Tooltip title='Add Account'>
                <GroupAdd fontSize='large' className={classes.addIcon} />
              </Tooltip>
            }
            onClick={this.props.addNewAccount}
          />
          <BottomNavigationAction
            icon={
              <Tooltip title='Delete Account'>
                <Delete fontSize='large' />
              </Tooltip>
            }
          />
        </BottomNavigation>
      </Paper>
    )
  }
}
const AccountList = withStyles(styles)(AcctList);
export { AccountList };