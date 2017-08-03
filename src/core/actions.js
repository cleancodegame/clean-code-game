import * as authActions from './auth/actions'
import * as gameActions from './game/actions'
import * as scoreboardActions from './scoreboard/actions'
import * as appActions from './app/actions'

export default { ...authActions, ...gameActions, ...scoreboardActions, ...appActions }
