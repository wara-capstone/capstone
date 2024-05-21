import * as React from 'react';
import { faker } from '@faker-js/faker';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

function MiniProfile() {
  const [profile, setProfile] = React.useState();

  React.useEffect(() => {
    const mockProfile = {
      email: faker.internet.email(),
      username: faker.name.findName(),
      avatar: faker.internet.avatar(),
      id: faker.datatype.uuid(),
    };
    setProfile(mockProfile);
  }, []);

  return (
    <Avatar>
        alt="Remy Sharp"
        src={profile?.avatar}
        sx={{width:56, height: 56, marginRight: '1rem'}}
    </Avatar>
    
  );  
}
export default MiniProfile;