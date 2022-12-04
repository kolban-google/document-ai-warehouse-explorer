/*
# Copyright 2022, Google, Inc.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/
import React from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar, Button, Tab, Paper } from '@mui/material'
import { TabPanel, TabContext, TabList } from '@mui/lab';
import MenuIcon from '@mui/icons-material/Menu';
import HelpIcon from '@mui/icons-material/Help';
//import PropTypes from 'prop-types';
import GCP_SEC from './gcp_sec';
import SettingsDialog from './SettingsDialog';
import RulesView from './rules/RulesView';
import DocumentsView from './documents/DocumentsView';
import SchemasView from './schemas/SchemasView';
import DAW from './daw.js'
import AboutDialog from './About';

function Main(props) {
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [tabIndex, setTabIndex] = React.useState('1')
  const [settings, setSettings] = React.useState(getSettings())

  // Dialog open flags
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [aboutOpen, setAboutOpen] = React.useState(false)
  //

  DAW.setProjectNumber(settings.projectNumber)
  DAW.setUser(settings.user)

  /**
   * Get the current settings.
   * @returns 
   */
  function getSettings() {
    const savedSettings = localStorage.getItem("settings")
    if (savedSettings === null) {
      return     {
        clientId: "",
        projectId: "",
        projectNumber: "",
        user: ""
      }
    }
    return JSON.parse(savedSettings)
  } // getSettings

  async function signIn() {
    await GCP_SEC.gapiLoad();
    //console.log("< gapiLoad")
    try {
      await GCP_SEC.gisInit(settings.clientId);
      setLoggedIn(true)
    }
    catch (err) {
      console.log(err)
    }

    //console.log("< gisInit");
  } // signIn

  /**
   * Test the value of the settings.
   * @returns false if the settings are invalid
   */
  function settingsValid() {
    if (settings === null || settings === undefined || settings.projectId.length === 0 || settings.projectNumber.length === 0 || settings.user.length === 0 || settings.clientId.length === 0) {
      return false
    }
    return true
  }

  function onSettingsClose(newSettings) {
    setSettingsOpen(false);
    // If we are passed no new settings, then this was a cancel so simply return.
    if (newSettings === null) {
      return
    }
    console.log(newSettings);
    setSettings(newSettings)
    DAW.setProjectNumber(newSettings.projectNumber)
    DAW.setUser(newSettings.user)
    localStorage.setItem("settings", JSON.stringify(newSettings))
  } // settingsClosed

  let body;
  if (!loggedIn) {
    body = (
      <Paper>{settingsValid() === false?"Please set settings":null} Please sign in</Paper>
    )
  } else {
    body = (
      <TabContext value={tabIndex}>
        <TabList onChange={(event, newValue) => setTabIndex(newValue)}
          textColor="inherit">
          <Tab label="Documents" value="1" />
          <Tab label="Schemas" value="2" />
          <Tab label="Rules" value="3" />
        </TabList>

        <TabPanel value="1" sx={{ flexGrow: 1 }}>
          <DocumentsView />
        </TabPanel>
        <TabPanel value="2" sx={{ flexGrow: 1 }}>
          <SchemasView />
        </TabPanel>
        <TabPanel value="3" sx = {{flexGrow: 1 }}>
          <RulesView />
        </TabPanel>
      </TabContext>)
  }
  return (

    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={(evt) => { setSettingsOpen(true) }} >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            Document AI Warehouse Explorer
          </Typography>
          <Button color="inherit" onClick={signIn}>Sign In</Button>
          <IconButton color="inherit" onClick={()=>{setAboutOpen(true)}}>
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {body}
      <SettingsDialog open={settingsOpen} close={onSettingsClose} settings={settings} />
      <AboutDialog open={aboutOpen} close={() => {setAboutOpen(false)}} />
    </Box>
  )
} // EntityInfoDialog

/*
Main.propTypes = {
}
*/

export default Main