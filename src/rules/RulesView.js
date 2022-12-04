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
import DAW from '../daw.js'
import { Box, Button } from '@mui/material'
//import PropTypes from 'prop-types';
import RulesGrid from './RulesGrid.js';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RulesDetailsDialog from './RuleSetDetailsDialog.js';

function RulesView(props) {
  const [rules, setRules] = React.useState([]);
  const [selection, setSelection] = React.useState([]);
  const [rulesDetailsDialogOpen, setRulesDetailsDialogOpen] = React.useState(false);
  //const [templateRuleSet, setTemplateRuleSet] = React.useState({"name": "", "description": "", "source": "", "rules": []})  

  const templateRuleSet = {"name": "", "description": "", "source": "", "rules": []}

  async function onRefresh() {
    console.log("Clicked")
    const results = await DAW.listRules();
    setRules(results.ruleSets)
  } // onRefresh

  async function onDelete() {
    for (let i = 0; i < selection.length; i++) {
      await DAW.deleteRuleSet(selection[i])
    }
    onRefresh()
  } // onDelete

  function onSelectionChanged(selection) {
    setSelection(selection)
  } // onSelectionChanged

  /**
   * Called when a request to create a new rule has been clicked.
   */
  function onCreate() {
    setRulesDetailsDialogOpen(true)
  } // onCreate

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", rowGap: 1 }}>
      <RulesGrid rules={rules} onSelectionChanged={onSelectionChanged} />
      <Box sx={{ display: "flex", columnGap: 1 }}>
        <Button onClick={onDelete} variant="contained" disabled={selection.length === 0} endIcon={<DeleteForeverIcon />}>Delete</Button>
        <Button onClick={onCreate} variant="contained" endIcon={<AddCircleIcon />}>Create</Button>
        <Button onClick={onRefresh} variant="contained" endIcon={<RefreshIcon />}>Refresh</Button>
      </Box>
      <RulesDetailsDialog ruleSet={templateRuleSet} open={rulesDetailsDialogOpen} close={(newRuleSet) => {
        setRulesDetailsDialogOpen(false)
        if (newRuleSet) {
          DAW.createRuleSet(newRuleSet)
        }
      }} create={true}/>
    </Box>
  )
}

/*
RulesView.propTypes = {
}
*/

export default RulesView