import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const getConnectedUser = () => {
   const user = cookies.get('connecter_user')
   if (user) return user.user
   else return null

}
export const getJwt = () => {
   const jwt = cookies.get('connecter_user')
   if (jwt) return jwt.access_token
   else return null
}
export const getDateExact = (date) => {
   //console.log(new Date(date).getMinutes())
   let minutes = new Date(date).getMinutes()
   let year = new Date(date).getFullYear()
   let month = new Date(date).getMonth()
   let hours = new Date(date).getHours()

   if (month == 11) {
      year++;
      month = 0
   }
   month++
   if (minutes < 10)
      minutes = '0' + minutes
   if (hours < 10)
      hours = '0' + hours

   return year + '-' +
      month + '-' +
      new Date(date).getDate() + ' à ' +
      hours + 'H' +
      minutes
}