import { useAppSelector } from '../../../../hooks'
import { ServerListInfoPortable } from './ServerListInfoPortable'
import './ServerListWindow.css'

export function ServerListPortable() {
  const showServersList = useAppSelector((state) => state.websiteStateStore.showGameServersList)
  const showing_jackpot_wheel = useAppSelector((state) => state.websiteStateStore.showing_jackpot_wheel)
  return (
    <>
      {showServersList && !showing_jackpot_wheel && (
        <div className='server-list-window-component'>
          <ServerListInfoPortable />
        </div>
      )}
    </>
  )
}
