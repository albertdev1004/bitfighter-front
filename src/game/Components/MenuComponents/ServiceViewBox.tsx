// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
import styled from 'styled-components'
import React, { useState, useRef, useEffect } from 'react'
// import BuildingCarousel from './BuildingCarousel';
// import buildingImage from '../../../../../bitfgihter_assets/ui/buildingSquare.png';
import buildingImage from '../../../assets/images/btc-icon.png'
import './ServiceUI.css'
import CloseIcon from '@mui/icons-material/Close'
import { OpenServiceView } from '../../../stores/UserActions'
import { useAppDispatch, useAppSelector } from '../../../hooks'
// Wrapper for the entire layout
const LayoutWrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 30%;
  padding: 5px;
  margin: 0 auto;
  background: #2c2c2c;
  border: 4px solid #ddc5b5;
  border-radius: 12px;
  opacity: 1;
  font-family: 'Cooper Black', sans-serif; /* Use Cooper Black font */

  /* Landscape mode: Adjusting font size */
  @media only screen and (max-height: 900px) and (orientation: landscape) {
    width: 50%;
    top: 2%;
    height: 80%;
  }

  /* Portrait mode: Adjusting font size */
  @media only screen and (orientation: portrait) {
    width: 90%;
  }
`

// Header style
const Header = styled.div`
  height: 12%;
  margin: 2px;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  padding: 2px;
  background-color: #ddc5b5;
  border-bottom: 1px solid #ccc;
  @media only screen and (max-height: 900px) and (orientation: landscape) {
    font-size: 18px;
  }
`

// Wrapper for the menu layout
const MenuWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 10px;
  height: 100%;
`

// Column for the main menu
const MainMenu = styled.div`
  justify-content: center;
  align-items: center;
  background-color: #ddc5b5;
  padding: 10px;
  display: flex;
  width: 100%;
  height: 90%;
  gap: 20px;
  @media (max-width: 900px) {
    width: 100%;
    height: 100%;
  }
`

// Column for the submenu
const SubMenu = styled.div`
  background-color: #c4e4fc;
  padding: 20px;
  display: flex;
  flex-direction: column; /* Stack items vertically */
  gap: 3px;
  height: 100%;
  width: 100%; /* Ensure submenu takes up the full width */
  @media (max-width: 900px) {
    width: 100%;
    height: 100%;
  }
`

const SubMenuButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px; /* Adjust padding for better spacing */

  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 10px; /* Maintain spacing between buttons */
  width: 30%; /* Ensure button takes full width */
  &:hover {
    background-color: #1e88e5;
  }
  @media (max-width: 900px) {
    font-size: 12px;
    width: 100%;
  }
`

// Button style for the menu items
const MenuItemButton = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: #bf4453;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  text-align: center;
  display: flex;
  justify-content: center;
  &:hover {
    background-color: #89303a;
  }
  /* Show submenu when active */
  ${({ active }) =>
    active &&
    `
    background-color: #89303a;
  `}
  @media (max-width: 900px) {
    width: 30%;
    height: 40%;
  }
`

