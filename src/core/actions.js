import * as authActions from './auth/actions'
import * as gameActions from './game/actions'
import * as scoreboardActions from './scoreboard/actions'

export default { ...authActions, ...gameActions, ...scoreboardActions }
