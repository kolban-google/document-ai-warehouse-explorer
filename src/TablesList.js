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
import { useEffect, useState } from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar, Button, List, ListItem, ListItemButton } from '@mui/material'
import BQ from './bq.js'
import PropTypes from 'prop-types';

function TablesList(props) {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [tables, setTables] = React.useState(null)

  useEffect(() => {
    if (props.tables !== undefined && props.tables !== null) {
      setTables(tables);
    } else {
      if (props.datasetId) {
        BQ.listTables(null, props.datasetId).then((tables) => setTables(tables))
      }
    }
  }, [props.datasetId])

  async function handleSelect(event, index) {
    setSelectedIndex(index)
  }

  return (

    <List dense>
      {
        tables !== null && tables.tables && tables.tables.map((table, index) => {
          return <ListItemButton
            selected={selectedIndex === index}
            onClick={(event) => handleSelect(event, index)}
            key={table.tableReference.tableId}>{table.tableReference.tableId}</ListItemButton>
        })
      }
    </List>
  )
} // EntityInfoDialog

TablesList.propTypes = {
  'datasetId': PropTypes.string.isRequired,
  'tables': PropTypes.object,
}

export default TablesList