const BackButton = styled.button`
  position: absolute;
  top: -10px;
  left: -10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #333;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

interface IQueueOptions {
  closeFunction: any
}

export default function ServiceViewBox(data: IQueueOptions) {
  //const ServiceViewBox = () => {
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
  const [selectedSubMenu, setSelectedSubMenu] = useState<string | null>(null)
  // const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)
  const subMenuRef = useRef<HTMLDivElement>(null)

  const [newName, setNewName] = useState<string>('')
  const [newNumber, setNewNumber] = useState<string>('')
  const [newGang, setNewGang] = useState<string>('')
  const [viewBuilding, setBuildingToView] = useState<string>('')
  const [submittedName, setSubmittedName] = useState<string | null>(null)
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null)
  const [submittedGang, setSubmittedGang] = useState<string | null>(null)

  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [selectedBuildingDetails, setSelectedBuildingDetails] = useState(null)
  const [selectedBuildingID, setSelectedBuildingID] = useState(null) // Track selected building ID
  const dispatch = useAppDispatch()

  // Submenu options for each main menu
  const subMenus: Record<string, string[]> = {
    Fighter: ['Change Name', 'Change Gang', 'Change Lucky #'],
    City: ['Buildings', 'Plots', 'City Ruler'],

    Bonus: ['Daily Prize'],
  }
  // Mint: ['Bit Fighters', 'Buildings', '1k Card'],
  const [currentIndex, setCurrentIndex] = useState(0)

  const buildings = [
    { id: 1, type: 'Mine', level: '1', name: 'Bitz Mine' },
    { id: 2, type: 'Factory', level: '3', name: 'The Factory' },
    { id: 3, type: 'Shop', level: '2', name: 'Quik-Shop' },
    { id: 4, type: 'Mine', level: '4', name: 'Gem Dungeon' },
    { id: 5, type: 'Factory', level: '2', name: 'U Build-It' },
  ]

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % buildings.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + buildings.length) % buildings.length)
  }
  // Function to handle submenu button click
  const handleSubMenuClick = (menu: string, subMenu: string) => {
    //console.log(`${menu} -> ${subMenu} clicked`);
    setSelectedSubMenu(subMenu)
  }
  const handleMouseEnter = (menu: string) => {
    setHoveredMenu(menu)
  }
  const handleMouseLeave = () => {
    setHoveredMenu(null)
  }

  const handleMenuClick = (menu: string) => {
    if (selectedMenu === menu) {
      setSelectedMenu(null)
      setSelectedSubMenu(null)
    } else {
      setSelectedMenu(menu)
      setSelectedSubMenu(null) // Reset submenu selection
    }
  }

  const handleBackToSubMenu = () => {
    if (selectedBuildingID != null) {
      setSelectedBuildingID(null)
    } else {
      setSelectedSubMenu(null)
    }
  }

  const handleNameChange = () => {
    setSubmittedName(newName) // Store the new name
    setNewName('') // Clear the input after submission
  }
  const handleNumberChange = () => {
    setSubmittedNumber(newNumber) // Store the new name
    setNewNumber('') // Clear the input after submission
  }
  const handleGangChange = () => {
    setSubmittedGang(newGang) // Store the new name
    setNewGang('') // Clear the input after submission
  }
  const handleBuildingSelection = (buildingID) => {
    setSelectedBuildingID(buildingID) // Set the selected building ID
  }

  // Handle clicks outside the menu
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node) && subMenuRef.current && !subMenuRef.current.contains(event.target as Node)) {
      setSelectedMenu(null)
      setSelectedSubMenu(null)
    }
  }
  const renderSubMenuContent = () => {
    if (!selectedMenu) {
      return (
        <p>
          Hello!
          <br /> Make a selection to begin!
        </p>
      )
    }

    if (selectedSubMenu) {
      if (selectedMenu === 'Fighter') {
        if (selectedSubMenu === 'Change Name') {
          return (
            <div style={{ position: 'relative' }}>
              {' '}
              {/* Parent container with relative positioning */}
              <BackButton onClick={handleBackToSubMenu}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='feather feather-arrow-left'
                >
                  <line x1='19' y1='12' x2='5' y2='12' />
                  <polyline points='12 19 5 12 12 5' />
                </svg>
              </BackButton>
              <br />
              <br />
              <p>Change your Fighter's name:</p>
              <input type='text' value={newName} onChange={(e) => setNewName(e.target.value)} placeholder='Enter new name' />
              <button onClick={handleNameChange}>Submit!</button>
              {submittedName && <p>Submitted Name: {submittedName}</p>}
            </div>
          )
        } else if (selectedSubMenu === 'Change Gang') {
          return (
            <div style={{ position: 'relative' }}>
              {' '}
              {/* Parent container with relative positioning */}
              <BackButton onClick={handleBackToSubMenu}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='feather feather-arrow-left'
                >
                  <line x1='19' y1='12' x2='5' y2='12' />
                  <polyline points='12 19 5 12 12 5' />
                </svg>
              </BackButton>
              <br />
              <br />
              <p>Select a new Gang to leave your current one:</p>
              {/* Dropdown menu for selecting a new gang */}
              <select value={newGang} onChange={(e) => setNewGang(e.target.value)}>
                <option value=''>Select a Gang</option> {/* Default placeholder option */}
                <option value='Gang1'>Gang1</option>
                <option value='Gang2'>Gang2</option>
                <option value='Gang3'>Gang3</option>
              </select>
              <button onClick={handleGangChange}>Submit!</button>
              {submittedGang && <p>You have joined: {submittedGang}</p>}
            </div>
          )
        } else if (selectedSubMenu === 'Change Lucky #') {
          return (
            <div style={{ position: 'relative' }}>
              {' '}
              {/* Parent container with relative positioning */}
              <BackButton onClick={handleBackToSubMenu}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='feather feather-arrow-left'
                >
                  <line x1='19' y1='12' x2='5' y2='12' />
                  <polyline points='12 19 5 12 12 5' />
                </svg>
              </BackButton>
              <br />
              <br />
              <p>Enter a number from 1 to 100:</p>
              <input type='text' value={newNumber} onChange={(e) => setNewNumber(e.target.value)} placeholder='Enter new lucky #' />
              <button onClick={handleNumberChange}>Submit!</button>
              {submittedNumber && <p>Your new lucky # is: {submittedNumber}</p>}
            </div>
          )
        }
      } else if (selectedMenu === 'City') {
        const selectedBuilding = buildings.find((building) => building.id === selectedBuildingID)
        if (selectedSubMenu === 'Buildings') {
          return (
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <BackButton onClick={handleBackToSubMenu}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='feather feather-arrow-left'
                >
                  <line x1='19' y1='12' x2='5' y2='12' />
                  <polyline points='12 19 5 12 12 5' />
                </svg>
              </BackButton>

              {/* If no building is selected, show the carousel */}
              {!selectedBuildingID ? (
                <>
                  <p>Select a building for more info:</p>
                  <div className='carousel-container' style={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
                    {buildings.map((building) => (
                      <button key={building.id} onClick={() => handleBuildingSelection(building.id)}>
                        <div
                          style={{
                            width: '120px',
                            height: '200px',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ddd',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '2px',
                          }}
                        >
                          <p style={{ fontWeight: 'bold', margin: '1px 0' }}>{building.type}</p>
                          <p style={{ fontWeight: 'bold', margin: '1px 0' }}>Level: {building.level}</p>
                          <div
                            className='building-thumbnail'
                            style={{
                              width: '100px',
                              height: '100px',
                              backgroundColor: '#ccc',
                              marginBottom: '2px',
                            }}
                          />
                          <p>{building.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ marginTop: '2px', position: 'relative' }}>
                  <div className='buildingID' style={{ position: 'absolute', top: '0', right: '0', padding: '5px' }}>
                    <strong>ID:</strong> {selectedBuilding.id}
                  </div>
                  <h3>{selectedBuilding.name}</h3>
                  <div>
                    <strong>Type:</strong> {selectedBuilding.type}
                  </div>
                  <div
                    className='building-thumbnail'
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: '#ccc',
                      marginBottom: '2px',
                      marginLeft: 'auto', // Center horizontally
                      marginRight: 'auto', // Center horizontally
                    }}
                  />
                  {selectedBuilding ? (
                    <>
                      Level: {selectedBuilding.level}
                      <br />
                      Players: 0/20
                      <br />
                      Time: 60 seconds
                      <br />
                      Cost: 100 bits
                      <br />
                    </>
                  ) : (
                    <p>Building not found</p>
                  )}
                  <button>Enter!</button>
                </div>
              )}
            </div>
          )
        }
      } else {
        return (
          <div style={{ position: 'relative' }}>
            <BackButton onClick={handleBackToSubMenu}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='feather feather-arrow-left'
              >
                <line x1='19' y1='12' x2='5' y2='12' />
                <polyline points='12 19 5 12 12 5' />
              </svg>
            </BackButton>

            <p>{`You selected: ${selectedSubMenu}`}</p>
          </div>
        )
      }
    }

    return subMenus[selectedMenu].map((subMenu) => (
      <SubMenuButton key={subMenu} onClick={() => handleSubMenuClick(selectedMenu, subMenu)}>
        {subMenu}
      </SubMenuButton>
    ))
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <LayoutWrapper>
      {/* Header */}
      <Header>Welcome to Genesis City HQ!</Header>

      <SubMenu ref={subMenuRef}>{renderSubMenuContent()}</SubMenu>
      <MenuWrapper>
        <MainMenu ref={menuRef}>
          {Object.keys(subMenus).map((menu) => (
            <MenuItemButton
              key={menu}
              active={selectedMenu === menu || hoveredMenu === menu}
              onClick={() => handleMenuClick(menu)}
              onMouseEnter={() => handleMouseEnter(menu)}
              onMouseLeave={handleMouseLeave}
            >
              {menu}
            </MenuItemButton>
          ))}
        </MainMenu>
      </MenuWrapper>
      <div
        style={{
          position: 'absolute',
          height: '100%',
          top: '10px',
          right: '10px',
        }}
      >
        <CloseIcon
          style={{
            color: 'red',
            position: 'absolute',
            alignItems: 'flex-start',
            right: '-5px',
            top: '-5px',
            border: '2px solid black',
            backgroundColor: 'black',
            padding: '5px',
            borderRadius: '4px',
          }}
          onClick={() => {
            dispatch(OpenServiceView(false))
          }}
        />
      </div>
    </LayoutWrapper>
  )
}
