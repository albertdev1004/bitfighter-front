
import { useAppSelector } from "../../../hooks";
import styled from 'styled-components'
import ProgressBar from 'react-bootstrap/ProgressBar';

const Backdrop = styled.div`
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
`

const TextDiv = styled.div`
    border-style: solid;
    border-width: 2px;
`

const NameTextDiv = styled.div`
    float: left;
     font-size: 122px;
   font-family: Montserrat, sans-serif;
 font-weight: 500;
`
const BlackDiv = styled.div`
    color: black;
`
const CustomProgressBar = styled(ProgressBar)`
  background-color: rgba(17, 27, 40, 0.5); /* #111b28 with 50% opacity */
  .progress-bar {
    background-color: '#32cd32'; /* Default color */
    opacity:1; /* Adjust the opacity of the progress fill */
  }
`;
export function LeftHealthBars() {
    const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
    // console.log("NAME", fightersInfo.player1.nick_name)
    let healthBarColorString = ""
    if (fightersInfo.player1.health > 70) {
        healthBarColorString = "success"
    }
    else if (fightersInfo.player1.health <= 70 && fightersInfo.player1.health >= 30) {
        healthBarColorString = "warning"
    }
    else {
        healthBarColorString = "SOME_NAME"
    }
    // console.log("NAME", fightersInfo.player1)
    return (
        <Backdrop>
            <TextDiv>
                <CustomProgressBar
                    variant={`${healthBarColorString}`}
                    now={fightersInfo.player1.health}
                    min={0}
                    max={fightersInfo.player1.max_health}
                    style={{
                        padding: '2px',
                        height: '3vh',
                    }}
                    label={<BlackDiv>{Math.round(fightersInfo.player1.health)}</BlackDiv>}
                />
                <CustomProgressBar
                    variant="#778AFD"
                    now={fightersInfo.player1.stamina}
                    min={0}
                    max={fightersInfo.player1.max_stamina}
                    style={{
                        padding: '2px',
                        height: '3vh',
                    }}
                />
            </TextDiv>
        </Backdrop>
    )
}