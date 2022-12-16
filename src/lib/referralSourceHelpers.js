import { getGlobal } from "reactn";

export const isUserAssigned = (refSource) => {
  const user = getGlobal().user;
  if(refSource._assigned_users.length){
    for(let assginedUser of refSource._assigned_users){
      if( assginedUser.business_line_id === user.business_line_id ){
        return true;
      }
    }
  }
  return false;
};
