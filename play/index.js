import { play } from 'vue-play'

import Events from './Events.vue'
import Size from './Size.vue'
import PlayerVars from './PlayerVars.vue'
import UpdateVideoId from './UpdateVideoId.vue'
import List from './List.vue'
import Volume from './Volume.vue'
import EmbedConfig from './EmbedConfig.vue'

play('Vue YouTube Embed', module)
  .add('Events', Events)
  .add('Height and Width', Size)
  .add('Player Vars', PlayerVars)
  .add('EmbedConfig', EmbedConfig)
  .add('Update Video ID', UpdateVideoId)
  .add('List', List)
  .add('Volume', Volume)
