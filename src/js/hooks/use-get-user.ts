import * as React from 'react'
//import { useClient } from '@/components/FavouriteShabadButton/hooks';
import { LOCAL_STORAGE_KEY_FOR_SESSION_TOKEN } from '@/constants';
import { client } from '@/components/FavouriteShabadButton/utils/api-client';

export const useGetUser = <D>() => {
  const [user, setUser] = React.useState<D | null>(null);
  //const client = useClient()
    
  React.useEffect(() => {   
      client('/auth/jwt', {
        token: window.localStorage.getItem(LOCAL_STORAGE_KEY_FOR_SESSION_TOKEN)
      })      
      .then(response => {
        setUser(response)
      })
      .catch(e => {            
        // eslint-disable-next-line no-console
        console.log('Error: ' + e.message)
        localStorage.removeItem(LOCAL_STORAGE_KEY_FOR_SESSION_TOKEN)
      })    
  }, []);

  return user;
}
