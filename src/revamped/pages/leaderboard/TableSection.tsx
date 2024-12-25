import { useState } from 'react'
import TableData from './TableData'
import { useAppSelector } from '../../../hooks'
import { getEllipsisTxt } from '../../../utils'
import GameTimer from './GameTimer'
import FightNightTable from './FightNightTable'
export interface IRank {
  profileImgUrl?: string
  walletAddress: string
  username: string
  win?: number
  loss?: number

  fights_won_count?: number
  fights_lost_count?: number


}

export default function TableSection() {
  const [type, setType] = useState<'all-time' | 'fight-night'>('all-time')

  const leaderboardData = useAppSelector((state) => state.websiteStateStore.leaderboardData)

  const ranks: IRank[] = leaderboardData.data.map(
    (rank: { user_wallet_address: string; player_alias: string; wins_count: number; loss_count: number, fights_lost_count?: number, fights_won_count?: number }) => {
      return {
        walletAddress: getEllipsisTxt(rank.user_wallet_address),
        username: rank.player_alias,
        win: rank.wins_count,
        loss: rank.loss_count,
        fights_lost_count: rank.fights_lost_count,
        fights_won_count: rank.fights_won_count
      }
    },
  )

  const ranks2: IRank[] = leaderboardData.tournament_data.map(
    (rank: { user_wallet_address: string; player_alias: string; wins_count: number; loss_count: number, fights_lost_count?: number, fights_won_count?: number }) => {
      return {
        walletAddress: getEllipsisTxt(rank.user_wallet_address),
        username: rank.player_alias,
        win: rank.wins_count,
        loss: rank.loss_count,
        fights_lost_count: rank.loss_count,
        fights_won_count: rank.wins_count
      }
    },
  )

  return (
    <section className='table-section'>
      <div className='container'>
        <div className='h1-container'>
          <div onClick={() => setType('all-time')} className={`h1-wrapper ${type === 'all-time' ? 'active' : ''}`}>
            <h1 className='text'>All Time</h1>

            <h1 className='text-stroke'>All Time</h1>

            <h1 className='text-shadow'>All Time</h1>
          </div>

          <div onClick={() => setType('fight-night')} className={`h1-wrapper ${type === 'fight-night' ? 'active' : ''}`}>
            <h1 className='text'>Fight Night</h1>

            <h1 className='text-stroke'>Fight Night</h1>

            <h1 className='text-shadow'>Fight Night</h1>
          </div>
        </div>

        {type === 'fight-night' && (
          <GameTimer type='fight-night' />
          // <div className='timer-box'>
          //   <p>Game time: 00:00:00</p>
          // </div>
        )}

        {
          type == 'fight-night' ?
            <FightNightTable ranks={ranks2} /> : <TableData ranks={ranks} />
        }


        {/* <TableData ranks={ranks} /> */}
      </div>
    </section>
  )
}
