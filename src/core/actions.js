import * as authActions from './auth/actions'
import * as gameActions from './game/actions'
import * as scoreboardActions from './scoreboard/actions'
import * as userActions from './user/actions'

export default { ...authActions, ...gameActions, ...scoreboardActions, ...userActions }
