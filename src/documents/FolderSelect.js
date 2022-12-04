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
import { TextField, MenuItem } from '@mui/material'
import PropTypes from 'prop-types';
import DAW from '../daw'

/**
 * Display a select textfield where the items are folders in DWH.  The format of the
 * visual of the menu item is "{displayName} ({documentId})".  The value of the menu item
 * is the document name of the format "projects/{projectNumber}/locations/{location}/documents/{documentId}".
 * 
 * The passed in props are:
 * * value - The current value to be shown.
 * * onChange - A callback to be invoked if the selection is changed.  The onChange function expects
 * the new value to be passed in the format "projects/{projectNumber}/locations/{location}/documents/{documentId}".
 * @param {*} props 
 * @returns JSX to be rendered.
 */
function FolderSelect(props) {
  const [folderDocuments, setFolderDocuments] = React.useState(null)

  function onChange(evt) {
    props.onChange(evt.target.value)
  } // onChange

  if (folderDocuments === null) {
    DAW.getFolderDocuments({clean: true}).then((result) => {setFolderDocuments(result)})
    return
  }
  const menuItemsComponents = [];
  folderDocuments.forEach((folderDocument, index) => {
    menuItemsComponents.push(
      <MenuItem key={index} value={folderDocument.name}>
        {`${folderDocument.displayName} (${DAW.getDocumentId(folderDocument.name)})`} 
      </MenuItem>
    )
  })

  return (
    <TextField
    sx={{flexGrow: 1}}
      select
      label="Folder"
      value={props.value}
      onChange={onChange}>
      {menuItemsComponents}
    </TextField>
  )
} // SchemaSelection

FolderSelect.propTypes = {
  "onChange": PropTypes.func.isRequired,
  "value": PropTypes.string.isRequired
}

export default FolderSelect