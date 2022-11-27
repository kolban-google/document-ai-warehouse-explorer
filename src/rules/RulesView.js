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
import { Box, Button} from '@mui/material'
//import PropTypes from 'prop-types';
import RulesGrid from './RulesGrid.js';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';

function RulesView(props) {
  const [rules, setRules] = React.useState([]);
  const [selection, setSelection] = React.useState([]);

  async function onRefresh() {
    console.log("Clicked")
    const results = await DAW.listRules();
    setRules(results.ruleSets)
  } // onRefresh

  async function onDelete() {
    for (let i=0; i<selection.length; i++) {
      await DAW.deleteRuleSet(selection[i])
    }
    onRefresh()
  } // onDelete

  function onSelectionChanged(selection) {
    setSelection(selection)
  } // onSelectionChanged

  return (
    <Box>

      <p>Rules View</p>
      <Button onClick={onRefresh} variant="contained" endIcon={<RefreshIcon />}>Refresh</Button>
      <RulesGrid rules={rules} onSelectionChanged={onSelectionChanged}/>
      <Button onClick={onDelete} variant="contained" endIcon={<DeleteForeverIcon />}>Delete</Button>
    </Box>
  )
}

/*
RulesView.propTypes = {
}
*/

export default RulesView