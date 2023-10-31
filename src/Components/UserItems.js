import React from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import { Link } from 'react-router-dom';

export default function UserItems(props) {
    const userProfileUrl = `/user/${props.id}`;
  return (
    // <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    <Link to={userProfileUrl}>
        <ListItem>
            <ListItemAvatar>
            <Avatar>
                <ImageIcon />
            </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.name} secondary={props.email} />
        </ListItem>
    </Link>
    // </List>
  )
}
