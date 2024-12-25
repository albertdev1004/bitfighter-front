
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
     border-width: 2px;d
`

const BlackDiv = styled.div`
    color: black;
`

const NameTextDiv = styled.div`
    float: right;
    h1 {
        color: aliceblue;
        text-shadow: 5px 5px 10px #000000;
        letter-spacing: 2px;
    }
`
const CustomProgressBar = styled(ProgressBar)`
  background-color: rgba(17, 27, 40, 0.5); /* #111b28 with 50% opacity */
  .progress-bar {
    background-color: '#32cd32'; /* Default color */
    opacity:1; /* Adjust the opacity of the progress fill */
  }
`;
export function RightHealthBars() {
    const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
    let healthBarColorString = ""
    if (fightersInfo.player2.health > 70) {
        healthBarColorString = "success"
    }
    else if (fightersInfo.player2.health <= 70 && fightersInfo.player2.health >= 30) {
        healthBarColorString = "warning"
    }
    else {
        healthBarColorString = "SOME_NAME"
    }
    // console.log("inAppSelector right --", fightersInfo.player2.health, healthBarColorString)
    return (
        <Backdrop>
            <TextDiv>
            <CustomProgressBar
                    variant={`${healthBarColorString}`}
                    now={fightersInfo.player2.health}
                    min={0}
                    max={fightersInfo.player2.max_health}
                    style={{
                        padding: '2px',
                        height: '3vh',
                    }}
                    label={<BlackDiv> {Math.round(fightersInfo.player2.health)} </BlackDiv>}
                />
                  <CustomProgressBar
                    variant="#778AFD"
                    now={fightersInfo.player2.stamina}
                    min={0}
                    max={fightersInfo.player2.max_stamina}
                    style={{
                        padding: '2px',
                        height: '3vh',
                    }}
                />
            </TextDiv>
            {/* <NameTextDiv>
                <div className="name_text_below_health_bar">
                    {fightersInfo.player2.nick_name}
                </div>
            </NameTextDiv> */}
        </Backdrop>
    )
}