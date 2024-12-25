import { IRank } from './TableSection'
import crownImg from '../../assets/images/crown.webp'

interface IProps {
  ranks: IRank[]
}

export default function TableData({ ranks }: IProps) {
  // console.log("debug ---TableData ", ranks)
  return (
    <>
      <div className='top-3-ranks-wrapper'>
        <div className='rank'>
          <img src={crownImg} alt='' className='crown-img' />

          <div className='profile-img-wrapper'>
            <img src={ranks && ranks[0] && ranks[0].profileImgUrl || '/images/avatar-placeholder.webp'} alt='' className='profile-img' />

            <h3>1st</h3>
          </div>

          <h3 className='username'>@{ranks && ranks[0] && ranks[0].username}</h3>
          <p className='wallet-address'>{ranks && ranks[0] && ranks[0].walletAddress}</p>

          <div className='stats-wrapper'>
            <p>Win: {ranks && ranks[0] && ranks[0].fights_won_count}</p>
            <p>Loss: {ranks && ranks[0] && ranks[0].fights_lost_count}</p>
          </div>
        </div>

        <div className='rank'>
          <div className='profile-img-wrapper'>
            <img src={ranks && ranks[1] && ranks[1].profileImgUrl || '/images/avatar-placeholder.webp'} alt='' className='profile-img' />

            <h3>2nd</h3>
          </div>

          <h3 className='username'>@{ranks && ranks[1] && ranks[1].username}</h3>
          <p className='wallet-address'>{ranks && ranks[1] && ranks[1].walletAddress}</p>

          <div className='stats-wrapper'>
            <p>Win: {ranks && ranks[1] && ranks[1].fights_won_count}</p>
            <p>Loss: {ranks && ranks[1] && ranks[1].fights_lost_count}</p>
          </div>
        </div>

        <div className='rank'>
          <div className='profile-img-wrapper'>
            <img src={ranks && ranks[2] && ranks[2].profileImgUrl || '/images/avatar-placeholder.webp'} alt='' className='profile-img' />

            <h3>3rd</h3>
          </div>

          <h3 className='username'>@{ranks && ranks[2] && ranks[2].username}</h3>
          <p className='wallet-address'>{ranks && ranks[2] && ranks[2].walletAddress}</p>

          <div className='stats-wrapper'>
            <p>Win: {ranks && ranks[2] && ranks[2].fights_won_count}</p>
            <p>Loss: {ranks && ranks[2] && ranks[2].fights_lost_count}</p>
          </div>
        </div>
      </div>

      <div className='other-ranks-wrapper'>
        <div className='rank-header'>
          <p>Rank</p>
          <p>Username</p>
          {/* <p>Wallet</p> */}
          <p></p>

          <p>Stats</p>
        </div>

        {ranks.slice(3).map((rank, index) => {
          return (
            <div key={index} className='rank'>
              <div className='part-1'>
                <h3>{index + 4}</h3>
              </div>

              <div className='part-2'>
                <h3>@{rank.username}</h3>
              </div>

              <div className='part-3'>
                <p></p>
              </div>


              <div className='part-4'>
                <p>Win: {rank.fights_won_count}</p>
                <p>Loss: {rank.fights_lost_count}</p>
              </div>



              {/* <div className='part-3'>
                <p>Win: {rank.fights_won_count}</p>
              </div>

              <div className='part-4'>
                <p>Loss: {rank.fights_lost_count}</p>
              </div> */}
            </div>
          )
        })}
      </div>
    </>
  )
}
