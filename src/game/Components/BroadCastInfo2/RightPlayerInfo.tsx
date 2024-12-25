import styled from "styled-components";
import { useAppSelector } from "../../../hooks";
import { v4 as uuidv4 } from 'uuid';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import { useState } from "react";

const BackWrapper = styled.div`
    margin: auto;
    display: flex;
    flex-direction: column;

    table, th, td {
        border: 2px solid;
    }
    
    td{
        font-size: 20px;
    }

    @media only screen and (max-height: 575.98px) and (orientation: landscape) {
        table, th, td {
            border: 1px solid;
        }
            
        td{
            font-size: 10px;
        }
    }

    @media only screen and (orientation: portrait) {
        td{
            font-size: 15px;
        }
    }
`

const Imagewrapper = styled.div`
    width: 100%;
    height: 50%;
    margin: 1%; 
    display: inline-block;
    align-content: center;
    justify-content: center;
    img{
        width: 40%;   
    }   
    transform: scaleX(-1);
`

export function RightPlayerInfo() {
    const fightersInfo = useAppSelector((state) => state.userActionsDataStore.fightersInfo)
    const [openAttributesInfo, setAttributesOpen] = useState(false);
    return (
        <BackWrapper>
            <Imagewrapper>
                <img
                    src={fightersInfo.player2.profile_image} //"bitfgihter_assets/avax.png"
                    style={{
                        objectFit: "contain"
                    }}
                />
            </Imagewrapper>
            <div style={{
                width: '100%',
                // opacity: '0.8',
                display: "flex",
                color: 'aliceblue',
                justifyContent: "flex-end"
            }}>
                <div style={{
                    backgroundColor: 'black',
                    display: "flex",
                }}
                    onClick={() => setAttributesOpen(!openAttributesInfo)}
                >
                    <ArrowDropDownSharpIcon fontSize="small" />
                </div>
            </div>
            {
                openAttributesInfo &&
                <div key={uuidv4()} style={{
                    color: '#C1D5EE',
                }}>
                    <table style={{
                        width: `100%`,
                        backgroundColor: 'black',
                        float: 'right',
                        opacity: '0.8'
                    }}>
                        <tbody>
                            <tr key={uuidv4()} className="text-center user-select-none">
                                <td scope="col" className="col-3">Defense</td>
                                <td scope="col" className="col-1">{fightersInfo.player2.defense}</td>
                            </tr>
                            <tr key={uuidv4()} className="text-center user-select-none">
                                <td>Punch</td>
                                <td>{fightersInfo.player2.punchpower}</td>
                            </tr>
                            <tr key={uuidv4()} className="text-center user-select-none">
                                <td>Kick</td>
                                <td>{fightersInfo.player2.kickpower}</td>
                            </tr>
                            <tr key={uuidv4()} className="text-center user-select-none">
                                <td>Speed</td>
                                <td>{fightersInfo.player2.speed}</td>
                            </tr>
                            <tr key={uuidv4()} className="text-center user-select-none">
                                <td>Health</td>
                                <td>{fightersInfo.player2.max_health}</td>
                            </tr>
                            <tr key={uuidv4()} className="text-center user-select-none">
                                <td>Stamina</td>
                                <td>{fightersInfo.player2.max_stamina}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }
        </BackWrapper>
    )
}