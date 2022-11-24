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
import { useState } from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar, Button, Tab, Menu, MenuItem, Tabs } from '@mui/material'
import { TabPanel, TabContext, TabList } from '@mui/lab';
import MenuIcon from '@mui/icons-material/Menu';
import HelpIcon from '@mui/icons-material/Help';
import PropTypes from 'prop-types';
import GCP_SEC from './gcp_sec';
import SettingsDialog from './SettingsDialog';
import RulesView from './RulesView';
import DocumentsView from './DocumentsView';
import SchemasView from './SchemasView';
import DAW from './daw.js'

function Main(props) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [tabIndex, setTabIndex] = useState('1')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mainMenuAnchorEl, setMainMenuAnchorEl] = useState(null)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settings, setSettings] = useState({
    clientId: "604474120566-f1esonn8rpkcl8mckam6bk9gdsgsl88s.apps.googleusercontent.com",
    projectId: "test1-305123",
    projectNumber: "604474120566",
    user: ""
  })

  DAW.setProjectNumber(settings.projectNumber)

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
  } // End of signIn

  function onAbout() {

  }
  /**
   * Open the settings dialog
   */
  function onSettings() {
    setMainMenuAnchorEl(null) // Close the menu
    setSettingsDialogOpen(true)
  } // End of onSettings

  function settingsClosed(newSettings) {
    setSettingsOpen(false);
    console.log(newSettings);
    setSettings(newSettings)
  }

  let body;
  if (!loggedIn) {
    body = (
      <Box>Not logged in</Box>
    )
  } else {
    body = (<TabContext value={tabIndex}>
      <TabList onChange={(event, newValue) => setTabIndex(newValue)}
        textColor="inherit">
        <Tab label="Documents" value="1" />
        <Tab label="Rules" value="2" />
        <Tab label="Schemas" value="3" />

      </TabList>

      <TabPanel value="2">
        <RulesView />
      </TabPanel>
      <TabPanel value="1">
        <DocumentsView />
      </TabPanel>
      <TabPanel value="3">
        <SchemasView />
      </TabPanel>
    </TabContext>)
  }
  return (

    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={(evt) => { setSettingsOpen(true) }} >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            Document AI Warehouse Explorer
          </Typography>
          <Button color="inherit" onClick={signIn}>Sign In</Button>
          <IconButton color="inherit" onClick={onAbout}>
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {body}
      <SettingsDialog open={settingsOpen} close={settingsClosed} settings={settings} />
      <Menu
        anchorEl={mainMenuAnchorEl}
        open={Boolean(mainMenuAnchorEl)}
        onClose={() => { setMainMenuAnchorEl(null) }}>
        <MenuItem onClick={onSettings}>Settings</MenuItem>
      </Menu>
    </Box>
  )
} // EntityInfoDialog

Main.propTypes = {
  'open': PropTypes.bool.isRequired,
  'close': PropTypes.func.isRequired,
  'selected': PropTypes.func.isRequired,
  'settings': PropTypes.object
}

export default Main